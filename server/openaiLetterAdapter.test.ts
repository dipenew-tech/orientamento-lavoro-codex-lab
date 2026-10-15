import assert from "node:assert/strict";
import { test } from "node:test";
import OpenAI from "openai";
import { createOpenAILetterAdapter, type LetterClient } from "./openaiLetterAdapter.ts";
import type { OpenAILetterInput } from "./openaiLetterContract.ts";

const input: OpenAILetterInput = { jobCategory: "gardening", italianLevel: "basic",
  outputLanguage: "it", hasCooperativeContacts: true, includeSchoolsIntro: true };
const sections = {
  intro: "Puoi organizzare la ricerca nel settore del giardinaggio con piccoli passi regolari.",
  cooperativesIntro: "Prepara un curriculum chiaro con informazioni vere e consulta gli allegati per organizzare la ricerca.",
  schoolsIntro: "Praticare la lingua può aiutarti a comprendere gli annunci e organizzare la ricerca.",
  conclusion: "Procedi un passo alla volta e annota le attività svolte per il prossimo incontro.",
};
const env = { OPENAI_API_KEY: "synthetic-offline-key" };
type Reply = Awaited<ReturnType<LetterClient["responses"]["create"]>>;
const reply = (text = JSON.stringify(sections)): Reply => ({ status: "completed", output: [], output_text: text });
const factory = (create: LetterClient["responses"]["create"]) => () => ({ responses: { create } });

test("uses official SDK with fake fetch, structured Responses request and no secret in result", async () => {
  let requests = 0;
  const adapter = createOpenAILetterAdapter({ env, clientFactory: config => {
    assert.equal(config.maxRetries, 0);
    assert.equal(config.logLevel, "off");
    assert.equal(config.dangerouslyAllowBrowser, false);
    return new OpenAI({ ...config, fetch: async (url, init) => {
      requests++;
      assert.equal(String(url), "https://api.openai.com/v1/responses");
      const body = JSON.parse(String(init?.body));
      assert.deepEqual(JSON.parse(body.input), input);
      assert.equal(body.model, "gpt-4.1-mini");
      assert.equal(body.store, false);
      assert.equal(body.max_output_tokens, 1600);
      assert.equal(body.text.format.type, "json_schema");
      assert.equal(body.text.format.strict, true);
      assert.equal(body.text.format.schema.additionalProperties, false);
      assert.equal(body.tools, undefined);
      assert.ok(!JSON.stringify(body).includes(env.OPENAI_API_KEY));
      // The SDK adds output_text only for Responses API objects marked as response.
      return new Response(JSON.stringify({ object: "response", id: "resp_offline", status: "completed", output: [
        { type: "message", id: "msg_offline", role: "assistant", status: "completed",
          content: [{ type: "output_text", text: JSON.stringify(sections), annotations: [] }] },
      ] }), { headers: { "content-type": "application/json" } });
    } });
  } });
  assert.deepEqual(await adapter(input), { ok: true, sections });
  assert.equal(requests, 1);
});

test("missing key and invalid config never construct a client", async () => {
  const clientFactory = () => { throw new Error("must not construct"); };
  assert.deepEqual(await createOpenAILetterAdapter({ env: {}, clientFactory })(input), { ok: false, code: "missing_key" });
  assert.deepEqual(await createOpenAILetterAdapter({ env: { OPENAI_API_KEY: undefined, OPENAI_LETTER_MODEL: undefined }, clientFactory })(input), { ok: false, code: "missing_key" });
  assert.deepEqual(await createOpenAILetterAdapter({ env: { OPENAI_API_KEY: "   " }, clientFactory })(input), { ok: false, code: "missing_key" });
  for (const options of [{ env: { ...env, OPENAI_LETTER_MODEL: "unapproved" } }, { env, timeoutMs: 0 }, { env, timeoutMs: 30001 }]) {
    assert.deepEqual(await createOpenAILetterAdapter({ ...options, clientFactory })(input), { ok: false, code: "invalid_config" });
  }
});

test("classifies SDK timeout and network failures without retries or leaking details", async () => {
  for (const error of [new OpenAI.APIConnectionTimeoutError(), new Error("synthetic private detail")]) {
    const adapter = createOpenAILetterAdapter({ env, clientFactory: factory(async () => { throw error; }) });
    assert.deepEqual(await adapter(input), { ok: false, code: error instanceof OpenAI.APIConnectionTimeoutError ? "timeout" : "provider_error" });
  }
  let requests = 0;
  const adapter = createOpenAILetterAdapter({ env, clientFactory: config => new OpenAI({ ...config,
    fetch: async () => { requests++; throw new Error("synthetic transport failure"); },
  }) });
  assert.deepEqual(await adapter(input), { ok: false, code: "provider_error" });
  assert.equal(requests, 1);
});

test("rejects extra personal data, unknown categories, invalid types and accessors", async () => {
  let calls = 0;
  const adapter = createOpenAILetterAdapter({ env, clientFactory: factory(async () => { calls++; return reply(); }) });
  const accessor = { ...input };
  Object.defineProperty(accessor, "jobCategory", { get() { throw new Error("must not read"); } });
  for (const invalid of [{ ...input, recipientName: "Persona Fittizia" }, { ...input, jobCategory: "raw personal text" },
    { ...input, nationality: "unknown" }, { ...input, italianLevel: "unknown" },
    { ...input, outputLanguage: "unknown" }, { ...input, includeSchoolsIntro: "true" }, accessor, null]) {
    assert.deepEqual(await adapter(invalid as OpenAILetterInput), { ok: false, code: "invalid_input" });
  }
  assert.equal(calls, 0);
});

test("handles invalid, incomplete, refused and contact-bearing output", async () => {
  for (const response of [reply("{"), reply("{}"), reply(JSON.stringify({ ...sections, intro: "short" })),
    reply(JSON.stringify({ ...sections, conclusion: `${sections.conclusion} https://example.invalid` })),
    { ...reply(), status: "incomplete" }, { ...reply(), output: [{ type: "message", content: [{ type: "refusal", refusal: "synthetic" }] }] }]) {
    const adapter = createOpenAILetterAdapter({ env, clientFactory: factory(async () => response as Reply) });
    const result = await adapter(input);
    assert.equal(result.ok, false);
    if (!result.ok) assert.ok(["invalid_response", "refused"].includes(result.code));
  }
});

test("school narrative is null when absent and schema follows local context", async () => {
  const adapter = createOpenAILetterAdapter({ env, clientFactory: factory(async body => {
    const schema = body.text?.format;
    assert.equal(schema?.type, "json_schema");
    if (schema?.type === "json_schema") assert.deepEqual((schema.schema.properties as Record<string, unknown>).schoolsIntro, { type: "null" });
    return reply(JSON.stringify({ ...sections, schoolsIntro: null }));
  }) });
  assert.deepEqual(await adapter({ ...input, includeSchoolsIntro: false }), { ok: true, sections: { ...sections, schoolsIntro: null } });
});

test("sanitizes network, authentication, rate and construction errors without retries", async () => {
  for (const status of [401, 429, 500]) {
    let calls = 0;
    const adapter = createOpenAILetterAdapter({ env, clientFactory: factory(async () => {
      calls++; throw Object.assign(new Error(`secret ${env.OPENAI_API_KEY}`), { status });
    }) });
    assert.deepEqual(await adapter(input), { ok: false, code: "provider_error" });
    assert.equal(calls, 1);
  }
  const adapter = createOpenAILetterAdapter({ env, clientFactory: () => { throw new Error("sensitive"); } });
  assert.deepEqual(await adapter(input), { ok: false, code: "provider_error" });
  assert.deepEqual(await adapter(input), { ok: false, code: "provider_error" });
});

test("aborts timeout and keeps concurrency slot until pending call settles", async () => {
  let signal: AbortSignal | undefined;
  let finish!: (value: Reply) => void;
  const adapter = createOpenAILetterAdapter({ env, timeoutMs: 10, clientFactory: factory(async (_, options) => {
    signal = options.signal;
    return new Promise(resolve => { finish = resolve; });
  }) });
  assert.deepEqual(await adapter(input), { ok: false, code: "timeout" });
  assert.equal(signal?.aborted, true);
  assert.deepEqual(await adapter(input), { ok: false, code: "usage_limit" });
  finish(reply());
});

test("caps usage at ten calls per minute and allows calls after window expiry", async () => {
  let time = 0;
  let calls = 0;
  const adapter = createOpenAILetterAdapter({ env, now: () => time,
    clientFactory: factory(async () => { calls++; return reply(); }) });
  for (let n = 0; n < 10; n++) assert.equal((await adapter(input)).ok, true);
  assert.deepEqual(await adapter(input), { ok: false, code: "usage_limit" });
  assert.equal(calls, 10);
  time = 60000;
  assert.equal((await adapter(input)).ok, true);
});

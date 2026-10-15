import assert from "node:assert/strict";
import { test, before, after } from "node:test";
import { createLetterPersonalizer } from "./letterPersonalizer.ts";
import { createOpenAILetterAdapter, type AdapterResult } from "./openaiLetterAdapter.ts";
import { createGenerateLetterHandler } from "./generateLetterRoute.ts";
import type { GeneratedLetter, UserFormInputs } from "../src/types.ts";
import type { OpenAILetterInput } from "./openaiLetterContract.ts";
import type { Request, Response } from "express";
import { readFileSync } from "node:fs";

const form: UserFormInputs = { recipientName: "Persona Fittizia", gender: "F", nationality: "Italia",
  italianLevel: "Basso", jobSought: "Giardiniere", zoneResident: "Zona sintetica", zoneJobSought: "Zona fittizia", officinaOpportunity: true };
const ai = { intro: "Puoi organizzare la ricerca con piccoli passi e un obiettivo chiaro nel settore desiderato.",
  cooperativesIntro: "Prepara un curriculum chiaro con informazioni vere e consulta i riferimenti negli allegati per organizzare la ricerca.",
  schoolsIntro: "Praticare la lingua può aiutarti a comprendere gli annunci e affrontare la ricerca con maggiore autonomia.",
  conclusion: "Procedi un passo alla volta e annota le attività svolte per il prossimo incontro." };
const section = { greeting: "Cara Persona Fittizia,", intro: "Testo locale introduttivo.",
  cooperativesIntro: "Istruzioni locali su curriculum, candidatura Officina e allegati.",
  publicOfficesIntro: "Riferimenti istituzionali locali immutabili.", schoolsIntro: "Istruzioni corsi locali.", conclusion: "Conclusione locale." };
const base: GeneratedLetter = { letterTitle: "ORIENTAMENTO", subject: "Orientamento al lavoro per Giardiniere",
  recipientName: form.recipientName, italianLetter: section, hasTranslation: false, translationLanguage: "Inglese",
  cooperatives: [{ name: "Ente Fittizio", address: "Via Fittizia 12", phone: "000000000", hours: "Orario fittizio", description: "Dato locale" }],
  publicOffices: [{ type: "COL", name: "Ufficio Fittizio", address: "Via Esempio 2", phone: "000000001", hours: "Orario", description: "Locale" }],
  italianSchools: [{ name: "Scuola Fittizia", address: "Via Esempio 3", phone: "000000002", hours: "Orario", description: "Locale" }], officinaOpportunity: true, isLocalFallback: true };
const enabled = { OPENAI_LETTER_ENABLED: "true" };
const success = async (): Promise<AdapterResult> => ({ ok: true, sections: ai });
const originalFetch = globalThis.fetch;
let externalAttempts = 0;
before(() => { globalThis.fetch = async () => { externalAttempts++; throw new Error("External network forbidden in tests"); }; });
after(() => { globalThis.fetch = originalFetch; assert.equal(externalAttempts, 0); });

test("disabled by default and all non-explicit values never call provider", async () => {
  for (const flag of [undefined, "false", "TRUE", "1", ""]) {
    const personalize = createLetterPersonalizer({ env: { OPENAI_LETTER_ENABLED: flag }, generate: async () => { throw new Error("must not call"); } });
    const result = await personalize(base, form);
    assert.equal(result.fallbackReason, "disabled");
    assert.deepEqual(result.italianLetter, base.italianLetter);
  }
});

test("successful personalization sends only five minimal fields and preserves all local instructions and records", async () => {
  const original = JSON.stringify(base);
  const inputs: OpenAILetterInput[] = [];
  const personalize = createLetterPersonalizer({ env: enabled, generate: async input => { inputs.push(input); return success(); } });
  const result = await personalize(base, form);
  assert.deepEqual(inputs, [{ jobCategory: "gardening", italianLevel: "basic", outputLanguage: "it", hasCooperativeContacts: true, includeSchoolsIntro: true }]);
  assert.equal(result.isLocalFallback, false);
  for (const key of ["cooperatives", "publicOffices", "italianSchools"] as const) assert.equal(result[key], base[key]);
  assert.equal(result.italianLetter.greeting, section.greeting);
  assert.equal(result.italianLetter.publicOfficesIntro, section.publicOfficesIntro);
  for (const key of ["intro", "cooperativesIntro", "schoolsIntro", "conclusion"] as const) {
    assert.ok(result.italianLetter[key]?.includes(section[key]));
    assert.ok(result.italianLetter[key]?.includes(ai[key]));
  }
  assert.equal(JSON.stringify(base), original);
});

test("every adapter error and unexpected failure returns the entire local letter", async () => {
  for (const code of ["missing_key", "timeout", "circuit_open", "provider_error", "invalid_response", "invalid_input", "invalid_config", "usage_limit", "refused"] as const) {
    const result = await createLetterPersonalizer({ env: enabled, generate: async () => ({ ok: false, code }) })(base, form);
    assert.deepEqual(result, { ...base, isLocalFallback: true, fallbackReason: code });
  }
  const result = await createLetterPersonalizer({ env: enabled, generate: async () => { throw new Error("secret"); } })(base, form);
  assert.equal(result.fallbackReason, "provider_error");
  const noKey = createOpenAILetterAdapter({ env: {}, clientFactory: () => { throw new Error("must not construct"); } });
  assert.equal((await createLetterPersonalizer({ env: enabled, generate: noKey })(base, form)).fallbackReason, "missing_key");
});

test("multilingual composition is atomic and preserves both local languages", async () => {
  const bilingual = { ...base, hasTranslation: true, translationLanguage: "Spagnolo", translatedLetter: { ...section, greeting: "Saludo local" } };
  const languages: string[] = [];
  const result = await createLetterPersonalizer({ env: enabled, generate: async input => { languages.push(input.outputLanguage); return success(); } })(bilingual, form);
  assert.deepEqual(languages, ["it", "es"]);
  assert.equal(result.translatedLetter?.greeting, "Saludo local");
  let count = 0;
  const failed = await createLetterPersonalizer({ env: enabled, generate: async () => ++count === 1 ? success() : { ok: false, code: "timeout" } })(bilingual, form);
  assert.deepEqual(failed.italianLetter, bilingual.italianLetter);
  assert.deepEqual(failed.translatedLetter, bilingual.translatedLetter);
});

test("quota, concurrency, unknown jobs, missing schools and invalid narratives fail safely", async () => {
  const personalize = createLetterPersonalizer({ env: { ...enabled, OPENAI_LETTER_MAX_CALLS: "1" }, generate: success });
  assert.equal((await personalize(base, form)).isLocalFallback, false);
  assert.equal((await personalize(base, form)).fallbackReason, "usage_limit");
  assert.equal((await createLetterPersonalizer({ env: { ...enabled, OPENAI_LETTER_MAX_CALLS: "999" }, generate: success })(base, form)).fallbackReason, "invalid_config");
  let release!: (result: AdapterResult) => void;
  const concurrent = createLetterPersonalizer({ env: enabled, generate: async () => new Promise(resolve => { release = resolve; }) });
  const pending = concurrent(base, form);
  assert.equal((await concurrent(base, form)).fallbackReason, "usage_limit");
  release(await success()); await pending;
  const withoutSchools = { ...base, italianSchools: [], italianLetter: { ...section, schoolsIntro: undefined } };
  const result = await createLetterPersonalizer({ env: enabled, generate: async input => {
    assert.equal(input.jobCategory, "other"); assert.equal(input.includeSchoolsIntro, false);
    return { ok: true, sections: { ...ai, schoolsIntro: null } };
  } })(withoutSchools, { ...form, jobSought: "testo personale da non inviare" });
  assert.equal(result.italianLetter.schoolsIntro, undefined);
  assert.equal((await createLetterPersonalizer({ env: enabled, generate: async () => ({ ok: true, sections: { ...ai, intro: "short" } }) })(base, form)).fallbackReason, "invalid_response");
});

test("actual Express route handler preserves response contract and logs correct fallback flag", async () => {
  for (const generate of [success, async (): Promise<AdapterResult> => ({ ok: false, code: "timeout" })]) {
    const records: unknown[] = [];
    const handler = createGenerateLetterHandler({ generateLocalFallback: () => base,
      personalizeLetter: createLetterPersonalizer({ env: enabled, generate }),
      detectLanguageInfo: () => ({ language: "Italiano", isMissing: false }),
      sendMissingLanguageEmail: async () => { throw new Error("unexpected SMTP"); },
      sendSilentEmail: async () => { throw new Error("unexpected SMTP"); }, recordStat: record => records.push(record) });
    let status = 200;
    let body: GeneratedLetter | undefined;
    const response = { status(code: number) { status = code; return this; }, json(value: GeneratedLetter) { body = value; return this; } };
    await handler({ body: form } as Request, response as unknown as Response, () => {});
    assert.equal(status, 200); assert.ok(body);
    assert.deepEqual(body.cooperatives, base.cooperatives);
    assert.equal(records.length, 1);
    assert.equal((records[0] as { isLocalFallback: boolean }).isLocalFallback, body.isLocalFallback);
    await handler({ body: { ...form, jobSought: {} } } as Request, response as unknown as Response, () => {});
    assert.equal(status, 400); assert.equal(records.length, 1);
  }
});

test("unsupported translation and insufficient bilingual quota never start a partial generation", async () => {
  let calls = 0;
  const generate = async () => { calls++; return success(); };
  const bilingual = { ...base, hasTranslation: true, translationLanguage: "Spagnolo", translatedLetter: section };
  const limited = createLetterPersonalizer({ env: { ...enabled, OPENAI_LETTER_MAX_CALLS: "1" }, generate });
  assert.equal((await limited(bilingual, form)).fallbackReason, "usage_limit");
  const normal = createLetterPersonalizer({ env: enabled, generate });
  assert.equal((await normal({ ...bilingual, translationLanguage: "Lingua non riconosciuta" }, form)).fallbackReason, "unsupported_translation");
  assert.equal(calls, 0);
});

test("errors consume lifetime quota and an injected malformed response cannot alter local data", async () => {
  let calls = 0;
  const limited = createLetterPersonalizer({ env: { ...enabled, OPENAI_LETTER_MAX_CALLS: "2" },
    generate: async () => { calls++; return { ok: false, code: "provider_error" }; } });
  await limited(base, form); await limited(base, form);
  assert.equal((await limited(base, form)).fallbackReason, "usage_limit");
  assert.equal(calls, 2);
  const guarded = createLetterPersonalizer({ env: enabled, generate: async () => ({ ok: true,
    sections: { ...ai, recipientName: "invented" } } as unknown as AdapterResult) });
  const result = await guarded(base, form);
  assert.equal(result.fallbackReason, "invalid_response");
  assert.equal(result.recipientName, base.recipientName);
  assert.equal(result.cooperatives, base.cooperatives);
});

test("real local generator, editor rendering and Word export remain compatible", async () => {
  // Dynamic imports keep the strict check of the new isolated modules independent
  // of the documented pre-existing generator typing errors.
  const generatorPath = "../src/lib/fallbackGenerator.ts";
  const editorPath = "../src/components/LetterEditor.tsx";
  const wordPath = "../src/lib/wordGenerator.ts";
  const { generateLocalFallback } = await import(generatorPath);
  const local: GeneratedLetter = generateLocalFallback(form);
  const result = await createLetterPersonalizer({ env: enabled, generate: success })(local, form);
  assert.equal(result.isLocalFallback, false);
  assert.deepEqual(result.cooperatives, local.cooperatives);
  assert.deepEqual(result.publicOffices, local.publicOffices);
  // Legacy React modules have no declaration packages in the existing project.
  const reactPath: string = "react";
  const rendererPath: string = "react-dom/server";
  const { default: React } = await import(reactPath);
  const { renderToStaticMarkup } = await import(rendererPath);
  const { default: LetterEditor } = await import(editorPath);
  assert.ok(renderToStaticMarkup(React.createElement(LetterEditor, { initialLetter: result, onReset() {} })).includes(form.recipientName));
  const { generateWordDocument } = await import(wordPath);
  const blob: Blob = await generateWordDocument(result);
  assert.ok(blob.size > 0);
  const appSource = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
  assert.ok(!appSource.includes("data.isLocalFallback = false"));
  const serverSource = readFileSync(new URL("../server.ts", import.meta.url), "utf8");
  assert.ok(serverSource.includes('app.post("/api/generate-letter", createGenerateLetterHandler('));
});

import assert from "node:assert/strict";
import { test } from "node:test";
import {
  MAX_OUTPUT_BYTES,
  SECTION_LENGTHS,
  parseOpenAILetterSections,
  validateOpenAILetterSections,
  type OpenAILetterInput,
  type OpenAILetterSections,
} from "./openaiLetterContract.ts";

const input: OpenAILetterInput = {
  jobCategory: "gardening",
  italianLevel: "basic",
  outputLanguage: "it",
  hasCooperativeContacts: true,
  includeSchoolsIntro: true,
};
const sample: OpenAILetterSections = {
  intro: "Puoi orientare la ricerca nel settore del giardinaggio con piccoli passi regolari.",
  cooperativesIntro: "Prepara un curriculum chiaro con informazioni vere e consulta i riferimenti negli allegati per organizzare la ricerca.",
  schoolsIntro: "Un corso di italiano può aiutarti a comprendere gli annunci e comunicare durante la ricerca.",
  conclusion: "Procedi un passo alla volta e annota le attività svolte per il prossimo incontro.",
};

test("accepts synthetic narratives without mutating them", () => {
  const original = Object.freeze({ ...sample });
  const result = validateOpenAILetterSections(original, input);
  assert.equal(result.valid, true);
  if (result.valid) {
    assert.deepEqual(result.sections, sample);
    assert.notEqual(result.sections, original);
  }
});

test("requires exactly four own data fields", () => {
  for (const value of [null, [], "text", 42, {}, new Date(), Object.create(sample)]) {
    assert.equal(validateOpenAILetterSections(value, input).valid, false);
  }
  for (const key of Object.keys(sample)) {
    const missing = { ...sample };
    delete missing[key as keyof OpenAILetterSections];
    assert.equal(validateOpenAILetterSections(missing, input).valid, false);
  }
  for (const extra of ["greeting", "recipientName", "publicOffices", "address"]) {
    assert.equal(validateOpenAILetterSections({ ...sample, [extra]: "invented" }, input).valid, false);
  }
  assert.equal(validateOpenAILetterSections({ ...sample, [Symbol("extra")]: true }, input).valid, false);
  const accessor = { ...sample };
  Object.defineProperty(accessor, "intro", { get() { throw new Error("Must not be read"); } });
  assert.equal(validateOpenAILetterSections(accessor, input).valid, false);
});

test("validates types and normalized length boundaries for every field", () => {
  for (const key of Object.keys(SECTION_LENGTHS) as (keyof OpenAILetterSections)[]) {
    const { min, max } = SECTION_LENGTHS[key];
    for (const length of [min, max]) {
      assert.equal(validateOpenAILetterSections({ ...sample, [key]: "a".repeat(length) }, input).valid, true);
    }
    for (const value of ["a".repeat(min - 1), "a".repeat(max + 1), "   ", "", null, 42, [], {}]) {
      assert.equal(validateOpenAILetterSections({ ...sample, [key]: value }, input).valid, false);
    }
  }
  const maximum = Object.fromEntries(Object.entries(SECTION_LENGTHS).map(([key, { max }]) => [key, "a".repeat(max)]));
  assert.equal(validateOpenAILetterSections(maximum, input).valid, true);
});

test("normalizes NFC, trims and counts Unicode code points", () => {
  const result = validateOpenAILetterSections({ ...sample, intro: `  ${"e\u0301".repeat(40)}  ` }, input);
  assert.equal(result.valid, true);
  if (result.valid) assert.equal(result.sections.intro, "é".repeat(40));
  assert.equal(validateOpenAILetterSections({ ...sample, intro: "🌱".repeat(40) }, input).valid, true);
  assert.equal(validateOpenAILetterSections({ ...sample, intro: "🌱".repeat(39) }, input).valid, false);
});

test("requires a school narrative only when requested", () => {
  const withoutSchools = { ...input, includeSchoolsIntro: false };
  assert.equal(validateOpenAILetterSections({ ...sample, schoolsIntro: null }, withoutSchools).valid, true);
  assert.equal(validateOpenAILetterSections(sample, withoutSchools).valid, false);
  assert.equal(validateOpenAILetterSections({ ...sample, schoolsIntro: null }, input).valid, false);
  assert.equal(validateOpenAILetterSections(sample, { includeSchoolsIntro: undefined } as unknown as OpenAILetterInput).valid, false);
});

test("rejects obvious HTML, Markdown and control characters in all sections", () => {
  const fragments = ["<b>testo</b>", "**testo**", "_testo_", "`testo`", "~~testo~~", "[testo](destinazione)", "\n# Titolo", "\n- elemento", "\n1. elemento", "\n---", "\n| a | b |", "\u0000"];
  for (const key of Object.keys(sample)) {
    for (const fragment of fragments) {
      assert.equal(validateOpenAILetterSections({ ...sample, [key]: `${sample[key as keyof OpenAILetterSections]} ${fragment}` }, input).valid, false, fragment);
    }
  }
});

test("rejects evident email, URLs, phone numbers and numbered addresses", () => {
  const fragments = ["fittizio@example.invalid", "https://example.invalid", "www.example.invalid", "example.it", "+39 06 1234 5678", "0612345678", "Via Esempio 12", "Piazza Fittizia 8", "12 Example Street", "00100"];
  for (const key of Object.keys(sample)) {
    for (const fragment of fragments) {
      assert.equal(validateOpenAILetterSections({ ...sample, [key]: `${sample[key as keyof OpenAILetterSections]} ${fragment}` }, input).valid, false, fragment);
    }
  }
});

test("accepts ordinary prose and short numeric advice", () => {
  assert.equal(validateOpenAILetterSections({ ...sample, intro: "Dedica 2 ore alla ricerca e consulta gli annunci ogni 1-2 giorni, con un obiettivo chiaro." }, input).valid, true);
});

test("parses JSON with a byte limit and rejects malformed or fenced output", () => {
  assert.equal(parseOpenAILetterSections(JSON.stringify(sample), input).valid, true);
  for (const json of ["{", "null", "[]", `\`\`\`json\n${JSON.stringify(sample)}\n\`\`\``, " ".repeat(MAX_OUTPUT_BYTES + 1), "é".repeat(MAX_OUTPUT_BYTES / 2 + 1)]) {
    assert.equal(parseOpenAILetterSections(json, input).valid, false);
  }
});

test("oversized raw text is rejected before normalization", () => {
  assert.equal(validateOpenAILetterSections({ ...sample, intro: " ".repeat(MAX_OUTPUT_BYTES + 1) + sample.intro }, input).valid, false);
});

test("syntax validation deliberately does not certify factual accuracy", () => {
  const unsupported = { ...sample, intro: "Hai una qualifica e anni di esperienza presso la Cooperativa Fittizia Aurora." };
  assert.equal(validateOpenAILetterSections(unsupported, input).valid, true);
});

/**
 * Backend-only narrative contract. Do not import this module from frontend code.
 * No recipient identifiers, territorial records or operational statements belong
 * in this contract. Successful validation does NOT establish factual accuracy:
 * names, qualifications, experience and job offers still require semantic review.
 */
import { Buffer } from "node:buffer";

export type OpenAIJobCategory =
  | "care" | "cleaning" | "logistics" | "kitchen_support"
  | "pizza_making" | "cooking" | "construction" | "caretaking"
  | "hospitality" | "gardening" | "office_support" | "driving" | "other";

export type OpenAILanguage =
  | "it" | "en" | "es" | "ro" | "uk" | "fr" | "ar" | "si"
  | "pl" | "sq" | "bn" | "sr" | "bs" | "bg" | "hr" | "tl"
  | "ka" | "mk" | "cs" | "so" | "sw" | "tr" | "hi";

export interface OpenAILetterInput {
  jobCategory: OpenAIJobCategory;
  italianLevel: "none" | "basic" | "intermediate" | "advanced";
  outputLanguage: OpenAILanguage;
  hasCooperativeContacts: boolean;
  includeSchoolsIntro: boolean;
}

export interface OpenAILetterSections {
  intro: string;
  cooperativesIntro: string;
  schoolsIntro: string | null;
  conclusion: string;
}

export type LetterValidationResult =
  | { valid: true; sections: OpenAILetterSections }
  | { valid: false; reason: string };

export const SECTION_LENGTHS = {
  intro: { min: 40, max: 900 },
  cooperativesIntro: { min: 60, max: 1800 },
  schoolsIntro: { min: 40, max: 700 },
  conclusion: { min: 30, max: 600 },
} as const;

export const MAX_TOTAL_CHARACTERS = 4000;
export const MAX_OUTPUT_BYTES = 32 * 1024;

const KEYS = ["intro", "cooperativesIntro", "schoolsIntro", "conclusion"] as const;

// Conservative syntax checks, not a general Markdown parser or semantic filter.
const MARKUP = /<[^>]*>|[<>`*]|_{2,}|~{2,}|!?\[[^\]]*\]\s*(?:\([^)]*\)|\[[^\]]*\])|^\s{0,3}(?:#{1,6}(?:\s|$)|>|[-+]\s|\d+[.)]\s)|^\s*(?:-{3,}|={3,}|\|.*\|)\s*$|\[[^\]]+\]:\s*\S+/m;
const EMPHASIS = /(?:^|\s)_[^\n]+?_(?=\s|[.,;:!?]|$)/;
const EMAIL = /[^\s@]+@[^\s@]+/;
const URL = /(?:[a-z][a-z0-9+.-]*:\/\/|www\.|\b[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9-]+)*\.(?:it|com|org|net|eu|io|gov|edu)\b)/i;
const PHONE = /(?:\+?\d[\s()./-]*){7,}/;
const ADDRESS = /\b(?:via|viale|vicolo|piazza|piazzale|corso|largo|street|road|avenue)\s+[^\n,;]{0,60}?\b\d+[a-z]?\b|\b\d+\s+[^\n,;]{1,60}\b(?:street|road|avenue)\b|\b\d{5}\b/i;
const CONTROL_CHARACTERS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;

function invalid(reason: string): LetterValidationResult {
  return { valid: false, reason };
}

/**
 * Accepts only plain data objects (as obtained from JSON.parse), returns a new
 * normalized object and never mutates the input. A caller must discard invalid
 * output and retain the locally generated letter; this module does not generate
 * a letter, alter territorial arrays, or perform network requests.
 */
export function validateOpenAILetterSections(
  value: unknown,
  input: Pick<OpenAILetterInput, "includeSchoolsIntro">,
): LetterValidationResult {
  if (typeof input?.includeSchoolsIntro !== "boolean") {
    return invalid("Invalid school-section context");
  }
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return invalid("Expected a narrative object");
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) {
    return invalid("Expected a plain narrative object");
  }
  const ownKeys = Reflect.ownKeys(value);
  if (ownKeys.length !== KEYS.length || KEYS.some(key => !ownKeys.includes(key))) {
    return invalid("Expected exactly the four narrative fields");
  }

  const normalized: Record<string, string | null> = {};
  let total = 0;
  for (const key of KEYS) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (!descriptor || !("value" in descriptor)) {
      return invalid(`Expected a data field: ${key}`);
    }
    const raw: unknown = descriptor.value;
    if (key === "schoolsIntro" && !input.includeSchoolsIntro) {
      if (raw !== null) return invalid("schoolsIntro must be null when not requested");
      normalized[key] = null;
      continue;
    }
    if (typeof raw !== "string") return invalid(`Expected a string: ${key}`);
    if (Buffer.byteLength(raw, "utf8") > MAX_OUTPUT_BYTES) {
      return invalid(`Section exceeds the byte limit: ${key}`);
    }
    const text = raw.normalize("NFC").trim();
    const length = Array.from(text).length;
    const limits = SECTION_LENGTHS[key];
    if (length < limits.min || length > limits.max) {
      return invalid(`Invalid section length: ${key}`);
    }
    if (CONTROL_CHARACTERS.test(text) || MARKUP.test(text) || EMPHASIS.test(text)) {
      return invalid(`Expected plain text: ${key}`);
    }
    if (EMAIL.test(text) || URL.test(text) || PHONE.test(text) || ADDRESS.test(text)) {
      return invalid(`Contact details are not allowed: ${key}`);
    }
    normalized[key] = text;
    total += length;
  }
  if (total > MAX_TOTAL_CHARACTERS) return invalid("Total narrative length exceeded");
  return {
    valid: true,
    sections: {
      intro: normalized.intro as string,
      cooperativesIntro: normalized.cooperativesIntro as string,
      schoolsIntro: normalized.schoolsIntro,
      conclusion: normalized.conclusion as string,
    },
  };
}

/** Apply a byte limit before parsing an untrusted provider response. */
export function parseOpenAILetterSections(
  json: string,
  input: Pick<OpenAILetterInput, "includeSchoolsIntro">,
): LetterValidationResult {
  if (typeof json !== "string" || Buffer.byteLength(json, "utf8") > MAX_OUTPUT_BYTES) {
    return invalid("Invalid or oversized JSON response");
  }
  try {
    return validateOpenAILetterSections(JSON.parse(json), input);
  } catch {
    return invalid("Invalid JSON response");
  }
}

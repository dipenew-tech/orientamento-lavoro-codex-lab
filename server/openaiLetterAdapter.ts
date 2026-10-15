/** Server-only. No application endpoint imports this adapter yet. */
import OpenAI, { type ClientOptions } from "openai";
import type { ResponseCreateParamsNonStreaming, Response } from "openai/resources/responses/responses";
import {
  parseOpenAILetterSections,
  type OpenAILetterInput,
  type OpenAILetterSections,
} from "./openaiLetterContract.ts";

type Code = "invalid_input" | "missing_key" | "invalid_config" | "usage_limit"
  | "timeout" | "provider_error" | "invalid_response" | "refused";
export type AdapterResult = { ok: true; sections: OpenAILetterSections }
  | { ok: false; code: Code };

type ProviderResponse = Pick<Response, "status" | "output" | "output_text">;
export interface LetterClient {
  responses: {
    create(body: ResponseCreateParamsNonStreaming, options: { signal: AbortSignal }): Promise<ProviderResponse>;
  };
}

const JOBS = ["care", "cleaning", "logistics", "kitchen_support", "pizza_making", "cooking", "construction", "caretaking", "hospitality", "gardening", "office_support", "driving", "other"];
const LANGUAGES = ["it", "en", "es", "ro", "uk", "fr", "ar", "si", "pl", "sq", "bn", "sr", "bs", "bg", "hr", "tl", "ka", "mk", "cs", "so", "sw", "tr", "hi"];
const LEVELS = ["none", "basic", "intermediate", "advanced"];
const FIELDS = ["jobCategory", "italianLevel", "outputLanguage", "hasCooperativeContacts", "includeSchoolsIntro"] as const;

function minimalInput(value: OpenAILetterInput): OpenAILetterInput | null {
  if (!value || typeof value !== "object" || Object.getPrototypeOf(value) !== Object.prototype) return null;
  const keys = Reflect.ownKeys(value);
  if (keys.length !== FIELDS.length || FIELDS.some(key => !keys.includes(key))) return null;
  for (const key of FIELDS) {
    if (!("value" in (Object.getOwnPropertyDescriptor(value, key) ?? {}))) return null;
  }
  if (!JOBS.includes(value.jobCategory) || !LANGUAGES.includes(value.outputLanguage)
    || !LEVELS.includes(value.italianLevel) || typeof value.hasCooperativeContacts !== "boolean"
    || typeof value.includeSchoolsIntro !== "boolean") return null;
  return { jobCategory: value.jobCategory, italianLevel: value.italianLevel,
    outputLanguage: value.outputLanguage, hasCooperativeContacts: value.hasCooperativeContacts,
    includeSchoolsIntro: value.includeSchoolsIntro };
}

const INSTRUCTIONS = `Write narrative sections of an employment ORIENTATION letter, never a job application.
Use only the categorical input. Write in outputLanguage, with wording suitable for italianLevel.
Return plain prose, no Markdown, numbering, greetings, titles or placeholders.
intro: welcoming advice, 40-900 Unicode characters.
cooperativesIntro: truthful CV and job-search advice, 60-1800 characters; refer generically to attachments only when hasCooperativeContacts is true.
schoolsIntro: 40-700 characters of language-learning encouragement only when includeSchoolsIntro is true; otherwise null.
conclusion: encouragement, 30-600 characters. Total at most 4000 characters.
Never name institutions, schools, companies, websites, people or specific opportunities.
Never give addresses, email, telephone numbers, links or other contact details.
Never claim the person has experience, qualifications, skills, registrations or appointments.
Never claim jobs are available, applications were sent, or promise assistance or results.
Use suggestions, not assertions about the person's history. Keep all operational and territorial information out of these sections.`;

/**
 * Create once per backend process, not per request. The injected factory is for
 * offline tests. Model/configuration are server-only; never accept them from HTTP.
 * Syntax checks cannot guarantee factual accuracy; operator review remains needed.
 */
export function createOpenAILetterAdapter(options: {
  env?: { OPENAI_API_KEY?: string; OPENAI_LETTER_MODEL?: string };
  clientFactory?: (options: ClientOptions) => LetterClient;
  timeoutMs?: number;
  now?: () => number;
} = {}) {
  const env = options.env ?? process.env;
  const key = env.OPENAI_API_KEY?.trim();
  const model = env.OPENAI_LETTER_MODEL ?? "gpt-4.1-mini";
  const timeoutMs = options.timeoutMs ?? 15000;
  const configured = ["gpt-4.1-mini", "gpt-4.1-mini-2025-04-14"].includes(model)
    && Number.isInteger(timeoutMs) && timeoutMs >= 1 && timeoutMs <= 30000;
  const now = options.now ?? Date.now;
  let client: LetterClient | undefined;
  let busy = false;
  let calls: number[] = [];

  return async function generate(input: OpenAILetterInput): Promise<AdapterResult> {
    const safeInput = minimalInput(input);
    if (!safeInput) return { ok: false, code: "invalid_input" };
    if (!key) return { ok: false, code: "missing_key" };
    if (!configured) return { ok: false, code: "invalid_config" };
    const time = now();
    calls = calls.filter(timestamp => time - timestamp < 60000);
    if (busy || calls.length >= 10) return { ok: false, code: "usage_limit" };
    calls.push(time);
    busy = true;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      client ??= (options.clientFactory ?? (config => new OpenAI(config)))({
        apiKey: key, baseURL: "https://api.openai.com/v1", timeout: timeoutMs,
        maxRetries: 0, logLevel: "off", dangerouslyAllowBrowser: false,
      });
      const body: ResponseCreateParamsNonStreaming = {
        model, instructions: INSTRUCTIONS, input: JSON.stringify(safeInput),
        store: false, stream: false, max_output_tokens: 1600,
        text: { format: { type: "json_schema", name: "orientation_letter_sections", strict: true,
          schema: { type: "object", additionalProperties: false,
            required: ["intro", "cooperativesIntro", "schoolsIntro", "conclusion"],
            properties: { intro: { type: "string" }, cooperativesIntro: { type: "string" },
              schoolsIntro: safeInput.includeSchoolsIntro ? { type: "string" } : { type: "null" },
              conclusion: { type: "string" } } } } },
      };
      const pending = Promise.resolve().then(() => client!.responses.create(body, { signal: controller.signal }));
      // Keep the concurrency slot until the request settles, even after timeout.
      void pending.then(() => { busy = false; }, () => { busy = false; });
      const response = await Promise.race([
        pending,
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => { controller.abort(); reject(new Error("timeout")); }, timeoutMs);
        }),
      ]);
      if (response.status !== "completed" || !Array.isArray(response.output)) return { ok: false, code: "invalid_response" };
      if (response.output.some(item => item.type === "message" && item.content.some(part => part.type === "refusal"))) {
        return { ok: false, code: "refused" };
      }
      const parsed = parseOpenAILetterSections(response.output_text, safeInput);
      return parsed.valid ? { ok: true, sections: parsed.sections } : { ok: false, code: "invalid_response" };
    } catch (error) {
      if (!client) busy = false;
      return { ok: false, code: controller.signal.aborted || error instanceof OpenAI.APIConnectionTimeoutError ? "timeout" : "provider_error" };
    } finally {
      if (timer) clearTimeout(timer);
    }
  };
}

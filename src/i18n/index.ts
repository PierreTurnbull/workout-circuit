import type { ExerciseGroup } from "../types";
import { en } from "./en";
import { fr } from "./fr";
import type { ExerciseGuide } from "./guides/types";
import type { Messages } from "./types";

export type Locale = "en" | "fr";
export type LocalePreference = Locale | "auto";

const LOCALE_STORAGE_KEY = "workout-circuit-locale";
const locales: Record<Locale, Messages> = { en, fr };

function detectBrowserLocale(): Locale {
  const language = navigator.language.toLowerCase();
  if (language.startsWith("fr")) return "fr";
  return "en";
}

function readStoredPreference(): LocalePreference | null {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored === "en" || stored === "fr" || stored === "auto") return stored;
  } catch {
    // localStorage may be unavailable in private mode or restricted contexts.
  }
  return null;
}

function resolveLocaleFromPreference(preference: LocalePreference): Locale {
  return preference === "auto" ? detectBrowserLocale() : preference;
}

let localePreference: LocalePreference = readStoredPreference() ?? "auto";
let currentLocale: Locale = resolveLocaleFromPreference(localePreference);
let messages: Messages = locales[currentLocale];

export function getLocale(): Locale {
  return currentLocale;
}

export function getLocalePreference(): LocalePreference {
  return localePreference;
}

export function setLocalePreference(preference: LocalePreference): void {
  localePreference = preference;
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, preference);
  } catch {
    // Ignore write failures; the in-memory preference still applies this session.
  }
  currentLocale = resolveLocaleFromPreference(preference);
  messages = locales[currentLocale];
  applyDocumentLocale();
}

export function applyDocumentLocale(): void {
  document.documentElement.lang = currentLocale;
  document.title = messages.appTitle;

  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.setAttribute("content", messages.appDescription);
  }
}

function interpolate(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(params[key] ?? `{${key}}`));
}

export function tExercise(exerciseId: string): string {
  return messages.exercises[exerciseId] ?? exerciseId;
}

export function tExerciseGuide(exerciseId: string): ExerciseGuide | null {
  return messages.guides[exerciseId] ?? null;
}

export function tGroup(group: ExerciseGroup): string {
  return messages.groups[group];
}

export function tGeneratorDuration(minutes: number): string {
  return interpolate(messages.generator.durationMin, { minutes });
}

export function tEstimatedMinutes(minutes: number): string {
  return interpolate(messages.generator.estimatedMinutes, { minutes });
}

export function tRoundBadge(current: number, total: number): string {
  return interpolate(messages.runner.round, { current, total });
}

export function tRestNextRound(round: number): string {
  return interpolate(messages.runner.restNextRound, { round });
}

export function tStoppedAt(round: number, exercise: string): string {
  return interpolate(messages.completion.stoppedAtValue, { round, exercise });
}

export function tRoundsCompleted(completed: number, total: number): string {
  return interpolate(messages.completion.roundsOf, { completed, total });
}

export function tRecapRounds(count: number): string {
  if (count <= 0) return messages.completion.plannedCircuit;
  const template = count === 1 ? messages.completion.round : messages.completion.rounds;
  return interpolate(template, { count });
}

export { messages };

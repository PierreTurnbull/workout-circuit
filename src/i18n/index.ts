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

export function tRoundBadge(current: number, total: number): string {
  return interpolate(messages.runner.round, { current, total });
}

export function tRestNextRound(round: number): string {
  return interpolate(messages.runner.restNextRound, { round });
}

/** Label for the current side of a multi-side exercise (0-based index). */
export function tSideLabel(sideIndex: number, sides: number): string {
  if (sides === 2) {
    return sideIndex === 0 ? messages.sides.left : messages.sides.right;
  }
  return interpolate(messages.sides.sideOf, {
    current: sideIndex + 1,
    total: sides,
  });
}

export function tStoppedAt(round: number, exercise: string): string {
  return interpolate(messages.completion.stoppedAtValue, { round, exercise });
}

export function tRoundsCompleted(completed: number, total: number): string {
  return interpolate(messages.completion.roundsOf, { completed, total });
}

export function tRecapRounds(count: number): string {
  const template = count === 1 ? messages.completion.round : messages.completion.rounds;
  return interpolate(template, { count });
}

export function formatHistoryDate(timestamp: number): string {
  return new Intl.DateTimeFormat(currentLocale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

export function formatHistoryDateShort(timestamp: number): string {
  return new Intl.DateTimeFormat(currentLocale, {
    day: "numeric",
    month: "short",
  }).format(new Date(timestamp));
}

export function formatDurationShort(ms: number): string {
  const totalMinutes = Math.max(1, Math.round(ms / 60_000));
  if (totalMinutes < 60) return `${totalMinutes}m`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes > 0 ? `${hours}h${minutes}` : `${hours}h`;
}

export function tHistoryListMeta(
  duration: string,
  roundsCompleted: number,
  plannedRounds: number,
): string {
  return interpolate(messages.history.listMeta, {
    duration,
    rounds: tRoundsCompleted(roundsCompleted, plannedRounds),
  });
}

export function tEffortScore(score: number): string {
  return interpolate(messages.history.effort, { score });
}

export function tWeekStreak(count: number): string {
  const template = count === 1 ? messages.history.weekStreak : messages.history.weekStreaks;
  return interpolate(template, { count });
}

export function tWeeklyAverage(count: number): string {
  return interpolate(messages.history.weeklyAverage, { count });
}

export function tHistorySummary(
  duration: string,
  roundsCompleted: number,
  plannedRounds: number,
): string {
  return interpolate(messages.history.summary, {
    duration,
    rounds: tRoundsCompleted(roundsCompleted, plannedRounds),
  });
}

export function tHistoryDetailSubtitle(finishedEarly: boolean, date: string): string {
  const template = finishedEarly
    ? messages.history.detailSubtitleEarly
    : messages.history.detailSubtitle;
  return interpolate(template, { date });
}

export { messages };

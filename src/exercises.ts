import type { Exercise, ExerciseGroup, QuantityType } from "./types";
import { getLocale, tExercise, tGroup } from "./i18n";

export const DEFAULT_EXERCISE_ID = "squats";

const GROUP_ORDER: ExerciseGroup[] = ["cardio", "lower", "upper", "core", "finisher"];

export const EXERCISES: Exercise[] = [
  { id: "bear-crawl", group: "cardio", quantityType: "duration" },
  { id: "butt-kicks", group: "cardio", quantityType: "duration" },
  { id: "crab-walk", group: "cardio", quantityType: "duration" },
  { id: "cross-jacks", group: "cardio", quantityType: "duration" },
  { id: "fast-feet", group: "cardio", quantityType: "duration" },
  { id: "high-knees", group: "cardio", quantityType: "duration" },
  { id: "inchworms", group: "cardio", quantityType: "reps" },
  { id: "jumping-jacks", group: "cardio", quantityType: "duration" },
  { id: "lateral-hops", group: "cardio", quantityType: "duration" },
  { id: "marching-in-place", group: "cardio", quantityType: "duration" },
  { id: "mountain-climbers", group: "cardio", quantityType: "duration" },
  { id: "punch-jacks", group: "cardio", quantityType: "duration" },
  { id: "side-shuffles", group: "cardio", quantityType: "duration" },
  { id: "skaters", group: "cardio", quantityType: "duration" },
  { id: "squat-to-overhead-reach", group: "cardio", quantityType: "reps" },
  { id: "toe-taps", group: "cardio", quantityType: "duration" },
  { id: "calf-raises", group: "lower", quantityType: "reps" },
  { id: "curtsy-lunges", group: "lower", quantityType: "reps" },
  { id: "fire-hydrants", group: "lower", quantityType: "reps" },
  { id: "front-lunges", group: "lower", quantityType: "reps" },
  { id: "glute-bridges", group: "lower", quantityType: "reps" },
  { id: "lateral-lunges", group: "lower", quantityType: "reps" },
  { id: "reverse-lunges", group: "lower", quantityType: "reps" },
  { id: "reverse-plank", group: "core", quantityType: "duration" },
  { id: "single-leg-glute-bridge", group: "lower", quantityType: "reps" },
  { id: "squats", group: "lower", quantityType: "reps" },
  { id: "step-ups", group: "lower", quantityType: "reps" },
  { id: "sumo-squats", group: "lower", quantityType: "reps" },
  { id: "superman-hold", group: "lower", quantityType: "duration" },
  { id: "wall-sit", group: "lower", quantityType: "duration" },
  { id: "alternating-arm-raises", group: "upper", quantityType: "reps" },
  { id: "arm-raises", group: "upper", quantityType: "reps" },
  { id: "decline-pushups", group: "upper", quantityType: "reps" },
  { id: "diamond-pushups", group: "upper", quantityType: "reps" },
  { id: "dive-bomber-pushups", group: "upper", quantityType: "reps" },
  { id: "knee-pushups", group: "upper", quantityType: "reps" },
  { id: "pike-pushups", group: "upper", quantityType: "reps" },
  { id: "pushups", group: "upper", quantityType: "reps" },
  { id: "reverse-snow-angels", group: "upper", quantityType: "reps" },
  { id: "swimmers", group: "upper", quantityType: "reps" },
  { id: "tricep-dips", group: "upper", quantityType: "reps" },
  { id: "walk-out-pushups", group: "upper", quantityType: "reps" },
  { id: "wall-pushups", group: "upper", quantityType: "reps" },
  { id: "wide-pushups", group: "upper", quantityType: "reps" },
  { id: "ytw-raises", group: "upper", quantityType: "reps" },
  { id: "bear-hold", group: "core", quantityType: "duration" },
  { id: "bicycle-crunches", group: "core", quantityType: "reps" },
  { id: "bird-dog", group: "core", quantityType: "reps" },
  { id: "crunches", group: "core", quantityType: "reps" },
  { id: "dead-bug", group: "core", quantityType: "reps" },
  { id: "dead-bug-hold", group: "core", quantityType: "duration" },
  { id: "flutter-kicks", group: "core", quantityType: "duration" },
  { id: "hollow-hold", group: "core", quantityType: "duration" },
  { id: "leg-raises", group: "core", quantityType: "reps" },
  { id: "plank", group: "core", quantityType: "duration" },
  { id: "plank-shoulder-taps", group: "core", quantityType: "reps" },
  { id: "russian-twists", group: "core", quantityType: "reps" },
  { id: "side-plank", group: "core", quantityType: "duration" },
  { id: "sit-ups", group: "core", quantityType: "reps" },
  { id: "box-step-burpees", group: "finisher", quantityType: "reps" },
  { id: "broad-jumps", group: "finisher", quantityType: "reps" },
  { id: "burpees", group: "finisher", quantityType: "reps" },
  { id: "jump-squats", group: "finisher", quantityType: "reps" },
  { id: "plank-jacks", group: "finisher", quantityType: "duration" },
  { id: "sprawls", group: "finisher", quantityType: "reps" },
  { id: "squat-thrusts", group: "finisher", quantityType: "reps" },
  { id: "star-jumps", group: "finisher", quantityType: "reps" },
  { id: "tuck-jumps", group: "finisher", quantityType: "reps" },
];

const QUANTITY_TYPE_BY_ID = new Map(
  EXERCISES.map((exercise) => [exercise.id, exercise.quantityType]),
);

export function getExerciseName(exerciseId: string): string {
  return tExercise(exerciseId);
}

export function getExerciseGroup(exerciseId: string): ExerciseGroup | null {
  return EXERCISES.find((exercise) => exercise.id === exerciseId)?.group ?? null;
}

export function getExerciseQuantityType(exerciseId: string): QuantityType {
  return QUANTITY_TYPE_BY_ID.get(exerciseId) ?? "reps";
}

export function getGroupedExercises(): { label: string; exercises: Exercise[] }[] {
  const locale = getLocale();

  return GROUP_ORDER.map((group) => ({
    label: tGroup(group),
    exercises: EXERCISES.filter((exercise) => exercise.group === group).sort((a, b) =>
      tExercise(a.id).localeCompare(tExercise(b.id), locale),
    ),
  })).filter((group) => group.exercises.length > 0);
}

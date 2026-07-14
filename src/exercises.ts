import type { Exercise, ExerciseGroup } from "./types";
import { getLocale, tExercise, tGroup } from "./i18n";

export const DEFAULT_EXERCISE_ID = "squats";

const GROUP_ORDER: ExerciseGroup[] = ["cardio", "lower", "upper", "core", "finisher"];

export const EXERCISES: Exercise[] = [
  { id: "bear-crawl", group: "cardio" },
  { id: "butt-kicks", group: "cardio" },
  { id: "crab-walk", group: "cardio" },
  { id: "cross-jacks", group: "cardio" },
  { id: "fast-feet", group: "cardio" },
  { id: "high-knees", group: "cardio" },
  { id: "inchworms", group: "cardio" },
  { id: "jumping-jacks", group: "cardio" },
  { id: "lateral-hops", group: "cardio" },
  { id: "marching-in-place", group: "cardio" },
  { id: "mountain-climbers", group: "cardio" },
  { id: "punch-jacks", group: "cardio" },
  { id: "side-shuffles", group: "cardio" },
  { id: "skaters", group: "cardio" },
  { id: "squat-to-overhead-reach", group: "cardio" },
  { id: "toe-taps", group: "cardio" },
  { id: "calf-raises", group: "lower" },
  { id: "curtsy-lunges", group: "lower" },
  { id: "fire-hydrants", group: "lower" },
  { id: "front-lunges", group: "lower" },
  { id: "glute-bridges", group: "lower" },
  { id: "lateral-lunges", group: "lower" },
  { id: "reverse-lunges", group: "lower" },
  { id: "reverse-plank", group: "core" },
  { id: "single-leg-glute-bridge", group: "lower" },
  { id: "squats", group: "lower" },
  { id: "step-ups", group: "lower" },
  { id: "sumo-squats", group: "lower" },
  { id: "wall-sit", group: "lower" },
  { id: "alternating-arm-raises", group: "upper" },
  { id: "arm-raises", group: "upper" },
  { id: "decline-pushups", group: "upper" },
  { id: "diamond-pushups", group: "upper" },
  { id: "dive-bomber-pushups", group: "upper" },
  { id: "knee-pushups", group: "upper" },
  { id: "pike-pushups", group: "upper" },
  { id: "pushups", group: "upper" },
  { id: "reverse-snow-angels", group: "upper" },
  { id: "superman-hold", group: "upper" },
  { id: "swimmers", group: "upper" },
  { id: "tricep-dips", group: "upper" },
  { id: "walk-out-pushups", group: "upper" },
  { id: "wall-pushups", group: "upper" },
  { id: "wide-pushups", group: "upper" },
  { id: "ytw-raises", group: "upper" },
  { id: "bear-hold", group: "core" },
  { id: "bicycle-crunches", group: "core" },
  { id: "bird-dog", group: "core" },
  { id: "crunches", group: "core" },
  { id: "dead-bug", group: "core" },
  { id: "dead-bug-hold", group: "core" },
  { id: "flutter-kicks", group: "core" },
  { id: "hollow-hold", group: "core" },
  { id: "leg-raises", group: "core" },
  { id: "plank", group: "core" },
  { id: "plank-shoulder-taps", group: "core" },
  { id: "russian-twists", group: "core" },
  { id: "side-plank", group: "core" },
  { id: "sit-ups", group: "core" },
  { id: "box-step-burpees", group: "finisher" },
  { id: "broad-jumps", group: "finisher" },
  { id: "burpees", group: "finisher" },
  { id: "jump-squats", group: "finisher" },
  { id: "plank-jacks", group: "finisher" },
  { id: "sprawls", group: "finisher" },
  { id: "squat-thrusts", group: "finisher" },
  { id: "star-jumps", group: "finisher" },
  { id: "tuck-jumps", group: "finisher" },
];

export function getExerciseName(exerciseId: string): string {
  return tExercise(exerciseId);
}

export function getExerciseGroup(exerciseId: string): ExerciseGroup | null {
  return EXERCISES.find((exercise) => exercise.id === exerciseId)?.group ?? null;
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

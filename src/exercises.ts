import type { Exercise, ExerciseGroup } from "./types";

export const DEFAULT_EXERCISE_ID = "squats";

const GROUP_LABELS: Record<ExerciseGroup, string> = {
  cardio: "Cardio",
  lower: "Lower body",
  upper: "Upper body",
  core: "Core",
  finisher: "Full-body finishers",
};

const GROUP_ORDER: ExerciseGroup[] = ["cardio", "lower", "upper", "core", "finisher"];

export const EXERCISES: Exercise[] = [
  // Cardio (12)
  { id: "butt-kicks", name: "Butt kicks", group: "cardio" },
  { id: "cross-jacks", name: "Cross jacks", group: "cardio" },
  { id: "fast-feet", name: "Fast feet", group: "cardio" },
  { id: "high-knees", name: "High knees", group: "cardio" },
  { id: "jumping-jacks", name: "Jumping jacks", group: "cardio" },
  { id: "lateral-hops", name: "Lateral hops", group: "cardio" },
  { id: "marching-in-place", name: "Marching in place", group: "cardio" },
  { id: "mountain-climbers", name: "Mountain climbers", group: "cardio" },
  { id: "punch-jacks", name: "Punch jacks", group: "cardio" },
  { id: "side-shuffles", name: "Side shuffles", group: "cardio" },
  { id: "skaters", name: "Skaters", group: "cardio" },
  { id: "toe-taps", name: "Toe taps", group: "cardio" },

  // Lower body (12)
  { id: "calf-raises", name: "Calf raises", group: "lower" },
  { id: "curtsy-lunges", name: "Curtsy lunges", group: "lower" },
  { id: "fire-hydrants", name: "Fire hydrants", group: "lower" },
  { id: "front-lunges", name: "Front lunges", group: "lower" },
  { id: "glute-bridges", name: "Glute bridges", group: "lower" },
  { id: "lateral-lunges", name: "Lateral lunges", group: "lower" },
  { id: "reverse-lunges", name: "Reverse lunges", group: "lower" },
  { id: "single-leg-glute-bridge", name: "Single-leg glute bridge", group: "lower" },
  { id: "squats", name: "Squats", group: "lower" },
  { id: "step-ups", name: "Step-ups (step)", group: "lower" },
  { id: "sumo-squats", name: "Sumo squats", group: "lower" },
  { id: "wall-sit", name: "Wall sit", group: "lower" },

  // Upper body (12)
  { id: "alternating-arm-raises", name: "Alternating arm raises", group: "upper" },
  { id: "arm-raises", name: "Arm raises", group: "upper" },
  { id: "bear-hold", name: "Bear hold", group: "upper" },
  { id: "decline-pushups", name: "Decline push-ups (step)", group: "upper" },
  { id: "diamond-pushups", name: "Diamond push-ups", group: "upper" },
  { id: "knee-pushups", name: "Knee push-ups", group: "upper" },
  { id: "pike-pushups", name: "Pike push-ups", group: "upper" },
  { id: "pushups", name: "Push-ups", group: "upper" },
  { id: "superman-hold", name: "Superman hold", group: "upper" },
  { id: "tricep-dips", name: "Tricep dips (chair)", group: "upper" },
  { id: "wall-pushups", name: "Wall push-ups", group: "upper" },
  { id: "wide-pushups", name: "Wide push-ups", group: "upper" },

  // Core (12)
  { id: "bicycle-crunches", name: "Bicycle crunches", group: "core" },
  { id: "bird-dog", name: "Bird dog", group: "core" },
  { id: "crunches", name: "Crunches", group: "core" },
  { id: "dead-bug", name: "Dead bug", group: "core" },
  { id: "flutter-kicks", name: "Flutter kicks", group: "core" },
  { id: "hollow-hold", name: "Hollow hold", group: "core" },
  { id: "leg-raises", name: "Leg raises", group: "core" },
  { id: "plank", name: "Plank", group: "core" },
  { id: "plank-shoulder-taps", name: "Plank shoulder taps", group: "core" },
  { id: "russian-twists", name: "Russian twists", group: "core" },
  { id: "side-plank", name: "Side plank", group: "core" },
  { id: "sit-ups", name: "Sit-ups", group: "core" },

  // Full-body finishers (15)
  { id: "bear-crawl", name: "Bear crawl", group: "finisher" },
  { id: "box-step-burpees", name: "Box step burpees (step)", group: "finisher" },
  { id: "broad-jumps", name: "Broad jumps", group: "finisher" },
  { id: "burpees", name: "Burpees", group: "finisher" },
  { id: "crab-walk", name: "Crab walk", group: "finisher" },
  { id: "dive-bomber-pushups", name: "Dive bomber push-ups", group: "finisher" },
  { id: "inchworms", name: "Inchworms", group: "finisher" },
  { id: "jump-squats", name: "Jump squats", group: "finisher" },
  { id: "plank-jacks", name: "Plank jacks", group: "finisher" },
  { id: "sprawls", name: "Sprawls", group: "finisher" },
  { id: "squat-thrusts", name: "Squat thrusts", group: "finisher" },
  { id: "squat-to-overhead-reach", name: "Squat to overhead reach", group: "finisher" },
  { id: "star-jumps", name: "Star jumps", group: "finisher" },
  { id: "tuck-jumps", name: "Tuck jumps", group: "finisher" },
  { id: "walk-out-pushups", name: "Walk-out push-ups", group: "finisher" },
];

export function getExerciseName(exerciseId: string): string {
  return EXERCISES.find((e) => e.id === exerciseId)?.name ?? exerciseId;
}

export function getGroupedExercises(): { label: string; exercises: Exercise[] }[] {
  return GROUP_ORDER.map((group) => ({
    label: GROUP_LABELS[group],
    exercises: EXERCISES.filter((exercise) => exercise.group === group).sort((a, b) =>
      a.name.localeCompare(b.name),
    ),
  })).filter((group) => group.exercises.length > 0);
}

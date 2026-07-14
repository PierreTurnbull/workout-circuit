import type { ExerciseSet, QuantityType } from "./types";

export type CircuitDuration = 15 | 20 | 30;
export type CircuitIntensity = "light" | "moderate" | "intense";

export interface GeneratorOptions {
  duration: CircuitDuration;
  intensity: CircuitIntensity;
}

type SlotKind = "cardio" | "lower" | "upper" | "core-static" | "core-dynamic" | "finisher";

interface ExerciseSpec {
  id: string;
  kind: SlotKind;
  impact: "low" | "medium" | "high";
  quantityType: QuantityType;
  quantities: Record<CircuitIntensity, number>;
}

const EXERCISE_SPECS: ExerciseSpec[] = [
  // Cardio
  { id: "butt-kicks", kind: "cardio", impact: "medium", quantityType: "duration", quantities: { light: 30, moderate: 35, intense: 40 } },
  { id: "cross-jacks", kind: "cardio", impact: "medium", quantityType: "duration", quantities: { light: 30, moderate: 35, intense: 40 } },
  { id: "fast-feet", kind: "cardio", impact: "medium", quantityType: "duration", quantities: { light: 25, moderate: 30, intense: 35 } },
  { id: "high-knees", kind: "cardio", impact: "medium", quantityType: "duration", quantities: { light: 30, moderate: 35, intense: 40 } },
  { id: "jumping-jacks", kind: "cardio", impact: "medium", quantityType: "duration", quantities: { light: 30, moderate: 40, intense: 45 } },
  { id: "lateral-hops", kind: "cardio", impact: "medium", quantityType: "duration", quantities: { light: 25, moderate: 30, intense: 35 } },
  { id: "marching-in-place", kind: "cardio", impact: "low", quantityType: "duration", quantities: { light: 40, moderate: 45, intense: 50 } },
  { id: "mountain-climbers", kind: "cardio", impact: "high", quantityType: "duration", quantities: { light: 25, moderate: 35, intense: 40 } },
  { id: "punch-jacks", kind: "cardio", impact: "medium", quantityType: "duration", quantities: { light: 30, moderate: 35, intense: 40 } },
  { id: "side-shuffles", kind: "cardio", impact: "low", quantityType: "duration", quantities: { light: 30, moderate: 35, intense: 40 } },
  { id: "skaters", kind: "cardio", impact: "medium", quantityType: "duration", quantities: { light: 25, moderate: 35, intense: 40 } },
  { id: "toe-taps", kind: "cardio", impact: "low", quantityType: "duration", quantities: { light: 30, moderate: 35, intense: 40 } },

  // Lower body
  { id: "calf-raises", kind: "lower", impact: "low", quantityType: "reps", quantities: { light: 15, moderate: 20, intense: 25 } },
  { id: "curtsy-lunges", kind: "lower", impact: "medium", quantityType: "reps", quantities: { light: 10, moderate: 12, intense: 14 } },
  { id: "fire-hydrants", kind: "lower", impact: "low", quantityType: "reps", quantities: { light: 12, moderate: 15, intense: 18 } },
  { id: "front-lunges", kind: "lower", impact: "medium", quantityType: "reps", quantities: { light: 10, moderate: 12, intense: 16 } },
  { id: "glute-bridges", kind: "lower", impact: "low", quantityType: "reps", quantities: { light: 12, moderate: 15, intense: 18 } },
  { id: "lateral-lunges", kind: "lower", impact: "medium", quantityType: "reps", quantities: { light: 10, moderate: 12, intense: 14 } },
  { id: "reverse-lunges", kind: "lower", impact: "medium", quantityType: "reps", quantities: { light: 10, moderate: 12, intense: 14 } },
  { id: "single-leg-glute-bridge", kind: "lower", impact: "medium", quantityType: "reps", quantities: { light: 8, moderate: 10, intense: 12 } },
  { id: "squats", kind: "lower", impact: "low", quantityType: "reps", quantities: { light: 12, moderate: 15, intense: 20 } },
  { id: "step-ups", kind: "lower", impact: "medium", quantityType: "reps", quantities: { light: 10, moderate: 12, intense: 14 } },
  { id: "sumo-squats", kind: "lower", impact: "low", quantityType: "reps", quantities: { light: 12, moderate: 15, intense: 18 } },
  { id: "wall-sit", kind: "lower", impact: "low", quantityType: "duration", quantities: { light: 30, moderate: 40, intense: 50 } },

  // Upper body
  { id: "alternating-arm-raises", kind: "upper", impact: "low", quantityType: "reps", quantities: { light: 16, moderate: 20, intense: 24 } },
  { id: "arm-raises", kind: "upper", impact: "low", quantityType: "duration", quantities: { light: 30, moderate: 35, intense: 40 } },
  { id: "bear-hold", kind: "upper", impact: "medium", quantityType: "duration", quantities: { light: 20, moderate: 25, intense: 30 } },
  { id: "decline-pushups", kind: "upper", impact: "medium", quantityType: "reps", quantities: { light: 6, moderate: 8, intense: 10 } },
  { id: "diamond-pushups", kind: "upper", impact: "medium", quantityType: "reps", quantities: { light: 6, moderate: 8, intense: 10 } },
  { id: "knee-pushups", kind: "upper", impact: "low", quantityType: "reps", quantities: { light: 10, moderate: 12, intense: 15 } },
  { id: "pike-pushups", kind: "upper", impact: "medium", quantityType: "reps", quantities: { light: 6, moderate: 8, intense: 10 } },
  { id: "pushups", kind: "upper", impact: "medium", quantityType: "reps", quantities: { light: 8, moderate: 10, intense: 14 } },
  { id: "superman-hold", kind: "upper", impact: "low", quantityType: "duration", quantities: { light: 25, moderate: 30, intense: 35 } },
  { id: "tricep-dips", kind: "upper", impact: "medium", quantityType: "reps", quantities: { light: 8, moderate: 10, intense: 12 } },
  { id: "wall-pushups", kind: "upper", impact: "low", quantityType: "reps", quantities: { light: 12, moderate: 15, intense: 18 } },
  { id: "wide-pushups", kind: "upper", impact: "medium", quantityType: "reps", quantities: { light: 8, moderate: 10, intense: 12 } },

  // Core
  { id: "hollow-hold", kind: "core-static", impact: "low", quantityType: "duration", quantities: { light: 25, moderate: 35, intense: 45 } },
  { id: "plank", kind: "core-static", impact: "low", quantityType: "duration", quantities: { light: 30, moderate: 45, intense: 60 } },
  { id: "side-plank", kind: "core-static", impact: "low", quantityType: "duration", quantities: { light: 25, moderate: 35, intense: 45 } },
  { id: "bicycle-crunches", kind: "core-dynamic", impact: "low", quantityType: "reps", quantities: { light: 16, moderate: 20, intense: 24 } },
  { id: "bird-dog", kind: "core-dynamic", impact: "low", quantityType: "reps", quantities: { light: 10, moderate: 12, intense: 16 } },
  { id: "crunches", kind: "core-dynamic", impact: "low", quantityType: "reps", quantities: { light: 15, moderate: 18, intense: 22 } },
  { id: "dead-bug", kind: "core-dynamic", impact: "low", quantityType: "reps", quantities: { light: 10, moderate: 12, intense: 16 } },
  { id: "flutter-kicks", kind: "core-dynamic", impact: "low", quantityType: "duration", quantities: { light: 25, moderate: 30, intense: 35 } },
  { id: "leg-raises", kind: "core-dynamic", impact: "low", quantityType: "reps", quantities: { light: 10, moderate: 12, intense: 15 } },
  { id: "plank-shoulder-taps", kind: "core-dynamic", impact: "medium", quantityType: "reps", quantities: { light: 16, moderate: 20, intense: 24 } },
  { id: "russian-twists", kind: "core-dynamic", impact: "low", quantityType: "reps", quantities: { light: 16, moderate: 20, intense: 24 } },
  { id: "sit-ups", kind: "core-dynamic", impact: "low", quantityType: "reps", quantities: { light: 12, moderate: 15, intense: 20 } },

  // Full-body finishers
  { id: "bear-crawl", kind: "finisher", impact: "medium", quantityType: "duration", quantities: { light: 20, moderate: 25, intense: 30 } },
  { id: "box-step-burpees", kind: "finisher", impact: "high", quantityType: "reps", quantities: { light: 6, moderate: 8, intense: 10 } },
  { id: "broad-jumps", kind: "finisher", impact: "high", quantityType: "reps", quantities: { light: 6, moderate: 8, intense: 10 } },
  { id: "burpees", kind: "finisher", impact: "high", quantityType: "reps", quantities: { light: 6, moderate: 8, intense: 10 } },
  { id: "crab-walk", kind: "finisher", impact: "medium", quantityType: "duration", quantities: { light: 20, moderate: 25, intense: 30 } },
  { id: "dive-bomber-pushups", kind: "finisher", impact: "medium", quantityType: "reps", quantities: { light: 5, moderate: 6, intense: 8 } },
  { id: "inchworms", kind: "finisher", impact: "medium", quantityType: "reps", quantities: { light: 6, moderate: 8, intense: 10 } },
  { id: "jump-squats", kind: "finisher", impact: "high", quantityType: "reps", quantities: { light: 10, moderate: 12, intense: 15 } },
  { id: "plank-jacks", kind: "finisher", impact: "medium", quantityType: "duration", quantities: { light: 25, moderate: 30, intense: 35 } },
  { id: "sprawls", kind: "finisher", impact: "high", quantityType: "reps", quantities: { light: 8, moderate: 10, intense: 12 } },
  { id: "squat-thrusts", kind: "finisher", impact: "high", quantityType: "reps", quantities: { light: 8, moderate: 10, intense: 12 } },
  { id: "squat-to-overhead-reach", kind: "finisher", impact: "low", quantityType: "reps", quantities: { light: 12, moderate: 15, intense: 18 } },
  { id: "star-jumps", kind: "finisher", impact: "high", quantityType: "reps", quantities: { light: 8, moderate: 10, intense: 12 } },
  { id: "tuck-jumps", kind: "finisher", impact: "high", quantityType: "reps", quantities: { light: 6, moderate: 8, intense: 10 } },
  { id: "walk-out-pushups", kind: "finisher", impact: "medium", quantityType: "reps", quantities: { light: 6, moderate: 8, intense: 10 } },
];

const SLOT_PLANS: Record<CircuitDuration, SlotKind[]> = {
  15: ["cardio", "lower", "upper", "core-static", "lower"],
  20: ["cardio", "lower", "upper", "core-static", "lower", "core-dynamic"],
  30: ["cardio", "lower", "upper", "core-static", "lower", "core-dynamic", "finisher"],
};

const DURATION_CONFIG: Record<
  CircuitDuration,
  { rounds: number; restSeconds: number; restInput: string }
> = {
  15: { rounds: 3, restSeconds: 30, restInput: "0:30" },
  20: { rounds: 3, restSeconds: 45, restInput: "0:45" },
  30: { rounds: 4, restSeconds: 60, restInput: "1:00" },
};

const SPEC_BY_ID = new Map(EXERCISE_SPECS.map((spec) => [spec.id, spec]));

function pickOne<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function jitterReps(value: number): number {
  const delta = Math.floor(Math.random() * 3) - 1;
  return Math.max(4, value + delta);
}

function jitterDuration(value: number): number {
  const deltas = [-5, 0, 0, 5];
  return Math.max(15, value + pickOne(deltas));
}

function formatQuantityInput(quantityType: QuantityType, value: number): string {
  if (quantityType === "reps") return String(value);

  const minutes = Math.floor(value / 60);
  const seconds = value % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function isAllowedForIntensity(spec: ExerciseSpec, intensity: CircuitIntensity): boolean {
  if (intensity === "light") {
    return spec.impact !== "high";
  }

  if (intensity === "moderate" && spec.kind === "finisher" && spec.impact === "high") {
    return Math.random() < 0.4;
  }

  return true;
}

function candidatesForSlot(kind: SlotKind, intensity: CircuitIntensity): ExerciseSpec[] {
  return EXERCISE_SPECS.filter(
    (spec) => spec.kind === kind && isAllowedForIntensity(spec, intensity),
  );
}

function buildExerciseSet(spec: ExerciseSpec, intensity: CircuitIntensity): ExerciseSet {
  const baseQuantity = spec.quantities[intensity];
  const quantity =
    spec.quantityType === "reps" ? jitterReps(baseQuantity) : jitterDuration(baseQuantity);

  return {
    id: crypto.randomUUID(),
    exerciseId: spec.id,
    quantityType: spec.quantityType,
    reps: spec.quantityType === "reps" ? quantity : 10,
    durationSeconds: spec.quantityType === "duration" ? quantity : 60,
    quantityInput: formatQuantityInput(spec.quantityType, quantity),
  };
}

function pickExerciseForSlot(
  kind: SlotKind,
  intensity: CircuitIntensity,
  usedExerciseIds: Set<string>,
  avoidExerciseId?: string,
): ExerciseSpec {
  const candidates = candidatesForSlot(kind, intensity);

  let pool = candidates.filter(
    (spec) => !usedExerciseIds.has(spec.id) && spec.id !== avoidExerciseId,
  );

  if (pool.length === 0) {
    pool = candidates.filter((spec) => spec.id !== avoidExerciseId);
  }

  if (pool.length === 0) {
    pool = candidates;
  }

  return pickOne(pool);
}

export function estimateCircuitMinutes(
  sets: ExerciseSet[],
  rounds: number,
  restBetweenRoundsSeconds: number,
): number {
  const secondsPerRep = 3;
  const roundSeconds = sets.reduce((total, set) => {
    const spec = SPEC_BY_ID.get(set.exerciseId);
    if (!spec) return total;

    if (spec.quantityType === "reps") {
      return total + set.reps * secondsPerRep;
    }

    return total + set.durationSeconds;
  }, 0);

  const totalSeconds = roundSeconds * rounds + restBetweenRoundsSeconds * Math.max(0, rounds - 1);
  return Math.round(totalSeconds / 60);
}

export function generateCircuit(options: GeneratorOptions): {
  sets: ExerciseSet[];
  rounds: number;
  restBetweenRoundsSeconds: number;
  restBetweenRoundsInput: string;
} {
  const slotKinds = SLOT_PLANS[options.duration];
  const config = DURATION_CONFIG[options.duration];
  const usedExerciseIds = new Set<string>();

  const sets = slotKinds.map((kind) => {
    const spec = pickExerciseForSlot(kind, options.intensity, usedExerciseIds);
    usedExerciseIds.add(spec.id);
    return buildExerciseSet(spec, options.intensity);
  });

  return {
    sets,
    rounds: config.rounds,
    restBetweenRoundsSeconds: config.restSeconds,
    restBetweenRoundsInput: config.restInput,
  };
}

export function regenerateExerciseAtIndex(
  index: number,
  sets: ExerciseSet[],
  options: GeneratorOptions,
): ExerciseSet {
  const slotKinds = SLOT_PLANS[options.duration];
  const kind = slotKinds[Math.min(index, slotKinds.length - 1)];
  const currentExerciseId = sets[index]?.exerciseId;
  const usedExerciseIds = new Set(
    sets.filter((_, setIndex) => setIndex !== index).map((set) => set.exerciseId),
  );

  const spec = pickExerciseForSlot(
    kind,
    options.intensity,
    usedExerciseIds,
    currentExerciseId,
  );
  return buildExerciseSet(spec, options.intensity);
}
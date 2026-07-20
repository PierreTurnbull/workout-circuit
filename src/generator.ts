import { getExerciseQuantityType } from "./exercises";
import type { ExerciseSet, QuantityType } from "./types";

export type CircuitDuration = 15 | 20 | 30;
export type CircuitIntensity = "light" | "moderate" | "intense";

export interface GeneratorOptions {
  duration: CircuitDuration;
  intensity: CircuitIntensity;
}

type SlotKind =
  | "cardio"
  | "lower"
  | "hinge"
  | "upper-push"
  | "pull"
  | "core-static"
  | "core-dynamic"
  | "finisher";

type IntensityLevel = 1 | 2 | 3;

interface ExerciseSpec {
  id: string;
  kinds: SlotKind[];
  impact: "low" | "medium" | "high";
  minIntensity: IntensityLevel;
  maxIntensity: IntensityLevel;
  static: boolean;
  unilateral: boolean;
  quantities: Record<CircuitIntensity, number>;
  /** Lower = accessory / less likely. Default 1. */
  pickWeight?: number;
  /** Cardio drive: 3 = high, 1 = low. Default 2. */
  cardioTier?: 1 | 2 | 3;
  /** Max intensity allowed at a given circuit duration (if set, other durations are excluded). */
  durationCaps?: Partial<Record<CircuitDuration, IntensityLevel>>;
}

const INTENSITY_LEVEL: Record<CircuitIntensity, IntensityLevel> = {
  light: 1,
  moderate: 2,
  intense: 3,
};

const MAX_STATIC_PER_CIRCUIT = 2;

const EXERCISE_SPECS: ExerciseSpec[] = [
  // Cardio / locomotion
  { id: "butt-kicks", kinds: ["cardio"], impact: "medium", minIntensity: 1, maxIntensity: 2, static: false, unilateral: false, cardioTier: 2, quantities: { light: 30, moderate: 35, intense: 40 } },
  { id: "cross-jacks", kinds: ["cardio"], impact: "medium", minIntensity: 1, maxIntensity: 3, static: false, unilateral: false, cardioTier: 3, quantities: { light: 30, moderate: 35, intense: 40 } },
  { id: "fast-feet", kinds: ["cardio"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, cardioTier: 3, quantities: { light: 25, moderate: 30, intense: 35 } },
  { id: "high-knees", kinds: ["cardio"], impact: "medium", minIntensity: 1, maxIntensity: 3, static: false, unilateral: false, cardioTier: 3, pickWeight: 1.1, quantities: { light: 30, moderate: 35, intense: 40 } },
  { id: "jumping-jacks", kinds: ["cardio"], impact: "medium", minIntensity: 1, maxIntensity: 3, static: false, unilateral: false, cardioTier: 3, pickWeight: 1.15, quantities: { light: 30, moderate: 40, intense: 45 } },
  { id: "lateral-hops", kinds: ["cardio"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, cardioTier: 3, quantities: { light: 25, moderate: 30, intense: 35 } },
  { id: "marching-in-place", kinds: ["cardio"], impact: "low", minIntensity: 1, maxIntensity: 1, static: false, unilateral: false, cardioTier: 1, quantities: { light: 40, moderate: 45, intense: 50 } },
  { id: "mountain-climbers", kinds: ["cardio", "finisher"], impact: "high", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, cardioTier: 3, pickWeight: 1.2, quantities: { light: 25, moderate: 35, intense: 40 } },
  { id: "punch-jacks", kinds: ["cardio"], impact: "medium", minIntensity: 1, maxIntensity: 3, static: false, unilateral: false, cardioTier: 3, quantities: { light: 30, moderate: 35, intense: 40 } },
  { id: "side-shuffles", kinds: ["cardio"], impact: "low", minIntensity: 1, maxIntensity: 2, static: false, unilateral: false, cardioTier: 1, quantities: { light: 30, moderate: 35, intense: 40 } },
  { id: "skaters", kinds: ["cardio"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, cardioTier: 3, quantities: { light: 25, moderate: 35, intense: 40 } },
  { id: "toe-taps", kinds: ["cardio"], impact: "low", minIntensity: 1, maxIntensity: 1, static: false, unilateral: false, cardioTier: 1, quantities: { light: 30, moderate: 35, intense: 40 } },
  { id: "bear-crawl", kinds: ["cardio"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, cardioTier: 2, quantities: { light: 20, moderate: 25, intense: 30 } },
  { id: "crab-walk", kinds: ["cardio"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, cardioTier: 2, quantities: { light: 20, moderate: 25, intense: 30 } },
  { id: "inchworms", kinds: ["cardio"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, cardioTier: 2, quantities: { light: 6, moderate: 8, intense: 10 } },
  { id: "squat-to-overhead-reach", kinds: ["cardio"], impact: "low", minIntensity: 1, maxIntensity: 1, static: false, unilateral: false, cardioTier: 1, quantities: { light: 12, moderate: 15, intense: 18 } },

  // Squat / lunge patterns
  { id: "calf-raises", kinds: ["lower"], impact: "low", minIntensity: 1, maxIntensity: 3, static: false, unilateral: false, pickWeight: 0.2, quantities: { light: 15, moderate: 20, intense: 25 } },
  { id: "curtsy-lunges", kinds: ["lower"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: false, unilateral: true, quantities: { light: 10, moderate: 12, intense: 14 } },
  { id: "front-lunges", kinds: ["lower"], impact: "medium", minIntensity: 1, maxIntensity: 3, static: false, unilateral: true, pickWeight: 1.1, quantities: { light: 10, moderate: 12, intense: 16 } },
  { id: "lateral-lunges", kinds: ["lower"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: false, unilateral: true, quantities: { light: 10, moderate: 12, intense: 14 } },
  { id: "reverse-lunges", kinds: ["lower"], impact: "medium", minIntensity: 1, maxIntensity: 3, static: false, unilateral: true, pickWeight: 1.15, quantities: { light: 10, moderate: 12, intense: 14 } },
  { id: "squats", kinds: ["lower"], impact: "low", minIntensity: 1, maxIntensity: 3, static: false, unilateral: false, pickWeight: 1.2, quantities: { light: 12, moderate: 15, intense: 20 } },
  { id: "step-ups", kinds: ["lower"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: false, unilateral: true, pickWeight: 1.05, quantities: { light: 10, moderate: 12, intense: 14 } },
  { id: "sumo-squats", kinds: ["lower"], impact: "low", minIntensity: 1, maxIntensity: 3, static: false, unilateral: false, pickWeight: 1.1, quantities: { light: 12, moderate: 15, intense: 18 } },
  { id: "wall-sit", kinds: ["lower"], impact: "low", minIntensity: 1, maxIntensity: 3, static: true, unilateral: false, pickWeight: 0.45, quantities: { light: 30, moderate: 40, intense: 50 } },
  { id: "fire-hydrants", kinds: ["lower"], impact: "low", minIntensity: 1, maxIntensity: 3, static: false, unilateral: true, pickWeight: 0.3, quantities: { light: 12, moderate: 15, intense: 18 } },

  // Hinge / posterior chain
  { id: "glute-bridges", kinds: ["hinge"], impact: "low", minIntensity: 1, maxIntensity: 3, static: false, unilateral: false, pickWeight: 1.25, quantities: { light: 12, moderate: 15, intense: 18 } },
  { id: "single-leg-glute-bridge", kinds: ["hinge"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: false, unilateral: true, pickWeight: 1.05, quantities: { light: 8, moderate: 10, intense: 12 } },
  { id: "superman-hold", kinds: ["hinge"], impact: "low", minIntensity: 1, maxIntensity: 3, static: true, unilateral: false, pickWeight: 0.9, quantities: { light: 25, moderate: 30, intense: 35 } },

  // Push
  { id: "decline-pushups", kinds: ["upper-push"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, pickWeight: 0.95, quantities: { light: 6, moderate: 8, intense: 10 } },
  { id: "diamond-pushups", kinds: ["upper-push"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, pickWeight: 0.9, quantities: { light: 6, moderate: 8, intense: 10 } },
  { id: "dive-bomber-pushups", kinds: ["upper-push"], impact: "medium", minIntensity: 3, maxIntensity: 3, static: false, unilateral: false, quantities: { light: 5, moderate: 6, intense: 8 } },
  { id: "knee-pushups", kinds: ["upper-push"], impact: "low", minIntensity: 1, maxIntensity: 1, static: false, unilateral: false, quantities: { light: 10, moderate: 12, intense: 15 } },
  { id: "pike-pushups", kinds: ["upper-push"], impact: "medium", minIntensity: 3, maxIntensity: 3, static: false, unilateral: false, quantities: { light: 6, moderate: 8, intense: 10 } },
  { id: "pushups", kinds: ["upper-push"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, pickWeight: 1.2, quantities: { light: 8, moderate: 10, intense: 14 } },
  { id: "tricep-dips", kinds: ["upper-push"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, pickWeight: 0.95, quantities: { light: 8, moderate: 10, intense: 12 } },
  { id: "walk-out-pushups", kinds: ["upper-push"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, pickWeight: 0.9, quantities: { light: 6, moderate: 8, intense: 10 } },
  { id: "wall-pushups", kinds: ["upper-push"], impact: "low", minIntensity: 1, maxIntensity: 2, static: false, unilateral: false, durationCaps: { 15: 2, 20: 1 }, quantities: { light: 12, moderate: 15, intense: 18 } },
  { id: "wide-pushups", kinds: ["upper-push"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, pickWeight: 1.05, quantities: { light: 8, moderate: 10, intense: 12 } },

  // Pull / scapular
  { id: "reverse-snow-angels", kinds: ["pull"], impact: "low", minIntensity: 1, maxIntensity: 3, static: false, unilateral: false, pickWeight: 1, quantities: { light: 12, moderate: 15, intense: 18 } },
  { id: "swimmers", kinds: ["pull"], impact: "low", minIntensity: 1, maxIntensity: 3, static: false, unilateral: false, pickWeight: 1.1, quantities: { light: 12, moderate: 15, intense: 20 } },
  { id: "ytw-raises", kinds: ["pull"], impact: "low", minIntensity: 1, maxIntensity: 3, static: false, unilateral: false, pickWeight: 0.95, quantities: { light: 10, moderate: 12, intense: 15 } },

  // Static core / stability
  { id: "bear-hold", kinds: ["core-static"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: true, unilateral: false, pickWeight: 0.85, quantities: { light: 20, moderate: 25, intense: 30 } },
  { id: "dead-bug-hold", kinds: ["core-static"], impact: "low", minIntensity: 1, maxIntensity: 3, static: true, unilateral: true, pickWeight: 1.1, quantities: { light: 20, moderate: 30, intense: 35 } },
  { id: "hollow-hold", kinds: ["core-static"], impact: "low", minIntensity: 2, maxIntensity: 3, static: true, unilateral: false, pickWeight: 0.9, quantities: { light: 25, moderate: 35, intense: 45 } },
  { id: "plank", kinds: ["core-static"], impact: "low", minIntensity: 1, maxIntensity: 3, static: true, unilateral: false, pickWeight: 1.2, quantities: { light: 30, moderate: 45, intense: 60 } },
  { id: "reverse-plank", kinds: ["core-static"], impact: "low", minIntensity: 2, maxIntensity: 3, static: true, unilateral: false, pickWeight: 0.85, quantities: { light: 20, moderate: 30, intense: 35 } },
  { id: "side-plank", kinds: ["core-static"], impact: "low", minIntensity: 2, maxIntensity: 3, static: true, unilateral: true, pickWeight: 0.7, quantities: { light: 25, moderate: 35, intense: 45 } },

  // Dynamic core
  { id: "bicycle-crunches", kinds: ["core-dynamic"], impact: "low", minIntensity: 1, maxIntensity: 3, static: false, unilateral: false, pickWeight: 1.05, quantities: { light: 16, moderate: 20, intense: 24 } },
  { id: "bird-dog", kinds: ["core-dynamic"], impact: "low", minIntensity: 1, maxIntensity: 3, static: false, unilateral: true, pickWeight: 1.15, quantities: { light: 10, moderate: 12, intense: 16 } },
  { id: "crunches", kinds: ["core-dynamic"], impact: "low", minIntensity: 1, maxIntensity: 2, static: false, unilateral: false, pickWeight: 0.85, quantities: { light: 15, moderate: 18, intense: 22 } },
  { id: "dead-bug", kinds: ["core-dynamic"], impact: "low", minIntensity: 1, maxIntensity: 3, static: false, unilateral: false, pickWeight: 1.1, quantities: { light: 10, moderate: 12, intense: 16 } },
  { id: "flutter-kicks", kinds: ["core-dynamic"], impact: "low", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, pickWeight: 0.95, quantities: { light: 25, moderate: 30, intense: 35 } },
  { id: "leg-raises", kinds: ["core-dynamic"], impact: "low", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, pickWeight: 0.95, quantities: { light: 10, moderate: 12, intense: 15 } },
  { id: "plank-shoulder-taps", kinds: ["core-dynamic"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, pickWeight: 0.9, quantities: { light: 16, moderate: 20, intense: 24 } },
  { id: "russian-twists", kinds: ["core-dynamic"], impact: "low", minIntensity: 1, maxIntensity: 3, static: false, unilateral: false, pickWeight: 1, quantities: { light: 16, moderate: 20, intense: 24 } },
  { id: "sit-ups", kinds: ["core-dynamic"], impact: "low", minIntensity: 1, maxIntensity: 2, static: false, unilateral: false, pickWeight: 0.8, quantities: { light: 12, moderate: 15, intense: 20 } },

  // High-effort finishers
  { id: "box-step-burpees", kinds: ["finisher"], impact: "high", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, pickWeight: 1.05, quantities: { light: 6, moderate: 8, intense: 10 } },
  { id: "broad-jumps", kinds: ["finisher"], impact: "high", minIntensity: 3, maxIntensity: 3, static: false, unilateral: false, quantities: { light: 6, moderate: 8, intense: 10 } },
  { id: "burpees", kinds: ["finisher"], impact: "high", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, pickWeight: 1.15, quantities: { light: 6, moderate: 8, intense: 10 } },
  { id: "jump-squats", kinds: ["finisher"], impact: "high", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, pickWeight: 1.1, quantities: { light: 10, moderate: 12, intense: 15 } },
  { id: "plank-jacks", kinds: ["finisher"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, pickWeight: 1.05, quantities: { light: 25, moderate: 30, intense: 35 } },
  { id: "sprawls", kinds: ["finisher"], impact: "high", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, pickWeight: 1.1, quantities: { light: 8, moderate: 10, intense: 12 } },
  { id: "squat-thrusts", kinds: ["finisher"], impact: "high", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, pickWeight: 1.15, quantities: { light: 8, moderate: 10, intense: 12 } },
  { id: "star-jumps", kinds: ["finisher"], impact: "high", minIntensity: 3, maxIntensity: 3, static: false, unilateral: false, quantities: { light: 8, moderate: 10, intense: 12 } },
  { id: "tuck-jumps", kinds: ["finisher"], impact: "high", minIntensity: 3, maxIntensity: 3, static: false, unilateral: false, quantities: { light: 6, moderate: 8, intense: 10 } },
];

const SPEC_BY_ID = new Map(EXERCISE_SPECS.map((spec) => [spec.id, spec]));

// Movement-pattern slot order. Counts are tuned so wall-clock ≈ label
// (work ~35s + transition ~12s per exercise instance, plus between-round rest).
const SLOT_PLANS: Record<CircuitDuration, SlotKind[]> = {
  15: ["cardio", "lower", "upper-push", "pull", "core-static", "core-dynamic"],
  20: ["cardio", "lower", "hinge", "upper-push", "core-static", "core-dynamic"],
  30: ["cardio", "lower", "hinge", "upper-push", "pull", "core-dynamic", "finisher"],
};

const DURATION_CONFIG: Record<
  CircuitDuration,
  { rounds: number; restSeconds: number; restInput: string }
> = {
  // ~6×3 ≈ 15 min · ~6×4 ≈ 20 min · ~7×5 ≈ 30 min
  15: { rounds: 3, restSeconds: 30, restInput: "0:30" },
  20: { rounds: 4, restSeconds: 45, restInput: "0:45" },
  30: { rounds: 5, restSeconds: 60, restInput: "1:00" },
};

interface PickContext {
  duration: CircuitDuration;
  intensity: CircuitIntensity;
  kind: SlotKind;
  usedExerciseIds: Set<string>;
  avoidExerciseId?: string;
  previousSpec?: ExerciseSpec;
  staticCount: number;
}

function slotKindsFor(options: GeneratorOptions): SlotKind[] {
  const base = [...SLOT_PLANS[options.duration]];

  // Light sessions skip high-effort finishers; use static core instead.
  if (options.duration === 30 && options.intensity === "light") {
    return base.map((kind) => (kind === "finisher" ? "core-static" : kind));
  }

  return base;
}

function pickOne<T>(items: T[]): T {
  if (items.length === 0) {
    throw new Error("No exercise candidates available for slot");
  }
  return items[Math.floor(Math.random() * items.length)];
}

function isRoundRep(value: number): boolean {
  return value % 2 === 0 || value % 5 === 0;
}

function snapReps(value: number): number {
  const min = 4;
  let candidate = Math.max(min, value);

  if (isRoundRep(candidate)) return candidate;

  for (let offset = 1; offset <= 5; offset++) {
    const lower = candidate - offset;
    const upper = candidate + offset;
    if (lower >= min && isRoundRep(lower)) return lower;
    if (isRoundRep(upper)) return upper;
  }

  return Math.max(min, Math.round(candidate / 2) * 2);
}

function snapDuration(value: number): number {
  return Math.max(15, Math.round(value / 5) * 5);
}

function jitterReps(value: number): number {
  const deltas = [-2, 0, 0, 2];
  return snapReps(value + pickOne(deltas));
}

function jitterDuration(value: number): number {
  const deltas = [-5, 0, 0, 5];
  return snapDuration(value + pickOne(deltas));
}

function formatQuantityInput(quantityType: QuantityType, value: number): string {
  if (quantityType === "reps") return String(value);

  const minutes = Math.floor(value / 60);
  const seconds = value % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function isAllowedForIntensity(spec: ExerciseSpec, intensity: CircuitIntensity): boolean {
  const level = INTENSITY_LEVEL[intensity];
  if (level < spec.minIntensity || level > spec.maxIntensity) return false;
  if (intensity === "light" && spec.impact === "high") return false;

  if (intensity === "moderate" && spec.kinds.includes("finisher") && spec.impact === "high") {
    return Math.random() < 0.5;
  }

  return true;
}

function isAllowedForCircuit(
  spec: ExerciseSpec,
  intensity: CircuitIntensity,
  duration: CircuitDuration,
): boolean {
  if (!isAllowedForIntensity(spec, intensity)) return false;

  if (spec.durationCaps) {
    const cap = spec.durationCaps[duration];
    if (cap === undefined) return false;
    if (INTENSITY_LEVEL[intensity] > cap) return false;
  }

  return true;
}

function effectivePickWeight(spec: ExerciseSpec, context: PickContext): number {
  let weight = spec.pickWeight ?? 1;
  const level = INTENSITY_LEVEL[context.intensity];

  // Favor exercises whose intensity window fits the session (e.g. light-only in light circuits).
  if (spec.maxIntensity === level && level < 3) weight *= 1.35;
  if (spec.minIntensity === level && level > 1) weight *= 1.3;

  if (context.kind === "cardio") {
    const tier = spec.cardioTier ?? 2;
    if (context.intensity === "intense" && tier === 3) weight *= 2.5;
    else if (context.intensity === "moderate" && tier === 3) weight *= 1.5;
    else if (context.intensity === "intense" && tier === 1) weight *= 0.15;
    else if (context.intensity === "light" && tier === 1) weight *= 1.4;
  }

  return weight;
}

function pickWeighted(specs: ExerciseSpec[], context: PickContext): ExerciseSpec {
  const weights = specs.map((spec) => effectivePickWeight(spec, context));
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  if (total <= 0) return pickOne(specs);

  let roll = Math.random() * total;
  for (let i = 0; i < specs.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return specs[i];
  }

  return specs[specs.length - 1];
}

function candidatesForSlot(
  kind: SlotKind,
  intensity: CircuitIntensity,
  duration: CircuitDuration,
): ExerciseSpec[] {
  let pool = EXERCISE_SPECS.filter(
    (spec) => spec.kinds.includes(kind) && isAllowedForCircuit(spec, intensity, duration),
  );

  if (kind === "cardio" && intensity === "intense") {
    pool = pool.filter((spec) => (spec.cardioTier ?? 2) >= 2);
  }

  return pool;
}

function applyPickConstraints(pool: ExerciseSpec[], context: PickContext): ExerciseSpec[] {
  let filtered = pool.filter(
    (spec) =>
      !context.usedExerciseIds.has(spec.id) && spec.id !== context.avoidExerciseId,
  );

  if (filtered.length === 0) {
    filtered = pool.filter((spec) => spec.id !== context.avoidExerciseId);
  }

  if (filtered.length === 0) {
    filtered = pool;
  }

  const withStaticLimit =
    context.staticCount >= MAX_STATIC_PER_CIRCUIT
      ? filtered.filter((spec) => !spec.static)
      : filtered;

  const withoutConsecutiveStatic =
    context.previousSpec?.static === true
      ? withStaticLimit.filter((spec) => !spec.static)
      : withStaticLimit;

  const withoutConsecutiveUnilateral =
    context.previousSpec?.unilateral === true
      ? withoutConsecutiveStatic.filter((spec) => !spec.unilateral)
      : withoutConsecutiveStatic;

  if (withoutConsecutiveUnilateral.length > 0) return withoutConsecutiveUnilateral;
  if (withoutConsecutiveStatic.length > 0) return withoutConsecutiveStatic;
  if (withStaticLimit.length > 0) return withStaticLimit;
  return filtered;
}

function buildExerciseSet(spec: ExerciseSpec, intensity: CircuitIntensity): ExerciseSet {
  const quantityType = getExerciseQuantityType(spec.id);
  const baseQuantity = spec.quantities[intensity];
  const quantity =
    quantityType === "reps" ? jitterReps(baseQuantity) : jitterDuration(baseQuantity);

  return {
    id: crypto.randomUUID(),
    exerciseId: spec.id,
    quantityType,
    reps: quantityType === "reps" ? quantity : 10,
    durationSeconds: quantityType === "duration" ? quantity : 60,
    quantityInput: formatQuantityInput(quantityType, quantity),
  };
}

function pickExerciseForSlot(
  kind: SlotKind,
  intensity: CircuitIntensity,
  duration: CircuitDuration,
  context: Omit<PickContext, "duration" | "intensity" | "kind">,
): ExerciseSpec {
  const pool = candidatesForSlot(kind, intensity, duration);
  if (pool.length === 0) {
    throw new Error(`No exercises configured for ${kind} at ${intensity} intensity`);
  }

  const pickContext: PickContext = { duration, intensity, kind, ...context };
  return pickWeighted(applyPickConstraints(pool, pickContext), pickContext);
}

function buildCircuitSets(
  slotKinds: SlotKind[],
  options: GeneratorOptions,
): ExerciseSet[] {
  const usedExerciseIds = new Set<string>();
  const specs: ExerciseSpec[] = [];
  let staticCount = 0;

  for (const kind of slotKinds) {
    const spec = pickExerciseForSlot(kind, options.intensity, options.duration, {
      usedExerciseIds,
      previousSpec: specs[specs.length - 1],
      staticCount,
    });
    specs.push(spec);
    usedExerciseIds.add(spec.id);
    if (spec.static) staticCount += 1;
  }

  return specs.map((spec) => buildExerciseSet(spec, options.intensity));
}

export function generateCircuit(options: GeneratorOptions): {
  sets: ExerciseSet[];
  rounds: number;
  restBetweenRoundsSeconds: number;
  restBetweenRoundsInput: string;
} {
  const slotKinds = slotKindsFor(options);
  const config = DURATION_CONFIG[options.duration];

  return {
    sets: buildCircuitSets(slotKinds, options),
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
  const slotKinds = slotKindsFor(options);
  const kind = slotKinds[Math.min(index, slotKinds.length - 1)];
  const currentExerciseId = sets[index]?.exerciseId;
  const usedExerciseIds = new Set(
    sets.filter((_, setIndex) => setIndex !== index).map((set) => set.exerciseId),
  );

  const previousSet = sets[index - 1];
  const previousSpec = previousSet ? SPEC_BY_ID.get(previousSet.exerciseId) : undefined;
  const staticCount = sets.reduce((count, set, setIndex) => {
    if (setIndex === index) return count;
    const spec = SPEC_BY_ID.get(set.exerciseId);
    return spec?.static ? count + 1 : count;
  }, 0);

  const spec = pickExerciseForSlot(kind, options.intensity, options.duration, {
    usedExerciseIds,
    avoidExerciseId: currentExerciseId,
    previousSpec,
    staticCount,
  });

  return buildExerciseSet(spec, options.intensity);
}

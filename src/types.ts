export type QuantityType = "reps" | "duration";

export type ExerciseGroup = "cardio" | "lower" | "upper" | "core" | "finisher";

export interface Exercise {
  id: string;
  name: string;
  group: ExerciseGroup;
}

export interface ExerciseSet {
  id: string;
  exerciseId: string;
  quantityType: QuantityType;
  reps: number;
  durationSeconds: number;
  quantityInput: string;
}

export interface Circuit {
  sets: ExerciseSet[];
  rounds: number;
  restBetweenRoundsSeconds: number;
  restBetweenRoundsInput: string;
}

export type AppPhase = "editing" | "running" | "completed";

export interface WorkoutSession {
  circuit: Circuit;
  currentSetIndex: number;
  currentRound: number;
  startedAt: number;
  completedAt: number | null;
  finishedEarly: boolean;
  isResting: boolean;
}

export interface TimerState {
  running: boolean;
  remainingSeconds: number;
  finished: boolean;
}

export type QuantityType = "reps" | "duration";

export interface Exercise {
  id: string;
  name: string;
}

export interface ExerciseSet {
  id: string;
  exerciseId: string;
  quantityType: QuantityType;
  reps: number;
  durationSeconds: number;
}

export interface Circuit {
  sets: ExerciseSet[];
  rounds: number;
}

export type AppPhase = "editing" | "running" | "completed";

export interface WorkoutSession {
  circuit: Circuit;
  currentSetIndex: number;
  currentRound: number;
  startedAt: number;
  completedAt: number | null;
}

export interface TimerState {
  running: boolean;
  remainingSeconds: number;
  finished: boolean;
}

import type { Circuit, CompletedWorkout, ExerciseSet, QuantityType, SavedCircuit, WorkoutSession } from "./types";
import { getExerciseQuantityType } from "./exercises";
import { createId, formatDuration } from "./utils";

const HISTORY_STORAGE_KEY = "workout-circuit-history";

export function loadHistory(): CompletedWorkout[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as CompletedWorkout[];
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((entry) => entry?.id && entry.completedAt && entry.circuit?.sets)
      .sort((a, b) => b.completedAt - a.completedAt);
  } catch {
    return [];
  }
}

function writeHistory(entries: CompletedWorkout[]): void {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Ignore write failures; history simply won't persist this session.
  }
}

export function saveCompletedWorkout(workout: CompletedWorkout): void {
  const entries = loadHistory().filter((entry) => entry.id !== workout.id);
  entries.unshift(workout);
  writeHistory(entries);
}

export function deleteHistoryEntry(id: string): void {
  writeHistory(loadHistory().filter((entry) => entry.id !== id));
}

export function getHistoryEntry(id: string): CompletedWorkout | null {
  return loadHistory().find((entry) => entry.id === id) ?? null;
}

function exerciseSetFromSaved(set: SavedCircuit["sets"][number]): ExerciseSet {
  const quantityType = getExerciseQuantityType(set.exerciseId);
  return {
    id: createId(),
    exerciseId: set.exerciseId,
    quantityType,
    reps: set.reps,
    durationSeconds: set.durationSeconds,
    quantityInput:
      quantityType === "reps" ? String(set.reps) : formatDuration(set.durationSeconds),
  };
}

export function circuitFromSaved(saved: SavedCircuit): Circuit {
  return {
    sets: saved.sets.map(exerciseSetFromSaved),
    rounds: saved.rounds,
    restBetweenRoundsSeconds: saved.restBetweenRoundsSeconds,
    restBetweenRoundsInput:
      saved.restBetweenRoundsSeconds > 0
        ? formatDuration(saved.restBetweenRoundsSeconds)
        : "",
  };
}

export function buildCompletedWorkout(session: WorkoutSession): CompletedWorkout {
  if (!session.completedAt) {
    throw new Error("Cannot save a workout without a completion time");
  }

  const { circuit, finishedEarly, currentRound, currentSetIndex, isResting } = session;
  const roundsCompleted = finishedEarly
    ? isResting
      ? currentRound
      : currentRound - 1
    : circuit.rounds;
  const stoppedMidRound = finishedEarly && !isResting && currentSetIndex > 0;
  const stoppedExercise = stoppedMidRound ? circuit.sets[currentSetIndex] : null;

  return {
    id: createId(),
    startedAt: session.startedAt,
    completedAt: session.completedAt,
    finishedEarly,
    roundsCompleted,
    plannedRounds: circuit.rounds,
    stoppedAtRound: stoppedMidRound ? currentRound : undefined,
    stoppedAtExerciseId: stoppedExercise?.exerciseId,
    circuit: {
      sets: circuit.sets.map((set) => ({
        exerciseId: set.exerciseId,
        quantityType: set.quantityType as QuantityType,
        reps: set.reps,
        durationSeconds: set.durationSeconds,
      })),
      rounds: circuit.rounds,
      restBetweenRoundsSeconds: circuit.restBetweenRoundsSeconds,
    },
  };
}

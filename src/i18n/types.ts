import type { ExerciseGroup } from "../types";

export interface Messages {
  appTitle: string;
  appDescription: string;
  locale: {
    label: string;
  };
  groups: Record<ExerciseGroup, string>;
  exercises: Record<string, string>;
  editor: {
    title: string;
    subtitle: string;
    exerciseSets: string;
    addExercise: string;
    rounds: string;
    restBetweenRounds: string;
    startCircuit: string;
  };
  generator: {
    title: string;
    copy: string;
    duration: string;
    intensity: string;
    light: string;
    balanced: string;
    intense: string;
    generate: string;
    regenerate: string;
    estimatedMinutes: string;
    durationMin: string;
  };
  set: {
    shuffle: string;
    remove: string;
    exercise: string;
    reps: string;
    duration: string;
    repetitions: string;
    durationHint: string;
  };
  runner: {
    round: string;
    restNextRound: string;
    overview: string;
    recovery: string;
    restBetweenRounds: string;
    restComplete: string;
    restHint: string;
    startNextRound: string;
    currentExercise: string;
    timesUp: string;
    startTimer: string;
    continue: string;
    markDone: string;
    finishCircuit: string;
    backToEditor: string;
  };
  completion: {
    finishedTitle: string;
    completeTitle: string;
    finishedSubtitle: string;
    completeSubtitle: string;
    totalTime: string;
    roundsCompleted: string;
    exercisesPerRound: string;
    restBetweenRounds: string;
    stoppedAt: string;
    stoppedAtValue: string;
    recap: string;
    plannedCircuit: string;
    round: string;
    rounds: string;
    buildNew: string;
    roundsOf: string;
  };
  quantity: {
    reps: string;
  };
  elapsed: {
    seconds: string;
    minutes: string;
  };
}

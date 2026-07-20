import type { Messages } from "./types";
import { exerciseNamesEn } from "./exercises/en";
import { exerciseGuidesEn } from "./guides/en";

export const en: Messages = {
  appTitle: "Home Workout Generator",
  appDescription: "Generate and run home workouts",
  locale: {
    label: "Language",
  },
  groups: {
    cardio: "Cardio",
    lower: "Lower body",
    upper: "Upper body",
    core: "Core",
    finisher: "Full-body finishers",
  },
  exercises: exerciseNamesEn,
  guides: exerciseGuidesEn,
  guide: {
    viewGuide: "How to do this exercise",
    howTo: "How to",
    close: "Close",
    viewGifDemos: "View GIF demos on Google Images",
  },
  editor: {
    title: "Build your circuit",
    subtitle: "Generate a balanced workout in one tap, or build your own.",
    exerciseSets: "Exercise sets",
    addExercise: "+ Add exercise",
    rounds: "Number of rounds",
    restBetweenRounds: "Rest between rounds (optional)",
    startCircuit: "Start circuit",
  },
  nav: {
    build: "Build",
    history: "History",
  },
  generator: {
    title: "Quick circuit",
    copy: "Balanced full-body workouts that feel fresh every time.",
    duration: "Duration",
    intensity: "Intensity",
    light: "Light",
    balanced: "Balanced",
    intense: "Intense",
    generate: "Generate circuit",
    regenerate: "Regenerate circuit",
    durationMin: "{minutes} min",
    howItWorksLink: "How generation works",
  },
  howItWorks: {
    title: "How generation works",
    subtitle: "A closer look at how Quick circuit builds a balanced workout.",
    back: "← Back to editor",
    introTitle: "The idea",
    introBody:
      "The generator does not pick a random list of exercises. It fills a fixed sequence of movement-pattern slots, then chooses a fitting exercise for each slot. Duration and intensity shape which exercises are allowed, how hard the cardio feels, and how many rounds you do.",
    choicesTitle: "Your choices",
    choicesBody:
      "You set two things: session length (15, 20, or 30 minutes) and intensity (Light, Balanced, or Intense). Everything else — slot order, rounds, rest, and exercise pools — follows from those.",
    slotsTitle: "Movement-pattern slots",
    slotsBody:
      "Each duration has a planned order of slots. One exercise is chosen per slot, so shorter sessions cover the essentials and longer ones add hinge, pull, dynamic core, or a finisher.",
    slots15: "15 min — cardio → lower body → push → pull → static core (5 exercises)",
    slots20:
      "20 min — cardio → lower body → hinge → push → static core → dynamic core (6 exercises)",
    slots30:
      "30 min — cardio → lower body → hinge → push → pull → dynamic core → finisher (7 exercises)",
    slotsLightNote:
      "On a 30-minute Light session, the finisher slot is swapped for static core so the workout stays manageable.",
    roundsTitle: "Rounds and rest",
    roundsBody:
      "Duration also sets how many times you repeat the circuit and how long you rest between rounds. You can still edit these afterward.",
    rounds15: "15 min — 3 rounds, 30 seconds rest",
    rounds20: "20 min — 3 rounds, 45 seconds rest",
    rounds30: "30 min — 4 rounds, 60 seconds rest",
    filterTitle: "Which exercises can appear",
    filterBody:
      "Every exercise in the catalog has intensity bounds, impact level, and optional rules. For each slot, the generator keeps only candidates that fit the session.",
    filterIntensity:
      "Intensity window — an exercise only appears if your chosen intensity sits between its minimum and maximum.",
    filterImpact:
      "Impact — Light never picks high-impact moves. On Balanced, high-impact finishers are only sometimes allowed.",
    filterCaps:
      "Duration caps — a few beginner-friendly moves (like wall push-ups) are limited to shorter sessions or lower intensities.",
    filterCardio:
      "Cardio drive — on Intense, low-drive cardio (marching in place, toe taps, and similar) is dropped so the opener stays snappy.",
    constraintsTitle: "Balance rules",
    constraintsBody:
      "After the pool is filtered, soft rules keep the circuit from feeling repetitive or awkward to perform.",
    constraintsUnique:
      "Prefer unused exercises so the same move does not show up twice in one circuit.",
    constraintsStatic: "At most two static holds (planks, wall sits, and similar) per circuit.",
    constraintsConsecutive:
      "Avoid two static holds in a row, and avoid two single-side (unilateral) exercises in a row.",
    constraintsFallback:
      "If a rule would empty the pool, it is relaxed step by step so a circuit can still be built.",
    weightsTitle: "Weighted picks",
    weightsBody:
      "From the remaining candidates, selection is random but weighted. Exercises that fit the intensity especially well are favored. Accessory moves have lower weight. On Intense cardio, high-drive options are much more likely; on Light, gentler cardio gets a boost.",
    quantitiesTitle: "Reps and durations",
    quantitiesBody:
      "Each exercise has base reps or hold times for Light, Balanced, and Intense. The generator adds a small random jitter, then snaps to clean numbers (even or multiples of 5 for reps; multiples of 5 seconds for timed holds).",
    shuffleTitle: "Shuffle one exercise",
    shuffleBody:
      "The shuffle button on a set redraws only that slot. It keeps the same movement pattern, respects the rest of the circuit, and avoids re-picking the exercise you just shuffled away.",
    editTitle: "You stay in control",
    editBody:
      "After generation you can change any exercise, edit quantities, add or remove sets, and adjust rounds or rest. Generation is a smart starting point — not a locked program.",
  },
  set: {
    shuffle: "Shuffle exercise",
    remove: "Remove exercise",
    exercise: "Exercise",
    reps: "Reps",
    duration: "Duration",
    repsPerSide: "Reps / side",
    durationPerSide: "Duration / side",
    perSideTooltip: "Do this full amount on each side — left, then right.",
    repetitions: "Repetitions",
    durationHint: "Duration (mm:ss or seconds)",
    durationHintPerSide: "Per side (mm:ss or seconds)",
  },
  runner: {
    round: "Round {current} / {total}",
    restNextRound: "Rest · Round {round} next",
    overview: "Circuit overview",
    recovery: "Recovery",
    restBetweenRounds: "Rest between rounds",
    restComplete: "Rest complete!",
    restHint: "Recover before the next round.",
    startNextRound: "Start next round",
    currentExercise: "Current exercise",
    timesUp: "Time's up!",
    startTimer: "Start timer",
    continue: "Continue",
    switchSide: "Switch side",
    markDone: "Mark as done",
    finishCircuit: "Finish circuit",
    finishCircuitConfirmTitle: "Finish circuit?",
    finishCircuitConfirmMessage:
      "Your progress will be saved, but the circuit will end before all rounds are done.",
    finishCircuitConfirmAction: "Yes, finish circuit",
    finishCircuitCancel: "Keep going",
    backToEditor: "← Back to editor",
  },
  sides: {
    left: "Left",
    right: "Right",
    sideOf: "Side {current} of {total}",
  },
  completion: {
    finishedTitle: "Circuit finished!",
    completeTitle: "Circuit complete!",
    finishedSubtitle: "Nice work — here's your recap so far.",
    completeSubtitle: "Great work — you finished every round.",
    totalTime: "Total time",
    roundsCompleted: "Rounds completed",
    exercisesPerRound: "Exercises per round",
    restBetweenRounds: "Rest between rounds",
    stoppedAt: "Stopped at",
    stoppedAtValue: "Round {round}, {exercise}",
    recap: "Recap",
    round: "{count} round",
    rounds: "{count} rounds",
    buildNew: "Build a new circuit",
    roundsOf: "{completed} of {total}",
  },
  history: {
    title: "Past circuits",
    subtitle: "Your completed workouts, newest first.",
    empty: "Completed circuits will appear here.",
    completed: "Complete",
    finishedEarly: "Finished early",
    back: "← Past circuits",
    delete: "Delete",
    deleteConfirmTitle: "Delete past circuit?",
    deleteConfirmMessage: "This circuit will be permanently removed from your history.",
    deleteConfirmAction: "Yes, delete",
    deleteConfirmCancel: "Cancel",
    redoInEditor: "Redo this circuit",
    summary: "{duration} · {rounds}",
    detailTitle: "Past circuit",
    detailSubtitle: "Completed on {date}",
    detailSubtitleEarly: "Finished early on {date}",
    effort: "{score}/10",
    effortLabel: "Effort score",
    effortTooltip:
      "Estimates workout difficulty from session duration and exercise intensity, on a scale of 1 (light) to 10 (intense).",
    listDateLabel: "Date",
    listSessionLabel: "Session",
    listMeta: "{duration} · {rounds}",
    effortChartTitle: "Effort over time",
    regularityTitle: "Consistency",
    chartNeedsMore: "Complete more circuits to see your effort trend.",
    weekStreak: "{count} week streak",
    weekStreaks: "{count} week streak",
    weeklyAverage: "{count} / week avg",
  },
  quantity: {
    reps: "{count} reps",
    repsSides: "{count} reps × {sides}",
    durationSides: "{duration} × {sides}",
  },
  elapsed: {
    seconds: "{seconds}s",
    minutes: "{minutes}m {seconds}s",
  },
};

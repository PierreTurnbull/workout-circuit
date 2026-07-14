import { registerSW } from "virtual:pwa-register";
import type {
  AppPhase,
  Circuit,
  ExerciseSet,
  QuantityType,
  TimerState,
  WorkoutSession,
} from "./types";
import {
  DEFAULT_EXERCISE_ID,
  getExerciseGroup,
  getExerciseName,
  getGroupedExercises,
} from "./exercises";
import { getExerciseGifSearchUrl } from "./exercise-search";
import {
  applyDocumentLocale,
  getLocalePreference,
  messages,
  setLocalePreference,
  tExerciseGuide,
  tGroup,
  tGeneratorDuration,
  tRecapRounds,
  tRestNextRound,
  tRoundBadge,
  tRoundsCompleted,
  tStoppedAt,
  type LocalePreference,
} from "./i18n";
import {
  generateCircuit,
  regenerateExerciseAtIndex,
  type CircuitDuration,
  type CircuitIntensity,
  type GeneratorOptions,
} from "./generator";
import { playTimerDoneAlert } from "./alerts";
import {
  createId,
  formatDuration,
  formatElapsed,
  formatQuantity,
  parseDurationInput,
} from "./utils";
import "./styles.css";

const app = document.getElementById("app")!;

let phase: AppPhase = "editing";
let circuit: Circuit = {
  sets: [createDefaultSet()],
  rounds: 3,
  restBetweenRoundsSeconds: 0,
  restBetweenRoundsInput: "",
};
let session: WorkoutSession | null = null;
let timer: TimerState = {
  running: false,
  remainingSeconds: 0,
  finished: false,
};
let timerInterval: number | null = null;

let generatorDuration: CircuitDuration = 20;
let generatorIntensity: CircuitIntensity = "moderate";
let lastGeneratedOptions: GeneratorOptions | null = null;
let openGuideExerciseId: string | null = null;
let guideEscapeHandler: ((event: KeyboardEvent) => void) | null = null;

function createDefaultSet(): ExerciseSet {
  return {
    id: createId(),
    exerciseId: DEFAULT_EXERCISE_ID,
    quantityType: "reps",
    reps: 10,
    durationSeconds: 60,
    quantityInput: "10",
  };
}

function resetTimer(): void {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  timer = { running: false, remainingSeconds: 0, finished: false };
}

function render(): void {
  app.innerHTML = "";

  if (phase === "editing") {
    renderEditor();
  } else if (phase === "running" && session) {
    renderRunner();
  } else if (phase === "completed" && session) {
    renderCompletion();
  }

  renderGuideOverlay();
}

function openExerciseGuide(exerciseId: string): void {
  if (!tExerciseGuide(exerciseId)) return;
  openGuideExerciseId = exerciseId;
  renderGuideOverlay();
}

function closeExerciseGuide(): void {
  openGuideExerciseId = null;
  removeGuideOverlay();
  if (guideEscapeHandler) {
    document.removeEventListener("keydown", guideEscapeHandler);
    guideEscapeHandler = null;
  }
}

function removeGuideOverlay(): void {
  document.getElementById("exercise-guide-overlay")?.remove();
}

function renderGuideOverlay(): void {
  removeGuideOverlay();
  if (!openGuideExerciseId) return;

  const guide = tExerciseGuide(openGuideExerciseId);
  if (!guide) return;

  const exerciseName = getExerciseName(openGuideExerciseId);
  const exerciseGroup = getExerciseGroup(openGuideExerciseId);
  const gifSearchUrl = getExerciseGifSearchUrl(exerciseName);

  const overlay = el(
    "div",
    {
      id: "exercise-guide-overlay",
      className: "guide-overlay",
      role: "dialog",
      ariaLabel: getExerciseName(openGuideExerciseId),
    },
    [
      el("button", {
        type: "button",
        className: "guide-backdrop",
        ariaLabel: messages.guide.close,
        onClick: closeExerciseGuide,
      }),
      el("div", { className: "guide-sheet" }, [
        el("header", { className: "guide-header" }, [
          el("div", { className: "guide-heading" }, [
            el("h2", {
              className: "guide-title",
              text: exerciseName,
            }),
            exerciseGroup
              ? el("span", {
                  className: "guide-category",
                  text: tGroup(exerciseGroup),
                })
              : null,
          ]),
          el(
            "button",
            {
              type: "button",
              className: "btn-icon guide-close-btn",
              ariaLabel: messages.guide.close,
              onClick: closeExerciseGuide,
            },
            "×",
          ),
        ]),
        el("p", { className: "guide-summary", text: guide.summary }),
        el(
          "a",
          {
            className: "guide-gif-search",
            href: gifSearchUrl,
            text: messages.guide.viewGifDemos,
          },
        ),
        el("h3", { className: "guide-steps-title", text: messages.guide.howTo }),
        el(
          "ol",
          { className: "guide-steps" },
          guide.steps.map((step) => el("li", { text: step })),
        ),
      ]),
    ],
  );

  document.body.appendChild(overlay);

  if (!guideEscapeHandler) {
    guideEscapeHandler = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeExerciseGuide();
    };
    document.addEventListener("keydown", guideEscapeHandler);
  }
}

function renderExerciseInfoButton(exerciseId: string): HTMLElement | null {
  if (!tExerciseGuide(exerciseId)) return null;

  return el(
    "button",
    {
      type: "button",
      className: "btn-icon exercise-info-btn",
      title: messages.guide.viewGuide,
      ariaLabel: messages.guide.viewGuide,
      onClick: () => openExerciseGuide(exerciseId),
    },
    "i",
  );
}

function renderLocalePicker(): HTMLElement {
  return el("label", { className: "locale-picker" }, [
    el("span", { className: "locale-picker-label", text: messages.locale.label }),
    el("select", {
      className: "input locale-picker-select",
      value: getLocalePreference(),
      onChange: (e) => {
        setLocalePreference((e.target as HTMLSelectElement).value as LocalePreference);
        render();
      },
    }, [
      el("option", { value: "auto", text: "Auto" }),
      el("option", { value: "en", text: "English" }),
      el("option", { value: "fr", text: "Français" }),
    ]),
  ]);
}

function renderEditor(): void {
  const container = el("div", { className: "screen editor-screen" });

  container.append(
    el("header", { className: "screen-header screen-header-with-locale" }, [
      el("div", { className: "screen-header-main" }, [
        el("h1", { text: messages.editor.title }),
        el("p", {
          className: "subtitle",
          text: messages.editor.subtitle,
        }),
      ]),
      renderLocalePicker(),
    ]),
    renderGeneratorCard(),
    el("section", { className: "card sets-card" }, [
      el("h2", { className: "section-title", text: messages.editor.exerciseSets }),
      ...circuit.sets.map((set, index) => renderSetEditor(set, index)),
      el(
        "button",
        {
          className: "btn btn-secondary btn-block",
          onClick: addSet,
        },
        messages.editor.addExercise,
      ),
    ]),
    el("section", { className: "card rounds-card" }, [
      el("label", { className: "field-label", text: messages.editor.rounds }),
      el("input", {
        className: "input rounds-input",
        type: "number",
        min: "1",
        max: "99",
        value: String(circuit.rounds),
        onInput: (e) => {
          const value = parseInt((e.target as HTMLInputElement).value, 10);
          circuit.rounds = Number.isFinite(value) && value >= 1 ? value : 1;
        },
      }),
      el("label", { className: "field-label", text: messages.editor.restBetweenRounds }),
      el("input", {
        className: "input rest-input",
        type: "text",
        inputMode: "text",
        placeholder: "0:30",
        value: circuit.restBetweenRoundsInput,
        onInput: (e) => updateRestBetweenRounds((e.target as HTMLInputElement).value),
      }),
    ]),
    el(
      "button",
      {
        className: "btn btn-primary btn-block btn-lg",
        onClick: startCircuit,
        disabled: circuit.sets.length === 0,
      },
      messages.editor.startCircuit,
    ),
  );

  app.append(container);
}

function renderGeneratorCard(): HTMLElement {
  return el("section", { className: "card generator-card" }, [
    el("h2", { className: "section-title", text: messages.generator.title }),
    el("p", { className: "generator-copy", text: messages.generator.copy }),
    el("p", { className: "field-label", text: messages.generator.duration }),
    el("div", { className: "chip-group" }, [
      durationChip(15),
      durationChip(20),
      durationChip(30),
    ]),
    el("p", { className: "field-label", text: messages.generator.intensity }),
    el("div", { className: "chip-group" }, [
      intensityChip("light", messages.generator.light),
      intensityChip("moderate", messages.generator.balanced),
      intensityChip("intense", messages.generator.intense),
    ]),
    el(
      "button",
      {
        className: "btn btn-accent btn-block btn-lg",
        onClick: applyGeneratedCircuit,
      },
      lastGeneratedOptions ? messages.generator.regenerate : messages.generator.generate,
    ),
  ]);
}

function durationChip(duration: CircuitDuration): HTMLElement {
  return el(
    "button",
    {
      type: "button",
      className: `chip-btn ${generatorDuration === duration ? "active" : ""}`,
      onClick: () => {
        generatorDuration = duration;
        render();
      },
    },
    tGeneratorDuration(duration),
  );
}

function intensityChip(intensity: CircuitIntensity, label: string): HTMLElement {
  return el(
    "button",
    {
      type: "button",
      className: `chip-btn ${generatorIntensity === intensity ? "active" : ""}`,
      onClick: () => {
        generatorIntensity = intensity;
        render();
      },
    },
    label,
  );
}

function currentGeneratorOptions(): GeneratorOptions {
  return {
    duration: generatorDuration,
    intensity: generatorIntensity,
  };
}

function applyGeneratedCircuit(): void {
  const options = currentGeneratorOptions();
  const generated = generateCircuit(options);

  circuit.sets = generated.sets;
  circuit.rounds = generated.rounds;
  circuit.restBetweenRoundsSeconds = generated.restBetweenRoundsSeconds;
  circuit.restBetweenRoundsInput = generated.restBetweenRoundsInput;
  lastGeneratedOptions = options;
  render();
}

function shuffleExercise(setId: string): void {
  syncEditorFromDom();

  const index = circuit.sets.findIndex((set) => set.id === setId);
  if (index === -1) return;

  const options = lastGeneratedOptions ?? currentGeneratorOptions();
  circuit.sets[index] = regenerateExerciseAtIndex(index, circuit.sets, options);
  render();
}

function renderSetEditor(set: ExerciseSet, index: number): HTMLElement {
  return el("article", { className: "set-row", dataset: { id: set.id } }, [
    el("div", { className: "set-row-top" }, [
      el("span", { className: "set-index", text: `#${index + 1}` }),
      el(
        "select",
        {
          className: "input set-exercise-select",
          value: set.exerciseId,
          ariaLabel: `${messages.set.exercise} #${index + 1}`,
          onChange: () => {
            syncEditorFromDom();
            render();
          },
        },
        getGroupedExercises().map((group) =>
          el(
            "optgroup",
            { label: group.label },
            group.exercises.map((exercise) =>
              el("option", {
                value: exercise.id,
                text: getExerciseName(exercise.id),
                selected: exercise.id === set.exerciseId,
              }),
            ),
          ),
        ),
      ),
      renderExerciseInfoButton(set.exerciseId),
      el(
        "button",
        {
          className: "btn-icon shuffle-btn",
          title: messages.set.shuffle,
          ariaLabel: messages.set.shuffle,
          onClick: () => shuffleExercise(set.id),
        },
        "↻",
      ),
      el(
        "button",
        {
          className: "btn-icon",
          title: messages.set.remove,
          ariaLabel: messages.set.remove,
          onClick: () => removeSet(set.id),
          disabled: circuit.sets.length === 1,
        },
        "×",
      ),
    ]),
    el("div", { className: "set-row-bottom" }, [
      el("div", { className: "quantity-type-toggle" }, [
        quantityTypeButton(set, "reps", messages.set.reps),
        quantityTypeButton(set, "duration", messages.set.duration),
      ]),
      el("input", {
        className: "input set-quantity-input",
        type: "text",
        inputMode: set.quantityType === "reps" ? "numeric" : "text",
        placeholder: set.quantityType === "reps" ? "10" : "1:30",
        value: set.quantityInput,
        ariaLabel: quantityLabel(set.quantityType),
        dataset: { quantityInput: "true" },
        onInput: (e) => updateQuantity(set, (e.target as HTMLInputElement).value),
      }),
    ]),
  ]);
}

function quantityTypeButton(
  set: ExerciseSet,
  type: QuantityType,
  label: string,
): HTMLElement {
  return el(
    "button",
    {
      type: "button",
      className: `toggle-btn ${set.quantityType === type ? "active" : ""}`,
      onClick: () => {
        set.quantityType = type;
        set.quantityInput =
          type === "reps" ? String(set.reps) : formatDuration(set.durationSeconds);
        render();
      },
    },
    label,
  );
}

function quantityLabel(type: QuantityType): string {
  return type === "reps" ? messages.set.repetitions : messages.set.durationHint;
}

function updateQuantity(set: ExerciseSet, raw: string): void {
  set.quantityInput = raw;

  if (set.quantityType === "reps") {
    const value = parseInt(raw, 10);
    if (Number.isFinite(value) && value > 0) {
      set.reps = value;
    }
    return;
  }

  const seconds = parseDurationInput(raw);
  if (seconds !== null && seconds > 0) {
    set.durationSeconds = seconds;
  }
}

function updateRestBetweenRounds(raw: string): void {
  circuit.restBetweenRoundsInput = raw;

  if (!raw.trim()) {
    circuit.restBetweenRoundsSeconds = 0;
    return;
  }

  const seconds = parseDurationInput(raw);
  if (seconds !== null && seconds >= 0) {
    circuit.restBetweenRoundsSeconds = seconds;
  }
}

function syncEditorFromDom(): void {
  if (phase !== "editing") return;

  app.querySelectorAll<HTMLElement>(".set-row").forEach((row) => {
    const set = circuit.sets.find((item) => item.id === row.dataset.id);
    if (!set) return;

    const select = row.querySelector("select");
    if (select instanceof HTMLSelectElement) {
      set.exerciseId = select.value || DEFAULT_EXERCISE_ID;
    }

    const quantityInput = row.querySelector("[data-quantity-input]");
    if (quantityInput instanceof HTMLInputElement) {
      updateQuantity(set, quantityInput.value);
    }
  });

  const roundsInput = app.querySelector(".rounds-input");
  if (roundsInput instanceof HTMLInputElement) {
    const value = parseInt(roundsInput.value, 10);
    circuit.rounds = Number.isFinite(value) && value >= 1 ? value : 1;
  }

  const restInput = app.querySelector(".rest-input");
  if (restInput instanceof HTMLInputElement) {
    updateRestBetweenRounds(restInput.value);
  }
}

function addSet(): void {
  syncEditorFromDom();
  circuit.sets.push(createDefaultSet());
  render();
}

function removeSet(id: string): void {
  if (circuit.sets.length <= 1) return;
  syncEditorFromDom();
  circuit.sets = circuit.sets.filter((set) => set.id !== id);
  render();
}

function startCircuit(): void {
  if (circuit.sets.length === 0) return;

  syncEditorFromDom();
  resetTimer();
  session = {
    circuit: {
      sets: circuit.sets.map((set) => ({ ...set })),
      rounds: circuit.rounds,
      restBetweenRoundsSeconds: circuit.restBetweenRoundsSeconds,
      restBetweenRoundsInput: circuit.restBetweenRoundsInput,
    },
    currentSetIndex: 0,
    currentRound: 1,
    startedAt: Date.now(),
    completedAt: null,
    finishedEarly: false,
    isResting: false,
  };
  phase = "running";
  startElapsedTicker();
  render();
}

function renderRunner(): void {
  if (!session) return;

  const { circuit: activeCircuit, currentSetIndex, currentRound, isResting } = session;

  const container = el("div", { className: "screen runner-screen" });

  container.append(
    renderLocalePicker(),
    el("header", { className: "screen-header runner-header" }, [
      el(
        "div",
        {
          className: `round-badge ${isResting ? "rest-badge" : ""}`,
          text: isResting
            ? tRestNextRound(currentRound + 1)
            : tRoundBadge(currentRound, activeCircuit.rounds),
        },
      ),
      el("p", {
        className: "elapsed",
        text: formatElapsed(Date.now() - session.startedAt),
      }),
    ]),
    el("section", { className: "card overview-card" }, [
      el("h2", { className: "section-title", text: messages.runner.overview }),
      el(
        "ul",
        { className: "overview-list" },
        activeCircuit.sets.map((set, index) => {
          const isCurrent = !isResting && index === currentSetIndex;
          const isDone =
            isResting ||
            index < currentSetIndex ||
            (index === currentSetIndex && timer.finished);

          return el(
            "li",
            {
              className: `overview-item ${isCurrent ? "current" : ""} ${isDone && !isCurrent ? "done" : ""}`,
            },
            [
              el("span", { className: "overview-name", text: getExerciseName(set.exerciseId) }),
              el("span", {
                className: "overview-qty",
                text: formatQuantity(set.quantityType, set.reps, set.durationSeconds),
              }),
            ],
          );
        }),
      ),
    ]),
    isResting
      ? el("section", { className: "card current-exercise-card rest-card" }, [
          el("p", { className: "current-label", text: messages.runner.recovery }),
          el("h2", { className: "current-name", text: messages.runner.restBetweenRounds }),
          el("p", {
            className: "current-qty",
            text: formatDuration(activeCircuit.restBetweenRoundsSeconds),
          }),
          renderRestPanel(),
        ])
      : renderActiveExerciseCard(activeCircuit.sets[currentSetIndex]),
    el(
      "button",
      {
        className: "btn btn-ghost btn-block",
        onClick: finishCircuit,
      },
      messages.runner.finishCircuit,
    ),
    el(
      "button",
      {
        className: "btn btn-ghost btn-block",
        onClick: backToEditor,
      },
      messages.runner.backToEditor,
    ),
  );

  app.append(container);
}

function renderActiveExerciseCard(currentSet: ExerciseSet): HTMLElement {
  const isDuration = currentSet.quantityType === "duration";

  return el("section", { className: "card current-exercise-card" }, [
    el("p", { className: "current-label", text: messages.runner.currentExercise }),
    el("div", { className: "current-name-row" }, [
      el("h2", {
        className: "current-name",
        text: getExerciseName(currentSet.exerciseId),
      }),
      renderExerciseInfoButton(currentSet.exerciseId),
    ]),
    el("p", {
      className: "current-qty",
      text: formatQuantity(
        currentSet.quantityType,
        currentSet.reps,
        currentSet.durationSeconds,
      ),
    }),
    isDuration ? renderTimerPanel(currentSet, completeCurrentExercise) : renderRepsPanel(),
  ]);
}

function renderRestPanel(): HTMLElement {
  const displaySeconds = timer.running || timer.finished
    ? timer.remainingSeconds
    : session!.circuit.restBetweenRoundsSeconds;

  return el("div", { className: "timer-panel" }, [
    el("div", {
      className: `timer-display ${timer.finished ? "finished" : ""}`,
      text: formatDuration(displaySeconds),
    }),
    timer.finished
      ? el("p", { className: "timer-done-msg", text: messages.runner.restComplete })
      : el("p", { className: "rest-hint", text: messages.runner.restHint }),
    timer.finished
      ? el(
          "button",
          {
            className: "btn btn-accent btn-block btn-lg",
            onClick: completeRest,
          },
          messages.runner.startNextRound,
        )
      : null,
  ]);
}

function renderTimerPanel(set: ExerciseSet, onComplete: () => void): HTMLElement {
  const canContinue = timer.finished;
  const displaySeconds = timer.running || timer.finished
    ? timer.remainingSeconds
    : set.durationSeconds;

  return el("div", { className: "timer-panel" }, [
    el("div", {
      className: `timer-display ${timer.finished ? "finished" : ""}`,
      text: formatDuration(displaySeconds),
    }),
    timer.finished
      ? el("p", { className: "timer-done-msg", text: messages.runner.timesUp })
      : null,
    !timer.running && !timer.finished
      ? el(
          "button",
          {
            className: "btn btn-primary btn-block btn-lg",
            onClick: () => startTimer(set.durationSeconds),
          },
          messages.runner.startTimer,
        )
      : null,
    canContinue
      ? el(
          "button",
          {
            className: "btn btn-accent btn-block btn-lg",
            onClick: onComplete,
          },
          messages.runner.continue,
        )
      : null,
  ]);
}

function renderRepsPanel(): HTMLElement {
  return el("div", { className: "reps-panel" }, [
    el(
      "button",
      {
        className: "btn btn-accent btn-block btn-lg",
        onClick: completeCurrentExercise,
      },
      messages.runner.markDone,
    ),
  ]);
}

function startTimer(totalSeconds: number): void {
  resetTimer();
  timer = {
    running: true,
    remainingSeconds: totalSeconds,
    finished: false,
  };

  timerInterval = window.setInterval(() => {
    timer.remainingSeconds -= 1;

    if (timer.remainingSeconds <= 0) {
      timer.remainingSeconds = 0;
      timer.running = false;
      timer.finished = true;
      if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      void playTimerDoneAlert();
    }

    render();
  }, 1000);

  render();
}

function completeCurrentExercise(): void {
  if (!session) return;

  resetTimer();

  const { circuit: activeCircuit } = session;
  const isLastSet = session.currentSetIndex >= activeCircuit.sets.length - 1;

  if (!isLastSet) {
    session.currentSetIndex += 1;
    render();
    return;
  }

  const isLastRound = session.currentRound >= activeCircuit.rounds;

  if (!isLastRound) {
    if (activeCircuit.restBetweenRoundsSeconds > 0) {
      session.isResting = true;
      startTimer(activeCircuit.restBetweenRoundsSeconds);
      return;
    }

    session.currentRound += 1;
    session.currentSetIndex = 0;
    render();
    return;
  }

  session.completedAt = Date.now();
  session.finishedEarly = false;
  phase = "completed";
  stopElapsedTicker();
  render();
}

function completeRest(): void {
  if (!session?.isResting) return;

  resetTimer();
  session.isResting = false;
  session.currentRound += 1;
  session.currentSetIndex = 0;
  render();
}

function finishCircuit(): void {
  if (!session) return;

  resetTimer();
  session.completedAt = Date.now();
  session.finishedEarly = true;
  phase = "completed";
  stopElapsedTicker();
  render();
}

function backToEditor(): void {
  resetTimer();
  stopElapsedTicker();
  phase = "editing";
  session = null;
  render();
}

function renderCompletion(): void {
  if (!session?.completedAt) return;

  const totalMs = session.completedAt - session.startedAt;
  const { circuit: activeCircuit, finishedEarly, currentRound, currentSetIndex, isResting } =
    session;
  const fullRoundsCompleted = finishedEarly
    ? isResting
      ? currentRound
      : currentRound - 1
    : activeCircuit.rounds;
  const stoppedMidRound = finishedEarly && !isResting && currentSetIndex > 0;
  const stoppedExercise = stoppedMidRound
    ? activeCircuit.sets[currentSetIndex]
    : null;

  const container = el("div", { className: "screen completion-screen" });

  container.append(
    renderLocalePicker(),
    el("header", { className: "completion-header" }, [
      el("div", { className: "completion-icon", text: "🎉" }),
      el("h1", { text: finishedEarly ? messages.completion.finishedTitle : messages.completion.completeTitle }),
      el("p", {
        className: "subtitle",
        text: finishedEarly
          ? messages.completion.finishedSubtitle
          : messages.completion.completeSubtitle,
      }),
    ]),
    el("section", { className: "card stats-card" }, [
      el("div", { className: "stat" }, [
        el("span", { className: "stat-label", text: messages.completion.totalTime }),
        el("span", { className: "stat-value", text: formatElapsed(totalMs) }),
      ]),
      el("div", { className: "stat" }, [
        el("span", { className: "stat-label", text: messages.completion.roundsCompleted }),
        el("span", {
          className: "stat-value",
          text: finishedEarly
            ? tRoundsCompleted(fullRoundsCompleted, activeCircuit.rounds)
            : String(activeCircuit.rounds),
        }),
      ]),
      el("div", { className: "stat" }, [
        el("span", { className: "stat-label", text: messages.completion.exercisesPerRound }),
        el("span", { className: "stat-value", text: String(activeCircuit.sets.length) }),
      ]),
      activeCircuit.restBetweenRoundsSeconds > 0
        ? el("div", { className: "stat" }, [
            el("span", { className: "stat-label", text: messages.completion.restBetweenRounds }),
            el("span", {
              className: "stat-value",
              text: formatDuration(activeCircuit.restBetweenRoundsSeconds),
            }),
          ])
        : null,
      stoppedMidRound && stoppedExercise
        ? el("div", { className: "stat" }, [
            el("span", { className: "stat-label", text: messages.completion.stoppedAt }),
            el("span", {
              className: "stat-value",
              text: tStoppedAt(currentRound, getExerciseName(stoppedExercise.exerciseId)),
            }),
          ])
        : null,
    ]),
    el("section", { className: "card recap-card" }, [
      el("h2", { className: "section-title", text: messages.completion.recap }),
      el(
        "ul",
        { className: "recap-list" },
        activeCircuit.sets.map((set) => {
          const roundsLabel = tRecapRounds(fullRoundsCompleted);

          return el("li", { className: "recap-item" }, [
            el("span", { text: getExerciseName(set.exerciseId) }),
            el("span", {
              className: "recap-qty",
              text: `${formatQuantity(set.quantityType, set.reps, set.durationSeconds)} × ${roundsLabel}`,
            }),
          ]);
        }),
      ),
    ]),
    el(
      "button",
      {
        className: "btn btn-primary btn-block btn-lg",
        onClick: () => {
          resetTimer();
          stopElapsedTicker();
          phase = "editing";
          session = null;
          render();
        },
      },
      messages.completion.buildNew,
    ),
  );

  app.append(container);
}

type ElAttrs = {
  id?: string;
  className?: string;
  text?: string;
  type?: string;
  value?: string;
  src?: string;
  alt?: string;
  min?: string;
  max?: string;
  placeholder?: string;
  inputMode?: string;
  title?: string;
  label?: string;
  href?: string;
  role?: string;
  ariaLabel?: string;
  disabled?: boolean;
  selected?: boolean;
  dataset?: Record<string, string>;
  onClick?: () => void;
  onInput?: (e: Event) => void;
  onChange?: (e: Event) => void;
};

type ElChild = HTMLElement | string | null;
type ElChildren = ElChild | ElChild[];

function normalizeChildren(children?: ElChildren): ElChild[] {
  if (children === undefined) return [];
  return Array.isArray(children) ? children : [children];
}

function el(tag: string, attrs: ElAttrs = {}, children?: ElChildren): HTMLElement {
  const node = document.createElement(tag);
  const childList = normalizeChildren(children);
  const isSelect = tag === "select";

  if (attrs.className) node.className = attrs.className;
  if (attrs.id) node.id = attrs.id;
  if (attrs.text && childList.length === 0) node.textContent = attrs.text;
  if (attrs.type) node.setAttribute("type", attrs.type);
  if (attrs.role) node.setAttribute("role", attrs.role);
  if (attrs.ariaLabel) node.setAttribute("aria-label", attrs.ariaLabel);
  if (attrs.href && node instanceof HTMLAnchorElement) {
    node.href = attrs.href;
    node.target = "_blank";
    node.rel = "noopener noreferrer";
  }
  if (attrs.src && node instanceof HTMLImageElement) node.src = attrs.src;
  if (attrs.alt !== undefined && node instanceof HTMLImageElement) node.alt = attrs.alt;
  if (attrs.value !== undefined) {
    if (node instanceof HTMLInputElement || node instanceof HTMLOptionElement) {
      node.value = attrs.value;
    }
  }
  if (attrs.min) (node as HTMLInputElement).min = attrs.min;
  if (attrs.max) (node as HTMLInputElement).max = attrs.max;
  if (attrs.placeholder) (node as HTMLInputElement).placeholder = attrs.placeholder;
  if (attrs.inputMode) (node as HTMLInputElement).inputMode = attrs.inputMode as HTMLInputElement["inputMode"];
  if (attrs.title) node.title = attrs.title;
  if (attrs.label && node instanceof HTMLOptGroupElement) node.label = attrs.label;
  if (attrs.disabled) (node as HTMLButtonElement).disabled = attrs.disabled;
  if (attrs.selected && node instanceof HTMLOptionElement) node.selected = true;
  if (attrs.dataset) {
    Object.entries(attrs.dataset).forEach(([key, value]) => {
      node.dataset[key] = value;
    });
  }
  if (attrs.onClick) node.addEventListener("click", attrs.onClick);
  if (attrs.onInput) node.addEventListener("input", attrs.onInput);
  if (attrs.onChange) node.addEventListener("change", attrs.onChange);

  for (const child of childList) {
    if (child === null) continue;
    if (typeof child === "string") {
      node.appendChild(document.createTextNode(child));
    } else {
      node.appendChild(child);
    }
  }

  if (isSelect && attrs.value !== undefined) {
    const select = node as HTMLSelectElement;
    const hasOption = Array.from(select.options).some((option) => option.value === attrs.value);
    select.value = hasOption ? attrs.value : DEFAULT_EXERCISE_ID;
  }

  return node;
}

let elapsedInterval: number | null = null;

function startElapsedTicker(): void {
  stopElapsedTicker();
  elapsedInterval = window.setInterval(() => {
    if (phase === "running") render();
  }, 1000);
}

function stopElapsedTicker(): void {
  if (elapsedInterval !== null) {
    clearInterval(elapsedInterval);
    elapsedInterval = null;
  }
}

applyDocumentLocale();
render();
registerSW({ immediate: true });

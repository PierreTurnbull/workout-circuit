import { registerSW } from "virtual:pwa-register";
import type {
  AppPhase,
  Circuit,
  ExerciseSet,
  QuantityType,
  TimerState,
  WorkoutSession,
} from "./types";
import { EXERCISES, getExerciseName } from "./exercises";
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
};
let session: WorkoutSession | null = null;
let timer: TimerState = {
  running: false,
  remainingSeconds: 0,
  finished: false,
};
let timerInterval: number | null = null;

function createDefaultSet(): ExerciseSet {
  return {
    id: createId(),
    exerciseId: EXERCISES[0].id,
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
}

function renderEditor(): void {
  const container = el("div", { className: "screen editor-screen" });

  container.append(
    el("header", { className: "screen-header" }, [
      el("h1", { text: "Build your circuit" }),
      el("p", {
        className: "subtitle",
        text: "Add exercises, set quantities, and choose how many rounds to complete.",
      }),
    ]),
    el("section", { className: "card" }, [
      el("h2", { className: "section-title", text: "Exercise sets" }),
      ...circuit.sets.map((set, index) => renderSetEditor(set, index)),
      el(
        "button",
        {
          className: "btn btn-secondary btn-block",
          onClick: addSet,
        },
        "+ Add exercise",
      ),
    ]),
    el("section", { className: "card rounds-card" }, [
      el("label", { className: "field-label", text: "Number of rounds" }),
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
    ]),
    el(
      "button",
      {
        className: "btn btn-primary btn-block btn-lg",
        onClick: startCircuit,
        disabled: circuit.sets.length === 0,
      },
      "Start circuit",
    ),
  );

  app.append(container);
}

function renderSetEditor(set: ExerciseSet, index: number): HTMLElement {
  return el("article", { className: "set-row", dataset: { id: set.id } }, [
    el("div", { className: "set-row-header" }, [
      el("span", { className: "set-index", text: `#${index + 1}` }),
      el(
        "button",
        {
          className: "btn-icon",
          title: "Remove exercise",
          onClick: () => removeSet(set.id),
          disabled: circuit.sets.length === 1,
        },
        "×",
      ),
    ]),
    el("label", { className: "field-label" }, [
      "Exercise",
      el(
        "select",
        {
          className: "input",
          value: set.exerciseId,
          onChange: (e) => {
            set.exerciseId = (e.target as HTMLSelectElement).value;
          },
        },
        EXERCISES.map((exercise) =>
          el("option", {
            value: exercise.id,
            text: exercise.name,
            selected: exercise.id === set.exerciseId,
          }),
        ),
      ),
    ]),
    el("div", { className: "quantity-type-toggle" }, [
      quantityTypeButton(set, "reps", "Reps"),
      quantityTypeButton(set, "duration", "Duration"),
    ]),
    el("label", { className: "field-label" }, [
      quantityLabel(set.quantityType),
      el("input", {
        className: "input",
        type: "text",
        inputMode: set.quantityType === "reps" ? "numeric" : "text",
        placeholder: set.quantityType === "reps" ? "10" : "1:30",
        value: set.quantityInput,
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
  return type === "reps" ? "Repetitions" : "Duration (mm:ss or seconds)";
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

function syncEditorFromDom(): void {
  if (phase !== "editing") return;

  app.querySelectorAll<HTMLElement>(".set-row").forEach((row) => {
    const set = circuit.sets.find((item) => item.id === row.dataset.id);
    if (!set) return;

    const select = row.querySelector("select");
    if (select instanceof HTMLSelectElement) {
      set.exerciseId = select.value || EXERCISES[0].id;
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
    },
    currentSetIndex: 0,
    currentRound: 1,
    startedAt: Date.now(),
    completedAt: null,
  };
  phase = "running";
  startElapsedTicker();
  render();
}

function renderRunner(): void {
  if (!session) return;

  const { circuit: activeCircuit, currentSetIndex, currentRound } = session;
  const currentSet = activeCircuit.sets[currentSetIndex];
  const isDuration = currentSet.quantityType === "duration";

  const container = el("div", { className: "screen runner-screen" });

  container.append(
    el("header", { className: "screen-header runner-header" }, [
      el("div", { className: "round-badge", text: `Round ${currentRound} / ${activeCircuit.rounds}` }),
      el("p", {
        className: "elapsed",
        text: formatElapsed(Date.now() - session.startedAt),
      }),
    ]),
    el("section", { className: "card overview-card" }, [
      el("h2", { className: "section-title", text: "Circuit overview" }),
      el(
        "ul",
        { className: "overview-list" },
        activeCircuit.sets.map((set, index) => {
          const isCurrent = index === currentSetIndex;
          const isDone =
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
    el("section", { className: "card current-exercise-card" }, [
      el("p", { className: "current-label", text: "Current exercise" }),
      el("h2", {
        className: "current-name",
        text: getExerciseName(currentSet.exerciseId),
      }),
      el("p", {
        className: "current-qty",
        text: formatQuantity(
          currentSet.quantityType,
          currentSet.reps,
          currentSet.durationSeconds,
        ),
      }),
      isDuration ? renderTimerPanel(currentSet) : renderRepsPanel(),
    ]),
    el(
      "button",
      {
        className: "btn btn-ghost btn-block",
        onClick: backToEditor,
      },
      "← Back to editor",
    ),
  );

  app.append(container);
}

function renderTimerPanel(set: ExerciseSet): HTMLElement {
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
      ? el("p", { className: "timer-done-msg", text: "Time's up!" })
      : null,
    !timer.running && !timer.finished
      ? el(
          "button",
          {
            className: "btn btn-primary btn-block btn-lg",
            onClick: () => startTimer(set.durationSeconds),
          },
          "Start timer",
        )
      : null,
    canContinue
      ? el(
          "button",
          {
            className: "btn btn-accent btn-block btn-lg",
            onClick: completeCurrentExercise,
          },
          "Continue",
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
      "Mark as done",
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
    session.currentRound += 1;
    session.currentSetIndex = 0;
    render();
    return;
  }

  session.completedAt = Date.now();
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
  const { circuit: activeCircuit } = session;

  const container = el("div", { className: "screen completion-screen" });

  container.append(
    el("header", { className: "completion-header" }, [
      el("div", { className: "completion-icon", text: "🎉" }),
      el("h1", { text: "Circuit complete!" }),
      el("p", {
        className: "subtitle",
        text: "Great work — you finished every round.",
      }),
    ]),
    el("section", { className: "card stats-card" }, [
      el("div", { className: "stat" }, [
        el("span", { className: "stat-label", text: "Total time" }),
        el("span", { className: "stat-value", text: formatElapsed(totalMs) }),
      ]),
      el("div", { className: "stat" }, [
        el("span", { className: "stat-label", text: "Rounds completed" }),
        el("span", { className: "stat-value", text: String(activeCircuit.rounds) }),
      ]),
      el("div", { className: "stat" }, [
        el("span", { className: "stat-label", text: "Exercises per round" }),
        el("span", { className: "stat-value", text: String(activeCircuit.sets.length) }),
      ]),
    ]),
    el("section", { className: "card recap-card" }, [
      el("h2", { className: "section-title", text: "Recap" }),
      el(
        "ul",
        { className: "recap-list" },
        activeCircuit.sets.map((set) =>
          el("li", { className: "recap-item" }, [
            el("span", { text: getExerciseName(set.exerciseId) }),
            el("span", {
              className: "recap-qty",
              text: `${formatQuantity(set.quantityType, set.reps, set.durationSeconds)} × ${activeCircuit.rounds} rounds`,
            }),
          ]),
        ),
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
      "Build a new circuit",
    ),
  );

  app.append(container);
}

type ElAttrs = {
  className?: string;
  text?: string;
  type?: string;
  value?: string;
  min?: string;
  max?: string;
  placeholder?: string;
  inputMode?: string;
  title?: string;
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
  if (attrs.text && childList.length === 0) node.textContent = attrs.text;
  if (attrs.type) node.setAttribute("type", attrs.type);
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
    select.value = hasOption ? attrs.value : EXERCISES[0].id;
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

render();
registerSW({ immediate: true });

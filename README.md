# Workout Circuit

A progressive web app to build and run workout circuits.

## Features

- Build a circuit from preset exercises (squats, push-ups, plank, etc.)
- Set each exercise as reps or duration (e.g. `10` or `1:30`)
- Run the circuit with round tracking and a live overview
- Timed exercises include countdown with sound and vibration alerts
- Completion screen with recap and total elapsed time

## Development

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal (usually `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

## Install as PWA

1. Open the deployed site over HTTPS.
2. Use your browser’s **Install app** / **Add to Home Screen** option.

Live site: https://pierreturnbull.github.io/workout-circuit/

## Session behavior

Circuits are kept in memory for the current session only. Refreshing the page clears your circuit.

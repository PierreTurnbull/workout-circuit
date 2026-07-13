import type { Exercise } from "./types";

export const EXERCISES: Exercise[] = [
  { id: "squats", name: "Squats" },
  { id: "pushups", name: "Push-ups" },
  { id: "front-lunges", name: "Front lunges" },
  { id: "plank", name: "Plank" },
  { id: "burpees", name: "Burpees" },
  { id: "jumping-jacks", name: "Jumping jacks" },
  { id: "mountain-climbers", name: "Mountain climbers" },
  { id: "sit-ups", name: "Sit-ups" },
  { id: "glute-bridges", name: "Glute bridges" },
  { id: "wall-sit", name: "Wall sit" },
];

export function getExerciseName(exerciseId: string): string {
  return EXERCISES.find((e) => e.id === exerciseId)?.name ?? exerciseId;
}

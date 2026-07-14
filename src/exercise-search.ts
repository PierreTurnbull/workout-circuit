export function getExerciseGifSearchUrl(exerciseName: string): string {
  const params = new URLSearchParams({
    q: `${exerciseName} exercise`,
    tbm: "isch",
    tbs: "itp:animated",
  });
  return `https://www.google.com/search?${params.toString()}`;
}

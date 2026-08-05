import type { LessonProgress, ProgressMap } from "./types";

const KEY = "ltn10:progress";

export function getProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getLessonProgress(lessonId: string): LessonProgress | null {
  return getProgress()[lessonId] ?? null;
}

export function saveAttempt(lessonId: string, scorePercent: number) {
  if (typeof window === "undefined") return;
  const all = getProgress();
  const prev = all[lessonId];
  all[lessonId] = {
    best: Math.max(prev?.best ?? 0, scorePercent),
    attempts: (prev?.attempts ?? 0) + 1,
    lastAt: new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify(all));
}

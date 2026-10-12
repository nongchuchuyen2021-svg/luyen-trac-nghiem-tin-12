import type { Question } from "./types";
import { getQuestions, QUESTION_BANK } from "./questions";
import { CURRICULUM } from "@/data/curriculum";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface BattleQuestion {
  id: string;
  question: string;
  code?: string;
  options: [string, string, string, string];
  correctAnswer: number; // 0..3
  explanation: string;
}

export interface BattleTopic {
  id: string;
  name: string;
  chapter: string;
}

export const BATTLE_TOPICS: BattleTopic[] = [
  { id: "all", name: "🏆 Đại Chiến Toàn Diện (Ngẫu nhiên toàn bộ Tin 12)", chapter: "Toàn bộ SGK Tin học 12" },
  ...CURRICULUM.flatMap((topic) =>
    topic.lessons.map((lesson) => ({
      id: lesson.id,
      name: lesson.title,
      chapter: topic.name,
    }))
  ),
];

function shuffleIndices(): number[] {
  const arr = [0, 1, 2, 3];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function convertQuestionToBattle(q: Question): BattleQuestion {
  const order = shuffleIndices();
  return {
    id: q.id,
    question: q.q,
    code: q.code,
    options: order.map((i) => q.options[i]) as [string, string, string, string],
    correctAnswer: order.indexOf(q.answer),
    explanation: q.explain,
  };
}

export function shuffleBattleQuestion(bq: BattleQuestion): BattleQuestion {
  const order = shuffleIndices();
  return {
    ...bq,
    options: order.map((i) => bq.options[i]) as [string, string, string, string],
    correctAnswer: order.indexOf(bq.correctAnswer),
  };
}

export async function getBattleQuestions(
  topicId: string = "bai-04",
  count: number = 10,
  extraPool: BattleQuestion[] = []
): Promise<BattleQuestion[]> {
  try {
    let pool: BattleQuestion[] = [];
    if (topicId === "all") {
      const allQs: Question[] = [];
      const keys = Object.keys(QUESTION_BANK);
      for (const k of keys) {
        allQs.push(...QUESTION_BANK[k]);
      }
      pool = allQs.map(convertQuestionToBattle);
    } else {
      const baseQs = getQuestions(topicId).map(convertQuestionToBattle);
      const convertedExtra = extraPool.map(shuffleBattleQuestion);
      pool = [...baseQs, ...convertedExtra];
    }

    const picked = shuffle(pool).slice(0, count);
    return picked.map(shuffleBattleQuestion);
  } catch (e) {
    console.error("Error fetching battle questions:", e);
    const fallback = getQuestions("bai-04").map(convertQuestionToBattle);
    return shuffle(fallback).slice(0, count).map(shuffleBattleQuestion);
  }
}

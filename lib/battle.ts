import type { Question } from "./types";
import { getQuestions, QUESTION_BANK } from "./questions";

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
  { id: "bai-04", name: "Bài 4. Giao thức mạng (TCP/IP, MAC, Router)", chapter: "Chủ đề 2: Mạng máy tính & Internet" },
  { id: "all", name: "Đại Chiến Toàn Diện (Ngẫu nhiên toàn bộ Tin 12)", chapter: "Toàn bộ SGK Tin học 12" },
  { id: "bai-01", name: "Bài 1. Làm quen với Trí tuệ nhân tạo", chapter: "Chủ đề 1: Máy tính & Xã hội tri thức" },
  { id: "bai-02", name: "Bài 2. Trí tuệ nhân tạo trong khoa học & đời sống", chapter: "Chủ đề 1: Máy tính & Xã hội tri thức" },
  { id: "bai-03", name: "Bài 3. Một số thiết bị mạng thông dụng", chapter: "Chủ đề 2: Mạng máy tính & Internet" },
  { id: "bai-05", name: "Bài 5. Thực hành chia sẻ tài nguyên mạng", chapter: "Chủ đề 2: Mạng máy tính & Internet" },
  { id: "bai-06", name: "Bài 6. Giao tiếp & ứng xử không gian mạng", chapter: "Chủ đề 3: Đạo đức & Văn hoá số" },
  { id: "bai-07", name: "Bài 7. HTML & cấu trúc trang web", chapter: "Chủ đề 4: Thiết kế Web (HTML & CSS)" },
  { id: "bai-08", name: "Bài 8. Định dạng văn bản", chapter: "Chủ đề 4: Thiết kế Web (HTML & CSS)" },
  { id: "bai-09", name: "Bài 9. Tạo danh sách, bảng", chapter: "Chủ đề 4: Thiết kế Web (HTML & CSS)" },
  { id: "bai-10", name: "Bài 10. Tạo liên kết", chapter: "Chủ đề 4: Thiết kế Web (HTML & CSS)" },
  { id: "bai-12", name: "Bài 12. Tạo biểu mẫu (Form)", chapter: "Chủ đề 4: Thiết kế Web (HTML & CSS)" },
  { id: "bai-13", name: "Bài 13. Khái niệm, vai trò của CSS", chapter: "Chủ đề 4: Thiết kế Web (HTML & CSS)" },
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

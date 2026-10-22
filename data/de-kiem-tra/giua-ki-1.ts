import {
  REVIEW_MC,
  REVIEW_TF,
  REVIEW_ESSAYS,
  REVIEW_LESSONS,
  type ReviewMC,
  type ReviewTF,
  type ReviewEssay,
} from "@/data/review-1-8";
import { tronPhuongAn } from "@/lib/tron-phuong-an";

export const GIUA_KI_1_ID = "kiem-tra-giua-ki-1";
export const GIUA_KI_1_TITLE = "Kiểm tra giữa kì 1 — Tin học 12";
export const GIUA_KI_1_SUBTITLE =
  "Chương trình Tin học 12 (GDPT 2018) · Phạm vi: Bài 1–8 · 16 câu TNKQ + 3 câu TNĐS + 2 câu Tự luận";
export const GIUA_KI_1_MINUTES = 45;

export const GIUA_KI_1_MC_COUNT = 16;
export const GIUA_KI_1_TF_COUNT = 3;
export const GIUA_KI_1_ESSAY_COUNT = 2;
export const GIUA_KI_1_TOTAL_QUESTIONS = 21;

export type DeGiuaKi1MC = ReviewMC & {
  shuffledOptions: string[];
  correctIndex: number;
  lessonTitle: string;
};

export type DeGiuaKi1TF = ReviewTF & {
  lessonTitle: string;
};

export type DeGiuaKi1Essay = ReviewEssay & {
  lessonTitle: string;
};

export type DeGiuaKi1 = {
  id: string;
  createdAt: number;
  mc: DeGiuaKi1MC[];
  tf: DeGiuaKi1TF[];
  essay: DeGiuaKi1Essay[];
};

function shuffleArray<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Sinh đề kiểm tra giữa kì 1 hoàn chỉnh từ ngân hàng đề cương bài 1–8:
 * - 16 câu TNKQ: mỗi bài (từ Bài 1 đến Bài 8) lấy 2 câu, bao quát nhận biết, thông hiểu, vận dụng, vận dụng cao.
 * - 3 câu TNĐS: chọn từ 3 bài học khác nhau trong số các bài có câu đúng/sai.
 * - 2 câu Tự luận: chọn từ 2 bài học khác nhau trong số 8 câu tự luận đề cương.
 * 
 * Khi truyền previousIds (danh sách id của đề vừa hủy do chuyển tab),
 * thuật toán ưu tiên tối đa các câu hỏi mới chưa xuất hiện ở lượt trước.
 */
export function taoDeGiuaKi1(
  previousIds: readonly string[] = [],
  random: () => number = Math.random
): DeGiuaKi1 {
  const prevSet = new Set(previousIds);

  // 1. CHỌN 16 CÂU TNKQ: 8 bài x 2 câu = 16 câu
  const selectedMC: DeGiuaKi1MC[] = [];
  for (let lessonNum = 1; lessonNum <= 8; lessonNum++) {
    const lessonMC = REVIEW_MC.filter((q) => q.lesson === lessonNum);
    // Ưu tiên câu chưa có trong previousIds
    const fresh = lessonMC.filter((q) => !prevSet.has(q.id));
    const pool = fresh.length >= 2 ? fresh : lessonMC;
    const shuffledPool = shuffleArray(pool, random);
    const chosen2 = shuffledPool.slice(0, 2);

    for (const q of chosen2) {
      const { shuffledOptions, correctIndex } = tronPhuongAn(q, random);
      selectedMC.push({
        ...q,
        shuffledOptions,
        correctIndex,
        lessonTitle: `Bài ${q.lesson}. ${REVIEW_LESSONS[q.lesson - 1]}`,
      });
    }
  }

  // 2. CHỌN 3 CÂU TNĐS TỪ 3 BÀI HỌC KHÁC NHAU
  // REVIEW_TF có 12 câu thuộc các bài khác nhau
  const tfLessons = Array.from(new Set(REVIEW_TF.map((q) => q.lesson)));
  const shuffledTfLessons = shuffleArray(tfLessons, random);
  const chosenTfLessons = shuffledTfLessons.slice(0, GIUA_KI_1_TF_COUNT);

  const selectedTF: DeGiuaKi1TF[] = chosenTfLessons.map((lessonNum) => {
    const lessonTF = REVIEW_TF.filter((q) => q.lesson === lessonNum);
    const fresh = lessonTF.filter((q) => !prevSet.has(q.id));
    const pool = fresh.length > 0 ? fresh : lessonTF;
    const q = pool[Math.floor(random() * pool.length)];
    return {
      ...q,
      lessonTitle: `Bài ${q.lesson}. ${REVIEW_LESSONS[q.lesson - 1]}`,
    };
  });

  // 3. CHỌN 2 CÂU TỰ LUẬN TỪ 2 BÀI HỌC KHÁC NHAU
  const essayLessons = Array.from(new Set(REVIEW_ESSAYS.map((q) => q.lesson)));
  const shuffledEssayLessons = shuffleArray(essayLessons, random);
  const chosenEssayLessons = shuffledEssayLessons.slice(0, GIUA_KI_1_ESSAY_COUNT);

  const selectedEssay: DeGiuaKi1Essay[] = chosenEssayLessons.map((lessonNum) => {
    const lessonEssays = REVIEW_ESSAYS.filter((q) => q.lesson === lessonNum);
    const fresh = lessonEssays.filter((q) => !prevSet.has(q.id));
    const pool = fresh.length > 0 ? fresh : lessonEssays;
    const q = pool[Math.floor(random() * pool.length)];
    return {
      ...q,
      lessonTitle: `Bài ${q.lesson}. ${REVIEW_LESSONS[q.lesson - 1]}`,
    };
  });

  return {
    id: `gk1-${Date.now()}-${Math.floor(random() * 10000)}`,
    createdAt: Date.now(),
    mc: selectedMC,
    tf: selectedTF,
    essay: selectedEssay,
  };
}

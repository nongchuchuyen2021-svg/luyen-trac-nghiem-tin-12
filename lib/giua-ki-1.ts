import { REVIEW_MC, REVIEW_TF, REVIEW_ESSAYS } from "@/data/review-1-8";
import {
  GIUA_KI_1_ID,
  GIUA_KI_1_MC_COUNT,
  GIUA_KI_1_TF_COUNT,
  GIUA_KI_1_ESSAY_COUNT,
  GIUA_KI_1_TOTAL_QUESTIONS,
} from "@/data/de-kiem-tra/giua-ki-1";

export type GiuaKi1Answers = {
  /** Map question id -> chosen option index in original question options (0-3) or null */
  mc: Record<string, number | null>;
  /** Map question id -> array of 4 booleans or nulls for statements a, b, c, d */
  tf: Record<string, (boolean | null)[]>;
  /** Map question id -> student essay text and 4 rubric booleans */
  essay: Record<string, { text: string; rubric: boolean[] }>;
};

export type GiuaKi1ScoringResult = {
  mcCorrect: number;
  mcScore: number; // Tối đa 4.0
  tfCorrectStatements: number; // Tổng số ý đúng (tối đa 12)
  tfScoresPerQuestion: number[]; // Điểm từng câu TNĐS (quy chế Bộ: 0.1, 0.25, 0.5, 1.0)
  tfScore: number; // Tối đa 3.0
  objectiveScore: number; // Trắc nghiệm khách quan = mcScore + tfScore (Tối đa 7.0)
  essayScoresPerQuestion: number[]; // Điểm từng câu tự luận (Tối đa 1.5 mỗi câu)
  essayScore: number; // Tối đa 3.0
  totalScore: number; // Tối đa 10.0
  completedQuestions: number;
  totalQuestions: number;
};

/**
 * Tính điểm cho 1 câu TNĐS 4 ý theo chuẩn Bộ GD&ĐT từ 2025:
 * - Đúng 1 ý: 0.1 điểm
 * - Đúng 2 ý: 0.25 điểm
 * - Đúng 3 ý: 0.5 điểm
 * - Đúng 4 ý: 1.0 điểm
 */
export function tinhDiemMotCauTF(soYChinhXac: number): number {
  if (soYChinhXac >= 4) return 1.0;
  if (soYChinhXac === 3) return 0.5;
  if (soYChinhXac === 2) return 0.25;
  if (soYChinhXac === 1) return 0.1;
  return 0;
}

/**
 * Chấm điểm toàn diện bài thi giữa kì 1 dựa trên ngân hàng gốc đề cương:
 * - 16 câu TNKQ: mỗi câu 0.25đ -> tối đa 4.0đ
 * - 3 câu TNĐS: mỗi câu tối đa 1.0đ -> tối đa 3.0đ
 * - 2 câu tự luận: mỗi câu 4 tiêu chí rubric (mỗi tiêu chí 0.375đ) -> tối đa 3.0đ
 * Tổng điểm tối đa: 10.0 điểm.
 */
export function tinhDiemGiuaKi1(
  answers: GiuaKi1Answers,
  activeMcIds: string[],
  activeTfIds: string[],
  activeEssayIds: string[]
): GiuaKi1ScoringResult {
  // 1. Chấm TNKQ
  let mcCorrect = 0;
  for (const id of activeMcIds) {
    const q = REVIEW_MC.find((item) => item.id === id);
    const chosen = answers.mc[id];
    if (q && chosen !== null && chosen !== undefined && chosen === q.answer) {
      mcCorrect++;
    }
  }
  const mcScore = Math.round(mcCorrect * 0.25 * 100) / 100;

  // 2. Chấm TNĐS
  let tfCorrectStatements = 0;
  const tfScoresPerQuestion: number[] = [];
  for (const id of activeTfIds) {
    const q = REVIEW_TF.find((item) => item.id === id);
    const chosenArr = answers.tf[id] ?? [null, null, null, null];
    let correctInThisQ = 0;
    if (q) {
      q.statements.forEach((stmt, idx) => {
        if (chosenArr[idx] !== null && chosenArr[idx] === stmt.answer) {
          correctInThisQ++;
          tfCorrectStatements++;
        }
      });
    }
    tfScoresPerQuestion.push(tinhDiemMotCauTF(correctInThisQ));
  }
  const tfScore =
    Math.round(tfScoresPerQuestion.reduce((sum, s) => sum + s, 0) * 100) / 100;

  // Điểm khách quan (TNKQ + TNĐS)
  const objectiveScore = Math.round((mcScore + tfScore) * 100) / 100;

  // 3. Chấm Tự luận (dựa trên rubric 4 tiêu chí)
  const essayScoresPerQuestion: number[] = [];
  for (const id of activeEssayIds) {
    const esEntry = answers.essay[id];
    if (esEntry && Array.isArray(esEntry.rubric)) {
      const criteriaMet = esEntry.rubric.filter(Boolean).length;
      // Mỗi tiêu chí được 1.5 / 4 = 0.375 điểm
      const score = Math.round((criteriaMet / 4) * 1.5 * 100) / 100;
      essayScoresPerQuestion.push(score);
    } else {
      essayScoresPerQuestion.push(0);
    }
  }
  const essayScore =
    Math.round(essayScoresPerQuestion.reduce((sum, s) => sum + s, 0) * 100) / 100;

  const totalScore = Math.min(
    10,
    Math.round((objectiveScore + essayScore) * 100) / 100
  );

  // Đếm số câu học sinh đã hoàn thành
  const mcCompleted = activeMcIds.filter(
    (id) => answers.mc[id] !== null && answers.mc[id] !== undefined
  ).length;
  const tfCompleted = activeTfIds.filter((id) => {
    const arr = answers.tf[id];
    return arr && arr.length === 4 && !arr.includes(null);
  }).length;
  const essayCompleted = activeEssayIds.filter((id) => {
    const es = answers.essay[id];
    return es && es.text && es.text.trim().length >= 10;
  }).length;

  return {
    mcCorrect,
    mcScore,
    tfCorrectStatements,
    tfScoresPerQuestion,
    tfScore,
    objectiveScore,
    essayScoresPerQuestion,
    essayScore,
    totalScore,
    completedQuestions: mcCompleted + tfCompleted + essayCompleted,
    totalQuestions: GIUA_KI_1_TOTAL_QUESTIONS,
  };
}

/** Theo dõi chuyển tab qua visibilitychange */
export function theoDoiTabGiuaKi1(
  source: Pick<Document, "hidden" | "addEventListener" | "removeEventListener">,
  onChange: (hidden: boolean) => void
): () => void {
  let wasHidden = source.hidden;
  const listener = () => {
    if (source.hidden === wasHidden) return;
    wasHidden = source.hidden;
    onChange(wasHidden);
  };
  source.addEventListener("visibilitychange", listener);
  return () => source.removeEventListener("visibilitychange", listener);
}

/** Định dạng số giây còn lại */
export function dinhDangThoiGian(giay: number): string {
  const m = Math.floor(giay / 60);
  const s = giay % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

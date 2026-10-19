import type { Question, QuestionDifficulty } from "@/lib/types";
import b1 from "@/data/questions/bai-01";
import b2 from "@/data/questions/bai-02";
import b3 from "@/data/questions/bai-03";
import b4 from "@/data/questions/bai-04";
import b5 from "@/data/questions/bai-05";
import b6 from "@/data/questions/bai-06";
import { tronPhuongAn } from "@/lib/tron-phuong-an";
export const TX2_LESSONS = [
  { id: "bai-01", title: "Bài 1. Làm quen với Trí tuệ nhân tạo", questions: b1 },
  { id: "bai-02", title: "Bài 2. Trí tuệ nhân tạo trong khoa học và đời sống", questions: b2 },
  { id: "bai-03", title: "Bài 3. Một số thiết bị mạng thông dụng", questions: b3 },
  { id: "bai-04", title: "Bài 4. Giao thức mạng", questions: b4 },
  { id: "bai-05", title: "Bài 5. Thực hành chia sẻ tài nguyên trên mạng", questions: b5 },
  { id: "bai-06", title: "Bài 6. Giao tiếp và ứng xử trong không gian mạng", questions: b6 },
];
export type Tx2Question = Question & { lessonId: string; lessonTitle: string; shuffledOptions: string[]; correctIndex: number };
function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; }
  return copy;
}
/** 6 nhận biết + 6 thông hiểu + 3 vận dụng thuộc 3 bài khác nhau. */
export function taoDeTx2(previousIds: readonly string[] = [], random: () => number = Math.random): Tx2Question[] {
  const previous = new Set(previousIds);
  const applicationLessons = new Set(shuffle(TX2_LESSONS, random).slice(0, 3).map((lesson) => lesson.id));
  const selected = TX2_LESSONS.flatMap((lesson) => {
    const levels: QuestionDifficulty[] = ["nhan-biet", "thong-hieu", "van-dung"];
    // Mỗi nhóm cần 2 câu để đổi đề mà không lặp câu của đề trước.
    for (const level of levels) if (lesson.questions.filter((q) => q.difficulty === level).length < 2) throw new Error(lesson.id + " thiếu câu mức " + level);
    if (lesson.questions.some((q) => !q.difficulty || !levels.includes(q.difficulty))) throw new Error(lesson.id + " chưa phân loại đầy đủ");
    return levels.filter((level) => level !== "van-dung" || applicationLessons.has(lesson.id)).map((level) => {
      const pool = lesson.questions.filter((q) => q.difficulty === level && !previous.has(q.id));
      if (!pool.length) throw new Error(lesson.id + " không đủ câu mới mức " + level);
      const q = pool[Math.floor(random() * pool.length)];
      return { ...q, lessonId: lesson.id, lessonTitle: lesson.title, ...tronPhuongAn(q, random) };
    });
  });
  return shuffle(selected, random);
}

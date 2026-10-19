import type { Question } from "./types";

/** Phát hiện phương án tham chiếu nhãn/vị trí; không đảo để giữ nguyên nghĩa. */
export function phuThuocThuTu(q: Question): boolean {
  const text = [q.q, ...q.options].join("\n");
  return q.shuffleOptions === false ||
    /(?:phương án|đáp án|lựa chọn|câu trả lời)\s*[:(]?\s*[A-D]\b/i.test(text) ||
    /\b[A-D]\s*(?:và|hoặc|,|\/|&)\s*[A-D]\b/.test(text) ||
    /(?:tất cả|cả|các)\s+(?:(?:những|các|hai|ba|bốn)\s+)?(?:phương án|đáp án|lựa chọn|câu trả lời|ý|mệnh đề|nhận định|phát biểu)?\s*(?:ở\s+)?(?:trên|dưới)/i.test(text) ||
    /(?:phương án|đáp án|lựa chọn|câu trả lời)\s+(?:(?:ở|nêu)\s+)?(?:trên|dưới|đầu tiên|cuối cùng|thứ\s+(?:[1-4]|nhất|hai|ba|tư))/i.test(text);
}

export function tronPhuongAn(q: Question, random: () => number = Math.random) {
  const order = [0, 1, 2, 3];
  if (!phuThuocThuTu(q)) {
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
  }
  return {
    shuffledOptions: order.map((i) => q.options[i]),
    correctIndex: order.indexOf(q.answer),
  };
}

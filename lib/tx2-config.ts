export const TX2_ID = "kiem-tra-tx2-12";
export const TX2_COUNT = 15;
export const TX2_MINUTES = 16;
export const TX2_TITLE = "Kiểm tra thường xuyên 2 — Tin học 12";
export const TX2_TAB = "TX2";
export const TX2_HEADERS = ["Thời gian", "Họ tên", "Lớp", "Mã bài", "Tên bài", "Dạng", "Điểm /10", "Số câu đúng", "Tổng số câu"];
export function diemTx2(correct: number): number { return Math.round(correct * 10 / TX2_COUNT * 100) / 100; }

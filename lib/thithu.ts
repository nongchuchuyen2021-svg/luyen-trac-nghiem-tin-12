import type { Question, TFQuestion } from "./types";
import { CURRICULUM } from "@/data/curriculum";
import { QUESTION_BANK } from "./questions";
import { EXTRA_BANK } from "./extras";

// Chế độ Thi thử — mô phỏng cấu trúc đề tốt nghiệp THPT môn Tin học theo
// Quyết định 764/QĐ-BGDĐT (24 câu D1 + 4 câu D2), định hướng Tin học ứng
// dụng (ICT). Nguồn xác thực cấu trúc: xem skill `on-thi-thpt-tin`.
//
// ĐÂY LÀ BẢN RÚT GỌN — đã bàn với giáo viên 2026-08-07. Lý do: ma trận thật
// của Bộ bắt 1/6 chủ đề Phần I và 2/4 câu Phần II (Câu 2, Câu 6) phải lấy từ
// chủ đề "11E — Giới thiệu các hệ cơ sở dữ liệu" (SGK lớp 11), nhưng ngân
// hàng câu hỏi của web này chỉ có nội dung lớp 12, không có CSDL. Quyết định:
//   - Phần I: chỉ dùng 5/6 chủ đề hiện có, KHÔNG cố bịa câu hỏi CSDL.
//   - Phần II: chỉ còn 2 câu (đúng vị trí Câu 1 "Mạng" và Câu 5 "Web" của đề
//     thật), bỏ Câu 2 và Câu 6. Mỗi câu D2 tính điểm gấp đôi công thức gốc để
//     tổng điểm vẫn về đúng thang 10 quen thuộc — xem DIEM_D2_THEO_SO_Y_DUNG.
// Nếu sau này ngân hàng có thêm nội dung CSDL lớp 11, bỏ ghi chú "rút gọn"
// và đưa CHU_DE_D1/CHU_DE_D2 về đủ 6 chủ đề / 4 câu D2.

export const THOI_GIAN_GIAY = 50 * 60; // 50 phút, đúng theo QĐ 764
export const SO_CAU_D1 = 24;
export const SO_CAU_D2 = 2; // bản đủ theo Bộ là 4 — xem ghi chú "rút gọn" ở trên

export const DIEM_MOI_CAU_D1 = 0.25; // 24 × 0,25 = 6,0đ, đúng chuẩn Bộ
export const DIEM_TOI_DA_D1 = SO_CAU_D1 * DIEM_MOI_CAU_D1;

// Công thức gốc của Bộ (4 câu, mỗi câu tối đa 1đ): 1 ý=0,1 · 2 ý=0,25 ·
// 3 ý=0,5 · 4 ý=1,0. Ở đây chỉ còn 2 câu nên nhân đôi từng mức để tổng vẫn
// ra 4,0đ như đề thật (2 câu × 2,0đ = 4,0đ).
export const DIEM_D2_THEO_SO_Y_DUNG = [0, 0.2, 0.5, 1.0, 2.0] as const;
export const DIEM_TOI_DA_D2 = SO_CAU_D2 * 2.0;
export const DIEM_TOI_DA = DIEM_TOI_DA_D1 + DIEM_TOI_DA_D2; // 10,0đ

// Phần I: lấy từ 5/6 chủ đề kiến thức chung cốt lõi (bỏ 11E CSDL).
const CHU_DE_D1 = [
  { ma: "12A", ten: "Trí tuệ nhân tạo", chuDeId: "chu-de-1" },
  { ma: "12B", ten: "Kết nối mạng", chuDeId: "chu-de-2" },
  { ma: "12D", ten: "Đạo đức, ứng xử trong môi trường số", chuDeId: "chu-de-3" },
  { ma: "12E", ten: "Tạo trang web (HTML, CSS)", chuDeId: "chu-de-4" },
  { ma: "12G", ten: "Hướng nghiệp CNTT", chuDeId: "chu-de-5" },
] as const;

// Phần II rút gọn: đúng vị trí Câu 1 (chung, chủ đề Mạng) và Câu 5 (nhánh
// ICT, chủ đề Web) của đề thật.
const CHU_DE_D2 = [
  { ten: "Kết nối mạng", chuDeId: "chu-de-2" },
  { ten: "Tạo trang web", chuDeId: "chu-de-4" },
] as const;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function baiIdsCuaChuDe(chuDeId: string): string[] {
  const chuDe = CURRICULUM.find((t) => t.id === chuDeId);
  return chuDe ? chuDe.lessons.filter((l) => l.available).map((l) => l.id) : [];
}

function goMcqCuaChuDe(chuDeId: string): Question[] {
  return baiIdsCuaChuDe(chuDeId).flatMap((id) => QUESTION_BANK[id] ?? []);
}

function goTfCuaChuDe(chuDeId: string): TFQuestion[] {
  return baiIdsCuaChuDe(chuDeId).flatMap((id) => EXTRA_BANK[id]?.tf ?? []);
}

export type DeThiThu = {
  d1: Question[]; // 24 câu, đã trộn thứ tự
  d2: TFQuestion[]; // 2 câu (bản rút gọn)
};

// Trộn 24 câu D1 chia gần đều cho 5 chủ đề (4 hoặc 5 câu/chủ đề — ngẫu nhiên
// chủ đề nào được dư 1 câu mỗi lần tạo đề), và 2 câu D2 lấy đúng theo ma trận.
export function taoDeThiThu(): DeThiThu {
  const soChuDe = CHU_DE_D1.length;
  const coBan = Math.floor(SO_CAU_D1 / soChuDe);
  const du = SO_CAU_D1 - coBan * soChuDe;
  const chiSoDuocDu = new Set(shuffle(CHU_DE_D1.map((_, i) => i)).slice(0, du));

  const d1: Question[] = [];
  CHU_DE_D1.forEach((cd, i) => {
    const soLuong = coBan + (chiSoDuocDu.has(i) ? 1 : 0);
    const pool = shuffle(goMcqCuaChuDe(cd.chuDeId));
    d1.push(...pool.slice(0, soLuong));
  });

  const d2 = CHU_DE_D2.map((cd) => shuffle(goTfCuaChuDe(cd.chuDeId))[0]).filter(
    (x): x is TFQuestion => Boolean(x),
  );

  return { d1: shuffle(d1), d2 };
}

export function diemMotCauD2(soYDung: number): number {
  return DIEM_D2_THEO_SO_Y_DUNG[soYDung] ?? 0;
}

// Tên các chủ đề dùng để hiện ở màn giới thiệu.
export const TEN_CHU_DE_D1 = CHU_DE_D1.map((c) => c.ten);
export const TEN_CHU_DE_D2 = CHU_DE_D2.map((c) => c.ten);

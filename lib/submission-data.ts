import { TX2_ID, TX2_COUNT, diemTx2 } from "./tx2-config";
export type Submission = { hoTen: string; lop: string; baiId: string; tenBai: string; dang: string; tongSoCau: number; soCauDung: number; diem: number };
const text = (v: unknown, max: number) => typeof v === "string" && v.trim().length > 0 && v.trim().length <= max ? v.trim().replace(/\s+/g, " ") : null;
const integer = (v: unknown, min: number, max: number): v is number => typeof v === "number" && Number.isInteger(v) && v >= min && v <= max;
export function docBaiNop(input: unknown): Submission | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const b = input as Record<string, unknown>;
  const hoTen = text(b.hoTen, 60), lop = text(b.lop, 12), baiId = text(b.baiId, 20), tenBai = text(b.tenBai, 120);
  if (!hoTen || !lop || !baiId || !tenBai || typeof b.dang !== "string" || !integer(b.tongSoCau, 1, 200) || !integer(b.soCauDung, 0, b.tongSoCau)) return null;
  if (baiId === TX2_ID) {
    if (b.dang !== "Thường xuyên" || b.tongSoCau !== TX2_COUNT || typeof b.diem !== "number" || !Number.isFinite(b.diem) || Math.abs(b.diem - diemTx2(b.soCauDung)) > 0.001) return null;
    return { hoTen, lop, baiId, tenBai, dang: b.dang, tongSoCau: b.tongSoCau, soCauDung: b.soCauDung, diem: diemTx2(b.soCauDung) };
  }
  if (!/^(bai-\d{2}|thi-thu)$/.test(baiId) || !["Trắc nghiệm", "Đúng/Sai", "Thi thử"].includes(b.dang) || !integer(b.diem, 0, 100)) return null;
  return { hoTen, lop, baiId, tenBai, dang: b.dang, tongSoCau: b.tongSoCau, soCauDung: b.soCauDung, diem: b.diem };
}

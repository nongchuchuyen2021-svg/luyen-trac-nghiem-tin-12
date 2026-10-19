import { NextResponse } from "next/server";
import { themDong, themDongTx2, daCauHinh } from "@/lib/google-sheets";
import { dungMienNopBai } from "@/lib/submission-origin";
import { docBaiNop } from "@/lib/submission-data";
import { tx2CanSubmit, TX2_OPENING_LABEL } from "@/lib/tx2-schedule";
import { TX2_ID } from "@/lib/tx2-config";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Tách theo học sinh trong cùng mạng để cả lớp không chia sẻ hạn mức 20 lượt.
const counts = new Map<string, { count: number; started: number }>();
function tooMany(key: string): boolean {
  const now = Date.now();
  if (counts.size > 10000) counts.forEach((entry, id) => { if (now - entry.started >= 600000) counts.delete(id); });
  const old = counts.get(key);
  if (!old || now - old.started >= 600000) { counts.set(key, { count: 1, started: now }); return false; }
  return ++old.count > 20;
}
export async function POST(req: Request) {
  if (!dungMienNopBai(req)) return NextResponse.json({ ok: false, loi: "Yêu cầu không hợp lệ (Origin mismatch)" }, { status: 403 });
  let input: unknown;
  try { input = await req.json(); } catch { return NextResponse.json({ ok: false, loi: "Dữ liệu gửi lên không đọc được" }, { status: 400 }); }
  const b = docBaiNop(input);
  if (!b) return NextResponse.json({ ok: false, loi: "Dữ liệu gửi lên không hợp lệ" }, { status: 400 });
  if (b.baiId === TX2_ID && !tx2CanSubmit()) return NextResponse.json({ ok:false, loi:"Ngoài thời gian nhận bài kiểm tra. Lịch mở: " + TX2_OPENING_LABEL }, { status:403 });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "khong-ro";
  if (tooMany(JSON.stringify([ip, b.lop.toUpperCase(), b.hoTen.toLocaleLowerCase("vi")]))) return NextResponse.json({ ok: false, loi: "Em nộp hơi nhiều lần, thử lại sau ít phút nhé" }, { status: 429 });
  if (!daCauHinh()) return NextResponse.json({ ok: false, loi: "Máy chủ chưa được cấu hình để nhận bài nộp" }, { status: 503 });
  const safe = (s: string) => /^[=+\-@]/.test(s) ? "'" + s : s;
  const thoiGian = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  const row = [thoiGian, safe(b.hoTen), safe(b.lop), b.baiId, safe(b.tenBai), b.dang, b.diem, b.soCauDung, b.tongSoCau];
  const payload = {
    thoiGian,
    hoTen: safe(b.hoTen),
    lop: safe(b.lop),
    baiId: b.baiId,
    tenBai: safe(b.tenBai),
    dang: b.dang,
    diem: b.diem,
    soCauDung: b.soCauDung,
    tongSoCau: b.tongSoCau,
  };
  try { if (b.baiId === TX2_ID) await themDongTx2(row, payload); else await themDong(row, payload); }
  catch (e) { console.error("Ghi bảng tính thất bại:", e); return NextResponse.json({ ok: false, loi: "Chưa gửi được lên bảng tính, em giữ kết quả và thử lại sau nhé" }, { status: 502 }); }
  return NextResponse.json({ ok: true, thoiGian });
}

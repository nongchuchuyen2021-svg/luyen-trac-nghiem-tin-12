import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { dungMienNopBai } from "@/lib/submission-origin";
import { themDong, daCauHinh } from "@/lib/google-sheets";
import { hopLe, chuanHoa } from "@/lib/hocsinh";
import {
  GIUA_KI_1_ID,
  GIUA_KI_1_TITLE,
  GIUA_KI_1_TOTAL_QUESTIONS,
} from "@/data/de-kiem-tra/giua-ki-1";
import {
  tinhDiemGiuaKi1,
  type GiuaKi1Answers,
} from "@/lib/giua-ki-1";
import { REVIEW_MC, REVIEW_TF, REVIEW_ESSAYS } from "@/data/review-1-8";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Bộ nhớ chống nộp trùng trong cùng tiến trình (30 phút)
const saved = new Map<
  string,
  { hash: string; at: number; promise: Promise<unknown> }
>();
const limit = new Map<string, { count: number; at: number }>();

export async function POST(req: Request) {
  if (!dungMienNopBai(req)) {
    return NextResponse.json(
      { ok: false, loi: "Nguồn nộp không hợp lệ" },
      { status: 403 }
    );
  }

  const raw = await req.text();
  if (raw.length > 80000) {
    return NextResponse.json(
      { ok: false, loi: "Nội dung bài thi quá dài" },
      { status: 413 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { ok: false, loi: "Dữ liệu gửi lên không đúng định dạng JSON" },
      { status: 400 }
    );
  }

  const {
    hoTen,
    lop,
    saveId,
    answers,
    activeMcIds,
    activeTfIds,
    activeEssayIds,
    soLanDoiDe = 0,
    thoiGianLamBai = 0,
  } = body as {
    hoTen?: unknown;
    lop?: unknown;
    saveId?: unknown;
    answers?: unknown;
    activeMcIds?: unknown;
    activeTfIds?: unknown;
    activeEssayIds?: unknown;
    soLanDoiDe?: unknown;
    thoiGianLamBai?: unknown;
  };

  if (
    typeof hoTen !== "string" ||
    typeof lop !== "string" ||
    hoTen.length > 60 ||
    lop.length > 12 ||
    typeof saveId !== "string" ||
    !/^[-a-zA-Z0-9]{8,80}$/.test(saveId)
  ) {
    return NextResponse.json(
      { ok: false, loi: "Thông tin học sinh hoặc mã phiên thi chưa hợp lệ" },
      { status: 400 }
    );
  }

  const hs = chuanHoa({ hoTen, lop });
  if (!hopLe(hs)) {
    return NextResponse.json(
      { ok: false, loi: "Vui lòng nhập đầy đủ họ tên và lớp" },
      { status: 400 }
    );
  }

  if (
    !Array.isArray(activeMcIds) ||
    activeMcIds.length !== 16 ||
    !activeMcIds.every((id) => typeof id === "string" && REVIEW_MC.some((q) => q.id === id)) ||
    !Array.isArray(activeTfIds) ||
    activeTfIds.length !== 3 ||
    !activeTfIds.every((id) => typeof id === "string" && REVIEW_TF.some((q) => q.id === id)) ||
    !Array.isArray(activeEssayIds) ||
    activeEssayIds.length !== 2 ||
    !activeEssayIds.every((id) => typeof id === "string" && REVIEW_ESSAYS.some((q) => q.id === id))
  ) {
    return NextResponse.json(
      { ok: false, loi: "Cấu trúc đề kiểm tra không khớp với ngân hàng đề cương" },
      { status: 400 }
    );
  }

  if (!answers || typeof answers !== "object") {
    return NextResponse.json(
      { ok: false, loi: "Dữ liệu câu trả lời không hợp lệ" },
      { status: 400 }
    );
  }

  const typedAnswers = answers as GiuaKi1Answers;

  // Tính điểm chính xác trên server từ bộ đáp án chuẩn
  const scoring = tinhDiemGiuaKi1(
    typedAnswers,
    activeMcIds,
    activeTfIds,
    activeEssayIds
  );

  // Rate limiting (tối đa 40 lượt / 10 phút trên mỗi IP/học sinh)
  const now = Date.now();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  const rateKey = `${ip}:${hs.lop}:${hs.hoTen}`;
  const rate = limit.get(rateKey);
  if (rate && now - rate.at < 600000) {
    if (++rate.count > 40) {
      return NextResponse.json(
        { ok: false, loi: "Em nộp bài quá nhiều lần, vui lòng đợi ít phút" },
        { status: 429 }
      );
    }
  } else {
    limit.set(rateKey, { count: 1, at: now });
  }

  // Chống gửi trùng qua saveId
  const key = `${hs.lop}:${hs.hoTen.toLocaleLowerCase("vi")}:${saveId}`;
  const hash = crypto
    .createHash("sha256")
    .update(JSON.stringify({ hs, typedAnswers, scoring }))
    .digest("hex");

  const prior = saved.get(key);
  if (prior) {
    if (prior.hash !== hash) {
      return NextResponse.json(
        { ok: false, loi: "Mã bài thi đã được nộp với kết quả khác" },
        { status: 409 }
      );
    }
    try {
      return NextResponse.json(await prior.promise);
    } catch {
      saved.delete(key);
    }
  }

  // Dọn dẹp cache cũ
  saved.forEach((value, k) => {
    if (now - value.at > 1800000) saved.delete(k);
  });
  limit.forEach((value, k) => {
    if (now - value.at > 600000) limit.delete(k);
  });

  if (!daCauHinh()) {
    return NextResponse.json(
      {
        ok: false,
        loi: "Chưa cấu hình Google Sheets trên máy chủ, kết quả vẫn được lưu trên máy của em",
      },
      { status: 503 }
    );
  }

  const safe = (s: string) => (/^[=+\-@]/.test(s) ? "'" + s : s);
  const thoiGian = new Date().toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
  });

  const soCauDung = scoring.mcCorrect + scoring.tfCorrectStatements;
  const payload = {
    thoiGian,
    hoTen: safe(hs.hoTen),
    lop: safe(hs.lop),
    baiId: GIUA_KI_1_ID,
    tenBai: GIUA_KI_1_TITLE,
    dang: "Giữa kì 1",
    diem: scoring.totalScore,
    soCauDung,
    tongSoCau: GIUA_KI_1_TOTAL_QUESTIONS,
    detail: {
      saveId,
      scoring,
      soLanDoiDe: Number(soLanDoiDe) || 0,
      thoiGianLamBai: Number(thoiGianLamBai) || 0,
    },
  };

  const row = [
    thoiGian,
    payload.hoTen,
    payload.lop,
    payload.baiId,
    payload.tenBai,
    payload.dang,
    payload.diem,
    payload.soCauDung,
    payload.tongSoCau,
  ];

  const promise = themDong(row, payload).then(() => ({
    ok: true,
    thoiGian,
    saveId,
    scoring,
    message: "Đã lưu kết quả bài kiểm tra giữa kì 1 vào Google Sheets thành công!",
  }));

  saved.set(key, { hash, at: now, promise });

  try {
    const result = await promise;
    return NextResponse.json(result);
  } catch (error) {
    saved.delete(key);
    console.error("Lưu bài kiểm tra giữa kì 1 thất bại:", error);
    return NextResponse.json(
      {
        ok: false,
        loi: "Chưa gửi được lên Google Sheets. Kết quả vẫn được giữ trên máy, em hãy thử bấm nút lưu lại nhé.",
      },
      { status: 502 }
    );
  }
}

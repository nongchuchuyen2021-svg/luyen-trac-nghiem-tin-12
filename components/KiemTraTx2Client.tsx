"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { taoDeTx2, TX2_LESSONS, type Tx2Question } from "@/data/de-kiem-tra/thuong-xuyen-2";
import { TX2_ID, TX2_COUNT, TX2_MINUTES, TX2_TITLE } from "@/lib/tx2-config";
import { soGiayTx2ConLai, theoDoiTabTx2 } from "@/lib/tx2-visibility";
import { getHocSinh, saveHocSinh, hopLe, chuanHoa } from "@/lib/hocsinh";
import { playCorrect, playWrong, playCelebration, playClick } from "@/lib/sound";
import Confetti from "@/components/Confetti";
import NopBai from "@/components/NopBai";

const OPTION_LABELS = ["A", "B", "C", "D"];
const DE_KIEM_TRA_TX2 = { id: TX2_ID, title: TX2_TITLE, subtitle: "Phạm vi: Bài 1–6 · 6 nhận biết, 6 thông hiểu, 3 vận dụng", thoiGianPhut: TX2_MINUTES, soCau: TX2_COUNT };
type CauDaTron = Tx2Question & { lessonTag: string };
function tronDe(previousIds: readonly string[] = []): CauDaTron[] {
  return taoDeTx2(previousIds).map((q) => ({ ...q, lessonTag: q.lessonTitle }));
}

function dinhDangGio(giay: number): string {
  const m = Math.floor(giay / 60);
  const s = giay % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function lamTronDiem(d: number): string {
  return (Math.round(d * 100) / 100).toFixed(2).replace(".", ",");
}

export default function KiemTraTx2Client() {
  const [giaiDoan, setGiaiDoan] = useState<"gioi-thieu" | "dang-lam" | "da-nop">("gioi-thieu");
  const [hoTen, setHoTen] = useState("");
  const [lop, setLop] = useState("");
  const [de, setDe] = useState<CauDaTron[]>([]);
  const [cauHienTai, setCauHienTai] = useState(0);
  const [dapAnDaChon, setDapAnDaChon] = useState<(number | null)[]>([]);
  const [giayConLai, setGiayConLai] = useState(DE_KIEM_TRA_TX2.thoiGianPhut * 60);
  const [hoiXacNhanNop, setHoiXacNhanNop] = useState(false);
  const [thoiGianBatDau, setThoiGianBatDau] = useState<number>(0);
  const [thoiGianHoanThanh, setThoiGianHoanThanh] = useState<string>("");
  const [soLanDoiDe, setSoLanDoiDe] = useState(0);
  const [tabDangAn, setTabDangAn] = useState(false);

  const cauHoiRef = useRef<HTMLDivElement>(null);
  const deHienTaiRef = useRef<CauDaTron[]>([]);
  const hetGioLucRef = useRef(0);
  const daNopRef = useRef(false);

  // Tự động nạp thông tin học sinh từ localStorage
  useEffect(() => {
    const hs = getHocSinh();
    if (hs) {
      setHoTen(hs.hoTen);
      setLop(hs.lop);
    }
  }, []);

  // Đếm ngược thời gian
  useEffect(() => {
    if (giaiDoan !== "dang-lam") return;
    const timer = setInterval(() => {
      setGiayConLai(soGiayTx2ConLai(hetGioLucRef.current));
    }, 1000);
    return () => clearInterval(timer);
  }, [giaiDoan]);

  // Chỉ đổi đề trong lúc làm; không tự nộp hay ghi điểm cho đề vừa hủy.
  useEffect(() => {
    if (giaiDoan !== "dang-lam") return;
    return theoDoiTabTx2(document, (hidden) => {
      if (daNopRef.current) return;
      setTabDangAn(hidden);
      const remaining = soGiayTx2ConLai(hetGioLucRef.current);
      setGiayConLai(remaining);
      if (!hidden || remaining === 0) return;
      const boDe = tronDe(deHienTaiRef.current.map((q) => q.id));
      deHienTaiRef.current = boDe;
      setDe(boDe);
      setDapAnDaChon(new Array(boDe.length).fill(null));
      setCauHienTai(0);
      setHoiXacNhanNop(false);
      setSoLanDoiDe((n) => n + 1);
    });
  }, [giaiDoan]);

  // Hết giờ tự động nộp bài
  useEffect(() => {
    if (giaiDoan === "dang-lam" && giayConLai === 0 && !tabDangAn) {
      nopBai();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [giayConLai, giaiDoan, tabDangAn]);

  // Cuộn mượt đến câu hỏi
  useEffect(() => {
    if (cauHoiRef.current) {
      cauHoiRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [cauHienTai]);

  const thongTinHopLe = hopLe({ hoTen, lop });

  function batDauLamBai() {
    if (!thongTinHopLe) return;
    const hs = chuanHoa({ hoTen, lop });
    saveHocSinh(hs);
    setHoTen(hs.hoTen);
    setLop(hs.lop);

    playClick();
    const boDe = tronDe();
    const batDauLuc = Date.now();
    deHienTaiRef.current = boDe;
    hetGioLucRef.current = batDauLuc + DE_KIEM_TRA_TX2.thoiGianPhut * 60 * 1000;
    daNopRef.current = false;
    setSoLanDoiDe(0);
    setTabDangAn(false);
    setDe(boDe);
    setDapAnDaChon(new Array(boDe.length).fill(null));
    setCauHienTai(0);
    setGiayConLai(DE_KIEM_TRA_TX2.thoiGianPhut * 60);
    setThoiGianBatDau(batDauLuc);
    setHoiXacNhanNop(false);
    setGiaiDoan("dang-lam");
  }

  function chonDapAn(phuongAnIndex: number) {
    playClick();
    setDapAnDaChon((prev) => {
      const copy = [...prev];
      copy[cauHienTai] = phuongAnIndex;
      return copy;
    });
  }

  const soCauChuaLam = useMemo(() => {
    return dapAnDaChon.filter((a) => a === null).length;
  }, [dapAnDaChon]);

  const ketQua = useMemo(() => {
    if (!de || de.length === 0) return { soCauDung: 0, diem: 0 };
    const dung = de.filter((q, i) => dapAnDaChon[i] === q.correctIndex).length;
    const d = (dung / de.length) * 10;
    return {
      soCauDung: dung,
      diem: Math.round(d * 100) / 100,
    };
  }, [de, dapAnDaChon]);

  function nopBai() {
    if (giaiDoan !== "dang-lam" || document.hidden || daNopRef.current) return;
    daNopRef.current = true;
    playClick();
    const tgGiay = Math.max(1, Math.round((Date.now() - thoiGianBatDau) / 1000));
    setThoiGianHoanThanh(dinhDangGio(tgGiay));
    setGiaiDoan("da-nop");
    setHoiXacNhanNop(false);

    if (ketQua.diem >= 8.0) {
      playCelebration();
    } else if (ketQua.diem >= 5.0) {
      playCorrect();
    } else {
      playWrong();
    }

  }

  // =========================================================================
  // GIAI ĐOẠN 1: MÀN HÌNH BẮT ĐẦU VÀ NHẬP THÔNG TIN
  // =========================================================================
  if (giaiDoan === "gioi-thieu") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-white px-3.5 py-1.5 font-mono text-xs font-medium text-ink-soft shadow-sm transition hover:border-ink/20 hover:text-ink"
          >
            ← Trang chủ
          </Link>
          <Link
            href="/thi-thu"
            className="inline-flex items-center gap-1.5 rounded-full border border-sea/20 bg-sea/5 px-3.5 py-1.5 font-mono text-xs font-semibold text-sea transition hover:bg-sea/10"
          >
            🎯 Thi thử tốt nghiệp
          </Link>
        </div>

        <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white p-6 shadow-card sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/5 pb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sea/10 px-3 py-1 font-mono text-xs font-bold text-sea">
              📝 ĐÁNH GIÁ THƯỜNG XUYÊN SỐ 2
            </span>
            <span className="font-mono text-xs font-medium text-ink-soft">
              Tin học 12 · Bài 1–6
            </span>
          </div>

          <div className="mt-5">
            <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
              {DE_KIEM_TRA_TX2.title}
            </h1>
            <p className="mt-2 text-sm text-ink-soft leading-relaxed">
              {DE_KIEM_TRA_TX2.subtitle}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-ink/5 bg-cream p-3 text-center">
              <span className="font-mono text-xs text-ink-soft">Số lượng câu</span>
              <p className="mt-0.5 font-display text-xl font-bold text-ink">
                15 <span className="text-xs font-normal text-ink-soft">câu</span>
              </p>
            </div>
            <div className="rounded-2xl border border-ink/5 bg-cream p-3 text-center">
              <span className="font-mono text-xs text-ink-soft">Thời gian</span>
              <p className="mt-0.5 font-display text-xl font-bold text-ink">
                {DE_KIEM_TRA_TX2.thoiGianPhut} <span className="text-xs font-normal text-ink-soft">phút</span>
              </p>
            </div>
            <div className="rounded-2xl border border-ink/5 bg-cream p-3 text-center">
              <span className="font-mono text-xs text-ink-soft">Thang điểm</span>
              <p className="mt-0.5 font-display text-xl font-bold text-leaf-deep">
                10,0 <span className="text-xs font-normal text-ink-soft">điểm</span>
              </p>
            </div>
            <div className="rounded-2xl border border-ink/5 bg-cream p-3 text-center">
              <span className="font-mono text-xs text-ink-soft">Lưu kết quả</span>
              <p className="mt-0.5 font-display text-xs font-bold text-sea">
                Google Sheets
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-ink/10 bg-slate-50/70 p-4">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-ink-soft">
              Phạm vi ma trận kiến thức (15 câu):
            </h3>
            <ul className="mt-2.5 space-y-1.5 text-xs text-ink-soft">{TX2_LESSONS.map((lesson) => <li key={lesson.id}>{lesson.title}: 1 nhận biết + 1 thông hiểu; thêm 1 vận dụng nếu bài được bốc vào nhóm vận dụng.</li>)}</ul>
          </div>

          {/* CƠ CHẾ BỐC ĐỀ NGẪU NHIÊN VÀ BẢO MẬT PHÒNG MÁY */}
          <div className="mt-6 rounded-2xl border border-sea/25 bg-gradient-to-br from-sea/[0.04] via-white to-leaf/[0.04] p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sea text-white text-base shadow-sm">
                  🎲
                </span>
                <div>
                  <h3 className="font-display text-sm font-bold text-ink">
                    Chế độ: Bốc đề ngẫu nhiên từ 6 bài
                  </h3>
                  <p className="font-mono text-[11px] text-ink-soft">
                    6 nhận biết · 6 thông hiểu · 3 vận dụng
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-leaf/15 px-3 py-1 font-mono text-xs font-bold text-leaf-deep">
                🛡️ Hạn chế nhìn bài
              </span>
            </div>

            <p className="mt-3 text-xs text-ink-soft leading-relaxed">
              Mỗi đề có <strong>6 câu nhận biết, 6 câu thông hiểu và 3 câu vận dụng</strong>. Mỗi Bài 1–6 luôn có 1 câu nhận biết và 1 câu thông hiểu; 3 câu vận dụng được lấy từ 3 bài khác nhau chọn ngẫu nhiên. Các đề cùng ma trận nhưng có thể trùng một số câu. Khi chuyển tab, đề thay thế không lặp câu của đề ngay trước đó.
            </p>

            <div className="mt-3.5 grid grid-cols-2 gap-2 border-t border-ink/5 pt-3 sm:grid-cols-4 font-mono text-[11px]">
              <div className="rounded-xl bg-white/80 p-2 border border-ink/5 text-center">
                <span className="text-sea font-bold">✓ Bốc ngẫu nhiên</span>
                <p className="text-[10px] text-ink-soft">Kho 97 câu</p>
              </div>
              <div className="rounded-xl bg-white/80 p-2 border border-ink/5 text-center">
                <span className="text-sea font-bold">✓ Đảo câu hỏi</span>
                <p className="text-[10px] text-ink-soft">15 vị trí khác nhau</p>
              </div>
              <div className="rounded-xl bg-white/80 p-2 border border-ink/5 text-center">
                <span className="text-sea font-bold">✓ Đảo đáp án</span>
                <p className="text-[10px] text-ink-soft">A · B · C · D tráo đổi</p>
              </div>
              <div className="rounded-xl bg-white/80 p-2 border border-ink/5 text-center">
                <span className="text-leaf-deep font-bold">✓ Google Sheets</span>
                <p className="text-[10px] text-ink-soft">Tự động lưu điểm</p>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-berry/30 bg-berry/5 p-4 text-sm text-ink">
            <strong>Quy định chuyển tab:</strong> Khi đang làm bài, nếu chuyển sang tab khác hoặc thu nhỏ trình duyệt, hệ thống sẽ đổi đề và xóa toàn bộ câu trả lời đã chọn. Thời gian vẫn tính trong 16 phút ban đầu, không được cộng thêm. Đề đã hủy không được gửi lên bảng điểm.
          </div>

          {/* Form nhập Họ tên và Lớp của học sinh */}
          <div className="mt-6 rounded-2xl border-2 border-sea/20 bg-sea/[0.03] p-5">
            <h3 className="font-display text-sm font-bold text-ink">
              Thông tin học sinh làm bài thi:
            </h3>
            <p className="mt-0.5 text-xs text-ink-soft">
              Họ tên và lớp sẽ được tự động ghi nhận vào bảng điểm Google Sheets của giáo viên.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
              <label className="block">
                <span className="font-mono text-xs font-semibold text-ink-soft">
                  Họ và tên học sinh *
                </span>
                <input
                  value={hoTen}
                  onChange={(e) => setHoTen(e.target.value)}
                  placeholder="Ví dụ: Hoàng Minh Châu"
                  className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-sm font-medium text-ink placeholder:text-ink-soft/40 focus:border-sea focus:outline-none focus:ring-2 focus:ring-sea/20"
                />
              </label>
              <label className="block sm:w-36">
                <span className="font-mono text-xs font-semibold text-ink-soft">
                  Lớp học *
                </span>
                <input
                  value={lop}
                  onChange={(e) => setLop(e.target.value)}
                  placeholder="Ví dụ: 12A1"
                  className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-sm font-medium uppercase text-ink placeholder:text-ink-soft/40 focus:border-sea focus:outline-none focus:ring-2 focus:ring-sea/20"
                />
              </label>
            </div>

            {!thongTinHopLe && (hoTen !== "" || lop !== "") && (
              <p className="mt-2 font-mono text-xs text-berry">
                ⚠️ Vui lòng ghi đầy đủ họ và tên (có dấu cách) và tên lớp (ví dụ: 12A1, 12A2)
              </p>
            )}
          </div>

          <div className="mt-6">
            <button
              onClick={batDauLamBai}
              disabled={!thongTinHopLe}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sea to-coral py-4 font-display text-base font-bold text-white shadow-lg transition hover:opacity-95 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-40 sm:text-lg"
            >
              Bắt đầu làm bài kiểm tra 🚀
            </button>
            {!thongTinHopLe && (
              <p className="mt-2 text-center font-mono text-xs text-ink-soft/70">
                Nhập đầy đủ Họ tên và Lớp để kích hoạt nút bắt đầu
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // GIAI ĐOẠN 2: ĐANG LÀM BÀI THI
  // =========================================================================
  if (giaiDoan === "dang-lam" && de.length > 0) {
    const cau = de[cauHienTai];
    const canhBaoThoiGian = giayConLai < 5 * 60;
    const hetGioSapDen = giayConLai < 60;

    return (
      <div className="min-h-screen pb-16 pt-4">
        {/* THANH ĐIỀU HƯỚNG CỐ ĐỊNH TRÊN CÙNG */}
        <header className="sticky top-0 z-30 border-b border-ink/10 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sea/10 font-mono text-xs font-bold text-sea">12</span>
              <div>
                <p className="font-display text-xs font-bold text-ink sm:text-sm">
                  {hoTen} · {lop}
                </p>
                <p className="font-mono text-[11px] text-ink-soft">
                  Câu {cauHienTai + 1} / {de.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-sm font-bold transition ${
                  hetGioSapDen
                    ? "animate-pulse bg-berry text-white"
                    : canhBaoThoiGian
                    ? "bg-gold/20 text-gold-deep"
                    : "bg-cream text-ink"
                }`}
              >
                <span>⏳</span>
                <span data-testid="tx2-timer">{dinhDangGio(giayConLai)}</span>
              </div>

              <button
                onClick={() => setHoiXacNhanNop(true)}
                className="rounded-xl bg-gradient-to-r from-leaf to-leaf-deep px-4 py-1.5 font-display text-xs font-bold text-white shadow-sm transition hover:opacity-90 sm:text-sm"
              >
                Nộp bài
              </button>
            </div>
          </div>

          {/* THANH TIẾN ĐỘ */}
          <div className="mx-auto mt-2 h-1.5 max-w-4xl overflow-hidden rounded-full bg-ink/5">
            <div
              className="h-full bg-gradient-to-r from-sea to-leaf transition-all duration-300"
              style={{
                width: `${((de.length - soCauChuaLam) / de.length) * 100}%`,
              }}
            />
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-4 pt-6" ref={cauHoiRef}>
          <div role={soLanDoiDe > 0 ? "alert" : "note"} className="mb-5 rounded-2xl border border-berry/30 bg-berry/5 p-4 text-sm text-ink">
            {soLanDoiDe > 0 ? (
              <><strong>Đã đổi đề {soLanDoiDe} lần do rời tab làm bài.</strong> Câu trả lời của đề trước đã bị xóa. Hãy làm đề mới trong thời gian còn lại; đồng hồ không bắt đầu lại.</>
            ) : (
              <>Chuyển tab hoặc thu nhỏ trình duyệt sẽ đổi đề và xóa các câu trả lời. Thời gian không được cộng thêm.</>
            )}
          </div>
          {/* HÀNG CÁC Ô ĐIỀU HƯỚNG 15 CÂU HỎI */}
          <div className="mb-6 rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-mono text-ink-soft">
                Đã làm:{" "}
                <strong className="text-leaf-deep">
                  {de.length - soCauChuaLam}/{de.length}
                </strong>
              </span>
              {soCauChuaLam > 0 && (
                <span className="font-mono text-gold-deep">
                  Còn {soCauChuaLam} câu chưa chọn
                </span>
              )}
            </div>

            <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-[repeat(15,minmax(0,1fr))]">
              {de.map((_, idx) => {
                const daTraLoi = dapAnDaChon[idx] !== null;
                const dangChon = idx === cauHienTai;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      playClick();
                      setCauHienTai(idx);
                    }}
                    className={`flex h-9 w-full items-center justify-center rounded-xl font-mono text-xs font-bold transition ${
                      dangChon
                        ? "border-2 border-sea bg-sea text-white shadow-md scale-105"
                        : daTraLoi
                        ? "bg-leaf/15 text-leaf-deep border border-leaf/30"
                        : "bg-cream text-ink-soft hover:bg-ink/5 border border-ink/5"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* THẺ CÂU HỎI HIỆN TẠI */}
          <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-card sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/5 pb-3">
              <span className="rounded-full bg-sea/10 px-3 py-1 font-mono text-xs font-bold text-sea">
                CÂU {cauHienTai + 1} / {de.length}
              </span>
              <span className="rounded-full bg-cream px-3 py-1 font-mono text-[11px] font-medium text-ink-soft">
                🏷️ {cau.lessonTag}
              </span>
            </div>

            <h2 data-testid="tx2-question" className="mt-4 font-display text-lg font-bold text-ink leading-snug sm:text-xl">
              {cau.q}
            </h2>
            {cau.code && <pre className="mt-4 overflow-x-auto whitespace-pre rounded-xl bg-cream p-4 font-mono text-sm">{cau.code}</pre>}

            {/* DANH SÁCH 4 PHƯƠNG ÁN */}
            <div className="mt-6 space-y-3">
              {cau.shuffledOptions.map((opt, optIdx) => {
                const daChon = dapAnDaChon[cauHienTai] === optIdx;
                return (
                  <button
                    key={optIdx}
                    data-testid={`tx2-option-${optIdx}`}
                    onClick={() => chonDapAn(optIdx)}
                    className={`flex w-full items-start gap-3.5 rounded-2xl border-2 p-4 text-left transition ${
                      daChon
                        ? "border-sea bg-sea/5 shadow-sm"
                        : "border-ink/10 bg-white hover:border-ink/25 hover:bg-slate-50/50"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold transition ${
                        daChon
                          ? "bg-sea text-white"
                          : "border border-ink/15 bg-cream text-ink-soft"
                      }`}
                    >
                      {OPTION_LABELS[optIdx]}
                    </span>
                    <span
                      className={`pt-1 text-sm sm:text-base leading-relaxed ${
                        daChon ? "font-semibold text-ink" : "text-ink"
                      }`}
                    >
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* NÚT CHUYỂN CÂU */}
            <div className="mt-8 flex items-center justify-between border-t border-ink/5 pt-4">
              <button
                onClick={() => {
                  playClick();
                  setCauHienTai((prev) => Math.max(0, prev - 1));
                }}
                disabled={cauHienTai === 0}
                className="rounded-xl border border-ink/15 bg-white px-4 py-2 font-mono text-xs font-semibold text-ink transition hover:bg-ink/5 disabled:opacity-30"
              >
                ← Câu trước
              </button>

              {cauHienTai < de.length - 1 ? (
                <button
                  onClick={() => {
                    playClick();
                    setCauHienTai((prev) => Math.min(de.length - 1, prev + 1));
                  }}
                  className="rounded-xl bg-sea px-5 py-2 font-mono text-xs font-bold text-white shadow-sm transition hover:bg-sea-deep"
                >
                  Câu tiếp theo →
                </button>
              ) : (
                <button
                  onClick={() => setHoiXacNhanNop(true)}
                  className="rounded-xl bg-gradient-to-r from-leaf to-leaf-deep px-5 py-2 font-mono text-xs font-bold text-white shadow-sm transition hover:opacity-90"
                >
                  Hoàn thành & Nộp bài ✓
                </button>
              )}
            </div>
          </div>
        </main>

        {/* MODAL XÁC NHẬN NỘP BÀI */}
        {hoiXacNhanNop && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md animate-pop-in rounded-3xl bg-white p-6 shadow-2xl">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/15 text-2xl">
                📝
              </div>
              <h3 className="mt-3 text-center font-display text-lg font-bold text-ink">
                Xác nhận nộp bài thi
              </h3>
              <p className="mt-1 text-center text-sm text-ink-soft">
                Học sinh: <strong className="text-ink">{hoTen}</strong> · Lớp{" "}
                <strong className="text-ink">{lop}</strong>
              </p>

              {soCauChuaLam > 0 ? (
                <div className="mt-4 rounded-2xl border border-gold/30 bg-gold/10 p-3.5 text-center text-xs text-gold-deep">
                  ⚠️ Em còn <strong>{soCauChuaLam}</strong> câu chưa chọn đáp án!
                  Em có chắc chắn muốn nộp bài bây giờ không?
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-leaf/30 bg-leaf/10 p-3.5 text-center text-xs text-leaf-deep">
                  ✨ Em đã trả lời đầy đủ toàn bộ <strong>{de.length}/15</strong> câu hỏi!
                </div>
              )}

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setHoiXacNhanNop(false)}
                  className="rounded-xl border border-ink/15 py-2.5 font-display text-sm font-semibold text-ink transition hover:bg-ink/5"
                >
                  Làm tiếp
                </button>
                <button
                  onClick={nopBai}
                  className="rounded-xl bg-gradient-to-r from-leaf to-leaf-deep py-2.5 font-display text-sm font-bold text-white shadow-md transition hover:opacity-95"
                >
                  Đồng ý nộp bài
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // GIAI ĐOẠN 3: ĐÃ NỘP BÀI — XEM KẾT QUẢ VÀ LƯU GOOGLE SHEET
  // =========================================================================
  const { soCauDung, diem } = ketQua;
  const tiLeDung = Math.round((soCauDung / (de.length || 15)) * 100);

  let xepLoai = "Cần cố gắng thêm";
  let xepLoaiMau = "text-berry";
  let iconDanhGia = "💪";

  if (diem >= 9.0) {
    xepLoai = "Xuất sắc tuyệt đối";
    xepLoaiMau = "text-leaf-deep";
    iconDanhGia = "🏆";
  } else if (diem >= 8.0) {
    xepLoai = "Giỏi — Nắm rất vững kiến thức";
    xepLoaiMau = "text-leaf-deep";
    iconDanhGia = "⭐";
  } else if (diem >= 6.5) {
    xepLoai = "Khá — Kết quả tốt";
    xepLoaiMau = "text-sea";
    iconDanhGia = "👍";
  } else if (diem >= 5.0) {
    xepLoai = "Đạt yêu cầu";
    xepLoaiMau = "text-gold-deep";
    iconDanhGia = "👌";
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {diem >= 8.0 && <Confetti />}

      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-white px-3.5 py-1.5 font-mono text-xs font-medium text-ink-soft shadow-sm transition hover:text-ink"
        >
          ← Về trang chủ
        </Link>
        <button
          onClick={() => {
            playClick();
            setGiaiDoan("gioi-thieu");
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-sea/20 bg-sea/5 px-3.5 py-1.5 font-mono text-xs font-semibold text-sea transition hover:bg-sea/10"
        >
          🔄 Làm lại đề này
        </button>
      </div>

      {/* THẺ BẢNG ĐIỂM TỔNG KẾT */}
      <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white p-6 shadow-card sm:p-8">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-sea/10 text-4xl">
            {iconDanhGia}
          </div>
          <p className="mt-3 font-mono text-xs font-bold uppercase tracking-wider text-ink-soft">
            KẾT QUẢ KIỂM TRA THƯỜNG XUYÊN 2
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold text-ink">
            {hoTen} — Lớp {lop}
          </h2>

          <div className="my-5 inline-flex items-baseline gap-1 rounded-3xl bg-cream px-8 py-4 border border-ink/5">
            <span className="font-display text-5xl font-black text-leaf-deep sm:text-6xl">
              {lamTronDiem(diem)}
            </span>
            <span className="font-display text-lg font-bold text-ink-soft">/ 10</span>
          </div>

          <p className={`font-display text-base font-bold ${xepLoaiMau}`}>
            Xếp loại: {xepLoai}
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            Đúng <strong>{soCauDung}/{de.length}</strong> câu ({tiLeDung}%) · Thời gian làm:{" "}
            <strong>{thoiGianHoanThanh}</strong>
          </p>
        </div>

        {/* THÀNH PHẦN NỘP BÀI GOOGLE SHEET */}
        <NopBai
          autoSubmit
          baiId={DE_KIEM_TRA_TX2.id}
          tenBai={`${DE_KIEM_TRA_TX2.title} (Bốc ngẫu nhiên)`}
          dang="Thường xuyên"
          diem={diem}
          soCauDung={soCauDung}
          tongSoCau={de.length}
          diemChu={`${lamTronDiem(diem)}/10 điểm`}
        />

        {/* CHI TIẾT ĐÁP ÁN VÀ GIẢI THÍCH TỪNG CÂU */}
        <div className="mt-10 border-t border-ink/10 pt-6">
          <h3 className="font-display text-lg font-bold text-ink">
            Đối chiếu chi tiết 15 câu hỏi và giải thích:
          </h3>
          <p className="text-xs text-ink-soft">
            Xem lại câu đúng/sai để củng cố kiến thức các bài 1, 2, 3, 4, 5, 6
          </p>

          <div className="mt-5 space-y-5">
            {de.map((q, idx) => {
              const luaChon = dapAnDaChon[idx];
              const laDung = luaChon === q.correctIndex;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border p-5 transition ${
                    laDung
                      ? "border-leaf/30 bg-leaf/[0.03]"
                      : "border-berry/30 bg-berry/[0.03]"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-ink">
                      Câu {idx + 1} · {q.lessonTag}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-mono text-xs font-bold ${
                        laDung
                          ? "bg-leaf/15 text-leaf-deep"
                          : "bg-berry/15 text-berry"
                      }`}
                    >
                      {laDung ? "✓ Đúng" : "✗ Sai"}
                    </span>
                  </div>

                  <p className="mt-2 font-display text-sm font-semibold text-ink sm:text-base">
                    {q.q}
                  </p>
                  {q.code && <pre className="mt-3 overflow-x-auto whitespace-pre rounded-xl bg-cream p-3 font-mono text-xs">{q.code}</pre>}

                  <div className="mt-3 space-y-2">
                    {q.shuffledOptions.map((opt, optIdx) => {
                      const laDapAnDung = optIdx === q.correctIndex;
                      const hocSinhChon = optIdx === luaChon;

                      let kieuVien = "border-ink/10 bg-white";
                      if (laDapAnDung) {
                        kieuVien = "border-leaf/50 bg-leaf/10 text-leaf-deep font-semibold";
                      } else if (hocSinhChon && !laDapAnDung) {
                        kieuVien = "border-berry/50 bg-berry/10 text-berry line-through";
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`flex items-start gap-2.5 rounded-xl border p-2.5 text-xs sm:text-sm ${kieuVien}`}
                        >
                          <span className="font-mono font-bold">
                            {OPTION_LABELS[optIdx]}.
                          </span>
                          <span className="flex-1">{opt}</span>
                          {laDapAnDung && (
                            <span className="font-mono text-xs text-leaf-deep">
                              (Đáp án đúng)
                            </span>
                          )}
                          {hocSinhChon && !laDapAnDung && (
                            <span className="font-mono text-xs text-berry">
                              (Em chọn)
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {q.explain && (
                    <div className="mt-3 rounded-xl bg-ink/5 p-3 text-xs text-ink-soft leading-relaxed">
                      💡 <strong>Giải thích:</strong> {q.explain}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => {
              playClick();
              setGiaiDoan("gioi-thieu");
            }}
            className="flex-1 rounded-xl bg-gradient-to-r from-sea to-coral py-3 font-display text-sm font-bold text-white shadow-md transition hover:opacity-95"
          >
            Làm lại đề kiểm tra 🔄
          </button>
          <Link
            href="/"
            className="flex flex-1 items-center justify-center rounded-xl border border-ink/15 bg-white py-3 font-display text-sm font-bold text-ink transition hover:bg-ink/5"
          >
            Về trang chủ 🏠
          </Link>
        </div>
      </div>
    </div>
  );
}

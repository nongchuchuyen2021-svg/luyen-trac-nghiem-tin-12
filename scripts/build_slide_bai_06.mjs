import fs from 'node:fs';
import path from 'node:path';

// Trình biên soạn Slide bài giảng điện tử Bài 6: Giao tiếp và ứng xử trong không gian mạng
// SGK Tin học 12 (ICT - Kết nối tri thức, trang 34–38).
// Hiệu ứng chuyển động đỉnh cao: Bàn cân SVG cân bằng Được & Mất, mô phỏng tín hiệu phi ngôn ngữ,
// phòng xử lý tình huống Chat giả lập, tứ trụ nhân văn tương tác, âm thanh Web Audio và pháo hoa.

const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bài 6: Giao tiếp và ứng xử trong không gian mạng — Tin học 12</title>
  <style>
    /* ─── RESET & BIẾN MÀU SẮC CHUẨN 2026 ─── */
    :root {
      --bg: #070E18;
      --bg-card: rgba(13, 24, 38, 0.95);
      --border-card: rgba(56, 225, 240, 0.18);
      --ink: #FFFFFF;
      --ink-soft: #94A3B8;
      --sea: #0D7C86;
      --sea-light: #38E1F0;
      --coral: #F2683C;
      --gold: #F5A623;
      --leaf: #10B981;
      --leaf-light: #34D399;
      --berry: #EC4899;
      --berry-light: #F472B6;
      --purple: #8B5CF6;
      --font-main: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      --font-mono: 'Consolas', 'Fira Code', 'Courier New', monospace;
      --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: var(--font-main);
      background: var(--bg);
      color: var(--ink);
      overflow: hidden;
      width: 100vw; height: 100vh;
      user-select: none;
      -webkit-font-smoothing: antialiased;
    }

    /* ─── NỀN KHÔNG GIAN MẠNG VŨ TRỤ SỐ ─── */
    .bg-mesh {
      position: fixed; inset: 0;
      background:
        radial-gradient(circle at 14% 16%, rgba(13, 124, 134, 0.32) 0, transparent 45%),
        radial-gradient(circle at 86% 84%, rgba(236, 72, 153, 0.25) 0, transparent 45%),
        radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.18) 0, transparent 60%);
      animation: meshPulse 14s ease-in-out infinite alternate;
      pointer-events: none; z-index: 0;
    }
    @keyframes meshPulse {
      0%   { transform: scale(1) translate(0, 0); opacity: 0.9; }
      100% { transform: scale(1.06) translate(-10px, 10px); opacity: 1; }
    }

    /* Ký hiệu mạng xã hội trôi nổi */
    .float-layer { position: fixed; inset: 0; pointer-events: none; z-index: 1; overflow: hidden; }
    .float-icon {
      position: absolute;
      font-size: 19px;
      color: rgba(56, 225, 240, 0.2);
      border: 1px solid rgba(56, 225, 240, 0.12);
      padding: 6px 12px; border-radius: 12px;
      background: rgba(13, 124, 134, 0.05);
      animation: floatUp 22s linear infinite;
    }
    @keyframes floatUp {
      0%   { transform: translateY(108vh) rotate(0deg); opacity: 0; }
      10%  { opacity: 0.5; }
      90%  { opacity: 0.5; }
      100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
    }

    /* ─── DECK CONTAINER ─── */
    .deck-container {
      position: relative; width: 100vw; height: 100vh;
      display: flex; justify-content: center; align-items: center; z-index: 2;
    }

    /* ─── SLIDE FRAME ─── */
    .slide {
      position: absolute;
      width: 95vw; max-width: 1380px;
      height: 88vh; max-height: 870px;
      background: var(--bg-card);
      border: 1px solid var(--border-card);
      border-radius: 24px;
      backdrop-filter: blur(28px);
      box-shadow: 0 38px 85px rgba(0, 0, 0, 0.78), inset 0 1px 0 rgba(255, 255, 255, 0.12);
      padding: 26px 42px;
      display: flex; flex-direction: column;
      opacity: 0; pointer-events: none;
      transform: translateX(70px) scale(0.96);
      transition: transform 0.6s var(--ease-spring), opacity 0.5s ease;
      overflow-y: auto;
    }
    .slide::-webkit-scrollbar { width: 6px; }
    .slide::-webkit-scrollbar-thumb { background: rgba(56, 225, 240, 0.25); border-radius: 4px; }
    .slide.active  { opacity: 1; pointer-events: auto; transform: translateX(0) scale(1); z-index: 3; }
    .slide.prev    { opacity: 0; pointer-events: none; transform: translateX(-70px) scale(0.96); }

    /* ─── SLIDE HEADER ─── */
    .slide-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 10px; flex-shrink: 0;
    }
    .slide-badge {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 3px 13px; border-radius: 20px;
      font-size: 12px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;
      background: rgba(13, 124, 134, 0.28); color: #38E1F0;
      border: 1px solid rgba(56, 225, 240, 0.35); margin-bottom: 4px;
    }
    .slide-badge.coral  { background: rgba(242, 104, 60, 0.25);  color: #FF855D; border-color: rgba(255, 133, 93, 0.35); }
    .slide-badge.gold   { background: rgba(245, 166, 35, 0.25);  color: #FFC043; border-color: rgba(255, 192, 67, 0.35); }
    .slide-badge.leaf   { background: rgba(16, 185, 129, 0.25);  color: #34D399; border-color: rgba(52, 211, 153, 0.35); }
    .slide-badge.berry  { background: rgba(236, 72, 153, 0.25);  color: #F472B6; border-color: rgba(244, 114, 182, 0.35); }

    .slide-title {
      font-size: 26px; font-weight: 800; letter-spacing: -0.4px; line-height: 1.25;
      background: linear-gradient(135deg, #FFFFFF 40%, #BFEAF2 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .slide-subtitle { font-size: 13.5px; color: var(--ink-soft); margin-top: 2px; }

    .slide-body {
      flex: 1; display: flex; flex-direction: column;
      justify-content: center; gap: 12px; position: relative;
    }

    /* ─── REVEAL CONTROLLER ─── */
    .reveal-ctrl {
      display: flex; align-items: center; gap: 8px;
      background: rgba(0, 0, 0, 0.35); padding: 5px 13px;
      border-radius: 30px; border: 1px solid rgba(255, 255, 255, 0.1); font-size: 13px;
    }
    .reveal-status { font-weight: 800; color: #38E1F0; font-family: var(--font-mono); }
    .reveal-btn {
      background: linear-gradient(135deg, #0D7C86, #16A8B6); color: #FFF; border: none;
      padding: 5px 12px; border-radius: 16px; font-size: 12px; font-weight: 700;
      cursor: pointer; transition: all 0.25s var(--ease-spring);
      display: inline-flex; align-items: center; gap: 4px;
    }
    .reveal-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 14px rgba(56, 225, 240, 0.45); }

    /* ─── REVEAL ITEMS ─── */
    .reveal-item {
      opacity: 0; transform: translateY(22px) scale(0.97);
      transition: opacity 0.5s var(--ease-spring), transform 0.5s var(--ease-spring), box-shadow 0.4s;
      will-change: opacity, transform;
    }
    .slide.active .reveal-item.visible { opacity: 1; transform: translateY(0) scale(1); }
    .reveal-item.just-revealed {
      box-shadow: 0 0 28px rgba(56, 225, 240, 0.4), inset 0 0 16px rgba(56, 225, 240, 0.15);
      border-color: #38E1F0 !important;
    }

    /* ─── CARDS & GRIDS ─── */
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
    .card {
      background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.09);
      border-radius: 16px; padding: 14px 18px; position: relative; overflow: hidden;
      transition: transform 0.3s var(--ease-spring), border-color 0.3s;
    }
    .card:hover { transform: translateY(-3px); border-color: rgba(56, 225, 240, 0.3); }
    .card-title {
      font-size: 15px; font-weight: 700; color: #FFF; margin-bottom: 6px;
      display: flex; align-items: center; gap: 8px;
    }

    /* NÚT THAO TÁC SIMULATOR */
    .sim-btn {
      background: rgba(255, 255, 255, 0.08); color: #E2E8F0;
      border: 1px solid rgba(255, 255, 255, 0.18); padding: 5px 12px;
      border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer;
      transition: all 0.2s var(--ease-spring); display: inline-flex; align-items: center; gap: 5px;
    }
    .sim-btn:hover { background: rgba(56, 225, 240, 0.2); border-color: #38E1F0; color: #FFF; transform: translateY(-1px); }
    .sim-btn.active { background: #0D7C86; border-color: #38E1F0; color: #FFF; box-shadow: 0 0 12px rgba(56, 225, 240, 0.4); }

    /* ─── BÀN CÂN ĐƯỢC & MẤT SVG ─── */
    #balance-svg { width: 100%; height: 260px; }
    .scale-beam { transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); transform-origin: 300px 70px; }
    .scale-plate-left { transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); }
    .scale-plate-right { transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); }

    /* ─── PHÒNG CHAT GIẢ LẬP TÌNH HUỐNG ─── */
    .chat-container {
      background: #101924; border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 14px; overflow: hidden; display: flex; flex-direction: column;
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.6); font-size: 13px;
    }
    .chat-header {
      background: #1A2634; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08); font-weight: 700; color: #38E1F0;
    }
    .chat-messages {
      padding: 14px; display: flex; flex-direction: column; gap: 10px; min-height: 180px; max-height: 220px; overflow-y: auto;
    }
    .chat-bubble {
      max-width: 80%; padding: 8px 12px; border-radius: 12px; line-height: 1.45;
      font-size: 13px; animation: popIn 0.3s var(--ease-spring);
    }
    .chat-bubble.them {
      background: #243447; color: #E2E8F0; align-self: flex-start; border-bottom-left-radius: 2px;
    }
    .chat-bubble.me {
      background: #0078D4; color: white; align-self: flex-end; border-bottom-right-radius: 2px;
    }
    @keyframes popIn {
      0% { transform: scale(0.85); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }

    /* QUIZ CARDS */
    .quiz-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .quiz-card {
      background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 14px; padding: 14px; display: flex; flex-direction: column; gap: 8px;
    }
    .quiz-q { font-size: 13.5px; font-weight: 700; color: #FFF; line-height: 1.4; }
    .quiz-btn {
      background: rgba(255, 255, 255, 0.06); color: #E2E8F0;
      border: 1px solid rgba(255, 255, 255, 0.12); padding: 7px 11px;
      border-radius: 8px; font-size: 12px; text-align: left; cursor: pointer;
      transition: all 0.2s var(--ease-spring);
    }
    .quiz-btn:hover { background: rgba(56, 225, 240, 0.15); border-color: #38E1F0; color: #FFF; transform: translateX(4px); }
    .quiz-btn.correct { background: #059669 !important; border-color: #34D399 !important; color: #FFF !important; font-weight: 700; }
    .quiz-btn.wrong   { background: #DC2626 !important; border-color: #F87171 !important; color: #FFF !important; animation: shake 0.4s ease; }
    @keyframes shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-6px); } 40%, 80% { transform: translateX(6px); } }
    .quiz-feedback { font-size: 12px; margin-top: 3px; padding: 5px 9px; border-radius: 6px; display: none; line-height: 1.4; }

    /* CHECKLIST */
    .checklist-item {
      display: flex; align-items: center; gap: 10px;
      padding: 8px 12px; background: rgba(255, 255, 255, 0.04);
      border-radius: 8px; cursor: pointer; transition: all 0.2s;
      border: 1px solid rgba(255, 255, 255, 0.06); font-size: 13.5px;
    }
    .checklist-item:hover { background: rgba(56, 225, 240, 0.1); border-color: rgba(56, 225, 240, 0.3); }
    .checklist-item.done {
      background: rgba(16, 185, 129, 0.15); border-color: #10B981; color: #34D399; text-decoration: line-through;
    }

    /* ─── DECK NAV DƯỚI CÙNG ─── */
    .deck-nav {
      position: fixed; bottom: 13px; left: 50%; transform: translateX(-50%);
      background: rgba(8, 15, 24, 0.9); border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 40px; padding: 6px 16px;
      display: flex; align-items: center; gap: 12px;
      backdrop-filter: blur(18px); z-index: 100;
      box-shadow: 0 10px 32px rgba(0, 0, 0, 0.65);
    }
    .nav-btn {
      background: transparent; border: none; color: #E2E8F0; font-size: 18px;
      cursor: pointer; padding: 3px 9px; border-radius: 20px;
      transition: all 0.2s; display: flex; align-items: center;
    }
    .nav-btn:hover { color: #38E1F0; background: rgba(255, 255, 255, 0.1); transform: scale(1.12); }
    .deck-progress { width: 220px; height: 6px; background: rgba(255, 255, 255, 0.14); border-radius: 3px; overflow: hidden; }
    .deck-progress-bar { height: 100%; width: 0; background: linear-gradient(90deg, #0D7C86, #EC4899, #38E1F0); transition: width 0.3s var(--ease-spring); }
    .deck-counter { font-size: 13px; font-weight: 700; color: #94A3B8; font-family: var(--font-mono); min-width: 56px; text-align: center; }

    #confettiCanvas { position: fixed; inset: 0; pointer-events: none; z-index: 999; }
  </style>
</head>
<body>

  <div class="bg-mesh"></div>
  <div class="float-layer">
    <div class="float-icon" style="left: 6%; animation-delay: 0s;">🌐 Cyberspace</div>
    <div class="float-icon" style="left: 18%; animation-delay: 4s;">🤝 Tôn trọng</div>
    <div class="float-icon" style="left: 32%; animation-delay: 9s;">💬 Lịch sự</div>
    <div class="float-icon" style="left: 48%; animation-delay: 2s;">💗 Thấu hiểu</div>
    <div class="float-icon" style="left: 64%; animation-delay: 7s;">🫶 Hỗ trợ</div>
    <div class="float-icon" style="left: 78%; animation-delay: 12s;">📜 QĐ 874/BTTTT</div>
    <div class="float-icon" style="left: 88%; animation-delay: 16s;">⚖️ Đạo đức số</div>
  </div>

  <canvas id="confettiCanvas"></canvas>
  <div class="deck-container">

    <!-- ══ SLIDE 1: TRANG BÌA ════════════════════════════════════════════════ -->
    <section class="slide active" id="slide-1" data-total-reveal="3">
      <div class="slide-header">
        <div>
          <span class="slide-badge berry">Chủ đề B · Đạo đức, Pháp luật &amp; Văn hóa số · Tin học 12</span>
          <div class="slide-title">Bài 6. Giao tiếp và ứng xử trong không gian mạng</div>
          <div class="slide-subtitle">Sách giáo khoa Kết nối tri thức với cuộc sống (Trang 34 – 38)</div>
        </div>
        <div class="reveal-ctrl">
          <span>✨ Hiệu ứng:</span>
          <span class="reveal-status" id="slide-1-status">0 / 3</span>
          <button class="reveal-btn" onclick="revealNext();">▶ Hiện ý (↓)</button>
          <button class="reveal-btn" style="background: rgba(255,255,255,0.15);" onclick="revealAll();">Hiện hết</button>
        </div>
      </div>
      <div class="slide-body">
        <div class="grid-3" style="margin-top: 8px;">
          <div class="card reveal-item" style="border-top: 4px solid #38E1F0; text-align: center; padding: 22px 16px;">
            <div style="font-size: 42px; margin-bottom: 10px;">🌐</div>
            <div style="font-size: 16px; font-weight: 700; color: #38E1F0; margin-bottom: 6px;">Không gian mạng là gì?</div>
            <p style="font-size: 13.5px; color: #CBD5E1; line-height: 1.5;">Thế giới ảo được tạo ra nhờ mạng máy tính, trong đó Internet là không gian mạng lớn nhất của nhân loại.</p>
          </div>
          <div class="card reveal-item" style="border-top: 4px solid #F5A623; text-align: center; padding: 22px 16px;">
            <div style="font-size: 42px; margin-bottom: 10px;">⚖️</div>
            <div style="font-size: 16px; font-weight: 700; color: #FFC043; margin-bottom: 6px;">Bàn cân Được &amp; Mất</div>
            <p style="font-size: 13.5px; color: #CBD5E1; line-height: 1.5;">4 Ưu điểm vượt trội đối chiếu với 4 Nhược điểm tiềm ẩn — đặc biệt là sự thiếu vắng tín hiệu phi ngôn ngữ.</p>
          </div>
          <div class="card reveal-item" style="border-top: 4px solid #EC4899; text-align: center; padding: 22px 16px;">
            <div style="font-size: 42px; margin-bottom: 10px;">💗</div>
            <div style="font-size: 16px; font-weight: 700; color: #F472B6; margin-bottom: 6px;">Ứng xử nhân văn</div>
            <p style="font-size: 13.5px; color: #CBD5E1; line-height: 1.5;">Tứ trụ: <strong>Tôn trọng – Lịch sự – Thấu hiểu – Hỗ trợ</strong> theo chuẩn Quyết định số 874-QĐ-BTTTT.</p>
          </div>
        </div>

        <div class="card reveal-item" style="background: rgba(236, 72, 153, 0.12); border: 1px dashed rgba(244, 114, 182, 0.4); padding: 10px 18px; display: flex; align-items: center; justify-content: space-between;">
          <span style="font-size: 13.5px; color: #E2E8F0;">⌨️ <strong>Space/→</strong> chuyển slide · <strong>↓</strong> mở từng ý · <strong>F</strong> toàn màn hình · <strong>M</strong> bật/tắt âm thanh</span>
          <button class="sim-btn" onclick="nextSlide();" style="background: #EC4899; color: white;">Bắt đầu bài học 🚀</button>
        </div>
      </div>
    </section>

    <!-- ══ SLIDE 2: KHÁI NIỆM KHÔNG GIAN MẠNG ═════════════════════════════════ -->
    <section class="slide" id="slide-2" data-total-reveal="3">
      <div class="slide-header">
        <div>
          <span class="slide-badge berry">Khái niệm cốt lõi · Trang 34</span>
          <div class="slide-title">Không gian mạng (Cyberspace) là gì?</div>
          <div class="slide-subtitle">Môi trường sống thứ hai của con người trong kỷ nguyên số</div>
        </div>
        <div class="reveal-ctrl">
          <span>✨</span><span class="reveal-status" id="slide-2-status">0 / 3</span>
          <button class="reveal-btn" onclick="revealNext();">▶ Hiện ý</button>
          <button class="reveal-btn" style="background: rgba(255,255,255,0.15);" onclick="revealAll();">Hiện hết</button>
        </div>
      </div>
      <div class="slide-body">
        <div class="card reveal-item" style="border-left: 5px solid #38E1F0; padding: 12px 18px;">
          <div class="card-title">📖 Định nghĩa chuẩn SGK Tin học 12 (Trang 34):</div>
          <p style="font-size: 14.5px; line-height: 1.6; color: #E2E8F0;">
            <strong>Không gian mạng</strong> (còn được gọi là <strong>thế giới ảo</strong>) là môi trường được tạo ra nhờ sử dụng mạng máy tính, trong đó <strong>Internet có thể được coi là không gian mạng lớn nhất</strong>.
          </p>
        </div>

        <div class="grid-2 reveal-item">
          <!-- CÁC KÊNH GIAO TIẾP TRỰC TUYẾN -->
          <div class="card" style="border-top: 4px solid #0078D4;">
            <div class="card-title" style="color: #60CDFF;">🌐 Các kênh giao tiếp trên mạng:</div>
            <ul style="margin-left: 18px; font-size: 13.5px; line-height: 1.7; color: #CBD5E1;">
              <li><strong>Mạng xã hội:</strong> Facebook, TikTok, Instagram, Zalo...</li>
              <li><strong>Ứng dụng nhắn tin &amp; gọi video:</strong> Messenger, Zalo, FaceTime, Zoom, Teams...</li>
              <li><strong>Thư điện tử (Email):</strong> Trao đổi học tập và công việc chuyên nghiệp.</li>
              <li><strong>Diễn đàn trực tuyến, Blog &amp; Sàn thương mại điện tử:</strong> Shopee, Tiki, Voz...</li>
            </ul>
          </div>

          <!-- PHÂN BIỆT BẪY SGK -->
          <div class="card" style="border-top: 4px solid #F5A623;">
            <div class="card-title" style="color: #FFC043;">⚠️ Bẫy phân biệt hay gặp nhất:</div>
            <div style="font-size: 13.5px; line-height: 1.6; color: #CBD5E1;">
              <p><strong>Ví dụ 1:</strong> Chat với trợ lý ảo (Chatbot) trên web tuyển sinh → <em>Là giao tiếp mạng</em>.</p>
              <p style="margin-top: 6px;"><strong>Ví dụ 2:</strong> Học lớp học trực tuyến qua Zoom → <em>Là giao tiếp mạng</em>.</p>
              <p style="margin-top: 6px; color: #F87171; font-weight: 700;">
                ❌ Hẹn bạn ra quán Cà phê Internet ngồi nói chuyện trực tiếp → KHÔNG PHẢI giao tiếp mạng (đây là gặp mặt trực tiếp ngoài đời thực)!
              </p>
            </div>
          </div>
        </div>

        <div class="card reveal-item" style="background: rgba(13, 124, 134, 0.12); padding: 10px 16px; font-size: 13px;">
          💡 <strong>Thông điệp:</strong> Không gian mạng tuy "ảo" về phương tiện kết nối, nhưng <em>con người và cảm xúc phía sau màn hình là hoàn toàn có thật</em>!
        </div>
      </div>
    </section>

    <!-- ══ SLIDE 3: BỐN ƯU ĐIỂM NỔI BẬT ═══════════════════════════════════════ -->
    <section class="slide" id="slide-3" data-total-reveal="4">
      <div class="slide-header">
        <div>
          <span class="slide-badge leaf">Mặt tích cực · Trang 34-35</span>
          <div class="slide-title">Bốn Ưu điểm Nổi bật của Giao tiếp qua mạng</div>
          <div class="slide-subtitle">Sức mạnh công nghệ giúp con người vượt qua mọi giới hạn khoảng cách và thời gian</div>
        </div>
        <div class="reveal-ctrl">
          <span>✨</span><span class="reveal-status" id="slide-3-status">0 / 4</span>
          <button class="reveal-btn" onclick="revealNext();">▶ Hiện ý</button>
          <button class="reveal-btn" style="background: rgba(255,255,255,0.15);" onclick="revealAll();">Hiện hết</button>
        </div>
      </div>
      <div class="slide-body">
        <div class="grid-4">
          <!-- ƯU ĐIỂM 1 -->
          <div class="card reveal-item" style="border-top: 4px solid #38E1F0; text-align: center;">
            <div style="font-size: 36px; margin-bottom: 8px;">📍</div>
            <div style="font-size: 15px; font-weight: 700; color: #38E1F0; margin-bottom: 6px;">1. Thuận tiện</div>
            <p style="font-size: 12.5px; color: #CBD5E1; line-height: 1.5;">
              Thực hiện được <strong>mọi nơi, mọi lúc</strong> miễn là có mạng. Vô cùng hữu ích cho những người sống cách xa nhau nửa vòng Trái Đất.
            </p>
          </div>

          <!-- ƯU ĐIỂM 2 -->
          <div class="card reveal-item" style="border-top: 4px solid #10B981; text-align: center;">
            <div style="font-size: 36px; margin-bottom: 8px;">💰</div>
            <div style="font-size: 15px; font-weight: 700; color: #34D399; margin-bottom: 6px;">2. Tiết kiệm</div>
            <p style="font-size: 12.5px; color: #CBD5E1; line-height: 1.5;">
              Tiết kiệm tối đa <strong>thời gian và chi phí đi lại</strong>. Họp trực tuyến giúp doanh nghiệp giảm kinh phí vé máy bay, ăn ở.
            </p>
          </div>

          <!-- ƯU ĐIỂM 3 -->
          <div class="card reveal-item" style="border-top: 4px solid #F5A623; text-align: center;">
            <div style="font-size: 36px; margin-bottom: 8px;">🤝</div>
            <div style="font-size: 15px; font-weight: 700; color: #FFC043; margin-bottom: 6px;">3. Kết nối xã hội</div>
            <p style="font-size: 12.5px; color: #CBD5E1; line-height: 1.5;">
              Dễ dàng kết nối cộng đồng có <strong>cùng sở thích, chuyên môn</strong>. Xây dựng thương hiệu cá nhân và doanh nghiệp toàn cầu.
            </p>
          </div>

          <!-- ƯU ĐIỂM 4 -->
          <div class="card reveal-item" style="border-top: 4px solid #8B5CF6; text-align: center;">
            <div style="font-size: 36px; margin-bottom: 8px;">🧰</div>
            <div style="font-size: 15px; font-weight: 700; color: #C4B5FD; margin-bottom: 6px;">4. Đa dạng công cụ</div>
            <p style="font-size: 12.5px; color: #CBD5E1; line-height: 1.5;">
              Nhắn tin nhanh, gọi video, email, chia sẻ màn hình... Người dùng tự do <strong>chọn công cụ tối ưu nhất</strong> cho từng mục đích.
            </p>
          </div>
        </div>

        <div class="card reveal-item" style="background: rgba(16, 185, 129, 0.1); border-color: rgba(52, 211, 153, 0.3); padding: 10px 16px; font-size: 13px;">
          📖 <strong>Nhận định SGK:</strong> Bốn ưu điểm trên biến không gian mạng thành công cụ hỗ trợ mang tính cách mạng cho khoa học, giáo dục và đời sống hiện đại.
        </div>
      </div>
    </section>

    <!-- ══ SLIDE 4: BỐN NHƯỢC ĐIỂM & RỦI RO TIỀM ẨN ════════════════════════════ -->
    <section class="slide" id="slide-4" data-total-reveal="4">
      <div class="slide-header">
        <div>
          <span class="slide-badge coral">Mặt trái &amp; Cạm bẫy · Trang 35</span>
          <div class="slide-title">Bốn Nhược điểm &amp; Rủi ro khi Giao tiếp qua mạng</div>
          <div class="slide-subtitle">Những hệ lụy tâm lý, an ninh dữ liệu và mâu thuẫn nảy sinh từ thế giới ảo</div>
        </div>
        <div class="reveal-ctrl">
          <span>✨</span><span class="reveal-status" id="slide-4-status">0 / 4</span>
          <button class="reveal-btn" onclick="revealNext();">▶ Hiện ý</button>
          <button class="reveal-btn" style="background: rgba(255,255,255,0.15);" onclick="revealAll();">Hiện hết</button>
        </div>
      </div>
      <div class="slide-body">
        <div class="grid-4">
          <!-- NHƯỢC ĐIỂM 1 -->
          <div class="card reveal-item" style="border-top: 4px solid #EF4444; text-align: center;">
            <div style="font-size: 36px; margin-bottom: 8px;">😐</div>
            <div style="font-size: 14.5px; font-weight: 700; color: #F87171; margin-bottom: 6px;">Thiếu tín hiệu phi ngôn ngữ</div>
            <p style="font-size: 12.5px; color: #CBD5E1; line-height: 1.5;">
              Thiếu <strong>nét mặt, cử chỉ, ánh mắt và ngữ điệu giọng nói</strong>. Dễ gây hiểu lầm tai hại từ những câu chữ vô tình!
            </p>
          </div>

          <!-- NHƯỢC ĐIỂM 2 -->
          <div class="card reveal-item" style="border-top: 4px solid #F5A623; text-align: center;">
            <div style="font-size: 36px; margin-bottom: 8px;">🔓</div>
            <div style="font-size: 14.5px; font-weight: 700; color: #FFC043; margin-bottom: 6px;">Nguy cơ mất bảo mật</div>
            <p style="font-size: 12.5px; color: #CBD5E1; line-height: 1.5;">
              Lộ mật khẩu, bị tấn công mạng, <strong>xâm phạm quyền riêng tư</strong>, rò rỉ dữ liệu nhạy cảm rơi vào tay kẻ xấu tống tiền.
            </p>
          </div>

          <!-- NHƯỢC ĐIỂM 3 -->
          <div class="card reveal-item" style="border-top: 4px solid #EC4899; text-align: center;">
            <div style="font-size: 36px; margin-bottom: 8px;">🎭</div>
            <div style="font-size: 14.5px; font-weight: 700; color: #F472B6; margin-bottom: 6px;">Dễ giả mạo, thiếu tin cậy</div>
            <p style="font-size: 12.5px; color: #CBD5E1; line-height: 1.5;">
              Người dùng dễ dàng <strong>giấu mặt, tạo nick ảo hoặc giả danh</strong>. Khó đánh giá tính chân thật, thiếu gắn kết bền chặt.
            </p>
          </div>

          <!-- NHƯỢC ĐIỂM 4 -->
          <div class="card reveal-item" style="border-top: 4px solid #64748B; text-align: center;">
            <div style="font-size: 36px; margin-bottom: 8px;">📵</div>
            <div style="font-size: 14.5px; font-weight: 700; color: #94A3B8; margin-bottom: 6px;">Sự cố kỹ thuật</div>
            <p style="font-size: 12.5px; color: #CBD5E1; line-height: 1.5;">
              Mất kết nối mạng, giật lag, phần mềm không tương thích làm cuộc trò chuyện bị <strong>trì hoãn, gián đoạn</strong> lúc quan trọng.
            </p>
          </div>
        </div>

        <div class="card reveal-item" style="background: rgba(239, 68, 68, 0.1); border-color: rgba(248, 113, 113, 0.3); padding: 10px 16px; font-size: 13px;">
          ⚠️ <strong>Hậu quả nghiện mạng:</strong> Ngoài 4 nhược điểm trên, việc lạm dụng thế giới ảo còn dẫn đến suy giảm thị lực, mất ngủ, xa rời thực tế và tổn hại sức khỏe tinh thần.
        </div>
      </div>
    </section>

    <!-- ══ SLIDE 5: BÀN CÂN SVG ĐƯỢC VÀ MẤT TƯƠNG TÁC ═════════════════════════ -->
    <section class="slide" id="slide-5" data-total-reveal="3">
      <div class="slide-header">
        <div>
          <span class="slide-badge gold">Mô phỏng tương tác</span>
          <div class="slide-title">Bàn cân Được &amp; Mất — Đặt lên bàn cân lý trí</div>
          <div class="slide-subtitle">Quan sát sự cân bằng giữa lợi ích to lớn và rủi ro rình rập trên không gian mạng</div>
        </div>
        <div class="reveal-ctrl">
          <span>✨</span><span class="reveal-status" id="slide-5-status">0 / 3</span>
          <button class="reveal-btn" onclick="revealNext();">▶ Hiện ý</button>
          <button class="reveal-btn" style="background: rgba(255,255,255,0.15);" onclick="revealAll();">Hiện hết</button>
        </div>
      </div>
      <div class="slide-body">
        <div class="card reveal-item" style="padding: 10px; position: relative;">
          <!-- SVG BÀN CÂN HOẠT HỌA -->
          <svg id="balance-svg" viewBox="0 0 600 240">
            <!-- TRỤ CÂN -->
            <polygon points="300,50 280,210 320,210" fill="#334155"/>
            <rect x="240" y="210" width="120" height="15" rx="4" fill="#1E293B" stroke="#475569"/>
            <circle cx="300" cy="70" r="12" fill="#38E1F0" stroke="#0D7C86" stroke-width="3"/>

            <!-- ĐÒN CÂN CHUYỂN ĐỘNG -->
            <g id="scale-beam-group" class="scale-beam">
              <rect x="100" y="66" width="400" height="8" rx="4" fill="#38E1F0"/>
              <!-- DÂY CÂN TRÁI -->
              <line x1="130" y1="74" x2="100" y2="150" stroke="#94A3B8" stroke-width="2"/>
              <line x1="130" y1="74" x2="160" y2="150" stroke="#94A3B8" stroke-width="2"/>
              <!-- ĐĨA CÂN TRÁI (ƯU ĐIỂM) -->
              <g id="plate-left" class="scale-plate-left">
                <path d="M 80 150 Q 130 180 180 150 Z" fill="#059669" opacity="0.8"/>
                <text x="130" y="140" fill="#34D399" font-size="13" font-weight="700" text-anchor="middle">4 ƯU ĐIỂM</text>
              </g>

              <!-- DÂY CÂN PHẢI -->
              <line x1="470" y1="74" x2="440" y2="150" stroke="#94A3B8" stroke-width="2"/>
              <line x1="470" y1="74" x2="500" y2="150" stroke="#94A3B8" stroke-width="2"/>
              <!-- ĐĨA CÂN PHẢI (NHƯỢC ĐIỂM) -->
              <g id="plate-right" class="scale-plate-right">
                <path d="M 420 150 Q 470 180 520 150 Z" fill="#DC2626" opacity="0.8"/>
                <text x="470" y="140" fill="#F87171" font-size="13" font-weight="700" text-anchor="middle">4 NHƯỢC ĐIỂM</text>
              </g>
            </g>
          </svg>

          <div id="scale-status-text" style="text-align: center; font-size: 13.5px; font-weight: 700; color: #38E1F0; padding: 4px;">
            ⚖️ Trạng thái: Cân bằng — Hiểu rõ cả hai mặt để làm chủ không gian mạng!
          </div>
        </div>

        <div class="interact-panel reveal-item" style="display: flex; gap: 10px; justify-content: center;">
          <button class="sim-btn active" onclick="tiltScale('balance');">⚖️ Giữ thế cân bằng</button>
          <button class="sim-btn" onclick="tiltScale('left');">💚 Nghiêng về Ưu điểm (Tận dụng công nghệ)</button>
          <button class="sim-btn" onclick="tiltScale('right');">⚠️ Nghiêng về Nhược điểm (Cảnh giác rủi ro)</button>
        </div>

        <div class="card reveal-item" style="background: rgba(13, 124, 134, 0.12); padding: 10px 16px; font-size: 13px;">
          🔑 <strong>Kết luận SGK:</strong> Giao tiếp mạng có nhiều ưu điểm vượt trội song cũng tiềm ẩn rủi ro lớn. Để biến mạng thành lợi thế, người dùng <strong>bắt buộc phải có chuẩn mực ứng xử đúng đắn</strong>!
        </div>
      </div>
    </section>

    <!-- ══ SLIDE 6: MÔ PHỎNG TÍN HIỆU PHI NGÔN NGỮ ═══════════════════════════ -->
    <section class="slide" id="slide-6" data-total-reveal="3">
      <div class="slide-header">
        <div>
          <span class="slide-badge berry">Phân tích sâu sắc · Trang 35</span>
          <div class="slide-title">Vì sao nhắn tin lại dễ gây hiểu lầm hơn nói trực tiếp?</div>
          <div class="slide-subtitle">Sức mạnh bí mật của Tín hiệu phi ngôn ngữ (Ánh mắt, nét mặt, ngữ điệu)</div>
        </div>
        <div class="reveal-ctrl">
          <span>✨</span><span class="reveal-status" id="slide-6-status">0 / 3</span>
          <button class="reveal-btn" onclick="revealNext();">▶ Hiện ý</button>
          <button class="reveal-btn" style="background: rgba(255,255,255,0.15);" onclick="revealAll();">Hiện hết</button>
        </div>
      </div>
      <div class="slide-body">
        <div class="grid-2">
          <!-- TRỰC DIỆN MẶT ĐỐI MẶT -->
          <div class="card reveal-item" style="border-left: 5px solid #10B981;">
            <div class="card-title" style="color: #34D399;">🗣️ Gặp mặt trực tiếp (Đầy đủ tín hiệu):</div>
            <p style="font-size: 13px; line-height: 1.6; color: #CBD5E1;">
              Khi nói câu: <em>"Bạn giỏi thật đấy!"</em>:
            </p>
            <div style="background: rgba(255,255,255,0.04); padding: 10px; border-radius: 8px; margin-top: 6px;">
              <p>😊 <strong>Kèm nụ cười ấm áp, ánh mắt chân thành:</strong> → Người nghe hiểu là lời <strong>khen ngợi thật lòng</strong>.</p>
              <p style="margin-top: 6px;">😒 <strong>Kèm cái bĩu môi, giọng điệu mỉa mai:</strong> → Người nghe hiểu ngay là <strong>châm chọc, mỉa mai</strong>.</p>
            </div>
            <p style="font-size: 12.5px; color: #34D399; margin-top: 8px;">
              ✓ Nhờ nét mặt và giọng nói, thông điệp được truyền tải chính xác 100%!
            </p>
          </div>

          <!-- NHẮN TIN CHAT TEXT -->
          <div class="card reveal-item" style="border-left: 5px solid #EF4444;">
            <div class="card-title" style="color: #F87171;">💬 Nhắn tin thuần văn bản (Mất tín hiệu):</div>
            <p style="font-size: 13px; line-height: 1.6; color: #CBD5E1;">
              Cũng gửi đúng dòng chữ: <em>"Bạn giỏi thật đấy!"</em>:
            </p>
            <div style="background: rgba(255,255,255,0.04); padding: 10px; border-radius: 8px; margin-top: 6px; color: #FCA5A5;">
              Màn hình chỉ có chữ trơ trọi! Người đọc đang vui thì nghĩ là khen; người đọc đang mệt mỏi/tự ái thì <strong>suy diễn là đang khinh thường, xỏ xiên</strong>!
            </div>
            <p style="font-size: 12.5px; color: #FF855D; margin-top: 8px;">
              ⚠️ Không có ngữ điệu và ánh mắt, người đọc tự gán cảm xúc tiêu cực vào câu chữ!
            </p>
          </div>
        </div>

        <div class="card reveal-item" style="background: rgba(245, 166, 35, 0.1); border-color: rgba(255, 192, 67, 0.35); padding: 10px 16px; font-size: 13px;">
          💡 <strong>Giải pháp văn minh:</strong> Khi trao đổi việc quan trọng hoặc nhạy cảm, hãy gọi điện thoại hoặc gọi video; khi nhắn tin hãy dùng thêm biểu tượng cảm xúc (emoji) tích cực hoặc từ ngữ thật rõ ràng để tránh hiểu lầm!
        </div>
      </div>
    </section>

    <!-- ══ SLIDE 7: MỐC PHÁP LÝ QUYẾT ĐỊNH 874/QĐ-BTTTT ════════════════════════ -->
    <section class="slide" id="slide-7" data-total-reveal="3">
      <div class="slide-header">
        <div>
          <span class="slide-badge gold">Hành lang pháp lý · Trang 36</span>
          <div class="slide-title">Quy tắc ứng xử trên mạng theo Pháp luật Việt Nam</div>
          <div class="slide-subtitle">Quyết định số 874/QĐ-BTTTT ngày 17/6/2021 của Bộ Thông tin và Truyền thông</div>
        </div>
        <div class="reveal-ctrl">
          <span>✨</span><span class="reveal-status" id="slide-7-status">0 / 3</span>
          <button class="reveal-btn" onclick="revealNext();">▶ Hiện ý</button>
          <button class="reveal-btn" style="background: rgba(255,255,255,0.15);" onclick="revealAll();">Hiện hết</button>
        </div>
      </div>
      <div class="slide-body">
        <div class="card reveal-item" style="border-left: 5px solid #F5A623; padding: 12px 18px;">
          <div class="card-title" style="color: #FFC043;">📜 Mốc pháp lý quan trọng cần thuộc lòng:</div>
          <p style="font-size: 14.5px; line-height: 1.6; color: #E2E8F0;">
            Bộ Thông tin và Truyền thông đã ban hành <strong>Bộ Quy tắc ứng xử trên mạng xã hội</strong> theo <strong>Quyết định số 874/QĐ-BTTTT ngày 17/6/2021</strong>, áp dụng cho mọi cá nhân, tổ chức sử dụng mạng tại Việt Nam.
          </p>
        </div>

        <div class="grid-4 reveal-item">
          <div class="card" style="border-top: 3px solid #38E1F0; text-align: center;">
            <div style="font-size: 32px;">⚖️</div>
            <div style="font-size: 14px; font-weight: 700; color: #38E1F0; margin-top: 4px;">Tuân thủ pháp luật</div>
            <p style="font-size: 12px; color: #CBD5E1; margin-top: 4px;">Chấp hành nghiêm luật an ninh mạng, chịu trách nhiệm về hành vi của mình.</p>
          </div>
          <div class="card" style="border-top: 3px solid #10B981; text-align: center;">
            <div style="font-size: 32px;">🌱</div>
            <div style="font-size: 14px; font-weight: 700; color: #34D399; margin-top: 4px;">Lành mạnh</div>
            <p style="font-size: 12px; color: #CBD5E1; margin-top: 4px;">Hành vi, ứng xử phù hợp với các giá trị đạo đức, truyền thống văn hóa tốt đẹp.</p>
          </div>
          <div class="card" style="border-top: 3px solid #0078D4; text-align: center;">
            <div style="font-size: 32px;">🛡️</div>
            <div style="font-size: 14px; font-weight: 700; color: #60CDFF; margin-top: 4px;">An toàn &amp; Bảo mật</div>
            <p style="font-size: 12px; color: #CBD5E1; margin-top: 4px;">Bảo vệ dữ liệu cá nhân của mình và tôn trọng quyền riêng tư của người khác.</p>
          </div>
          <div class="card" style="border-top: 3px solid #EC4899; text-align: center;">
            <div style="font-size: 32px;">🤝</div>
            <div style="font-size: 14px; font-weight: 700; color: #F472B6; margin-top: 4px;">Trách nhiệm</div>
            <p style="font-size: 12px; color: #CBD5E1; margin-top: 4px;">Không chia sẻ tin giả, chủ động thông báo cho cơ quan chức năng khi gặp tiêu cực.</p>
          </div>
        </div>

        <div class="card reveal-item" style="background: rgba(139, 92, 246, 0.1); border-color: rgba(196, 181, 253, 0.3); padding: 10px 16px; font-size: 13px;">
          💡 <strong>Nhớ ngày tháng:</strong> Đề thi trắc nghiệm thường hỏi: <em>"Bộ quy tắc ứng xử trên mạng xã hội được ban hành theo Quyết định số nào?"</em> → <strong>874/QĐ-BTTTT ngày 17/6/2021</strong>!
        </div>
      </div>
    </section>

    <!-- ══ SLIDE 8: BỐN YẾU TỐ ỨNG XỬ NHÂN VĂN ═════════════════════════════════ -->
    <section class="slide" id="slide-8" data-total-reveal="4">
      <div class="slide-header">
        <div>
          <span class="slide-badge berry">Cốt lõi nhân cách số · Trang 36</span>
          <div class="slide-title">Bốn yếu tố làm nên Ứng xử nhân văn trên mạng</div>
          <div class="slide-subtitle">Không chỉ tuân thủ luật pháp — người dùng văn minh luôn cư xử từ trái tim</div>
        </div>
        <div class="reveal-ctrl">
          <span>✨</span><span class="reveal-status" id="slide-8-status">0 / 4</span>
          <button class="reveal-btn" onclick="revealNext();">▶ Hiện ý</button>
          <button class="reveal-btn" style="background: rgba(255,255,255,0.15);" onclick="revealAll();">Hiện hết</button>
        </div>
      </div>
      <div class="slide-body">
        <div class="grid-4">
          <!-- TÔN TRỌNG -->
          <div class="card reveal-item" style="border-top: 4px solid #38E1F0;">
            <div style="font-size: 36px; text-align: center; margin-bottom: 6px;">🤝</div>
            <div style="font-size: 15px; font-weight: 700; color: #38E1F0; text-align: center; margin-bottom: 6px;">1. Tôn trọng</div>
            <p style="font-size: 12.5px; color: #CBD5E1; line-height: 1.5;">
              Tôn trọng <strong>quyền riêng tư</strong>, không phát tán tin riêng của người khác. Tôn trọng quan điểm khác biệt, <strong>không ép buộc người khác theo ý mình</strong>.
            </p>
          </div>

          <!-- LỊCH SỰ -->
          <div class="card reveal-item" style="border-top: 4px solid #F5A623;">
            <div style="font-size: 36px; text-align: center; margin-bottom: 6px;">💬</div>
            <div style="font-size: 15px; font-weight: 700; color: #FFC043; text-align: center; margin-bottom: 6px;">2. Lịch sự</div>
            <p style="font-size: 12.5px; color: #CBD5E1; line-height: 1.5;">
              Dùng <strong>ngôn từ đúng mực</strong>, không xúc phạm, phân biệt đối xử. Tránh từ lóng khó hiểu. Chia sẻ tin <strong>chính xác, đáng tin</strong>; không gửi thư rác.
            </p>
          </div>

          <!-- THẤU HIỂU -->
          <div class="card reveal-item" style="border-top: 4px solid #EC4899;">
            <div style="font-size: 36px; text-align: center; margin-bottom: 6px;">💗</div>
            <div style="font-size: 15px; font-weight: 700; color: #F472B6; text-align: center; margin-bottom: 6px;">3. Thấu hiểu</div>
            <p style="font-size: 12.5px; color: #CBD5E1; line-height: 1.5;">
              Đặt mình vào <strong>hoàn cảnh của người khác</strong> để cảm thông với khó khăn họ đang trải qua. Thấu hiểu là chìa khóa để hỗ trợ đúng cách.
            </p>
          </div>

          <!-- HỖ TRỢ -->
          <div class="card reveal-item" style="border-top: 4px solid #10B981;">
            <div style="font-size: 36px; text-align: center; margin-bottom: 6px;">🫶</div>
            <div style="font-size: 15px; font-weight: 700; color: #34D399; text-align: center; margin-bottom: 6px;">4. Hỗ trợ</div>
            <p style="font-size: 12.5px; color: #CBD5E1; line-height: 1.5;">
              Sẵn lòng giúp đỡ khi người khác gặp nạn. Đôi khi chỉ là <strong>lời động viên chân thành, tin nhắn an ủi kịp thời</strong> cũng cứu vớt được một tâm hồn!
            </p>
          </div>
        </div>

        <div class="card reveal-item" style="background: rgba(236, 72, 153, 0.12); padding: 10px 16px; font-size: 13px;">
          📖 <strong>Ghi nhớ SGK:</strong> Bốn yếu tố <em>Tôn trọng – Lịch sự – Thấu hiểu – Sẵn sàng hỗ trợ</em> giúp xây dựng một cộng đồng trực tuyến an toàn, lành mạnh, không làm tổn thương người khác.
        </div>
      </div>
    </section>

    <!-- ══ SLIDE 9: PHÒNG TÌNH HUỐNG 1 — TRÁI Ý KIẾN TRONG NHÓM LỚP ════════════ -->
    <section class="slide" id="slide-9" data-total-reveal="1">
      <div class="slide-header">
        <div>
          <span class="slide-badge coral">Thực hành tình huống thực tế</span>
          <div class="slide-title">Phòng Tình huống 1: Khi bạn đăng ý kiến trái ngược</div>
          <div class="slide-subtitle">Em sẽ chọn phản ứng thế nào trong nhóm chat lớp học?</div>
        </div>
        <div class="reveal-ctrl">
          <button class="sim-btn" onclick="resetChatSim(1);">🔄 Làm lại tình huống</button>
        </div>
      </div>
      <div class="slide-body">
        <div class="grid-2 reveal-item visible">
          <!-- GIAO DIỆN CHAT NHÓM LỚP -->
          <div class="chat-container">
            <div class="chat-header">
              <span>💬 Nhóm Chat Tin học 12A1 (42 thành viên)</span>
            </div>
            <div class="chat-messages" id="chat-box-1">
              <div class="chat-bubble them">
                <strong>Bạn Nam:</strong> "Mình thấy bài tập lập trình này vô ích quá, tốn thời gian, học làm gì chẳng bao giờ dùng đến!"
              </div>
            </div>
          </div>

          <!-- LỰA CHỌN PHẢN ỨNG -->
          <div class="card" style="display: flex; flex-direction: column; gap: 8px;">
            <div class="card-title">🤔 Là một công dân số nhân văn, em chọn:</div>
            <button class="sim-btn" onclick="chooseChatResponse(1, 'A');" style="text-align: left; padding: 10px;">
              🔴 A. Bình luận gay gắt: "Ngu thì im đi, không học được thì ra khỏi nhóm lớp!"
            </button>
            <button class="sim-btn" onclick="chooseChatResponse(1, 'B');" style="text-align: left; padding: 10px;">
              🟡 B. Chụp màn hình gửi sang nhóm khác để mọi người cùng vào cười cợt, cô lập bạn.
            </button>
            <button class="sim-btn" onclick="chooseChatResponse(1, 'C');" style="text-align: left; padding: 10px; background: rgba(16, 185, 129, 0.15); border-color: #10B981;">
              🟢 C. Nhắn lịch sự: "Mình hiểu Nam đang gặp khó khăn khi làm bài. Nhưng lập trình rèn tư duy logic rất tốt đấy, chiều nay mình qua hướng dẫn bạn nhé!"
            </button>
            <div id="chat-feedback-1" style="margin-top: 8px; font-size: 13px; line-height: 1.5; color: #CBD5E1; padding: 8px; border-radius: 6px;"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ SLIDE 10: PHÒNG TÌNH HUỐNG 2 — BẢO VỆ QUYỀN RIÊNG TƯ & TIN ĐỒN ═════ -->
    <section class="slide" id="slide-10" data-total-reveal="1">
      <div class="slide-header">
        <div>
          <span class="slide-badge coral">Thực hành tình huống thực tế</span>
          <div class="slide-title">Phòng Tình huống 2: Bức ảnh nhạy cảm &amp; Tin đồn thất thiệt</div>
          <div class="slide-subtitle">Ứng xử chuẩn mực trước cám dỗ "hóng biến" và phát tán đời tư</div>
        </div>
        <div class="reveal-ctrl">
          <button class="sim-btn" onclick="resetChatSim(2);">🔄 Làm lại tình huống</button>
        </div>
      </div>
      <div class="slide-body">
        <div class="grid-2 reveal-item visible">
          <!-- GIAO DIỆN MẠNG XÃ HỘI -->
          <div class="chat-container">
            <div class="chat-header">
              <span>📩 Tin nhắn riêng tư từ một người ẩn danh</span>
            </div>
            <div class="chat-messages" id="chat-box-2">
              <div class="chat-bubble them">
                <strong>Người lạ:</strong> "Này, mình có ảnh chụp tin nhắn riêng và ảnh dìm hàng của bạn Hoa trong lớp bạn nè. Có muốn xem không để gửi cho nhóm bóc phốt?"
              </div>
            </div>
          </div>

          <!-- LỰA CHỌN PHẢN ỨNG -->
          <div class="card" style="display: flex; flex-direction: column; gap: 8px;">
            <div class="card-title">🤔 Quyết định chuẩn mực của em là:</div>
            <button class="sim-btn" onclick="chooseChatResponse(2, 'A');" style="text-align: left; padding: 10px;">
              🔴 A. Háo hức xin link rồi chuyển tiếp ngay vào các nhóm chat khác để câu view.
            </button>
            <button class="sim-btn" onclick="chooseChatResponse(2, 'B');" style="text-align: left; padding: 10px;">
              🟡 B. Im lặng không nói gì nhưng vẫn lưu lại xem một mình.
            </button>
            <button class="sim-btn" onclick="chooseChatResponse(2, 'C');" style="text-align: left; padding: 10px; background: rgba(16, 185, 129, 0.15); border-color: #10B981;">
              🟢 C. Thẳng thắn từ chối, cảnh báo người đó hành vi phát tán đời tư là vi phạm pháp luật, đồng thời bí mật báo cho bạn Hoa và thầy cô biết để bảo vệ bạn!
            </button>
            <div id="chat-feedback-2" style="margin-top: 8px; font-size: 13px; line-height: 1.5; color: #CBD5E1; padding: 8px; border-radius: 6px;"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ SLIDE 11: NĂM CÁCH BIẾN ỨNG XỬ THÀNH THÓI QUEN ═══════════════════════ -->
    <section class="slide" id="slide-11" data-total-reveal="3">
      <div class="slide-header">
        <div>
          <span class="slide-badge leaf">Rèn luyện bản thân · Trang 37</span>
          <div class="slide-title">Năm cách biến Ứng xử nhân văn thành Thói quen</div>
          <div class="slide-subtitle">Không chỉ là lý thuyết trên trang sách — hãy biến thành phản xạ tự nhiên mỗi ngày</div>
        </div>
        <div class="reveal-ctrl">
          <span>✨</span><span class="reveal-status" id="slide-11-status">0 / 3</span>
          <button class="reveal-btn" onclick="revealNext();">▶ Hiện ý</button>
          <button class="reveal-btn" style="background: rgba(255,255,255,0.15);" onclick="revealAll();">Hiện hết</button>
        </div>
      </div>
      <div class="slide-body">
        <div class="card reveal-item" style="border-left: 5px solid #EC4899; padding: 12px 18px;">
          <div class="card-title" style="color: #F472B6;">🌟 Tinh thần cốt lõi của bài học (Trang 37):</div>
          <p style="font-size: 16px; font-weight: 800; color: white;">
            "ĐỐI XỬ VỚI NGƯỜI KHÁC THEO CÁCH MÀ MÌNH MUỐN ĐƯỢC ĐỐI XỬ!"
          </p>
          <p style="font-size: 13px; color: #CBD5E1; margin-top: 4px;">Nếu em không muốn bị nói xấu, bị bóc phốt, bị lừa đảo — thì đừng bao giờ làm điều đó với bất kỳ ai trên mạng!</p>
        </div>

        <div class="grid-2 reveal-item">
          <div class="card" style="border-top: 3px solid #38E1F0;">
            <p style="font-size: 13.5px; line-height: 1.7; color: #E2E8F0;">
              <strong>1. Tự kiểm tra hành vi:</strong> Thường xuyên rà soát lại các bình luận, bài đăng cũ của mình. Nếu thấy có lời lẽ chưa đúng mực, hãy dũng cảm xóa hoặc xin lỗi.
            </p>
            <p style="font-size: 13.5px; line-height: 1.7; color: #E2E8F0; margin-top: 8px;">
              <strong>2. Bình tĩnh lắng nghe:</strong> Khi gặp quan điểm trái chiều, hãy hít thở sâu, không vội phản bác trong cơn giận. Phản hồi lịch sự bằng lý lẽ thuyết phục.
            </p>
          </div>

          <div class="card" style="border-top: 3px solid #F5A623;">
            <p style="font-size: 13.5px; line-height: 1.7; color: #E2E8F0;">
              <strong>3. Tìm trợ giúp khi khó xử:</strong> Khi bị quấy rối hoặc bạo lực mạng, đừng chịu đựng một mình — hãy chia sẻ với cha mẹ, thầy cô hoặc chuyên gia.
            </p>
            <p style="font-size: 13.5px; line-height: 1.7; color: #E2E8F0; margin-top: 8px;">
              <strong>4. Cẩn trọng với ngôn từ:</strong> Uốn tay 7 lần trước khi gõ phím. Đọc lại tin nhắn trước khi nhấn nút Send để đảm bảo không gây hiểu lầm.
            </p>
          </div>
        </div>

        <div class="card reveal-item" style="background: rgba(16, 185, 129, 0.1); border-color: rgba(52, 211, 153, 0.3); padding: 10px 16px; font-size: 13px;">
          💡 <strong>Quy tắc 3 giây:</strong> Trước khi đăng bất kỳ thứ gì lên mạng, hãy dừng lại 3 giây và tự hỏi: <em>"Điều này có đúng sự thật không? Có làm tổn thương ai không? Có tử tế không?"</em>
        </div>
      </div>
    </section>

    <!-- ══ SLIDE 12: NĂM HOÀN CẢNH GIAO TIẾP THƯỜNG GẶP ════════════════════════ -->
    <section class="slide" id="slide-12" data-total-reveal="3">
      <div class="slide-header">
        <div>
          <span class="slide-badge win">Cẩm nang đời sống số · Trang 37-38</span>
          <div class="slide-title">Ứng xử chuẩn mực trong 5 Hoàn cảnh cụ thể</div>
          <div class="slide-subtitle">Quy tắc ứng xử văn minh trong từng tình huống học tập và sinh hoạt mỗi ngày</div>
        </div>
        <div class="reveal-ctrl">
          <span>✨</span><span class="reveal-status" id="slide-12-status">0 / 3</span>
          <button class="reveal-btn" onclick="revealNext();">▶ Hiện ý</button>
          <button class="reveal-btn" style="background: rgba(255,255,255,0.15);" onclick="revealAll();">Hiện hết</button>
        </div>
      </div>
      <div class="slide-body">
        <div class="grid-3 reveal-item">
          <!-- 1. DIỄN ĐÀN -->
          <div class="card" style="border-top: 3px solid #38E1F0;">
            <div class="card-title" style="color: #38E1F0;">🗣️ Tranh luận diễn đàn</div>
            <p style="font-size: 12.5px; color: #CBD5E1; line-height: 1.5;">
              Trao đổi lịch sự, tuyệt đối không công kích cá nhân, không phân biệt vùng miền, giới tính, tôn giáo.
            </p>
          </div>

          <!-- 2. MẠNG XÃ HỘI -->
          <div class="card" style="border-top: 3px solid #0078D4;">
            <div class="card-title" style="color: #60CDFF;">💭 Thảo luận MXH</div>
            <p style="font-size: 12.5px; color: #CBD5E1; line-height: 1.5;">
              Đọc kỹ bài viết của người khác trước khi bình luận. Không ad-hominem (công kích người nói thay vì bàn luận vấn đề).
            </p>
          </div>

          <!-- 3. EMAIL & TIN NHẮN -->
          <div class="card" style="border-top: 3px solid #F5A623;">
            <div class="card-title" style="color: #FFC043;">✉️ Email &amp; Tin nhắn</div>
            <p style="font-size: 12.5px; color: #CBD5E1; line-height: 1.5;">
              Có lời chào đầu và cảm ơn cuối thư. Tôn trọng tin nhắn riêng tư, không chụp màn hình gửi bên thứ ba.
            </p>
          </div>
        </div>

        <div class="grid-2 reveal-item">
          <!-- 4. VIDEO CALL -->
          <div class="card" style="border-top: 3px solid #10B981;">
            <div class="card-title" style="color: #34D399;">📹 Trò chuyện qua Video (Zoom / Meet)</div>
            <p style="font-size: 13px; color: #CBD5E1; line-height: 1.6;">
              Mặc trang phục lịch sự, chọn góc ngồi có hậu cảnh gọn gàng, tránh để lọt hình ảnh nhạy cảm trong nhà vào khung hình camera.
            </p>
          </div>

          <!-- 5. ĐĂNG BÀI -->
          <div class="card" style="border-top: 3px solid #EC4899;">
            <div class="card-title" style="color: #F472B6;">📤 Đăng bài &amp; Chia sẻ thông tin</div>
            <p style="font-size: 13px; color: #CBD5E1; line-height: 1.6;">
              Kiểm chứng nguồn tin trước khi share. Không chia sẻ tin giả, tin kích động bạo lực hay xúc phạm danh dự người khác.
            </p>
          </div>
        </div>

        <div class="card reveal-item" style="background: rgba(13, 124, 134, 0.12); padding: 10px 16px; font-size: 13px;">
          💡 <strong>Vết chân số (Digital Footprint):</strong> Mọi bình luận, bài đăng hay bức ảnh em đưa lên mạng đều để lại dấu vết vĩnh viễn trên máy chủ Internet. Hãy để lại một vết chân số sạch đẹp và đáng tự hào!
        </div>
      </div>
    </section>

    <!-- ══ SLIDE 13: ĐẤU TRƯỜNG TRẮC NGHIỆM 4 CÂU ═════════════════════════════ -->
    <section class="slide" id="slide-13" data-total-reveal="2">
      <div class="slide-header">
        <div>
          <span class="slide-badge coral">Kiểm tra kiến thức</span>
          <div class="slide-title">Đấu trường Trắc nghiệm — Bài 6 Tin học 12</div>
          <div class="slide-subtitle">Nhấp chọn đáp án để nhận phản hồi phân tích chi tiết và tính điểm tức thì</div>
        </div>
        <div class="reveal-ctrl">
          <span>✨</span><span class="reveal-status" id="slide-13-status">0 / 2</span>
          <button class="reveal-btn" onclick="revealNext();">▶ Hiện ý</button>
          <button class="reveal-btn" style="background: rgba(255,255,255,0.15);" onclick="revealAll();">Hiện hết</button>
        </div>
      </div>
      <div class="slide-body">
        <div class="quiz-grid">
          <!-- CÂU 1 -->
          <div class="quiz-card reveal-item">
            <div class="quiz-q">Câu 1: Trường hợp nào sau đây KHÔNG PHẢI là giao tiếp trong không gian mạng?</div>
            <button class="quiz-btn" onclick="checkQ(this, false, 'q1', 'Sai rồi! Chatbot trên web là dịch vụ trực tuyến.')">A. Giao tiếp với trợ lý ảo (chatbot) trên web tuyển sinh</button>
            <button class="quiz-btn" onclick="checkQ(this, false, 'q1', 'Sai rồi! Học online Zoom là giao tiếp mạng máy tính.')">B. Tham gia một lớp học trực tuyến qua Zoom</button>
            <button class="quiz-btn" onclick="checkQ(this, false, 'q1', 'Sai rồi! Gọi FaceTime là dịch vụ video trực tuyến.')">C. Hai người bạn gọi điện thoại video (FaceTime)</button>
            <button class="quiz-btn" onclick="checkQ(this, true, 'q1', 'Chính xác! Hẹn gặp ở quán cà phê là gặp mặt trực tiếp ngoài đời, quán chỉ là địa điểm gặp!')">D. Hẹn gặp bạn trực tiếp tại một quán cà phê Internet</button>
            <div class="quiz-feedback" id="q1-feedback"></div>
          </div>

          <!-- CÂU 2 -->
          <div class="quiz-card reveal-item">
            <div class="quiz-q">Câu 2: Vì sao nhắn tin lại dễ gây hiểu lầm hơn nói chuyện trực tiếp?</div>
            <button class="quiz-btn" onclick="checkQ(this, false, 'q2', 'Sai rồi! Tốc độ mạng ngày nay rất nhanh.')">A. Vì tin nhắn truyền đi chậm hơn giọng nói</button>
            <button class="quiz-btn" onclick="checkQ(this, true, 'q2', 'Chính xác! Nhắn tin thiếu các tín hiệu phi ngôn ngữ như nét mặt, ánh mắt, ngữ điệu giọng nói!')">B. Vì thiếu các tín hiệu phi ngôn ngữ (nét mặt, biểu cảm giọng nói)</button>
            <button class="quiz-btn" onclick="checkQ(this, false, 'q2', 'Sai rồi! Tin nhắn ngày nay gửi dài thoải mái.')">C. Vì tin nhắn bị giới hạn số ký tự mỗi lần gửi</button>
            <button class="quiz-btn" onclick="checkQ(this, false, 'q2', 'Sai rồi! Tin nhắn lưu lại rất lâu trên app.')">D. Vì tin nhắn không lưu lại được để đọc lại</button>
            <div class="quiz-feedback" id="q2-feedback"></div>
          </div>

          <!-- CÂU 3 -->
          <div class="quiz-card reveal-item">
            <div class="quiz-q">Câu 3: Quy tắc ứng xử trên mạng xã hội được ban hành theo văn bản pháp lý nào?</div>
            <button class="quiz-btn" onclick="checkQ(this, false, 'q3', 'Sai rồi! Không đúng số quyết định.')">A. Quyết định số 123/QĐ-BGDĐT năm 2020</button>
            <button class="quiz-btn" onclick="checkQ(this, true, 'q3', 'Chính xác! Quyết định số 874/QĐ-BTTTT ngày 17/6/2021 của Bộ Thông tin và Truyền thông.')">B. Quyết định số 874/QĐ-BTTTT ngày 17/6/2021</button>
            <button class="quiz-btn" onclick="checkQ(this, false, 'q3', 'Sai rồi! Quyết định này ban hành năm 2021.')">C. Quyết định số 874/QĐ-BTTTT ngày 17/6/2024</button>
            <button class="quiz-btn" onclick="checkQ(this, false, 'q3', 'Sai rồi! Cơ quan ban hành là Bộ TTTT.')">D. Nghị định số 72/2013/NĐ-CP của Bộ Công an</button>
            <div class="quiz-feedback" id="q3-feedback"></div>
          </div>

          <!-- CÂU 4 -->
          <div class="quiz-card reveal-item">
            <div class="quiz-q">Câu 4: Bốn yếu tố cốt lõi của Ứng xử nhân văn trong không gian mạng là gì?</div>
            <button class="quiz-btn" onclick="checkQ(this, true, 'q4', 'Chính xác! Tôn trọng – Lịch sự – Thấu hiểu – Hỗ trợ là 4 trụ cột chuẩn SGK trang 36!')">A. Tôn trọng – Lịch sự – Thấu hiểu – Hỗ trợ</button>
            <button class="quiz-btn" onclick="checkQ(this, false, 'q4', 'Sai rồi! Nhanh chóng không phải yếu tố nhân văn.')">B. Nhanh chóng – Tiết kiệm – Bí mật – Hỗ trợ</button>
            <button class="quiz-btn" onclick="checkQ(this, false, 'q4', 'Sai rồi! Thiếu yếu tố thấu hiểu và hỗ trợ.')">C. Tôn trọng – Pháp luật – Kinh tế – Công nghệ</button>
            <button class="quiz-btn" onclick="checkQ(this, false, 'q4', 'Sai rồi! Không liên quan đạo đức số.')">D. Im lặng – Thờ ơ – Đề phòng – Né tránh</button>
            <div class="quiz-feedback" id="q4-feedback"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ SLIDE 14: HỒ SƠ CÔNG DÂN SỐ VĂN MINH & TỔNG KẾT ═════════════════════ -->
    <section class="slide" id="slide-14" data-total-reveal="3">
      <div class="slide-header">
        <div>
          <span class="slide-badge gold">Tự đánh giá bản thân</span>
          <div class="slide-title">🎉 Hồ sơ Công dân số Văn minh — Bản cam kết số</div>
          <div class="slide-subtitle">Bấm để đánh dấu những nguyên tắc em quyết tâm thực hiện trên không gian mạng</div>
        </div>
        <div class="reveal-ctrl">
          <span>✨</span><span class="reveal-status" id="slide-14-status">0 / 3</span>
          <button class="reveal-btn" onclick="revealNext();">▶ Hiện ý</button>
          <button class="reveal-btn" style="background: rgba(255,255,255,0.15);" onclick="revealAll();">Hiện hết</button>
        </div>
      </div>
      <div class="slide-body">
        <div class="grid-2">
          <!-- BẢNG CAM KẾT VĂN HÓA MẠNG -->
          <div class="card reveal-item" style="border-left: 5px solid #EC4899;">
            <div class="card-title" style="color: #F472B6;">
              🌟 Cam kết Công dân số Văn minh của em:
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 8px;">
              <div class="checklist-item" onclick="toggleChecklistItem(this);">
                <span>⬜</span> <span>1. Luôn dùng ngôn từ lịch sự, không chửi bậy, không công kích cá nhân</span>
              </div>
              <div class="checklist-item" onclick="toggleChecklistItem(this);">
                <span>⬜</span> <span>2. Tuyệt đối không phát tán tin nhắn, hình ảnh riêng tư của người khác</span>
              </div>
              <div class="checklist-item" onclick="toggleChecklistItem(this);">
                <span>⬜</span> <span>3. Không like, share các thông tin bịa đặt, tin đồn chưa kiểm chứng</span>
              </div>
              <div class="checklist-item" onclick="toggleChecklistItem(this);">
                <span>⬜</span> <span>4. Biết lắng nghe, tôn trọng quan điểm khác biệt trên tinh thần hòa nhã</span>
              </div>
              <div class="checklist-item" onclick="toggleChecklistItem(this);">
                <span>⬜</span> <span>5. Sẵn sàng động viên, hỗ trợ người khác khi họ gặp khó khăn trên mạng</span>
              </div>
            </div>
          </div>

          <!-- TỔNG KẾT BÀI HỌC -->
          <div class="reveal-item" style="display: flex; flex-direction: column; gap: 10px;">
            <div class="card" style="border-left: 5px solid #38E1F0;">
              <div class="card-title" style="color: #38E1F0;">💡 Lời nhắn nhủ từ bài học:</div>
              <p style="font-size: 13.5px; line-height: 1.6; color: #CBD5E1;">
                Thế giới ảo có thể đem lại cho em sự nổi tiếng, nhưng sự tử tế và nhân văn mới là thứ định nghĩa giá trị đích thực của một con người. Hãy trở thành một nguồn năng lượng tích cực trên Internet!
              </p>
            </div>

            <div class="card" style="text-align: center; padding: 16px;">
              <div style="font-size: 16px; font-weight: 700; color: white; margin-bottom: 10px;">
                Luyện tập trắc nghiệm &amp; Xem SGK điện tử
              </div>
              <div style="display: flex; gap: 10px; justify-content: center;">
                <a href="/luyen/bai-06" style="display: inline-flex; align-items: center; gap: 6px; background: #EC4899; color: white; text-decoration: none; padding: 8px 16px; border-radius: 8px; font-weight: 700; font-size: 13px;">
                  ✍️ Luyện trắc nghiệm Bài 6
                </a>
                <a href="/sgk/bai-06.html" target="_blank" style="display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.08); color: white; text-decoration: none; padding: 8px 16px; border-radius: 8px; font-weight: 700; font-size: 13px; border: 1px solid rgba(255,255,255,0.2);">
                  📖 Đọc SGK Điện tử
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="card reveal-item" style="text-align: center; padding: 12px; background: rgba(236, 72, 153, 0.12); border-color: rgba(244, 114, 182, 0.4);">
          <button class="sim-btn" onclick="fireConfetti();" style="background: linear-gradient(135deg, #EC4899, #38E1F0); color: white; font-weight: 800; padding: 8px 22px; font-size: 14px;">
            🎊 Bắn pháo hoa ăn mừng hoàn thành Bài 6!
          </button>
        </div>
      </div>
    </section>

  </div><!-- .deck-container -->

  <!-- ─── DECK NAV DƯỚI CÙNG ─── -->
  <div class="deck-nav">
    <button class="nav-btn" onclick="prevSlide();" title="Slide trước (←)">‹</button>
    <div class="deck-progress"><div class="deck-progress-bar" id="progressBar"></div></div>
    <div class="deck-counter" id="slideCounter">01 / 14</div>
    <button class="nav-btn" onclick="nextSlide();" title="Slide tiếp (→ / Space)">›</button>
    <button class="nav-btn" onclick="toggleMute();" id="muteBtn" title="Bật/Tắt âm thanh (M)">🔊</button>
    <button class="nav-btn" onclick="toggleFullScreen();" title="Toàn màn hình (F)">⛶</button>
  </div>

  <script>
    let currentSlide = 1;
    const TOTAL = 14;
    let isMuted = false;

    /* ─── WEB AUDIO API ─── */
    const audioCtx = (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined')
      ? new (window.AudioContext || window.webkitAudioContext)() : null;

    function _play(freq, type, dur, volPeak) {
      if (isMuted || !audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      osc.connect(g); g.connect(audioCtx.destination);
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      g.gain.setValueAtTime(volPeak || 0.18, audioCtx.currentTime);
      g.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + dur);
      osc.start(); osc.stop(audioCtx.currentTime + dur);
    }
    function playClick()   { _play(620, 'sine', 0.05, 0.12); }
    function playReveal()  { _play(440, 'triangle', 0.12, 0.18); setTimeout(() => _play(880, 'triangle', 0.1, 0.12), 70); }
    function playSuccess() { _play(523, 'sine', 0.09, 0.18); setTimeout(() => _play(659, 'sine', 0.09, 0.16), 80); setTimeout(() => _play(784, 'sine', 0.22, 0.15), 160); }
    function playWrong()   { _play(210, 'sawtooth', 0.18, 0.18); }
    function playChat()    { _play(700, 'sine', 0.08, 0.15); setTimeout(() => _play(1050, 'sine', 0.12, 0.12), 60); }
    function toggleMute()  { isMuted = !isMuted; document.getElementById('muteBtn').innerText = isMuted ? '🔇' : '🔊'; }

    /* ─── REVEAL ENGINE ─── */
    function getActiveSlide() { return document.getElementById('slide-' + currentSlide); }

    function updateRevealStatus() {
      const s = getActiveSlide(); if (!s) return;
      const total = s.querySelectorAll('.reveal-item').length;
      const visible = s.querySelectorAll('.reveal-item.visible').length;
      const el = document.getElementById('slide-' + currentSlide + '-status');
      if (el) el.innerText = visible + ' / ' + total;
    }

    function revealNext() {
      const s = getActiveSlide(); if (!s) return false;
      const hidden = [...s.querySelectorAll('.reveal-item:not(.visible)')];
      if (hidden.length) {
        hidden[0].classList.add('visible', 'just-revealed');
        playReveal();
        setTimeout(() => hidden[0].classList.remove('just-revealed'), 700);
        updateRevealStatus(); return true;
      }
      return false;
    }

    function revealAll() {
      const s = getActiveSlide(); if (!s) return;
      s.querySelectorAll('.reveal-item').forEach(i => i.classList.add('visible'));
      playClick(); updateRevealStatus();
    }

    function autoStagger(slide) {
      const items = slide.querySelectorAll('.reveal-item');
      items.forEach((item, i) => {
        setTimeout(() => { item.classList.add('visible'); updateRevealStatus(); }, (i + 1) * 150);
      });
    }

    /* ─── NAVIGATION ─── */
    function updateSlide() {
      document.querySelectorAll('.slide').forEach((s, i) => {
        const idx = i + 1;
        s.classList.remove('active', 'prev');
        if (idx === currentSlide) {
          s.classList.add('active');
          s.querySelectorAll('.reveal-item').forEach(el => el.classList.remove('visible'));
          autoStagger(s);
        } else if (idx < currentSlide) s.classList.add('prev');
      });
      const pct = (currentSlide / TOTAL) * 100;
      document.getElementById('progressBar').style.width = pct + '%';
      document.getElementById('slideCounter').innerText =
        String(currentSlide).padStart(2, '0') + ' / ' + String(TOTAL).padStart(2, '0');
      if (currentSlide === 14) setTimeout(fireConfetti, 400);
    }

    function nextSlide() { if (currentSlide < TOTAL) { currentSlide++; playClick(); updateSlide(); } }
    function prevSlide() { if (currentSlide > 1) { currentSlide--; playClick(); updateSlide(); } }

    function toggleFullScreen() {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
      else document.exitFullscreen().catch(() => {});
    }

    window.addEventListener('keydown', e => {
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); nextSlide(); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp')            { e.preventDefault(); prevSlide(); }
      else if (e.key === 'ArrowDown')                               { e.preventDefault(); revealNext(); }
      else if (e.key === 'f' || e.key === 'F')                         { e.preventDefault(); toggleFullScreen(); }
      else if (e.key === 'm' || e.key === 'M')                         { e.preventDefault(); toggleMute(); }
      else if (e.key === 'Home')  { currentSlide = 1; updateSlide(); }
      else if (e.key === 'End')   { currentSlide = TOTAL; updateSlide(); }
    });

    /* ─── BÀN CÂN TƯƠNG TÁC (SLIDE 5) ─── */
    function tiltScale(mode) {
      playClick();
      const beam = document.getElementById('scale-beam-group');
      const plateL = document.getElementById('plate-left');
      const plateR = document.getElementById('plate-right');
      const st = document.getElementById('scale-status-text');

      document.querySelectorAll('#slide-5 .sim-btn').forEach(b => b.classList.remove('active'));

      if (mode === 'balance') {
        beam.style.transform = 'rotate(0deg)';
        plateL.style.transform = 'translateY(0px)';
        plateR.style.transform = 'translateY(0px)';
        st.innerText = '⚖️ Trạng thái: Cân bằng — Hiểu rõ cả hai mặt để làm chủ không gian mạng!';
        st.style.color = '#38E1F0';
      } else if (mode === 'left') {
        beam.style.transform = 'rotate(-12deg)';
        plateL.style.transform = 'translateY(25px)';
        plateR.style.transform = 'translateY(-25px)';
        st.innerText = '💚 Ưu điểm vượt trội: Tiện lợi, tiết kiệm, mở rộng quan hệ nếu biết sử dụng thông minh!';
        st.style.color = '#34D399';
      } else if (mode === 'right') {
        beam.style.transform = 'rotate(12deg)';
        plateL.style.transform = 'translateY(-25px)';
        plateR.style.transform = 'translateY(25px)';
        st.innerText = '⚠️ Cảnh báo rủi ro: Thiếu biểu cảm, lộ lọt riêng tư, nghiện mạng nếu lơ là cảnh giác!';
        st.style.color = '#F87171';
      }
    }

    /* ─── CHATBOX TÌNH HUỐNG (SLIDE 9 & 10) ─── */
    function chooseChatResponse(simId, choice) {
      const box = document.getElementById('chat-box-' + simId);
      const fb = document.getElementById('chat-feedback-' + simId);

      if (simId === 1) {
        if (choice === 'A') {
          playWrong();
          fb.innerHTML = '❌ <strong>Hành vi thiếu văn hóa:</strong> Dùng từ ngữ thô tục, xúc phạm bạn bè sẽ làm bùng nổ xung đột lớn trong lớp, vi phạm quy tắc ứng xử trên mạng!';
          fb.style.color = '#F87171';
          fb.style.background = 'rgba(239, 68, 68, 0.15)';
        } else if (choice === 'B') {
          playWrong();
          fb.innerHTML = '❌ <strong>Bạo lực mạng (Cyberbullying):</strong> Chụp ảnh màn hình để cô lập, bêu riếu bạn là hành vi xâm phạm danh dự, gây tổn thương tâm lý nghiêm trọng cho bạn!';
          fb.style.color = '#F87171';
          fb.style.background = 'rgba(239, 68, 68, 0.15)';
        } else if (choice === 'C') {
          playSuccess();
          playChat();
          box.innerHTML += '<div class="chat-bubble me"><strong>Em:</strong> "Mình hiểu Nam đang nản vì bài khó. Nhưng lập trình rèn tư duy logic hay lắm, chiều nay chúng mình cùng làm nhé!"</div>';
          box.innerHTML += '<div class="chat-bubble them"><strong>Bạn Nam:</strong> "Cảm ơn bạn nhiều nhé, may quá có bạn động viên! 😊"</div>';
          fb.innerHTML = '🎉 <strong>Tuyệt vời!</strong> Em đã thể hiện trọn vẹn cả 4 yếu tố: Tôn trọng ý kiến bạn, Lịch sự trong từ ngữ, Thấu hiểu sự khó khăn và Sẵn sàng hỗ trợ!';
          fb.style.color = '#34D399';
          fb.style.background = 'rgba(16, 185, 129, 0.15)';
        }
      } else if (simId === 2) {
        if (choice === 'A') {
          playWrong();
          fb.innerHTML = '❌ <strong>Vi phạm pháp luật:</strong> Lan truyền thông tin đời tư, bôi nhọ danh dự người khác có thể bị xử phạt hành chính hoặc truy cứu trách nhiệm hình sự theo Luật An ninh mạng!';
          fb.style.color = '#F87171';
          fb.style.background = 'rgba(239, 68, 68, 0.15)';
        } else if (choice === 'B') {
          playWrong();
          fb.innerHTML = '⚠️ <strong>Chưa đủ:</strong> Im lặng xem một mình là dung túng cho cái xấu và chưa thể hiện tinh thần trách nhiệm bảo vệ bạn bè trong tập thể.';
          fb.style.color = '#FFC043';
          fb.style.background = 'rgba(245, 166, 35, 0.15)';
        } else if (choice === 'C') {
          playSuccess();
          playChat();
          box.innerHTML += '<div class="chat-bubble me"><strong>Em:</strong> "Tôi không xem! Việc phát tán đời tư là vi phạm pháp luật và đạo đức, xin hãy dừng ngay hành vi này lại!"</div>';
          fb.innerHTML = '🎉 <strong>Bản lĩnh công dân số!</strong> Em đã dũng cảm bảo vệ quyền riêng tư của bạn bè, ngăn chặn cái xấu và tuân thủ đúng Quyết định 874/QĐ-BTTTT!';
          fb.style.color = '#34D399';
          fb.style.background = 'rgba(16, 185, 129, 0.15)';
        }
      }
    }

    function resetChatSim(simId) {
      playClick();
      const box = document.getElementById('chat-box-' + simId);
      const fb = document.getElementById('chat-feedback-' + simId);
      fb.innerHTML = '';
      if (simId === 1) {
        box.innerHTML = '<div class="chat-bubble them"><strong>Bạn Nam:</strong> "Mình thấy bài tập lập trình này vô ích quá, tốn thời gian, học làm gì chẳng bao giờ dùng đến!"</div>';
      } else if (simId === 2) {
        box.innerHTML = '<div class="chat-bubble them"><strong>Người lạ:</strong> "Này, mình có ảnh chụp tin nhắn riêng và ảnh dìm hàng của bạn Hoa trong lớp bạn nè. Có muốn xem không để gửi cho nhóm bóc phốt?"</div>';
      }
    }

    /* ─── QUIZ ENGINE (SLIDE 13) ─── */
    function checkQ(btn, ok, qId, explain) {
      const parent = btn.closest('.quiz-card');
      parent.querySelectorAll('.quiz-btn').forEach(b => { b.disabled = true; b.style.pointerEvents = 'none'; });
      btn.classList.add(ok ? 'correct' : 'wrong');
      ok ? playSuccess() : playWrong();
      const fb = document.getElementById(qId + '-feedback');
      fb.style.display = 'block';
      fb.style.background = ok ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';
      fb.style.border = '1px solid ' + (ok ? '#10B981' : '#EF4444');
      fb.style.color  = ok ? '#34D399' : '#FCA5A5';
      fb.innerHTML = (ok ? '🎉 <strong>Chính xác!</strong> ' : '❌ <strong>Chưa đúng!</strong> ') + explain;
    }

    /* ─── CHECKLIST (SLIDE 14) ─── */
    function toggleChecklistItem(item) {
      playClick();
      item.classList.toggle('done');
      const box = item.querySelector('span:first-child');
      box.innerText = item.classList.contains('done') ? '✅' : '⬜';
    }

    /* ─── CONFETTI CANVAS ─── */
    function fireConfetti() {
      playSuccess();
      const cvs = document.getElementById('confettiCanvas');
      const ctx = cvs.getContext('2d');
      cvs.width = window.innerWidth; cvs.height = window.innerHeight;
      const colors = ['#EC4899', '#38E1F0', '#F2683C', '#F5A623', '#10B981', '#FFFFFF'];
      const parts = Array.from({ length: 110 }, () => ({
        x: window.innerWidth / 2, y: window.innerHeight * 0.42,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.65) * 18,
        sz: Math.random() * 9 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1, rot: Math.random() * 360, vrot: (Math.random() - 0.5) * 14
      }));
      function render() {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        let alive = false;
        parts.forEach(p => {
          p.x += p.vx; p.y += p.vy; p.vy += 0.38; p.alpha -= 0.013; p.rot += p.vrot;
          if (p.alpha > 0) {
            alive = true; ctx.save(); ctx.globalAlpha = p.alpha;
            ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI / 180);
            ctx.fillStyle = p.color; ctx.fillRect(-p.sz / 2, -p.sz / 2, p.sz, p.sz);
            ctx.restore();
          }
        });
        if (alive) requestAnimationFrame(render);
        else ctx.clearRect(0, 0, cvs.width, cvs.height);
      }
      render();
    }

    /* KHỞI ĐỘNG */
    updateSlide();
  </script>
</body>
</html>
`;

// Ghi ra 2 nơi: public/bai-06-trinh-chieu.html và bai-06-trinh-chieu.html
const publicPath = path.resolve('public', 'bai-06-trinh-chieu.html');
const rootPath = path.resolve('bai-06-trinh-chieu.html');

fs.writeFileSync(publicPath, htmlContent, 'utf-8');
fs.writeFileSync(rootPath, htmlContent, 'utf-8');

console.log('✅ Successfully generated Bai 06 Slide Deck (v2 — Enhanced):');
console.log(' - ' + publicPath);
console.log(' - ' + rootPath);

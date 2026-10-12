import fs from 'node:fs';
import path from 'node:path';

const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bài 6: Giao tiếp và ứng xử trong không gian mạng — Bài giảng điện tử Tin học 12</title>
  <style>
    /* ─── RESET & HỆ THỐNG BIẾN MÀU SẮC CHUẨN 2026 ─── */
    :root {
      --bg: #090F15;
      --bg-card: rgba(15, 26, 36, 0.92);
      --border-card: rgba(201, 221, 224, 0.16);
      --ink: #FFFFFF;
      --ink-soft: #A2B7C7;
      --sea: #0D7C86;
      --sea-light: #16A8B6;
      --sea-glow: rgba(13, 124, 134, 0.45);
      --coral: #F2683C;
      --coral-light: #FF855D;
      --gold: #F5A623;
      --gold-light: #FFC043;
      --leaf: #10B981;
      --leaf-light: #34D399;
      --berry: #EC4899;
      --purple: #8B5CF6;
      --radius-lg: 24px;
      --radius-md: 16px;
      --font-main: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      --font-mono: 'Consolas', 'Fira Code', 'Courier New', monospace;
      --transition-slide: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: var(--font-main);
      background-color: var(--bg);
      color: var(--ink);
      overflow: hidden;
      width: 100vw;
      height: 100vh;
      user-select: none;
      -webkit-font-smoothing: antialiased;
    }

    /* ─── NỀN GRADIENT HIỆU ỨNG KHÔNG GIAN SỐ ─── */
    .bg-mesh {
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background: radial-gradient(circle at 15% 15%, rgba(13, 124, 134, 0.30) 0%, transparent 45%),
                  radial-gradient(circle at 85% 85%, rgba(236, 72, 153, 0.22) 0%, transparent 42%),
                  radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 60%);
      z-index: 0;
      pointer-events: none;
    }

    /* ─── CONTAINER TRÌNH CHIẾU ─── */
    .deck-container {
      position: relative;
      width: 100vw;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1;
    }

    /* ─── MỖI SLIDE ─── */
    .slide {
      position: absolute;
      width: 94vw;
      max-width: 1320px;
      height: 88vh;
      max-height: 840px;
      background: var(--bg-card);
      border: 1px solid var(--border-card);
      border-radius: var(--radius-lg);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      box-shadow: 0 30px 70px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.12);
      padding: 36px 48px;
      display: flex;
      flex-direction: column;
      opacity: 0;
      pointer-events: none;
      transform: translateX(60px) scale(0.97);
      transition: var(--transition-slide);
      overflow-y: auto;
    }

    .slide::-webkit-scrollbar { width: 6px; }
    .slide::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }

    .slide.active {
      opacity: 1;
      pointer-events: auto;
      transform: translateX(0) scale(1);
      z-index: 2;
    }

    .slide.prev {
      opacity: 0;
      pointer-events: none;
      transform: translateX(-60px) scale(0.97);
    }

    /* ─── ĐẦU TRANG SLIDE ─── */
    .slide-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 14px;
      flex-shrink: 0;
    }

    .slide-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      background: rgba(13, 124, 134, 0.25);
      color: #38E1F0;
      border: 1px solid rgba(56, 225, 240, 0.3);
      margin-bottom: 6px;
    }
    .slide-badge.coral { background: rgba(242, 104, 60, 0.25); color: #FF855D; border-color: rgba(255, 133, 93, 0.35); }
    .slide-badge.gold { background: rgba(245, 166, 35, 0.25); color: #FFC043; border-color: rgba(255, 192, 67, 0.35); }
    .slide-badge.leaf { background: rgba(16, 185, 129, 0.25); color: #34D399; border-color: rgba(52, 211, 153, 0.35); }
    .slide-badge.berry { background: rgba(236, 72, 153, 0.25); color: #F472B6; border-color: rgba(244, 114, 182, 0.35); }

    .slide-title {
      font-size: 30px;
      font-weight: 800;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #FFFFFF 30%, #C9DDE0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1.25;
    }

    .slide-subtitle {
      font-size: 15px;
      color: var(--ink-soft);
      margin-top: 3px;
    }

    .slide-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 18px;
      position: relative;
    }

    /* ─── GRID LAYOUT ─── */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      align-items: stretch;
      width: 100%;
    }
    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
      width: 100%;
    }
    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      width: 100%;
    }

    /* ─── CARD NỘI DUNG ─── */
    .card {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.09);
      border-radius: var(--radius-md);
      padding: 20px 24px;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .card:hover {
      background: rgba(255, 255, 255, 0.07);
      border-color: rgba(56, 225, 240, 0.4);
      transform: translateY(-3px);
    }

    .card-title {
      font-size: 19px;
      font-weight: 700;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .card p, .card li {
      color: var(--ink-soft);
      font-size: 15px;
      line-height: 1.6;
    }

    .highlight { color: #38E1F0; font-weight: 700; }
    .coral-text { color: var(--coral-light); font-weight: 700; }
    .gold-text { color: var(--gold); font-weight: 700; }
    .leaf-text { color: var(--leaf); font-weight: 700; }
    .berry-text { color: var(--berry); font-weight: 700; }

    /* ─── CÁC BƯỚC / MỤC DANH SÁCH ─── */
    .step-badge {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0D7C86, #16A8B6);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 15px;
      box-shadow: 0 4px 12px rgba(13, 124, 134, 0.4);
      flex-shrink: 0;
    }

    .step-item {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      padding: 14px 16px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: var(--radius-md);
      transition: all 0.2s;
    }
    .step-item:hover {
      background: rgba(255, 255, 255, 0.07);
      border-color: rgba(56, 225, 240, 0.3);
    }

    /* ─── HỘP MÔ PHỎNG SO SÁNH TRỰC QUAN ─── */
    .compare-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      width: 100%;
    }
    .compare-col {
      background: rgba(255, 255, 255, 0.03);
      border-radius: var(--radius-md);
      padding: 18px 22px;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .compare-col.leaf-border {
      border: 2px solid rgba(16, 185, 129, 0.6);
      background: rgba(16, 185, 129, 0.06);
    }
    .compare-col.coral-border {
      border: 2px solid rgba(242, 104, 60, 0.6);
      background: rgba(242, 104, 60, 0.06);
    }

    /* ─── TÌNH HUỐNG TƯƠNG TÁC (SIMULATOR) ─── */
    .dilemma-card {
      background: #0F1A24;
      border: 2px solid #0D7C86;
      border-radius: var(--radius-md);
      padding: 22px;
      margin-bottom: 12px;
    }
    .dilemma-btn {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      padding: 10px 16px;
      color: #E2E8F0;
      font-size: 14px;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s;
      width: 100%;
      margin-bottom: 8px;
    }
    .dilemma-btn:hover {
      background: rgba(13, 124, 134, 0.3);
      border-color: #38E1F0;
      transform: translateX(4px);
    }
    .dilemma-btn.chosen-good {
      background: rgba(16, 185, 129, 0.25) !important;
      border-color: #10B981 !important;
      color: #34D399 !important;
      font-weight: 700;
    }
    .dilemma-btn.chosen-bad {
      background: rgba(242, 104, 60, 0.25) !important;
      border-color: #F2683C !important;
      color: #FF855D !important;
    }

    /* ─── QUIZ CARDS ─── */
    .quiz-options {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .quiz-btn {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: var(--radius-md);
      padding: 14px 18px;
      font-size: 15px;
      color: #E2E8F0;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s;
    }
    .quiz-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(56, 225, 240, 0.4);
      transform: translateY(-2px);
    }
    .quiz-btn.correct {
      background: rgba(16, 185, 129, 0.25) !important;
      border-color: #10B981 !important;
      color: #34D399 !important;
      font-weight: 700;
    }
    .quiz-btn.wrong {
      background: rgba(242, 104, 60, 0.25) !important;
      border-color: #F2683C !important;
      color: #FF855D !important;
    }
    .quiz-feedback {
      padding: 12px 18px;
      border-radius: var(--radius-md);
      font-size: 14.5px;
      display: none;
      animation: fadeIn 0.3s ease;
      line-height: 1.5;
    }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }

    /* ─── CHECKLIST THỰC HÀNH ─── */
    .checklist-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 11px 16px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 14.5px;
    }
    .checklist-item:hover {
      background: rgba(255, 255, 255, 0.08);
    }
    .checklist-item.done {
      background: rgba(16, 185, 129, 0.15);
      border-color: #10B981;
      text-decoration: line-through;
      color: #6EE7B7;
    }

    /* ─── DECK CONTROLS ─── */
    .deck-nav {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 16px;
      background: rgba(9, 15, 21, 0.88);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 40px;
      padding: 8px 24px;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      z-index: 100;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }
    .nav-btn {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.2s;
    }
    .nav-btn:hover {
      background: #0D7C86;
      border-color: #38E1F0;
      transform: scale(1.1);
    }
    .deck-progress {
      width: 160px;
      height: 6px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 3px;
      overflow: hidden;
    }
    .deck-progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #0D7C86, #38E1F0);
      width: 6.25%;
      transition: width 0.3s ease;
    }
    .deck-counter {
      font-family: var(--font-mono);
      font-size: 13px;
      color: var(--ink-soft);
      min-width: 60px;
      text-align: center;
    }

    #confettiCanvas {
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      pointer-events: none;
      z-index: 999;
    }
  </style>
</head>
<body>

  <div class="bg-mesh"></div>
  <canvas id="confettiCanvas"></canvas>

  <div class="deck-container">

    <!-- ════════════════════════════════════════════════════════════════════════
         SLIDE 1: TRANG BÌA BÀI HỌC
         ════════════════════════════════════════════════════════════════════════ -->
    <section class="slide active" id="slide-1">
      <div class="slide-header">
        <div>
          <span class="slide-badge">Tin học 12 · Sách Kết nối tri thức</span>
          <div class="slide-title">BÀI 6: GIAO TIẾP VÀ ỨNG XỬ TRONG KHÔNG GIAN MẠNG</div>
          <div class="slide-subtitle">Chủ đề B: Mạng máy tính và Internet · Trang 34–38 SGK</div>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 40px;">🌐 💬 🤝</span>
        </div>
      </div>
      <div class="slide-body">
        <div class="grid-2">
          <div class="card" style="border-left: 4px solid #38E1F0;">
            <div class="card-title">🎯 Mục tiêu & Giá trị cốt lõi</div>
            <ul style="margin-left: 20px; display: flex; flex-direction: column; gap: 10px;">
              <li>Hiểu rõ khái niệm <strong class="highlight">Không gian mạng</strong> (thế giới ảo) và các kênh giao tiếp phổ biến.</li>
              <li>Phân tích sâu sắc <strong class="leaf-text">4 Ưu điểm</strong> và <strong class="coral-text">4 Nhược điểm</strong> của giao tiếp trực tuyến.</li>
              <li>Nắm vững <strong class="gold-text">4 Trụ cột ứng xử nhân văn</strong>: <em>Tôn trọng — Lịch sự — Thấu hiểu — Hỗ trợ</em>.</li>
              <li>Nắm rõ khung pháp lý: <strong class="highlight">Quyết định số 874/QĐ-BTTTT</strong> ngày 17/6/2021.</li>
              <li>Rèn luyện thói quen vàng: <em>"Đối xử với người khác theo cách mình muốn được đối xử"</em>.</li>
            </ul>
          </div>

          <div class="card" style="background: rgba(13, 124, 134, 0.12); border-color: rgba(56, 225, 240, 0.3);">
            <div class="card-title">⚡ Thông điệp gửi học sinh lớp 12</div>
            <p style="margin-bottom: 12px; font-size: 15.5px;">
              "Mỗi ngày các em đều lướt mạng, nhắn tin, thả tim, bình luận. Không gian mạng tuy là <em>thế giới ảo</em>, nhưng cảm xúc bị tổn thương và hậu quả pháp lý là <strong>hoàn toàn có thật</strong>."
            </p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13.5px;">
              <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px;">
                ⚖️ <strong>Cân nhắc cái được & mất:</strong> Hiểu rõ tại sao nhắn tin lại dễ gây hiểu lầm.
              </div>
              <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px;">
                💡 <strong>Ứng xử nhân văn:</strong> Giữ văn hóa, bảo vệ danh dự & sự riêng tư của nhau.
              </div>
            </div>
            <div style="margin-top: 14px; font-size: 13px; color: #A2B7C7;">
              ⌨️ <em>Nhấn <strong>Phím mũi tên phải (→)</strong> hoặc <strong>Phím Space</strong> để tiếp tục bài giảng!</em>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════════════════════
         SLIDE 2: KHÔNG GIAN MẠNG LÀ GÌ?
         ════════════════════════════════════════════════════════════════════════ -->
    <section class="slide" id="slide-2">
      <div class="slide-header">
        <div>
          <span class="slide-badge">Phần 1: Khái niệm mở đầu</span>
          <div class="slide-title">Không gian mạng (Cyberspace) là gì?</div>
          <div class="slide-subtitle">Môi trường giao tiếp được tạo ra nhờ sự kết nối của mạng máy tính toàn cầu</div>
        </div>
        <span style="font-size: 32px;">🌐</span>
      </div>
      <div class="slide-body">
        <div class="grid-2">
          <div>
            <div class="card" style="margin-bottom: 16px; border-left: 4px solid #38E1F0;">
              <div class="card-title">📖 Khái niệm chuẩn SGK</div>
              <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">
                <strong class="highlight">Không gian mạng</strong> (còn được gọi là <strong>thế giới ảo</strong>) là môi trường được tạo ra nhờ sử dụng mạng máy tính.
              </p>
              <div style="background: rgba(13, 124, 134, 0.2); padding: 12px; border-radius: 8px; font-size: 14.5px; border: 1px solid rgba(56, 225, 240, 0.3);">
                ⭐ <strong>Internet</strong> có thể được coi là <strong>không gian mạng lớn nhất thế giới</strong> hiện nay.
              </div>
            </div>

            <div class="card">
              <div class="card-title">❓ Đố vui phân biệt (Bẫy đề thi)</div>
              <p style="font-size: 14px; margin-bottom: 8px;">Trường hợp nào sau đây <strong>KHÔNG</strong> phải là giao tiếp trong không gian mạng?</p>
              <div style="display: flex; flex-direction: column; gap: 6px; font-size: 13.5px;">
                <div style="padding: 6px 10px; background: rgba(255,255,255,0.05); border-radius: 6px;">❌ A. Gọi điện thoại video (FaceTime/Zalo) qua Internet</div>
                <div style="padding: 6px 10px; background: rgba(255,255,255,0.05); border-radius: 6px;">❌ B. Trò chuyện với trợ lý ảo Chatbot trường đại học</div>
                <div style="padding: 6px 10px; background: rgba(16, 185, 129, 0.2); border: 1px solid #10B981; border-radius: 6px; font-weight: 700; color: #34D399;">
                  ✅ C. Hẹn gặp bạn tại một quán cà phê Internet
                </div>
              </div>
              <div style="font-size: 12px; color: #F5A623; margin-top: 8px;">
                💡 <em>Giải thích: Hẹn nhau ở quán cà phê là <strong>gặp mặt trực tiếp ngoài đời</strong>, quán chỉ là địa điểm!</em>
              </div>
            </div>
          </div>

          <!-- Hình vẽ đồ họa SVG: Không gian mạng bao phủ -->
          <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.12); border-radius: var(--radius-md); padding: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <svg viewBox="0 0 480 320" style="width: 100%; max-width: 440px;">
              <!-- Quả cầu Internet -->
              <circle cx="240" cy="160" r="100" fill="none" stroke="#0D7C86" stroke-width="2" stroke-dasharray="4 4" opacity="0.6"/>
              <circle cx="240" cy="160" r="65" fill="rgba(13, 124, 134, 0.15)" stroke="#38E1F0" stroke-width="2.5"/>
              <text x="240" y="155" font-size="32" text-anchor="middle">🌐</text>
              <text x="240" y="180" font-size="13" font-weight="800" fill="#38E1F0" text-anchor="middle">INTERNET</text>
              <text x="240" y="195" font-size="10.5" fill="#A2B7C7" text-anchor="middle">Không gian mạng lớn nhất</text>

              <!-- Các vệ tinh dịch vụ kết nối xung quanh -->
              <!-- Vệ tinh 1: Mạng xã hội -->
              <g transform="translate(90, 70)">
                <rect x="-45" y="-22" width="90" height="44" rx="10" fill="#1E293B" stroke="#8B5CF6" stroke-width="1.5"/>
                <text x="0" y="-2" font-size="16" text-anchor="middle">👥</text>
                <text x="0" y="14" font-size="10" font-weight="700" fill="#C4B5FD" text-anchor="middle">Mạng xã hội</text>
                <path d="M45 0 L 85 45" stroke="#8B5CF6" stroke-width="1.5" stroke-dasharray="2 2"/>
              </g>

              <!-- Vệ tinh 2: Email -->
              <g transform="translate(390, 70)">
                <rect x="-45" y="-22" width="90" height="44" rx="10" fill="#1E293B" stroke="#F5A623" stroke-width="1.5"/>
                <text x="0" y="-2" font-size="16" text-anchor="middle">✉️</text>
                <text x="0" y="14" font-size="10" font-weight="700" fill="#FDE047" text-anchor="middle">Thư điện tử</text>
                <path d="M-45 0 L -85 45" stroke="#F5A623" stroke-width="1.5" stroke-dasharray="2 2"/>
              </g>

              <!-- Vệ tinh 3: Video Call -->
              <g transform="translate(90, 250)">
                <rect x="-45" y="-22" width="90" height="44" rx="10" fill="#1E293B" stroke="#10B981" stroke-width="1.5"/>
                <text x="0" y="-2" font-size="16" text-anchor="middle">📹</text>
                <text x="0" y="14" font-size="10" font-weight="700" fill="#6EE7B7" text-anchor="middle">Video Call</text>
                <path d="M45 0 L 85 -45" stroke="#10B981" stroke-width="1.5" stroke-dasharray="2 2"/>
              </g>

              <!-- Vệ tinh 4: Diễn đàn & Chat -->
              <g transform="translate(390, 250)">
                <rect x="-45" y="-22" width="90" height="44" rx="10" fill="#1E293B" stroke="#EC4899" stroke-width="1.5"/>
                <text x="0" y="-2" font-size="16" text-anchor="middle">💬</text>
                <text x="0" y="14" font-size="10" font-weight="700" fill="#F472B6" text-anchor="middle">Diễn đàn / Chat</text>
                <path d="M-45 0 L -85 -45" stroke="#EC4899" stroke-width="1.5" stroke-dasharray="2 2"/>
              </g>
            </svg>
            <div style="font-size: 12.5px; color: #A2B7C7; text-align: center; margin-top: 8px;">
              Sơ đồ: Các dịch vụ trực tuyến kết nối con người trong Không gian mạng
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════════════════════
         SLIDE 3: CÁC DỊCH VỤ GIAO TIẾP TRỰC TUYẾN
         ════════════════════════════════════════════════════════════════════════ -->
    <section class="slide" id="slide-3">
      <div class="slide-header">
        <div>
          <span class="slide-badge">Công cụ giao tiếp</span>
          <div class="slide-title">Các kênh giao tiếp phổ biến trong Không gian mạng</div>
          <div class="slide-subtitle">Sự đa dạng cho phép con người lựa chọn phương thức trao đổi phù hợp nhất</div>
        </div>
        <span style="font-size: 32px;">📱</span>
      </div>
      <div class="slide-body">
        <div class="grid-3" style="gap: 16px;">
          <div class="card" style="border-top: 4px solid #38BDF8;">
            <div class="card-title">
              <span style="font-size: 24px;">🌐</span> Mạng xã hội (Social Media)
            </div>
            <p>Facebook, TikTok, Instagram, Zalo... Chia sẻ trạng thái, hình ảnh, video, kết nối bạn bè và xây dựng thương hiệu cá nhân.</p>
          </div>

          <div class="card" style="border-top: 4px solid #F5A623;">
            <div class="card-title">
              <span style="font-size: 24px;">✉️</span> Thư điện tử (Email)
            </div>
            <p>Gmail, Outlook... Dùng trong công việc chính thức, gửi văn bản, hồ sơ tuyển sinh, trao đổi học tập có tính lưu trữ lâu dài.</p>
          </div>

          <div class="card" style="border-top: 4px solid #10B981;">
            <div class="card-title">
              <span style="font-size: 24px;">💬</span> Ứng dụng nhắn tin nhanh
            </div>
            <p>Messenger, Zalo, Telegram, WhatsApp... Trao đổi tức thì, gọi điện thoại thoại và gửi tài liệu dung lượng nhỏ nhanh chóng.</p>
          </div>

          <div class="card" style="border-top: 4px solid #8B5CF6;">
            <div class="card-title">
              <span style="font-size: 24px;">📹</span> Hội nghị truyền hình
            </div>
            <p>Zoom, Google Meet, Microsoft Teams... Họp trực tuyến, học từ xa, làm việc cộng tác đa quốc gia mà không cần di chuyển.</p>
          </div>

          <div class="card" style="border-top: 4px solid #EC4899;">
            <div class="card-title">
              <span style="font-size: 24px;">🗣️</span> Diễn đàn & Blog cá nhân
            </div>
            <p>Voz, Reddit, Spiderum, WordPress... Thảo luận chuyên sâu theo từng chủ đề học thuật, công nghệ, sở thích và lối sống.</p>
          </div>

          <div class="card" style="border-top: 4px solid #F2683C;">
            <div class="card-title">
              <span style="font-size: 24px;">🛒</span> Trang thương mại điện tử
            </div>
            <p>Shopee, Lazada, Tiki... Trao đổi, hỏi đáp giữa người mua và người bán, đánh giá chất lượng sản phẩm trực tuyến.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════════════════════
         SLIDE 4: 4 ƯU ĐIỂM CỦA GIAO TIẾP QUA MẠNG
         ════════════════════════════════════════════════════════════════════════ -->
    <section class="slide" id="slide-4">
      <div class="slide-header">
        <div>
          <span class="slide-badge leaf">Mặt tích cực (Được)</span>
          <div class="slide-title">4 Ưu điểm Nổi bật của Giao tiếp qua mạng</div>
          <div class="slide-subtitle">Công cụ hỗ trợ đắc lực cho đời sống, giáo dục, công việc và nghiên cứu khoa học</div>
        </div>
        <span style="font-size: 32px;">👍</span>
      </div>
      <div class="slide-body">
        <div class="grid-2">
          <!-- Ưu điểm 1 -->
          <div class="card" style="border-left: 5px solid #10B981;">
            <div class="card-title" style="color: #34D399;">
              <span>📍</span> 1. Thuận tiện — Mọi lúc, mọi nơi
            </div>
            <p style="font-size: 14.5px;">
              Chỉ cần có mạng Internet là có thể trò chuyện, trao đổi công việc bất kể vị trí địa lý. Rất hữu ích cho người thân, bạn bè sống cách xa nhau nửa vòng trái đất.
            </p>
          </div>

          <!-- Ưu điểm 2 -->
          <div class="card" style="border-left: 5px solid #10B981;">
            <div class="card-title" style="color: #34D399;">
              <span>💰</span> 2. Tiết kiệm thời gian và chi phí
            </div>
            <p style="font-size: 14.5px;">
              Không mất thời gian đi lại, giảm chi phí xăng xe, vé máy bay hay khách sạn. Các cuộc họp hội nghị truyền hình giúp tiết kiệm hàng triệu đồng cho cơ quan, doanh nghiệp.
            </p>
          </div>

          <!-- Ưu điểm 3 -->
          <div class="card" style="border-left: 5px solid #10B981;">
            <div class="card-title" style="color: #34D399;">
              <span>🤝</span> 3. Mở rộng kết nối xã hội
            </div>
            <p style="font-size: 14.5px;">
              Dễ dàng tìm kiếm những người có cùng đam mê, chuyên môn, ước mơ. Là công cụ tuyệt vời để xây dựng thương hiệu cá nhân và mở rộng cơ hội nghề nghiệp tương lai.
            </p>
          </div>

          <!-- Ưu điểm 4 -->
          <div class="card" style="border-left: 5px solid #10B981;">
            <div class="card-title" style="color: #34D399;">
              <span>🧰</span> 4. Công cụ giao tiếp đa dạng
            </div>
            <p style="font-size: 14.5px;">
              Từ tin nhắn văn bản, ghi âm giọng nói, chia sẻ màn hình, gửi file đính kèm đến họp video... Người dùng linh hoạt chọn phương tiện phù hợp nhất với hoàn cảnh.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════════════════════
         SLIDE 5: 4 NHƯỢC ĐIỂM & RỦI RO TIỀM ẨN
         ════════════════════════════════════════════════════════════════════════ -->
    <section class="slide" id="slide-5">
      <div class="slide-header">
        <div>
          <span class="slide-badge coral">Mặt tiêu cực (Mất)</span>
          <div class="slide-title">4 Nhược điểm & Rủi ro khi giao tiếp qua mạng</div>
          <div class="slide-subtitle">Những hệ quả khôn lường đòi hỏi người dùng phải luôn tỉnh táo và cẩn trọng</div>
        </div>
        <span style="font-size: 32px;">👎</span>
      </div>
      <div class="slide-body">
        <div class="grid-2">
          <!-- Nhược điểm 1 -->
          <div class="card" style="border-left: 5px solid #F2683C;">
            <div class="card-title" style="color: #FF855D;">
              <span>😐</span> 1. Thiếu tín hiệu phi ngôn ngữ
            </div>
            <p style="font-size: 14.5px;">
              Tin nhắn không có nét mặt, ánh mắt, điệu bộ hay giọng điệu cảm xúc. Rất dễ khiến người đọc hiểu sai ý, suy diễn tiêu cực dẫn tới xung đột, cãi vã không đáng có.
            </p>
          </div>

          <!-- Nhược điểm 2 -->
          <div class="card" style="border-left: 5px solid #F2683C;">
            <div class="card-title" style="color: #FF855D;">
              <span>🔓</span> 2. Nguy cơ bảo mật & Quyền riêng tư
            </div>
            <p style="font-size: 14.5px;">
              Dữ liệu cá nhân, ảnh chụp, tin nhắn riêng tư có thể bị rò rỉ, lộ lọt hoặc bị hacker tấn công, đánh cắp mật khẩu để tống tiền, lừa đảo người thân.
            </p>
          </div>

          <!-- Nhược điểm 3 -->
          <div class="card" style="border-left: 5px solid #F2683C;">
            <div class="card-title" style="color: #FF855D;">
              <span>🎭</span> 3. Thiếu kết nối cá nhân chặt chẽ
            </div>
            <p style="font-size: 14.5px;">
              Người dùng dễ dàng "ẩn danh", tạo nick ảo, che giấu thân phận hoặc ngụy tạo thông tin giả. Rất khó xây dựng niềm tin chân thành như khi gặp mặt ngoài đời thực.
            </p>
          </div>

          <!-- Nhược điểm 4 -->
          <div class="card" style="border-left: 5px solid #F2683C;">
            <div class="card-title" style="color: #FF855D;">
              <span>📵</span> 4. Dễ bị gián đoạn do sự cố kỹ thuật
            </div>
            <p style="font-size: 14.5px;">
              Mất kết nối mạng Internet, nghẽn đường truyền, máy hết pin, phần mềm bị lỗi... làm cuộc họp, buổi học trực tuyến bị trì hoãn, ngắt quãng giữa chừng.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════════════════════
         SLIDE 6: SƠ ĐỒ ĐỒ HỌA SO SÁNH: CÁN CÂN ĐƯỢC VÀ MẤT
         ════════════════════════════════════════════════════════════════════════ -->
    <section class="slide" id="slide-6">
      <div class="slide-header">
        <div>
          <span class="slide-badge gold">Sơ đồ tổng hợp SGK</span>
          <div class="slide-title">Sơ đồ Cân bằng: Ưu điểm vs Nhược điểm</div>
          <div class="slide-subtitle">Bức tranh đối chiếu toàn cảnh giúp ghi nhớ trọn vẹn 8 luận điểm của bài</div>
        </div>
        <span style="font-size: 32px;">⚖️</span>
      </div>
      <div class="slide-body">
        <div class="compare-container">
          <!-- Cột Ưu điểm -->
          <div class="compare-col leaf-border">
            <div style="font-size: 20px; font-weight: 800; color: #34D399; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
              <span>👍</span> BỐN ƯU ĐIỂM (TÍCH CỰC)
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <div style="padding: 10px 14px; background: rgba(255,255,255,0.05); border-radius: 8px; border-left: 4px solid #10B981;">
                <strong>1. Thuận tiện:</strong> Mọi lúc, mọi nơi khi có mạng.
              </div>
              <div style="padding: 10px 14px; background: rgba(255,255,255,0.05); border-radius: 8px; border-left: 4px solid #10B981;">
                <strong>2. Tiết kiệm:</strong> Giảm tối đa thời gian & chi phí đi lại.
              </div>
              <div style="padding: 10px 14px; background: rgba(255,255,255,0.05); border-radius: 8px; border-left: 4px solid #10B981;">
                <strong>3. Kết nối xã hội:</strong> Mở rộng mạng lưới quan hệ, sở thích.
              </div>
              <div style="padding: 10px 14px; background: rgba(255,255,255,0.05); border-radius: 8px; border-left: 4px solid #10B981;">
                <strong>4. Đa dạng công cụ:</strong> Nhắn tin, gọi video, email, blog...
              </div>
            </div>
          </div>

          <!-- Cột Nhược điểm -->
          <div class="compare-col coral-border">
            <div style="font-size: 20px; font-weight: 800; color: #FF855D; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
              <span>👎</span> BỐN NHƯỢC ĐIỂM (HẠN CHẾ)
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <div style="padding: 10px 14px; background: rgba(255,255,255,0.05); border-radius: 8px; border-left: 4px solid #F2683C;">
                <strong>1. Thiếu tín hiệu phi ngôn ngữ:</strong> Dễ dẫn tới hiểu lầm.
              </div>
              <div style="padding: 10px 14px; background: rgba(255,255,255,0.05); border-radius: 8px; border-left: 4px solid #F2683C;">
                <strong>2. Nguy cơ an ninh & riêng tư:</strong> Bị lộ tin mật, hack nick.
              </div>
              <div style="padding: 10px 14px; background: rgba(255,255,255,0.05); border-radius: 8px; border-left: 4px solid #F2683C;">
                <strong>3. Thiếu kết nối chặt chẽ:</strong> Nick ảo, thông tin bịa đặt.
              </div>
              <div style="padding: 10px 14px; background: rgba(255,255,255,0.05); border-radius: 8px; border-left: 4px solid #F2683C;">
                <strong>4. Rủi ro sự cố kỹ thuật:</strong> Mất mạng, lỗi phần mềm.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════════════════════
         SLIDE 7: TẠI SAO NHẮN TIN DỄ GÂY HIỂU LẦM?
         ════════════════════════════════════════════════════════════════════════ -->
    <section class="slide" id="slide-7">
      <div class="slide-header">
        <div>
          <span class="slide-badge coral">Mổ xẻ tâm lý giao tiếp</span>
          <div class="slide-title">Vì sao nhắn tin lại dễ gây hiểu lầm hơn nói chuyện trực tiếp?</div>
          <div class="slide-subtitle">Sự thiếu hụt của các tín hiệu phi ngôn ngữ (Non-verbal communication cues)</div>
        </div>
        <span style="font-size: 32px;">💬 ⚡ 😡</span>
      </div>
      <div class="slide-body">
        <div class="grid-2">
          <!-- Gặp mặt trực tiếp -->
          <div class="card" style="border: 2px solid #10B981; background: rgba(16, 185, 129, 0.08);">
            <div class="card-title" style="color: #34D399;">
              <span>🗣️</span> GẶP MẶT TRỰC TIẾP (Hiểu đúng 100%)
            </div>
            <p style="margin-bottom: 12px;">Khi nói chuyện mặt đối mặt, não bộ tiếp nhận đồng thời 3 kênh:</p>
            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 14px;">
              <div style="background: rgba(255,255,255,0.06); padding: 8px 12px; border-radius: 6px;">
                😊 <strong>Nét mặt & Nụ cười:</strong> Thấy rõ sự thân thiện, đùa vui hay nghiêm túc.
              </div>
              <div style="background: rgba(255,255,255,0.06); padding: 8px 12px; border-radius: 6px;">
                🗣️ <strong>Ngữ điệu giọng nói:</strong> Giọng trầm ấm, nhẹ nhàng hay bực dọc.
              </div>
              <div style="background: rgba(255,255,255,0.06); padding: 8px 12px; border-radius: 6px;">
                👋 <strong>Ngôn ngữ cơ thể:</strong> Cử chỉ tay, ánh mắt tạo sự tin cậy.
              </div>
            </div>
          </div>

          <!-- Nhắn tin màn hình phẳng -->
          <div class="card" style="border: 2px solid #F2683C; background: rgba(242, 104, 60, 0.08);">
            <div class="card-title" style="color: #FF855D;">
              <span>📱</span> NHẮN TIN VĂN BẢN (Rất dễ hiểu lầm)
            </div>
            <p style="margin-bottom: 12px;">Khi chỉ đọc dòng chữ trên màn hình phẳng:</p>
            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 14px;">
              <div style="background: rgba(255,255,255,0.06); padding: 8px 12px; border-radius: 6px;">
                ❌ <strong>Mất sạch nét mặt:</strong> Không biết bạn đang cười đùa hay cáu gắt.
              </div>
              <div style="background: rgba(255,255,255,0.06); padding: 8px 12px; border-radius: 6px;">
                ❌ <strong>Mất giọng điệu:</strong> Một câu đùa "Hay quá nhỉ!" dễ bị đọc thành mỉa mai!
              </div>
              <div style="background: rgba(255,255,255,0.06); padding: 8px 12px; border-radius: 6px;">
                ⚠️ <strong>Suy diễn tiêu cực:</strong> Người đọc tự áp đặt tâm trạng buồn bực của mình vào tin nhắn của đối phương.
              </div>
            </div>
          </div>
        </div>

        <div class="card" style="background: rgba(245, 166, 35, 0.12); border-color: rgba(245, 166, 35, 0.3); text-align: center; padding: 12px;">
          💡 <strong>Lời khuyên cho học sinh:</strong> Khi trao đổi vấn đề nhạy cảm, hiểu lầm hoặc công việc quan trọng, hãy <strong>gọi điện thoại trực tiếp hoặc hẹn gặp mặt</strong> thay vì nhắn tin qua lại!
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════════════════════
         SLIDE 8: KHUNG PHÁP LÝ: QUYẾT ĐỊNH 874/QĐ-BTTTT
         ════════════════════════════════════════════════════════════════════════ -->
    <section class="slide" id="slide-8">
      <div class="slide-header">
        <div>
          <span class="slide-badge gold">Căn cứ pháp lý quan trọng</span>
          <div class="slide-title">Quy tắc ứng xử trên mạng theo Pháp luật Việt Nam</div>
          <div class="slide-subtitle">Quyết định số 874/QĐ-BTTTT ngày 17/6/2021 của Bộ Thông tin và Truyền thông</div>
        </div>
        <span style="font-size: 32px;">⚖️ 📜</span>
      </div>
      <div class="slide-body">
        <div class="grid-2">
          <div class="card" style="border-left: 4px solid #F5A623;">
            <div class="card-title">🏛️ Mốc pháp lý SGK Tin học 12</div>
            <p style="font-size: 15px; line-height: 1.6; margin-bottom: 12px;">
              Để xây dựng môi trường mạng an toàn, lành mạnh, ngày <strong class="gold-text">17/6/2021</strong>, Bộ Thông tin và Truyền thông đã ban hành:
            </p>
            <div style="background: rgba(245, 166, 35, 0.15); border: 1px solid #F5A623; border-radius: 8px; padding: 12px; font-weight: 700; color: #FDE047; text-align: center; margin-bottom: 12px;">
              Quyết định số 874/QĐ-BTTTT <br>
              <span style="font-size: 13.5px; font-weight: 500; color: #CBD5E1;">"Bộ quy tắc ứng xử trên mạng xã hội"</span>
            </div>
            <p style="font-size: 14px; color: #A2B7C7;">
              Áp dụng cho mọi cơ quan, tổ chức, cán bộ, công chức và toàn thể người dân Việt Nam khi tham gia không gian mạng.
            </p>
          </div>

          <div class="card" style="background: rgba(13, 124, 134, 0.12); border-color: rgba(56, 225, 240, 0.3);">
            <div class="card-title">🛡️ 4 Quy tắc ứng xử chung cơ bản</div>
            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 14px;">
              <div class="step-item" style="padding: 10px;">
                <span style="color: #38E1F0; font-weight: 700;">1. Tôn trọng, tuân thủ pháp luật:</span> Tuân thủ Luật An ninh mạng, bảo vệ quyền lợi hợp pháp của người khác.
              </div>
              <div class="step-item" style="padding: 10px;">
                <span style="color: #38E1F0; font-weight: 700;">2. Lành mạnh:</span> Hành vi ứng xử phù hợp với thuần phong mỹ tục, chuẩn mực đạo đức của dân tộc.
              </div>
              <div class="step-item" style="padding: 10px;">
                <span style="color: #38E1F0; font-weight: 700;">3. An toàn, bảo mật thông tin:</span> Tự bảo vệ dữ liệu cá nhân, không chia sẻ thông tin bí mật.
              </div>
              <div class="step-item" style="padding: 10px;">
                <span style="color: #38E1F0; font-weight: 700;">4. Trách nhiệm:</span> Chịu trách nhiệm về mọi bài đăng, bình luận do chính mình phát ngôn.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════════════════════
         SLIDE 9: BỐN YẾU TỐ ỨNG XỬ NHÂN VĂN
         ════════════════════════════════════════════════════════════════════════ -->
    <section class="slide" id="slide-9">
      <div class="slide-header">
        <div>
          <span class="slide-badge berry">Trọng tâm đạo đức</span>
          <div class="slide-title">Bốn yếu tố tạo nên Ứng xử nhân văn trên mạng</div>
          <div class="slide-subtitle">Không chỉ đúng luật — Người tử tế còn biết đối xử ấm áp và nhân ái với nhau</div>
        </div>
        <span style="font-size: 32px;">💗</span>
      </div>
      <div class="slide-body">
        <div class="grid-4" style="gap: 16px;">
          <!-- Cột 1 -->
          <div class="card" style="text-align: center; border-top: 5px solid #0D7C86;">
            <div style="font-size: 40px; margin-bottom: 8px;">🤝</div>
            <div class="card-title" style="justify-content: center; color: #38E1F0;">1. TÔN TRỌNG</div>
            <p style="font-size: 13.5px; line-height: 1.55;">
              Tôn trọng quyền riêng tư. Không phát tán thông tin riêng khi chưa cho phép. Tôn trọng quan điểm khác biệt, không bắt người khác theo ý mình.
            </p>
          </div>

          <!-- Cột 2 -->
          <div class="card" style="text-align: center; border-top: 5px solid #10B981;">
            <div style="font-size: 40px; margin-bottom: 8px;">💬</div>
            <div class="card-title" style="justify-content: center; color: #34D399;">2. LỊCH SỰ</div>
            <p style="font-size: 13.5px; line-height: 1.55;">
              Dùng ngôn từ đúng mực. Không lăng mạ, chửi thề, phỉ báng hay phân biệt đối xử. Chia sẻ thông tin chính xác, không lan truyền tin giả.
            </p>
          </div>

          <!-- Cột 3 -->
          <div class="card" style="text-align: center; border-top: 5px solid #EC4899;">
            <div style="font-size: 40px; margin-bottom: 8px;">💗</div>
            <div class="card-title" style="justify-content: center; color: #F472B6;">3. THẤU HIỂU</div>
            <p style="font-size: 13.5px; line-height: 1.55;">
              Cảm thông với khó khăn của người khác. Đặt mình vào hoàn cảnh của họ để hiểu suy nghĩ, cảm xúc trước khi buông lời bình luận.
            </p>
          </div>

          <!-- Cột 4 -->
          <div class="card" style="text-align: center; border-top: 5px solid #F5A623;">
            <div style="font-size: 40px; margin-bottom: 8px;">🫶</div>
            <div class="card-title" style="justify-content: center; color: #FFC043;">4. HỖ TRỢ</div>
            <p style="font-size: 13.5px; line-height: 1.55;">
              Sẵn lòng giúp đỡ khi người khác gặp hoạn nạn. Đôi khi chỉ là một lời an ủi, lời động viên chân thành giúp nhau vượt qua khó khăn.
            </p>
          </div>
        </div>

        <div style="margin-top: 10px; background: rgba(236, 72, 153, 0.12); border: 1px solid rgba(236, 72, 153, 0.3); border-radius: 12px; padding: 14px; text-align: center; font-size: 15px;">
          ✨ <em>"Tôn trọng, lịch sự, thấu hiểu và hỗ trợ giúp tạo nên một môi trường mạng an toàn, lành mạnh và đáng tin cậy."</em>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════════════════════
         SLIDE 10: TÔN TRỌNG VÀ LỊCH SỰ
         ════════════════════════════════════════════════════════════════════════ -->
    <section class="slide" id="slide-10">
      <div class="slide-header">
        <div>
          <span class="slide-badge">Phân tích yếu tố 1 & 2</span>
          <div class="slide-title">Tôn trọng quyền riêng tư & Ngôn từ lịch sự</div>
          <div class="slide-subtitle">Những ranh giới đạo đức tuyệt đối không được bước qua trong không gian mạng</div>
        </div>
        <span style="font-size: 32px;">🤝 💬</span>
      </div>
      <div class="slide-body">
        <div class="grid-2">
          <!-- Tôn trọng -->
          <div class="card" style="border-left: 5px solid #0D7C86;">
            <div class="card-title" style="color: #38E1F0;">
              <span>🔒</span> TÔN TRỌNG QUYỀN RIÊNG TƯ
            </div>
            <ul style="margin-left: 20px; font-size: 14px; display: flex; flex-direction: column; gap: 8px;">
              <li><strong class="coral-text">Không chụp màn hình tin nhắn riêng</strong> của bạn đem phát tán lên nhóm lớp hoặc mạng xã hội khi chưa được sự đồng ý.</li>
              <li>Không tự ý chia sẻ số điện thoại, địa chỉ nhà, điểm thi hay hình ảnh dìm hàng của người khác.</li>
              <li>Không ép buộc bạn bè phải chấp nhận quan điểm chính trị, tôn giáo hay sở thích giống mình.</li>
            </ul>
          </div>

          <!-- Lịch sự -->
          <div class="card" style="border-left: 5px solid #10B981;">
            <div class="card-title" style="color: #34D399;">
              <span>✍️</span> LỊCH SỰ TRONG NGÔN TỪ
            </div>
            <ul style="margin-left: 20px; font-size: 14px; display: flex; flex-direction: column; gap: 8px;">
              <li>Tuyệt đối không dùng từ ngữ khiêu khích, chửi bới, lăng mạ hay tấn công cá nhân khi tranh luận.</li>
              <li>Tránh viết hoa toàn bộ câu (CAPSLOCK) vì tạo cảm giác như đang quát tháo vào mặt đối phương.</li>
              <li>Hạn chế lạm dụng từ lóng hoặc tiếng lóng phản cảm trong các diễn đàn học tập, hội nhóm văn minh.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════════════════════
         SLIDE 11: THẤU HIỂU VÀ HỖ TRỢ
         ════════════════════════════════════════════════════════════════════════ -->
    <section class="slide" id="slide-11">
      <div class="slide-header">
        <div>
          <span class="slide-badge berry">Phân tích yếu tố 3 & 4</span>
          <div class="slide-title">Thấu hiểu người khác & Sẵn sàng hỗ trợ</div>
          <div class="slide-subtitle">Sức mạnh của sự tử tế đẩy lùi bạo lực mạng và tạo dựng cộng đồng vững mạnh</div>
        </div>
        <span style="font-size: 32px;">💗 🫶</span>
      </div>
      <div class="slide-body">
        <div class="grid-2">
          <!-- Thấu hiểu -->
          <div class="card" style="border-left: 5px solid #EC4899;">
            <div class="card-title" style="color: #F472B6;">
              <span>🧠</span> NGHỆ THUẬT THẤU HIỂU (Empathy)
            </div>
            <p style="font-size: 14.5px; margin-bottom: 8px;">
              Khi thấy một người có ý kiến vụng về hoặc hành vi khác lạ, đừng vội vàng lao vào "ném đá" hay chế giễu:
            </p>
            <ul style="margin-left: 20px; font-size: 14px; display: flex; flex-direction: column; gap: 8px;">
              <li>Hãy tự hỏi: <em>"Họ đang phải đối mặt với khó khăn hay áp lực gì mà viết như vậy?"</em></li>
              <li>Đặt mình vào vị trí của họ để cảm nhận nỗi đau hoặc sự lúng túng.</li>
              <li>Chỉ khi thấu hiểu được căn nguyên, lời khuyên của ta mới thực sự có giá trị.</li>
            </ul>
          </div>

          <!-- Hỗ trợ -->
          <div class="card" style="border-left: 5px solid #F5A623;">
            <div class="card-title" style="color: #FFC043;">
              <span>🌱</span> HỖ TRỢ LẪN NHAU (Support)
            </div>
            <p style="font-size: 14.5px; margin-bottom: 8px;">
              Không cần phải làm điều gì quá to tát mới là hỗ trợ:
            </p>
            <ul style="margin-left: 20px; font-size: 14px; display: flex; flex-direction: column; gap: 8px;">
              <li>Một tin nhắn riêng hỏi thăm: <em>"Cậu ổn không?"</em> khi thấy bạn bị công kích trên mạng.</li>
              <li>Chia sẻ tài liệu học tập, hướng dẫn bạn giải một bài toán khó trong nhóm lớp.</li>
              <li>Lên tiếng bảo vệ nạn nhân trước các hành vi bắt nạt trực tuyến (Cyberbullying).</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════════════════════
         SLIDE 12: THỬ THÁCH TÌNH HUỐNG THỰC TẾ (SIMULATOR)
         ════════════════════════════════════════════════════════════════════════ -->
    <section class="slide" id="slide-12">
      <div class="slide-header">
        <div>
          <span class="slide-badge leaf">Thực hành xử lý tình huống</span>
          <div class="slide-title">Phòng Tình huống: Em sẽ làm gì?</div>
          <div class="slide-subtitle">Nhấp chọn phương án ứng xử phù hợp nhất trong 2 tình huống phòng học dưới đây</div>
        </div>
        <span style="font-size: 32px;">🧪</span>
      </div>
      <div class="slide-body">
        <div class="grid-2">
          <!-- Tình huống 1 -->
          <div class="dilemma-card" id="dilemma-1">
            <div style="font-weight: 700; color: #38E1F0; margin-bottom: 8px; font-size: 15px;">
              📌 TÌNH HUỐNG 1: Ý KIẾN TRÁI NGƯỢC TRONG NHÓM LỚP
            </div>
            <p style="font-size: 13.5px; margin-bottom: 12px; color: #CBD5E1;">
              Một bạn đăng lên nhóm lớp ý kiến về buổi dã ngoại mà em thấy hoàn toàn sai và vô lý. Em sẽ:
            </p>
            <button class="dilemma-btn" onclick="handleDilemma(this, false, 'D1-feedback', '❌ Dùng từ ngữ gắt gỏng sẽ gây mâu thuẫn, làm rạn nứt tình cảm bạn bè!')">
              A. Bình luận gắt gỏng, phản đối kịch liệt ngay lập tức
            </button>
            <button class="dilemma-btn" onclick="handleDilemma(this, true, 'D1-feedback', '🎉 Rất chuẩn mực! Nêu lý lẽ lịch sự và tôn trọng người khác là đỉnh cao của ứng xử nhân văn.')">
              B. Trao đổi lịch sự, nêu rõ lý do và tôn trọng quan điểm của bạn
            </button>
            <button class="dilemma-btn" onclick="handleDilemma(this, false, 'D1-feedback', '❌ Chụp màn hình nói xấu sau lưng là vi phạm quyền riêng tư và thiếu văn minh!')">
              C. Chụp màn hình gửi sang nhóm khác để mọi người cùng cười chê
            </button>
            <div id="D1-feedback" style="display: none; padding: 10px; border-radius: 6px; font-size: 13px; margin-top: 8px;"></div>
          </div>

          <!-- Tình huống 2 -->
          <div class="dilemma-card" id="dilemma-2">
            <div style="font-weight: 700; color: #38E1F0; margin-bottom: 8px; font-size: 15px;">
              📌 TÌNH HUỐNG 2: BẮT GẶP TIN ĐỒN GIẬT GÂN TRÊN FACEBOOK
            </div>
            <p style="font-size: 13.5px; margin-bottom: 12px; color: #CBD5E1;">
              Em thấy một bài viết giật gân về việc lộ đề thi học kỳ nhưng chưa có nguồn kiểm chứng rõ ràng. Em sẽ:
            </p>
            <button class="dilemma-btn" onclick="handleDilemma(this, false, 'D2-feedback', '❌ Chia sẻ tin giả chưa kiểm chứng có thể bị xử phạt hành chính từ 5-10 triệu đồng theo Nghị định 15!')">
              A. Bấm nút Share ngay về trang cá nhân để bạn bè cùng biết
            </button>
            <button class="dilemma-btn" onclick="handleDilemma(this, true, 'D2-feedback', '🎉 Tuyệt vời! Kiểm chứng sự thật trước khi chia sẻ là quy tắc sống còn của công dân số.')">
              B. Bỏ qua, kiểm tra lại trang chính thức của nhà trường, không lan truyền
            </button>
            <button class="dilemma-btn" onclick="handleDilemma(this, false, 'D2-feedback', '❌ Bình luận lan truyền thêm vào các nhóm khác cũng tiếp tay cho tin giả!')">
              C. Copy nội dung gửi vào nhóm chat của lớp để hỏi cho xôn xao
            </button>
            <div id="D2-feedback" style="display: none; padding: 10px; border-radius: 6px; font-size: 13px; margin-top: 8px;"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════════════════════
         SLIDE 13: 5 CÁCH RÈN THÓI QUEN ỨNG XỬ VĂN MINH
         ════════════════════════════════════════════════════════════════════════ -->
    <section class="slide" id="slide-13">
      <div class="slide-header">
        <div>
          <span class="slide-badge gold">Rèn luyện bản thân</span>
          <div class="slide-title">5 Cách biến Ứng xử nhân văn thành Thói quen</div>
          <div class="slide-subtitle">Biết là một chuyện, rèn luyện để thực hiện mỗi ngày mới là điều đáng quý</div>
        </div>
        <span style="font-size: 32px;">🔁 🌟</span>
      </div>
      <div class="slide-body">
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div class="step-item">
            <div class="step-badge">1</div>
            <div>
              <strong>Tự kiểm tra và cải thiện hành vi trực tuyến của mình:</strong> Thường xuyên nhìn lại các bài viết, bình luận cũ. Nếu thấy lời nói nào chưa đúng mực, hãy dũng cảm sửa đổi hoặc xóa đi.
            </div>
          </div>

          <div class="step-item">
            <div class="step-badge">2</div>
            <div>
              <strong>Bình tĩnh lắng nghe và tôn trọng ý kiến người khác:</strong> Khi gặp quan điểm trái ngược, đừng nổi nóng. Hãy đưa ra dẫn chứng và phản bác với thái độ nhã nhặn.
            </div>
          </div>

          <div class="step-item">
            <div class="step-badge">3</div>
            <div>
              <strong>Học cách xử lý các tình huống khó xử:</strong> Khi bị người lạ lăng mạ hoặc bị tống tiền trên mạng, hãy tìm sự giúp đỡ từ thầy cô, cha mẹ hoặc cơ quan chức năng.
            </div>
          </div>

          <div class="step-item">
            <div class="step-badge">4</div>
            <div>
              <strong>Cẩn trọng với ngôn từ và cách viết:</strong> Đọc kỹ lại tin nhắn trước khi nhấn Enter gửi đi để đảm bảo không gây hiểu nhầm hoặc làm tổn thương ai.
            </div>
          </div>

          <div class="step-item" style="background: rgba(245, 166, 35, 0.12); border: 2px solid #F5A623;">
            <div class="step-badge" style="background: linear-gradient(135deg, #F5A623, #FF855D);">5</div>
            <div>
              <strong style="color: #FFC043; font-size: 16px;">NGUYÊN TẮC VÀNG: Đối xử với người khác theo cách mình muốn được đối xử!</strong>
              <div style="font-size: 13.5px; color: #CBD5E1; margin-top: 3px;">
                Nếu em không muốn bị người khác chụp trộm màn hình hay chế giễu, em tuyệt đối đừng làm điều đó với bất kỳ ai!
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════════════════════
         SLIDE 14: CẨM NANG HÀNH ĐỘNG CỤ THỂ CHO HỌC SINH
         ════════════════════════════════════════════════════════════════════════ -->
    <section class="slide" id="slide-14">
      <div class="slide-header">
        <div>
          <span class="slide-badge leaf">Cẩm nang thực tế</span>
          <div class="slide-title">Ứng xử chuẩn mực trong 5 Hoàn cảnh thường gặp</div>
          <div class="slide-subtitle">Quy tắc ứng xử nhanh gọn giúp học sinh luôn là người lịch thiệp trên không gian mạng</div>
        </div>
        <span style="font-size: 32px;">📱 💻 ✉️</span>
      </div>
      <div class="slide-body">
        <div class="grid-3" style="gap: 14px;">
          <div class="card" style="border-top: 3px solid #38BDF8;">
            <div class="card-title" style="font-size: 16px;">🗣️ Tranh luận diễn đàn</div>
            <p style="font-size: 13px;">Tập trung vào vấn đề, không công kích cá nhân hay gia đình bạn. Biết nói lời cảm ơn khi được bạn chỉ ra điểm chưa đúng.</p>
          </div>

          <div class="card" style="border-top: 3px solid #F5A623;">
            <div class="card-title" style="font-size: 16px;">💭 Nhóm chat mạng xã hội</div>
            <p style="font-size: 13px;">Đọc kỹ toàn bộ tin nhắn trước khi trả lời. Tránh spam tin nhắn liên tục hoặc gửi nhãn dán gây phiền toái cho cả nhóm.</p>
          </div>

          <div class="card" style="border-top: 3px solid #10B981;">
            <div class="card-title" style="font-size: 16px;">✉️ Viết thư / Tin nhắn riêng</div>
            <p style="font-size: 13px;">Có lời chào hỏi đàng hoàng ở đầu và lời cảm ơn ở cuối thư. Giữ bí mật tuyệt đối nội dung trao đổi riêng tư của bạn.</p>
          </div>

          <div class="card" style="border-top: 3px solid #EC4899;">
            <div class="card-title" style="font-size: 16px;">📹 Trò chuyện qua Video</div>
            <p style="font-size: 13px;">Mặc trang phục lịch sự, chọn góc ngồi gọn gàng, tắt micro khi người khác đang phát biểu để tránh tiếng ồn.</p>
          </div>

          <div class="card" style="border-top: 3px solid #8B5CF6;">
            <div class="card-title" style="font-size: 16px;">📤 Đăng bài & Chia sẻ tin</div>
            <p style="font-size: 13px;">Kiểm tra nguồn tin trước khi chia sẻ. Không đăng ảnh thẻ học sinh, căn cước công dân của mình hoặc bạn bè lên mạng.</p>
          </div>

          <div class="card" style="border-top: 3px solid #F2683C;">
            <div class="card-title" style="font-size: 16px;">🛡️ Khi bị làm phiền</div>
            <p style="font-size: 13px;">Không đôi co cãi nhau. Chặn tài khoản độc hại, báo cáo vi phạm (Report) và lưu lại bằng chứng để báo người lớn xử lý.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════════════════════
         SLIDE 15: MINI-QUIZ TƯƠNG TÁC CỦNG CỐ KIẾN THỨC
         ════════════════════════════════════════════════════════════════════════ -->
    <section class="slide" id="slide-15">
      <div class="slide-header">
        <div>
          <span class="slide-badge gold">Thử thách củng cố</span>
          <div class="slide-title">Mini-Quiz: 2 Câu hỏi then chốt của bài học</div>
          <div class="slide-subtitle">Nhấp chọn đáp án đúng để nhận pháo hoa chúc mừng nhé!</div>
        </div>
        <span style="font-size: 32px;">🏆</span>
      </div>
      <div class="slide-body">
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <!-- Câu 1 -->
          <div class="card" style="padding: 16px 20px;">
            <div style="font-size: 17px; font-weight: 700; margin-bottom: 8px; color: white;">
              1. Bốn yếu tố làm nên ứng xử nhân văn trong không gian mạng theo SGK là gì?
            </div>
            <div class="quiz-options">
              <button class="quiz-btn" onclick="checkQuiz(this, false, 'q1', 'Sai rồi! Kết bạn và trả phí không thuộc ứng xử nhân văn.')">
                A. Kết bạn, trả phí, bảo mật và chia sẻ
              </button>
              <button class="quiz-btn" onclick="checkQuiz(this, true, 'q1', 'Chính xác! 4 trụ cột nhân văn là Tôn trọng — Lịch sự — Thấu hiểu — Hỗ trợ.')">
                B. Tôn trọng, lịch sự, thấu hiểu và hỗ trợ
              </button>
              <button class="quiz-btn" onclick="checkQuiz(this, false, 'q1', 'Sai rồi! Im lặng và phớt lờ không phải là ứng xử nhân văn.')">
                C. Tranh luận, im lặng, phớt lờ và phản kháng
              </button>
              <button class="quiz-btn" onclick="checkQuiz(this, false, 'q1', 'Sai rồi! Ẩn danh là nhược điểm chứ không phải yếu tố nhân văn.')">
                D. Ẩn danh, bảo mật, tự do và giải trí
              </button>
            </div>
            <div class="quiz-feedback" id="q1-feedback"></div>
          </div>

          <!-- Câu 2 -->
          <div class="card" style="padding: 16px 20px;">
            <div style="font-size: 17px; font-weight: 700; margin-bottom: 8px; color: white;">
              2. Quyết định số 874/QĐ-BTTTT ngày 17/6/2021 ban hành nội dung gì?
            </div>
            <div class="quiz-options">
              <button class="quiz-btn" onclick="checkQuiz(this, true, 'q2', 'Chính xác! Quyết định số 874-QĐ-BTTTT ngày 17/6/2021 ban hành Bộ quy tắc ứng xử trên mạng xã hội.')">
                A. Bộ quy tắc ứng xử trên mạng xã hội
              </button>
              <button class="quiz-btn" onclick="checkQuiz(this, false, 'q2', 'Sai rồi! Đây là quy định về ứng xử mạng xã hội, không phải phí cước viễn thông.')">
                B. Khung giá cước dịch vụ viễn thông Internet
              </button>
              <button class="quiz-btn" onclick="checkQuiz(this, false, 'q2', 'Sai rồi! Nghị định về bản quyền phần mềm có số hiệu văn bản khác.')">
                C. Quy chuẩn kỹ thuật sản xuất máy tính cá nhân
              </button>
              <button class="quiz-btn" onclick="checkQuiz(this, false, 'q2', 'Sai rồi!')">
                D. Hướng dẫn cài đặt mạng máy tính trường học
              </button>
            </div>
            <div class="quiz-feedback" id="q2-feedback"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════════════════════
         SLIDE 16: HỒ SƠ CÔNG DÂN SỐ & TỔNG KẾT
         ════════════════════════════════════════════════════════════════════════ -->
    <section class="slide" id="slide-16">
      <div class="slide-header">
        <div>
          <span class="slide-badge leaf">Tổng kết & Cam kết</span>
          <div class="slide-title">Bảng Tự đánh giá: Hồ sơ Công dân số Văn minh</div>
          <div class="slide-subtitle">Nhấp chọn các ô để tự cam kết với bản thân khi tham gia thế giới mạng</div>
        </div>
        <span style="font-size: 32px;">🎓</span>
      </div>
      <div class="slide-body">
        <div class="grid-2">
          <!-- Cột Checklist -->
          <div class="card" style="border-left: 4px solid #10B981;">
            <div class="card-title" style="color: #34D399;">
              📋 Cam kết của em trên Không gian mạng:
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px;">
              <div class="checklist-item" onclick="this.classList.toggle('done');">
                <span>⬜</span> <span>1. Không chia sẻ tin nhắn riêng của người khác khi chưa được phép</span>
              </div>
              <div class="checklist-item" onclick="this.classList.toggle('done');">
                <span>⬜</span> <span>2. Tranh luận lịch sự, không chửi thề hay lăng mạ người khác</span>
              </div>
              <div class="checklist-item" onclick="this.classList.toggle('done');">
                <span>⬜</span> <span>3. Kiểm chứng thông tin trước khi nhấn nút Share bài viết</span>
              </div>
              <div class="checklist-item" onclick="this.classList.toggle('done');">
                <span>⬜</span> <span>4. Biết đặt mình vào hoàn cảnh của bạn để cảm thông và thấu hiểu</span>
              </div>
              <div class="checklist-item" onclick="this.classList.toggle('done');">
                <span>⬜</span> <span>5. Không tiếp tay cho bạo lực mạng, sẵn lòng an ủi và hỗ trợ bạn bè</span>
              </div>
              <div class="checklist-item" onclick="this.classList.toggle('done');">
                <span>⬜</span> <span>6. Luôn nhớ nguyên tắc: "Đối xử với người khác như mình muốn được đối xử"</span>
              </div>
            </div>
          </div>

          <!-- Cột Tổng kết -->
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div class="card" style="background: rgba(13, 124, 134, 0.15); border-color: rgba(56, 225, 240, 0.4);">
              <div class="card-title">💡 Ghi nhớ trọng tâm Bài 6</div>
              <ul style="margin-left: 18px; font-size: 14px; display: flex; flex-direction: column; gap: 8px; color: #E2E8F0;">
                <li>Internet là <strong>không gian mạng lớn nhất</strong> hiện nay.</li>
                <li>Nhớ 4 Ưu điểm (Thuận tiện, Tiết kiệm, Kết nối, Đa dạng) và 4 Nhược điểm (Mất tín hiệu phi ngôn ngữ, Bảo mật, Ít gắn kết sâu, Kỹ thuật).</li>
                <li>4 Trụ cột nhân văn: <strong>Tôn trọng — Lịch sự — Thấu hiểu — Hỗ trợ</strong>.</li>
                <li>Khung pháp lý: <strong>Quyết định 874/QĐ-BTTTT ngày 17/6/2021</strong>.</li>
              </ul>
            </div>

            <div class="card" style="text-align: center; padding: 20px;">
              <div style="font-size: 18px; font-weight: 700; color: white; margin-bottom: 12px;">
                🎉 Em đã hoàn thành trọn vẹn bài học!
              </div>
              <div style="display: flex; gap: 12px; justify-content: center;">
                <a href="/luyen/bai-06" style="display: inline-flex; align-items: center; gap: 6px; background: #0D7C86; color: white; text-decoration: none; padding: 10px 20px; border-radius: 10px; font-weight: 700; font-size: 14px;" onmouseover="this.style.background='#16A8B6';" onmouseout="this.style.background='#0D7C86';">
                  ✍️ Luyện trắc nghiệm Bài 6
                </a>
                <a href="/sgk/bai-06.html" target="_blank" style="display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.08); color: white; text-decoration: none; padding: 10px 20px; border-radius: 10px; font-weight: 700; font-size: 14px; border: 1px solid rgba(255,255,255,0.15);">
                  📖 Đọc SGK Điện tử
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>

  <!-- ─── DECK NAV ─── -->
  <div class="deck-nav">
    <button class="nav-btn" onclick="prevSlide();" title="Slide trước (← Phím Mũi tên trái)">‹</button>
    <div class="deck-progress">
      <div class="deck-progress-bar" id="progressBar"></div>
    </div>
    <div class="deck-counter" id="slideCounter">01 / 16</div>
    <button class="nav-btn" onclick="nextSlide();" title="Slide tiếp (→ Phím Mũi tên phải hoặc Space)">›</button>
    <button class="nav-btn" onclick="toggleFullScreen();" title="Bật/Tắt Toàn màn hình (F)">⛶</button>
  </div>

  <script>
    let currentSlide = 1;
    const totalSlides = 16;

    function updateSlide() {
      document.querySelectorAll('.slide').forEach((s, idx) => {
        const slideIndex = idx + 1;
        s.classList.remove('active', 'prev');
        if (slideIndex === currentSlide) {
          s.classList.add('active');
        } else if (slideIndex < currentSlide) {
          s.classList.add('prev');
        }
      });

      const progress = (currentSlide / totalSlides) * 100;
      document.getElementById('progressBar').style.width = progress + '%';
      document.getElementById('slideCounter').innerText = 
        String(currentSlide).padStart(2, '0') + ' / ' + String(totalSlides).padStart(2, '0');
    }

    function nextSlide() {
      if (currentSlide < totalSlides) {
        currentSlide++;
        updateSlide();
      }
    }

    function prevSlide() {
      if (currentSlide > 1) {
        currentSlide--;
        updateSlide();
      }
    }

    function toggleFullScreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
      }
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') nextSlide();
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') prevSlide();
      else if (e.key === 'f' || e.key === 'F') toggleFullScreen();
      else if (e.key === 'Home') { currentSlide = 1; updateSlide(); }
      else if (e.key === 'End') { currentSlide = totalSlides; updateSlide(); }
    });

    let touchStartX = 0;
    window.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
    window.addEventListener('touchend', e => {
      const touchEndX = e.changedTouches[0].clientX;
      if (touchStartX - touchEndX > 50) nextSlide();
      if (touchEndX - touchStartX > 50) prevSlide();
    });

    /* ─── DILEMMA SIMULATOR (SLIDE 12) ─── */
    function handleDilemma(btn, isGood, feedbackId, msg) {
      const parent = btn.parentElement;
      parent.querySelectorAll('.dilemma-btn').forEach(b => b.classList.remove('chosen-good', 'chosen-bad'));
      const fb = document.getElementById(feedbackId);
      fb.style.display = 'block';

      if (isGood) {
        btn.classList.add('chosen-good');
        fb.style.background = 'rgba(16, 185, 129, 0.2)';
        fb.style.border = '1px solid #10B981';
        fb.style.color = '#6EE7B7';
        fb.innerHTML = msg;
        triggerConfetti();
      } else {
        btn.classList.add('chosen-bad');
        fb.style.background = 'rgba(242, 104, 60, 0.2)';
        fb.style.border = '1px solid #F2683C';
        fb.style.color = '#FCA5A5';
        fb.innerHTML = msg;
      }
    }

    /* ─── QUIZ LOGIC (SLIDE 15) ─── */
    function checkQuiz(btn, isCorrect, qId, msg) {
      const parent = btn.parentElement;
      parent.querySelectorAll('.quiz-btn').forEach(b => b.classList.remove('correct', 'wrong'));
      const feedback = document.getElementById(qId + '-feedback');
      feedback.style.display = 'block';

      if (isCorrect) {
        btn.classList.add('correct');
        feedback.style.background = 'rgba(16, 185, 129, 0.2)';
        feedback.style.border = '1px solid #10B981';
        feedback.style.color = '#6EE7B7';
        feedback.innerHTML = '🎉 ' + msg;
        triggerConfetti();
      } else {
        btn.classList.add('wrong');
        feedback.style.background = 'rgba(242, 104, 60, 0.2)';
        feedback.style.border = '1px solid #F2683C';
        feedback.style.color = '#FCA5A5';
        feedback.innerHTML = '❌ ' + msg;
      }
    }

    /* ─── CONFETTI CANVAS ─── */
    function triggerConfetti() {
      const canvas = document.getElementById('confettiCanvas');
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particles = [];
      const colors = ['#38E1F0', '#F2683C', '#F5A623', '#10B981', '#EC4899', '#FFFFFF'];

      for (let i = 0; i < 90; i++) {
        particles.push({
          x: canvas.width / 2,
          y: canvas.height / 2,
          r: Math.random() * 6 + 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 16,
          vy: (Math.random() - 0.5) * 16 - 3,
          alpha: 1,
          gravity: 0.25
        });
      }

      function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;
        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.gravity;
          p.alpha -= 0.015;

          if (p.alpha > 0) {
            alive = true;
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        });

        if (alive) requestAnimationFrame(render);
        else ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      render();
    }

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

console.log('Successfully generated:');
console.log(' - ' + publicPath);
console.log(' - ' + rootPath);

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Sources live beside this builder; the output remains a standalone offline HTML file.
const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(project, 'scripts', 'slide-bai-06');
const css = fs.readFileSync(path.join(source, 'deck.css'), 'utf8');
const js = fs.readFileSync(path.join(source, 'deck.js'), 'utf8');
const html = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="Bài 6 Tin học 12: bài trình chiếu tương tác về giao tiếp và ứng xử trong không gian mạng. Hiện từng ý, mô phỏng, tình huống phân nhánh và trắc nghiệm tự chấm.">
<title>Bài 6 · Giao tiếp và ứng xử trong không gian mạng</title>
<style>${css}</style>
</head>
<body>
<header class="topbar"><div class="brand">TIN HỌC 12 <b> / BÀI 06</b></div><div class="spacer"></div><button class="tool" id="contents" aria-haspopup="dialog">☰ Mục lục</button><button class="tool" id="motion" aria-pressed="true">✨ Hiệu ứng: Bật</button><button class="tool" id="sound" aria-pressed="false">🔇 Âm thanh: Tắt</button><button class="tool" id="fullscreen" title="Toàn màn hình (F)" aria-label="Toàn màn hình">⛶</button></header>
<main class="stage" id="stage"><div id="deck"></div><noscript><h1>Bài 6: Giao tiếp và ứng xử trong không gian mạng</h1><p>Hãy bật JavaScript để dùng các hoạt động tương tác của bài trình chiếu.</p></noscript></main>
<footer class="bottom"><button class="nav" id="prev" aria-label="Trang trước">←</button><div class="progress" aria-hidden="true"><span id="progress"></span></div><span class="counter" id="counter">01 / 14</span><span class="footer-count" id="reveal-counter"></span><button class="action" id="all-ideas">Hiện hết</button><button class="action primary next-idea" id="next-idea">Hiện ý tiếp ↓</button><button class="nav" id="next" aria-label="Trang tiếp">→</button><span class="key-help">Space/→: hiện ý, rồi chuyển trang<br>↑: ẩn ý · F: toàn màn hình · M: âm thanh</span></footer>
<dialog id="toc" aria-labelledby="toc-title"><div class="dialog-head"><h2 id="toc-title">Hành trình Bài 6</h2><button class="action" id="close-toc">Đóng ✕</button></div><div id="toc-grid" class="toc-grid"></div></dialog>
<div id="toast" class="toast" role="status" hidden></div><div class="confetti" id="confetti" aria-hidden="true"></div>
<script>${js}</script>
</body></html>
`;
for (const target of ['public/bai-06-trinh-chieu.html', 'bai-06-trinh-chieu.html']) {
  fs.writeFileSync(path.join(project, target), html, 'utf8');
  console.log('Built ' + target);
}

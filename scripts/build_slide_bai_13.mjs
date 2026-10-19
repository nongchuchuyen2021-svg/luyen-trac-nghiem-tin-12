import fs from 'node:fs';
import path from 'node:path';

// Đồng bộ file trình chiếu Bài 13 giữa public/ và thư mục gốc
const src = path.resolve('public/bai-13-trinh-chieu.html');
const dest = path.resolve('bai-13-trinh-chieu.html');

if (fs.existsSync(src)) {
  fs.copyFileSync(src, dest);
  console.log('✅ Đã đồng bộ thành công public/bai-13-trinh-chieu.html sang bai-13-trinh-chieu.html!');
} else {
  console.error('❌ Không tìm thấy file nguồn public/bai-13-trinh-chieu.html');
}

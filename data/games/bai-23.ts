import type { LessonGame, SortGame, TimelineGame, ClassifyGame } from "@/lib/types";

// 3 trò chơi ôn bài tương tác chuẩn SGK Tin học 12 (Kết nối tri thức)
const games: LessonGame[] = [
  {
    "kind": "sort",
    "id": "uu-diem-google-sites",
    "title": "Ưu điểm của Google Sites hay Hạn chế?",
    "emoji": "🌐",
    "instructions": "Đánh giá các đặc điểm của công cụ tạo web Google Sites trong SGK Tin học 12!",
    "matchLabel": "Hạn chế cần lưu ý",
    "matchEmoji": "⚠️",
    "noMatchLabel": "Ưu điểm nổi trội",
    "noMatchEmoji": "🌟",
    "items": [
      {
        "id": "gs-free",
        "emoji": "💰",
        "label": "Hoàn toàn miễn phí, đi kèm sẵn với tài khoản Google",
        "isMatch": false,
        "explain": "Ưu điểm — không mất phí mua tên miền hay máy chủ."
      },
      {
        "id": "gs-drag",
        "emoji": "🖱️",
        "label": "Kéo thả trực quan, không cần phải thuộc cú pháp mã HTML/CSS",
        "isMatch": false,
        "explain": "Ưu điểm — học sinh dễ dàng xây dựng trang web nhanh chóng."
      },
      {
        "id": "gs-code",
        "emoji": "⚙️",
        "label": "Không can thiệp sâu được vào mã nguồn để tạo hiệu ứng lập trình phức tạp",
        "isMatch": true,
        "explain": "Hạn chế — bị giới hạn trong các khối mẫu của Google."
      },
      {
        "id": "gs-drive",
        "emoji": "📁",
        "label": "Tích hợp hoàn hảo với Google Drive, Docs, Forms, YouTube",
        "isMatch": false,
        "explain": "Ưu điểm — dễ dàng chèn tài liệu và video từ hệ sinh thái Google."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "dieu-kien-dung-sites",
    "title": "Điều kiện cần để tạo web Google Sites?",
    "emoji": "🔑",
    "instructions": "Học sinh cần chuẩn bị gì để có thể bắt đầu thiết kế website với Google Sites?",
    "matchLabel": "KHÔNG bắt buộc (Không cần)",
    "matchEmoji": "❌",
    "noMatchLabel": "BẮT BUỘC phải có",
    "noMatchEmoji": "✅",
    "items": [
      {
        "id": "dk-acc",
        "emoji": "👤",
        "label": "Một tài khoản Google (Gmail) cá nhân hoặc tài khoản trường cấp",
        "isMatch": false,
        "explain": "Bắt buộc — Google Sites quản lý trang web trên Google Drive."
      },
      {
        "id": "dk-browser",
        "emoji": "🌐",
        "label": "Máy tính có kết nối Internet và trình duyệt web (Chrome, Edge...)",
        "isMatch": false,
        "explain": "Bắt buộc — Google Sites chạy trực tiếp trên nền tảng web."
      },
      {
        "id": "dk-pay",
        "emoji": "💳",
        "label": "Thẻ ngân hàng để trả phí thuê máy chủ hàng tháng",
        "isMatch": true,
        "explain": "Không cần — Google Sites miễn phí hoàn toàn."
      },
      {
        "id": "dk-soft",
        "emoji": "💿",
        "label": "Cài đặt phần mềm lập trình chuyên dụng dung lượng nặng lên máy",
        "isMatch": true,
        "explain": "Không cần — làm việc trực tuyến 100% trên trình duyệt."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "vung-soan-thao-hay-thanh-cong-cu",
    "title": "Vùng soạn thảo (Canvas) hay Bảng công cụ bên phải?",
    "emoji": "🖥️",
    "instructions": "Phân biệt giữa Vùng thiết kế chính (Canvas) và Bảng điều khiển 3 tab bên phải (Insert / Pages / Themes)!",
    "matchLabel": "Bảng điều khiển bên phải (3 Tab)",
    "matchEmoji": "🛠️",
    "noMatchLabel": "Vùng thiết kế chính (Canvas)",
    "noMatchEmoji": "🖥️",
    "items": [
      {
        "id": "vt-center",
        "emoji": "🖼️",
        "label": "Nơi hiển thị trực quan diện mạo của trang web đang làm",
        "isMatch": false,
        "explain": "Vùng chính giữa hiển thị trang web trực quan."
      },
      {
        "id": "vt-insert",
        "emoji": "📥",
        "label": "Tab 'Chèn' (Insert): Chứa các khối nội dung, chữ, ảnh, nút bấm",
        "isMatch": true,
        "explain": "Bảng bên phải gồm 3 tab: Chèn (Insert), Trang (Pages), Giao diện (Themes)."
      },
      {
        "id": "vt-pages",
        "emoji": "📑",
        "label": "Tab 'Trang' (Pages): Quản lý tạo thêm trang con và menu liên kết",
        "isMatch": true,
        "explain": "Tab Pages quản lý cấu trúc các trang."
      },
      {
        "id": "vt-banner",
        "emoji": "🏷️",
        "label": "Khu vực gõ tiêu đề trang và chọn ảnh bìa banner trực tiếp",
        "isMatch": false,
        "explain": "Thao tác trực tiếp trên vùng Canvas."
      }
    ]
  }
];

export default games;

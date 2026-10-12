import type { LessonGame, SortGame, TimelineGame, ClassifyGame } from "@/lib/types";

// 3 trò chơi ôn bài tương tác chuẩn SGK Tin học 12 (Kết nối tri thức)
const games: LessonGame[] = [
  {
    "kind": "timeline",
    "id": "bon-tang-box-model",
    "title": "4 tầng của Mô hình hộp (CSS Box Model) từ TRONG ra NGOÀI",
    "emoji": "📦",
    "instructions": "Sắp xếp 4 lớp của một phần tử hộp từ trung tâm nội dung ra đến khoảng cách lề ngoài cùng!",
    "items": [
      {
        "id": "bm-1",
        "emoji": "1️⃣",
        "label": "Content (Vùng nội dung chữ hoặc ảnh bên trong)",
        "year": "Tầng 1 (Lõi)",
        "explain": "Nội dung thực sự của phần tử nằm ở trong cùng."
      },
      {
        "id": "bm-2",
        "emoji": "2️⃣",
        "label": "Padding (Vùng đệm giữa nội dung và đường viền)",
        "year": "Tầng 2 (Đệm)",
        "explain": "Khoảng trống bao bọc nội dung trước khi chạm viền."
      },
      {
        "id": "bm-3",
        "emoji": "3️⃣",
        "label": "Border (Đường viền bao quanh phần tử)",
        "year": "Tầng 3 (Viền)",
        "explain": "Đường kẻ viền định hình ranh giới của hộp."
      },
      {
        "id": "bm-4",
        "emoji": "4️⃣",
        "label": "Margin (Lề ngoài cùng ngăn cách với phần tử khác)",
        "year": "Tầng 4 (Lề ngoài)",
        "explain": "Khoảng cách trống bên ngoài viền đẩy các phần tử khác ra xa."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "padding-hay-margin",
    "title": "Vùng đệm (Padding) hay Lề ngoài (Margin)?",
    "emoji": "📐",
    "instructions": "Phân biệt hai thuộc tính khoảng cách kinh điển: Đệm bên trong viền (Padding) hay Lề bên ngoài viền (Margin)?",
    "matchLabel": "Lề ngoài (Margin)",
    "matchEmoji": "↔️",
    "noMatchLabel": "Vùng đệm trong (Padding)",
    "noMatchEmoji": "📦",
    "items": [
      {
        "id": "pm-inner",
        "emoji": "📥",
        "label": "Nằm BÊN TRONG đường viền, có nhận màu nền của hộp",
        "isMatch": false,
        "explain": "Padding nằm trong viền và đổi màu theo màu nền hộp."
      },
      {
        "id": "pm-outer",
        "emoji": "📤",
        "label": "Nằm BÊN NGOÀI đường viền, luôn luôn trong suốt",
        "isMatch": true,
        "explain": "Margin là khoảng trống ngoài viền, không có màu nền."
      },
      {
        "id": "pm-auto",
        "emoji": "⚖️",
        "label": "margin: 0 auto: Dùng để căn giữa một khối ra giữa trang",
        "isMatch": true,
        "explain": "Kỹ thuật kinh điển căn giữa khối bằng lề auto."
      },
      {
        "id": "pm-space",
        "emoji": "🔲",
        "label": "Tạo khoảng cách cho dòng chữ không dính sát vào mép viền khung",
        "isMatch": false,
        "explain": "Tăng khoảng cách chữ với viền dùng padding."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "block-hay-inline",
    "title": "Phần tử Khối (Block) hay Phần tử Nội dòng (Inline)?",
    "emoji": "🧱",
    "instructions": "Phân loại hiển thị của phần tử: Chiếm trọn 1 dòng riêng (Block) hay Nằm chung trên 1 dòng văn bản (Inline)?",
    "matchLabel": "Phần tử Khối (Block - Chiếm nguyên dòng)",
    "matchEmoji": "🧱",
    "noMatchLabel": "Phần tử Nội dòng (Inline - Chung dòng)",
    "noMatchEmoji": "🔤",
    "items": [
      {
        "id": "bi-div",
        "emoji": "📦",
        "label": "<div>: Hộp phân chia khối luôn tự xuống dòng mới",
        "isMatch": true,
        "explain": "<div> là phần tử khối điển hình."
      },
      {
        "id": "bi-span",
        "emoji": "🏷️",
        "label": "<span>: Gom nhóm một vài từ bên trong dòng văn bản",
        "isMatch": false,
        "explain": "<span> là phần tử nội dòng."
      },
      {
        "id": "bi-h1",
        "emoji": "📢",
        "label": "<h1>: Tiêu đề luôn chiếm trọn vẹn cả chiều rộng dòng",
        "isMatch": true,
        "explain": "Các thẻ tiêu đề đều là Block."
      },
      {
        "id": "bi-a",
        "emoji": "🔗",
        "label": "<a>: Thẻ liên kết nằm tự nhiên trong câu văn",
        "isMatch": false,
        "explain": "Thẻ <a> hiển thị inline cùng dòng chữ."
      },
      {
        "id": "bi-p",
        "emoji": "📄",
        "label": "<p>: Đoạn văn bản luôn bắt đầu bằng một dòng mới",
        "isMatch": true,
        "explain": "Thẻ <p> là phần tử khối Block."
      },
      {
        "id": "bi-strong",
        "emoji": "💪",
        "label": "<strong>: In đậm vài chữ trong đoạn văn không làm xuống dòng",
        "isMatch": false,
        "explain": "<strong> là phần tử nội dòng Inline."
      }
    ]
  }
];

export default games;

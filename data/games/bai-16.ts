import type { LessonGame, SortGame, TimelineGame, ClassifyGame } from "@/lib/types";

// 3 trò chơi ôn bài tương tác chuẩn SGK Tin học 12 (Kết nối tri thức)
const games: LessonGame[] = [
  {
    "kind": "timeline",
    "id": "cac-buoc-du-an-web",
    "title": "5 bước của Dự án Xây dựng website hoàn chỉnh",
    "emoji": "🛠️",
    "instructions": "Sắp xếp đúng quy trình chuẩn của một dự án phát triển website từ ý tưởng đến hoàn thiện!",
    "items": [
      {
        "id": "da-1",
        "emoji": "1️⃣",
        "label": "Bước 1: Xác định chủ đề, mục tiêu và lập sơ đồ cây trang web",
        "year": "Khởi tạo",
        "explain": "Lên kế hoạch và cấu trúc trước khi code."
      },
      {
        "id": "da-2",
        "emoji": "2️⃣",
        "label": "Bước 2: Thu thập và chuẩn bị tư liệu nội dung, hình ảnh, văn bản",
        "year": "Chuẩn bị",
        "explain": "Chuẩn bị sẵn ảnh và bài viết vào các thư mục."
      },
      {
        "id": "da-3",
        "emoji": "3️⃣",
        "label": "Bước 3: Viết mã nguồn HTML xây dựng bộ khung và cấu trúc các trang",
        "year": "Khung HTML",
        "explain": "Dựng toàn bộ thẻ và liên kết nội dung."
      },
      {
        "id": "da-4",
        "emoji": "4️⃣",
        "label": "Bước 4: Viết mã CSS để trang trí màu sắc, phông chữ và bố cục",
        "year": "Giao diện CSS",
        "explain": "Làm đẹp trang web theo thiết kế."
      },
      {
        "id": "da-5",
        "emoji": "5️⃣",
        "label": "Bước 5: Kiểm thử liên kết, hình ảnh và khả năng hiển thị đa thiết bị",
        "year": "Kiểm thử",
        "explain": "Kiểm tra toàn diện trước khi bàn giao sản phẩm."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "vai-tro-html-va-css",
    "title": "Vai trò của HTML hay Vai trò của CSS?",
    "emoji": "⚖️",
    "instructions": "Phân biệt nhiệm vụ giữa HTML (Khung sườn, nội dung) và CSS (Trang trí, thẩm mỹ)?",
    "matchLabel": "Nhiệm vụ của CSS (Trang phục, thẩm mỹ)",
    "matchEmoji": "🎨",
    "noMatchLabel": "Nhiệm vụ của HTML (Khung xương, nội dung)",
    "noMatchEmoji": "🦴",
    "items": [
      {
        "id": "hc-text",
        "emoji": "📄",
        "label": "Xác định câu chữ tiêu đề, đoạn văn và bảng biểu",
        "isMatch": false,
        "explain": "HTML phụ trách cấu trúc và nội dung."
      },
      {
        "id": "hc-color",
        "emoji": "🌈",
        "label": "Quy định màu nền xanh và màu chữ trắng",
        "isMatch": true,
        "explain": "CSS định dạng màu sắc."
      },
      {
        "id": "hc-link",
        "emoji": "🔗",
        "label": "Tạo liên kết chuyển trang qua thẻ <a>",
        "isMatch": false,
        "explain": "HTML tạo các liên kết."
      },
      {
        "id": "hc-layout",
        "emoji": "📐",
        "label": "Chia bố cục 2 cột và khoảng cách lề giữa các hộp",
        "isMatch": true,
        "explain": "CSS phụ trách căn chỉnh bố cục layout."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "kiem-thu-du-an",
    "title": "Lỗi cần sửa hay Sản phẩm đã đạt chuẩn?",
    "emoji": "🔍",
    "instructions": "Đánh giá các tình huống trong bước kiểm thử sản phẩm website dự án!",
    "matchLabel": "Lỗi cần sửa ngay (Chưa đạt)",
    "matchEmoji": "❌",
    "noMatchLabel": "Đạt chuẩn chất lượng (Tốt)",
    "noMatchEmoji": "✅",
    "items": [
      {
        "id": "kt-broken",
        "emoji": "🚫",
        "label": "Nhấp vào liên kết 'Giới thiệu' thì bị lỗi trang 404 Không tìm thấy",
        "isMatch": true,
        "explain": "Lỗi đứt liên kết (Broken link) phải sửa đường dẫn href."
      },
      {
        "id": "kt-viet",
        "emoji": "🔤",
        "label": "Chữ tiếng Việt có dấu hiển thị chuẩn, không bị vỡ font hay ô vuông",
        "isMatch": false,
        "explain": "Đã có <meta charset='utf-8'> chuẩn."
      },
      {
        "id": "kt-anh-loi",
        "emoji": "🖼️",
        "label": "Ảnh chụp tập thể bị vỡ hình, chỉ hiện biểu tượng ảnh rách",
        "isMatch": true,
        "explain": "Lỗi sai đường dẫn tệp ảnh trong thuộc tính src."
      },
      {
        "id": "kt-mobile",
        "emoji": "📱",
        "label": "Trang web co giãn đẹp mắt khi xem trên điện thoại và máy tính",
        "isMatch": false,
        "explain": "Giao diện tương thích Responsive đạt chuẩn."
      }
    ]
  }
];

export default games;

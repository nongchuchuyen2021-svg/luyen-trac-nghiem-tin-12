import type { LessonGame, SortGame, TimelineGame, ClassifyGame } from "@/lib/types";

// 3 trò chơi ôn bài tương tác chuẩn SGK Tin học 12 (Kết nối tri thức)
const games: LessonGame[] = [
  {
    "kind": "sort",
    "id": "banner-hay-footer",
    "title": "Biểu ngữ (Banner) hay Chân trang (Footer)?",
    "emoji": "🏷️",
    "instructions": "Phân biệt hai thành phần cố định trên trang web: Đầu trang (Banner) hay Chân trang (Footer)?",
    "matchLabel": "Chân trang (Footer)",
    "matchEmoji": "🔻",
    "noMatchLabel": "Biểu ngữ đầu trang (Banner / Header)",
    "noMatchEmoji": "🔺",
    "items": [
      {
        "id": "bf-top",
        "emoji": "👑",
        "label": "Nằm ở trên cùng, chứa tên trang web và hình ảnh bìa nổi bật",
        "isMatch": false,
        "explain": "Banner nằm trên đỉnh trang web tạo ấn tượng đầu tiên."
      },
      {
        "id": "bf-bot",
        "emoji": "📍",
        "label": "Nằm ở đáy trang, chứa thông tin bản quyền, địa chỉ liên hệ trường học",
        "isMatch": true,
        "explain": "Footer đặt ở cuối cùng của trang."
      },
      {
        "id": "bf-logo",
        "emoji": "🏫",
        "label": "Khu vực đặt biểu trưng Logo và Favicon nhận diện của trường",
        "isMatch": false,
        "explain": "Logo nằm ở góc trên bên trái của thanh biểu ngữ."
      },
      {
        "id": "bf-copy",
        "emoji": "©️",
        "label": "Dòng chữ: 'Bản quyền © 2026 Trường THPT Na Rì - Thái Nguyên'",
        "isMatch": true,
        "explain": "Thông tin bản quyền luôn đặt ở chân trang Footer."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "content-blocks-hay-thu-cong",
    "title": "Dùng Khối nội dung mẫu (Content Blocks) hay Kéo thả thủ công?",
    "emoji": "🧱",
    "instructions": "Đánh giá lợi ích của tính năng 'Khối nội dung' (Content blocks) trong Google Sites!",
    "matchLabel": "Lợi ích của Khối mẫu (Content Blocks)",
    "matchEmoji": "✨",
    "noMatchLabel": "Thao tác thủ công từng chữ",
    "noMatchEmoji": "✍️",
    "items": [
      {
        "id": "cb-layout",
        "emoji": "📐",
        "label": "Tự động căn chỉnh ảnh và cột chữ cân đối, không bị lệch hàng",
        "isMatch": true,
        "explain": "Khối mẫu định sẵn tỷ lệ ảnh và chữ khoa học."
      },
      {
        "id": "cb-speed",
        "emoji": "⚡",
        "label": "Chỉ một cú nhấp chuột là tạo xong bố cục 3 cột giới thiệu tin tức",
        "isMatch": true,
        "explain": "Tiết kiệm thời gian thiết kế tối đa."
      },
      {
        "id": "cb-slow",
        "emoji": "⏳",
        "label": "Phải tự kéo từng hộp văn bản rồi tự co kéo kích thước cho bằng nhau",
        "isMatch": false,
        "explain": "Cách làm thủ công tốn thời gian và dễ lệch hàng."
      },
      {
        "id": "cb-responsive",
        "emoji": "📱",
        "label": "Tự động co giãn tối ưu khi xem trên màn hình điện thoại di động",
        "isMatch": true,
        "explain": "Khối mẫu của Google được lập trình tương thích đa màn hình."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "theme-hay-layout",
    "title": "Giao diện chủ đề (Themes) hay Bố cục trang (Layout)?",
    "emoji": "🎨",
    "instructions": "Phân biệt giữa Tab Giao diện (Themes - đổi màu/font toàn bộ trang) và Bố cục (Layout - vị trí khối)?",
    "matchLabel": "Tab Giao diện (Themes)",
    "matchEmoji": "🎨",
    "noMatchLabel": "Bố cục sắp xếp (Layout)",
    "noMatchEmoji": "📐",
    "items": [
      {
        "id": "tl-color",
        "emoji": "🌈",
        "label": "Chọn bảng màu đồng bộ cho toàn bộ các thanh tiêu đề và nút bấm",
        "isMatch": true,
        "explain": "Theme đổi màu sắc thống nhất cho toàn website."
      },
      {
        "id": "tl-font",
        "emoji": "🔤",
        "label": "Đổi kiểu phông chữ: Cổ điển, Hiện đại, Táo bạo trên cả website",
        "isMatch": true,
        "explain": "Theme kiểm soát font chữ toàn cục."
      },
      {
        "id": "tl-pos",
        "emoji": "↔️",
        "label": "Kéo một bức ảnh sang bên phải và đẩy đoạn văn sang bên trái",
        "isMatch": false,
        "explain": "Thao tác chỉnh bố cục layout."
      },
      {
        "id": "tl-theme",
        "emoji": "✨",
        "label": "Chọn mẫu giao diện có sẵn như: Aristotle, Diplomat, Vision",
        "isMatch": true,
        "explain": "Các theme tích hợp sẵn của Google Sites."
      }
    ]
  }
];

export default games;

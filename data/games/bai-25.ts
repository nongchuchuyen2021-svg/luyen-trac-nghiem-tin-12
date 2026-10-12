import type { LessonGame, SortGame, TimelineGame, ClassifyGame } from "@/lib/types";

// 3 trò chơi ôn bài tương tác chuẩn SGK Tin học 12 (Kết nối tri thức)
const games: LessonGame[] = [
  {
    "kind": "classify",
    "id": "nguon-tep-da-phuong-tien",
    "title": "Nguồn tệp nhúng vào website Google Sites",
    "emoji": "📥",
    "instructions": "Xếp các loại tệp nhúng vào đúng dịch vụ lưu trữ tương ứng trong hệ sinh thái Google!",
    "categories": [
      {
        "id": "drive",
        "emoji": "📁",
        "name": "Google Drive",
        "subtitle": "Tài liệu Docs, Bảng tính Sheets, Trình chiếu Slides"
      },
      {
        "id": "youtube",
        "emoji": "▶️",
        "name": "YouTube",
        "subtitle": "Video clip âm thanh và hình ảnh chuyển động"
      },
      {
        "id": "maps",
        "emoji": "🗺️",
        "name": "Google Maps",
        "subtitle": "Bản đồ số định vị tọa độ và dẫn đường"
      }
    ],
    "items": [
      {
        "id": "np-doc",
        "label": "Nhúng file Word nội quy trường học để học sinh xem trực tiếp",
        "categoryId": "drive",
        "explain": "File tài liệu lưu trên Google Drive."
      },
      {
        "id": "np-yt",
        "label": "Video clip giới thiệu các hoạt động ngày hội Đoàn trường",
        "categoryId": "youtube",
        "explain": "Video nhúng trực tiếp từ YouTube mượt mà không tốn dung lượng web."
      },
      {
        "id": "np-map",
        "label": "Bản đồ tương tác chỉ đường tới trường THPT Na Rì",
        "categoryId": "maps",
        "explain": "Bản đồ vệ tinh/giao thông dùng Google Maps."
      },
      {
        "id": "np-slide",
        "label": "Bài giảng trình chiếu PowerPoint/Google Slides cho học sinh tự học",
        "categoryId": "drive",
        "explain": "Slide nhúng từ Google Drive."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "quyen-chia-se-drive",
    "title": "Quyền 'Bất kì ai có liên kết' hay 'Hạn chế' khi nhúng tệp?",
    "emoji": "🔐",
    "instructions": "Để người khác vào website xem được tài liệu nhúng từ Google Drive: Cần đặt quyền chia sẻ nào?",
    "matchLabel": "Hạn chế (Chỉ người được mời)",
    "matchEmoji": "🔒",
    "noMatchLabel": "Bất kì ai có liên kết (Công khai xem)",
    "noMatchEmoji": "🌍",
    "items": [
      {
        "id": "qc-public",
        "emoji": "✅",
        "label": "Mọi học sinh truy cập website đều mở xem và tải được tài liệu",
        "isMatch": false,
        "explain": "Cần đặt quyền 'Bất kì ai có đường liên kết' ở chế độ Người xem."
      },
      {
        "id": "qc-lock",
        "emoji": "🚫",
        "label": "Người ngoài vào xem trang web bị hiện bảng thông báo 'Yêu cầu quyền truy cập'",
        "isMatch": true,
        "explain": "Lỗi kinh điển do quên chia sẻ công khai tệp trên Drive."
      },
      {
        "id": "qc-view",
        "emoji": "👁️",
        "label": "Quyền Người xem (Viewer): Chỉ cho xem, không cho sửa tệp gốc",
        "isMatch": false,
        "explain": "Mức quyền an toàn nhất khi nhúng tài liệu công cộng."
      },
      {
        "id": "qc-edit",
        "emoji": "⚠️",
        "label": "Cấp quyền Người chỉnh sửa (Editor) cho người lạ tùy tiện sửa tệp",
        "isMatch": true,
        "explain": "Rủi ro bị người lạ phá hoại hoặc sửa nội dung tài liệu gốc."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "nhung-link-hay-iframe",
    "title": "Nhúng bằng Đường dẫn URL hay Mã nhúng HTML Embed?",
    "emoji": "🔗",
    "instructions": "Phân biệt hai cách nhúng nội dung bên ngoài vào Google Sites: Nhập link URL hay Dán mã nhúng <iframe>?",
    "matchLabel": "Dán mã nhúng HTML (<iframe embed>)",
    "matchEmoji": "💻",
    "noMatchLabel": "Nhập đường dẫn trực tiếp (URL)",
    "noMatchEmoji": "🔗",
    "items": [
      {
        "id": "ni-url",
        "emoji": "🌐",
        "label": "Dán đường link: https://www.youtube.com/watch?v=abcxyz",
        "isMatch": false,
        "explain": "Chỉ cần dán link URL trực tiếp là Google Sites tự nhận diện video."
      },
      {
        "id": "ni-code",
        "emoji": "🏷️",
        "label": "Dán đoạn mã: <iframe src='...' width='600' height='400'></iframe>",
        "isMatch": true,
        "explain": "Tính năng 'Nhúng mã' (Embed code) cho phép chèn mã HTML tùy biến."
      },
      {
        "id": "ni-web",
        "emoji": "📍",
        "label": "Nhập địa chỉ web của trang báo giáo dục cần trích dẫn",
        "isMatch": false,
        "explain": "Nhúng bằng URL."
      },
      {
        "id": "ni-widget",
        "emoji": "🌦️",
        "label": "Mã tiện ích dự báo thời tiết hoặc đồng hồ đếm ngược từ bên thứ ba",
        "isMatch": true,
        "explain": "Tiện ích ngoài thường cấp một đoạn mã nhúng iframe."
      }
    ]
  }
];

export default games;

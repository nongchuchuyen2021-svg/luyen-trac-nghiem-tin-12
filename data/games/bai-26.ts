import type { LessonGame, SortGame, TimelineGame, ClassifyGame } from "@/lib/types";

// 3 trò chơi ôn bài tương tác chuẩn SGK Tin học 12 (Kết nối tri thức)
const games: LessonGame[] = [
  {
    "kind": "sort",
    "id": "trang-chu-hay-trang-con",
    "title": "Trang chủ (Home) hay Trang con (Subpage)?",
    "emoji": "📑",
    "instructions": "Phân loại vị trí phân cấp các trang trong cấu trúc website trường học!",
    "matchLabel": "Trang con (Subpage / Cấp 2)",
    "matchEmoji": "📂",
    "noMatchLabel": "Trang chủ (Trang gốc / Cấp 1)",
    "noMatchEmoji": "🏠",
    "items": [
      {
        "id": "tc-home",
        "emoji": "🏠",
        "label": "Trang đầu tiên mở ra khi người dùng truy cập địa chỉ website",
        "isMatch": false,
        "explain": "Trang chủ là trang mặt tiền chính của website."
      },
      {
        "id": "tc-sub1",
        "emoji": "📄",
        "label": "Trang 'Câu lạc bộ Tin học' nằm lồng bên trong trang 'Đoàn trường'",
        "isMatch": true,
        "explain": "Trang con cấp 2 nằm dưới mục cha."
      },
      {
        "id": "tc-root",
        "emoji": "👑",
        "label": "Biểu tượng ngôi nhà trên menu điều hướng chính",
        "isMatch": false,
        "explain": "Trang chủ thường có biểu tượng Home."
      },
      {
        "id": "tc-sub2",
        "emoji": "📝",
        "label": "Trang 'Kỷ yếu lớp 12A1' nằm bên trong chuyên mục 'Khối 12'",
        "isMatch": true,
        "explain": "Trang phân cấp chi tiết."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "top-nav-hay-side-nav",
    "title": "Menu trên đỉnh (Top nav) hay Menu bên hông (Side nav)?",
    "emoji": "🧭",
    "instructions": "Phân biệt hai kiểu bố cục thanh điều hướng Menu trên Google Sites!",
    "matchLabel": "Thanh bên hông (Side Navigation)",
    "matchEmoji": "📑",
    "noMatchLabel": "Thanh trên đỉnh (Top Navigation)",
    "noMatchEmoji": "🔝",
    "items": [
      {
        "id": "ts-top",
        "emoji": "🔝",
        "label": "Các nút chuyển trang nằm trải dài thành hàng ngang trên đầu website",
        "isMatch": false,
        "explain": "Top navigation phù hợp khi website có ít trang (dưới 5 trang)."
      },
      {
        "id": "ts-side",
        "emoji": "📑",
        "label": "Menu dạng nút 3 gạch mở ra bảng trượt dọc bên trái màn hình",
        "isMatch": true,
        "explain": "Side navigation phù hợp khi website có nhiều trang và nhiều cấp con."
      },
      {
        "id": "ts-few",
        "emoji": "👀",
        "label": "Người xem nhìn thấy ngay toàn bộ các mục mà không cần bấm thêm",
        "isMatch": false,
        "explain": "Ưu điểm của menu ngang trên đỉnh."
      },
      {
        "id": "ts-tree",
        "emoji": "🌳",
        "label": "Hiển thị cây phân cấp đa tầng gọn gàng không sợ tràn màn hình ngang",
        "isMatch": true,
        "explain": "Ưu điểm của menu thanh bên."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "lien-ket-noi-hay-ngoai-sites",
    "title": "Chuyển trang nội bộ hay Thoát ra ngoài website?",
    "emoji": "🔗",
    "instructions": "Đánh giá hướng điều hướng của các nút bấm trên website!",
    "matchLabel": "Thoát ra ngoài Internet",
    "matchEmoji": "🌐",
    "noMatchLabel": "Chuyển trang nội bộ trong web",
    "noMatchEmoji": "🏠",
    "items": [
      {
        "id": "ln-intro",
        "emoji": "📄",
        "label": "Nút bấm 'Xem giới thiệu' nhảy sang trang gioithieu trên cùng site",
        "isMatch": false,
        "explain": "Điều hướng nội bộ giữ chân người dùng trong trang."
      },
      {
        "id": "ln-moet",
        "emoji": "🏛️",
        "label": "Nút liên kết dẫn sang Cổng thông tin Bộ Giáo dục và Đào tạo",
        "isMatch": true,
        "explain": "Liên kết ngoài dẫn sang website cơ quan cấp trên."
      },
      {
        "id": "ln-contact",
        "emoji": "📞",
        "label": "Bấm vào menu 'Liên hệ' nhảy sang trang form liên hệ của trường",
        "isMatch": false,
        "explain": "Trang con nội bộ."
      },
      {
        "id": "ln-fb",
        "emoji": "👥",
        "label": "Bấm vào biểu tượng Facebook chuyển sang ứng dụng mạng xã hội",
        "isMatch": true,
        "explain": "Liên kết ra nền tảng mạng ngoài."
      }
    ]
  }
];

export default games;

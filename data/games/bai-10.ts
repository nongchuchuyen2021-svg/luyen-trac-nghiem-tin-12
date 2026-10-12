import type { LessonGame, SortGame, TimelineGame, ClassifyGame } from "@/lib/types";

// 3 trò chơi ôn bài tương tác chuẩn SGK Tin học 12 (Kết nối tri thức)
const games: LessonGame[] = [
  {
    "kind": "sort",
    "id": "lien-ket-noi-bo-hay-ngoai",
    "title": "Liên kết nội bộ hay Liên kết ngoài?",
    "emoji": "🔗",
    "instructions": "Kéo từng liên kết sang đúng nhóm: Liên kết nội bộ (trong cùng website) hay Liên kết ngoài Internet (trang khác)?",
    "matchLabel": "Liên kết ngoài (External)",
    "matchEmoji": "🌐",
    "noMatchLabel": "Liên kết nội bộ (Internal)",
    "noMatchEmoji": "🏠",
    "items": [
      {
        "id": "lk-about",
        "emoji": "📄",
        "label": "href=\"gioithieu.html\": Chuyển sang trang giới thiệu cùng thư mục",
        "isMatch": false,
        "explain": "Liên kết nội bộ giữa các trang trong cùng website."
      },
      {
        "id": "lk-google",
        "emoji": "🔍",
        "label": "href=\"https://google.com\": Dẫn tới trang tìm kiếm Google",
        "isMatch": true,
        "explain": "Liên kết ra ngoài website khác trên Internet."
      },
      {
        "id": "lk-anchor",
        "emoji": "⚓",
        "label": "href=\"#muc-2\": Nhảy tới mục 2 trên cùng trang hiện tại",
        "isMatch": false,
        "explain": "Liên kết neo nội bộ (Bookmark/Anchor link)."
      },
      {
        "id": "lk-youtube",
        "emoji": "▶️",
        "label": "href=\"https://youtube.com\": Mở xem video trên trang YouTube",
        "isMatch": true,
        "explain": "Liên kết ngoài dẫn sang nền tảng khác."
      },
      {
        "id": "lk-contact",
        "emoji": "📞",
        "label": "href=\"lienhe.html\": Mở trang thông tin liên hệ của trường",
        "isMatch": false,
        "explain": "Liên kết nội bộ trong website."
      },
      {
        "id": "lk-facebook",
        "emoji": "👥",
        "label": "href=\"https://facebook.com\": Mở trang Fanpage trường",
        "isMatch": true,
        "explain": "Liên kết ngoài sang mạng xã hội."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "href-hay-target",
    "title": "Thuộc tính href hay target?",
    "emoji": "🎯",
    "instructions": "Phân biệt hai thuộc tính quan trọng của thẻ liên kết <a>: Địa chỉ đích (href) hay Cách thức mở trang (target)?",
    "matchLabel": "Cách thức mở trang (target)",
    "matchEmoji": "🪟",
    "noMatchLabel": "Địa chỉ đích (href)",
    "noMatchEmoji": "📍",
    "items": [
      {
        "id": "ht-url",
        "emoji": "🌐",
        "label": "href=\"trangchu.html\": Chỉ định trang web sẽ được mở ra",
        "isMatch": false,
        "explain": "href là viết tắt của Hypertext Reference — chỉ đường dẫn."
      },
      {
        "id": "ht-blank",
        "emoji": "✨",
        "label": "target=\"_blank\": Mở trang web liên kết trong một TAB MỚI",
        "isMatch": true,
        "explain": "target='_blank' giúp mở liên kết trong tab riêng biệt."
      },
      {
        "id": "ht-mail",
        "emoji": "✉️",
        "label": "href=\"mailto:thaygiao@gmail.com\": Bật ứng dụng gửi thư",
        "isMatch": false,
        "explain": "href chỉ định giao thức gửi thư mailto."
      },
      {
        "id": "ht-self",
        "emoji": "🔄",
        "label": "target=\"_self\": Mở ngay trong tab hiện tại (mặc định)",
        "isMatch": true,
        "explain": "target='_self' mở đè lên trang đang xem."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "duong-dan-tuong-doi-tuyet-doi",
    "title": "Đường dẫn tương đối hay Tuyệt đối?",
    "emoji": "🗺️",
    "instructions": "Kéo từng đường dẫn sang đúng loại: Đường dẫn tương đối (Relative) hay Đường dẫn tuyệt đối (Absolute)?",
    "matchLabel": "Đường dẫn tuyệt đối",
    "matchEmoji": "🌐",
    "noMatchLabel": "Đường dẫn tương đối",
    "noMatchEmoji": "📁",
    "items": [
      {
        "id": "dd-http",
        "emoji": "🌐",
        "label": "https://dantri.com.vn/giao-duc.htm (Có đầy đủ giao thức và tên miền)",
        "isMatch": true,
        "explain": "Đường dẫn tuyệt đối luôn có http/https và tên miền."
      },
      {
        "id": "dd-same",
        "emoji": "📄",
        "label": "tintuc.html (Tệp nằm cùng thư mục với trang đang đứng)",
        "isMatch": false,
        "explain": "Đường dẫn tương đối tính từ vị trí tệp hiện tại."
      },
      {
        "id": "dd-sub",
        "emoji": "📂",
        "label": "images/anh1.jpg (Tệp nằm trong thư mục con images)",
        "isMatch": false,
        "explain": "Đường dẫn tương đối chỉ đường vào thư mục con."
      },
      {
        "id": "dd-full",
        "emoji": "🔗",
        "label": "https://thptnari.edu.vn/logo.png",
        "isMatch": true,
        "explain": "Đường dẫn tuyệt đối chỉ đích xác địa chỉ trên Internet."
      }
    ]
  }
];

export default games;

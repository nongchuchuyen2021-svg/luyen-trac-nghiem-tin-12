import type { LessonGame, SortGame, TimelineGame, ClassifyGame } from "@/lib/types";

// 3 trò chơi ôn bài tương tác chuẩn SGK Tin học 12 (Kết nối tri thức)
const games: LessonGame[] = [
  {
    "kind": "sort",
    "id": "co-day-hay-khong-day",
    "title": "Kết nối có dây hay Kết nối không dây?",
    "emoji": "🔌",
    "instructions": "Phân loại các chuẩn kết nối giữa các thiết bị số: Dùng dây cáp vật lý hay Dùng sóng không dây?",
    "matchLabel": "Kết nối không dây (Wireless)",
    "matchEmoji": "📶",
    "noMatchLabel": "Kết nối có dây (Wired)",
    "noMatchEmoji": "🔌",
    "items": [
      {
        "id": "ck-hdmi",
        "emoji": "📺",
        "label": "Cáp HDMI: Truyền hình ảnh và âm thanh chất lượng cao lên tivi",
        "isMatch": false,
        "explain": "Kết nối có dây truyền tín hiệu ổn định cao."
      },
      {
        "id": "ck-blue",
        "emoji": "🎧",
        "label": "Bluetooth: Kết nối tai nghe không dây với điện thoại trong phạm vi 10m",
        "isMatch": true,
        "explain": "Sóng vô tuyến cự ly ngắn không dây."
      },
      {
        "id": "ck-typec",
        "emoji": "📱",
        "label": "Cáp USB Type-C: Sạc pin và truyền tệp tốc độ cao giữa máy tính và điện thoại",
        "isMatch": false,
        "explain": "Chuẩn cắm cáp vật lý đa năng."
      },
      {
        "id": "ck-wifi",
        "emoji": "🌐",
        "label": "Wi-Fi: Kết nối máy tính bảng vào mạng Internet qua sóng vô tuyến",
        "isMatch": true,
        "explain": "Mạng cục bộ không dây."
      },
      {
        "id": "ck-nfc",
        "emoji": "💳",
        "label": "NFC: Chạm điện thoại thanh toán một chạm tại quầy siêu thị",
        "isMatch": true,
        "explain": "Giao tiếp trường gần không dây dưới 10cm."
      },
      {
        "id": "ck-lan",
        "emoji": "🧵",
        "label": "Cáp mạng RJ45: Nối máy tính để bàn vào switch văn phòng",
        "isMatch": false,
        "explain": "Cáp mạng xoắn đôi có dây."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "cong-hdmi-hay-usb",
    "title": "Cổng HDMI hay Cổng USB?",
    "emoji": "📺",
    "instructions": "Phân biệt công năng chính: Cổng truyền hình ảnh/âm thanh màn hình (HDMI) hay Cổng truyền dữ liệu/ngoại vi (USB)?",
    "matchLabel": "Cổng HDMI",
    "matchEmoji": "📺",
    "noMatchLabel": "Cổng USB",
    "noMatchEmoji": "🔌",
    "items": [
      {
        "id": "hu-proj",
        "emoji": "📽️",
        "label": "Xuất hình ảnh bài thuyết trình từ laptop lên máy chiếu của lớp",
        "isMatch": true,
        "explain": "HDMI là cổng chuẩn xuất tín hiệu video/audio ra màn hình chiếu."
      },
      {
        "id": "hu-mouse",
        "emoji": "🖱️",
        "label": "Cắm chuột, bàn phím và USB flash drive vào máy tính",
        "isMatch": false,
        "explain": "USB kết nối thiết bị ngoại vi và truyền dữ liệu."
      },
      {
        "id": "hu-tv",
        "emoji": "📺",
        "label": "Cắm cáp nối tivi thông minh phòng khách để xem phim 4K sắc nét",
        "isMatch": true,
        "explain": "HDMI truyền tải độ phân giải cao kèm âm thanh vòm."
      },
      {
        "id": "hu-charge",
        "emoji": "🔋",
        "label": "Cắm dây sạc pin và sao chép ảnh từ smartphone sang máy tính",
        "isMatch": false,
        "explain": "Cổng USB hỗ trợ cấp nguồn và truyền file."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "bluetooth-hay-wifi",
    "title": "Sóng Bluetooth hay Sóng Wi-Fi?",
    "emoji": "📶",
    "instructions": "Phân biệt hai công nghệ không dây quen thuộc trên điện thoại thông minh: Bluetooth hay Wi-Fi?",
    "matchLabel": "Sóng Wi-Fi",
    "matchEmoji": "🌐",
    "noMatchLabel": "Sóng Bluetooth",
    "noMatchEmoji": "🔵",
    "items": [
      {
        "id": "bw-short",
        "emoji": "🎧",
        "label": "Phạm vi ngắn khoảng dưới 10m, tiêu tốn rất ít năng lượng pin",
        "isMatch": false,
        "explain": "Bluetooth tối ưu cho thiết bị ngoại vi tiết kiệm pin."
      },
      {
        "id": "bw-net",
        "emoji": "🚀",
        "label": "Băng thông rộng tốc độ cao, dùng để lướt web và xem video trực tuyến",
        "isMatch": true,
        "explain": "Wi-Fi cung cấp tốc độ mạng cao cho nhiều thiết bị."
      },
      {
        "id": "bw-peer",
        "emoji": "⌚",
        "label": "Ghép đôi 1-1 trực tiếp giữa đồng hồ thông minh và điện thoại",
        "isMatch": false,
        "explain": "Bluetooth chuyên kết nối cặp thiết bị cá nhân."
      },
      {
        "id": "bw-wap",
        "emoji": "📶",
        "label": "Kết nối thông qua bộ định tuyến không dây Access Point trong nhà",
        "isMatch": true,
        "explain": "Wi-Fi cần điểm truy cập WAP/Router."
      }
    ]
  }
];

export default games;

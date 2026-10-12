import type { LessonGame, SortGame, TimelineGame, ClassifyGame } from "@/lib/types";

// 3 trò chơi ôn bài tương tác chuẩn SGK Tin học 12 (Kết nối tri thức)
const games: LessonGame[] = [
  {
    "kind": "timeline",
    "id": "cac-buoc-ghep-doi-bluetooth",
    "title": "Các bước ghép đôi Bluetooth giữa hai thiết bị số",
    "emoji": "🔵",
    "instructions": "Sắp xếp đúng trình tự các bước ghép đôi Bluetooth (Pairing) an toàn giữa điện thoại và máy tính!",
    "items": [
      {
        "id": "bt-1",
        "emoji": "1️⃣",
        "label": "Bật kết nối Bluetooth và chế độ Cho phép tìm kiếm trên cả hai thiết bị",
        "year": "Bước 1",
        "explain": "Cần bật Bluetooth và cho phép quét thấy danh tính."
      },
      {
        "id": "bt-2",
        "emoji": "2️⃣",
        "label": "Trên điện thoại, nhấn quét tìm và chọn đúng tên của thiết bị cần ghép",
        "year": "Bước 2",
        "explain": "Chọn đúng tên thiết bị mục tiêu trong danh sách quét được."
      },
      {
        "id": "bt-3",
        "emoji": "3️⃣",
        "label": "Kiểm tra và xác nhận mã số PIN/Passkey trùng khớp trên cả hai màn hình",
        "year": "Bước 3",
        "explain": "Đối chiếu mã PIN để chống kết nối nhầm máy người lạ."
      },
      {
        "id": "bt-4",
        "emoji": "4️⃣",
        "label": "Nhấn 'Ghép đôi' (Pair) và bắt đầu gửi nhận tệp dữ liệu",
        "year": "Bước 4",
        "explain": "Hoàn tất ghép đôi và truyền tệp an toàn."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "che-do-usb-mtp-hay-sac",
    "title": "Chế độ Truyền tệp (MTP) hay Chỉ sạc pin qua USB?",
    "emoji": "🔌",
    "instructions": "Khi cắm cáp USB nối điện thoại vào máy tính: Chọn chế độ Truyền tệp (MTP) hay Chỉ sạc pin (Charging only)?",
    "matchLabel": "Chế độ Truyền tệp (MTP / File Transfer)",
    "matchEmoji": "📁",
    "noMatchLabel": "Chỉ sạc pin (No data transfer)",
    "noMatchEmoji": "⚡",
    "items": [
      {
        "id": "mtp-copy",
        "emoji": "💻",
        "label": "Máy tính nhận diện được bộ nhớ trong của điện thoại để sao chép ảnh",
        "isMatch": true,
        "explain": "Chế độ MTP mở cổng truyền file hai chiều."
      },
      {
        "id": "mtp-safe",
        "emoji": "🛡️",
        "label": "Cắm nhờ dây sạc tại các trụ sạc công cộng ở sân bay để tránh bị cài mã độc",
        "isMatch": false,
        "explain": "Nên chọn Chỉ sạc pin ở nơi công cộng để chống đánh cắp dữ liệu."
      },
      {
        "id": "mtp-music",
        "emoji": "🎵",
        "label": "Chép danh sách bài hát từ máy tính sang thư mục Music trên điện thoại",
        "isMatch": true,
        "explain": "Cần quyền đọc ghi tệp của chế độ MTP."
      },
      {
        "id": "mtp-power",
        "emoji": "🔋",
        "label": "Điện thoại chỉ nạp năng lượng cho pin mà máy tính không xem được ảnh",
        "isMatch": false,
        "explain": "Chế độ Chỉ sạc pin khóa toàn bộ luồng truyền tệp."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "quick-share-hay-cloud",
    "title": "Chia sẻ trực tiếp gần (Quick Share) hay Qua Đám mây (Drive)?",
    "emoji": "📲",
    "instructions": "Phân biệt phương thức chia sẻ tệp không dây: Quick Share / AirDrop (gần nhau) hay Đám mây Google Drive (qua Internet)?",
    "matchLabel": "Qua Đám mây (Google Drive / Internet)",
    "matchEmoji": "☁️",
    "noMatchLabel": "Quick Share / AirDrop (Trực tiếp ở gần)",
    "noMatchEmoji": "⚡",
    "items": [
      {
        "id": "qs-direct",
        "emoji": "📶",
        "label": "Bắn tệp ảnh tốc độ cực cao cho bạn ngồi cùng bàn mà không tốn dung lượng 4G",
        "isMatch": false,
        "explain": "Quick Share dùng kết hợp Bluetooth và Wi-Fi Direct truyền ngang hàng."
      },
      {
        "id": "qs-far",
        "emoji": "🌏",
        "label": "Gửi tài liệu bài tập cho bạn đang ở tỉnh khác cách xa hàng trăm km",
        "isMatch": true,
        "explain": "Khoảng cách xa bắt buộc tải lên đám mây qua mạng Internet."
      },
      {
        "id": "qs-offline",
        "emoji": "🏖️",
        "label": "Chia sẻ ảnh đi dã ngoại ở vùng núi cao không có sóng điện thoại hay Internet",
        "isMatch": false,
        "explain": "Quick Share truyền trực tiếp thiết bị với thiết bị không cần mạng ngoài."
      },
      {
        "id": "qs-link",
        "emoji": "🔗",
        "label": "Tạo đường link để cả lớp 40 bạn cùng tải tài liệu ôn thi về máy",
        "isMatch": true,
        "explain": "Chia sẻ cho nhiều người qua liên kết đám mây là tối ưu nhất."
      }
    ]
  }
];

export default games;

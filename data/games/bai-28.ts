import type { LessonGame, SortGame, TimelineGame, ClassifyGame } from "@/lib/types";

// 3 trò chơi ôn bài tương tác chuẩn SGK Tin học 12 (Kết nối tri thức)
const games: LessonGame[] = [
  {
    "kind": "timeline",
    "id": "quy-trinh-5-buoc-hoan-thien-web",
    "title": "Quy trình 5 bước xây dựng và hoàn thiện website Google Sites",
    "emoji": "🛠️",
    "instructions": "Sắp xếp theo đúng trình tự khoa học 5 bước hoàn thiện website dự án môn Tin học 12!",
    "items": [
      {
        "id": "q5-1",
        "emoji": "1️⃣",
        "label": "Bước 1: Chọn chủ đề và Lập dàn ý cấu trúc cây các trang web",
        "year": "Bước 1",
        "explain": "Xác định rõ đề tài và các trang cần tạo."
      },
      {
        "id": "q5-2",
        "emoji": "2️⃣",
        "label": "Bước 2: Thu thập và Chuẩn bị tư liệu văn bản, ảnh, video, form",
        "year": "Bước 2",
        "explain": "Chuẩn bị sẵn nội dung vào thư mục Google Drive."
      },
      {
        "id": "q5-3",
        "emoji": "3️⃣",
        "label": "Bước 3: Xây dựng và Thiết kế website trên Google Sites",
        "year": "Bước 3",
        "explain": "Dùng các khối nội dung, theme và điều hướng để tạo trang."
      },
      {
        "id": "q5-4",
        "emoji": "4️⃣",
        "label": "Bước 4: Xem trước (Preview) kiểm thử giao diện và đường link",
        "year": "Bước 4",
        "explain": "Kiểm tra trên màn hình máy tính, máy tính bảng và điện thoại."
      },
      {
        "id": "q5-5",
        "emoji": "5️⃣",
        "label": "Bước 5: Công bố (Publish) và Chia sẻ website lên Internet",
        "year": "Bước 5",
        "explain": "Xuất bản website để người khác có thể truy cập trực tuyến."
      }
    ]
  },
  {
    "kind": "classify",
    "id": "ba-che-do-xem-truoc-preview",
    "title": "3 chế độ màn hình khi Xem trước (Preview) trên Google Sites",
    "emoji": "📱",
    "instructions": "Xếp các đặc điểm kiểm thử vào đúng chế độ màn hình xem trước!",
    "categories": [
      {
        "id": "pc",
        "emoji": "💻",
        "name": "Màn hình lớn (Máy tính bàn/Laptop)",
        "subtitle": "Độ phân giải rộng, menu ngang đầy đủ"
      },
      {
        "id": "tablet",
        "emoji": "📟",
        "name": "Máy tính bảng (Tablet)",
        "subtitle": "Màn hình trung bình dọc hoặc ngang"
      },
      {
        "id": "phone",
        "emoji": "📱",
        "name": "Điện thoại thông minh (Phone)",
        "subtitle": "Màn hình dọc hẹp, menu chuyển sang 3 gạch"
      }
    ],
    "items": [
      {
        "id": "pv-pc",
        "label": "Kiểm tra giao diện chuẩn cho thầy cô và học sinh ngồi phòng máy tính",
        "categoryId": "pc",
        "explain": "Chế độ màn hình lớn Large screen."
      },
      {
        "id": "pv-phone",
        "label": "Kiểm tra xem menu có tự co thành nút 3 gạch và ảnh có bị tràn mép không",
        "categoryId": "phone",
        "explain": "Chế độ xem trước trên điện thoại Phone view."
      },
      {
        "id": "pv-tab",
        "label": "Kiểm tra bố cục 2 cột hiển thị vừa vặn trên màn hình iPad/Tablet",
        "categoryId": "tablet",
        "explain": "Chế độ xem trước trên máy tính bảng Tablet view."
      },
      {
        "id": "pv-tap",
        "label": "Đảm bảo các nút bấm đủ to để học sinh dễ chạm ngón tay trên điện thoại",
        "categoryId": "phone",
        "explain": "Tối ưu tương tác cảm ứng cho điện thoại."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "cong-bo-va-chinh-sua",
    "title": "Bản nháp cá nhân hay Trang web đã công bố (Published)?",
    "emoji": "🚀",
    "instructions": "Phân biệt giữa Bản thiết kế nháp và Website đã xuất bản trực tuyến trên Google Sites!",
    "matchLabel": "Đã xuất bản (Published - Mọi người xem được)",
    "matchEmoji": "🌍",
    "noMatchLabel": "Bản nháp (Draft - Chỉ người tạo xem được)",
    "noMatchEmoji": "🔒",
    "items": [
      {
        "id": "cp-edit",
        "emoji": "✍️",
        "label": "Vừa sửa xong bài viết trên trang web nhưng chưa bấm nút 'Công bố'",
        "isMatch": false,
        "explain": "Khi chưa bấm Công bố, thay đổi mới chỉ lưu ở dạng bản nháp."
      },
      {
        "id": "cp-link",
        "emoji": "🔗",
        "label": "Có địa chỉ web: https://sites.google.com/view/ten-trang để gửi cho thầy cô",
        "isMatch": true,
        "explain": "Địa chỉ công khai sau khi xuất bản."
      },
      {
        "id": "cp-again",
        "emoji": "🔄",
        "label": "Cần nhấn nút 'Công bố' lại mỗi khi hoàn thành chỉnh sửa mới",
        "isMatch": true,
        "explain": "Bắt buộc công bố lại để cập nhật thay đổi mới lên Internet."
      },
      {
        "id": "cp-private",
        "emoji": "👀",
        "label": "Người khác truy cập báo lỗi không tìm thấy trang hoặc bị chặn quyền",
        "isMatch": false,
        "explain": "Dấu hiệu trang web chưa được bấm xuất bản công khai."
      }
    ]
  }
];

export default games;

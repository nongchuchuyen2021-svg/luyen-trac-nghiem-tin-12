import type { LessonGame, SortGame, TimelineGame, ClassifyGame } from "@/lib/types";

// 3 trò chơi ôn bài tương tác chuẩn SGK Tin học 12 (Kết nối tri thức)
const games: LessonGame[] = [
  {
    "kind": "classify",
    "id": "cac-kieu-input",
    "title": "Các loại thuộc tính 'type' của thẻ <input>",
    "emoji": "📋",
    "instructions": "Xếp từng ví dụ nhập liệu vào đúng giá trị type tương ứng của thẻ input!",
    "categories": [
      {
        "id": "text",
        "emoji": "🔤",
        "name": "type=\"text\"",
        "subtitle": "Nhập văn bản ngắn 1 dòng"
      },
      {
        "id": "password",
        "emoji": "🔒",
        "name": "type=\"password\"",
        "subtitle": "Mật khẩu che giấu ký tự"
      },
      {
        "id": "radio",
        "emoji": "🔘",
        "name": "type=\"radio\"",
        "subtitle": "Chọn duy nhất 1 trong nhóm"
      },
      {
        "id": "checkbox",
        "emoji": "☑️",
        "name": "type=\"checkbox\"",
        "subtitle": "Đánh dấu chọn nhiều"
      }
    ],
    "items": [
      {
        "id": "ip-hoten",
        "label": "Ô nhập Họ và tên học sinh",
        "categoryId": "text",
        "explain": "Họ tên là văn bản thông thường, dùng type='text'."
      },
      {
        "id": "ip-pass",
        "label": "Ô nhập mật khẩu hiển thị dấu chấm đen tròn (•••)",
        "categoryId": "password",
        "explain": "type='password' bảo vệ mật khẩu không bị nhìn lén."
      },
      {
        "id": "ip-gioitinh",
        "label": "Chọn Giới tính: Nam hoặc Nữ (chỉ được chọn 1)",
        "categoryId": "radio",
        "explain": "Lựa chọn loại trừ lẫn nhau dùng type='radio'."
      },
      {
        "id": "ip-sothich",
        "label": "Chọn các sở thích: Đọc sách, Đá bóng, Ca hát",
        "categoryId": "checkbox",
        "explain": "Được chọn nhiều phương án cùng lúc dùng type='checkbox'."
      },
      {
        "id": "ip-lop",
        "label": "Ô nhập tên lớp học (ví dụ: 12A1)",
        "categoryId": "text",
        "explain": "Nhập chuỗi văn bản thông thường."
      },
      {
        "id": "ip-dongy",
        "label": "Tích chọn: 'Tôi đồng ý với các điều khoản'",
        "categoryId": "checkbox",
        "explain": "Hộp kiểm chấp thuận điều khoản dùng checkbox."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "radio-hay-checkbox",
    "title": "Chọn duy nhất (radio) hay Chọn nhiều (checkbox)?",
    "emoji": "🔘",
    "instructions": "Kéo từng trường hợp sang đúng loại nút lựa chọn trong biểu mẫu web!",
    "matchLabel": "Chọn nhiều (checkbox)",
    "matchEmoji": "☑️",
    "noMatchLabel": "Chọn duy nhất (radio)",
    "noMatchEmoji": "🔘",
    "items": [
      {
        "id": "rc-size",
        "emoji": "👕",
        "label": "Chọn cỡ áo đồng phục: S, M, L, XL (mỗi người 1 cỡ)",
        "isMatch": false,
        "explain": "Chỉ chọn 1 cỡ áo nên dùng radio button."
      },
      {
        "id": "rc-monhoc",
        "emoji": "📚",
        "label": "Chọn các môn dự thi tốt nghiệp: Toán, Văn, Sử, Địa",
        "isMatch": true,
        "explain": "Học sinh thi nhiều môn nên dùng checkbox."
      },
      {
        "id": "rc-pttt",
        "emoji": "💳",
        "label": "Chọn hình thức thanh toán: Tiền mặt hay Chuyển khoản",
        "isMatch": false,
        "explain": "Thanh toán chỉ chọn 1 hình thức, dùng radio."
      },
      {
        "id": "rc-ngaynghi",
        "emoji": "📅",
        "label": "Đánh dấu các ngày em có thể tham gia dã ngoại trong tuần",
        "isMatch": true,
        "explain": "Có thể rảnh nhiều ngày nên dùng checkbox."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "phuong-thuc-get-hay-post",
    "title": "Phương thức GET hay POST khi gửi form?",
    "emoji": "🚀",
    "instructions": "Phân biệt hai phương thức gửi dữ liệu form kinh điển: GET (dữ liệu gắn trên URL) hay POST (dữ liệu gửi kín trong thân gói)?",
    "matchLabel": "Phương thức POST (Kín đáo, an toàn)",
    "matchEmoji": "🔒",
    "noMatchLabel": "Phương thức GET (Hiện trên URL)",
    "noMatchEmoji": "👀",
    "items": [
      {
        "id": "gp-search",
        "emoji": "🔍",
        "label": "Form tìm kiếm thông tin trên Google (từ khoá hiện trên thanh địa chỉ)",
        "isMatch": false,
        "explain": "Tìm kiếm thông thường dùng GET để người dùng có thể lưu hoặc chia sẻ link."
      },
      {
        "id": "gp-login",
        "emoji": "🔑",
        "label": "Form đăng nhập tài khoản chứa mật khẩu nhạy cảm",
        "isMatch": true,
        "explain": "Mật khẩu tuyệt đối phải gửi qua POST để không bị lộ trên URL."
      },
      {
        "id": "gp-pay",
        "emoji": "💳",
        "label": "Gửi thông tin thẻ tín dụng hoặc chuyển tiền ngân hàng",
        "isMatch": true,
        "explain": "Thông tin tài chính bắt buộc dùng phương thức POST bảo mật."
      },
      {
        "id": "gp-page",
        "emoji": "📖",
        "label": "Chuyển trang kết quả tìm kiếm: ?page=2",
        "isMatch": false,
        "explain": "Phân trang dữ liệu thường dùng GET."
      }
    ]
  }
];

export default games;

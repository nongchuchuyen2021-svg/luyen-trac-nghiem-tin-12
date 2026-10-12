import type { LessonTheory } from "@/lib/types";

// Bài 27. Biểu mẫu trên trang web — SGK Tin học 12 (ICT, Kết nối tri
// thức), trang 147–150. Chủ đề 7 (Ứng dụng tin học: Google Sites).

const theory: LessonTheory = {
  minutes: 13,

  intro:
    "Biểu mẫu trực tuyến là công cụ quan trọng giúp website tương tác hai chiều với người truy cập. Bài học hướng dẫn bạn quy trình chuẩn bị và thiết kế biểu mẫu khảo sát, đăng kí bằng **Google Forms**, sau đó **nhúng trực tiếp biểu mẫu vào Google Sites** để thu thập phản hồi của người xem.",

  sections: [
    // ───────────────────────── MỤC 1 ─────────────────────────
    {
      id: "vai-tro-bieu-mau-truc-tuyen",
      emoji: "📋",
      heading: "Vai trò của biểu mẫu trực tuyến và giải pháp nhúng",
      blocks: [
        {
          kind: "text",
          text: "Một trang web thông thường chỉ truyền đạt thông tin một chiều từ người tạo tới người đọc. Để website có tính tương tác, người ta sử dụng **biểu mẫu (form)** nhằm thu thập ý kiến đánh giá, phiếu đăng kí thành viên câu lạc bộ, đăng kí tham gia sự kiện hay đơn liên hệ phản hồi.",
        },
        {
          kind: "text",
          text: "Trong Google Sites, việc tạo biểu mẫu trên trang web về bản chất là **tạo biểu mẫu bằng ứng dụng Google Forms rồi nhúng trực tiếp vào trang web Google Sites**:",
        },
        {
          kind: "list",
          items: [
            "Người dùng không cần viết mã lệnh thẻ `<form>` phức tạp của HTML.",
            "Giao diện biểu mẫu hiển thị mượt mà ngay trong thân trang web.",
            "Mọi câu trả lời của người xem được tự động lưu trữ an toàn trên Google Drive và có thể kết nối thẳng sang Google Sheets để xử lí số liệu.",
          ],
        },
        {
          kind: "check",
          q: "Bản chất của việc tạo biểu mẫu lấy ý kiến trên trang web Google Sites theo hướng dẫn của SGK là gì?",
          options: [
            "Tạo biểu mẫu bằng Google Forms rồi nhúng vào trang web Google Sites",
            "Tự viết mã nguồn thẻ form bằng ngôn ngữ lập trình HTML truyền thống",
            "Gửi thư điện tử hàng loạt tới từng người dùng để nhận phản hồi giấy",
            "Tạo một bảng tính Excel trống và yêu cầu người dùng tự tải tệp về",
          ],
          answer: 0,
          explain:
            "SGK nêu rõ: việc tạo biểu mẫu trên trang web để lấy ý kiến phản hồi của người dùng, về bản chất là tạo biểu mẫu bằng ứng dụng Forms của Google rồi nhúng vào trang web được thiết kế bằng Google Sites.",
        },
      ],
    },

    // ───────────────────────── MỤC 2 ─────────────────────────
    {
      id: "tao-bieu-mau-google-forms",
      emoji: "✍️",
      heading: "Quy trình thiết kế biểu mẫu với Google Forms",
      blocks: [
        {
          kind: "text",
          text: "Quy trình tạo một biểu mẫu thu thập thông tin trực tuyến gồm các bước cơ bản:",
        },
        {
          kind: "list",
          items: [
            "**Bước 1 — Chuẩn bị câu hỏi:** Xác định mục đích khảo sát và chuẩn bị danh sách câu hỏi ngắn gọn, rõ ràng (câu hỏi trắc nghiệm hoặc câu trả lời văn bản ngắn).",
            "**Bước 2 — Mở Google Forms:** Vào `forms.google.com` (hoặc biểu tượng Forms trong kho ứng dụng Google). Có thể chọn biểu mẫu trống (*Blank*) hoặc các mẫu có sẵn như *Thông tin liên hệ*, *Trả lời sự kiện*, *Yêu cầu đặt hàng*.",
            "**Bước 3 — Soạn thảo biểu mẫu:** Đặt tiêu đề cho biểu mẫu và viết lời giới thiệu ngắn.",
            "**Bước 4 — Thiết lập câu hỏi:** Nhấn nút dấu cộng `+` để thêm câu hỏi mới. Chọn loại câu hỏi thích hợp (*Trắc nghiệm / Multiple choice*, *Hộp kiểm / Checkboxes*, *Trả lời ngắn / Short answer*, *Đoạn / Paragraph*).",
            "**Bật tùy chọn 'Bắt buộc' (Required):** Với những thông tin thiết yếu không được phép bỏ trống (như Họ và tên, Lớp, Số điện thoại), bật công tắc **Bắt buộc** ở góc dưới mỗi câu hỏi.",
          ],
        },
        {
          kind: "check",
          q: "Khi soạn thảo câu hỏi trong Google Forms, muốn người trả lời không được bỏ qua câu hỏi đó thì người tạo cần bật tuỳ chọn nào?",
          options: [
            "Bật tuỳ chọn Bắt buộc (Required)",
            "Tắt hoàn toàn thông báo phản hồi",
            "Bấm vào biểu tượng xoá câu hỏi đó",
            "Khoá biểu mẫu lại không cho gửi đi",
          ],
          answer: 0,
          explain:
            "Tùy chọn 'Bắt buộc' (Required) yêu cầu người điền phải trả lời câu hỏi đó thì mới gửi được biểu mẫu thành công.",
        },
      ],
    },

    // ───────────────────────── MỤC 3 ─────────────────────────
    {
      id: "nhung-bieu-mau-vao-sites",
      emoji: "📥",
      heading: "Nhúng biểu mẫu vào Google Sites và thu thập kết quả",
      blocks: [
        {
          kind: "text",
          text: "Sau khi biểu mẫu Forms đã được soạn thảo xong, thực hiện nhúng vào website Google Sites:",
        },
        {
          kind: "list",
          items: [
            "Mở website trên Google Sites, chuyển đến trang con cần đặt biểu mẫu (ví dụ trang *'Liên hệ'* hoặc *'Khảo sát ý kiến'*).",
            "Tại khung bên phải, chọn bảng chọn **Chèn (Insert)**, cuộn xuống nhóm đối tượng bên dưới và bấm vào mục **Biểu mẫu (Forms)**.",
            "Một cửa sổ mở ra danh sách các biểu mẫu trong Google Drive cá nhân; chọn đúng biểu mẫu vừa tạo rồi bấm nút **Chèn (Insert)**.",
            "Biểu mẫu sẽ hiển thị trực quan ngay giữa phần thân trang. Bạn có thể kéo các nút tròn ở góc khung để điều chỉnh chiều cao và chiều rộng của biểu mẫu cho vừa vặn, đẹp mắt.",
          ],
        },
        {
          kind: "text",
          text: "**Thu thập và xử lí câu trả lời:** Khi người xem điền biểu mẫu và bấm *Gửi*, kết quả được ghi nhận ngay lập tức tại thẻ **Câu trả lời (Responses)** của Google Forms. Người quản trị có thể nhấp vào biểu tượng trang tính màu xanh để liên kết xuất toàn bộ số liệu sang **Google Sheets**, giúp lọc và thống kê điểm số, danh sách học sinh một cách chuyên nghiệp.",
        },
        {
          kind: "check",
          q: "Để nhúng một biểu mẫu đã tạo sẵn từ Google Forms vào trang web Google Sites, ta thực hiện thao tác nào?",
          options: [
            "Vào bảng chọn Chèn, cuộn xuống chọn mục Biểu mẫu rồi chọn tệp form từ Drive",
            "Chụp ảnh màn hình biểu mẫu rồi chèn dưới dạng một tệp hình ảnh tĩnh duy nhất",
            "Gõ lại từng câu hỏi một vào trong ô Hộp văn bản ở phần chân trang web",
            "Sao chép toàn bộ mã nguồn của trang web sang ứng dụng Google Trang tính",
          ],
          answer: 0,
          explain:
            "SGK hướng dẫn: trong bảng chọn Chèn (Insert), cuộn xuống chọn 'Biểu mẫu' (Forms) rồi chọn biểu mẫu tương ứng đã lưu trên Google Drive để chèn vào trang.",
        },
      ],
    },
  ],

  summary: [
    "Biểu mẫu (Forms) giúp website tương tác 2 chiều để thu thập thông tin, đăng kí hoặc khảo sát ý kiến người dùng.",
    "Bản chất trong Google Sites là thiết kế biểu mẫu trên **Google Forms** rồi **nhúng (Embed)** trực tiếp vào trang web.",
    "Google Forms hỗ trợ đa dạng kiểu câu hỏi (Trắc nghiệm, Hộp kiểm, Trả lời ngắn...); bật tùy chọn **Bắt buộc (Required)** cho các trường thông tin quan trọng.",
    "Chèn biểu mẫu từ Drive qua bảng chọn Chèn -> Biểu mẫu; kết quả phản hồi được lưu tự động và có thể liên kết sang **Google Sheets** để xử lí số liệu.",
  ],
};

export default theory;

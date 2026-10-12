import type { LessonTheory } from "@/lib/types";

// Bài 25. Xây dựng phần thân và chân trang web — SGK Tin học 12 (ICT, Kết nối tri
// thức), trang 139–143. Chủ đề 7 (Ứng dụng tin học: Google Sites).

const theory: LessonTheory = {
  minutes: 14,

  intro:
    "Bài học tìm hiểu cách sử dụng bảng chọn **Chèn (Insert)** trong Google Sites để xây dựng phần thân trang theo **kiến trúc khối (Content blocks)**, chèn văn bản, hình ảnh, video YouTube, các đối tượng nhúng, và thiết lập phần **chân trang (footer)** đồng bộ cho toàn bộ website.",

  sections: [
    // ───────────────────────── MỤC 1 ─────────────────────────
    {
      id: "bang-chon-chen-va-3-nhom-lenh",
      emoji: "📦",
      heading: "Bảng chọn Chèn và 3 nhóm lệnh chính",
      blocks: [
        {
          kind: "text",
          text: "Tại khung bên phải của cửa sổ thiết kế Google Sites, bảng chọn **Chèn (Insert)** là nơi cung cấp toàn bộ công cụ để thêm nội dung vào phần thân trang. Bảng chọn này được tổ chức thành **3 nhóm lệnh chính**:",
        },
        {
          kind: "list",
          items: [
            "**Nhóm 1 — Thành phần cơ bản:** Gồm 4 công cụ đầu tiên: *Hộp văn bản (Text box)* để nhập bài viết, *Hình ảnh (Images)* để tải ảnh lên hoặc tìm ảnh, *Nhúng (Embed)* để chèn mã HTML hoặc đường link các ứng dụng ngoài (thời tiết, âm nhạc), và *Drive* để chèn tài liệu, bài trình chiếu, bảng tính, video lưu trong Google Drive.",
            "**Nhóm 2 — Các thành phần nội dung (Content blocks):** Cung cấp các mẫu bố cục chia cột có sẵn (như mẫu 1 ảnh kèm văn bản, mẫu 2 cột song song, mẫu 3 cột, mẫu 4 cột). Sử dụng các mẫu này giúp phần thân trang có bố cục ngăn nắp, cân đối mà không tốn công căn chỉnh thủ công.",
            "**Nhóm 3 — Các đối tượng nâng cao:** Chèn các tiện ích tương tác phong phú như *Nút (Button)*, *Đường phân chia (Divider)*, *Mục lục (Table of contents)*, *Băng chuyền hình ảnh (Image carousel)*, *Nhóm thu gọn (Collapsible group)*, *Video YouTube*, *Lịch (Calendar)*, *Bản đồ (Map)*, *Biểu mẫu (Forms)*.",
          ],
        },
        {
          kind: "check",
          q: "Trong bảng chọn Chèn của Google Sites, lệnh 'Nhúng' (Embed) có chức năng chính là gì?",
          options: [
            "Chèn các nội dung dữ liệu từ ứng dụng Internet khác vào trang web",
            "Xoá toàn bộ các khối nội dung đang có để quay về trang web trống",
            "Đổi tên tệp lưu trữ trang web trong tài khoản Google Drive cá nhân",
            "Xuất bản trang web chính thức ra Internet với địa chỉ tên miền mới",
          ],
          answer: 0,
          explain:
            "Theo SGK: lệnh Nhúng (Embed) cho phép nhúng dữ liệu từ các ứng dụng Internet khác (như tiện ích thời tiết, phát nhạc trực tuyến, bản đồ) vào trang web đang thiết kế.",
        },
      ],
    },

    // ───────────────────────── MỤC 2 ─────────────────────────
    {
      id: "kien-truc-khoi-va-thao-tac-khoi",
      emoji: "🧱",
      heading: "Kiến trúc khối và thao tác quản lí khối nội dung",
      blocks: [
        {
          kind: "text",
          text: "Thân trang trong Google Sites được xây dựng theo **kiến trúc khối (Section/Block)**. Mỗi hàng nội dung là một khối hình chữ nhật độc lập trải dài theo chiều ngang của trang.",
        },
        {
          kind: "text",
          text: "Khi di chuột vào rìa bên trái của bất kì khối nội dung nào, một thanh công cụ nhỏ sẽ xuất hiện cho phép thực hiện các thao tác quản lí khối:",
        },
        {
          kind: "list",
          items: [
            "**Màu phần (Section colors — Biểu tượng bảng màu):** Cho phép đổi màu nền của khối (gồm: *Mặc định / Regular*, *Nhấn mạnh 1 / Emphasis 1*, *Nhấn mạnh 2 / Emphasis 2*, hoặc chèn *Hình ảnh nền / Image*). Việc đổi màu nền giúp phân tách rõ ràng các chủ đề nội dung trên trang.",
            "**Nhân đôi phần (Duplicate section — Biểu tượng hai trang giấy):** Tạo ra một bản sao nguyên vẹn của khối ngay phía dưới, rất tiện lợi khi muốn tạo các mục có cấu trúc tương tự.",
            "**Xóa phần (Delete section — Biểu tượng thùng rác):** Xóa toàn bộ khối nội dung cùng tất cả các thành phần nằm bên trong khối đó.",
            "**Thay đổi thứ tự khối (Di chuyển):** Rê chuột vào biểu tượng quai kéo (dấu 10 chấm tròn nhỏ) ở rìa trái khối, nhấn giữ chuột trái và kéo khối lên trên hoặc xuống dưới đến vị trí mong muốn.",
          ],
        },
        {
          kind: "check",
          q: "Để di chuyển một khối nội dung lên trên hoặc xuống dưới trong phần thân trang Google Sites, ta thực hiện thao tác nào?",
          options: [
            "Rê chuột vào biểu tượng quai kéo ở mép trái khối rồi kéo thả đến vị trí mới",
            "Bấm phím Delete trên bàn phím rồi gõ lại toàn bộ nội dung khối ở vị trí mới",
            "Nháy đúp chuột vào tiêu đề của trang web trên thanh điều hướng đầu trang",
            "Vào bảng chọn Giao diện rồi chọn lại một bảng màu khác cho toàn bộ trang",
          ],
          answer: 0,
          explain:
            "Thao tác kéo thả khối nội dung bằng cách giữ biểu tượng quai kéo ở lề trái khối cho phép sắp xếp lại thứ tự các phần trên trang rất trực quan.",
        },
      ],
    },

    // ───────────────────────── MỤC 3 ─────────────────────────
    {
      id: "thiet-lap-chan-trang",
      emoji: "👣",
      heading: "Thiết lập phần Chân trang (Footer)",
      blocks: [
        {
          kind: "text",
          text: "**Phần chân trang (footer)** nằm ở cuối cùng của trang web, là nơi cung cấp các thông tin thiết yếu về quyền sở hữu, bản quyền, thông tin liên hệ và liên kết bổ sung.",
        },
        {
          kind: "list",
          items: [
            "**Cách tạo:** Cuộn chuột xuống đáy trang, bấm nút **Thêm chân trang (Add footer)** hiện ra ở giữa lề dưới.",
            "**Nội dung tiêu biểu:** Tên cơ quan/đơn vị chủ quản, địa chỉ trường lớp, số điện thoại liên hệ, địa chỉ email, tuyên bố bản quyền (ví dụ: *'© 2026 Trường THPT Na Rì. All rights reserved'*), và liên kết tới Fanpage, kênh YouTube của trường/CLB.",
            "**Tính nhất quán:** Sau khi được tạo, phần chân trang sẽ **tự động hiển thị đồng bộ ở chân của tất cả các trang con** trong cùng website mà bạn không phải nhập lại.",
            "**Ẩn chân trang:** Trong trường hợp muốn ẩn chân trang ở một trang đặc biệt (như trang chào mừng/trang đích), người dùng có thể nhấp vào biểu tượng con mắt *Ẩn chân trang trên trang này*.",
          ],
        },
        {
          kind: "check",
          q: "Đặc điểm nổi bật nhất của phần chân trang (footer) sau khi được tạo trong Google Sites là gì?",
          options: [
            "Tự động xuất hiện đồng bộ ở cuối tất cả các trang con trong website",
            "Chỉ hiển thị duy nhất trên trang chủ, tuyệt đối không xuất hiện ở trang con",
            "Tự động biến mất hoàn toàn mỗi khi người dùng tải lại trình duyệt web",
            "Bắt buộc người dùng phải nhập lại nội dung thủ công cho từng trang con một",
          ],
          answer: 0,
          explain:
            "SGK nêu rõ: phần chân trang sau khi tạo sẽ tự động xuất hiện ở cuối tất cả các trang trong cùng website, giúp đảm bảo tính đồng bộ và tiết kiệm công sức thiết kế.",
        },
      ],
    },
  ],

  summary: [
    "Bảng chọn **Chèn (Insert)** gồm 3 nhóm: Thành phần cơ bản (Văn bản, Ảnh, Nhúng, Drive), Khối nội dung chia cột, và Đối tượng nâng cao (Nút, Mục lục, YouTube, Bản đồ...).",
    "Thân trang tổ chức theo **kiến trúc khối (Content blocks)**; mỗi khối có thanh công cụ đổi màu nền, nhân đôi, xóa hoặc kéo thả di chuyển vị trí.",
    "**Chân trang (Footer)** nằm ở đáy trang, chứa thông tin bản quyền và liên hệ; tự động xuất hiện đồng bộ trên tất cả các trang con trong website.",
  ],
};

export default theory;

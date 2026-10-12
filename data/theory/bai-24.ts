import type { LessonTheory } from "@/lib/types";

// Bài 24. Xây dựng phần đầu trang web — SGK Tin học 12 (ICT, Kết nối tri
// thức), trang 134–138. Chủ đề 7 (Ứng dụng tin học: Google Sites).

const theory: LessonTheory = {
  minutes: 12,

  intro:
    "Bài học bắt đầu chuỗi thực hành xây dựng trang web hoàn chỉnh bằng công cụ **Google Sites**. Bạn sẽ được học cách khởi tạo trang web mới, đặt tên tệp và tên trang, chèn logo, favicon, tùy biến tiêu đề cùng hình nền biểu ngữ (**banner**), và lựa chọn giao diện (**theme**) đồng bộ cho website.",

  sections: [
    // ───────────────────────── MỤC 1 ─────────────────────────
    {
      id: "khoi-dong-google-sites",
      emoji: "🚀",
      heading: "Khởi động và làm quen với Google Sites",
      blocks: [
        {
          kind: "text",
          text: "**Google Sites** là một ứng dụng trực quan, miễn phí trong hệ sinh thái của Google, giúp người dùng dễ dàng thiết kế và xuất bản các trang web lên Internet mà **không nhất thiết cần biết viết mã lệnh HTML hay CSS**.",
        },
        {
          kind: "text",
          text: "Để bắt đầu làm việc với Google Sites:",
        },
        {
          kind: "list",
          items: [
            "Truy cập vào địa chỉ **`sites.google.com`** (hoặc trực tiếp **`sites.google.com/new`**) từ trình duyệt web.",
            "Đăng nhập bằng tài khoản Google cá nhân hoặc tài khoản trường học.",
            "Chọn mục **Trang trống (Blank)** để tự thiết kế trang web từ đầu, hoặc chọn một trong các **mẫu giao diện có sẵn (Templates)** theo chủ đề như Lớp học, Câu lạc bộ, Danh mục đầu tư cá nhân.",
          ],
        },
        {
          kind: "check",
          q: "Để mở trực tiếp giao diện tạo một trang web mới trên Google Sites từ thanh địa chỉ trình duyệt, ta nhập địa chỉ nào?",
          options: [
            "sites.google.com/new",
            "drive.google.com/new",
            "docs.google.com/site",
            "cloud.google.com/web",
          ],
          answer: 0,
          explain:
            "SGK hướng dẫn: nhập sites.google.com để vào màn hình chính, hoặc sites.google.com/new để tạo ngay một trang web mới.",
        },
      ],
    },

    // ───────────────────────── MỤC 2 ─────────────────────────
    {
      id: "thiet-lap-nhan-dien-dau-trang",
      emoji: "🏷️",
      heading: "Thiết lập thông tin nhận diện phần đầu trang",
      blocks: [
        {
          kind: "text",
          text: "Ở góc trên bên trái của cửa sổ thiết kế, Google Sites cung cấp các vị trí để người dùng thiết lập danh tính cho website:",
        },
        {
          kind: "list",
          items: [
            "**Tên tệp tài liệu (Vị trí 'Trang web không có tiêu đề'):** Là tên của tệp trang web được lưu trữ tự động trong Google Drive của người tạo. Tên này giúp quản lí và tìm kiếm tệp trên Drive, không hiển thị trực tiếp cho người xem khi duyệt web.",
            "**Tên trang web (Site name):** Nhập ngay bên dưới hoặc cạnh logo, là tên chính thức xuất hiện trên thanh điều hướng của website khi người xem truy cập.",
            "**Thêm biểu trưng (Logo):** Bấm nút *Thêm biểu trưng (Add logo)* để tải hình ảnh logo của trường, lớp hoặc câu lạc bộ từ máy tính lên. Logo sẽ xuất hiện ở góc trên bên trái phần đầu trang.",
            "**Biểu tượng trang web (Favicon):** Trong cửa sổ cài đặt biểu trưng, chọn mục *Favicon* để tải biểu tượng nhỏ. Favicon sẽ hiển thị ngay trên tab của trình duyệt cạnh tiêu đề trang, giúp người dùng nhận diện nhanh khi mở nhiều tab cùng lúc.",
          ],
        },
        {
          kind: "check",
          q: "Dòng chữ 'Trang web không có tiêu đề' ở góc trên cùng bên trái cửa sổ thiết kế Google Sites có vai trò gì?",
          options: [
            "Đặt tên tệp lưu trữ trang web trong Google Drive của người dùng",
            "Đặt dòng tiêu đề chữ to nhất hiển thị ở chính giữa ảnh biểu ngữ",
            "Hiển thị danh sách các trang con đã tạo trong cùng một website",
            "Là địa chỉ tên miền chính thức của trang web sau khi xuất bản",
          ],
          answer: 0,
          explain:
            "Theo SGK: dòng này dùng để đặt tên tệp lưu trữ trang web trong Google Drive cá nhân, giúp phân biệt và quản lí tệp.",
        },
      ],
    },

    // ───────────────────────── MỤC 3 ─────────────────────────
    {
      id: "tuy-chinh-banner-tieu-de",
      emoji: "🎨",
      heading: "Tùy chỉnh biểu ngữ (Banner) và tiêu đề trang",
      blocks: [
        {
          kind: "text",
          text: "Phần đầu trang (header) của mỗi trang web thường có một **biểu ngữ (banner)** làm nền, kèm theo tiêu đề chính của trang:",
        },
        {
          kind: "list",
          items: [
            "**Soạn tiêu đề trang:** Nhấp chuột vào khung văn bản *Tiêu đề trang của bạn* ở giữa biểu ngữ để gõ nội dung (ví dụ: *'CLB Tin học THPT Na Rì'*). Sử dụng thanh công cụ để chỉnh phông chữ, cỡ chữ, căn lề và màu sắc.",
            "**Thay đổi hình ảnh nền (Change image):** Bấm nút *Thay đổi hình ảnh* ở góc dưới bên trái biểu ngữ để chọn *Tải lên (Upload)* từ máy tính hoặc *Chọn hình ảnh (Select)* từ kho ảnh mẫu phong phú của Google.",
          ],
        },
        {
          kind: "text",
          text: "Google Sites cung cấp **4 loại biểu ngữ (Header type)** để lựa chọn tùy mục đích của từng trang:",
        },
        {
          kind: "list",
          items: [
            "**Bìa (Cover):** Biểu ngữ bao phủ toàn bộ màn hình khi mở trang, tạo ấn tượng mạnh mẽ cho trang bìa hoặc trang chủ.",
            "**Biểu ngữ lớn (Large banner):** Kích thước biểu ngữ khá rộng, chiếm khoảng nửa màn hình, rất phù hợp với trang chủ website.",
            "**Biểu ngữ (Banner):** Kích thước tiêu chuẩn vừa phải, phổ biến nhất cho hầu hết các trang web.",
            "**Chỉ tiêu đề (Title only):** Bỏ hoàn toàn phần hình ảnh nền, chỉ giữ lại dòng chữ tiêu đề trên nền màu trang đơn giản, gọn gàng.",
          ],
        },
        {
          kind: "check",
          q: "Khi muốn phần đầu trang chỉ hiển thị dòng chữ tiêu đề gọn gàng mà không dùng hình ảnh nền, ta chọn loại biểu ngữ nào?",
          options: [
            "Chỉ tiêu đề (Title only)",
            "Biểu ngữ lớn (Large banner)",
            "Trang bìa toàn màn hình (Cover)",
            "Biểu ngữ chuẩn (Banner thông dụng)",
          ],
          answer: 0,
          explain:
            "Loại biểu ngữ 'Chỉ tiêu đề' (Title only) loại bỏ toàn bộ phần ảnh nền của banner, chỉ giữ lại khung chữ tiêu đề.",
        },
      ],
    },

    // ───────────────────────── MỤC 4 ─────────────────────────
    {
      id: "chon-chu-de-giao-dien",
      emoji: "✨",
      heading: "Chọn chủ đề (Themes) và bảng màu cho website",
      blocks: [
        {
          kind: "text",
          text: "Tại khung bên phải của cửa sổ thiết kế Google Sites, chuyển sang bảng chọn **Giao diện (Themes)** để định hình phong cách thẩm mĩ cho toàn bộ website:",
        },
        {
          kind: "list",
          items: [
            "Google Sites tích hợp sẵn các chủ đề thiết kế chuyên nghiệp như: **Đơn giản (Simple)**, **Aristotle**, **Ngoại giao (Diplomat)**, **Tầm nhìn (Vision)**, **Bằng phẳng (Level)**, **Ấn tượng (Impression)**.",
            "Mỗi chủ đề có sẵn các **bảng màu phối sẵn (Color palettes)** và các tùy chọn **kiểu phông chữ (Font styles)** đồng bộ, giúp trang web của bạn đẹp mắt, chuyên nghiệp mà không bị lộn xộn màu sắc.",
          ],
        },
        {
          kind: "note",
          text: "Lựa chọn chủ đề sẽ áp dụng nhất quán lên tất cả các trang con trong website, tạo nên phong cách thương hiệu thống nhất cho toàn bộ sản phẩm.",
        },
      ],
    },
  ],

  summary: [
    "**Google Sites** là công cụ trực quan, miễn phí giúp tạo và xuất bản website nhanh chóng mà không cần viết mã HTML hay CSS.",
    "Khởi tạo trang web tại **sites.google.com/new**, tệp tài liệu được tự động lưu trữ và quản lí trên Google Drive.",
    "Phần nhận diện gồm **Tên trang web**, **Logo** (biểu trưng ở góc trái) và **Favicon** (biểu tượng đại diện trên tab trình duyệt).",
    "Tùy chỉnh biểu ngữ (**Banner**) hỗ trợ 4 loại kích thước: Bìa (Cover), Biểu ngữ lớn (Large banner), Biểu ngữ (Banner), và Chỉ tiêu đề (Title only).",
    "Bảng chọn **Giao diện (Themes)** định hình phong cách thẩm mĩ với các chủ đề, bảng màu và kiểu chữ đồng bộ cho toàn bộ website.",
  ],
};

export default theory;

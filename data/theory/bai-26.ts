import type { LessonTheory } from "@/lib/types";

// Bài 26. Liên kết và thanh điều hướng — SGK Tin học 12 (ICT, Kết nối tri
// thức), trang 144–146. Chủ đề 7 (Ứng dụng tin học: Google Sites).

const theory: LessonTheory = {
  minutes: 12,

  intro:
    "Bài học hướng dẫn cách tổ chức cấu trúc website thành **cây phân cấp (trang chủ và các trang con)**, sử dụng bảng chọn **Trang (Pages)** để tạo và quản lí các trang, tùy biến **thanh điều hướng (navigation)**, và thiết lập các **liên kết (hyperlinks)** kết nối nội dung mượt mà.",

  sections: [
    // ───────────────────────── MỤC 1 ─────────────────────────
    {
      id: "to-chuc-cay-trang-web",
      emoji: "🌳",
      heading: "Tổ chức cấu trúc trang chủ và các trang con",
      blocks: [
        {
          kind: "text",
          text: "Khi xây dựng website, nếu đưa toàn bộ thông tin chi tiết vào trang chủ thì trang sẽ bị quá dài, người đọc khó theo dõi và các khối nội dung bên cạnh nhau dễ bị lệch khoảng trống, mất thẩm mĩ.",
        },
        {
          kind: "text",
          text: "Giải pháp tối ưu là **tổ chức website theo cấu trúc cây phân cấp** (tương tự như cây thư mục):",
        },
        {
          kind: "list",
          items: [
            "**Trang chủ (Homepage):** Đóng vai trò là cửa ngõ chính, chỉ trình bày tóm tắt các nội dung cốt lõi và giới thiệu các chủ đề lớn.",
            "**Trang con (Subpages):** Mỗi trang con là một trang độc lập trình bày đầy đủ, chi tiết về một chủ đề cụ thể (ví dụ: Trang chủ có các trang con như *'Giới thiệu'*, *'Hoạt động'*, *'Thành viên'*).",
            "Trang con cũng có thể chứa các trang con cấp thấp hơn, tạo thành một hệ thống thông tin mạch lạc, khoa học.",
          ],
        },
        {
          kind: "check",
          q: "Vì sao không nên đưa toàn bộ nội dung bài viết thật dài vào trang chủ mà nên chia thành các trang con?",
          options: [
            "Để tránh trang chủ quá dài gây khó theo dõi và làm lộ khoảng trống mất cân đối",
            "Vì Google Sites giới hạn mỗi trang web chỉ được chứa tối đa không quá 50 từ",
            "Vì trang chủ bắt buộc chỉ được chứa hình ảnh, tuyệt đối không được phép có chữ",
            "Để ngăn chặn hoàn toàn người dùng lạ không thể bấm chuyển trang trên website",
          ],
          answer: 0,
          explain:
            "SGK chỉ rõ: nếu văn bản quá dài, người dùng khó theo dõi tiếp và độ dài khác nhau giữa các bài viết làm lộ khoảng trống, mất cân đối. Giải pháp là tạo các trang con độc lập.",
        },
      ],
    },

    // ───────────────────────── MỤC 2 ─────────────────────────
    {
      id: "bang-chon-trang-va-quan-li-trang",
      emoji: "📑",
      heading: "Tạo và quản lí trang trong bảng chọn Trang (Pages)",
      blocks: [
        {
          kind: "text",
          text: "Tại khung bên phải của cửa sổ thiết kế, chọn bảng chọn **Trang (Pages)** để quản lí danh sách toàn bộ các trang trong website:",
        },
        {
          kind: "list",
          items: [
            "**Tạo trang mới cùng cấp:** Nhấp chuột vào nút dấu cộng `+` ở cuối bảng chọn Trang, nhập tên trang và nhấn *Xong (Done)*.",
            "**Tạo trang con (Subpage):** Rê chuột vào tên trang cha, nhấp vào biểu tượng **dấu ba chấm** ở bên phải, chọn mục **Thêm trang con (Add subpage)**. Trang con vừa tạo sẽ thụt lề vào trong và nằm dưới sự quản lí của trang cha.",
            "**Ẩn trang khỏi thanh điều hướng:** Nhấp vào dấu ba chấm của trang rồi chọn *Ẩn khỏi thanh điều hướng (Hide from navigation)* nếu trang đó chỉ muốn mở thông qua đường link riêng chứ không muốn hiện trên menu chính.",
            "**Các thao tác khác:** Đổi tên trang (*Thuộc tính / Properties*), Nhân đôi trang (*Duplicate page*), Xóa trang (*Delete*), hoặc Đặt làm trang chủ (*Set as homepage*).",
          ],
        },
        {
          kind: "check",
          q: "Để tạo một trang con trực thuộc một trang cha có sẵn trong Google Sites, ta thực hiện thao tác nào?",
          options: [
            "Nháy dấu ba chấm bên cạnh trang cha rồi chọn Thêm trang con (Add subpage)",
            "Kéo trang cha thả vào thùng rác rồi tạo một trang trắng hoàn toàn mới",
            "Vào bảng chọn Giao diện rồi nhấp chọn lại một mẫu màu sắc khác cho trang",
            "Nháy đúp chuột vào biểu tượng logo của trang web ở góc trên bên trái",
          ],
          answer: 0,
          explain:
            "Theo hướng dẫn SGK: nhấp vào biểu tượng dấu ba chấm cạnh tên trang cần tạo nhánh rồi chọn 'Thêm trang con' (Add subpage).",
        },
      ],
    },

    // ───────────────────────── MỤC 3 ─────────────────────────
    {
      id: "thanh-dieu-huong-va-tao-lien-ket",
      emoji: "🔗",
      heading: "Tùy biến thanh điều hướng và tạo liên kết (Hyperlinks)",
      blocks: [
        {
          kind: "text",
          text: "**Thanh điều hướng (Navigation bar)** giúp người xem di chuyển qua lại thuận tiện giữa các trang trong website:",
        },
        {
          kind: "list",
          items: [
            "**Chế độ Đỉnh trang (Top):** Thanh điều hướng hiển thị nằm ngang ở phía trên cùng của trang web, ngay cạnh logo — phù hợp với website có ít trang con.",
            "**Chế độ Cạnh bên (Side):** Thanh điều hướng thu gọn thành biểu tượng menu 3 gạch ở góc trái, khi nhấp vào sẽ trượt ra một danh sách dọc — rất tiện lợi cho các website có nhiều trang con hoặc khi xem trên màn hình điện thoại.",
          ],
        },
        {
          kind: "text",
          text: "**Thiết lập liên kết (Hyperlinks):** Để dẫn người xem từ trang chủ tới trang con chi tiết:",
        },
        {
          kind: "list",
          items: [
            "Bôi đen cụm từ cần gắn liên kết (ví dụ: *'Đọc tiếp'*, *'Xem chi tiết'*).",
            "Nhấn vào biểu tượng cái xích **Chèn liên kết (Insert link)** trên thanh công cụ nổi.",
            "Chọn tên trang con tương ứng đã có sẵn trong danh sách (liên kết nội bộ), hoặc dán đường dẫn URL ra bên ngoài (liên kết ngoài), rồi nhấn **Áp dụng (Apply)**.",
            "Cũng có thể dùng công cụ **Nút (Button)** từ bảng chọn Chèn để tạo các nút bấm điều hướng nổi bật, đẹp mắt.",
          ],
        },
        {
          kind: "check",
          q: "Khi gắn liên kết cho cụm từ 'Đọc tiếp' đến một trang con đã tạo trong cùng website, người dùng cần làm gì?",
          options: [
            "Bôi đen cụm từ, bấm biểu tượng Chèn liên kết rồi chọn tên trang con có sẵn",
            "Gõ lại toàn bộ nội dung của trang con vào ngay bên cạnh cụm từ đó",
            "Tải trang web lên Google Drive rồi chia sẻ quyền chỉnh sửa cho cả lớp",
            "Xoá cụm từ đó đi và thay thế bằng một hình ảnh bất kì tải từ máy tính",
          ],
          answer: 0,
          explain:
            "Thao tác tạo liên kết nội bộ: bôi đen văn bản, bấm biểu tượng Chèn liên kết (Insert link) và chọn trang con mong muốn trong danh sách trang hiển thị.",
        },
      ],
    },
  ],

  summary: [
    "Website nên tổ chức theo **cấu trúc cây phân cấp**: Trang chủ tóm tắt tổng quan, các **trang con (subpages)** trình bày thông tin chi tiết độc lập.",
    "Bảng chọn **Trang (Pages)** dùng để thêm trang mới, thêm trang con qua menu 3 chấm, đổi tên, nhân đôi hoặc ẩn khỏi thanh điều hướng.",
    "**Thanh điều hướng** có 2 chế độ hiển thị: Đỉnh trang (Top - menu ngang) hoặc Cạnh bên (Side - menu trượt 3 gạch).",
    "Tạo **liên kết (hyperlinks)** bằng biểu tượng mắt xích trên chữ (ví dụ 'Đọc tiếp'), trên hình ảnh hoặc tạo đối tượng Nút (Button) để dẫn tới trang con hoặc URL bên ngoài.",
  ],
};

export default theory;

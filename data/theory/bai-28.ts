import type { LessonTheory } from "@/lib/types";

// Bài 28. Thực hành tổng hợp — SGK Tin học 12 (ICT, Kết nối tri thức),
// trang 151–155. Chủ đề 7 (Ứng dụng tin học: Google Sites). Bài thực hành
// tổng kết toàn bộ mạch thiết kế website của chương trình Tin học 12.

const theory: LessonTheory = {
  minutes: 15,

  intro:
    "Bài thực hành tổng kết khép lại toàn bộ chương trình Tin học 12 định hướng Tin học ứng dụng (ICT). Bạn sẽ vận dụng tổng hợp tất cả kĩ năng đã học để **xây dựng một website hoàn chỉnh**, kiểm thử tính tương thích đa thiết bị và **xuất bản (Publish)** trang web lên Internet.",

  sections: [
    // ───────────────────────── MỤC 1 ─────────────────────────
    {
      id: "khai-quat-nhiem-vu-tieu-chi",
      emoji: "🏆",
      heading: "Nhiệm vụ và tiêu chí đánh giá sản phẩm website",
      blocks: [
        {
          kind: "text",
          text: "Trong bài thực hành tổng hợp, học sinh có thể thực hiện sản phẩm theo hình thức **cá nhân hoặc theo nhóm nhỏ (không quá 3 người)** trong thời lượng khoảng 3 tiết thực hành trên lớp.",
        },
        {
          kind: "text",
          text: "Một sản phẩm website đạt chuẩn theo SGK cần đáp ứng đầy đủ các tiêu chí cốt lõi sau:",
        },
        {
          kind: "list",
          items: [
            "**Cấu trúc hoàn chỉnh:** Gồm một trang chủ và các trang con độc lập (chứa ít nhất **3 đến 4 bài viết** ngắn gọn), có thanh điều hướng phân cấp rõ ràng và phần chân trang đồng bộ.",
            "**Dữ liệu đa phương tiện:** Tất cả các trang đều sử dụng dữ liệu đa phương tiện phong phú (hình ảnh chất lượng, video nhúng, bản đồ, âm thanh), **không phải là trang văn bản thuần chữ** nhàm chán.",
            "**Tính tương tác:** Có hệ thống liên kết nội bộ thông suốt giữa các trang (như các nút bấm, dòng chữ 'Đọc tiếp'), liên kết ra ngoài, và có ít nhất một biểu mẫu Google Forms để khảo sát ý kiến hoặc trắc nghiệm kiến thức.",
            "**Thẩm mĩ và phong cách:** Bố cục các khối nội dung cân đối, màu sắc hài hòa, phông chữ dễ đọc, tuân thủ một chủ đề giao diện (theme) thống nhất.",
          ],
        },
        {
          kind: "check",
          q: "Theo yêu cầu của SGK, một sản phẩm website hoàn chỉnh trong bài thực hành tổng hợp cần bao gồm ít nhất bao nhiêu bài viết?",
          options: [
            "Ít nhất 3 đến 4 bài viết ngắn gọn kèm dữ liệu đa phương tiện",
            "Chỉ cần đúng 1 bài viết duy nhất trên trang chủ là đủ yêu cầu",
            "Bắt buộc phải có tối thiểu 20 bài viết dài như một trang báo lớn",
            "Không cần bài viết nào, chỉ cần chèn các tệp video giải trí",
          ],
          answer: 0,
          explain:
            "SGK nêu rõ yêu cầu về nội dung: website bao gồm các tư liệu đa phương tiện với ít nhất 3 đến 4 bài viết ngắn gọn.",
        },
        {
          kind: "check",
          q: "Theo phần yêu cầu chung của SGK, đặc điểm bắt buộc đối với tất cả các trang web trong sản phẩm là gì?",
          options: [
            "Đều có dữ liệu đa phương tiện, không phải trang văn bản thuần chữ",
            "Chỉ được chứa chữ viết thuần tuý, không được phép chèn hình ảnh",
            "Bắt buộc phải có nền màu đen và chữ màu đỏ trên mọi trang web",
            "Không được phép có bất kì liên kết nào giữa các trang với nhau",
          ],
          answer: 0,
          explain:
            "SGK yêu cầu: tất cả các trang web đều có dữ liệu đa phương tiện, không phải trang văn bản thuần chữ.",
        },
      ],
    },

    // ───────────────────────── MỤC 2 ─────────────────────────
    {
      id: "quy-trinh-5-buoc-xay-dung-web",
      emoji: "🛠️",
      heading: "Quy trình 5 bước xây dựng và hoàn thiện website",
      blocks: [
        {
          kind: "text",
          text: "Để hoàn thành sản phẩm đúng tiến độ và chất lượng cao, các nhóm nên tuân thủ quy trình 5 bước khoa học:",
        },
        {
          kind: "list",
          items: [
            "**Bước 1 — Chọn chủ đề và lập dàn ý:** Chọn chủ đề vừa sức, gần gũi (ví dụ: *Địa danh lịch sử - văn hóa quê hương Na Rì*, *Giới thiệu Câu lạc bộ Tin học*, *Kỉ yếu lớp 12*, *Sổ tay an toàn trên không gian mạng*). Lập sơ đồ cây các trang cần tạo.",
            "**Bước 2 — Thu thập và chuẩn bị tư liệu:** Soạn thảo sẵn các đoạn văn bản tóm tắt, chọn lọc ảnh chụp sắc nét, tìm video YouTube minh họa, tạo sẵn biểu mẫu Forms trong Google Drive.",
            "**Bước 3 — Xây dựng website trên Google Sites:** Tạo trang chủ, thiết lập banner, logo, favicon; dùng các khối mẫu (Content blocks) để bố cục thân trang; tạo các trang con và liên kết điều hướng; nhúng biểu mẫu và chân trang.",
            "**Bước 4 — Xem trước (Preview) và kiểm thử:** Bấm nút biểu tượng màn hình và điện thoại ở góc trên cửa sổ thiết kế để xem trước website ở 3 chế độ: *Màn hình lớn (Máy tính)*, *Máy tính bảng (Tablet)* và *Điện thoại di động (Phone)*. Thử nhấp vào tất cả các liên kết để đảm bảo không bị đứt link, và gửi thử biểu mẫu phản hồi.",
            "**Bước 5 — Xuất bản (Publish) website:** Bấm nút **Công bố (Publish)**, nhập địa chỉ trang web (dạng chữ thường không dấu), thiết lập quyền xem công khai, và sao chép đường dẫn xuất bản để nộp bài hoặc chia sẻ.",
          ],
        },
        {
          kind: "check",
          q: "Tính năng Xem trước (Preview) trong Google Sites hỗ trợ người thiết kế kiểm tra giao diện trên những loại màn hình thiết bị nào?",
          options: [
            "Màn hình lớn máy tính, máy tính bảng và điện thoại thông minh",
            "Chỉ duy nhất một loại màn hình máy tính bàn, không có loại khác",
            "Chỉ duy nhất màn hình của các loại đồng hồ thông minh đeo tay",
            "Màn hình tivi công cộng trong các trung tâm mua sắm ngoài trời",
          ],
          answer: 0,
          explain:
            "Công cụ Preview của Google Sites cho phép chuyển đổi linh hoạt giữa 3 kích thước màn hình: Máy tính (Large screen), Máy tính bảng (Tablet) và Điện thoại (Phone) để kiểm tra tính tương thích.",
        },
      ],
    },

    // ───────────────────────── MỤC 3 ─────────────────────────
    {
      id: "xuat-ban-va-chia-se",
      emoji: "🚀",
      heading: "Xuất bản (Publish) và chia sẻ trang web ra Internet",
      blocks: [
        {
          kind: "text",
          text: "Khi thiết kế trên Google Sites, trang web mới chỉ ở dạng bản nháp cá nhân. Để người khác trên Internet có thể truy cập được, bắt buộc phải thực hiện thao tác **Công bố (Publish)**:",
        },
        {
          kind: "list",
          items: [
            "Nhấp vào nút **Công bố (Publish)** màu xanh ở góc trên bên phải.",
            "Tại ô **Địa chỉ web (Web address)**, nhập phần đuôi định danh của website (ví dụ: *`clb-tin-hoc-nari`*). Địa chỉ đầy đủ của trang sẽ là: `https://sites.google.com/view/clb-tin-hoc-nari`.",
            "Tại mục **Ai có thể xem trang web của tôi (Who can view my site)**, chọn *Bất kì ai (Anyone)* để mọi người đều có thể truy cập mà không bị chặn quyền.",
            "Bấm nút **Công bố** để hoàn tất.",
            "Để gửi link cho thầy cô hoặc bạn bè, bấm vào biểu tượng mắt xích **Sao chép đường liên kết tới trang web đã xuất bản (Copy published site link)**.",
          ],
        },
        {
          kind: "note",
          text: "Sau khi xuất bản, mỗi khi chỉnh sửa nội dung mới trên trang web, bạn cần nhấn lại nút 'Công bố' để Google Sites cập nhật các thay đổi mới nhất lên Internet.",
        },
      ],
    },
  ],
  summary: [
    "Website hoàn chỉnh gồm trang chủ và các trang con (ít nhất 3-4 bài viết), sử dụng tư liệu đa phương tiện, không phải trang thuần chữ.",
    "Quy trình 5 bước xây dựng website: Chọn chủ đề & lập dàn ý → Chuẩn bị tư liệu → Thiết kế trên Google Sites → Xem trước (Preview) kiểm thử → Xuất bản (Publish).",
    "Tính năng **Xem trước (Preview)** hỗ trợ kiểm tra giao diện trên 3 chế độ: Màn hình lớn (PC), Máy tính bảng (Tablet) và Điện thoại thông minh (Phone).",
    "Thao tác **Công bố (Publish)** tạo địa chỉ web trực tuyến công khai; cần công bố lại mỗi khi có chỉnh sửa nội dung mới.",
  ],
};

export default theory;

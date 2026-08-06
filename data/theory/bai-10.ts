import type { LessonTheory } from "@/lib/types";

// Bài 10. Tạo liên kết — SGK Tin học 12 (ICT, Kết nối tri thức), trang 57–61.
// Giữ đúng thuật ngữ sách: siêu văn bản, siêu liên kết, đường dẫn tuyệt đối,
// đường dẫn tương đối, liên kết trong cùng website, liên kết trong cùng trang.

const theory: LessonTheory = {
  minutes: 15,
  intro:
    "Trang web sẽ trở thành một 'ốc đảo' nếu không có cách nào đi đến nó hay từ nó đi ra. Bài này dạy cách tạo **siêu liên kết** (link) bằng thẻ `<a>` — tính năng cốt lõi làm nên mạng lưới World Wide Web.",

  sections: [
    {
      id: "sieu-van-ban",
      emoji: "🔗",
      heading: "Siêu văn bản và đường dẫn",
      blocks: [
        {
          kind: "text",
          text: "**Siêu văn bản** (hypertext) là loại văn bản mà nội dung của nó không chỉ chứa văn bản mà còn chứa nhiều dạng dữ liệu khác như âm thanh, hình ảnh,… và đặc biệt là chứa các **siêu liên kết** (hyperlink) tới siêu văn bản khác.",
        },
        {
          kind: "text",
          text: "Trong HTML, người ta sử dụng **thẻ `<a>`** cho các liên kết. Cấu trúc chung:",
        },
        {
          kind: "code",
          caption: "Cú pháp tạo liên kết",
          code: `<a href="URL">Nội dung hiển thị tại vị trí đặt liên kết</a>`,
        },
        {
          kind: "text",
          text: "Trong đó **URL** là địa chỉ (đường dẫn) tham chiếu tới tài liệu được liên kết. Thuộc tính **`href`** dùng để cung cấp địa chỉ của trang web hay tài liệu được liên kết. Phần lớn các liên kết trỏ tới một tài liệu HTML khác, nhưng cũng có thể trỏ tới một hình ảnh, tệp âm thanh hoặc video.",
        },
        {
          kind: "text",
          text: "Có **hai loại URL chính** là đường dẫn tuyệt đối và đường dẫn tương đối:",
        },
        {
          kind: "compare",
          left: {
            title: "Tuyệt đối",
            emoji: "🌐",
            items: [
              "Cung cấp **địa chỉ đầy đủ** bao gồm cả giao thức (`http://` hoặc `https://`), tên miền và tên đường dẫn chi tiết nếu cần.",
              "Dùng khi liên kết trên mạng Internet (tài liệu **không nằm trên máy chủ của mình**).",
              "Ví dụ: `href=\"https://www.nxbgd.vn/\"`",
            ],
          },
          right: {
            title: "Tương đối",
            emoji: "📂",
            items: [
              "Mô tả cách truy cập tài liệu được liên kết **từ vị trí của tài liệu hiện tại**.",
              "Dùng khi liên kết tới một tài liệu khác trên **cùng trang web (cùng máy chủ)**, không yêu cầu giao thức hay tên miền.",
              "Ví dụ: `href=\"BT/bai_tap_1.html\"`",
            ],
          },
        },
        {
          kind: "note",
          text: "Siêu văn bản là văn bản chứa nhiều loại dữ liệu và các liên kết tới siêu văn bản khác. Trong HTML, liên kết được xác định bằng **thẻ `<a>`** và thuộc tính **`href`** dùng để cung cấp đường dẫn (tuyệt đối hoặc tương đối) tới địa chỉ đích.",
        },
        {
          kind: "check",
          q: "Đường dẫn nào sau đây là đường dẫn tuyệt đối?",
          options: [
            "html/cach_tao_lien_ket.html",
            "../index.html",
            "http://google.com",
            "bai_tap/bai_tap_1.html",
          ],
          answer: 2,
          explain:
            "**`http://google.com`** là đường dẫn tuyệt đối vì có chứa giao thức (`http://`) và tên miền. Các đường dẫn còn lại là tương đối, mô tả vị trí từ tài liệu hiện tại.",
        },
      ],
    },

    {
      id: "lien-ket-trang-khac",
      emoji: "🌍",
      heading: "Liên kết tới trang web khác",
      blocks: [
        {
          kind: "text",
          text: "Khi cần liên kết từ trang web của mình tới một trang web khác trên Internet (liên kết ngoài), ta sử dụng thẻ `<a>` và truyền **đường dẫn tuyệt đối** cho thuộc tính `href`.",
        },
        {
          kind: "code",
          caption: "Ví dụ liên kết tới website của Nhà xuất bản Giáo dục",
          preview: true,
          code: `<p><a href="https://hanhtrangso.nxbgd.vn/sach-dien-tu?book_active=0"> Sách
điện tử Kết nối tri thức với cuộc sống</a></p>`,
        },
      ],
    },

    {
      id: "lien-ket-cung-website",
      emoji: "📁",
      heading: "Liên kết trong cùng website",
      blocks: [
        {
          kind: "text",
          text: "Phần lớn các liên kết được sử dụng là liên kết trỏ tới các trang trong cùng website của mình (ví dụ: từ trang chủ đi tới các trang nội dung). Trường hợp này gọi là liên kết trong, ta sử dụng **đường dẫn tương đối**.",
        },
        {
          kind: "text",
          text: "Khi đường dẫn không có giao thức ở đầu, trình duyệt kiểm tra địa chỉ đó trên máy chủ hiện tại để tìm tài liệu. Có ba trường hợp phổ biến khi dùng đường dẫn tương đối:",
        },
        {
          kind: "list",
          items: [
            "**Cùng thư mục:** Chỉ cần cung cấp tên tệp. Ví dụ: `href=\"thong_tin.html\"`.",
            "**Thuộc thư mục con (dưới 1 cấp):** Đường dẫn gồm tên thư mục và tên tệp, ngăn cách bởi dấu `/`. Ví dụ: `href=\"bai_tap/bai_tap_1.html\"`.",
            "**Thuộc thư mục cha (trên 1 cấp):** Sử dụng kí tự **`../`** để chỉ định \"trở lại thư mục trên một mức\". Số cụm `../` tương ứng với số mức quay trở lại. Ví dụ: `href=\"../index.html\"`.",
          ],
        },
        {
          kind: "code",
          caption: "Hình 10.1 trong SGK — các cách liên kết trong cùng website",
          code: `<!-- Cùng thư mục -->
<a href="thong_tin.html">Giới thiệu</a>

<!-- Xuống một cấp thư mục (thư mục bai_tap) -->
<a href="bai_tap/bai_tap_1.html">Bài tập 1</a>

<!-- Lên một cấp thư mục (quay ra thư mục cha) -->
<a href="../index.html">Quay lại trang chủ</a>`,
        },
        {
          kind: "check",
          q: "Để liên kết từ tệp hiện tại đến một tệp nằm ở thư mục cha (trên một cấp), ta bắt đầu đường dẫn bằng gì?",
          options: [
            "/",
            "./",
            "../",
            "//",
          ],
          answer: 2,
          explain:
            "Sử dụng **`../`** để chỉ định trở lại thư mục trên một mức. Nếu muốn lên 2 mức thì dùng `../../`.",
        },
      ],
    },

    {
      id: "lien-ket-cung-trang",
      emoji: "🎯",
      heading: "Liên kết tới vị trí khác trong cùng trang web",
      blocks: [
        {
          kind: "text",
          text: "Khi đọc một trang web dài, người dùng thường muốn nháy chuột vào mục lục để nhảy ngay đến phần nội dung tương ứng, hoặc từ cuối trang nhảy nhanh về đầu trang. Để tạo liên kết trong cùng trang, ta thực hiện hai bước:",
        },
        {
          kind: "steps",
          items: [
            {
              label: "1",
              title: "Tạo đích đến",
              text: "Thiết lập thuộc tính **`id`** cho thẻ HTML tại vị trí cần đến. Thuộc tính `id` giống như việc cắm cờ, giá trị `id` phải là **duy nhất** trong toàn bộ trang web (mỗi tên gọi chỉ xuất hiện một lần). Đây gọi là mã định danh đoạn.",
            },
            {
              label: "2",
              title: "Tạo liên kết",
              text: "Tạo thẻ `<a>` với thuộc tính `href` chứa dấu **`#`** theo sau là giá trị `id` vừa tạo: `href=\"#mã_định_danh_đoạn\"`.",
            },
          ],
        },
        {
          kind: "code",
          caption: "Ví dụ: Tạo bảng có id, rồi tạo liên kết trỏ tới bảng đó",
          code: `<!-- 1. Đặt id cho đích đến -->
<table id="Thong_tin"> ... </table>

<!-- 2. Tạo liên kết trỏ tới id đó -->
<a href="#Thong_tin">Thông tin chi tiết</a>`,
        },
        {
          kind: "check",
          q: "Để tạo liên kết nhảy đến một phần tử có id là \"Lich_su\", thuộc tính href phải viết như thế nào?",
          options: [
            'href="Lich_su"',
            'href="@Lich_su"',
            'href="#Lich_su"',
            'href="id=Lich_su"',
          ],
          answer: 2,
          explain:
            "Để liên kết tới một `id` trong cùng trang, `href` phải bắt đầu bằng dấu thăng **`#`** kèm theo tên `id`, tức là **`href=\"#Lich_su\"`**.",
        },
      ],
    },

    {
      id: "lien-ket-hinh-anh",
      emoji: "🖼️",
      heading: "Tạo liên kết cho hình ảnh",
      blocks: [
        {
          kind: "text",
          text: "Ngoài văn bản, ta có thể dùng hình ảnh làm nội dung liên kết (người dùng nháy chuột vào ảnh để mở trang khác). Để làm vậy, ta chỉ cần đặt thẻ **`<img>`** vào bên trong thẻ **`<a>`**.",
        },
        {
          kind: "code",
          caption: "Dùng ảnh Mặt Trời để liên kết tới trang thong_tin.html",
          code: `<a href="thong_tin.html">
  <img src="images/sun.png">
</a>`,
        },
        {
          kind: "note",
          text: "Từ một vị trí trong một trang web, ta có thể tạo liên kết tới trang web bất kì trên Internet, tới các trang ở trên cùng máy chủ hay liên kết tới những vị trí khác trong cùng trang.",
        },
      ],
    },
  ],

  summary: [
    "**Siêu văn bản** là văn bản chứa các **siêu liên kết** tới siêu văn bản khác.",
    "Thẻ **`<a>`** tạo liên kết, thuộc tính **`href`** chứa đường dẫn.",
    "**Đường dẫn tuyệt đối**: chứa đầy đủ giao thức (`http://`) và tên miền, dùng để liên kết ra ngoài website.",
    "**Đường dẫn tương đối**: chỉ vị trí tương đối từ tệp hiện tại, dùng để liên kết trong cùng website (`thong_tin.html`, `bai_tap/bt1.html`, `../index.html`).",
    "**Liên kết trong cùng trang**: đặt thuộc tính **`id`** cho đích đến (duy nhất trong trang), sau đó tạo liên kết **`href=\"#tên_id\"`**.",
    "Để tạo **liên kết cho hình ảnh**, đặt thẻ **`<img>`** vào bên trong thẻ **`<a>`**.",
  ],
};

export default theory;

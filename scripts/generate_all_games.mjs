import fs from 'fs';
import path from 'path';

// Dữ liệu chi tiết 3 game cho từng bài từ Bài 7 đến Bài 28
const ALL_GAMES = {
  "bai-07": [
    {
      kind: "sort",
      id: "the-doi-hay-the-don",
      title: "Thẻ đôi hay Thẻ đơn?",
      emoji: "🏷️",
      instructions: "Kéo từng thẻ HTML sang đúng khay: đây là THẺ ĐÔI (phải có thẻ đóng </...>) hay THẺ ĐƠN (chỉ có thẻ mở)?",
      matchLabel: "Thẻ đơn",
      matchEmoji: "➖",
      noMatchLabel: "Thẻ đôi",
      noMatchEmoji: "🔗",
      items: [
        { id: "t-p", emoji: "📝", label: "<p>: Đoạn văn bản", isMatch: false, explain: "Thẻ đôi — cần cặp thẻ <p>...</p>." },
        { id: "t-hr", emoji: "➖", label: "<hr>: Kẻ đường ngang phân cách", isMatch: true, explain: "Thẻ đơn — không có thẻ đóng và không có nội dung con." },
        { id: "t-h1", emoji: "📌", label: "<h1>: Tiêu đề cấp 1", isMatch: false, explain: "Thẻ đôi — cần cặp thẻ <h1>...</h1>." },
        { id: "t-br", emoji: "↵", label: "<br>: Ngắt xuống dòng mới", isMatch: true, explain: "Thẻ đơn — dùng để buộc trình duyệt xuống dòng." },
        { id: "t-em", emoji: "🖋️", label: "<em>: In nghiêng nhấn mạnh", isMatch: false, explain: "Thẻ đôi — cần cặp thẻ <em>...</em>." },
        { id: "t-img", emoji: "🖼️", label: "<img>: Chèn hình ảnh", isMatch: true, explain: "Thẻ đơn — chỉ chứa thuộc tính nguồn ảnh, không có nội dung con." },
        { id: "t-div", emoji: "📦", label: "<div>: Khối phân chia bố cục", isMatch: false, explain: "Thẻ đôi — dùng bao bọc các phần tử con bên trong." },
        { id: "t-meta", emoji: "⚙️", label: "<meta>: Khai báo cấu hình trang web", isMatch: true, explain: "Thẻ đơn — nằm trong thẻ <head>." },
      ]
    },
    {
      kind: "sort",
      id: "head-hay-body",
      title: "Nằm trong <head> hay trong <body>?",
      emoji: "🧱",
      instructions: "Kéo từng phần tử sang đúng vị trí: phần tử này thuộc phần cấu hình (<head>) hay phần hiển thị ra màn hình (<body>)?",
      matchLabel: "Thuộc <body> (Hiển thị)",
      matchEmoji: "👁️",
      noMatchLabel: "Thuộc <head> (Cấu hình)",
      noMatchEmoji: "🧠",
      items: [
        { id: "hb-title", emoji: "🏷️", label: "<title>: Tên trang web trên tab trình duyệt", isMatch: false, explain: "Thuộc <head> — mô tả tên trang hiển thị trên tab." },
        { id: "hb-h1", emoji: "📢", label: "<h1>: Tiêu đề bài viết chính trên trang", isMatch: true, explain: "Thuộc <body> — nội dung người xem nhìn thấy." },
        { id: "hb-charset", emoji: "🔤", label: '<meta charset="utf-8">: Cấu hình mã tiếng Việt', isMatch: false, explain: "Thuộc <head> — thông tin kỹ thuật của trang web." },
        { id: "hb-p", emoji: "📄", label: "<p>: Đoạn văn bản giới thiệu bản thân", isMatch: true, explain: "Thuộc <body> — nội dung trang web." },
        { id: "hb-style", emoji: "🎨", label: "<style>: Khai báo mã định dạng CSS nội bộ", isMatch: false, explain: "Thuộc <head> — định nghĩa quy tắc kiểu dáng cho cả trang." },
        { id: "hb-img", emoji: "🏞️", label: "<img>: Hình ảnh kỷ yếu lớp học", isMatch: true, explain: "Thuộc <body> — thành phần giao diện trực quan." },
        { id: "hb-script", emoji: "⚡", label: "<script>: Liên kết tệp mã lệnh JavaScript", isMatch: false, explain: "Thường nằm trong <head> hoặc cuối <body>, ở đây đóng vai trò cấu hình kịch bản." },
        { id: "hb-table", emoji: "📊", label: "<table>: Bảng điểm học tập của học sinh", isMatch: true, explain: "Thuộc <body> — hiển thị bảng dữ liệu trên trang." },
      ]
    },
    {
      kind: "timeline",
      id: "khung-suon-html",
      title: "Cấu trúc khung sườn tệp HTML từ ngoài vào trong",
      emoji: "🏗️",
      instructions: "Sắp xếp các dòng mã theo đúng thứ tự xuất hiện chuẩn từ đầu tệp đến cuối tệp HTML!",
      items: [
        { id: "ks-1", emoji: "1️⃣", label: "<!DOCTYPE html> (Khai báo kiểu tệp)", year: "Dòng 1", explain: "Dòng đầu tiên thông báo chuẩn HTML5 cho trình duyệt." },
        { id: "ks-2", emoji: "2️⃣", label: "<html> (Phần tử gốc bao bọc cả trang)", year: "Dòng 2", explain: "Thẻ gốc chứa toàn bộ các thẻ con khác." },
        { id: "ks-3", emoji: "3️⃣", label: "<head> (Phần đầu chứa cấu hình và tiêu đề tab)", year: "Dòng 3", explain: "Chứa <meta> và <title>." },
        { id: "ks-4", emoji: "4️⃣", label: "<body> (Phần thân chứa toàn bộ nội dung hiển thị)", year: "Dòng 4", explain: "Chứa các thẻ văn bản, hình ảnh, âm thanh người xem thấy." },
        { id: "ks-5", emoji: "5️⃣", label: "</html> (Thẻ đóng kết thúc tệp)", year: "Dòng cuối", explain: "Đóng phần tử gốc, hoàn tất tệp HTML." },
      ]
    }
  ],

  "bai-08": [
    {
      kind: "sort",
      id: "tieu-de-hay-doan-van",
      title: "Thẻ Tiêu đề (h1-h6) hay Thẻ Đoạn văn (p)?",
      emoji: "📝",
      instructions: "Phân loại đặc điểm và cách dùng: đây là đặc điểm của nhóm thẻ tiêu đề (<h1> - <h6>) hay thẻ đoạn văn (<p>)?",
      matchLabel: "Thẻ Tiêu đề (h1 - h6)",
      matchEmoji: "📌",
      noMatchLabel: "Thẻ Đoạn văn (<p>)",
      noMatchEmoji: "📄",
      items: [
        { id: "td-lon-nhat", emoji: "👑", label: "<h1>: Tiêu đề quan trọng và có cỡ chữ lớn nhất", isMatch: true, explain: "Thuộc nhóm thẻ tiêu đề <h1>-<h6>." },
        { id: "td-doan", emoji: "✍️", label: "<p>: Chứa một đoạn văn bản hoàn chỉnh", isMatch: false, explain: "Thẻ <p> dùng cho các đoạn văn thông thường." },
        { id: "td-nho-dan", emoji: "📉", label: "Có 6 cấp độ giảm dần từ cấp 1 đến cấp 6", isMatch: true, explain: "Nhóm thẻ tiêu đề gồm chính xác 6 cấp: h1, h2, h3, h4, h5, h6." },
        { id: "td-tu-xuong-dong", emoji: "↵", label: "Tự động ngắt đoạn và có khoảng cách trên dưới", isMatch: false, explain: "Thẻ đoạn văn <p> có lề trên dưới mặc định của trình duyệt." },
        { id: "td-h3", emoji: "🏷️", label: "<h3>: Thường dùng làm tiêu đề mục con", isMatch: true, explain: "Tiêu đề cấp 3 nhỏ hơn h1 và h2." },
        { id: "td-chu-thuong", emoji: "📖", label: "Nội dung thường là chữ thường, cỡ chữ chuẩn 16px", isMatch: false, explain: "Đặc điểm hiển thị chuẩn của văn bản đoạn <p>." },
      ]
    },
    {
      kind: "sort",
      id: "dinh-dang-chu",
      title: "In đậm (strong) hay In nghiêng (em)?",
      emoji: "🖋️",
      instructions: "Kéo từng thẻ sang đúng ý nghĩa định dạng: Thẻ mang ý nghĩa in đậm nhấn mạnh (strong/b) hay in nghiêng (em/i)?",
      matchLabel: "In đậm (<strong>, <b>)",
      matchEmoji: "💪",
      noMatchLabel: "In nghiêng (<em>, <i>)",
      noMatchEmoji: "📐",
      items: [
        { id: "dd-strong", emoji: "⭐", label: "<strong>: Nhấn mạnh tầm quan trọng (chữ đậm)", isMatch: true, explain: "<strong> vừa làm đậm vừa mang ý nghĩa ngữ nghĩa nhấn mạnh." },
        { id: "dd-em", emoji: "✨", label: "<em>: Nhấn mạnh ngữ điệu câu (chữ nghiêng)", isMatch: false, explain: "<em> hiển thị dạng chữ in nghiêng." },
        { id: "dd-b", emoji: "🔲", label: "<b>: Đơn thuần làm chữ in đậm không đổi ngữ nghĩa", isMatch: true, explain: "Thẻ <b> là viết tắt của Bold (chữ đậm)." },
        { id: "dd-i", emoji: "🖊️", label: "<i>: Đơn thuần làm chữ in nghiêng (Italic)", isMatch: false, explain: "Thẻ <i> là viết tắt của Italic." },
        { id: "dd-chu-y", emoji: "⚠️", label: "Dùng để lưu ý học sinh về từ khóa then chốt quan trọng", isMatch: true, explain: "Từ khóa then chốt thường dùng <strong>." },
        { id: "dd-chu-thich", emoji: "💬", label: "Dùng cho trích dẫn hoặc câu thoại nhân vật", isMatch: false, explain: "Trích dẫn hoặc lời thoại thường dùng <em>." },
      ]
    },
    {
      kind: "sort",
      id: "ten-the-hay-thuoc-tinh",
      title: "Tên thẻ hay Thuộc tính HTML?",
      emoji: "🧩",
      instructions: "Phân biệt giữa Tên thẻ HTML (Tag name) và Thuộc tính bổ sung (Attribute)?",
      matchLabel: "Thuộc tính (Attribute)",
      matchEmoji: "⚙️",
      noMatchLabel: "Tên thẻ (Tag name)",
      noMatchEmoji: "🏷️",
      items: [
        { id: "tt-p", emoji: "📄", label: "p (paragraph)", isMatch: false, explain: "Tên thẻ tạo đoạn văn bản." },
        { id: "tt-style", emoji: "🎨", label: 'style="color: red": Thiết lập kiểu dáng inline', isMatch: true, explain: "Thuộc tính bổ sung gán giá trị cho thẻ." },
        { id: "tt-h1", emoji: "📢", label: "h1 (heading 1)", isMatch: false, explain: "Tên thẻ tiêu đề cấp 1." },
        { id: "tt-id", emoji: "🆔", label: 'id="phan-dau": Định danh duy nhất cho phần tử', isMatch: true, explain: "Thuộc tính id gán mã định danh duy nhất." },
        { id: "tt-hr", emoji: "➖", label: "hr (horizontal rule)", isMatch: false, explain: "Tên thẻ đường kẻ ngang." },
        { id: "tt-class", emoji: "🏷️", label: 'class="hop-thong-tin": Gán lớp phong cách', isMatch: true, explain: "Thuộc tính class dùng để định dạng CSS theo nhóm." },
      ]
    }
  ],

  "bai-09": [
    {
      kind: "sort",
      id: "ol-hay-ul",
      title: "Danh sách có thứ tự <ol> hay Không thứ tự <ul>?",
      emoji: "📋",
      instructions: "Kéo từng tình huống sang đúng kiểu danh sách: Danh sách có thứ tự số (<ol>) hay Danh sách có dấu đầu dòng (<ul>)?",
      matchLabel: "Có thứ tự (<ol> - Ordered List)",
      matchEmoji: "🔢",
      noMatchLabel: "Không thứ tự (<ul> - Unordered List)",
      noMatchEmoji: "🔘",
      items: [
        { id: "ds-buoc", emoji: "👣", label: "Các bước nấu ăn theo thứ tự: Bước 1, Bước 2, Bước 3", isMatch: true, explain: "Cần thứ tự tuần tự rõ ràng nên dùng <ol>." },
        { id: "ds-mon-an", emoji: "🍎", label: "Danh sách các loại quả yêu thích: Táo, Lê, Cam", isMatch: false, explain: "Thứ tự không quan trọng, dùng <ul> với dấu chấm tròn." },
        { id: "ds-top", emoji: "🏆", label: "Bảng xếp hạng 5 học sinh đạt điểm cao nhất", isMatch: true, explain: "Có thứ hạng từ 1 đến 5 nên dùng <ol>." },
        { id: "ds-dung-cu", emoji: "🎒", label: "Đồ dùng học tập cần mang: Bút, Thước, Vở", isMatch: false, explain: "Liệt kê không phân biệt trước sau, dùng <ul>." },
        { id: "ds-quy-trinh", emoji: "⚙️", label: "Quy trình 5 bước xây dựng trang web của lớp", isMatch: true, explain: "Quy trình thực hiện tuần tự bắt buộc dùng <ol>." },
        { id: "ds-so-thich", emoji: "⚽", label: "Các môn thể thao giải trí cuối tuần", isMatch: false, explain: "Sở thích cá nhân không sắp xếp, dùng <ul>." },
      ]
    },
    {
      kind: "classify",
      id: "cac-the-tao-bang",
      title: "Các thẻ cấu thành Bảng trong HTML",
      emoji: "📊",
      instructions: "Xếp từng mô tả vào đúng thẻ tạo bảng tương ứng!",
      categories: [
        { id: "table", emoji: "🔲", name: "<table>", subtitle: "Khung bảng tổng thể" },
        { id: "tr", emoji: "↔️", name: "<tr>", subtitle: "Dòng / Hàng ngang" },
        { id: "th", emoji: "📌", name: "<th>", subtitle: "Ô tiêu đề cột" },
        { id: "td", emoji: "📝", name: "<td>", subtitle: "Ô dữ liệu thông thường" }
      ],
      items: [
        { id: "b-khung", label: "Bao bọc toàn bộ nội dung của bảng từ đầu đến cuối", categoryId: "table", explain: "Thẻ <table> là thẻ cha ngoài cùng của bảng." },
        { id: "b-dong", label: "Đại diện cho một hàng ngang (Table Row) trong bảng", categoryId: "tr", explain: "<tr> là viết tắt của Table Row." },
        { id: "b-td-cot", label: "Chữ mặc định in đậm và căn giữa ô (Table Header)", categoryId: "th", explain: "<th> dùng cho ô tiêu đề của từng cột." },
        { id: "b-o-du-lieu", label: "Chứa dữ liệu nội dung, chữ căn lề trái bình thường", categoryId: "td", explain: "<td> là Table Data, chứa thông tin chi tiết." },
        { id: "b-tr-con", label: "Nằm bên trong <tr> để tạo ra các cột trên dòng đó", categoryId: "td", explain: "Các ô <td> được đặt bên trong <tr>." },
        { id: "b-hang-dau", label: "Hàng trên cùng thường chứa nhóm các thẻ này để đặt tên cột", categoryId: "th", explain: "Hàng đầu tiên thường dùng <th> thay vì <td>." },
      ]
    },
    {
      kind: "sort",
      id: "colspan-hay-rowspan",
      title: "Gộp cột (colspan) hay Gộp hàng (rowspan)?",
      emoji: "📐",
      instructions: "Phân biệt hai thuộc tính gộp ô kinh điển của bảng HTML: Gộp nhiều cột ngang (colspan) hay Gộp nhiều hàng dọc (rowspan)?",
      matchLabel: "Gộp hàng dọc (rowspan)",
      matchEmoji: "↕️",
      noMatchLabel: "Gộp cột ngang (colspan)",
      noMatchEmoji: "↔️",
      items: [
        { id: "cr-col2", emoji: "↔️", label: 'colspan="2": Một ô trải dài qua 2 cột kế bên nhau', isMatch: false, explain: "colspan gộp cột theo chiều ngang." },
        { id: "cr-row3", emoji: "↕️", label: 'rowspan="3": Một ô trải dài xuống 3 hàng phía dưới', isMatch: true, explain: "rowspan gộp hàng theo chiều dọc." },
        { id: "cr-tieu-de-nhom", emoji: "📑", label: "Tiêu đề chung cho cả 2 cột 'Điểm Toán' và 'Điểm Văn'", isMatch: false, explain: "Tiêu đề chung phủ 2 cột ngang dùng colspan." },
        { id: "cr-thu-hai", emoji: "📅", label: "Ô 'Buổi sáng' kéo dài qua cả 4 tiết học từ tiết 1 đến tiết 4", isMatch: true, explain: "Kéo dài qua nhiều dòng dọc dùng rowspan." },
      ]
    }
  ],

  "bai-10": [
    {
      kind: "sort",
      id: "lien-ket-noi-bo-hay-ngoai",
      title: "Liên kết nội bộ hay Liên kết ngoài?",
      emoji: "🔗",
      instructions: "Kéo từng liên kết sang đúng nhóm: Liên kết nội bộ (trong cùng website) hay Liên kết ngoài Internet (trang khác)?",
      matchLabel: "Liên kết ngoài (External)",
      matchEmoji: "🌐",
      noMatchLabel: "Liên kết nội bộ (Internal)",
      noMatchEmoji: "🏠",
      items: [
        { id: "lk-about", emoji: "📄", label: 'href="gioithieu.html": Chuyển sang trang giới thiệu cùng thư mục', isMatch: false, explain: "Liên kết nội bộ giữa các trang trong cùng website." },
        { id: "lk-google", emoji: "🔍", label: 'href="https://google.com": Dẫn tới trang tìm kiếm Google', isMatch: true, explain: "Liên kết ra ngoài website khác trên Internet." },
        { id: "lk-anchor", emoji: "⚓", label: 'href="#muc-2": Nhảy tới mục 2 trên cùng trang hiện tại', isMatch: false, explain: "Liên kết neo nội bộ (Bookmark/Anchor link)." },
        { id: "lk-youtube", emoji: "▶️", label: 'href="https://youtube.com": Mở xem video trên trang YouTube', isMatch: true, explain: "Liên kết ngoài dẫn sang nền tảng khác." },
        { id: "lk-contact", emoji: "📞", label: 'href="lienhe.html": Mở trang thông tin liên hệ của trường', isMatch: false, explain: "Liên kết nội bộ trong website." },
        { id: "lk-facebook", emoji: "👥", label: 'href="https://facebook.com": Mở trang Fanpage trường', isMatch: true, explain: "Liên kết ngoài sang mạng xã hội." },
      ]
    },
    {
      kind: "sort",
      id: "href-hay-target",
      title: "Thuộc tính href hay target?",
      emoji: "🎯",
      instructions: "Phân biệt hai thuộc tính quan trọng của thẻ liên kết <a>: Địa chỉ đích (href) hay Cách thức mở trang (target)?",
      matchLabel: "Cách thức mở trang (target)",
      matchEmoji: "🪟",
      noMatchLabel: "Địa chỉ đích (href)",
      noMatchEmoji: "📍",
      items: [
        { id: "ht-url", emoji: "🌐", label: 'href="trangchu.html": Chỉ định trang web sẽ được mở ra', isMatch: false, explain: "href là viết tắt của Hypertext Reference — chỉ đường dẫn." },
        { id: "ht-blank", emoji: "✨", label: 'target="_blank": Mở trang web liên kết trong một TAB MỚI', isMatch: true, explain: "target='_blank' giúp mở liên kết trong tab riêng biệt." },
        { id: "ht-mail", emoji: "✉️", label: 'href="mailto:thaygiao@gmail.com": Bật ứng dụng gửi thư', isMatch: false, explain: "href chỉ định giao thức gửi thư mailto." },
        { id: "ht-self", emoji: "🔄", label: 'target="_self": Mở ngay trong tab hiện tại (mặc định)', isMatch: true, explain: "target='_self' mở đè lên trang đang xem." },
      ]
    },
    {
      kind: "sort",
      id: "duong-dan-tuong-doi-tuyet-doi",
      title: "Đường dẫn tương đối hay Tuyệt đối?",
      emoji: "🗺️",
      instructions: "Kéo từng đường dẫn sang đúng loại: Đường dẫn tương đối (Relative) hay Đường dẫn tuyệt đối (Absolute)?",
      matchLabel: "Đường dẫn tuyệt đối",
      matchEmoji: "🌐",
      noMatchLabel: "Đường dẫn tương đối",
      noMatchEmoji: "📁",
      items: [
        { id: "dd-http", emoji: "🌐", label: "https://dantri.com.vn/giao-duc.htm (Có đầy đủ giao thức và tên miền)", isMatch: true, explain: "Đường dẫn tuyệt đối luôn có http/https và tên miền." },
        { id: "dd-same", emoji: "📄", label: "tintuc.html (Tệp nằm cùng thư mục với trang đang đứng)", isMatch: false, explain: "Đường dẫn tương đối tính từ vị trí tệp hiện tại." },
        { id: "dd-sub", emoji: "📂", label: "images/anh1.jpg (Tệp nằm trong thư mục con images)", isMatch: false, explain: "Đường dẫn tương đối chỉ đường vào thư mục con." },
        { id: "dd-full", emoji: "🔗", label: "https://thptnari.edu.vn/logo.png", isMatch: true, explain: "Đường dẫn tuyệt đối chỉ đích xác địa chỉ trên Internet." },
      ]
    }
  ],

  "bai-11": [
    {
      kind: "sort",
      id: "the-anh-hay-video",
      title: "Thẻ hình ảnh (img) hay Thẻ video (video)?",
      emoji: "🎬",
      instructions: "Phân loại đặc điểm và thuộc tính giữa thẻ chèn ảnh <img> và thẻ video <video>!",
      matchLabel: "Thẻ <video>",
      matchEmoji: "🎥",
      noMatchLabel: "Thẻ <img>",
      noMatchEmoji: "🖼️",
      items: [
        { id: "av-controls", emoji: "⏯️", label: "Thuộc tính 'controls': Hiển thị nút Play, Pause, Âm lượng", isMatch: true, explain: "controls cho phép người dùng điều khiển phát video/audio." },
        { id: "av-alt", emoji: "📝", label: "Thuộc tính 'alt': Hiện dòng chữ mô tả khi tệp ảnh bị lỗi", isMatch: false, explain: "alt là thuộc tính bắt buộc của thẻ <img>." },
        { id: "av-autoplay", emoji: "⚡", label: "Thuộc tính 'autoplay': Tự động phát khi trang web vừa tải xong", isMatch: true, explain: "autoplay dùng cho các thẻ phát đa phương tiện." },
        { id: "av-src", emoji: "📍", label: "Thuộc tính 'src': Đường dẫn tới tệp nguồn .jpg, .png", isMatch: false, explain: "Cả hai thẻ đều có src, nhưng ảnh dùng định dạng ảnh tĩnh." },
        { id: "av-the-don", emoji: "➖", label: "Là thẻ đơn, không có thẻ đóng", isMatch: false, explain: "<img> là thẻ đơn, còn <video> là thẻ đôi." },
        { id: "av-the-doi", emoji: "🔗", label: "Là thẻ đôi, bên trong có thể chứa nhiều thẻ <source>", isMatch: true, explain: "<video> có thẻ đóng </video>." },
      ]
    },
    {
      kind: "sort",
      id: "iframe-hay-audio",
      title: "Khung nội tuyến (iframe) hay Âm thanh (audio)?",
      emoji: "🎧",
      instructions: "Phân loại giữa thẻ chèn khung nhúng <iframe> và thẻ âm thanh <audio>!",
      matchLabel: "Khung nhúng <iframe>",
      matchEmoji: "🪟",
      noMatchLabel: "Âm thanh <audio>",
      noMatchEmoji: "🎵",
      items: [
        { id: "ia-yt", emoji: "▶️", label: "Nhúng video phát từ YouTube hoặc bài nhạc từ Spotify", isMatch: true, explain: "<iframe> dùng để nhúng nội dung từ trang web khác vào trang mình." },
        { id: "ia-mp3", emoji: "🎼", label: "Phát bài hát ghi âm định dạng .mp3 lưu trên máy", isMatch: false, explain: "<audio> chuyên phát tệp âm thanh trực tiếp." },
        { id: "ia-maps", emoji: "🗺️", label: "Nhúng bản đồ Google Maps chỉ đường đến trường", isMatch: true, explain: "Bản đồ nhúng dùng thẻ <iframe>." },
        { id: "ia-sound", emoji: "🔊", label: "Thuộc tính 'loop': Cho phép phát lặp đi lặp lại bản nhạc", isMatch: false, explain: "loop là thuộc tính của thẻ âm thanh/video." },
      ]
    },
    {
      kind: "sort",
      id: "thuoc-tinh-src-va-alt",
      title: "Thuộc tính src hay alt của thẻ img?",
      emoji: "🖼️",
      instructions: "Phân biệt hai thuộc tính then chốt: Đường dẫn nguồn ảnh (src) và Văn bản thay thế (alt)?",
      matchLabel: "Văn bản thay thế (alt)",
      matchEmoji: "💬",
      noMatchLabel: "Nguồn ảnh (src)",
      noMatchEmoji: "📍",
      items: [
        { id: "sa-url", emoji: "📁", label: 'src="anh-lop-12.jpg": Chỉ định tệp ảnh cần hiển thị', isMatch: false, explain: "src là Source — nguồn tệp ảnh." },
        { id: "sa-text", emoji: "📝", label: 'alt="Ảnh tập thể lớp 12A": Mô tả nội dung bức ảnh', isMatch: true, explain: "alt là Alternative Text — văn bản thay thế." },
        { id: "sa-screen", emoji: "👓", label: "Hỗ trợ người khiếm thị nghe đọc mô tả bức ảnh", isMatch: true, explain: "Công cụ đọc màn hình đọc nội dung trong thuộc tính alt." },
        { id: "sa-load", emoji: "⏳", label: "Nơi trình duyệt gửi yêu cầu tải dữ liệu ảnh về", isMatch: false, explain: "Trình duyệt tải ảnh từ địa chỉ src." },
      ]
    }
  ],

  "bai-12": [
    {
      kind: "classify",
      id: "cac-kieu-input",
      title: "Các loại thuộc tính 'type' của thẻ <input>",
      emoji: "📋",
      instructions: "Xếp từng ví dụ nhập liệu vào đúng giá trị type tương ứng của thẻ input!",
      categories: [
        { id: "text", emoji: "🔤", name: 'type="text"', subtitle: "Nhập văn bản ngắn 1 dòng" },
        { id: "password", emoji: "🔒", name: 'type="password"', subtitle: "Mật khẩu che giấu ký tự" },
        { id: "radio", emoji: "🔘", name: 'type="radio"', subtitle: "Chọn duy nhất 1 trong nhóm" },
        { id: "checkbox", emoji: "☑️", name: 'type="checkbox"', subtitle: "Đánh dấu chọn nhiều" }
      ],
      items: [
        { id: "ip-hoten", label: "Ô nhập Họ và tên học sinh", categoryId: "text", explain: "Họ tên là văn bản thông thường, dùng type='text'." },
        { id: "ip-pass", label: "Ô nhập mật khẩu hiển thị dấu chấm đen tròn (•••)", categoryId: "password", explain: "type='password' bảo vệ mật khẩu không bị nhìn lén." },
        { id: "ip-gioitinh", label: "Chọn Giới tính: Nam hoặc Nữ (chỉ được chọn 1)", categoryId: "radio", explain: "Lựa chọn loại trừ lẫn nhau dùng type='radio'." },
        { id: "ip-sothich", label: "Chọn các sở thích: Đọc sách, Đá bóng, Ca hát", categoryId: "checkbox", explain: "Được chọn nhiều phương án cùng lúc dùng type='checkbox'." },
        { id: "ip-lop", label: "Ô nhập tên lớp học (ví dụ: 12A1)", categoryId: "text", explain: "Nhập chuỗi văn bản thông thường." },
        { id: "ip-dongy", label: "Tích chọn: 'Tôi đồng ý với các điều khoản'", categoryId: "checkbox", explain: "Hộp kiểm chấp thuận điều khoản dùng checkbox." },
      ]
    },
    {
      kind: "sort",
      id: "radio-hay-checkbox",
      title: "Chọn duy nhất (radio) hay Chọn nhiều (checkbox)?",
      emoji: "🔘",
      instructions: "Kéo từng trường hợp sang đúng loại nút lựa chọn trong biểu mẫu web!",
      matchLabel: "Chọn nhiều (checkbox)",
      matchEmoji: "☑️",
      noMatchLabel: "Chọn duy nhất (radio)",
      noMatchEmoji: "🔘",
      items: [
        { id: "rc-size", emoji: "👕", label: "Chọn cỡ áo đồng phục: S, M, L, XL (mỗi người 1 cỡ)", isMatch: false, explain: "Chỉ chọn 1 cỡ áo nên dùng radio button." },
        { id: "rc-monhoc", emoji: "📚", label: "Chọn các môn dự thi tốt nghiệp: Toán, Văn, Sử, Địa", isMatch: true, explain: "Học sinh thi nhiều môn nên dùng checkbox." },
        { id: "rc-pttt", emoji: "💳", label: "Chọn hình thức thanh toán: Tiền mặt hay Chuyển khoản", isMatch: false, explain: "Thanh toán chỉ chọn 1 hình thức, dùng radio." },
        { id: "rc-ngaynghi", emoji: "📅", label: "Đánh dấu các ngày em có thể tham gia dã ngoại trong tuần", isMatch: true, explain: "Có thể rảnh nhiều ngày nên dùng checkbox." },
      ]
    },
    {
      kind: "sort",
      id: "phuong-thuc-get-hay-post",
      title: "Phương thức GET hay POST khi gửi form?",
      emoji: "🚀",
      instructions: "Phân biệt hai phương thức gửi dữ liệu form kinh điển: GET (dữ liệu gắn trên URL) hay POST (dữ liệu gửi kín trong thân gói)?",
      matchLabel: "Phương thức POST (Kín đáo, an toàn)",
      matchEmoji: "🔒",
      noMatchLabel: "Phương thức GET (Hiện trên URL)",
      noMatchEmoji: "👀",
      items: [
        { id: "gp-search", emoji: "🔍", label: "Form tìm kiếm thông tin trên Google (từ khoá hiện trên thanh địa chỉ)", isMatch: false, explain: "Tìm kiếm thông thường dùng GET để người dùng có thể lưu hoặc chia sẻ link." },
        { id: "gp-login", emoji: "🔑", label: "Form đăng nhập tài khoản chứa mật khẩu nhạy cảm", isMatch: true, explain: "Mật khẩu tuyệt đối phải gửi qua POST để không bị lộ trên URL." },
        { id: "gp-pay", emoji: "💳", label: "Gửi thông tin thẻ tín dụng hoặc chuyển tiền ngân hàng", isMatch: true, explain: "Thông tin tài chính bắt buộc dùng phương thức POST bảo mật." },
        { id: "gp-page", emoji: "📖", label: "Chuyển trang kết quả tìm kiếm: ?page=2", isMatch: false, explain: "Phân trang dữ liệu thường dùng GET." },
      ]
    }
  ],

  "bai-13": [
    {
      kind: "classify",
      id: "ba-cach-chen-css",
      title: "Ba cách chèn mã CSS vào trang web",
      emoji: "🎨",
      instructions: "Phân loại các trường hợp vào đúng cách viết CSS: Nội tuyến (Inline), Nội bộ (Internal) hay Tệp riêng ngoài (External)!",
      categories: [
        { id: "inline", emoji: "🏷️", name: "CSS Nội tuyến (Inline)", subtitle: "Viết trong thuộc tính style của thẻ" },
        { id: "internal", emoji: "📄", name: "CSS Nội bộ (Internal)", subtitle: "Viết trong cặp thẻ <style> ở <head>" },
        { id: "external", emoji: "📁", name: "CSS Tệp ngoài (External)", subtitle: "Lưu tệp .css riêng và dùng <link>" }
      ],
      items: [
        { id: "cc-inline1", label: '<p style="color: red;">Đoạn văn này màu đỏ</p>', categoryId: "inline", explain: "Dùng trực tiếp thuộc tính style ngay trên thẻ." },
        { id: "cc-inter1", label: '<style> h1 { font-size: 24px; } </style> đặt trong phần <head>', categoryId: "internal", explain: "CSS nội bộ viết trong thẻ <style> của trang HTML." },
        { id: "cc-exter1", label: '<link rel="stylesheet" href="style.css">', categoryId: "external", explain: "Liên kết với tệp kiểu dáng bên ngoài." },
        { id: "cc-inline2", label: "Chỉ định dạng riêng cho duy nhất một thẻ cụ thể tức thời", categoryId: "inline", explain: "CSS nội tuyến có độ ưu tiên cao nhưng chỉ tác dụng 1 thẻ." },
        { id: "cc-exter2", label: "Áp dụng một bộ giao diện đồng bộ cho hàng trăm trang web của trường", categoryId: "external", explain: "Dùng tệp CSS ngoài giúp tái sử dụng và quản lý dễ nhất." },
      ]
    },
    {
      kind: "sort",
      id: "bo-chon-class-hay-id",
      title: "Bộ chọn Lớp (.class) hay Bộ chọn Định danh (#id)?",
      emoji: "🎯",
      instructions: "Phân biệt Bộ chọn theo Lớp (.class - dùng cho nhiều phần tử) và Bộ chọn theo ID (#id - duy nhất một phần tử)!",
      matchLabel: "Bộ chọn Định danh (#id)",
      matchEmoji: "🆔",
      noMatchLabel: "Bộ chọn Lớp (.class)",
      noMatchEmoji: "👥",
      items: [
        { id: "ci-multi", emoji: "👥", label: "Có thể đặt cùng một tên cho NHIỀU phần tử khác nhau trên trang", isMatch: false, explain: "Class dùng để gom nhóm nhiều phần tử chung kiểu." },
        { id: "ci-single", emoji: "🆔", label: "Chỉ được phép xuất hiện DUY NHẤT một lần trên toàn bộ trang web", isMatch: true, explain: "Id là mã định danh duy nhất của phần tử." },
        { id: "ci-dot", emoji: "🔘", label: "Khai báo trong CSS bắt đầu bằng dấu chấm: .hop-tin", isMatch: false, explain: "Dấu chấm (.) là ký hiệu của Class trong CSS." },
        { id: "ci-hash", emoji: "#️⃣", label: "Khai báo trong CSS bắt đầu bằng dấu thăng: #banner-chinh", isMatch: true, explain: "Dấu thăng (#) là ký hiệu của ID trong CSS." },
        { id: "ci-nut", emoji: "🔘", label: "Định dạng cho 5 nút bấm cùng có màu xanh lá cây trên trang", isMatch: false, explain: "Nhiều nút bấm cùng màu nên dùng .btn (Class)." },
      ]
    },
    {
      kind: "sort",
      id: "thuoc-tinh-hay-gia-tri-css",
      title: "Thuộc tính CSS hay Giá trị CSS?",
      emoji: "⚙️",
      instructions: "Phân biệt giữa Thuộc tính CSS (Property) và Giá trị tương ứng (Value)?",
      matchLabel: "Giá trị CSS (Value)",
      matchEmoji: "💎",
      noMatchLabel: "Thuộc tính CSS (Property)",
      noMatchEmoji: "🔧",
      items: [
        { id: "pv-color", emoji: "🎨", label: "color: Tên thuộc tính đổi màu chữ", isMatch: false, explain: "color là thuộc tính CSS." },
        { id: "pv-red", emoji: "🔴", label: "red, #FF0000, rgb(255,0,0): Giá trị màu", isMatch: true, explain: "Đây là giá trị gán cho thuộc tính màu." },
        { id: "pv-size", emoji: "📏", label: "font-size: Tên thuộc tính chỉnh cỡ chữ", isMatch: false, explain: "font-size là thuộc tính CSS." },
        { id: "pv-20px", emoji: "📐", label: "20px, 1.5rem: Giá trị kích thước", isMatch: true, explain: "Đây là giá trị kích cỡ gán cho thuộc tính." },
      ]
    }
  ],

  "bai-14": [
    {
      kind: "sort",
      id: "font-hay-color",
      title: "Thuộc tính Kiểu chữ (font) hay Màu sắc (color)?",
      emoji: "🔤",
      instructions: "Phân loại các thuộc tính CSS vào nhóm Định dạng chữ (Font) hay nhóm Màu sắc (Color)?",
      matchLabel: "Thuộc tính Màu sắc (Color)",
      matchEmoji: "🎨",
      noMatchLabel: "Thuộc tính Kiểu chữ (Font)",
      noMatchEmoji: "🔤",
      items: [
        { id: "fc-family", emoji: "🖋️", label: "font-family: Chọn họ phông chữ (Arial, Roboto...)", isMatch: false, explain: "font-family quy định họ phông chữ." },
        { id: "fc-color", emoji: "🌈", label: "color: Màu hiển thị của chữ cái", isMatch: true, explain: "color quy định màu chữ." },
        { id: "fc-weight", emoji: "💪", label: "font-weight: Độ đậm nhạt của nét chữ (bold, 700)", isMatch: false, explain: "font-weight chỉnh độ đậm của font." },
        { id: "fc-bg", emoji: "🖼️", label: "background-color: Màu nền của phần tử", isMatch: true, explain: "background-color quy định màu nền." },
        { id: "fc-style", emoji: "📐", label: "font-style: Kiểu chữ in nghiêng (italic)", isMatch: false, explain: "font-style chỉnh kiểu chữ nghiêng/thẳng." },
        { id: "fc-opacity", emoji: "👻", label: "opacity: Độ trong suốt của màu sắc", isMatch: true, explain: "opacity quy định độ mờ/trong suốt." },
      ]
    },
    {
      kind: "sort",
      id: "don-vi-tuyet-doi-hay-tuong-doi",
      title: "Đơn vị đo Tuyệt đối (px) hay Tương đối (%, rem)?",
      emoji: "📏",
      instructions: "Phân biệt đơn vị đo kích thước: Tuyệt đối cố định (px, pt) hay Tương đối co giãn theo màn hình (%, rem, em, vw)?",
      matchLabel: "Đơn vị Tương đối (Co giãn linh hoạt)",
      matchEmoji: "📱",
      noMatchLabel: "Đơn vị Tuyệt đối (Cố định điểm ảnh)",
      noMatchEmoji: "📐",
      items: [
        { id: "dr-px", emoji: "🧱", label: "px (pixel): Điểm ảnh cố định trên màn hình", isMatch: false, explain: "px là đơn vị tuyệt đối phổ biến nhất." },
        { id: "dr-pct", emoji: "📊", label: "% (phần trăm): Tính theo kích thước của phần tử cha", isMatch: true, explain: "% là đơn vị tương đối co giãn theo thẻ cha." },
        { id: "dr-pt", emoji: "📄", label: "pt (point): Đơn vị đo điểm in ấn truyền thống", isMatch: false, explain: "pt là đơn vị tuyệt đối dùng trong in ấn." },
        { id: "dr-rem", emoji: "🌱", label: "rem: Tính tỷ lệ theo cỡ chữ gốc của thẻ <html>", isMatch: true, explain: "rem là Root EM, co giãn chuẩn theo font gốc." },
        { id: "dr-vw", emoji: "💻", label: "vw / vh: Tỷ lệ theo chiều rộng/cao khung nhìn màn hình", isMatch: true, explain: "vw/vh thay đổi linh hoạt theo kích thước màn hình thiết bị." },
      ]
    },
    {
      kind: "classify",
      id: "bieu-dien-mau-css",
      title: "Các cách biểu diễn màu sắc trong CSS",
      emoji: "🎨",
      instructions: "Xếp các mã màu vào đúng định dạng biểu diễn màu tương ứng trong CSS!",
      categories: [
        { id: "name", emoji: "🔤", name: "Tên màu tiếng Anh", subtitle: "Keyword màu có sẵn" },
        { id: "hex", emoji: "#️⃣", name: "Mã Hex (#RRGGBB)", subtitle: "Hệ cơ số 16 bắt đầu bằng #" },
        { id: "rgb", emoji: "🌈", name: "Hàm rgb() / rgba()", subtitle: "3 kênh Red-Green-Blue (0-255)" }
      ],
      items: [
        { id: "m-red", label: "red, blue, green, yellow", categoryId: "name", explain: "Dùng trực tiếp tên màu tiếng Anh." },
        { id: "m-hex1", label: "#FF0000 (Đỏ rực)", categoryId: "hex", explain: "Mã thập lục phân 6 ký tự bắt đầu bằng #." },
        { id: "m-rgb1", label: "rgb(255, 0, 0) (Đỏ tuyệt đối)", categoryId: "rgb", explain: "Hàm rgb() với 3 chỉ số từ 0 đến 255." },
        { id: "m-white", label: "white, black, transparent", categoryId: "name", explain: "Tên màu chuẩn trình duyệt nhận biết." },
        { id: "m-hex2", label: "#0D7C86 (Màu xanh ngọc THPT Na Rì)", categoryId: "hex", explain: "Mã hex định danh màu chính xác." },
        { id: "m-rgba", label: "rgba(13, 124, 134, 0.5) (Có độ mờ)", categoryId: "rgb", explain: "rgba thêm kênh Alpha điều chỉnh độ trong suốt." },
      ]
    }
  ],

  "bai-15": [
    {
      kind: "timeline",
      id: "bon-tang-box-model",
      title: "4 tầng của Mô hình hộp (CSS Box Model) từ TRONG ra NGOÀI",
      emoji: "📦",
      instructions: "Sắp xếp 4 lớp của một phần tử hộp từ trung tâm nội dung ra đến khoảng cách lề ngoài cùng!",
      items: [
        { id: "bm-1", emoji: "1️⃣", label: "Content (Vùng nội dung chữ hoặc ảnh bên trong)", year: "Tầng 1 (Lõi)", explain: "Nội dung thực sự của phần tử nằm ở trong cùng." },
        { id: "bm-2", emoji: "2️⃣", label: "Padding (Vùng đệm giữa nội dung và đường viền)", year: "Tầng 2 (Đệm)", explain: "Khoảng trống bao bọc nội dung trước khi chạm viền." },
        { id: "bm-3", emoji: "3️⃣", label: "Border (Đường viền bao quanh phần tử)", year: "Tầng 3 (Viền)", explain: "Đường kẻ viền định hình ranh giới của hộp." },
        { id: "bm-4", emoji: "4️⃣", label: "Margin (Lề ngoài cùng ngăn cách với phần tử khác)", year: "Tầng 4 (Lề ngoài)", explain: "Khoảng cách trống bên ngoài viền đẩy các phần tử khác ra xa." },
      ]
    },
    {
      kind: "sort",
      id: "padding-hay-margin",
      title: "Vùng đệm (Padding) hay Lề ngoài (Margin)?",
      emoji: "📐",
      instructions: "Phân biệt hai thuộc tính khoảng cách kinh điển: Đệm bên trong viền (Padding) hay Lề bên ngoài viền (Margin)?",
      matchLabel: "Lề ngoài (Margin)",
      matchEmoji: "↔️",
      noMatchLabel: "Vùng đệm trong (Padding)",
      noMatchEmoji: "📦",
      items: [
        { id: "pm-inner", emoji: "📥", label: "Nằm BÊN TRONG đường viền, có nhận màu nền của hộp", isMatch: false, explain: "Padding nằm trong viền và đổi màu theo màu nền hộp." },
        { id: "pm-outer", emoji: "📤", label: "Nằm BÊN NGOÀI đường viền, luôn luôn trong suốt", isMatch: true, explain: "Margin là khoảng trống ngoài viền, không có màu nền." },
        { id: "pm-auto", emoji: "⚖️", label: "margin: 0 auto: Dùng để căn giữa một khối ra giữa trang", isMatch: true, explain: "Kỹ thuật kinh điển căn giữa khối bằng lề auto." },
        { id: "pm-space", emoji: "🔲", label: "Tạo khoảng cách cho dòng chữ không dính sát vào mép viền khung", isMatch: false, explain: "Tăng khoảng cách chữ với viền dùng padding." },
      ]
    },
    {
      kind: "sort",
      id: "block-hay-inline",
      title: "Phần tử Khối (Block) hay Phần tử Nội dòng (Inline)?",
      emoji: "🧱",
      instructions: "Phân loại hiển thị của phần tử: Chiếm trọn 1 dòng riêng (Block) hay Nằm chung trên 1 dòng văn bản (Inline)?",
      matchLabel: "Phần tử Khối (Block - Chiếm nguyên dòng)",
      matchEmoji: "🧱",
      noMatchLabel: "Phần tử Nội dòng (Inline - Chung dòng)",
      noMatchEmoji: "🔤",
      items: [
        { id: "bi-div", emoji: "📦", label: "<div>: Hộp phân chia khối luôn tự xuống dòng mới", isMatch: true, explain: "<div> là phần tử khối điển hình." },
        { id: "bi-span", emoji: "🏷️", label: "<span>: Gom nhóm một vài từ bên trong dòng văn bản", isMatch: false, explain: "<span> là phần tử nội dòng." },
        { id: "bi-h1", emoji: "📢", label: "<h1>: Tiêu đề luôn chiếm trọn vẹn cả chiều rộng dòng", isMatch: true, explain: "Các thẻ tiêu đề đều là Block." },
        { id: "bi-a", emoji: "🔗", label: "<a>: Thẻ liên kết nằm tự nhiên trong câu văn", isMatch: false, explain: "Thẻ <a> hiển thị inline cùng dòng chữ." },
        { id: "bi-p", emoji: "📄", label: "<p>: Đoạn văn bản luôn bắt đầu bằng một dòng mới", isMatch: true, explain: "Thẻ <p> là phần tử khối Block." },
        { id: "bi-strong", emoji: "💪", label: "<strong>: In đậm vài chữ trong đoạn văn không làm xuống dòng", isMatch: false, explain: "<strong> là phần tử nội dòng Inline." },
      ]
    }
  ],

  "bai-16": [
    {
      kind: "timeline",
      id: "cac-buoc-du-an-web",
      title: "5 bước của Dự án Xây dựng website hoàn chỉnh",
      emoji: "🛠️",
      instructions: "Sắp xếp đúng quy trình chuẩn của một dự án phát triển website từ ý tưởng đến hoàn thiện!",
      items: [
        { id: "da-1", emoji: "1️⃣", label: "Bước 1: Xác định chủ đề, mục tiêu và lập sơ đồ cây trang web", year: "Khởi tạo", explain: "Lên kế hoạch và cấu trúc trước khi code." },
        { id: "da-2", emoji: "2️⃣", label: "Bước 2: Thu thập và chuẩn bị tư liệu nội dung, hình ảnh, văn bản", year: "Chuẩn bị", explain: "Chuẩn bị sẵn ảnh và bài viết vào các thư mục." },
        { id: "da-3", emoji: "3️⃣", label: "Bước 3: Viết mã nguồn HTML xây dựng bộ khung và cấu trúc các trang", year: "Khung HTML", explain: "Dựng toàn bộ thẻ và liên kết nội dung." },
        { id: "da-4", emoji: "4️⃣", label: "Bước 4: Viết mã CSS để trang trí màu sắc, phông chữ và bố cục", year: "Giao diện CSS", explain: "Làm đẹp trang web theo thiết kế." },
        { id: "da-5", emoji: "5️⃣", label: "Bước 5: Kiểm thử liên kết, hình ảnh và khả năng hiển thị đa thiết bị", year: "Kiểm thử", explain: "Kiểm tra toàn diện trước khi bàn giao sản phẩm." },
      ]
    },
    {
      kind: "sort",
      id: "vai-tro-html-va-css",
      title: "Vai trò của HTML hay Vai trò của CSS?",
      emoji: "⚖️",
      instructions: "Phân biệt nhiệm vụ giữa HTML (Khung sườn, nội dung) và CSS (Trang trí, thẩm mỹ)?",
      matchLabel: "Nhiệm vụ của CSS (Trang phục, thẩm mỹ)",
      matchEmoji: "🎨",
      noMatchLabel: "Nhiệm vụ của HTML (Khung xương, nội dung)",
      noMatchEmoji: "🦴",
      items: [
        { id: "hc-text", emoji: "📄", label: "Xác định câu chữ tiêu đề, đoạn văn và bảng biểu", isMatch: false, explain: "HTML phụ trách cấu trúc và nội dung." },
        { id: "hc-color", emoji: "🌈", label: "Quy định màu nền xanh và màu chữ trắng", isMatch: true, explain: "CSS định dạng màu sắc." },
        { id: "hc-link", emoji: "🔗", label: "Tạo liên kết chuyển trang qua thẻ <a>", isMatch: false, explain: "HTML tạo các liên kết." },
        { id: "hc-layout", emoji: "📐", label: "Chia bố cục 2 cột và khoảng cách lề giữa các hộp", isMatch: true, explain: "CSS phụ trách căn chỉnh bố cục layout." },
      ]
    },
    {
      kind: "sort",
      id: "kiem-thu-du-an",
      title: "Lỗi cần sửa hay Sản phẩm đã đạt chuẩn?",
      emoji: "🔍",
      instructions: "Đánh giá các tình huống trong bước kiểm thử sản phẩm website dự án!",
      matchLabel: "Lỗi cần sửa ngay (Chưa đạt)",
      matchEmoji: "❌",
      noMatchLabel: "Đạt chuẩn chất lượng (Tốt)",
      noMatchEmoji: "✅",
      items: [
        { id: "kt-broken", emoji: "🚫", label: "Nhấp vào liên kết 'Giới thiệu' thì bị lỗi trang 404 Không tìm thấy", isMatch: true, explain: "Lỗi đứt liên kết (Broken link) phải sửa đường dẫn href." },
        { id: "kt-viet", emoji: "🔤", label: "Chữ tiếng Việt có dấu hiển thị chuẩn, không bị vỡ font hay ô vuông", isMatch: false, explain: "Đã có <meta charset='utf-8'> chuẩn." },
        { id: "kt-anh-loi", emoji: "🖼️", label: "Ảnh chụp tập thể bị vỡ hình, chỉ hiện biểu tượng ảnh rách", isMatch: true, explain: "Lỗi sai đường dẫn tệp ảnh trong thuộc tính src." },
        { id: "kt-mobile", emoji: "📱", label: "Trang web co giãn đẹp mắt khi xem trên điện thoại và máy tính", isMatch: false, explain: "Giao diện tương thích Responsive đạt chuẩn." },
      ]
    }
  ],

  "bai-17": [
    {
      kind: "classify",
      id: "vi-tri-nghe-nghiep-phan-mem",
      title: "Các vị trí nghề nghiệp trong Phát triển phần mềm",
      emoji: "🧑‍💻",
      instructions: "Xếp từng nhiệm vụ vào đúng vị trí công việc tương ứng trong công ty phần mềm!",
      categories: [
        { id: "frontend", emoji: "🎨", name: "Lập trình viên Giao diện (Front-end)", subtitle: "HTML, CSS, JS, tương tác người dùng" },
        { id: "backend", emoji: "⚙️", name: "Lập trình viên Phía sau (Back-end)", subtitle: "Máy chủ, Cơ sở dữ liệu, Logic nghiệp vụ" },
        { id: "tester", emoji: "🔍", name: "Kỹ sư Kiểm thử (Tester / QA)", subtitle: "Tìm lỗi, đảm bảo chất lượng phần mềm" },
        { id: "pm", emoji: "📋", name: "Quản trị dự án (Project Manager)", subtitle: "Lên kế hoạch, điều phối tiến độ nhóm" }
      ],
      items: [
        { id: "vt-fe", label: "Thiết kế nút bấm, hiệu ứng chuyển trang mượt mà trên trình duyệt", categoryId: "frontend", explain: "Lập trình viên Front-end lo phần giao diện người dùng nhìn thấy." },
        { id: "vt-be", label: "Viết mã xử lý lưu điểm thi của học sinh vào Cơ sở dữ liệu an toàn", categoryId: "backend", explain: "Back-end xử lý dữ liệu và logic trên máy chủ." },
        { id: "vt-qa", label: "Thử gõ sai mật khẩu 10 lần để kiểm tra hệ thống có bị treo không", categoryId: "tester", explain: "Tester tìm kiếm các lỗ hổng và trường hợp lỗi phần mềm." },
        { id: "vt-pm", label: "Họp phân công công việc và theo dõi tiến độ hoàn thành trước hạn chót", categoryId: "pm", explain: "Project Manager quản lý nhân lực và tiến độ dự án." },
      ]
    },
    {
      kind: "sort",
      id: "ky-nang-cung-hay-mem",
      title: "Kỹ năng chuyên môn hay Kỹ năng mềm của lập trình viên?",
      emoji: "💡",
      instructions: "Phân loại các kỹ năng cần thiết của người làm phần mềm vào Kỹ năng chuyên môn (Hard skills) hay Kỹ năng mềm (Soft skills)?",
      matchLabel: "Kỹ năng mềm (Soft skills)",
      matchEmoji: "🤝",
      noMatchLabel: "Kỹ năng chuyên môn (Hard skills)",
      noMatchEmoji: "💻",
      items: [
        { id: "kn-code", emoji: "⌨️", label: "Thành thạo ngôn ngữ lập trình Python, Java, JavaScript", isMatch: false, explain: "Kỹ năng chuyên môn kỹ thuật." },
        { id: "kn-team", emoji: "👥", label: "Làm việc nhóm và lắng nghe ý kiến đồng nghiệp", isMatch: true, explain: "Kỹ năng mềm giao tiếp và phối hợp." },
        { id: "kn-db", emoji: "🗄️", label: "Hiểu biết cấu trúc dữ liệu và truy vấn cơ sở dữ liệu SQL", isMatch: false, explain: "Kỹ năng chuyên môn công nghệ thông tin." },
        { id: "kn-time", emoji: "⏰", label: "Quản lý thời gian cá nhân và chịu được áp lực hạn chót", isMatch: true, explain: "Kỹ năng mềm kỷ luật và tổ chức công việc." },
      ]
    },
    {
      kind: "timeline",
      id: "vong-doi-phan-mem",
      title: "Vòng đời phát triển phần mềm (SDLC)",
      emoji: "🔄",
      instructions: "Sắp xếp các giai đoạn phát triển phần mềm theo đúng trình tự khoa học chuẩn quốc tế!",
      items: [
        { id: "sd-1", emoji: "1️⃣", label: "Khảo sát và Phân tích yêu cầu khách hàng", year: "Giai đoạn 1", explain: "Tìm hiểu xem khách hàng muốn phần mềm làm được những gì." },
        { id: "sd-2", emoji: "2️⃣", label: "Thiết kế kiến trúc hệ thống và giao diện người dùng", year: "Giai đoạn 2", explain: "Lên bản vẽ kiến trúc cơ sở dữ liệu và màn hình." },
        { id: "sd-3", emoji: "3️⃣", label: "Lập trình và Viết mã nguồn (Coding)", year: "Giai đoạn 3", explain: "Hiện thực hóa thiết kế thành các dòng lệnh chạy được." },
        { id: "sd-4", emoji: "4️⃣", label: "Kiểm thử tìm lỗi và nghiệm thu chất lượng (Testing)", year: "Giai đoạn 4", explain: "Đảm bảo phần mềm chạy ổn định không có lỗi nghiêm trọng." },
        { id: "sd-5", emoji: "5️⃣", label: "Triển khai cài đặt và Bảo trì, nâng cấp định kỳ", year: "Giai đoạn 5", explain: "Đưa vào vận hành thực tế và hỗ trợ người dùng." },
      ]
    }
  ],

  "bai-18": [
    {
      kind: "sort",
      id: "quan-tri-he-thong-hay-mang",
      title: "Quản trị Hệ thống (SysAdmin) hay Quản trị Mạng (NetworkAdmin)?",
      emoji: "🖥️",
      instructions: "Phân loại nhiệm vụ: Công việc thiên về Quản trị máy chủ/hệ điều hành (SysAdmin) hay Thiết bị đường truyền mạng (NetworkAdmin)?",
      matchLabel: "Quản trị Mạng (Network Admin)",
      matchEmoji: "🌐",
      noMatchLabel: "Quản trị Hệ thống (System Admin)",
      noMatchEmoji: "🖥️",
      items: [
        { id: "sn-route", emoji: "🧭", label: "Cấu hình router, switch và định tuyến gói tin giữa các chi nhánh", isMatch: true, explain: "Nhiệm vụ cốt lõi của kỹ sư quản trị mạng." },
        { id: "sn-user", emoji: "👤", label: "Tạo tài khoản và phân quyền thư mục cho nhân viên mới trên máy chủ", isMatch: false, explain: "SysAdmin quản lý người dùng và dịch vụ máy chủ." },
        { id: "sn-wifi", emoji: "📶", label: "Lắp đặt điểm truy cập Wi-Fi và tối ưu sóng không dây trong tòa nhà", isMatch: true, explain: "Hạ tầng mạng không dây thuộc Network Admin." },
        { id: "sn-backup", emoji: "💾", label: "Sao lưu (Backup) dữ liệu máy chủ hàng ngày chống mất mát", isMatch: false, explain: "SysAdmin chịu trách nhiệm sao lưu dữ liệu hệ thống." },
      ]
    },
    {
      kind: "sort",
      id: "nhiem-vu-an-toan-thong-tin",
      title: "Hành động Bảo vệ An toàn hay Nguy cơ Rủi ro Bảo mật?",
      emoji: "🛡️",
      instructions: "Đánh giá các biện pháp quản trị mạng và hệ thống!",
      matchLabel: "Nguy cơ Rủi ro Bảo mật",
      matchEmoji: "⚠️",
      noMatchLabel: "Hành động Bảo vệ An toàn",
      noMatchEmoji: "🛡️",
      items: [
        { id: "an-firewall", emoji: "🧱", label: "Cài đặt tường lửa (Firewall) ngăn chặn các truy cập trái phép", isMatch: false, explain: "Biện pháp phòng vệ thiết yếu của người quản trị mạng." },
        { id: "an-pass-weak", emoji: "🔓", label: "Dùng chung một mật khẩu '123456' cho tất cả tài khoản quản trị", isMatch: true, explain: "Lỗ hổng bảo mật chết người." },
        { id: "an-patch", emoji: "🔄", label: "Cập nhật các bản vá lỗi bảo mật định kỳ cho hệ điều hành", isMatch: false, explain: "Hành động chuẩn mực bảo vệ an ninh mạng." },
        { id: "an-share-all", emoji: "📂", label: "Mở chia sẻ dữ liệu Everyone toàn quyền trên mạng không có mật khẩu", isMatch: true, explain: "Nguy cơ lộ lọt toàn bộ bí mật nội bộ." },
      ]
    },
    {
      kind: "sort",
      id: "chung-chi-nghe-nghiep",
      title: "Chứng chỉ Mạng quốc tế (Cisco/CCNA) hay Chứng chỉ Văn phòng (MOS)?",
      emoji: "📜",
      instructions: "Phân loại các chứng chỉ kỹ năng công nghệ thông tin!",
      matchLabel: "Chứng chỉ Mạng quốc tế (CCNA, CompTIA Network+)",
      matchEmoji: "🌐",
      noMatchLabel: "Chứng chỉ Tin học Văn phòng (MOS, ICDL)",
      noMatchEmoji: "📄",
      items: [
        { id: "cc-ccna", emoji: "🎖️", label: "Cisco Certified Network Associate (CCNA): Chuyên sâu thiết bị mạng", isMatch: true, explain: "Chứng chỉ mạng quốc tế uy tín hàng đầu của hãng Cisco." },
        { id: "cc-word", emoji: "📝", label: "Microsoft Office Specialist (MOS Word, Excel): Soạn thảo văn bản", isMatch: false, explain: "Chứng chỉ tin học văn phòng đại chúng." },
        { id: "cc-sec", emoji: "🔒", label: "CompTIA Security+: Kiến thức nền tảng an ninh mạng toàn cầu", isMatch: true, explain: "Chứng chỉ an toàn thông tin chuyên nghiệp." },
        { id: "cc-icdl", emoji: "🖥️", label: "ICDL: Kỹ năng sử dụng máy tính và internet căn bản", isMatch: false, explain: "Chứng chỉ chuẩn kỹ năng số phổ cập." },
      ]
    }
  ],

  "bai-19": [
    {
      kind: "sort",
      id: "dam-may-hay-tai-cho",
      title: "Điện toán đám mây (Cloud) hay Hạ tầng tại chỗ (On-Premise)?",
      emoji: "☁️",
      instructions: "Phân loại mô hình dịch vụ CNTT: Dịch vụ đám mây thuê ngoài hay Máy chủ tự đầu tư đặt tại văn phòng?",
      matchLabel: "Dịch vụ Đám mây (Cloud Computing)",
      matchEmoji: "☁️",
      noMatchLabel: "Hạ tầng tại chỗ (On-Premise)",
      noMatchEmoji: "🏢",
      items: [
        { id: "cp-ggdrive", emoji: "📁", label: "Google Drive, OneDrive: Lưu trữ dữ liệu trên mạng truy cập mọi nơi", isMatch: true, explain: "Dịch vụ lưu trữ đám mây SaaS." },
        { id: "cp-local", emoji: "🗄️", label: "Cụm máy chủ mua về đặt trong phòng máy có điều hòa riêng", isMatch: false, explain: "Hạ tầng tại chỗ On-premise tốn chi phí đầu tư ban đầu." },
        { id: "cp-aws", emoji: "🚀", label: "Thuê máy chủ ảo Amazon AWS, Google Cloud nâng cấp cấu hình tức thì", isMatch: true, explain: "Điện toán đám mây co giãn dung lượng linh hoạt theo nhu cầu." },
        { id: "cp-ups", emoji: "🔋", label: "Tự mua máy phát điện và bộ lưu điện UPS đề phòng mất điện văn phòng", isMatch: false, explain: "Đặc điểm của phòng máy chủ tại chỗ." },
      ]
    },
    {
      kind: "sort",
      id: "ho-tro-ky-thuat-helpdesk",
      title: "Hỗ trợ Kỹ thuật (Helpdesk) hay Chuyên gia Tư vấn Giải pháp?",
      emoji: "🎧",
      instructions: "Phân biệt nhiệm vụ của nhân viên Hỗ trợ người dùng (Helpdesk/IT Support) và Chuyên gia giải pháp (Solution Architect)?",
      matchLabel: "Chuyên gia Giải pháp (Consultant / Architect)",
      matchEmoji: "👔",
      noMatchLabel: "Hỗ trợ Kỹ thuật (IT Support / Helpdesk)",
      noMatchEmoji: "🛠️",
      items: [
        { id: "hd-printer", emoji: "🖨️", label: "Hỗ trợ nhân viên văn phòng cài driver máy in và sửa lỗi kẹt giấy", isMatch: false, explain: "Công việc hàng ngày của IT Support." },
        { id: "hd-erp", emoji: "💼", label: "Tư vấn cho ban giám đốc giải pháp chuyển đổi số toàn diện công ty", isMatch: true, explain: "Chuyên gia tư vấn chiến lược công nghệ." },
        { id: "hd-win", emoji: "💻", label: "Cài lại hệ điều hành Windows và phần mềm diệt virus cho máy tính bàn", isMatch: false, explain: "Kỹ thuật viên Helpdesk hỗ trợ phần cứng/phần mềm người dùng." },
        { id: "hd-cloud", emoji: "☁️", label: "Lập đề án chuyển đổi toàn bộ hệ thống sang đám mây tiết kiệm 30% chi phí", isMatch: true, explain: "Chuyên gia thiết kế kiến trúc giải pháp CNTT." },
      ]
    },
    {
      kind: "sort",
      id: "cac-mo-hinh-dich-vu-dam-may",
      title: "Mô hình SaaS (Phần mềm) hay IaaS (Hạ tầng)?",
      emoji: "🌐",
      instructions: "Phân loại mô hình dịch vụ: Phần mềm dùng ngay qua web (SaaS) hay Thuê hạ tầng máy chủ thô (IaaS)?",
      matchLabel: "Mô hình Hạ tầng (IaaS - Infrastructure as a Service)",
      matchEmoji: "🖥️",
      noMatchLabel: "Mô hình Phần mềm (SaaS - Software as a Service)",
      noMatchEmoji: "📦",
      items: [
        { id: "si-gmail", emoji: "✉️", label: "Gmail, Google Docs: Vào trình duyệt là dùng ngay không cần cài đặt", isMatch: false, explain: "SaaS là phần mềm dịch vụ hoàn chỉnh cho người dùng cuối." },
        { id: "si-vm", emoji: "💾", label: "Thuê máy chủ ảo trắng gồm CPU, RAM, ổ cứng rồi tự cài hệ điều hành", isMatch: true, explain: "IaaS cung cấp hạ tầng máy ảo cơ bản." },
        { id: "si-zoom", emoji: "📹", label: "Zoom, Microsoft Teams họp trực tuyến trả phí hàng tháng", isMatch: false, explain: "SaaS ứng dụng liên lạc đám mây." },
        { id: "si-storage", emoji: "🗄️", label: "Thuê 10 Terabyte dung lượng ổ cứng khối ảo trên đám mây", isMatch: true, explain: "IaaS hạ tầng lưu trữ." },
      ]
    }
  ],

  "bai-20": [
    {
      kind: "classify",
      id: "cac-nganh-dao-tao-cntt",
      title: "Các ngành đào tạo Đại học trong lĩnh vực CNTT",
      emoji: "🎓",
      instructions: "Xếp các đặc trưng đào tạo vào đúng ngành tương ứng tại các trường Đại học!",
      categories: [
        { id: "cs", emoji: "🧠", name: "Khoa học máy tính (Computer Science)", subtitle: "Thuật toán, Trí tuệ nhân tạo, Nền tảng lý thuyết" },
        { id: "se", emoji: "💻", name: "Kỹ thuật phần mềm (Software Engineering)", subtitle: "Quy trình làm ứng dụng, lập trình thực chiến" },
        { id: "is", emoji: "📊", name: "Hệ thống thông tin (Information Systems)", subtitle: "Kết nối công nghệ với nghiệp vụ kinh doanh" },
        { id: "isec", emoji: "🔒", name: "An toàn thông tin (Cyber Security)", subtitle: "Phòng chống hacker, mã hóa, an ninh mạng" }
      ],
      items: [
        { id: "nd-ai", label: "Nghiên cứu mô hình toán học và thuật toán học sâu cho Trí tuệ nhân tạo", categoryId: "cs", explain: "Khoa học máy tính chuyên sâu về thuật toán và AI." },
        { id: "nd-app", label: "Học cách viết ứng dụng di động Android/iOS theo chuẩn công nghiệp", categoryId: "se", explain: "Kỹ thuật phần mềm đào tạo kỹ sư làm app thực tế." },
        { id: "nd-bank", label: "Ứng dụng phần mềm quản lý kho và dòng tiền trong các ngân hàng", categoryId: "is", explain: "Hệ thống thông tin kết hợp CNTT với quản trị doanh nghiệp." },
        { id: "nd-hack", label: "Kỹ thuật phòng thủ và săn lỗ hổng bảo mật chống tội phạm mạng", categoryId: "isec", explain: "An toàn thông tin đào tạo chuyên gia an ninh mạng." },
      ]
    },
    {
      kind: "sort",
      id: "to-chat-nganh-cntt",
      title: "Tố chất cần có hay Quan niệm sai lầm về nghề CNTT?",
      emoji: "💡",
      instructions: "Đánh giá các nhận định về việc học và làm nghề Công nghệ thông tin!",
      matchLabel: "Quan niệm sai lầm (Cần tránh)",
      matchEmoji: "❌",
      noMatchLabel: "Tố chất phù hợp (Nên phát huy)",
      noMatchEmoji: "🌟",
      items: [
        { id: "tc-logic", emoji: "🧠", label: "Tư duy logic tốt, thích tìm tòi giải quyết vấn đề khúc mắc", isMatch: false, explain: "Tố chất vàng để học lập trình và công nghệ." },
        { id: "tc-fix", emoji: "🛠️", label: "Học CNTT ra trường là chỉ để đi cài win và sửa máy in dạo", isMatch: true, explain: "Quan niệm hạn hẹp sai lầm về ngành CNTT hiện đại." },
        { id: "tc-learn", emoji: "📖", label: "Khả năng tự học bền bỉ vì công nghệ liên tục thay đổi hàng năm", isMatch: false, explain: "Ngành CNTT đòi hỏi tinh thần học tập suốt đời." },
        { id: "tc-game", emoji: "🎮", label: "Chỉ cần thích chơi game giỏi là chắc chắn sẽ lập trình giỏi", isMatch: true, explain: "Chơi game và lập trình game là hai lĩnh vực hoàn toàn khác nhau." },
      ]
    },
    {
      kind: "sort",
      id: "moi-truong-lam-viec",
      title: "Môi trường Công ty công nghệ hay Làm việc tự do (Freelance)?",
      emoji: "🏢",
      instructions: "Phân biệt giữa làm việc tại Công ty công nghệ tập trung và Làm việc tự do (Freelancer)?",
      matchLabel: "Làm việc tự do (Freelancer)",
      matchEmoji: "🏖️",
      noMatchLabel: "Công ty công nghệ (Doanh nghiệp)",
      noMatchEmoji: "🏢",
      items: [
        { id: "mt-corp", emoji: "🏢", label: "Làm việc theo giờ hành chính, có bảo hiểm xã hội và phúc lợi công ty", isMatch: false, explain: "Môi trường doanh nghiệp ổn định." },
        { id: "mt-free", emoji: "☕", label: "Tự nhận dự án từ khách hàng nước ngoài, làm việc tại quán cà phê", isMatch: true, explain: "Đặc trưng linh hoạt của Freelancer." },
        { id: "mt-team", emoji: "👥", label: "Quy trình dự án lớn hàng trăm người cùng phối hợp bài bản", isMatch: false, explain: "Môi trường công ty phần mềm lớn." },
        { id: "mt-own", emoji: "🌍", label: "Tự quản lý thời gian và tự chịu trách nhiệm tìm kiếm dự án", isMatch: true, explain: "Freelancer tự chủ toàn bộ thu nhập và công việc." },
      ]
    }
  ],

  "bai-21": [
    {
      kind: "sort",
      id: "co-day-hay-khong-day",
      title: "Kết nối có dây hay Kết nối không dây?",
      emoji: "🔌",
      instructions: "Phân loại các chuẩn kết nối giữa các thiết bị số: Dùng dây cáp vật lý hay Dùng sóng không dây?",
      matchLabel: "Kết nối không dây (Wireless)",
      matchEmoji: "📶",
      noMatchLabel: "Kết nối có dây (Wired)",
      noMatchEmoji: "🔌",
      items: [
        { id: "ck-hdmi", emoji: "📺", label: "Cáp HDMI: Truyền hình ảnh và âm thanh chất lượng cao lên tivi", isMatch: false, explain: "Kết nối có dây truyền tín hiệu ổn định cao." },
        { id: "ck-blue", emoji: "🎧", label: "Bluetooth: Kết nối tai nghe không dây với điện thoại trong phạm vi 10m", isMatch: true, explain: "Sóng vô tuyến cự ly ngắn không dây." },
        { id: "ck-typec", emoji: "📱", label: "Cáp USB Type-C: Sạc pin và truyền tệp tốc độ cao giữa máy tính và điện thoại", isMatch: false, explain: "Chuẩn cắm cáp vật lý đa năng." },
        { id: "ck-wifi", emoji: "🌐", label: "Wi-Fi: Kết nối máy tính bảng vào mạng Internet qua sóng vô tuyến", isMatch: true, explain: "Mạng cục bộ không dây." },
        { id: "ck-nfc", emoji: "💳", label: "NFC: Chạm điện thoại thanh toán một chạm tại quầy siêu thị", isMatch: true, explain: "Giao tiếp trường gần không dây dưới 10cm." },
        { id: "ck-lan", emoji: "🧵", label: "Cáp mạng RJ45: Nối máy tính để bàn vào switch văn phòng", isMatch: false, explain: "Cáp mạng xoắn đôi có dây." },
      ]
    },
    {
      kind: "sort",
      id: "cong-hdmi-hay-usb",
      title: "Cổng HDMI hay Cổng USB?",
      emoji: "📺",
      instructions: "Phân biệt công năng chính: Cổng truyền hình ảnh/âm thanh màn hình (HDMI) hay Cổng truyền dữ liệu/ngoại vi (USB)?",
      matchLabel: "Cổng HDMI",
      matchEmoji: "📺",
      noMatchLabel: "Cổng USB",
      noMatchEmoji: "🔌",
      items: [
        { id: "hu-proj", emoji: "📽️", label: "Xuất hình ảnh bài thuyết trình từ laptop lên máy chiếu của lớp", isMatch: true, explain: "HDMI là cổng chuẩn xuất tín hiệu video/audio ra màn hình chiếu." },
        { id: "hu-mouse", emoji: "🖱️", label: "Cắm chuột, bàn phím và USB flash drive vào máy tính", isMatch: false, explain: "USB kết nối thiết bị ngoại vi và truyền dữ liệu." },
        { id: "hu-tv", emoji: "📺", label: "Cắm cáp nối tivi thông minh phòng khách để xem phim 4K sắc nét", isMatch: true, explain: "HDMI truyền tải độ phân giải cao kèm âm thanh vòm." },
        { id: "hu-charge", emoji: "🔋", label: "Cắm dây sạc pin và sao chép ảnh từ smartphone sang máy tính", isMatch: false, explain: "Cổng USB hỗ trợ cấp nguồn và truyền file." },
      ]
    },
    {
      kind: "sort",
      id: "bluetooth-hay-wifi",
      title: "Sóng Bluetooth hay Sóng Wi-Fi?",
      emoji: "📶",
      instructions: "Phân biệt hai công nghệ không dây quen thuộc trên điện thoại thông minh: Bluetooth hay Wi-Fi?",
      matchLabel: "Sóng Wi-Fi",
      matchEmoji: "🌐",
      noMatchLabel: "Sóng Bluetooth",
      noMatchEmoji: "🔵",
      items: [
        { id: "bw-short", emoji: "🎧", label: "Phạm vi ngắn khoảng dưới 10m, tiêu tốn rất ít năng lượng pin", isMatch: false, explain: "Bluetooth tối ưu cho thiết bị ngoại vi tiết kiệm pin." },
        { id: "bw-net", emoji: "🚀", label: "Băng thông rộng tốc độ cao, dùng để lướt web và xem video trực tuyến", isMatch: true, explain: "Wi-Fi cung cấp tốc độ mạng cao cho nhiều thiết bị." },
        { id: "bw-peer", emoji: "⌚", label: "Ghép đôi 1-1 trực tiếp giữa đồng hồ thông minh và điện thoại", isMatch: false, explain: "Bluetooth chuyên kết nối cặp thiết bị cá nhân." },
        { id: "bw-wap", emoji: "📶", label: "Kết nối thông qua bộ định tuyến không dây Access Point trong nhà", isMatch: true, explain: "Wi-Fi cần điểm truy cập WAP/Router." },
      ]
    }
  ],

  "bai-22": [
    {
      kind: "timeline",
      id: "cac-buoc-ghep-doi-bluetooth",
      title: "Các bước ghép đôi Bluetooth giữa hai thiết bị số",
      emoji: "🔵",
      instructions: "Sắp xếp đúng trình tự các bước ghép đôi Bluetooth (Pairing) an toàn giữa điện thoại và máy tính!",
      items: [
        { id: "bt-1", emoji: "1️⃣", label: "Bật kết nối Bluetooth và chế độ Cho phép tìm kiếm trên cả hai thiết bị", year: "Bước 1", explain: "Cần bật Bluetooth và cho phép quét thấy danh tính." },
        { id: "bt-2", emoji: "2️⃣", label: "Trên điện thoại, nhấn quét tìm và chọn đúng tên của thiết bị cần ghép", year: "Bước 2", explain: "Chọn đúng tên thiết bị mục tiêu trong danh sách quét được." },
        { id: "bt-3", emoji: "3️⃣", label: "Kiểm tra và xác nhận mã số PIN/Passkey trùng khớp trên cả hai màn hình", year: "Bước 3", explain: "Đối chiếu mã PIN để chống kết nối nhầm máy người lạ." },
        { id: "bt-4", emoji: "4️⃣", label: "Nhấn 'Ghép đôi' (Pair) và bắt đầu gửi nhận tệp dữ liệu", year: "Bước 4", explain: "Hoàn tất ghép đôi và truyền tệp an toàn." },
      ]
    },
    {
      kind: "sort",
      id: "che-do-usb-mtp-hay-sac",
      title: "Chế độ Truyền tệp (MTP) hay Chỉ sạc pin qua USB?",
      emoji: "🔌",
      instructions: "Khi cắm cáp USB nối điện thoại vào máy tính: Chọn chế độ Truyền tệp (MTP) hay Chỉ sạc pin (Charging only)?",
      matchLabel: "Chế độ Truyền tệp (MTP / File Transfer)",
      matchEmoji: "📁",
      noMatchLabel: "Chỉ sạc pin (No data transfer)",
      noMatchEmoji: "⚡",
      items: [
        { id: "mtp-copy", emoji: "💻", label: "Máy tính nhận diện được bộ nhớ trong của điện thoại để sao chép ảnh", isMatch: true, explain: "Chế độ MTP mở cổng truyền file hai chiều." },
        { id: "mtp-safe", emoji: "🛡️", label: "Cắm nhờ dây sạc tại các trụ sạc công cộng ở sân bay để tránh bị cài mã độc", isMatch: false, explain: "Nên chọn Chỉ sạc pin ở nơi công cộng để chống đánh cắp dữ liệu." },
        { id: "mtp-music", emoji: "🎵", label: "Chép danh sách bài hát từ máy tính sang thư mục Music trên điện thoại", isMatch: true, explain: "Cần quyền đọc ghi tệp của chế độ MTP." },
        { id: "mtp-power", emoji: "🔋", label: "Điện thoại chỉ nạp năng lượng cho pin mà máy tính không xem được ảnh", isMatch: false, explain: "Chế độ Chỉ sạc pin khóa toàn bộ luồng truyền tệp." },
      ]
    },
    {
      kind: "sort",
      id: "quick-share-hay-cloud",
      title: "Chia sẻ trực tiếp gần (Quick Share) hay Qua Đám mây (Drive)?",
      emoji: "📲",
      instructions: "Phân biệt phương thức chia sẻ tệp không dây: Quick Share / AirDrop (gần nhau) hay Đám mây Google Drive (qua Internet)?",
      matchLabel: "Qua Đám mây (Google Drive / Internet)",
      matchEmoji: "☁️",
      noMatchLabel: "Quick Share / AirDrop (Trực tiếp ở gần)",
      noMatchEmoji: "⚡",
      items: [
        { id: "qs-direct", emoji: "📶", label: "Bắn tệp ảnh tốc độ cực cao cho bạn ngồi cùng bàn mà không tốn dung lượng 4G", isMatch: false, explain: "Quick Share dùng kết hợp Bluetooth và Wi-Fi Direct truyền ngang hàng." },
        { id: "qs-far", emoji: "🌏", label: "Gửi tài liệu bài tập cho bạn đang ở tỉnh khác cách xa hàng trăm km", isMatch: true, explain: "Khoảng cách xa bắt buộc tải lên đám mây qua mạng Internet." },
        { id: "qs-offline", emoji: "🏖️", label: "Chia sẻ ảnh đi dã ngoại ở vùng núi cao không có sóng điện thoại hay Internet", isMatch: false, explain: "Quick Share truyền trực tiếp thiết bị với thiết bị không cần mạng ngoài." },
        { id: "qs-link", emoji: "🔗", label: "Tạo đường link để cả lớp 40 bạn cùng tải tài liệu ôn thi về máy", isMatch: true, explain: "Chia sẻ cho nhiều người qua liên kết đám mây là tối ưu nhất." },
      ]
    }
  ],

  "bai-23": [
    {
      kind: "sort",
      id: "uu-diem-google-sites",
      title: "Ưu điểm của Google Sites hay Hạn chế?",
      emoji: "🌐",
      instructions: "Đánh giá các đặc điểm của công cụ tạo web Google Sites trong SGK Tin học 12!",
      matchLabel: "Hạn chế cần lưu ý",
      matchEmoji: "⚠️",
      noMatchLabel: "Ưu điểm nổi trội",
      noMatchEmoji: "🌟",
      items: [
        { id: "gs-free", emoji: "💰", label: "Hoàn toàn miễn phí, đi kèm sẵn với tài khoản Google", isMatch: false, explain: "Ưu điểm — không mất phí mua tên miền hay máy chủ." },
        { id: "gs-drag", emoji: "🖱️", label: "Kéo thả trực quan, không cần phải thuộc cú pháp mã HTML/CSS", isMatch: false, explain: "Ưu điểm — học sinh dễ dàng xây dựng trang web nhanh chóng." },
        { id: "gs-code", emoji: "⚙️", label: "Không can thiệp sâu được vào mã nguồn để tạo hiệu ứng lập trình phức tạp", isMatch: true, explain: "Hạn chế — bị giới hạn trong các khối mẫu của Google." },
        { id: "gs-drive", emoji: "📁", label: "Tích hợp hoàn hảo với Google Drive, Docs, Forms, YouTube", isMatch: false, explain: "Ưu điểm — dễ dàng chèn tài liệu và video từ hệ sinh thái Google." },
      ]
    },
    {
      kind: "sort",
      id: "dieu-kien-dung-sites",
      title: "Điều kiện cần để tạo web Google Sites?",
      emoji: "🔑",
      instructions: "Học sinh cần chuẩn bị gì để có thể bắt đầu thiết kế website với Google Sites?",
      matchLabel: "KHÔNG bắt buộc (Không cần)",
      matchEmoji: "❌",
      noMatchLabel: "BẮT BUỘC phải có",
      noMatchEmoji: "✅",
      items: [
        { id: "dk-acc", emoji: "👤", label: "Một tài khoản Google (Gmail) cá nhân hoặc tài khoản trường cấp", isMatch: false, explain: "Bắt buộc — Google Sites quản lý trang web trên Google Drive." },
        { id: "dk-browser", emoji: "🌐", label: "Máy tính có kết nối Internet và trình duyệt web (Chrome, Edge...)", isMatch: false, explain: "Bắt buộc — Google Sites chạy trực tiếp trên nền tảng web." },
        { id: "dk-pay", emoji: "💳", label: "Thẻ ngân hàng để trả phí thuê máy chủ hàng tháng", isMatch: true, explain: "Không cần — Google Sites miễn phí hoàn toàn." },
        { id: "dk-soft", emoji: "💿", label: "Cài đặt phần mềm lập trình chuyên dụng dung lượng nặng lên máy", isMatch: true, explain: "Không cần — làm việc trực tuyến 100% trên trình duyệt." },
      ]
    },
    {
      kind: "sort",
      id: "vung-soan-thao-hay-thanh-cong-cu",
      title: "Vùng soạn thảo (Canvas) hay Bảng công cụ bên phải?",
      emoji: "🖥️",
      instructions: "Phân biệt giữa Vùng thiết kế chính (Canvas) và Bảng điều khiển 3 tab bên phải (Insert / Pages / Themes)!",
      matchLabel: "Bảng điều khiển bên phải (3 Tab)",
      matchEmoji: "🛠️",
      noMatchLabel: "Vùng thiết kế chính (Canvas)",
      noMatchEmoji: "🖥️",
      items: [
        { id: "vt-center", emoji: "🖼️", label: "Nơi hiển thị trực quan diện mạo của trang web đang làm", isMatch: false, explain: "Vùng chính giữa hiển thị trang web trực quan." },
        { id: "vt-insert", emoji: "📥", label: "Tab 'Chèn' (Insert): Chứa các khối nội dung, chữ, ảnh, nút bấm", isMatch: true, explain: "Bảng bên phải gồm 3 tab: Chèn (Insert), Trang (Pages), Giao diện (Themes)." },
        { id: "vt-pages", emoji: "📑", label: "Tab 'Trang' (Pages): Quản lý tạo thêm trang con và menu liên kết", isMatch: true, explain: "Tab Pages quản lý cấu trúc các trang." },
        { id: "vt-banner", emoji: "🏷️", label: "Khu vực gõ tiêu đề trang và chọn ảnh bìa banner trực tiếp", isMatch: false, explain: "Thao tác trực tiếp trên vùng Canvas." },
      ]
    }
  ],

  "bai-24": [
    {
      kind: "sort",
      id: "banner-hay-footer",
      title: "Biểu ngữ (Banner) hay Chân trang (Footer)?",
      emoji: "🏷️",
      instructions: "Phân biệt hai thành phần cố định trên trang web: Đầu trang (Banner) hay Chân trang (Footer)?",
      matchLabel: "Chân trang (Footer)",
      matchEmoji: "🔻",
      noMatchLabel: "Biểu ngữ đầu trang (Banner / Header)",
      noMatchEmoji: "🔺",
      items: [
        { id: "bf-top", emoji: "👑", label: "Nằm ở trên cùng, chứa tên trang web và hình ảnh bìa nổi bật", isMatch: false, explain: "Banner nằm trên đỉnh trang web tạo ấn tượng đầu tiên." },
        { id: "bf-bot", emoji: "📍", label: "Nằm ở đáy trang, chứa thông tin bản quyền, địa chỉ liên hệ trường học", isMatch: true, explain: "Footer đặt ở cuối cùng của trang." },
        { id: "bf-logo", emoji: "🏫", label: "Khu vực đặt biểu trưng Logo và Favicon nhận diện của trường", isMatch: false, explain: "Logo nằm ở góc trên bên trái của thanh biểu ngữ." },
        { id: "bf-copy", emoji: "©️", label: "Dòng chữ: 'Bản quyền © 2026 Trường THPT Na Rì - Thái Nguyên'", isMatch: true, explain: "Thông tin bản quyền luôn đặt ở chân trang Footer." },
      ]
    },
    {
      kind: "sort",
      id: "content-blocks-hay-thu-cong",
      title: "Dùng Khối nội dung mẫu (Content Blocks) hay Kéo thả thủ công?",
      emoji: "🧱",
      instructions: "Đánh giá lợi ích của tính năng 'Khối nội dung' (Content blocks) trong Google Sites!",
      matchLabel: "Lợi ích của Khối mẫu (Content Blocks)",
      matchEmoji: "✨",
      noMatchLabel: "Thao tác thủ công từng chữ",
      noMatchEmoji: "✍️",
      items: [
        { id: "cb-layout", emoji: "📐", label: "Tự động căn chỉnh ảnh và cột chữ cân đối, không bị lệch hàng", isMatch: true, explain: "Khối mẫu định sẵn tỷ lệ ảnh và chữ khoa học." },
        { id: "cb-speed", emoji: "⚡", label: "Chỉ một cú nhấp chuột là tạo xong bố cục 3 cột giới thiệu tin tức", isMatch: true, explain: "Tiết kiệm thời gian thiết kế tối đa." },
        { id: "cb-slow", emoji: "⏳", label: "Phải tự kéo từng hộp văn bản rồi tự co kéo kích thước cho bằng nhau", isMatch: false, explain: "Cách làm thủ công tốn thời gian và dễ lệch hàng." },
        { id: "cb-responsive", emoji: "📱", label: "Tự động co giãn tối ưu khi xem trên màn hình điện thoại di động", isMatch: true, explain: "Khối mẫu của Google được lập trình tương thích đa màn hình." },
      ]
    },
    {
      kind: "sort",
      id: "theme-hay-layout",
      title: "Giao diện chủ đề (Themes) hay Bố cục trang (Layout)?",
      emoji: "🎨",
      instructions: "Phân biệt giữa Tab Giao diện (Themes - đổi màu/font toàn bộ trang) và Bố cục (Layout - vị trí khối)?",
      matchLabel: "Tab Giao diện (Themes)",
      matchEmoji: "🎨",
      noMatchLabel: "Bố cục sắp xếp (Layout)",
      noMatchEmoji: "📐",
      items: [
        { id: "tl-color", emoji: "🌈", label: "Chọn bảng màu đồng bộ cho toàn bộ các thanh tiêu đề và nút bấm", isMatch: true, explain: "Theme đổi màu sắc thống nhất cho toàn website." },
        { id: "tl-font", emoji: "🔤", label: "Đổi kiểu phông chữ: Cổ điển, Hiện đại, Táo bạo trên cả website", isMatch: true, explain: "Theme kiểm soát font chữ toàn cục." },
        { id: "tl-pos", emoji: "↔️", label: "Kéo một bức ảnh sang bên phải và đẩy đoạn văn sang bên trái", isMatch: false, explain: "Thao tác chỉnh bố cục layout." },
        { id: "tl-theme", emoji: "✨", label: "Chọn mẫu giao diện có sẵn như: Aristotle, Diplomat, Vision", isMatch: true, explain: "Các theme tích hợp sẵn của Google Sites." },
      ]
    }
  ],

  "bai-25": [
    {
      kind: "classify",
      id: "nguon-tep-da-phuong-tien",
      title: "Nguồn tệp nhúng vào website Google Sites",
      emoji: "📥",
      instructions: "Xếp các loại tệp nhúng vào đúng dịch vụ lưu trữ tương ứng trong hệ sinh thái Google!",
      categories: [
        { id: "drive", emoji: "📁", name: "Google Drive", subtitle: "Tài liệu Docs, Bảng tính Sheets, Trình chiếu Slides" },
        { id: "youtube", emoji: "▶️", name: "YouTube", subtitle: "Video clip âm thanh và hình ảnh chuyển động" },
        { id: "maps", emoji: "🗺️", name: "Google Maps", subtitle: "Bản đồ số định vị tọa độ và dẫn đường" }
      ],
      items: [
        { id: "np-doc", label: "Nhúng file Word nội quy trường học để học sinh xem trực tiếp", categoryId: "drive", explain: "File tài liệu lưu trên Google Drive." },
        { id: "np-yt", label: "Video clip giới thiệu các hoạt động ngày hội Đoàn trường", categoryId: "youtube", explain: "Video nhúng trực tiếp từ YouTube mượt mà không tốn dung lượng web." },
        { id: "np-map", label: "Bản đồ tương tác chỉ đường tới trường THPT Na Rì", categoryId: "maps", explain: "Bản đồ vệ tinh/giao thông dùng Google Maps." },
        { id: "np-slide", label: "Bài giảng trình chiếu PowerPoint/Google Slides cho học sinh tự học", categoryId: "drive", explain: "Slide nhúng từ Google Drive." },
      ]
    },
    {
      kind: "sort",
      id: "quyen-chia-se-drive",
      title: "Quyền 'Bất kì ai có liên kết' hay 'Hạn chế' khi nhúng tệp?",
      emoji: "🔐",
      instructions: "Để người khác vào website xem được tài liệu nhúng từ Google Drive: Cần đặt quyền chia sẻ nào?",
      matchLabel: "Hạn chế (Chỉ người được mời)",
      matchEmoji: "🔒",
      noMatchLabel: "Bất kì ai có liên kết (Công khai xem)",
      noMatchEmoji: "🌍",
      items: [
        { id: "qc-public", emoji: "✅", label: "Mọi học sinh truy cập website đều mở xem và tải được tài liệu", isMatch: false, explain: "Cần đặt quyền 'Bất kì ai có đường liên kết' ở chế độ Người xem." },
        { id: "qc-lock", emoji: "🚫", label: "Người ngoài vào xem trang web bị hiện bảng thông báo 'Yêu cầu quyền truy cập'", isMatch: true, explain: "Lỗi kinh điển do quên chia sẻ công khai tệp trên Drive." },
        { id: "qc-view", emoji: "👁️", label: "Quyền Người xem (Viewer): Chỉ cho xem, không cho sửa tệp gốc", isMatch: false, explain: "Mức quyền an toàn nhất khi nhúng tài liệu công cộng." },
        { id: "qc-edit", emoji: "⚠️", label: "Cấp quyền Người chỉnh sửa (Editor) cho người lạ tùy tiện sửa tệp", isMatch: true, explain: "Rủi ro bị người lạ phá hoại hoặc sửa nội dung tài liệu gốc." },
      ]
    },
    {
      kind: "sort",
      id: "nhung-link-hay-iframe",
      title: "Nhúng bằng Đường dẫn URL hay Mã nhúng HTML Embed?",
      emoji: "🔗",
      instructions: "Phân biệt hai cách nhúng nội dung bên ngoài vào Google Sites: Nhập link URL hay Dán mã nhúng <iframe>?",
      matchLabel: "Dán mã nhúng HTML (<iframe embed>)",
      matchEmoji: "💻",
      noMatchLabel: "Nhập đường dẫn trực tiếp (URL)",
      noMatchEmoji: "🔗",
      items: [
        { id: "ni-url", emoji: "🌐", label: "Dán đường link: https://www.youtube.com/watch?v=abcxyz", isMatch: false, explain: "Chỉ cần dán link URL trực tiếp là Google Sites tự nhận diện video." },
        { id: "ni-code", emoji: "🏷️", label: "Dán đoạn mã: <iframe src='...' width='600' height='400'></iframe>", isMatch: true, explain: "Tính năng 'Nhúng mã' (Embed code) cho phép chèn mã HTML tùy biến." },
        { id: "ni-web", emoji: "📍", label: "Nhập địa chỉ web của trang báo giáo dục cần trích dẫn", isMatch: false, explain: "Nhúng bằng URL." },
        { id: "ni-widget", emoji: "🌦️", label: "Mã tiện ích dự báo thời tiết hoặc đồng hồ đếm ngược từ bên thứ ba", isMatch: true, explain: "Tiện ích ngoài thường cấp một đoạn mã nhúng iframe." },
      ]
    }
  ],

  "bai-26": [
    {
      kind: "sort",
      id: "trang-chu-hay-trang-con",
      title: "Trang chủ (Home) hay Trang con (Subpage)?",
      emoji: "📑",
      instructions: "Phân loại vị trí phân cấp các trang trong cấu trúc website trường học!",
      matchLabel: "Trang con (Subpage / Cấp 2)",
      matchEmoji: "📂",
      noMatchLabel: "Trang chủ (Trang gốc / Cấp 1)",
      noMatchEmoji: "🏠",
      items: [
        { id: "tc-home", emoji: "🏠", label: "Trang đầu tiên mở ra khi người dùng truy cập địa chỉ website", isMatch: false, explain: "Trang chủ là trang mặt tiền chính của website." },
        { id: "tc-sub1", emoji: "📄", label: "Trang 'Câu lạc bộ Tin học' nằm lồng bên trong trang 'Đoàn trường'", isMatch: true, explain: "Trang con cấp 2 nằm dưới mục cha." },
        { id: "tc-root", emoji: "👑", label: "Biểu tượng ngôi nhà trên menu điều hướng chính", isMatch: false, explain: "Trang chủ thường có biểu tượng Home." },
        { id: "tc-sub2", emoji: "📝", label: "Trang 'Kỷ yếu lớp 12A1' nằm bên trong chuyên mục 'Khối 12'", isMatch: true, explain: "Trang phân cấp chi tiết." },
      ]
    },
    {
      kind: "sort",
      id: "top-nav-hay-side-nav",
      title: "Menu trên đỉnh (Top nav) hay Menu bên hông (Side nav)?",
      emoji: "🧭",
      instructions: "Phân biệt hai kiểu bố cục thanh điều hướng Menu trên Google Sites!",
      matchLabel: "Thanh bên hông (Side Navigation)",
      matchEmoji: "📑",
      noMatchLabel: "Thanh trên đỉnh (Top Navigation)",
      noMatchEmoji: "🔝",
      items: [
        { id: "ts-top", emoji: "🔝", label: "Các nút chuyển trang nằm trải dài thành hàng ngang trên đầu website", isMatch: false, explain: "Top navigation phù hợp khi website có ít trang (dưới 5 trang)." },
        { id: "ts-side", emoji: "📑", label: "Menu dạng nút 3 gạch mở ra bảng trượt dọc bên trái màn hình", isMatch: true, explain: "Side navigation phù hợp khi website có nhiều trang và nhiều cấp con." },
        { id: "ts-few", emoji: "👀", label: "Người xem nhìn thấy ngay toàn bộ các mục mà không cần bấm thêm", isMatch: false, explain: "Ưu điểm của menu ngang trên đỉnh." },
        { id: "ts-tree", emoji: "🌳", label: "Hiển thị cây phân cấp đa tầng gọn gàng không sợ tràn màn hình ngang", isMatch: true, explain: "Ưu điểm của menu thanh bên." },
      ]
    },
    {
      kind: "sort",
      id: "lien-ket-noi-hay-ngoai-sites",
      title: "Chuyển trang nội bộ hay Thoát ra ngoài website?",
      emoji: "🔗",
      instructions: "Đánh giá hướng điều hướng của các nút bấm trên website!",
      matchLabel: "Thoát ra ngoài Internet",
      matchEmoji: "🌐",
      noMatchLabel: "Chuyển trang nội bộ trong web",
      noMatchEmoji: "🏠",
      items: [
        { id: "ln-intro", emoji: "📄", label: "Nút bấm 'Xem giới thiệu' nhảy sang trang gioithieu trên cùng site", isMatch: false, explain: "Điều hướng nội bộ giữ chân người dùng trong trang." },
        { id: "ln-moet", emoji: "🏛️", label: "Nút liên kết dẫn sang Cổng thông tin Bộ Giáo dục và Đào tạo", isMatch: true, explain: "Liên kết ngoài dẫn sang website cơ quan cấp trên." },
        { id: "ln-contact", emoji: "📞", label: "Bấm vào menu 'Liên hệ' nhảy sang trang form liên hệ của trường", isMatch: false, explain: "Trang con nội bộ." },
        { id: "ln-fb", emoji: "👥", label: "Bấm vào biểu tượng Facebook chuyển sang ứng dụng mạng xã hội", isMatch: true, explain: "Liên kết ra nền tảng mạng ngoài." },
      ]
    }
  ],

  "bai-27": [
    {
      kind: "sort",
      id: "forms-hay-sheets",
      title: "Google Forms (Biểu mẫu) hay Google Sheets (Bảng tính)?",
      emoji: "📊",
      instructions: "Phân biệt nhiệm vụ: Thu thập ý kiến của người xem (Forms) hay Lưu trữ và thống kê kết quả (Sheets)?",
      matchLabel: "Google Sheets (Bảng tính lưu trữ)",
      matchEmoji: "📈",
      noMatchLabel: "Google Forms (Biểu mẫu thu thập)",
      noMatchEmoji: "📝",
      items: [
        { id: "fs-input", emoji: "✍️", label: "Giao diện các câu hỏi để học sinh điền họ tên và tích chọn ý kiến", isMatch: false, explain: "Forms là giao diện thu thập dữ liệu người dùng." },
        { id: "fs-grid", emoji: "📊", label: "Bảng dữ liệu hàng cột tự động ghi lại câu trả lời theo thời gian thực", isMatch: true, explain: "Sheets lưu trữ kết quả gửi về từ biểu mẫu." },
        { id: "fs-chart", emoji: "🥧", label: "Vẽ biểu đồ tròn phân tích tỷ lệ phần trăm các ý kiến đóng góp", isMatch: true, explain: "Tính năng phân tích thống kê của Sheets." },
        { id: "fs-embed", emoji: "📥", label: "Nhúng trực tiếp vào website để người xem bấm 'Gửi' (Submit)", isMatch: false, explain: "Biểu mẫu Forms nhúng vào web để tương tác." },
      ]
    },
    {
      kind: "sort",
      id: "cau-hoi-mot-hay-nhieu-lua-chon",
      title: "Trắc nghiệm 1 đáp án (Radio) hay Hộp kiểm nhiều đáp án (Checkbox)?",
      emoji: "🔘",
      instructions: "Khi thiết kế câu hỏi khảo sát trong Google Forms: Chọn loại Trắc nghiệm một lựa chọn hay Hộp kiểm nhiều lựa chọn?",
      matchLabel: "Hộp kiểm nhiều đáp án (Checkboxes)",
      matchEmoji: "☑️",
      noMatchLabel: "Trắc nghiệm 1 đáp án (Multiple choice)",
      noMatchEmoji: "🔘",
      items: [
        { id: "mc-class", emoji: "🏫", label: "Em đang học khối lớp nào: Khối 10, Khối 11 hay Khối 12?", isMatch: false, explain: "Mỗi học sinh chỉ thuộc 1 khối lớp duy nhất." },
        { id: "mc-interest", emoji: "🎨", label: "Những chủ đề em quan tâm: Thể thao, Âm nhạc, Tin học, Đọc sách", isMatch: true, explain: "Có thể chọn nhiều sở thích cùng lúc." },
        { id: "mc-rate", emoji: "⭐", label: "Mức độ hài lòng của em về website: Rất hài lòng, Hài lòng, Chưa hài lòng", isMatch: false, explain: "Đánh giá mức độ chọn duy nhất 1 mức." },
        { id: "mc-skills", emoji: "💡", label: "Các kỹ năng em muốn phát triển thêm: Lập trình, Thuyết trình, Tiếng Anh", isMatch: true, explain: "Được chọn nhiều kỹ năng muốn rèn luyện." },
      ]
    },
    {
      kind: "sort",
      id: "nhung-form-hay-gui-link",
      title: "Nhúng Form trực tiếp vào web hay Gửi link Form ngoài?",
      emoji: "📥",
      instructions: "Đánh giá trải nghiệm người dùng: Nhúng form vào trang web hay gửi đường link riêng?",
      matchLabel: "Nhúng Form trực tiếp trong trang web",
      matchEmoji: "🌟",
      noMatchLabel: "Mở đường link rời ở tab khác",
      noMatchEmoji: "↗️",
      items: [
        { id: "nf-stay", emoji: "🏠", label: "Người xem điền phản hồi ngay tại chỗ mà không bị rời khỏi website trường", isMatch: true, explain: "Trải nghiệm liền mạch và giữ chân người truy cập." },
        { id: "nf-leave", emoji: "🚪", label: "Người dùng phải bấm mở tab mới, dễ bị xao nhãng và quên quay lại", isMatch: false, explain: "Bất tiện khi gửi link rời." },
        { id: "nf-auto", emoji: "📱", label: "Biểu mẫu tự động co giãn vừa vặn với kích thước màn hình đang xem", isMatch: true, explain: "Google Forms nhúng tương thích giao diện web rất tốt." },
        { id: "nf-copy", emoji: "📋", label: "Phải sao chép đường dẫn dài dằng dặc gửi cho từng người", isMatch: false, explain: "Bất tiện trong việc chia sẻ." },
      ]
    }
  ],

  "bai-28": [
    {
      kind: "timeline",
      id: "quy-trinh-5-buoc-hoan-thien-web",
      title: "Quy trình 5 bước xây dựng và hoàn thiện website Google Sites",
      emoji: "🛠️",
      instructions: "Sắp xếp theo đúng trình tự khoa học 5 bước hoàn thiện website dự án môn Tin học 12!",
      items: [
        { id: "q5-1", emoji: "1️⃣", label: "Bước 1: Chọn chủ đề và Lập dàn ý cấu trúc cây các trang web", year: "Bước 1", explain: "Xác định rõ đề tài và các trang cần tạo." },
        { id: "q5-2", emoji: "2️⃣", label: "Bước 2: Thu thập và Chuẩn bị tư liệu văn bản, ảnh, video, form", year: "Bước 2", explain: "Chuẩn bị sẵn nội dung vào thư mục Google Drive." },
        { id: "q5-3", emoji: "3️⃣", label: "Bước 3: Xây dựng và Thiết kế website trên Google Sites", year: "Bước 3", explain: "Dùng các khối nội dung, theme và điều hướng để tạo trang." },
        { id: "q5-4", emoji: "4️⃣", label: "Bước 4: Xem trước (Preview) kiểm thử giao diện và đường link", year: "Bước 4", explain: "Kiểm tra trên màn hình máy tính, máy tính bảng và điện thoại." },
        { id: "q5-5", emoji: "5️⃣", label: "Bước 5: Công bố (Publish) và Chia sẻ website lên Internet", year: "Bước 5", explain: "Xuất bản website để người khác có thể truy cập trực tuyến." },
      ]
    },
    {
      kind: "classify",
      id: "ba-che-do-xem-truoc-preview",
      title: "3 chế độ màn hình khi Xem trước (Preview) trên Google Sites",
      emoji: "📱",
      instructions: "Xếp các đặc điểm kiểm thử vào đúng chế độ màn hình xem trước!",
      categories: [
        { id: "pc", emoji: "💻", name: "Màn hình lớn (Máy tính bàn/Laptop)", subtitle: "Độ phân giải rộng, menu ngang đầy đủ" },
        { id: "tablet", emoji: "📟", name: "Máy tính bảng (Tablet)", subtitle: "Màn hình trung bình dọc hoặc ngang" },
        { id: "phone", emoji: "📱", name: "Điện thoại thông minh (Phone)", subtitle: "Màn hình dọc hẹp, menu chuyển sang 3 gạch" }
      ],
      items: [
        { id: "pv-pc", label: "Kiểm tra giao diện chuẩn cho thầy cô và học sinh ngồi phòng máy tính", categoryId: "pc", explain: "Chế độ màn hình lớn Large screen." },
        { id: "pv-phone", label: "Kiểm tra xem menu có tự co thành nút 3 gạch và ảnh có bị tràn mép không", categoryId: "phone", explain: "Chế độ xem trước trên điện thoại Phone view." },
        { id: "pv-tab", label: "Kiểm tra bố cục 2 cột hiển thị vừa vặn trên màn hình iPad/Tablet", categoryId: "tablet", explain: "Chế độ xem trước trên máy tính bảng Tablet view." },
        { id: "pv-tap", label: "Đảm bảo các nút bấm đủ to để học sinh dễ chạm ngón tay trên điện thoại", categoryId: "phone", explain: "Tối ưu tương tác cảm ứng cho điện thoại." },
      ]
    },
    {
      kind: "sort",
      id: "cong-bo-va-chinh-sua",
      title: "Bản nháp cá nhân hay Trang web đã công bố (Published)?",
      emoji: "🚀",
      instructions: "Phân biệt giữa Bản thiết kế nháp và Website đã xuất bản trực tuyến trên Google Sites!",
      matchLabel: "Đã xuất bản (Published - Mọi người xem được)",
      matchEmoji: "🌍",
      noMatchLabel: "Bản nháp (Draft - Chỉ người tạo xem được)",
      noMatchEmoji: "🔒",
      items: [
        { id: "cp-edit", emoji: "✍️", label: "Vừa sửa xong bài viết trên trang web nhưng chưa bấm nút 'Công bố'", isMatch: false, explain: "Khi chưa bấm Công bố, thay đổi mới chỉ lưu ở dạng bản nháp." },
        { id: "cp-link", emoji: "🔗", label: "Có địa chỉ web: https://sites.google.com/view/ten-trang để gửi cho thầy cô", isMatch: true, explain: "Địa chỉ công khai sau khi xuất bản." },
        { id: "cp-again", emoji: "🔄", label: "Cần nhấn nút 'Công bố' lại mỗi khi hoàn thành chỉnh sửa mới", isMatch: true, explain: "Bắt buộc công bố lại để cập nhật thay đổi mới lên Internet." },
        { id: "cp-private", emoji: "👀", label: "Người khác truy cập báo lỗi không tìm thấy trang hoặc bị chặn quyền", isMatch: false, explain: "Dấu hiệu trang web chưa được bấm xuất bản công khai." },
      ]
    }
  ]
};

async function generateAllGames() {
  console.log('🚀 Bắt đầu tạo dữ liệu 3 game cho tất cả các bài từ Bài 7 đến Bài 28...');
  let count = 0;

  for (const [baiId, games] of Object.entries(ALL_GAMES)) {
    const filePath = path.join(process.cwd(), 'data', 'games', `${baiId}.ts`);
    
    // Tạo mã TypeScript cho file game
    const content = `import type { LessonGame, SortGame, TimelineGame, ClassifyGame } from "@/lib/types";

// 3 trò chơi ôn bài tương tác chuẩn SGK Tin học 12 (Kết nối tri thức)
const games: LessonGame[] = ${JSON.stringify(games, null, 2)};

export default games;
`;

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Đã tạo 3 game cho ${baiId}.ts`);
    count++;
  }

  // Cập nhật lại lib/games.ts để đăng ký toàn bộ 28 bài học!
  const allLessonIds = Array.from({ length: 28 }, (_, i) => {
    const num = String(i + 1).padStart(2, '0');
    return `bai-${num}`;
  });

  const imports = allLessonIds.map(id => `import ${id.replace('-', '')} from "@/data/games/${id}";`).join('\n');
  const bankEntries = allLessonIds.map(id => `  "${id}": ${id.replace('-', '')},`).join('\n');

  const libGamesContent = `import type { LessonGame } from "@/lib/types";

// Ngân hàng game tương tác gắn với từng bài — Hoàn thiện đầy đủ 28/28 bài học (3 game/bài)
${imports}

export const GAME_BANK: Record<string, LessonGame[]> = {
${bankEntries}
};

export function getLessonGames(lessonId: string): LessonGame[] {
  return GAME_BANK[lessonId] ?? [];
}
`;

  fs.writeFileSync(path.join(process.cwd(), 'lib', 'games.ts'), libGamesContent, 'utf-8');
  console.log(`🎉 Đã cập nhật lib/games.ts đăng ký đầy đủ 28/28 bài học!`);
}

generateAllGames().catch(err => console.error(err));

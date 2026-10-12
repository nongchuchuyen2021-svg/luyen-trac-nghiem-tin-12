import type { LessonGame, SortGame, TimelineGame, ClassifyGame } from "@/lib/types";

// 3 trò chơi ôn bài tương tác chuẩn SGK Tin học 12 (Kết nối tri thức)
const games: LessonGame[] = [
  {
    "kind": "sort",
    "id": "ol-hay-ul",
    "title": "Danh sách có thứ tự <ol> hay Không thứ tự <ul>?",
    "emoji": "📋",
    "instructions": "Kéo từng tình huống sang đúng kiểu danh sách: Danh sách có thứ tự số (<ol>) hay Danh sách có dấu đầu dòng (<ul>)?",
    "matchLabel": "Có thứ tự (<ol> - Ordered List)",
    "matchEmoji": "🔢",
    "noMatchLabel": "Không thứ tự (<ul> - Unordered List)",
    "noMatchEmoji": "🔘",
    "items": [
      {
        "id": "ds-buoc",
        "emoji": "👣",
        "label": "Các bước nấu ăn theo thứ tự: Bước 1, Bước 2, Bước 3",
        "isMatch": true,
        "explain": "Cần thứ tự tuần tự rõ ràng nên dùng <ol>."
      },
      {
        "id": "ds-mon-an",
        "emoji": "🍎",
        "label": "Danh sách các loại quả yêu thích: Táo, Lê, Cam",
        "isMatch": false,
        "explain": "Thứ tự không quan trọng, dùng <ul> với dấu chấm tròn."
      },
      {
        "id": "ds-top",
        "emoji": "🏆",
        "label": "Bảng xếp hạng 5 học sinh đạt điểm cao nhất",
        "isMatch": true,
        "explain": "Có thứ hạng từ 1 đến 5 nên dùng <ol>."
      },
      {
        "id": "ds-dung-cu",
        "emoji": "🎒",
        "label": "Đồ dùng học tập cần mang: Bút, Thước, Vở",
        "isMatch": false,
        "explain": "Liệt kê không phân biệt trước sau, dùng <ul>."
      },
      {
        "id": "ds-quy-trinh",
        "emoji": "⚙️",
        "label": "Quy trình 5 bước xây dựng trang web của lớp",
        "isMatch": true,
        "explain": "Quy trình thực hiện tuần tự bắt buộc dùng <ol>."
      },
      {
        "id": "ds-so-thich",
        "emoji": "⚽",
        "label": "Các môn thể thao giải trí cuối tuần",
        "isMatch": false,
        "explain": "Sở thích cá nhân không sắp xếp, dùng <ul>."
      }
    ]
  },
  {
    "kind": "classify",
    "id": "cac-the-tao-bang",
    "title": "Các thẻ cấu thành Bảng trong HTML",
    "emoji": "📊",
    "instructions": "Xếp từng mô tả vào đúng thẻ tạo bảng tương ứng!",
    "categories": [
      {
        "id": "table",
        "emoji": "🔲",
        "name": "<table>",
        "subtitle": "Khung bảng tổng thể"
      },
      {
        "id": "tr",
        "emoji": "↔️",
        "name": "<tr>",
        "subtitle": "Dòng / Hàng ngang"
      },
      {
        "id": "th",
        "emoji": "📌",
        "name": "<th>",
        "subtitle": "Ô tiêu đề cột"
      },
      {
        "id": "td",
        "emoji": "📝",
        "name": "<td>",
        "subtitle": "Ô dữ liệu thông thường"
      }
    ],
    "items": [
      {
        "id": "b-khung",
        "label": "Bao bọc toàn bộ nội dung của bảng từ đầu đến cuối",
        "categoryId": "table",
        "explain": "Thẻ <table> là thẻ cha ngoài cùng của bảng."
      },
      {
        "id": "b-dong",
        "label": "Đại diện cho một hàng ngang (Table Row) trong bảng",
        "categoryId": "tr",
        "explain": "<tr> là viết tắt của Table Row."
      },
      {
        "id": "b-td-cot",
        "label": "Chữ mặc định in đậm và căn giữa ô (Table Header)",
        "categoryId": "th",
        "explain": "<th> dùng cho ô tiêu đề của từng cột."
      },
      {
        "id": "b-o-du-lieu",
        "label": "Chứa dữ liệu nội dung, chữ căn lề trái bình thường",
        "categoryId": "td",
        "explain": "<td> là Table Data, chứa thông tin chi tiết."
      },
      {
        "id": "b-tr-con",
        "label": "Nằm bên trong <tr> để tạo ra các cột trên dòng đó",
        "categoryId": "td",
        "explain": "Các ô <td> được đặt bên trong <tr>."
      },
      {
        "id": "b-hang-dau",
        "label": "Hàng trên cùng thường chứa nhóm các thẻ này để đặt tên cột",
        "categoryId": "th",
        "explain": "Hàng đầu tiên thường dùng <th> thay vì <td>."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "colspan-hay-rowspan",
    "title": "Gộp cột (colspan) hay Gộp hàng (rowspan)?",
    "emoji": "📐",
    "instructions": "Phân biệt hai thuộc tính gộp ô kinh điển của bảng HTML: Gộp nhiều cột ngang (colspan) hay Gộp nhiều hàng dọc (rowspan)?",
    "matchLabel": "Gộp hàng dọc (rowspan)",
    "matchEmoji": "↕️",
    "noMatchLabel": "Gộp cột ngang (colspan)",
    "noMatchEmoji": "↔️",
    "items": [
      {
        "id": "cr-col2",
        "emoji": "↔️",
        "label": "colspan=\"2\": Một ô trải dài qua 2 cột kế bên nhau",
        "isMatch": false,
        "explain": "colspan gộp cột theo chiều ngang."
      },
      {
        "id": "cr-row3",
        "emoji": "↕️",
        "label": "rowspan=\"3\": Một ô trải dài xuống 3 hàng phía dưới",
        "isMatch": true,
        "explain": "rowspan gộp hàng theo chiều dọc."
      },
      {
        "id": "cr-tieu-de-nhom",
        "emoji": "📑",
        "label": "Tiêu đề chung cho cả 2 cột 'Điểm Toán' và 'Điểm Văn'",
        "isMatch": false,
        "explain": "Tiêu đề chung phủ 2 cột ngang dùng colspan."
      },
      {
        "id": "cr-thu-hai",
        "emoji": "📅",
        "label": "Ô 'Buổi sáng' kéo dài qua cả 4 tiết học từ tiết 1 đến tiết 4",
        "isMatch": true,
        "explain": "Kéo dài qua nhiều dòng dọc dùng rowspan."
      }
    ]
  }
];

export default games;

import type { LessonGame, SortGame, MenuPathGame } from "@/lib/types";

// Game 1: Phân loại "Đúng bản chất hay Bẫy đề thi?" — các khái niệm cốt lõi
// của bài thực hành (điều kiện chia sẻ, mạng riêng/công cộng, mức quyền
// Everyone, huỷ chia sẻ, chia sẻ máy in = Print Server, hàng đợi in).
const sortGameBayDeThi: SortGame = {
  kind: "sort",
  id: "dung-ban-chat-hay-bay-de-thi",
  title: "Đúng bản chất hay Bẫy đề thi?",
  emoji: "🎯",
  instructions:
    "Kéo (hoặc bấm nút) từng câu sang đúng khay: câu này nói ĐÚNG bản chất việc chia sẻ tài nguyên mạng, hay là một câu BẪY hay gặp trong đề thi?",
  matchLabel: "Bẫy sai",
  matchEmoji: "🚫",
  noMatchLabel: "Đúng bản chất",
  noMatchEmoji: "✅",
  items: [
    {
      id: "bay-ket-ban",
      emoji: "❌",
      label: "Muốn chia sẻ tài nguyên trong LAN, hai người phải “kết bạn” với nhau như trên mạng xã hội",
      isMatch: true,
      explain: "Sai — chia sẻ trong LAN chỉ cần kết nối mạng và được cấp quyền truy cập, không có khái niệm “kết bạn” hay trả phí.",
    },
    {
      id: "dung-dieu-kien",
      emoji: "✅",
      label: "Chia sẻ tài nguyên trong LAN chỉ cần hai điều kiện: kết nối mạng và được cấp quyền truy cập",
      isMatch: false,
      explain: "Đúng — đây là công việc kĩ thuật phục vụ nội bộ, người chủ tài nguyên cấp phép là đủ.",
    },
    {
      id: "bay-mang-cong-cong",
      emoji: "❌",
      label: "Nên chọn chế độ mạng Công cộng (Public) khi muốn chia sẻ tài nguyên với nhóm tin cậy",
      isMatch: true,
      explain: "Sai — mạng Công cộng dùng ở nơi công cộng để hạn chế lộ thông tin. Muốn chia sẻ tài nguyên phải đặt chế độ mạng Riêng (Private).",
    },
    {
      id: "dung-mang-rieng",
      emoji: "✅",
      label: "Mạng Riêng (Private) dành cho nhóm người dùng tin cậy hơn, có thể chia sẻ tài nguyên với nhau",
      isMatch: false,
      explain: "Đúng — cần đặt mạng Riêng trước khi bật Network discovery và File and printer sharing.",
    },
    {
      id: "bay-everyone-readwrite",
      emoji: "❌",
      label: "Everyone mặc định có quyền Read/Write, tự do xem và sửa dữ liệu",
      isMatch: true,
      explain: "Sai — mức quyền mặc định của Everyone chỉ là Read (chỉ xem). Muốn sửa được phải chủ động đổi sang Read/Write.",
    },
    {
      id: "dung-everyone-read",
      emoji: "✅",
      label: "Everyone mặc định chỉ có quyền Read — được xem nhưng không được sửa",
      isMatch: false,
      explain: "Đúng — đây là mức quyền an toàn mặc định khi chia sẻ cho tất cả mọi người trên mạng.",
    },
    {
      id: "bay-xoa-thu-muc",
      emoji: "❌",
      label: "Muốn huỷ chia sẻ một thư mục, cách duy nhất là xoá hẳn thư mục đó đi",
      isMatch: true,
      explain: "Sai — chỉ cần vào Advanced Sharing rồi bỏ dấu tích ở ô Share this folder, thư mục vẫn còn nguyên, chỉ là không còn chia sẻ nữa.",
    },
    {
      id: "dung-huy-chia-se",
      emoji: "✅",
      label: "Huỷ chia sẻ chỉ cần bỏ dấu tích Share this folder trong Advanced Sharing, không cần xoá dữ liệu",
      isMatch: false,
      explain: "Đúng — thao tác này chỉ tắt việc chia sẻ, dữ liệu trong thư mục hoàn toàn không bị ảnh hưởng.",
    },
    {
      id: "bay-may-in-cap",
      emoji: "❌",
      label: "Chia sẻ máy in nghĩa là nối máy in trực tiếp vào bộ định tuyến (router) bằng cáp mạng",
      isMatch: true,
      explain: "Sai — chia sẻ máy in là biến máy tính đang cắm máy in thành một máy chủ cung cấp dịch vụ in (Print Server), không phải nối máy in vào router.",
    },
    {
      id: "dung-may-in-print-server",
      emoji: "✅",
      label: "Chia sẻ máy in thực chất là biến máy tính có máy in thành Print Server",
      isMatch: false,
      explain: "Đúng — máy tính đó nhận lệnh in từ các máy khác rồi điều khiển máy in thực hiện.",
    },
    {
      id: "bay-in-ngay-lap-tuc",
      emoji: "❌",
      label: "Mỗi lệnh in gửi tới máy chủ in sẽ được in ngay lập tức, không cần xếp hàng đợi",
      isMatch: true,
      explain: "Sai — máy chủ in xếp các lệnh in thành một hàng đợi, rồi khi máy in sẵn sàng mới điều khiển in lần lượt từng tài liệu.",
    },
    {
      id: "dung-hang-doi-in",
      emoji: "✅",
      label: "Máy chủ in xếp các lệnh in thành hàng đợi rồi điều khiển máy in in lần lượt",
      isMatch: false,
      explain: "Đúng — nhờ hàng đợi này mà nhiều máy có thể cùng dùng chung một máy in mà không bị chồng lệnh.",
    },
    {
      id: "bay-chia-se-o-dia",
      emoji: "❌",
      label: "Không thể chia sẻ cả một ổ đĩa, chỉ chia sẻ được từng thư mục con riêng lẻ",
      isMatch: true,
      explain: "Sai — có thể xem cả ổ đĩa là một thư mục lớn nhất và chia sẻ y hệt cách chia sẻ một thư mục bình thường.",
    },
    {
      id: "dung-chia-se-o-dia",
      emoji: "✅",
      label: "Có thể chia sẻ cả một ổ đĩa giống hệt cách chia sẻ một thư mục",
      isMatch: false,
      explain: "Đúng — nháy phải chuột vào biểu tượng ổ đĩa, chọn Properties rồi làm y hệt các bước chia sẻ thư mục.",
    },
  ],
};

// Game 2: Đường Đến Cài Đặt — ghép đúng thứ tự các cấp menu Windows cần đi
// qua để đạt một mục tiêu cụ thể. Túi thẻ có lẫn "bẫy" là tên menu CÓ THẬT
// nhưng thuộc một quy trình khác trong chính bài này, buộc học sinh phải nhớ
// đúng ĐƯỜNG ĐI chứ không chỉ nhận mặt tên menu quen quen.
const menuPathGame: MenuPathGame = {
  kind: "menupath",
  id: "duong-den-cai-dat",
  title: "Đường Đến Cài Đặt",
  emoji: "🧭",
  instructions:
    "Đọc mục tiêu rồi ghép đúng thứ tự các cấp menu cần đi qua. Túi thẻ có lẫn vài mục menu thật nhưng thuộc quy trình khác — đừng đặt nhầm!",
  questions: [
    {
      id: "mp-1",
      goal: "Bật cho các máy khác trong mạng nhìn thấy máy này và cho phép chia sẻ tệp, máy in",
      path: ["Control Panel", "Network and Internet", "Network and Sharing Center", "Advanced Sharing Settings"],
      decoys: ["Sharing", "Printers & scanners", "Windows Security"],
      explain: "Đường đi đúng: Control Panel → Network and Internet → Network and Sharing Center → Advanced Sharing Settings, rồi bật Network discovery và File and printer sharing.",
    },
    {
      id: "mp-2",
      goal: "Tạm tắt Microsoft Defender Firewall trong khi chia sẻ dữ liệu",
      path: ["Privacy and Security", "Windows Security", "FireWall Network Protection", "Private Network"],
      decoys: ["Network and Sharing Center", "Advanced Sharing Settings", "Share…"],
      explain: "Đường đi đúng: Privacy and Security → Windows Security → FireWall Network Protection → Private Network, rồi kéo con trượt Microsoft Defender Firewall về Off.",
    },
    {
      id: "mp-3",
      goal: "Chia sẻ một thư mục cho Everyone trên mạng",
      path: ["Properties", "Sharing", "Share…"],
      decoys: ["Advanced Sharing…", "Network and Sharing Center", "Printer properties"],
      explain: "Đường đi đúng: nháy phải chuột thư mục → Properties → Sharing → Share…. Chú ý đừng nhầm với Advanced Sharing… — đó là đường đi để HUỶ chia sẻ.",
    },
    {
      id: "mp-4",
      goal: "Huỷ chia sẻ một thư mục đã chia sẻ trước đó",
      path: ["Properties", "Sharing", "Advanced Sharing…"],
      decoys: ["Share…", "Network and Sharing Center", "Printers & scanners"],
      explain: "Đường đi đúng: Properties → Sharing → Advanced Sharing…, rồi bỏ dấu tích ở ô Share this folder. Share… (không có chữ Advanced) lại là đường đi để CHIA SẺ, không phải huỷ.",
    },
    {
      id: "mp-5",
      goal: "Thiết lập máy đang cắm máy in thành máy cung cấp dịch vụ in trên mạng",
      path: ["Control Panel", "Hardware and Sound – View devices and printers", "Printers & scanners", "Printer properties", "Sharing"],
      decoys: ["Advanced Sharing Settings", "Add device", "Share…"],
      explain: "Đường đi đúng: Control Panel → Hardware and Sound – View devices and printers → Printers & scanners → chọn máy in → Printer properties → Sharing.",
    },
    {
      id: "mp-6",
      goal: "Kết nối và sử dụng một máy in mạng đã được chia sẻ từ máy khác",
      path: ["Printers & scanners", "Add device", "The printer that I want isn't listed", "Browse…"],
      decoys: ["Printer properties", "Sharing", "Control Panel"],
      explain: "Đường đi đúng: Printers & scanners → Add device → The printer that I want isn't listed → Browse…, rồi chọn đúng máy đang chia sẻ máy in.",
    },
  ],
};

const games: LessonGame[] = [sortGameBayDeThi, menuPathGame];

export default games;

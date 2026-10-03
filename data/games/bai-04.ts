import type { LessonGame, SortGame, EncapsulationGame, RoutingGame, GroupBattleGame } from "@/lib/types";
import type { BattleQuestion } from "@/lib/battle";

// Phải khớp đúng hằng số DEFAULT_ID trong components/RoutingGame.tsx
const DEFAULT_ROUTE = "default";

// Game 1: Phân loại "Đúng bản chất hay Bẫy đề thi?" — các cặp câu lấy thẳng
// từ bảng "Bẫy câu chữ / Bản chất chính xác" đã soạn trong phần Lý thuyết
// (Mẹo nhớ & Cảnh báo bẫy), cộng thêm 2 cặp dựng theo đúng lối đó từ phần
// Định tuyến và tổng kết TCP/IP.
const sortGameBayDeThi: SortGame = {
  kind: "sort",
  id: "dung-ban-chat-hay-bay-de-thi",
  title: "Đúng bản chất hay Bẫy đề thi?",
  emoji: "🎯",
  instructions:
    "Kéo (hoặc bấm nút) từng câu sang đúng khay: câu này nói ĐÚNG bản chất giao thức mạng, hay là một câu BẪY hay gặp trong đề thi?",
  matchLabel: "Bẫy sai",
  matchEmoji: "🚫",
  noMatchLabel: "Đúng bản chất",
  noMatchEmoji: "✅",
  items: [
    {
      id: "bay-ipv4-4bit",
      emoji: "❌",
      label: "Địa chỉ IPv4 dài 4 bit hoặc 32 byte",
      isMatch: true,
      explain: "Sai — địa chỉ IPv4 dài 4 byte (tức 32 bit), không phải 4 bit hay 32 byte.",
    },
    {
      id: "dung-ipv4-4byte",
      emoji: "✅",
      label: "Địa chỉ IPv4 dài 4 byte (32 bit), địa chỉ MAC dài 6 byte",
      isMatch: false,
      explain: "Đúng — IPv4 là số 4 byte viết kiểu dot decimal; MAC dài 6 byte, gắn cứng với phần cứng.",
    },
    {
      id: "bay-mac-tu-doi",
      emoji: "❌",
      label: "Địa chỉ MAC có thể tự do thay đổi giống địa chỉ IP",
      isMatch: true,
      explain: "Sai — địa chỉ MAC gắn cứng với phần cứng, không đổi được. Chỉ địa chỉ IP mới được gán và có thể thay đổi.",
    },
    {
      id: "dung-mac-gan-cung",
      emoji: "✅",
      label: "Địa chỉ MAC gắn cứng với phần cứng, dùng để truyền dữ liệu trong LAN",
      isMatch: false,
      explain: "Đúng — MAC dùng cho truyền dữ liệu nội bộ LAN; IP mới dùng để truyền dữ liệu giữa các mạng khác nhau.",
    },
    {
      id: "bay-ip-lo-dung-phan-mem",
      emoji: "❌",
      label: "Giao thức IP lo việc đưa dữ liệu đến đúng phần mềm trên máy nhận",
      isMatch: true,
      explain: "Sai — IP chỉ lo chuyển dữ liệu từ mạng này đến mạng kia. Đưa dữ liệu đến đúng ứng dụng (qua số hiệu cổng) là việc của TCP.",
    },
    {
      id: "dung-tcp-cong-ung-dung",
      emoji: "✅",
      label: "TCP gán số hiệu cổng ứng dụng để dữ liệu không lẫn giữa các phần mềm",
      isMatch: false,
      explain: "Đúng — mỗi ứng dụng có một cổng riêng, các gói dữ liệu được gán nhãn cổng để đến đúng phần mềm đang chờ.",
    },
    {
      id: "bay-khong-tim-duong-huy",
      emoji: "❌",
      label: "Không tìm thấy đường đi trong bảng định tuyến thì router huỷ gói ngay",
      isMatch: true,
      explain: "Sai — router luôn có một cổng mặc định. Địa chỉ không có trong bảng thì gói tin được gửi theo cổng mặc định, không bị huỷ.",
    },
    {
      id: "dung-cong-mac-dinh",
      emoji: "✅",
      label: "Địa chỉ không có trong bảng định tuyến thì gói tin đi theo cổng mặc định",
      isMatch: false,
      explain: "Đúng — giống ví dụ bưu phẩm đi Cần Thơ: không có chỉ dẫn riêng nên chuyển theo đường mặc định rồi đi tiếp.",
    },
    {
      id: "bay-smtp-gui-nhan",
      emoji: "❌",
      label: "SMTP dùng cho cả gửi và nhận thư điện tử",
      isMatch: true,
      explain: "Sai — SMTP chỉ dùng để gửi thư. Nhận thư (tải thư về) là việc của POP3 hoặc IMAP.",
    },
    {
      id: "dung-smtp-gui",
      emoji: "✅",
      label: "SMTP là giao thức gửi thư; POP3/IMAP là giao thức nhận thư",
      isMatch: false,
      explain: "Đúng — hai nhóm giao thức đảm nhận hai chiều khác nhau của việc trao đổi thư điện tử.",
    },
    {
      id: "bay-dinh-tuyen-tinh-doi-cong",
      emoji: "❌",
      label: "Định tuyến tĩnh là loại có thể tự động đổi cổng gửi tuỳ điều kiện mạng",
      isMatch: true,
      explain: "Sai — đó là định nghĩa của định tuyến ĐỘNG. Định tuyến tĩnh dùng một bảng định tuyến cố định, không tự đổi.",
    },
    {
      id: "dung-dinh-tuyen-tinh-dong",
      emoji: "✅",
      label: "Định tuyến tĩnh dùng bảng cố định; định tuyến động đổi cổng tuỳ điều kiện",
      isMatch: false,
      explain: "Đúng — định tuyến tĩnh không tự thay đổi, còn định tuyến động linh hoạt hơn theo tình trạng mạng lúc đó.",
    },
    {
      id: "bay-ip-chia-goi",
      emoji: "❌",
      label: "IP chịu trách nhiệm chia nhỏ dữ liệu thành các gói và đánh số thứ tự",
      isMatch: true,
      explain: "Sai — chia gói và đánh số thứ tự là việc của TCP. IP chỉ lo phần địa chỉ và dẫn đường giữa các mạng.",
    },
    {
      id: "dung-ip-dan-duong-tcp-chia-goi",
      emoji: "✅",
      label: "IP lo đánh địa chỉ và dẫn đường; TCP lo chia gói, đánh số và xác nhận",
      isMatch: false,
      explain: "Đúng — đây chính là lí do Internet được gọi là mạng hoạt động theo giao thức TCP/IP, hai giao thức bổ sung cho nhau.",
    },
  ],
};

// Game 2: Đóng Gói Dữ Liệu — thay cho game "đổi nhị phân" cũ (chỉ luyện một
// phép tính nhỏ, lạc trọng tâm bài). Game này đánh thẳng vào Ý CHÍNH của cả
// Bài 4: vì sao cần tới 3 giao thức khác nhau, mỗi giao thức lo một "lớp"
// thông tin riêng khi đóng gói dữ liệu — Ethernet (địa chỉ MAC, mã kiểm tra,
// khung truyền) ⊃ IP (địa chỉ IP, định tuyến) ⊃ TCP (cổng ứng dụng, đánh số
// gói, xác nhận). Học sinh xếp từng mẩu thông tin vào đúng lớp phụ trách.
const encapsulationGameDongGoi: EncapsulationGame = {
  kind: "encapsulation",
  id: "dong-goi-du-lieu",
  title: "Đóng Gói Dữ Liệu",
  emoji: "📦",
  instructions:
    "Mỗi khi truyền dữ liệu, 3 giao thức lần lượt 'bọc' thêm thông tin của mình — như 3 lớp phong bì lồng nhau. Chạm chọn 1 thẻ rồi chạm vào đúng lớp phụ trách thông tin đó.",
  layers: [
    {
      id: "ethernet",
      emoji: "📶",
      name: "Khung Ethernet",
      subtitle: "Lớp ngoài cùng — truyền trong 1 LAN, dựa vào địa chỉ phần cứng (MAC)",
    },
    {
      id: "ip",
      emoji: "🌍",
      name: "Gói IP",
      subtitle: "Lớp giữa — dẫn dữ liệu đi giữa các LAN khác nhau, dựa vào địa chỉ IP",
    },
    {
      id: "tcp",
      emoji: "🔌",
      name: "Đoạn TCP",
      subtitle: "Lớp trong cùng — đảm bảo đến đúng ứng dụng, đúng thứ tự, không lỗi",
    },
  ],
  dataLabel: "Dữ liệu gốc (nội dung email, tệp, tin nhắn…)",
  items: [
    {
      id: "enc-mac",
      label: "Địa chỉ MAC của máy gửi và máy nhận",
      layerId: "ethernet",
      explain: "Truyền dữ liệu trong mạng cục bộ căn cứ vào địa chỉ MAC — đây là quy định về địa chỉ của giao thức Ethernet.",
    },
    {
      id: "enc-checksum",
      label: "Mã kiểm tra để phát hiện lỗi truyền",
      layerId: "ethernet",
      explain: "Máy nhận dùng mã kiểm tra để phát hiện lỗi truyền; nếu có lỗi sẽ yêu cầu gửi lại — quy định này thuộc Ethernet.",
    },
    {
      id: "enc-frame",
      label: "Chia dữ liệu thành từng khung có độ dài giới hạn",
      layerId: "ethernet",
      explain: "Không thể truyền một lượng tin dài không giới hạn nên Ethernet quy định truyền theo từng khung có độ dài xác định.",
    },
    {
      id: "enc-ip-addr",
      label: "Địa chỉ IP của máy gửi và máy nhận",
      layerId: "ip",
      explain: "Giao thức IP có hai nội dung chính: đánh địa chỉ và định tuyến. Đây là phần đánh địa chỉ.",
    },
    {
      id: "enc-routing",
      label: "Chọn đường đi (định tuyến) qua các router trung gian",
      layerId: "ip",
      explain: "Khi hai máy không cùng LAN, router phải định tuyến để dẫn dữ liệu tới đúng LAN đích — đây là phần định tuyến của IP.",
    },
    {
      id: "enc-port",
      label: "Số hiệu cổng ứng dụng, để dữ liệu đến đúng phần mềm đang chờ",
      layerId: "tcp",
      explain: "IP chỉ đưa dữ liệu tới đúng máy, chưa đủ để tới đúng ứng dụng. TCP gán cổng ứng dụng để giải quyết việc này.",
    },
    {
      id: "enc-seq",
      label: "Đánh số thứ tự từng gói, để ráp lại đúng trật tự",
      layerId: "tcp",
      explain: "Dữ liệu bị cắt thành nhiều gói và có thể đến không đúng thứ tự, nên TCP đánh số để nơi nhận ráp lại đúng trật tự.",
    },
    {
      id: "enc-ack",
      label: "Cơ chế xác nhận, yêu cầu gửi lại nếu gói bị lỗi hoặc thất lạc",
      layerId: "tcp",
      explain: "TCP có cơ chế xác nhận để nơi gửi biết gói tin có tới nơi an toàn hay không, từ đó yêu cầu gửi lại khi cần.",
    },
  ],
};

// Game 3: Trạm Định Tuyến — mô phỏng lại ĐÚNG ví dụ "bảng định tuyến giống
// biển chỉ đường" ở phần Lý thuyết (bưu cục Hải Dương), cho luyện lặp lại với
// nhiều gói tin/bưu phẩm khác nhau — kể cả nhận biết khi nào phải đi cổng mặc định.
const routingGameTramDinhTuyen: RoutingGame = {
  kind: "routing",
  id: "tram-dinh-tuyen",
  title: "Trạm Định Tuyến",
  emoji: "🧭",
  instructions:
    "Bảng định tuyến dưới đây luôn hiển thị để em tra cứu. Với mỗi gói tin/bưu phẩm đến, chọn đúng cổng ra — nhớ: không có trong bảng thì phải đi cổng mặc định, không được huỷ.",
  routerName: "Bưu cục Hải Dương",
  rules: [
    { id: "quang-ninh", label: "Quảng Ninh", port: "Đường 37" },
    { id: "thai-binh", label: "Thái Bình", port: "Đường 391" },
    { id: "hung-yen", label: "Hưng Yên", port: "Đường 38B" },
  ],
  defaultPort: "Đường số 5 (mặc định, về Hà Nội)",
  questions: [
    {
      id: "rt-1",
      destination: "📮 Bưu phẩm gửi đến Quảng Ninh",
      correctRuleId: "quang-ninh",
      explain: "Quảng Ninh có dòng riêng trong bảng định tuyến, đi thẳng theo Đường 37.",
    },
    {
      id: "rt-2",
      destination: "📮 Bưu phẩm gửi đến Thái Bình",
      correctRuleId: "thai-binh",
      explain: "Thái Bình có dòng riêng trong bảng định tuyến, đi theo Đường 391.",
    },
    {
      id: "rt-3",
      destination: "📮 Bưu phẩm gửi đến Hưng Yên",
      correctRuleId: "hung-yen",
      explain: "Hưng Yên có dòng riêng trong bảng định tuyến, đi theo Đường 38B.",
    },
    {
      id: "rt-4",
      destination: "📮 Bưu phẩm gửi đến Cần Thơ",
      correctRuleId: DEFAULT_ROUTE,
      explain: "Cần Thơ không có trong bảng định tuyến — đúng như ví dụ trong SGK, bưu phẩm được chuyển theo đường mặc định rồi đi tiếp.",
    },
    {
      id: "rt-5",
      destination: "📮 Bưu phẩm gửi đến Hà Nội",
      correctRuleId: DEFAULT_ROUTE,
      explain: "Hà Nội chính là nơi đường mặc định (đường số 5) dẫn tới — không cần một dòng riêng trong bảng.",
    },
    {
      id: "rt-6",
      destination: "📮 Bưu phẩm gửi đến Hải Phòng",
      correctRuleId: DEFAULT_ROUTE,
      explain: "Hải Phòng không có trong bảng định tuyến nên cũng đi theo đường mặc định, giống trường hợp Cần Thơ.",
    },
    {
      id: "rt-7",
      destination: "📮 Một bưu phẩm khác cũng gửi đến Thái Bình",
      correctRuleId: "thai-binh",
      explain: "Vẫn là Thái Bình — luôn tra đúng dòng có sẵn trong bảng trước khi nghĩ tới đường mặc định.",
    },
    {
      id: "rt-8",
      destination: "📮 Bưu phẩm gửi đến Thành phố Hồ Chí Minh",
      correctRuleId: DEFAULT_ROUTE,
      explain: "Thành phố Hồ Chí Minh không có trong bảng định tuyến của bưu cục Hải Dương nên đi theo đường mặc định.",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Game 4: Chinh Phục Đỉnh Cao: Đại Chiến Giao Thức Mạng (2 - 4 Nhóm thi đấu)
// ─────────────────────────────────────────────────────────────────────────────
export const summitBattleGame: GroupBattleGame = {
  kind: "group-battle",
  id: "chinh-phuc-dinh-cao-bai-04",
  title: "Chinh Phục Đỉnh Cao: Đại Chiến Giao Thức Mạng",
  emoji: "🏔️",
  badge: "Đại chiến 2 - 4 nhóm",
  instructions:
    "Chia lớp thành 2 - 4 tổ học sinh (Rồng Đỏ, Đại Bàng Xanh, Báo Sấm Sét, Hổ Hoàng Kim). Sử dụng bàn phím máy chiếu (1-4, Q-R, A-F, Z-V) hoặc chạm màn hình tương tác để đua tốc độ giải mã giao thức TCP/IP, leo tháp băng thông Gigabit 1000m!",
};

export const BAI_04_BATTLE_QUESTIONS: BattleQuestion[] = [
  {
    id: "b4-bt-01",
    question: "Trong mô hình mạng TCP/IP, cổng dịch vụ nào dưới đây được sử dụng mặc định cho giao thức truyền tải web bảo mật HTTPS?",
    options: ["Cổng 443", "Cổng 80", "Cổng 22", "Cổng 53"],
    correctAnswer: 0,
    explanation: "Cổng 443 là cổng tiêu chuẩn dành cho HTTPS (bảo mật bằng SSL/TLS). Cổng 80 dành cho HTTP không mã hoá, cổng 22 cho SSH, cổng 53 cho DNS.",
  },
  {
    id: "b4-bt-02",
    question: "Địa chỉ thế hệ mới IPv6 có độ dài bao nhiêu bit và thường được biểu diễn dưới hệ đếm nào?",
    options: [
      "128 bit, biểu diễn bằng 8 nhóm số thập lục phân (hexadecimal)",
      "32 bit, biểu diễn bằng 4 số thập phân (dot decimal)",
      "64 bit, biểu diễn bằng 8 cặp số nhị phân",
      "48 bit, biểu diễn bằng 6 cặp số hexa gắn cứng",
    ],
    correctAnswer: 0,
    explanation: "IPv6 dài 128 bit (16 byte), gấp 4 lần IPv4, được viết dưới dạng 8 nhóm số hexa cách nhau bởi dấu hai chấm (ví dụ: 2001:0db8:85a3::8a2e:0370:7334).",
  },
  {
    id: "b4-bt-03",
    question: "Trong mạng cục bộ Ethernet, cơ chế nào được dùng để phát hiện và xử lý xung đột khi 2 máy cùng phát tín hiệu đồng thời?",
    options: [
      "CSMA/CD (Đa truy cập nhận biết sóng mang có phát hiện xung đột)",
      "TCP 3-way Handshake (Bắt tay ba bước)",
      "Routing Table (Bảng định tuyến cổng mặc định)",
      "DNS Resolution (Phân giải tên miền thành IP)",
    ],
    correctAnswer: 0,
    explanation: "Ethernet cổ điển sử dụng cơ chế CSMA/CD: lắng nghe đường truyền trước khi gửi (Carrier Sense), nếu phát hiện đụng độ tín hiệu (Collision Detection) thì cả 2 máy ngừng gửi, chờ một khoảng thời gian ngẫu nhiên rồi gửi lại.",
  },
  {
    id: "b4-bt-04",
    question: "Giao thức nào cho phép máy khách lấy thư điện tử từ máy chủ về và đồng bộ trạng thái (đọc, xoá, thư mục) trên nhiều thiết bị?",
    options: ["IMAP", "POP3", "SMTP", "FTP"],
    correctAnswer: 0,
    explanation: "IMAP (Internet Message Access Protocol) giữ thư trên máy chủ và đồng bộ 2 chiều với mọi thiết bị. POP3 thường tải thư về máy rồi xoá trên máy chủ, còn SMTP chỉ dùng khi gửi thư đi.",
  },
  {
    id: "b4-bt-05",
    question: "Địa chỉ vật lý MAC (Media Access Control) có đặc điểm nào dưới đây?",
    options: [
      "Dài 48 bit (6 byte), do nhà sản xuất card mạng ấn định cố định vào phần cứng",
      "Dài 32 bit (4 byte), do người quản trị mạng cấu hình lại tuỳ ý",
      "Dài 128 bit, tự động thay đổi mỗi khi máy tính kết nối Wi-Fi khác",
      "Là tên miền bằng chữ do người dùng đăng ký với nhà mạng",
    ],
    correctAnswer: 0,
    explanation: "Địa chỉ MAC dài 6 byte (48 bit), được nhà sản xuất nạp cứng vào chip ROM của card mạng (NIC), dùng để nhận diện duy nhất thiết bị trong mạng cục bộ.",
  },
  {
    id: "b4-bt-06",
    question: "Một máy tính có IP 192.168.1.5 muốn gửi dữ liệu tới máy chủ web có IP 142.250.204.46 ngoài Internet. Thiết bị mạng nào sẽ tiếp nhận gói tin đầu tiên?",
    options: [
      "Default Gateway (Cổng mặc định, thường là Router của mạng)",
      "Switch tầng 2 trong mạng LAN",
      "Máy chủ phân giải tên miền DNS",
      "Máy chủ cấp phát IP động DHCP",
    ],
    correctAnswer: 0,
    explanation: "Khi địa chỉ IP đích nằm ngoài mạng LAN cục bộ, máy tính gửi gói tin đến Default Gateway (Cổng mặc định - địa chỉ của Router trong LAN) để Router định tuyến ra ngoài Internet.",
  },
  {
    id: "b4-bt-07",
    question: "Khi truyền một tệp dữ liệu lớn, nếu một số gói tin bị thất lạc trên đường truyền Internet, giao thức nào có nhiệm vụ phát hiện và yêu cầu gửi lại?",
    options: [
      "TCP (Transmission Control Protocol)",
      "IP (Internet Protocol)",
      "Ethernet",
      "HTTP",
    ],
    correctAnswer: 0,
    explanation: "TCP là giao thức hướng kết nối tin cậy: đánh số thứ tự từng gói, yêu cầu bên nhận gửi gói xác nhận (ACK). Nếu bên nhận chưa báo nhận hoặc phát hiện gói lỗi, bên gửi sẽ tự động gửi lại.",
  },
  {
    id: "b4-bt-08",
    question: "Khi một router nhận được gói dữ liệu mà địa chỉ đích không khớp với bất kỳ dòng nào trong bảng định tuyến, router sẽ làm gì?",
    options: [
      "Chuyển gói dữ liệu theo cổng mặc định (Default Route)",
      "Lập tức huỷ gói dữ liệu và ngắt toàn bộ kết nối",
      "Lưu trữ gói tin vô thời hạn chờ lệnh của quản trị viên",
      "Gửi ngược lại cho máy tính vừa phát gói tin",
    ],
    correctAnswer: 0,
    explanation: "Router luôn có cấu hình một cổng mặc định (Default Route). Mọi gói tin có địa chỉ không nằm trong bảng định tuyến cụ thể sẽ được gửi qua cổng mặc định để router cấp trên tiếp tục xử lý.",
  },
  {
    id: "b4-bt-09",
    question: "Trong địa chỉ IPv4 dạng dot decimal '192.168.10.1', mỗi số nằm giữa các dấu chấm có giá trị tối đa là bao nhiêu?",
    options: [
      "255 (tương ứng với 1 byte = 8 bit nhị phân từ 0 đến 255)",
      "256 (tương ứng 256 trạng thái)",
      "128 (tương ứng 7 bit)",
      "1024 (tương ứng 1 kilobyte)",
    ],
    correctAnswer: 0,
    explanation: "IPv4 gồm 4 byte (32 bit). Mỗi byte gồm 8 bit nhị phân nên giá trị thập phân chỉ nằm trong đoạn từ 0 (00000000) đến 255 (11111111).",
  },
  {
    id: "b4-bt-10",
    question: "Vì sao các ứng dụng truyền phát trực tiếp (Livestream) hoặc thoại Internet thường ưu tiên sử dụng giao thức UDP hơn TCP?",
    options: [
      "Vì UDP truyền dữ liệu liên tục không chờ xác nhận, giảm độ trễ tối đa",
      "Vì UDP có khả năng tự sửa lỗi hình ảnh bị vỡ nét tốt hơn TCP",
      "Vì UDP mã hoá dữ liệu mạnh hơn giúp video không bị nhìn lén",
      "Vì UDP không cần card mạng vẫn truyền được qua sóng radio",
    ],
    correctAnswer: 0,
    explanation: "UDP (User Datagram Protocol) là giao thức không hướng kết nối, không kiểm tra xác nhận hay gửi lại gói mất, giúp dữ liệu truyền đi với độ trễ thấp nhất — rất phù hợp với âm thanh và video trực tiếp thời gian thực.",
  },
];

const games: LessonGame[] = [
  summitBattleGame,
  sortGameBayDeThi,
  encapsulationGameDongGoi,
  routingGameTramDinhTuyen,
];

export default games;

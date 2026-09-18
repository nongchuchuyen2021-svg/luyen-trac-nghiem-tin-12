import type { LessonGame, SortGame, EncapsulationGame, RoutingGame } from "@/lib/types";

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

const games: LessonGame[] = [sortGameBayDeThi, encapsulationGameDongGoi, routingGameTramDinhTuyen];

export default games;

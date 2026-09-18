import type { LessonGame, SortGame, TopologyGame } from "@/lib/types";

// Game 1: Phân loại "Trong một LAN hay Ra ngoài Internet?" — Bài 3, toàn bộ
// mục hub/switch/WAP (chỉ hoạt động trong 1 LAN) đối lại router/modem (đưa
// dữ liệu ra khỏi LAN, tới mạng viễn thông/Internet).
const sortGameLanHayInternet: SortGame = {
  kind: "sort",
  id: "trong-lan-hay-ra-internet",
  title: "Trong một LAN hay Ra ngoài Internet?",
  emoji: "🌐",
  instructions:
    "Kéo (hoặc bấm nút) từng thẻ sang đúng khay: thiết bị/khái niệm này chỉ hoạt động TRONG MỘT LAN, hay giúp dữ liệu ĐI RA NGOÀI Internet (qua mạng viễn thông)?",
  matchLabel: "Ra ngoài Internet",
  matchEmoji: "🌐",
  noMatchLabel: "Trong một LAN",
  noMatchEmoji: "🏠",
  items: [
    {
      id: "hub",
      emoji: "🔀",
      label: "Hub (bộ chia tín hiệu): tín hiệu vào một cổng phát ra mọi cổng còn lại",
      isMatch: false,
      explain: "Hub chỉ nối các máy tính trong cùng một LAN qua cáp mạng — không đưa dữ liệu ra ngoài LAN.",
    },
    {
      id: "switch",
      emoji: "🔁",
      label: "Switch (bộ chuyển mạch): mở kênh truyền riêng giữa cổng gửi và cổng nhận",
      isMatch: false,
      explain: "Switch cũng chỉ nối các máy trong cùng một LAN, chỉ khác hub ở cách hoạt động (không phát tán ra mọi cổng).",
    },
    {
      id: "wap",
      emoji: "📶",
      label: "WAP (điểm truy cập không dây): nối thiết bị di động vào LAN qua Wi-Fi",
      isMatch: false,
      explain: "WAP giúp lập LAN không dây hoặc mở rộng phạm vi của một LAN có sẵn — vẫn là chuyện trong nội bộ LAN.",
    },
    {
      id: "xung-dot",
      emoji: "💥",
      label: "Xung đột tín hiệu: nhiều máy cùng gửi dữ liệu một lúc trên đường truyền chung",
      isMatch: false,
      explain: "Xung đột tín hiệu là hiện tượng xảy ra khi nhiều máy trong cùng một LAN (thường qua hub) gửi dữ liệu đồng thời.",
    },
    {
      id: "cong-lan-router",
      emoji: "🔌",
      label: "Cổng LAN của router: nối trực tiếp router với các máy trong LAN nội bộ",
      isMatch: false,
      explain: "Cổng LAN là cổng router dùng để nhận dữ liệu từ các máy trong chính LAN đó, trước khi dữ liệu được đưa ra ngoài qua cổng WAN.",
    },
    {
      id: "cap-utp",
      emoji: "🧵",
      label: "Cáp UTP với giắc RJ45: nối máy tính vào switch, hub hay cổng LAN của router",
      isMatch: false,
      explain: "Cáp UTP/RJ45 là cách nối vật lí phổ biến nhất bên trong một LAN.",
    },
    {
      id: "router",
      emoji: "🧭",
      label: "Router: chuyển tiếp dữ liệu giữa hai LAN cách xa nhau qua mạng viễn thông",
      isMatch: true,
      explain: "Hub và switch không kéo cáp đi xa được — router dùng dịch vụ của nhà cung cấp viễn thông để nối các LAN ở xa nhau, kể cả hàng nghìn kilômét.",
    },
    {
      id: "cong-wan",
      emoji: "🚪",
      label: "Cổng WAN của router: dữ liệu rời LAN đi ra Internet qua cổng này",
      isMatch: true,
      explain: "Cổng WAN là nơi dữ liệu thoát khỏi LAN để đi ra ngoài, khác hẳn với cổng LAN chỉ hướng vào nội bộ.",
    },
    {
      id: "dinh-tuyen",
      emoji: "🗺️",
      label: "Định tuyến (routing): chọn cổng WAN thích hợp để dữ liệu tới đúng LAN đích ở xa",
      isMatch: true,
      explain: "Định tuyến chỉ có ý nghĩa khi dữ liệu phải đi qua nhiều router để ra ngoài LAN gốc, tới một LAN khác ở xa.",
    },
    {
      id: "modem",
      emoji: "🔄",
      label: "Modem: chuyển tín hiệu số của LAN thành tín hiệu tương tự để truyền đi xa",
      isMatch: true,
      explain: "Modem đứng giữa router và nhà cung cấp dịch vụ Internet, chuyển đổi tín hiệu để dữ liệu ra khỏi LAN đi được đường xa.",
    },
    {
      id: "modem-quang",
      emoji: "💡",
      label: "Modem quang: đổi tín hiệu số sang tín hiệu quang để gửi đi qua cáp quang",
      isMatch: true,
      explain: "Modem quang là một loại modem — công việc của nó vẫn là đưa tín hiệu từ LAN ra một đường truyền viễn thông đi xa.",
    },
    {
      id: "modem-gsm",
      emoji: "📱",
      label: "Modem GSM 3G/4G/5G: có khe SIM, truy cập Internet qua mạng điện thoại di động",
      isMatch: true,
      explain: "Modem GSM đưa dữ liệu ra ngoài qua hệ thống điện thoại di động của nhà mạng, rồi mới phát ngược lại vào LAN qua Wi-Fi.",
    },
  ],
};

// Game 2: Phân loại "Đúng bản chất hay Bẫy đề thi?" — dựa trên mục "Mẹo nhớ &
// Cảnh báo bẫy" cuối Bài 3, các cặp câu bẫy/câu đúng SGK hay dùng để ra đề.
const sortGameBayDeThi: SortGame = {
  kind: "sort",
  id: "dung-ban-chat-hay-bay-de-thi",
  title: "Đúng bản chất hay Bẫy đề thi?",
  emoji: "🎯",
  instructions:
    "Kéo (hoặc bấm nút) từng câu sang đúng khay: câu này nói ĐÚNG bản chất thiết bị mạng, hay là một câu BẪY hay gặp trong đề thi?",
  matchLabel: "Bẫy sai",
  matchEmoji: "🚫",
  noMatchLabel: "Đúng bản chất",
  noMatchEmoji: "✅",
  items: [
    {
      id: "bay-hub-switch-2-lan",
      emoji: "❌",
      label: "Dùng hub hoặc switch để kết nối 2 LAN cách xa nhau",
      isMatch: true,
      explain: "Sai — hub và switch chỉ nối được máy trong cùng một LAN. Nối 2 LAN cách xa nhau bắt buộc phải dùng router qua dịch vụ viễn thông.",
    },
    {
      id: "bay-switch-phat-tan",
      emoji: "❌",
      label: "Switch phát tán tín hiệu ra tất cả các cổng giống hub",
      isMatch: true,
      explain: "Sai — đó là cách hoạt động của hub. Switch chỉ mở kênh truyền riêng giữa đúng cổng gửi và cổng nhận, không phát ra mọi cổng.",
    },
    {
      id: "bay-modem-doi-du-lieu",
      emoji: "❌",
      label: "Modem làm thay đổi nội dung dữ liệu khi truyền đi",
      isMatch: true,
      explain: "Sai — modem chỉ chuyển đổi hình thức tín hiệu (số ↔ tương tự), hoàn toàn không làm thay đổi dữ liệu được mang bởi tín hiệu.",
    },
    {
      id: "bay-cap-hdmi",
      emoji: "❌",
      label: "Cáp mạng LAN xoắn đôi thông dụng là cáp HDMI",
      isMatch: true,
      explain: "Sai — cáp mạng LAN thông dụng là cáp UTP (4 đôi dây xoắn) với giắc cắm RJ45, không phải cáp HDMI (cáp hình ảnh/âm thanh).",
    },
    {
      id: "bay-router-cong-lan",
      emoji: "❌",
      label: "Router chuyển dữ liệu ra ngoài Internet qua cổng LAN",
      isMatch: true,
      explain: "Sai — cổng LAN là cổng nối vào nội bộ LAN. Dữ liệu ra ngoài Internet phải đi qua cổng WAN.",
    },
    {
      id: "bay-hub-switch-de-phan-biet",
      emoji: "❌",
      label: "Nhìn bên ngoài có thể phân biệt dễ dàng hub với switch",
      isMatch: true,
      explain: "Sai — hub và switch nhìn bên ngoài gần như giống hệt nhau, điểm khác nhau nằm ở cách thức hoạt động bên trong, không nhìn thấy được.",
    },
    {
      id: "dung-2-lan-router",
      emoji: "✅",
      label: "Kết nối giữa 2 LAN khác nhau bắt buộc dùng router",
      isMatch: false,
      explain: "Đúng — router dùng dịch vụ của nhà cung cấp viễn thông để chuyển tiếp dữ liệu giữa các LAN ở xa nhau.",
    },
    {
      id: "dung-switch-kenh-rieng",
      emoji: "✅",
      label: "Switch chỉ thiết lập kênh truyền riêng giữa đúng 2 cổng gửi – nhận",
      isMatch: false,
      explain: "Đúng — nhờ vậy switch giảm thiểu được xung đột tín hiệu so với hub, phù hợp cho LAN có nhiều máy.",
    },
    {
      id: "dung-modem-doi-tin-hieu",
      emoji: "✅",
      label: "Modem chỉ đổi dạng tín hiệu, giữ nguyên dữ liệu được mang theo",
      isMatch: false,
      explain: "Đúng — modem là 'người phiên dịch' tín hiệu số ↔ tương tự, không can thiệp vào nội dung dữ liệu.",
    },
    {
      id: "dung-cap-utp-rj45",
      emoji: "✅",
      label: "Cáp mạng LAN thông dụng là cáp UTP (4 đôi xoắn) với giắc RJ45",
      isMatch: false,
      explain: "Đúng — đây là cách nối cáp phổ biến nhất để đưa một máy tính vào LAN.",
    },
    {
      id: "dung-cong-wan",
      emoji: "✅",
      label: "Dữ liệu đi ra Internet qua cổng WAN của router",
      isMatch: false,
      explain: "Đúng — cổng WAN chính là 'cửa ra' của router để dữ liệu rời LAN, khác với cổng LAN chỉ hướng vào nội bộ.",
    },
    {
      id: "dung-hub-switch-giong-ben-ngoai",
      emoji: "✅",
      label: "Hub và switch giống hệt nhau khi nhìn bên ngoài, chỉ khác cách hoạt động bên trong",
      isMatch: false,
      explain: "Đúng — đây chính là lí do đề thi hay yêu cầu phân biệt hai thiết bị này bằng bản chất hoạt động, không phải bằng hình dáng.",
    },
  ],
};

// Game 3: Sơ đồ mạng "Hành trình gói tin từ LAN này sang LAN khác" — ráp lại
// TOÀN BỘ 4 thiết bị của bài (switch, router, modem) thành một câu chuyện
// liền mạch, thay vì tách rời từng thiết bị như 2 game trên. Khác bản sắp xếp
// mốc thời gian cũ: thứ tự thiết bị trên sơ đồ đã CỐ ĐỊNH SẴN đúng (đây chính
// là sơ đồ mạng thật), thử thách là ghép đúng HÀNH ĐỘNG vào đúng THIẾT BỊ —
// buộc học sinh nối kiến thức với đúng thiết bị vật lí thay vì chỉ nhớ số thứ tự.
const topologyGameHanhTrinhGoiTin: TopologyGame = {
  kind: "topology",
  id: "hanh-trinh-goi-tin",
  title: "Hành trình gói tin từ LAN này sang LAN khác",
  emoji: "📦",
  instructions:
    "Đây là sơ đồ đúng đường đi của dữ liệu từ máy A (LAN 1) tới máy B (ở một LAN khác, cách xa). Kéo (hoặc chạm chọn rồi đặt) 8 thẻ hành động vào ĐÚNG THIẾT BỊ thực hiện việc đó.",
  nodes: [
    {
      id: "b1-may-a-gui",
      node: "Máy A",
      emoji: "💻",
      action: "Gửi dữ liệu qua cáp UTP/RJ45 vào switch (hoặc hub) trong LAN của mình",
      explain: "Nối vật lí bằng cáp UTP với giắc RJ45 là cách phổ biến nhất đưa một máy tính vào LAN.",
    },
    {
      id: "b2-switch-a",
      node: "Switch A",
      emoji: "🔀",
      action: "Xác định đúng cổng nhận, chuyển dữ liệu tới cổng LAN của router A",
      explain: "Switch chỉ mở kênh truyền tạm thời giữa cổng gửi và cổng nhận rồi đưa dữ liệu tới đúng thiết bị kế tiếp.",
    },
    {
      id: "b3-router-a-wan",
      node: "Router A",
      emoji: "🧭",
      action: "Nhận dữ liệu qua cổng LAN, rồi đẩy ra ngoài qua cổng WAN",
      explain: "Cổng LAN là nơi router nhận dữ liệu từ các máy trong chính LAN đó; cổng WAN là 'cửa ra' để dữ liệu rời LAN đi tiếp.",
    },
    {
      id: "b4-modem-a-doi-tin-hieu",
      node: "Modem A",
      emoji: "🔄",
      action: "Đổi tín hiệu số (digital) thành tín hiệu tương tự (analog) để truyền đi xa",
      explain: "Trong LAN tín hiệu là tín hiệu số; ra ngoài LAN phải dùng tín hiệu tương tự (quang, sóng vô tuyến, sóng điện thoại...), nên modem đứng giữa router và nhà cung cấp dịch vụ để chuyển đổi.",
    },
    {
      id: "b5-dinh-tuyen",
      node: "Mạng viễn thông (WAN)",
      emoji: "🗺️",
      action: "Định tuyến (routing) dữ liệu, có thể trung chuyển qua nhiều router trên mạng viễn thông",
      explain: "Router chọn cổng WAN thích hợp để dữ liệu đi tới đúng LAN đích — nếu đường đi xa, dữ liệu có thể phải qua nhiều router trung gian.",
    },
    {
      id: "b6-modem-b-doi-nguoc",
      node: "Modem B",
      emoji: "🔁",
      action: "Đổi tín hiệu tương tự trở lại thành tín hiệu số",
      explain: "Modem làm việc hai chiều: số → tương tự khi dữ liệu đi ra, và tương tự → số khi dữ liệu tới gần LAN đích để đọc được.",
    },
    {
      id: "b7-router-b",
      node: "Router B",
      emoji: "🧭",
      action: "Nhận dữ liệu qua cổng WAN, xác định cổng LAN cần gửi tiếp",
      explain: "Đây là router cuối cùng trên hành trình — nó đưa dữ liệu từ ngoài Internet quay trở lại đúng cổng LAN hướng vào LAN B.",
    },
    {
      id: "b8-switch-b",
      node: "Switch B",
      emoji: "🔀",
      action: "Chuyển dữ liệu tới đúng máy B",
      explain: "Bước cuối cùng lại là công việc nội bộ một LAN — switch mở kênh truyền riêng để đưa dữ liệu đến đúng máy nhận.",
    },
  ],
  endLabel: "💻 Máy B (đích đến)",
};

const games: LessonGame[] = [sortGameLanHayInternet, sortGameBayDeThi, topologyGameHanhTrinhGoiTin];

export default games;

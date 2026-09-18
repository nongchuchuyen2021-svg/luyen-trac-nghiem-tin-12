import type { LessonReview } from "@/lib/types";

const review: LessonReview = {
  summary:
    "Bài này phân biệt 4 thiết bị mạng hay bị nhầm lẫn — hub, switch, WAP, router, modem — và chỉ ra cách nối một máy tính vào mạng bằng cáp hoặc Wi-Fi.",
  keyPoints: [
    "Hub và switch chỉ nối máy trong cùng một LAN: hub phát tán tín hiệu ra mọi cổng (dễ xung đột), switch mở kênh truyền riêng giữa cổng gửi – nhận (giảm xung đột).",
    "WAP (điểm truy cập không dây) nối thiết bị vào LAN qua Wi-Fi — dùng để lập LAN không cần cáp, hoặc mở rộng phạm vi một LAN có sẵn.",
    "Router chuyển tiếp dữ liệu giữa các LAN ở xa nhau: vào qua cổng LAN, ra qua cổng WAN, việc chọn cổng thích hợp gọi là định tuyến (routing).",
    "Modem chuyển đổi tín hiệu số (trong LAN) ↔ tín hiệu tương tự (ra ngoài LAN) — có 4 loại: quay số, ADSL, quang, GSM 3G/4G/5G — chỉ đổi dạng tín hiệu, không đổi dữ liệu.",
    "Nối máy vào mạng bằng cáp UTP/giắc RJ45, hoặc qua Wi-Fi (tìm trạm thu phát → nhập mật khẩu nếu có khoá).",
  ],
  commonMistakes: [
    {
      mistake: "Nghĩ có thể dùng hub hoặc switch để nối 2 LAN cách xa nhau.",
      fix: "Hub và switch chỉ hoạt động trong nội bộ một LAN qua cáp mạng. Muốn nối 2 LAN cách xa (có thể hàng nghìn kilômét) bắt buộc phải dùng router qua dịch vụ của nhà cung cấp viễn thông.",
    },
    {
      mistake: "Nhầm switch cũng phát tán tín hiệu ra mọi cổng giống hub.",
      fix: "Đó là hub. Switch xác định đúng cổng gửi và cổng nhận rồi chỉ mở kênh truyền riêng giữa hai cổng đó, xong thì huỷ — nên giảm thiểu được xung đột tín hiệu.",
    },
    {
      mistake: "Nghĩ modem làm thay đổi nội dung dữ liệu khi chuyển đổi tín hiệu.",
      fix: "Modem chỉ đổi hình thức tín hiệu (số ↔ tương tự) để truyền đi xa được, hoàn toàn không làm thay đổi dữ liệu mà tín hiệu đó mang theo.",
    },
  ],
  tips: [
    "Mẹo nhớ 4 thiết bị: Hub = loa phát thanh (ai cũng nghe thấy) · Switch = điện thoại riêng (chỉ 2 bên nghe) · Router = người dẫn đường liên mạng · Modem = người phiên dịch tín hiệu.",
    "Mẹo phân biệt cổng router: LAN nhìn VÀO trong nhà, WAN nhìn RA ngoài đường — dữ liệu luôn ra Internet qua cổng WAN.",
  ],
  flashcards: [
    {
      front: "Hub và switch khác nhau ở điểm nào?",
      back: "Hub phát tán tín hiệu ra tất cả các cổng còn lại; switch chỉ mở kênh truyền riêng giữa đúng cổng gửi và cổng nhận rồi huỷ sau khi truyền xong.",
    },
    {
      front: "Xung đột (collision) tín hiệu là gì?",
      back: "Hiện tượng nhiều máy cùng gửi dữ liệu đồng thời trên đường truyền chung khiến tín hiệu bị hỏng, phải truyền lại.",
    },
    {
      front: "WAP là gì?",
      back: "Wireless Access Point — điểm truy cập không dây, bộ thu phát Wi-Fi giúp nối thiết bị vào LAN không cần cáp.",
    },
    {
      front: "Cổng LAN và cổng WAN của router khác nhau thế nào?",
      back: "Cổng LAN nối vào các máy trong chính LAN đó; cổng WAN nối ra ngoài — tới router khác hoặc ra Internet.",
    },
    {
      front: "Định tuyến (routing) là gì?",
      back: "Việc router chọn cổng WAN thích hợp để gửi dữ liệu đi sao cho tới được đúng LAN của máy nhận.",
    },
    {
      front: "Modem là gì, tên gọi ghép từ đâu?",
      back: "Thiết bị chuyển đổi tín hiệu số ↔ tín hiệu tương tự; tên ghép từ Modulation (điều chế) và Demodulation (giải điều chế).",
    },
    {
      front: "Kể 4 loại modem trong SGK?",
      back: "Modem quay số, modem ADSL, modem quang, modem GSM 3G/4G/5G.",
    },
    {
      front: "Cáp mạng LAN thông dụng và loại giắc cắm của nó?",
      back: "Cáp UTP (4 đôi dây xoắn), dùng giắc cắm RJ45.",
    },
  ],
  checklist: [
    "Tôi phân biệt được hub và switch qua cách hoạt động (không phải hình dáng).",
    "Tôi giải thích được vì sao phải dùng router để nối 2 LAN ở xa nhau.",
    "Tôi nêu được vai trò của cổng LAN, cổng WAN và khái niệm định tuyến.",
    "Tôi nêu được modem làm gì và kể được ít nhất 2 loại modem.",
    "Tôi nêu được 2 cách nối máy tính vào mạng: bằng cáp và qua Wi-Fi.",
  ],
  diagram: "hub-vs-switch",
};

export default review;

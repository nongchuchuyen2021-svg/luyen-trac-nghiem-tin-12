import type { LessonTheory } from "@/lib/types";

// Bài 22. Thực hành kết nối các thiết bị số — SGK Tin học 12 (ICT, Kết nối tri
// thức), trang 118–125. Chủ đề 6 (Máy tính và xã hội tri thức).

const theory: LessonTheory = {
  minutes: 15,

  intro:
    "Bài học hướng dẫn các thao tác thực hành cơ bản để **kết nối các thiết bị số thông dụng**: từ kết nối màn hình rời, máy chiếu qua cổng VGA/HDMI, ghép đôi thiết bị âm thanh qua Bluetooth, truyền dữ liệu giữa điện thoại và máy tính, cho đến thiết lập và điều khiển thiết bị trong **hệ thống Nhà thông minh (Smart Home)**.",

  sections: [
    // ───────────────────────── MỤC 1 ─────────────────────────
    {
      id: "ket-noi-thiet-bi-hien-thi",
      emoji: "🖥️",
      heading: "Kết nối thiết bị hiển thị (Máy chiếu, Màn hình, Ti vi)",
      blocks: [
        {
          kind: "text",
          text: "**Thiết bị hiển thị** là các thiết bị điện tử được sử dụng để hiển thị hình ảnh, văn bản hoặc thông tin trực quan trên màn hình cho người dùng quan sát (như ti vi, máy chiếu, màn hình rời, bảng tương tác thông minh).",
        },
        {
          kind: "text",
          text: "Để kết nối máy tính với thiết bị hiển thị, phần lớn các thiết bị hiện nay trang bị hai loại cổng cắm phổ biến:",
        },
        {
          kind: "list",
          items: [
            "**Cổng VGA (Video Graphics Array):** Cổng truyền tín hiệu hình ảnh dạng tương tự (analog), có 15 chân cắm màu xanh dương. Cổng VGA **chỉ truyền hình ảnh, không truyền âm thanh** — nếu muốn có âm thanh, người dùng phải cắm thêm dây loa 3.5mm riêng.",
            "**Cổng HDMI (High-Definition Multimedia Interface):** Cổng giao tiếp đa phương tiện kĩ thuật số chất lượng cao. Cáp HDMI truyền tải **đồng thời cả hình ảnh độ nét cao và âm thanh kĩ thuật số** trên cùng một sợi dây duy nhất.",
          ],
        },
        {
          kind: "text",
          text: "Khi máy tính kết nối với màn hình phụ hoặc máy chiếu trên hệ điều hành Windows, nhấn tổ hợp phím **Windows + P** để lựa chọn một trong bốn chế độ hiển thị:",
        },
        {
          kind: "list",
          items: [
            "**PC screen only:** Chỉ hiển thị nội dung trên màn hình máy tính chính.",
            "**Duplicate (Nhân bản):** Hiển thị cùng một nội dung giống hệt nhau trên cả màn hình máy tính và thiết bị hiển thị ngoài (thường dùng khi giảng dạy, thuyết trình).",
            "**Extend (Mở rộng):** Mở rộng không gian làm việc sang màn hình thứ hai, cho phép kéo thả các cửa sổ ứng dụng khác nhau giữa hai màn hình.",
            "**Second screen only:** Tắt màn hình máy tính chính, chỉ hiển thị nội dung trên thiết bị hiển thị ngoài.",
          ],
        },
        {
          kind: "text",
          text: "Ngoài kết nối có dây, các thiết bị thông minh hiện nay còn hỗ trợ **phản chiếu màn hình không dây (Screen Mirroring)** như Miracast, AirPlay, Smart View để chiếu trực tiếp màn hình điện thoại hoặc máy tính lên Smart TV thông qua cùng mạng Wi-Fi.",
        },
        {
          kind: "check",
          q: "Điểm khác biệt quan trọng nhất giữa cổng kết nối HDMI và cổng VGA là gì?",
          options: [
            "Cổng HDMI truyền đồng thời cả hình ảnh và âm thanh, cổng VGA chỉ truyền hình ảnh",
            "Cổng VGA truyền đồng thời cả hình ảnh và âm thanh, cổng HDMI chỉ truyền hình ảnh",
            "Cổng HDMI chỉ sử dụng cho mạng không dây, cổng VGA chỉ dùng cho mạng có dây cáp",
            "Cổng VGA có tốc độ truyền tải tín hiệu âm thanh kĩ thuật số vượt trội hơn cổng HDMI",
          ],
          answer: 0,
          explain:
            "SGK chỉ rõ: Cổng HDMI truyền cả tín hiệu hình ảnh độ nét cao và âm thanh kĩ thuật số, trong khi cổng VGA truyền thống chỉ truyền tín hiệu hình ảnh tương tự (analog).",
        },
        {
          kind: "check",
          q: "Khi thuyết trình bài học, giáo viên muốn học sinh nhìn thấy màn hình máy chiếu giống hệt màn hình máy tính của mình thì nên chọn chế độ nào trong menu Project (Windows + P)?",
          options: [
            "Duplicate (Nhân bản màn hình)",
            "Extend (Mở rộng màn hình máy)",
            "Second screen only (Màn hình 2)",
            "PC screen only (Chỉ màn hình 1)",
          ],
          answer: 0,
          explain:
            "Chế độ Duplicate sao chép nguyên vẹn hình ảnh từ máy tính sang màn hình ngoài, phù hợp nhất khi thuyết trình hoặc giảng bài.",
        },
      ],
    },

    // ───────────────────────── MỤC 2 ─────────────────────────
    {
      id: "ket-noi-am-thanh-bluetooth",
      emoji: "🎧",
      heading: "Kết nối thiết bị âm thanh qua công nghệ Bluetooth",
      blocks: [
        {
          kind: "text",
          text: "**Bluetooth** là một công nghệ kết nối không dây qua sóng vô tuyến điện, được sử dụng để truyền tải dữ liệu giữa các thiết bị số (bao gồm cả âm thanh, hình ảnh và tập tin) trong phạm vi gần (thường dưới 10m).",
        },
        {
          kind: "text",
          text: "Quy trình kết nối thiết bị âm thanh (tai nghe, loa không dây) với máy tính hoặc điện thoại gồm các bước chính:",
        },
        {
          kind: "list",
          items: [
            "**Bước 1:** Bật nguồn thiết bị âm thanh và đưa thiết bị về trạng thái **chờ ghép nối (Pairing mode)**, thường bằng cách giữ nút nguồn hoặc nút Bluetooth vài giây cho đèn nhấp nháy.",
            "**Bước 2:** Bật tính năng Bluetooth trên máy tính hoặc điện thoại thông minh.",
            "**Bước 3:** Vào danh sách quét thiết bị khả dụng (Add device), tìm và chọn đúng tên thiết bị âm thanh cần ghép đôi.",
            "**Bước 4:** Xác nhận kết nối (nhập mã PIN/Passkey nếu có yêu cầu) cho đến khi trạng thái chuyển sang **Connected (Đã kết nối)**.",
          ],
        },
        {
          kind: "check",
          q: "Phạm vi hoạt động hiệu quả của công nghệ kết nối không dây Bluetooth thông thường là khoảng bao xa?",
          options: [
            "Khoảng cách gần, thông thường trong phạm vi dưới 10 mét",
            "Khoảng cách xa, có thể kết nối ổn định giữa hai tỉnh thành",
            "Phạm vi toàn cầu thông qua hệ thống vệ tinh định vị viễn thông",
            "Chỉ kết nối được khi hai thiết bị chạm trực tiếp bề mặt vào nhau",
          ],
          answer: 0,
          explain:
            "Bluetooth sử dụng sóng vô tuyến công suất thấp, phù hợp kết nối thiết bị cá nhân ở cự li gần (thường dưới 10 mét).",
        },
      ],
    },

    // ───────────────────────── MỤC 3 ─────────────────────────
    {
      id: "ket-noi-dien-thoai-may-tinh",
      emoji: "📱",
      heading: "Kết nối điện thoại thông minh với máy tính",
      blocks: [
        {
          kind: "text",
          text: "Kết nối giữa điện thoại và máy tính giúp sao chép ảnh chụp, video, tài liệu học tập và sao lưu dữ liệu cá nhân:",
        },
        {
          kind: "list",
          items: [
            "**Kết nối bằng cáp USB:** Cắm cáp kết nối điện thoại vào cổng USB của máy tính. Trên điện thoại, chọn chế độ **Truyền tệp (File Transfer / MTP)** thay vì chế độ *Chỉ sạc pin*. Máy tính sẽ nhận diện bộ nhớ điện thoại như một ổ đĩa di động trong File Explorer.",
            "**Kết nối không dây:** Sử dụng Bluetooth, chia sẻ tệp nội bộ (Quick Share trên Android, AirDrop trên iOS), hoặc thông qua các dịch vụ lưu trữ đám mây như Google Drive, OneDrive để đồng bộ dữ liệu hai chiều.",
          ],
        },
        {
          kind: "note",
          text: "Lưu ý an toàn: Khi cắm điện thoại vào máy tính công cộng, cần cẩn trọng không chọn 'Tin cậy máy tính này' hoặc không mở quyền truyền tệp nếu chỉ có nhu cầu sạc pin, nhằm tránh nguy cơ rò rỉ dữ liệu hoặc lây nhiễm mã độc.",
        },
      ],
    },

    // ───────────────────────── MỤC 4 ─────────────────────────
    {
      id: "nha-thong-minh-smart-home",
      emoji: "🏠",
      heading: "Kết nối và điều khiển thiết bị trong Nhà thông minh",
      blocks: [
        {
          kind: "text",
          text: "**Nhà thông minh (Smart Home)** là loại nhà được trang bị các thiết bị và hệ thống công nghệ thông minh nhằm tăng cường tiện ích, hiệu suất, bảo mật và khả năng quản lí cho người sử dụng.",
        },
        {
          kind: "text",
          text: "Các thành phần tiêu biểu trong hệ thống nhà thông minh gồm:",
        },
        {
          kind: "list",
          items: [
            "**Thiết bị chấp hành:** Đèn chiếu sáng thông minh, ổ cắm thông minh, khóa cửa vân tay/mã số, rèm cửa tự động, máy điều hòa nhiệt độ, robot hút bụi.",
            "**Cảm biến thông minh:** Cảm biến chuyển động, cảm biến mở cửa, cảm biến nhiệt độ - độ ẩm, cảm biến khói và rò rỉ khí gas.",
            "**Bộ điều khiển trung tâm (Hub/Gateway):** Thu nhận tín hiệu từ cảm biến và điều phối hoạt động của các thiết bị theo kịch bản cài đặt sẵn.",
          ],
        },
        {
          kind: "text",
          text: "Người dùng giao tiếp và điều khiển các thiết bị nhà thông minh chủ yếu qua **giao diện ứng dụng trên điện thoại thông minh/máy tính bảng** (như Google Home, Apple Home, SmartThings, Mi Home) hoặc bằng **khẩu lệnh qua trợ lí ảo** (Google Assistant, Siri, Alexa).",
        },
        {
          kind: "check",
          q: "Phương thức phổ biến nhất để người dùng điều khiển các thiết bị trong hệ thống Nhà thông minh hiện nay là gì?",
          options: [
            "Sử dụng các ứng dụng cài đặt trên điện thoại thông minh hoặc máy tính bảng",
            "Bắt buộc phải bấm trực tiếp các công tắc cơ học gắn ngầm ở bên trong tường",
            "Gửi thư điện tử định kì đến trung tâm quản trị máy chủ quốc tế để chờ xử lí",
            "Dùng remote hồng ngoại có dây nối vật lí cố định với từng bóng đèn riêng lẻ",
          ],
          answer: 0,
          explain:
            "SGK nêu rõ: hệ thống điều khiển nhà thông minh phổ biến nhất giao tiếp với người dùng qua giao diện ứng dụng trên điện thoại thông minh hay máy tính bảng, hoặc ra lệnh bằng giọng nói.",
        },
      ],
    },
  ],

  summary: [
    "Thiết bị hiển thị dùng để trình chiếu hình ảnh/thông tin; cổng **VGA** chỉ truyền hình ảnh tương tự, cổng **HDMI** truyền đồng thời cả hình ảnh nét cao và âm thanh kĩ thuật số.",
    "Tổ hợp phím **Windows + P** cho phép chọn 4 chế độ hiển thị: PC screen only, **Duplicate** (nhân bản), **Extend** (mở rộng), Second screen only.",
    "**Bluetooth** là công nghệ kết nối không dây qua sóng vô tuyến tầm ngắn (dưới 10m) để truyền dữ liệu và kết nối loa, tai nghe sau khi đưa về trạng thái chờ ghép nối (Pairing).",
    "Kết nối điện thoại với máy tính qua cáp USB ở chế độ **Truyền tệp (MTP)** để sao chép dữ liệu như một ổ đĩa di động.",
    "**Nhà thông minh (Smart Home)** gồm thiết bị chấp hành, cảm biến thông minh và bộ điều khiển trung tâm; người dùng điều khiển tiện lợi qua ứng dụng di động hoặc giọng nói.",
  ],
};

export default theory;

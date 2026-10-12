import type { LessonGame, SortGame, TimelineGame, ClassifyGame } from "@/lib/types";

// 3 trò chơi ôn bài tương tác chuẩn SGK Tin học 12 (Kết nối tri thức)
const games: LessonGame[] = [
  {
    "kind": "sort",
    "id": "the-anh-hay-video",
    "title": "Thẻ hình ảnh (img) hay Thẻ video (video)?",
    "emoji": "🎬",
    "instructions": "Phân loại đặc điểm và thuộc tính giữa thẻ chèn ảnh <img> và thẻ video <video>!",
    "matchLabel": "Thẻ <video>",
    "matchEmoji": "🎥",
    "noMatchLabel": "Thẻ <img>",
    "noMatchEmoji": "🖼️",
    "items": [
      {
        "id": "av-controls",
        "emoji": "⏯️",
        "label": "Thuộc tính 'controls': Hiển thị nút Play, Pause, Âm lượng",
        "isMatch": true,
        "explain": "controls cho phép người dùng điều khiển phát video/audio."
      },
      {
        "id": "av-alt",
        "emoji": "📝",
        "label": "Thuộc tính 'alt': Hiện dòng chữ mô tả khi tệp ảnh bị lỗi",
        "isMatch": false,
        "explain": "alt là thuộc tính bắt buộc của thẻ <img>."
      },
      {
        "id": "av-autoplay",
        "emoji": "⚡",
        "label": "Thuộc tính 'autoplay': Tự động phát khi trang web vừa tải xong",
        "isMatch": true,
        "explain": "autoplay dùng cho các thẻ phát đa phương tiện."
      },
      {
        "id": "av-src",
        "emoji": "📍",
        "label": "Thuộc tính 'src': Đường dẫn tới tệp nguồn .jpg, .png",
        "isMatch": false,
        "explain": "Cả hai thẻ đều có src, nhưng ảnh dùng định dạng ảnh tĩnh."
      },
      {
        "id": "av-the-don",
        "emoji": "➖",
        "label": "Là thẻ đơn, không có thẻ đóng",
        "isMatch": false,
        "explain": "<img> là thẻ đơn, còn <video> là thẻ đôi."
      },
      {
        "id": "av-the-doi",
        "emoji": "🔗",
        "label": "Là thẻ đôi, bên trong có thể chứa nhiều thẻ <source>",
        "isMatch": true,
        "explain": "<video> có thẻ đóng </video>."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "iframe-hay-audio",
    "title": "Khung nội tuyến (iframe) hay Âm thanh (audio)?",
    "emoji": "🎧",
    "instructions": "Phân loại giữa thẻ chèn khung nhúng <iframe> và thẻ âm thanh <audio>!",
    "matchLabel": "Khung nhúng <iframe>",
    "matchEmoji": "🪟",
    "noMatchLabel": "Âm thanh <audio>",
    "noMatchEmoji": "🎵",
    "items": [
      {
        "id": "ia-yt",
        "emoji": "▶️",
        "label": "Nhúng video phát từ YouTube hoặc bài nhạc từ Spotify",
        "isMatch": true,
        "explain": "<iframe> dùng để nhúng nội dung từ trang web khác vào trang mình."
      },
      {
        "id": "ia-mp3",
        "emoji": "🎼",
        "label": "Phát bài hát ghi âm định dạng .mp3 lưu trên máy",
        "isMatch": false,
        "explain": "<audio> chuyên phát tệp âm thanh trực tiếp."
      },
      {
        "id": "ia-maps",
        "emoji": "🗺️",
        "label": "Nhúng bản đồ Google Maps chỉ đường đến trường",
        "isMatch": true,
        "explain": "Bản đồ nhúng dùng thẻ <iframe>."
      },
      {
        "id": "ia-sound",
        "emoji": "🔊",
        "label": "Thuộc tính 'loop': Cho phép phát lặp đi lặp lại bản nhạc",
        "isMatch": false,
        "explain": "loop là thuộc tính của thẻ âm thanh/video."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "thuoc-tinh-src-va-alt",
    "title": "Thuộc tính src hay alt của thẻ img?",
    "emoji": "🖼️",
    "instructions": "Phân biệt hai thuộc tính then chốt: Đường dẫn nguồn ảnh (src) và Văn bản thay thế (alt)?",
    "matchLabel": "Văn bản thay thế (alt)",
    "matchEmoji": "💬",
    "noMatchLabel": "Nguồn ảnh (src)",
    "noMatchEmoji": "📍",
    "items": [
      {
        "id": "sa-url",
        "emoji": "📁",
        "label": "src=\"anh-lop-12.jpg\": Chỉ định tệp ảnh cần hiển thị",
        "isMatch": false,
        "explain": "src là Source — nguồn tệp ảnh."
      },
      {
        "id": "sa-text",
        "emoji": "📝",
        "label": "alt=\"Ảnh tập thể lớp 12A\": Mô tả nội dung bức ảnh",
        "isMatch": true,
        "explain": "alt là Alternative Text — văn bản thay thế."
      },
      {
        "id": "sa-screen",
        "emoji": "👓",
        "label": "Hỗ trợ người khiếm thị nghe đọc mô tả bức ảnh",
        "isMatch": true,
        "explain": "Công cụ đọc màn hình đọc nội dung trong thuộc tính alt."
      },
      {
        "id": "sa-load",
        "emoji": "⏳",
        "label": "Nơi trình duyệt gửi yêu cầu tải dữ liệu ảnh về",
        "isMatch": false,
        "explain": "Trình duyệt tải ảnh từ địa chỉ src."
      }
    ]
  }
];

export default games;

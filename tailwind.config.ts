import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // Bảng màu lớp 12: xanh biển sâu + cam san hô.
      // Cố ý khác hẳn web lớp 10 (tím #7C3AED + hồng #EC4899) — tông trầm và
      // tập trung hơn, hợp với khối thi. Tên màu đặt riêng, không trùng tên màu
      // mặc định của Tailwind để không ghi đè các thang màu sẵn có.
      colors: {
        ink: "#12212B", // chữ chính, xanh đen
        "ink-soft": "#4C5D6B", // chữ phụ
        cream: "#F5F8F9", // nền trang, xanh sương rất nhạt
        sea: "#0D7C86", // màu chủ đạo
        "sea-deep": "#075B63", // màu chủ đạo, sắc đậm
        coral: "#F2683C", // màu nhấn, cặp với sea trong các dải chuyển màu
        leaf: "#0E9F6E", // trả lời đúng — dùng làm NỀN
        "leaf-deep": "#0B6E4F", // bản đậm, dùng cho CHỮ trên nền nhạt (6,25:1)
        gold: "#EFA31D", // sao, thành tích — dùng làm NỀN
        "gold-deep": "#8F5D02", // bản đậm, dùng cho CHỮ trên nền nhạt (5,62:1)
        berry: "#DC2626", // trả lời sai
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(30,36,56,0.05), 0 8px 24px rgba(30,36,56,0.08)",
        "card-hover": "0 2px 4px rgba(30,36,56,0.06), 0 14px 34px rgba(30,36,56,0.14)",
      },
      keyframes: {
        "pop-in": {
          "0%": { opacity: "0", transform: "translateY(10px) scale(0.97)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        wiggle: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-4px)" },
          "75%": { transform: "translateX(4px)" },
        },
      },
      animation: {
        "pop-in": "pop-in 0.25s ease-out both",
        wiggle: "wiggle 0.3s ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;

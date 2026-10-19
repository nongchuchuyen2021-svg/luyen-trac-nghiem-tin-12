import { TX2_MINUTES } from "./tx2-config";
export const TX2_OPENING_LABEL = "Hằng ngày, 7:10–10:30 (giờ Việt Nam)";
// Chỉ dành cho việc chuyển kết quả sau giờ đóng, không mở thêm thời gian làm bài.
export const TX2_SUBMIT_GRACE_MS = 90_000;
export function tx2DailyWindow(now = Date.now()) {
  const day = new Date(now + 7 * 3600_000).toISOString().slice(0, 10);
  return { opensAt: Date.parse(day + "T07:10:00+07:00"), closesAt: Date.parse(day + "T10:30:00+07:00") };
}
export function tx2Access(now = Date.now()) {
  const window = tx2DailyWindow(now);
  const open = now >= window.opensAt && now < window.closesAt;
  return { ok: true, open, serverNow: now, ...window, label: TX2_OPENING_LABEL,
    message: open ? "Đang trong giờ mở bài kiểm tra." : now < window.opensAt ? "Chưa đến giờ kiểm tra. Bài mở lúc 7:10 sáng." : "Đã hết giờ kiểm tra hôm nay. Bài mở lại lúc 7:10 sáng hôm sau." };
}
export function tx2Deadline(now = Date.now()): number | null {
  return tx2Access(now).open ? Math.min(now + TX2_MINUTES * 60_000, tx2DailyWindow(now).closesAt) : null;
}
export function tx2CanSubmit(now = Date.now()): boolean {
  const { opensAt, closesAt } = tx2DailyWindow(now);
  return now >= opensAt && now < closesAt + TX2_SUBMIT_GRACE_MS;
}
export type Tx2Access = ReturnType<typeof tx2Access>;

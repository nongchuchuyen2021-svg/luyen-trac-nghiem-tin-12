/** Dùng mốc hết giờ thực tế để thời gian nền không được cộng thêm vào bài. */
export function soGiayTx2ConLai(deadline: number, now = Date.now()): number {
  return Math.max(0, Math.ceil((deadline - now) / 1000));
}

/** Chỉ theo dõi đổi trạng thái hiển thị; bấm vào ô nhập không đổi đề. */
export function theoDoiTabTx2(
  source: Pick<Document, "hidden" | "addEventListener" | "removeEventListener">,
  onChange: (hidden: boolean) => void,
): () => void {
  let wasHidden = source.hidden;
  const listener = () => {
    if (source.hidden === wasHidden) return;
    wasHidden = source.hidden;
    onChange(wasHidden);
  };
  source.addEventListener("visibilitychange", listener);
  return () => source.removeEventListener("visibilitychange", listener);
}

# do_dai.py — đếm số câu có đáp án đúng dài hơn hẳn phương án nhiễu.
# Mục tiêu: 0 câu ở mọi bài. Chạy ngay sau khi soạn xong mỗi bài.
import glob, io, os, re, sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
NGUONG = 10
obj = re.compile(r"options:\s*\[(.*?)\]\s*,\s*answer:\s*(\d)", re.S)
st = re.compile(r'"((?:[^"\\]|\\.)*)"')
tong = hon = 0
theo_bai = {}
tong_dung = tong_nhieu = 0
for f in sorted(glob.glob("data/questions/bai-*.ts")):
    s = open(f, encoding="utf-8").read()
    n = h = 0
    for m in obj.finditer(s):
        o = st.findall(m.group(1))
        if len(o) != 4:
            continue
        i = int(m.group(2))
        L = [len(x) for x in o]
        nhieu = [l for j, l in enumerate(L) if j != i]
        tong += 1
        n += 1
        tong_dung += L[i]
        tong_nhieu += sum(nhieu) / 3
        if L[i] - max(nhieu) >= NGUONG:
            hon += 1
            h += 1
            print(f"  ⚠ {os.path.basename(f)[:-3]} câu {n}: đúng {L[i]} kí tự, nhiễu dài nhất {max(nhieu)}")
    theo_bai[os.path.basename(f)[:-3]] = (h, n)
if tong:
    print(f"\n{hon}/{tong} câu có đáp án đúng dài hơn hẳn ({hon * 100 // tong}%)")
    print(f"Độ dài trung bình: đáp án đúng {tong_dung / tong:.0f} kí tự, nhiễu {tong_nhieu / tong:.0f} kí tự")
    for t, (h, n) in sorted(theo_bai.items()):
        print(f"  {t}: {h}/{n} lỗi")
else:
    print("Chưa có bài nào trong data/questions/")

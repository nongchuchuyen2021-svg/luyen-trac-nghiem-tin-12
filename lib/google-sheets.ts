import { TX2_TAB, TX2_HEADERS } from "./tx2-config";
import crypto from "node:crypto";

// Ghi một dòng vào Google Sheets từ phía máy chủ.
//
// CỐ Ý không dùng thư viện googleapis — nó nặng và kéo theo hàng chục gói phụ
// thuộc. Ở đây chỉ cần hai việc: tự kí một JWT bằng khoá của service account
// để đổi lấy access token, rồi gọi thẳng REST API của Sheets. Cả hai đều làm
// được bằng crypto và fetch có sẵn của Node.
//
// TỆP NÀY CHỈ ĐƯỢC IMPORT TỪ PHÍA MÁY CHỦ (app/api/**). Khoá bí mật nằm trong
// biến môi trường, tuyệt đối không để lọt xuống mã chạy trên trình duyệt.

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/spreadsheets";

type CacheToken = { token: string; hetHan: number };
let cache: CacheToken | null = null;

function bienMoiTruong() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  // Khoá dán vào Vercel thường có "\n" dạng hai kí tự, phải đổi lại thành
  // xuống dòng thật thì crypto mới đọc được.
  const khoa = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!email || !khoa || !sheetId) return null;
  return { email, khoa, sheetId };
}

function layCauHinhAppsScript() {
  const webAppUrl =
    process.env.GOOGLE_SHEET_WEBAPP_URL ||
    process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBAPP_URL;
  return webAppUrl?.trim() || null;
}

export function daCauHinh() {
  return bienMoiTruong() !== null || layCauHinhAppsScript() !== null;
}

function base64url(o: unknown) {
  return Buffer.from(JSON.stringify(o)).toString("base64url");
}

async function layAccessToken(email: string, khoa: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  // Còn hạn ít nhất 60 giây thì dùng lại, đỡ gọi Google mỗi lần nộp bài.
  if (cache && cache.hetHan - 60 > now) return cache.token;

  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: email,
    scope: SCOPE,
    aud: TOKEN_URL,
    exp: now + 3600,
    iat: now,
  };
  const chuaKi = `${base64url(header)}.${base64url(claim)}`;
  const chuKi = crypto.createSign("RSA-SHA256").update(chuaKi).sign(khoa, "base64url");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${chuaKi}.${chuKi}`,
    }),
  });

  if (!res.ok) {
    throw new Error(`Không lấy được access token (HTTP ${res.status})`);
  }
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cache = { token: data.access_token, hetHan: now + data.expires_in };
  return data.access_token;
}

/** Ghi thêm một dòng vào cuối trang tính. Ném lỗi nếu thất bại. */
export async function themDong(dong: (string | number)[], duLieuGoc?: Record<string, unknown>): Promise<void> {
  const env = bienMoiTruong();
  if (env) {
    const token = await layAccessToken(env.email, env.khoa);
    const url =
      `https://sheets.googleapis.com/v4/spreadsheets/${env.sheetId}` +
      `/values/A:I:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: [dong] }),
    });

    if (!res.ok) {
      const chiTiet = await res.text();
      throw new Error(`Ghi bảng tính thất bại (HTTP ${res.status}): ${chiTiet.slice(0, 300)}`);
    }
    return;
  }

  const appsScriptUrl = layCauHinhAppsScript();
  if (appsScriptUrl) {
    const payload = duLieuGoc ?? {
      thoiGian: dong[0],
      hoTen: dong[1],
      lop: dong[2],
      baiId: dong[3],
      tenBai: dong[4],
      dang: dong[5],
      diem: dong[6],
      soCauDung: dong[7],
      tongSoCau: dong[8],
    };
    const res = await fetch(appsScriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Google Apps Script HTTP ${res.status}`);
    const data = await res.json().catch(() => ({}));
    if (data.ok === false) throw new Error(data.error || "Lỗi ghi Apps Script");
    return;
  }

  throw new Error("Chưa cấu hình biến môi trường Google Sheets");
}

let tx2Ready: { sheetId: string; promise: Promise<void> } | null = null;
/** TX2 dùng tab thang điểm 10; các lượt luyện tập vẫn ghi như trước. */
export async function themDongTx2(row: (string | number)[], duLieuGoc?: Record<string, unknown>): Promise<void> {
  const env = bienMoiTruong();
  if (env) {
    const token = await layAccessToken(env.email, env.khoa);
    const base = "https://sheets.googleapis.com/v4/spreadsheets/" + env.sheetId;
    const headers = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
    const request = async (url: string, init: RequestInit = {}) => {
      const res = await fetch(url, { ...init, headers });
      if (!res.ok) throw new Error("Google Sheets HTTP " + res.status);
      return res.json();
    };
    const initTab = async () => {
      const metaUrl = base + "?fields=sheets(properties(title))";
      const metadata = await request(metaUrl);
      if (!metadata.sheets?.some((sheet: { properties?: { title?: string } }) => sheet.properties?.title === TX2_TAB)) {
        const created = await fetch(base + ":batchUpdate", { method: "POST", headers, body: JSON.stringify({ requests: [{ addSheet: { properties: { title: TX2_TAB, gridProperties: { frozenRowCount: 1 } } } }] }) });
        if (!created.ok) {
          // Hai học sinh đầu tiên có thể cùng tạo tab; chỉ bỏ qua nếu đã có tab.
          if (created.status !== 400 && created.status !== 409) throw new Error("Tạo tab TX2 HTTP " + created.status);
          const refreshed = await request(metaUrl);
          if (!refreshed.sheets?.some((sheet: { properties?: { title?: string } }) => sheet.properties?.title === TX2_TAB)) throw new Error("Không tạo được tab TX2");
        }
      }
      const headerUrl = base + "/values/" + encodeURIComponent("'" + TX2_TAB + "'!A1:I1");
      const current = await request(headerUrl);
      if (!current.values?.[0]?.some((value: unknown) => String(value ?? "").trim())) {
        await request(headerUrl + "?valueInputOption=RAW", { method: "PUT", body: JSON.stringify({ values: [TX2_HEADERS] }) });
      } else if (JSON.stringify(current.values[0]) !== JSON.stringify(TX2_HEADERS)) {
        throw new Error("Tab TX2 có tiêu đề khác cấu trúc điểm /10; cần giáo viên kiểm tra trước khi ghi");
      }
    };
    if (!tx2Ready || tx2Ready.sheetId !== env.sheetId) tx2Ready = { sheetId: env.sheetId, promise: initTab() };
    try {
      await tx2Ready.promise;
      const result = await request(base + "/values/" + encodeURIComponent("'" + TX2_TAB + "'!A:I") + ":append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS", { method: "POST", body: JSON.stringify({ values: [row] }) });
      if (result.updates?.updatedRows !== 1) throw new Error("Google Sheets chưa xác nhận ghi một dòng kết quả TX2");
    } catch (e) { tx2Ready = null; throw e; }
    return;
  }

  const appsScriptUrl = layCauHinhAppsScript();
  if (appsScriptUrl) {
    const payload = duLieuGoc ?? {
      thoiGian: row[0],
      hoTen: row[1],
      lop: row[2],
      baiId: row[3],
      tenBai: row[4],
      dang: row[5],
      diem: row[6],
      soCauDung: row[7],
      tongSoCau: row[8],
      tab: TX2_TAB,
    };
    const res = await fetch(appsScriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Google Apps Script HTTP ${res.status}`);
    const data = await res.json().catch(() => ({}));
    if (data.ok === false) throw new Error(data.error || "Lỗi ghi Apps Script");
    return;
  }

  throw new Error("Chưa cấu hình biến môi trường Google Sheets");
}

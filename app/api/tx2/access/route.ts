import { NextResponse } from "next/server";
import { tx2Access, tx2Deadline } from "@/lib/tx2-schedule";
import { dungMienNopBai } from "@/lib/submission-origin";
import { hopLe, chuanHoa } from "@/lib/hocsinh";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store, max-age=0" };
export async function GET() { return NextResponse.json(tx2Access(), { headers }); }
export async function POST(req: Request) {
  if (!dungMienNopBai(req)) return NextResponse.json({ok:false,loi:"Nguồn yêu cầu không hợp lệ"},{status:403,headers});
  const now = Date.now(), access = tx2Access(now), deadline = tx2Deadline(now);
  if (deadline === null) return NextResponse.json({...access,ok:false,loi:access.message},{status:403,headers});
  let value: unknown;
  try { const raw=await req.text(); if(raw.length>2000)throw new Error(); value=JSON.parse(raw); } catch { return NextResponse.json({ok:false,loi:"Thông tin học sinh không hợp lệ"},{status:400,headers}); }
  const b=value as Record<string,unknown>|null;
  if(!b||typeof b.hoTen!=="string"||typeof b.lop!=="string"||b.hoTen.length>60||b.lop.length>12||!hopLe({hoTen:b.hoTen,lop:b.lop}))return NextResponse.json({ok:false,loi:"Nhập đầy đủ họ tên và lớp"},{status:400,headers});
  return NextResponse.json({...access,deadline,student:chuanHoa({hoTen:b.hoTen,lop:b.lop})},{headers});
}

import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { dungMienNopBai } from "@/lib/submission-origin";
import { themDong, daCauHinh } from "@/lib/google-sheets";
import { validateReviewAnswers,reviewSummary } from "@/lib/review-1-8";
import { REVIEW_VERSION } from "@/data/review-1-8";
import { hopLe,chuanHoa } from "@/lib/hocsinh";
export const runtime="nodejs"; export const dynamic="force-dynamic";
const saved=new Map<string,{hash:string;at:number;promise:Promise<unknown>}>();
const limit=new Map<string,{count:number;at:number}>();
export async function POST(req:Request){
 if(!dungMienNopBai(req))return NextResponse.json({ok:false,loi:"Nguồn nộp không hợp lệ"},{status:403});
 const raw=await req.text();if(raw.length>50000)return NextResponse.json({ok:false,loi:"Nội dung quá dài"},{status:413});
 let b:Record<string,unknown>;try{b=JSON.parse(raw);}catch{return NextResponse.json({ok:false,loi:"Dữ liệu không hợp lệ"},{status:400});}
 if(!b||typeof b!=="object"||typeof b.hoTen!=="string"||typeof b.lop!=="string"||b.hoTen.length>60||b.lop.length>12||typeof b.saveId!=="string"||!/^[-a-zA-Z0-9]{8,80}$/.test(b.saveId)||b.version!==REVIEW_VERSION)return NextResponse.json({ok:false,loi:"Thông tin học sinh hoặc phiên ôn chưa hợp lệ"},{status:400});
 const hs=chuanHoa({hoTen:b.hoTen,lop:b.lop});if(!hopLe(hs))return NextResponse.json({ok:false,loi:"Nhập đủ họ tên và lớp"},{status:400});
 const answers=validateReviewAnswers(b.answers);if(!answers)return NextResponse.json({ok:false,loi:"Câu trả lời không đúng cấu trúc đề cương"},{status:400});
 const summary=reviewSummary(answers);if(!summary.completed)return NextResponse.json({ok:false,loi:"Hoàn thành ít nhất một câu trước khi lưu"},{status:400});
 const hash=crypto.createHash("sha256").update(JSON.stringify({hs,answers})).digest("hex"),key=hs.lop+":"+hs.hoTen.toLocaleLowerCase("vi")+":"+b.saveId;
 const prior=saved.get(key);if(prior){if(prior.hash!==hash)return NextResponse.json({ok:false,loi:"Mã lưu đã dùng cho kết quả khác"},{status:409});try{return NextResponse.json(await prior.promise);}catch{saved.delete(key);}}
 const now=Date.now(),ip=req.headers.get("x-forwarded-for")?.split(",")[0]??"local",rateKey=ip+":"+hs.lop+":"+hs.hoTen,rate=limit.get(rateKey);if(rate&&now-rate.at<600000){if(++rate.count>90)return NextResponse.json({ok:false,loi:"Em lưu quá nhiều lần, vui lòng đợi ít phút"},{status:429});}else limit.set(rateKey,{count:1,at:now});
 saved.forEach((value,k)=>{if(now-value.at>1800000)saved.delete(k);});limit.forEach((value,k)=>{if(now-value.at>600000)limit.delete(k);});
 if(!daCauHinh())return NextResponse.json({ok:false,loi:"Chưa cấu hình bảng điểm, tiến độ vẫn được giữ trên máy"},{status:503});
 const safe=(s:string)=>/^[=+\-@]/.test(s)?"'"+s:s,thoiGian=new Date().toLocaleString("vi-VN",{timeZone:"Asia/Ho_Chi_Minh"});
 const detail={saveId:b.saveId,version:REVIEW_VERSION,summary,answers};
 const title="Ôn tập bài 1–8 — Tin học 12";
 const payload={thoiGian,hoTen:safe(hs.hoTen),lop:safe(hs.lop),baiId:"on-tap-1-8",tenBai:title,dang:"Ôn tập",diem:summary.objectiveScore,soCauDung:summary.correct,tongSoCau:108,review:detail};
 const promise=themDong([thoiGian,payload.hoTen,payload.lop,payload.baiId,title,payload.dang,payload.diem,payload.soCauDung,108],payload).then(result=>({ok:true,thoiGian,summary,saveId:b.saveId,detailSaved:result?.reviewSaved===true}));saved.set(key,{hash,at:now,promise});
 try{return NextResponse.json(await promise);}catch(error){saved.delete(key);console.error("Lưu ôn tập thất bại",error instanceof Error?error.message:"unknown");return NextResponse.json({ok:false,loi:"Chưa lưu được Google Sheets. Tiến độ vẫn trên máy; em có thể thử lại."},{status:502});}
}

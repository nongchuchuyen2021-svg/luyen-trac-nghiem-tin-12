import { REVIEW_MC, REVIEW_TF, REVIEW_ESSAYS, REVIEW_VERSION } from "@/data/review-1-8";
export type ReviewAnswers = { mc: Record<string,{choice:number|null;checked:boolean}>; tf: Record<string,{choices:(boolean|null)[];checked:boolean}>; essays: Record<string,{text:string;rubric:boolean[];reviewed:boolean}> };
export const emptyReviewAnswers = (): ReviewAnswers => ({mc:{},tf:{},essays:{}});
export function validateReviewAnswers(input: unknown): ReviewAnswers | null {
 if(!input||typeof input!=="object"||Array.isArray(input))return null;
 const b=input as Record<string,unknown>, result=emptyReviewAnswers();
 for(const kind of ["mc","tf","essays"] as const) if(!b[kind]||typeof b[kind]!=="object"||Array.isArray(b[kind]))return null;
 const mc=b.mc as Record<string,unknown>,tf=b.tf as Record<string,unknown>,essays=b.essays as Record<string,unknown>;
 if(Object.keys(mc).some(id=>!REVIEW_MC.some(q=>q.id===id))||Object.keys(tf).some(id=>!REVIEW_TF.some(q=>q.id===id))||Object.keys(essays).some(id=>!REVIEW_ESSAYS.some(q=>q.id===id)))return null;
 for(const [id,value]of Object.entries(mc)){if(!value||typeof value!=="object")return null;const a=value as {choice:unknown;checked:unknown};if(typeof a.checked!=="boolean"||!(a.choice===null||typeof a.choice==="number"&&Number.isInteger(a.choice)&&a.choice>=0&&a.choice<4)||a.checked&&a.choice===null)return null;result.mc[id]={choice:a.choice as number|null,checked:a.checked};}
 for(const [id,value]of Object.entries(tf)){if(!value||typeof value!=="object")return null;const a=value as {choices:unknown;checked:unknown};if(typeof a.checked!=="boolean"||!Array.isArray(a.choices)||a.choices.length!==4||a.choices.some(v=>v!==null&&typeof v!=="boolean")||a.checked&&a.choices.includes(null))return null;result.tf[id]={choices:a.choices,checked:a.checked};}
 for(const [id,value]of Object.entries(essays)){if(!value||typeof value!=="object")return null;const a=value as {text:unknown;rubric:unknown;reviewed:unknown};if(typeof a.text!=="string"||a.text.length>2000||typeof a.reviewed!=="boolean"||!Array.isArray(a.rubric)||a.rubric.length!==4||a.rubric.some(v=>typeof v!=="boolean")||a.reviewed&&a.text.trim().length<20)return null;result.essays[id]={text:a.text,rubric:a.rubric,reviewed:a.reviewed};}
 return result;
}
export function reviewSummary(a:ReviewAnswers){
 const mcDone=REVIEW_MC.filter(q=>a.mc[q.id]?.checked).length,mcCorrect=REVIEW_MC.filter(q=>a.mc[q.id]?.checked&&a.mc[q.id].choice===q.answer).length;
 const tfDone=REVIEW_TF.filter(q=>a.tf[q.id]?.checked).length;
 const tfCorrect=REVIEW_TF.reduce((sum,q)=>sum+(a.tf[q.id]?.checked?q.statements.filter((s,i)=>s.answer===a.tf[q.id].choices[i]).length:0),0);
 const es=REVIEW_ESSAYS.filter(q=>a.essays[q.id]?.reviewed),essayDone=es.length;
 const essaySelf=essayDone?Math.round(es.reduce((sum,q)=>sum+a.essays[q.id].rubric.filter(Boolean).length/4*10,0)/essayDone*100)/100:null;
 return {mcDone,mcCorrect,tfDone,tfUnits:tfDone*4,tfCorrect,essayDone,essaySelf,completed:mcDone+tfDone+essayDone,completion:Math.round((mcDone+tfDone+essayDone)/80*100),correct:mcCorrect+tfCorrect,objectiveScore:Math.round((mcCorrect+tfCorrect)/108*10*100)/100};
}
export function reviewStorageKey(name:string,cls:string){return "ltn12:"+REVIEW_VERSION+":"+encodeURIComponent(cls.trim().toUpperCase()+":"+name.trim().replace(/\s+/g," ").toLocaleLowerCase("vi"));}

// A small teaching checker for the explicitly closed markup used in Lesson 7.
// It checks the assignment, not full HTML conformance; browser error recovery is
// intentionally not used to give credit for a missing head/body or crossing tags.
const lessonVoidTags=new Set('area base br col embed hr img input link meta param source track wbr'.split(' '));
function readLessonHTML(value){
 const source=String(value),root={tag:'#document',children:[],parent:null},stack=[root],nodes=[],issues=[];let i=0,doctype=false;
 const lineAt=p=>source.slice(0,p).split('\n').length;
 const issue=(pos,message)=>issues.push({line:lineAt(pos),message});
 function text(s){if(s)stack[stack.length-1].children.push({tag:'#text',text:s,children:[]});}
 while(i<source.length){
  if(source.startsWith('<!--',i)){const end=source.indexOf('-->',i+4);if(end<0){issue(i,'Chú thích chưa có dấu kết thúc -->.');break;}i=end+3;continue;}
  if(source[i]!=='<'){const next=source.indexOf('<',i);text(source.slice(i,next<0?source.length:next));i=next<0?source.length:next;continue;}
  const start=i;let quote=null,j=i+1;
  for(;j<source.length;j++){const c=source[j];if(quote){if(c===quote)quote=null;}else if(c==='"'||c==="'")quote=c;else if(c==='>')break;}
  if(j>=source.length){issue(i,quote?'Giá trị thuộc tính chưa đóng dấu ngoặc kép hoặc nháy đơn.':'Thẻ chưa kết thúc bằng dấu >.');break;}
  const raw=source.slice(i,j+1);i=j+1;
  if(/^<!doctype\s+html\s*>$/i.test(raw)){if(doctype||nodes.length||root.children.some(n=>n.tag==='#text'&&n.text.trim()))issue(start,'Đặt một khai báo <!DOCTYPE html> ở đầu tệp, trước html.');doctype=true;continue;}
  if(/^<!/i.test(raw)){issue(start,'Kiểm tra khai báo. Bài này dùng <!DOCTYPE html>.');continue;}
  const closing=raw.match(/^<\/\s*([a-z][\w:-]*)\s*>$/i);
  if(closing){const tag=closing[1].toLowerCase();if(lessonVoidTags.has(tag)){issue(start,`<${tag}> là thẻ đơn, hãy bỏ </${tag}>.`);continue;}
   let found=-1;for(let k=stack.length-1;k>0;k--)if(stack[k].tag===tag){found=k;break;}
   if(found<0){issue(start,`Có </${tag}> nhưng chưa thấy thẻ mở tương ứng.`);continue;}
   if(found!==stack.length-1)issue(start,`Đang ở trong <${stack[stack.length-1].tag}>. Hãy đóng </${stack[stack.length-1].tag}> trước </${tag}>.`);
   stack[found].closed=true;stack.length=found;continue;
  }
  const opening=raw.match(/^<([a-z][\w:-]*)([\s\S]*?)>$/i);
  if(!opening){issue(start,'Kiểm tra tên thẻ và hai dấu < >.');continue;}
  const tag=opening[1].toLowerCase(),attrs={};let rest=opening[2].replace(/\/\s*$/,'');
  const attrPattern=/([^\s=<>"'`/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;let a;
  while((a=attrPattern.exec(rest)))attrs[a[1].toLowerCase()]=a[2]??a[3]??a[4]??'';
  const node={tag,attrs,children:[],parent:stack[stack.length-1],line:lineAt(start),closed:lessonVoidTags.has(tag)};node.parent.children.push(node);nodes.push(node);
  if(lessonVoidTags.has(tag))continue;
  if(/\/\s*>$/.test(raw))issue(start,`Theo mẫu HTML của bài, <${tag}> cần thẻ đóng </${tag}> riêng. Dấu /> không tự đóng phần tử này.`);
  stack.push(node);
  if(['script','style','title','textarea'].includes(tag)){
   const close=new RegExp('</'+tag+'\\s*>','ig');close.lastIndex=i;const match=close.exec(source);
   if(match){text(source.slice(i,match.index));node.closed=true;stack.pop();i=close.lastIndex;}
   else{text(source.slice(i));i=source.length;}
  }
 }
 for(const node of stack.slice(1))issue(source.length,`Theo quy ước viết đủ thẻ của bài thực hành, còn thiếu </${node.tag}> (mở ở dòng ${node.line}).`);
 return {root,nodes,issues,doctype};
}
function lessonText(node){return node.tag==='#text'?node.text:node.children.map(lessonText).join(' ');}
function meaningfulLessonText(node){return !!node&&lessonText(node).replace(/&(?:nbsp|#160|#x0*a0);/ig,' ').replace(/\s/g,'').length>0;}
function withinLesson(node,parent){for(let p=node.parent;p;p=p.parent)if(p===parent)return true;return false;}
function checkLessonWork(source,mission='foundation'){
 const parsed=readLessonHTML(source),{nodes,issues}=parsed,html=nodes.filter(n=>n.tag==='html'),head=nodes.find(n=>n.tag==='head'&&n.parent===html[0]),body=nodes.find(n=>n.tag==='body'&&n.parent===html[0]);
 const find=(tag,parent)=>nodes.filter(n=>n.tag===tag&&parent&&withinLesson(n,parent));
 const title=find('title',head).find(meaningfulLessonText),heading=find('h1',body).find(meaningfulLessonText),paragraphs=find('p',body).filter(meaningfulLessonText);
 const checks=[
  {key:'doctype',label:'Khai báo HTML',ok:parsed.doctype,fix:'Thêm <!DOCTYPE html> ở đầu tệp.'},
  {key:'structure',label:'Khung html, head, body',ok:html.length===1&&html[0].parent===parsed.root&&!!head&&!!body&&html[0].children.indexOf(head)<html[0].children.indexOf(body)&&nodes.filter(n=>n.tag==='head').length===1&&nodes.filter(n=>n.tag==='body').length===1,fix:'Viết một <html> bao <head> rồi <body>. Hai phần head và body cùng cấp.'},
  {key:'charset',label:'Mã hóa tiếng Việt',ok:find('meta',head).some(n=>n.attrs.charset?.toLowerCase()==='utf-8'),fix:'Trong <head>, thêm <meta charset="utf-8"> và lưu tệp theo UTF-8.'},
  {key:'title',label:'Tên tab có nội dung',ok:!!title,fix:'Viết tên trang giữa <title> và </title> bên trong <head>.'},
  {key:'h1',label:'Tiêu đề trang có nội dung',ok:!!heading,fix:'Trong <body>, viết một <h1> có lời chào hoặc tên trang.'},
  {key:'p',label:mission==='create'?'Hai đoạn văn có nội dung':'Đoạn văn có nội dung',ok:paragraphs.length>=(mission==='create'?2:1),fix:mission==='create'?'Viết ít nhất hai phần tử <p> có nội dung trong <body>.':'Viết ít nhất một <p> có nội dung trong <body>.'},
  {key:'syntax',label:'Thứ tự và cặp thẻ theo mẫu',ok:issues.length===0,fix:issues[0]?`Dòng ${issues[0].line}: ${issues[0].message}`:'Kiểm tra thứ tự mở, đóng thẻ.'},
 ];
 if(mission==='repair'||mission==='create')checks.push({key:'em',label:'Nhấn mạnh nằm trong đoạn',ok:find('em',body).some(n=>meaningfulLessonText(n)&&paragraphs.some(p=>withinLesson(n,p))),fix:'Lồng một <em> có nội dung trong <p>, rồi đóng </em> trước </p>.'});
 if(mission==='create')checks.push({key:'br',label:'Ngắt dòng trong một đoạn',ok:find('br',body).some(n=>paragraphs.some(p=>withinLesson(n,p))),fix:'Thêm <br> tại chỗ muốn xuống dòng trong một đoạn <p>.'});
 return {parsed,checks,passed:checks.filter(c=>c.ok).length,total:checks.length,complete:checks.every(c=>c.ok),title:title?lessonText(title):''};
}

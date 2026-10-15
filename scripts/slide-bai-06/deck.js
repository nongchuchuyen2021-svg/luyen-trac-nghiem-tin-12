'use strict';
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const card = (icon, title, text, extra = '') => `<div class="card reveal" aria-hidden="true" inert><span class="icon" aria-hidden="true">${icon}</span><h3>${title}</h3><p>${text}</p>${extra}</div>`;
const ribbon = text => `<div class="ribbon">${text}</div>`;
const sections = [
  { title:'Giao tiếp và ứng xử trong không gian mạng', tag:'Bài 6 · Tin học 12 · Kết nối tri thức', lead:'Chủ đề 3 · Đạo đức, pháp luật và văn hóa trong môi trường số', html:`
    <div class="hero"><div><p class="prompt">CÂU HỎI KHỞI ĐỘNG</p><div class="hero-title">Mạng có thể “ảo”.<br><em>Cảm xúc là thật.</em></div><p class="lead">Một tin nhắn có thể động viên bạn.<br>Cũng có thể khiến bạn buồn cả ngày.</p></div><div class="hero-orbit" aria-label="Con người ở trung tâm của các kết nối số"><span class="hero-core" aria-hidden="true">🧑‍🤝‍🧑</span><span class="satellite" aria-hidden="true">💬</span><span class="satellite" aria-hidden="true">🌐</span><span class="satellite" aria-hidden="true">💛</span></div></div>
    <div class="grid three hero-small">${card('','🌐 Kết nối','Nhận biết giao tiếp qua mạng.')}${card('','⚖️ Cân nhắc','Thấy rõ lợi ích và rủi ro.')}${card('','💛 Ứng xử','Tôn trọng, lịch sự, thấu hiểu, hỗ trợ.')}</div><p class="teacher-note">Thảo luận nhanh: Em đã từng hiểu nhầm một tin nhắn chưa? Vì sao?</p>` },
  { title:'Không gian mạng: con người kết nối qua mạng máy tính',tag:'01 · Nhận biết',lead:'Không phải nơi có chữ “Internet” cũng là giao tiếp qua mạng.',html:`
    <div class="network"><div class="network-visual" aria-label="Mô hình các hoạt động giao tiếp qua mạng"><div class="node"><i aria-hidden="true">💬</i>Nhắn tin</div><div class="node"><i aria-hidden="true">📹</i>Gọi video</div><div class="node"><i aria-hidden="true">✉️</i>Thư điện tử</div><div class="node"><i aria-hidden="true">👥</i>Diễn đàn</div><div class="node-core" aria-hidden="true">🌐</div></div><div><div class="grid">${card('🧩','Không gian mạng là gì?','Môi trường được tạo ra nhờ sử dụng <strong>mạng máy tính</strong>.')}${card('🔗','Giao tiếp qua mạng','Trao đổi qua phần mềm hoặc dịch vụ trực tuyến: nhắn tin, học online, gọi video…')}</div></div></div>
    <div class="tabs" aria-label="Thử phân biệt"><button class="tab" data-net="0" aria-pressed="false">📹 Học qua Zoom</button><button class="tab" data-net="1" aria-pressed="false">☕ Ngồi nói chuyện ở quán Internet</button><button class="tab" data-net="2" aria-pressed="false">🤖 Chat với trợ lí ảo</button></div><div id="network-result" class="demo" aria-live="polite">Chọn một tình huống. Em dự đoán: có giao tiếp qua mạng máy tính không?</div>` },
  { title:'Bốn lợi ích — chọn đúng công cụ, học tập dễ hơn',tag:'02 · Mặt tích cực',lead:'Bấm hiện từng ý; sau đó chạm vào thẻ để xem ví dụ.',html:`
    <div class="grid two reveal-list">${[
      ['📍','Thuận tiện','Trao đổi từ nhiều nơi, vào thời điểm phù hợp.','Nhóm bạn ở các xã khác nhau vẫn có thể cùng làm bài.'],
      ['⏳','Tiết kiệm','Giảm thời gian và chi phí đi lại.','Hỏi bài qua cuộc gọi thay vì phải đi xa để gặp nhau.'],
      ['🤝','Mở rộng kết nối','Tìm người cùng sở thích, cùng mục tiêu.','Tham gia câu lạc bộ Tin học trực tuyến để học cùng bạn mới.'],
      ['🧰','Đa dạng công cụ','Chọn nhắn tin, email, gọi video hoặc chia sẻ màn hình.','Gửi email khi cần nội dung rõ ràng; gọi video khi cần hướng dẫn trực tiếp.'],
    ].map(([i,t,d,e])=>`<button class="card reveal" aria-hidden="true" inert data-example="${esc(e)}" aria-expanded="false"><span class="icon" aria-hidden="true">${i}</span><h3>${t}</h3><p>${d}</p><p class="example"></p></button>`).join('')}</div>${ribbon('💡 Không có công cụ tốt nhất cho mọi việc. Hãy chọn công cụ <strong>phù hợp mục đích</strong>.')}` },
  { title:'Bốn hạn chế — nhận ra để chủ động phòng tránh',tag:'03 · Mặt cần lưu ý',lead:'Lợi ích không tự xóa đi rủi ro. Mỗi hạn chế cần một cách ứng phó.',html:`
    <div class="grid two">${card('😶','Dễ hiểu nhầm','Tin nhắn thuần chữ thiếu nét mặt, cử chỉ và ngữ điệu.','<p class="example">→ Hỏi lại khi chưa rõ; dùng lời lẽ cụ thể.</p>')}${card('🔐','Rủi ro riêng tư','Thông tin có thể bị xem, lưu hoặc chia sẻ ngoài ý muốn.','<p class="example">→ Bảo vệ tài khoản; cân nhắc trước khi gửi.</p>')}${card('🫂','Gắn kết cá nhân có thể hạn chế','Trao đổi qua màn hình không luôn thay thế được sự gặp gỡ trực tiếp.','<p class="example">→ Dành thời gian quan tâm ngoài đời.</p>')}${card('📶','Phụ thuộc kĩ thuật','Mất mạng hoặc lỗi thiết bị làm cuộc trò chuyện gián đoạn.','<p class="example">→ Chuẩn bị kênh liên lạc hoặc phương án khác.</p>')}</div>` },
  { title:'Bàn cân được – mất: em quyết định thế nào?',tag:'04 · Thí nghiệm tương tác',lead:'Chọn tình huống, quan sát bàn cân và nêu cách tận dụng lợi ích, giảm rủi ro.',html:`
    <div class="balance-layout"><div><div class="scale" role="img" aria-label="Bàn cân minh họa lợi ích và rủi ro"><div class="scale-base"></div><div class="scale-post"></div><div class="beam" id="beam"><div class="pan left"><span>💚 Lợi ích</span></div><div class="pan right"><span>⚠️ Rủi ro</span></div></div></div><p class="scale-focus" id="scale-focus">Hai mặt cùng tồn tại — em làm chủ cách sử dụng.</p></div><div class="responses"><button class="choice" data-scale="0" aria-pressed="false">📚 Cùng bạn học qua mạng</button><button class="choice" data-scale="1" aria-pressed="false">📸 Gửi ảnh riêng tư vào nhóm đông người</button><button class="choice" data-scale="2" aria-pressed="false">🛡️ Chọn kênh phù hợp và kiểm tra quyền riêng tư</button><div class="demo" id="scale-result" aria-live="polite">Bàn cân chỉ minh họa cách cân nhắc; không phải phép đo định lượng.</div></div></div>` },
  { title:'Cùng một câu chữ — có thể hiểu theo nhiều cách',tag:'05 · Phòng thí nghiệm cảm xúc',lead:'Chọn cách thể hiện rồi giải thích vì sao người nghe có thể hiểu khác nhau.',html:`
    <div class="grid two"><div class="card message-lab"><span class="mood-face" id="mood-face" aria-hidden="true">💬</span><div class="speech" id="mood-speech">“Bạn giỏi thật đấy!”</div><div class="pills"><button class="tab" data-mood="0" aria-pressed="false">Chỉ có chữ</button><button class="tab" data-mood="1" aria-pressed="false">😊 Chân thành</button><button class="tab" data-mood="2" aria-pressed="false">😒 Mỉa mai</button></div></div><div class="responses"><div id="mood-result" class="demo" aria-live="polite">Chưa có giọng nói hay nét mặt. Em hiểu đây là lời khen hay lời trêu?</div>${card('👂','Tín hiệu phi ngôn ngữ','Nét mặt, cử chỉ và ngữ điệu <strong>giúp làm rõ ý định</strong>, nhưng không bảo đảm hết mọi hiểu lầm.')}${card('💬','Một cách hỏi lại','“Bạn đang khen thật hay đang đùa vậy? Mình muốn hiểu đúng ý bạn.”')}</div></div>` },
  { title:'Bộ quy tắc ứng xử trên mạng xã hội',tag:'06 · Kiến thức nền',lead:'Phân biệt quy tắc chung với bốn yếu tố ứng xử nhân văn ở trang tiếp theo.',html:`
    <div><span class="date">📜 Quyết định 874/QĐ-BTTTT · ngày 17/6/2021 · Bộ Thông tin và Truyền thông</span></div><div class="grid two">${card('⚖️','Tôn trọng, tuân thủ pháp luật','Tôn trọng quyền và lợi ích hợp pháp của tổ chức, cá nhân.')}${card('🌱','Lành mạnh','Ứng xử phù hợp các giá trị đạo đức, văn hóa và truyền thống tốt đẹp.')}${card('🛡️','An toàn, bảo mật thông tin','Tuân thủ quy định và hướng dẫn bảo vệ thông tin.')}${card('🤝','Trách nhiệm','Chịu trách nhiệm về hành vi và phối hợp xử lý nội dung vi phạm.')}</div><p class="sources">Nguồn đối chiếu: <a href="https://btllang.mod.gov.vn/tin-tuc/tin-tong-hop/11220-bo-quy-tac-ung-xu-tren-mang-xa-hoi-the-che-mem-bao-dam-quyen-tu-do-ca-nhan-quyen-tu-do-kinh-doanh-phu-hop-chuan-muc-dao-duc-phap-luat-va-thong-le-quoc-te.html" target="_blank" rel="noopener noreferrer">Giới thiệu Bộ quy tắc ứng xử trên mạng xã hội</a>.</p>` },
  { title:'Bốn yếu tố ứng xử nhân văn — từ hiểu đến làm',tag:'07 · Con người phía sau màn hình',lead:'Không chỉ biết điều đúng; hãy biến điều đúng thành lời nói và hành động.',html:`
    <div class="grid two">${card('🤝','Tôn trọng','Chấp nhận quan điểm khác biệt, giữ gìn quyền riêng tư.','<p class="example">“Mình có ý kiến khác, nhưng muốn nghe bạn giải thích.”</p>')}${card('💬','Lịch sự','Dùng lời lẽ đúng mực; trao đổi về vấn đề, tránh công kích người nói.','<p class="example">“Mình chưa đồng ý với cách giải này vì…”</p>')}${card('💛','Thấu hiểu','Đặt mình vào hoàn cảnh của người khác trước khi phán xét.','<p class="example">“Có phải bạn đang gặp khó khăn ở bước này không?”</p>')}${card('🫶','Sẵn sàng hỗ trợ','Giúp đúng cách và tìm người hỗ trợ khi cần.','<p class="example">“Chúng mình cùng thử lại; nếu cần sẽ hỏi thầy cô.”</p>')}</div>` },
  { title:'Tình huống 1: khi bạn có ý kiến trái ngược',tag:'08 · Em sẽ trả lời thế nào?',lead:'Chọn một cách phản hồi. Quan sát tác động rồi thử cách khác.',html:chatMarkup(1) },
  { title:'Tình huống 2: ảnh riêng tư xuất hiện trong nhóm',tag:'09 · Bảo vệ bạn, giữ gìn riêng tư',lead:'Cân nhắc cả cảm xúc của bạn và việc thông tin có thể tiếp tục lan truyền.',html:chatMarkup(2) },
  { title:'Tử tế trên mạng: luyện thành thói quen',tag:'10 · Dừng một nhịp, nghĩ thêm một bước',lead:'Năm việc nhỏ có thể thực hiện ngay sau tiết học.',html:`
    <div class="grid two"><div class="steps">${[
      ['Tự kiểm tra','Đọc lại lời mình viết; sửa hoặc xin lỗi khi cần.'],['Bình tĩnh lắng nghe','Chưa phản hồi khi đang nóng giận.'],['Tìm sự trợ giúp','Chia sẻ với người lớn đáng tin khi khó xử.'],['Cẩn trọng với ngôn từ','Đọc lại trước khi bấm gửi.'],['Đổi vai để thấu hiểu','Đối xử theo cách mình muốn được đối xử.'],
    ].map(([t,d])=>`<div class="card step reveal" aria-hidden="true" inert><div><h3>${t}</h3><p>${d}</p></div></div>`).join('')}</div><div class="responses"><div class="card timer-panel"><div class="stop-timer" id="stop-time" aria-live="polite">3</div><div><h3>Thử dừng lại 3 giây</h3><p>Trước khi gửi một bình luận đang khiến em bực tức.</p><button class="action gold" id="stop-button">⏳ Bắt đầu khoảng dừng</button></div></div><div class="demo" id="stop-result" aria-live="polite">Tự hỏi: Điều này có đúng không? Có cần thiết không? Có tử tế không?</div></div></div>` },
  { title:'Chọn hoàn cảnh — tìm cách ứng xử phù hợp',tag:'11 · Áp dụng trong đời sống',lead:'Một nguyên tắc chung, nhiều cách thể hiện cụ thể.',html:`
    <div class="tabs" id="context-tabs" aria-label="Hoàn cảnh giao tiếp">${['🗣️ Diễn đàn','💬 Mạng xã hội','✉️ Email, tin nhắn','📹 Gọi video','📤 Chia sẻ thông tin'].map((t,i)=>`<button class="tab" data-context="${i}" aria-pressed="${i===0}">${t}</button>`).join('')}</div><div id="context-result" class="grid two" aria-live="polite"></div>${ribbon('👣 <strong>Dấu vết số:</strong> nội dung có thể bị lưu hoặc sao chép. Xóa bài không bảo đảm thu hồi được mọi bản sao.')}` },
  { title:'Thử thách công dân số',tag:'12 · Kiểm tra và giải thích',lead:'Mỗi câu đúng được 1 điểm. Chọn xong sẽ có lời giải; có thể làm lại toàn bộ.',html:`<div class="quiz-layout" id="quiz" aria-live="polite"></div>` },
  { title:'Từ hôm nay, em chọn làm điều gì?',tag:'13 · Cam kết và vận dụng',lead:'Đánh dấu từng việc em quyết tâm thực hiện. Hoàn thành cả năm để nhận huy hiệu.',html:`
    <div class="grid two"><div class="responses">${['Dùng ngôn từ lịch sự, không công kích cá nhân.','Không phát tán tin nhắn, ảnh riêng tư khi chưa được phép.','Kiểm chứng thông tin trước khi chia sẻ.','Lắng nghe và tôn trọng quan điểm khác biệt.','Sẵn sàng động viên, hỗ trợ hoặc tìm trợ giúp.'].map(t=>`<button class="check" aria-pressed="false"><span class="check-icon" aria-hidden="true">○</span><span>${t}</span></button>`).join('')}</div><div class="card"><span class="badge" id="pledge-badge" aria-hidden="true">🌱</span><p class="pledge-status" id="pledge-status" aria-live="polite">0 / 5 việc sẵn sàng thực hiện</p><p style="text-align:center">Chọn một việc và nêu ví dụ em sẽ thực hiện trong tuần này.</p><div class="links"><button class="action gold" id="celebrate" disabled>🎉 Nhận huy hiệu</button></div><div class="links" style="margin-top:18px"><a class="action" href="/luyen/bai-06" target="_blank" rel="noopener">Luyện tập Bài 6 ↗</a><a class="action" href="/sgk/bai-06.html" target="_blank" rel="noopener">Đọc bài học ↗</a></div></div></div>` },
];

function chatMarkup(id) {
  const initial = id===1 ? 'Mình thấy bài tập này khó quá. Học cái này có ích gì đâu!' : 'Mình có ảnh và tin nhắn riêng của Hoa. Chuyển vào nhóm cho mọi người xem nhé?';
  const choices = id===1 ? ['“Bạn sai hoàn toàn. Đừng ý kiến nữa!”','Không phản hồi vì nghĩ rằng chuyện của bạn không liên quan đến mình.','“Có phải bạn đang vướng chỗ nào không? Mình cùng tìm cách giải nhé.”'] : ['Chuyển tiếp vào nhóm khác để hỏi xem mọi người nghĩ gì.','Không chia sẻ tiếp, nhưng vẫn lưu ảnh để xem riêng.','Không nhận hay phát tán; nhắc dừng lại và báo người lớn đáng tin để bảo vệ bạn.'];
  return `<div class="chat-layout"><div class="chat-window"><div class="chat-head">${id===1?'💬 Nhóm học tập lớp 12':'📩 Tin nhắn trong nhóm bạn'}</div><div class="messages" id="chat-${id}"><div class="bubble">${esc(initial)}</div></div></div><div><div class="responses" id="choices-${id}">${choices.map((t,i)=>`<button class="choice" data-chat="${id}" data-choice="${i}"><span class="letter">${'ABC'[i]}</span><span>${esc(t)}</span></button>`).join('')}</div><div id="feedback-${id}" class="feedback" aria-live="polite"></div><button class="action" data-chat-reset="${id}" style="margin-top:12px">↺ Thử cách khác</button></div></div>`;
}

let current = 0;
let audioEnabled = false;
let audioContext;
let motion = !matchMedia('(prefers-reduced-motion: reduce)').matches;
let liveTimer;
let toastTimer;
const reveals = sections.map(()=>0);
$('#deck').innerHTML = sections.map((s,i)=>`<section class="slide" id="slide-${i+1}" ${i?'hidden':''} aria-labelledby="title-${i+1}"><div class="slide-head"><div class="heading"><p class="eyebrow">${s.tag}</p><h${i?2:1} id="title-${i+1}" tabindex="-1">${s.title}</h${i?2:1}><p class="lead">${s.lead}</p></div><div class="reveal-tools"><span class="count"></span><button class="action reveal-one">+ Hiện ý</button><button class="action reveal-all">Hiện hết</button></div></div><div class="body">${s.html}</div></section>`).join('');
$('#toc-grid').innerHTML = sections.map((s,i)=>`<button class="action" data-goto="${i}">${String(i+1).padStart(2,'0')} · ${s.title}</button>`).join('');

function sound(kind='click') {
  if (!audioEnabled) return;
  try {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    audioContext ||= new Audio();
    if(audioContext.state==='suspended') audioContext.resume().catch(()=>{});
    const now=audioContext.currentTime;
    (kind==='good'?[523,659,784]:kind==='bad'?[240]:[560]).forEach((f,i)=>{
      const o=audioContext.createOscillator(),g=audioContext.createGain();
      o.type='sine';o.frequency.value=f;o.connect(g);g.connect(audioContext.destination);
      g.gain.setValueAtTime(.045,now+i*.075);g.gain.exponentialRampToValueAtTime(.001,now+i*.075+.13);
      o.start(now+i*.075);o.stop(now+i*.075+.14);
    });
  } catch { /* Audio is optional: interactions remain available. */ }
}
function notify(message) {
  $('#toast').textContent=message;$('#toast').hidden=false;clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>$('#toast').hidden=true,3500);
}
function syncReveal() {
  const slide=$(`#slide-${current+1}`),items=$$('.reveal',slide),count=reveals[current];
  items.forEach((el,i)=>{const shown=i<count;el.classList.toggle('shown',shown);el.inert=!shown;el.setAttribute('aria-hidden',String(!shown));});
  $('.reveal-tools',slide).hidden=!items.length;
  $('.count',slide).textContent=`${count} / ${items.length}`;
  $('.reveal-one',slide).disabled=count===items.length;
  $('.reveal-all',slide).disabled=count===items.length;
  $('#next-idea').textContent=count<items.length?'Hiện ý tiếp ↓':current===sections.length-1?'Về đầu bài ↺':'Trang tiếp →';
  $('#all-ideas').hidden=!items.length;$('#all-ideas').disabled=count===items.length;
  $('#reveal-counter').textContent=items.length?`Ý ${count}/${items.length}`:'';
}
function reveal(all=false) {
  const length=$$('.reveal',$(`#slide-${current+1}`)).length;
  if(reveals[current]>=length)return false;
  reveals[current]=all?length:reveals[current]+1;syncReveal();sound();return true;
}
function showSlide(index,focus=true) {
  if(index<0||index>=sections.length)return;
  if(current===10&&index!==10)resetPause();
  current=index;
  $$('.slide').forEach((s,i)=>{s.hidden=i!==index;s.classList.toggle('active',i===index);});
  $('#stage').scrollTop=0;$('#counter').textContent=`${String(index+1).padStart(2,'0')} / ${sections.length}`;
  $('#progress').style.width=`${(index+1)/sections.length*100}%`;
  $('#prev').disabled=index===0;$('#next').disabled=index===sections.length-1;
  $$('[data-goto]').forEach((b,i)=>b.setAttribute('aria-current',i===index?'step':'false'));
  syncReveal();if(focus)$(`#title-${index+1}`).focus({preventScroll:true});
}
function nextIdea(){if(!reveal()){sound();showSlide(current===sections.length-1?0:current+1);}}
$('#prev').onclick=()=>{sound();showSlide(current-1);};$('#next').onclick=()=>{sound();showSlide(current+1);};$('#next-idea').onclick=nextIdea;
$('#all-ideas').onclick=()=>reveal(true);
$$('.reveal-one').forEach(b=>b.onclick=()=>reveal());$$('.reveal-all').forEach(b=>b.onclick=()=>reveal(true));
$('#contents').onclick=()=>$('#toc').showModal();$('#close-toc').onclick=()=>$('#toc').close();
$$('[data-goto]').forEach(b=>b.onclick=()=>{$('#toc').close();showSlide(Number(b.dataset.goto));sound();});
$('#sound').onclick=()=>{audioEnabled=!audioEnabled;$('#sound').setAttribute('aria-pressed',String(audioEnabled));$('#sound').textContent=audioEnabled?'🔊 Âm thanh: Bật':'🔇 Âm thanh: Tắt';sound();};
function syncMotion(){document.body.classList.toggle('motion-off',!motion);$('#motion').setAttribute('aria-pressed',String(motion));$('#motion').textContent=motion?'✨ Hiệu ứng: Bật':'✨ Hiệu ứng: Tắt';}
$('#motion').onclick=()=>{motion=!motion;syncMotion();};syncMotion();
async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else notify('Trình duyệt này chưa hỗ trợ toàn màn hình. Hãy mở slide ở tab riêng.');}catch{notify('Hãy mở slide ở tab riêng để dùng chế độ toàn màn hình.');}}
$('#fullscreen').onclick=fullscreen;
document.addEventListener('keydown',e=>{
  if($('#toc').open||e.altKey||e.ctrlKey||e.metaKey||e.target.closest('input,textarea,select,[contenteditable="true"]'))return;
  if(e.code==='Space'&&e.target.closest('button,a'))return;
  const key=e.key.toLowerCase();
  if(['arrowright','pagedown'].includes(key)){e.preventDefault();nextIdea();}
  else if(key===' '){e.preventDefault();nextIdea();}
  else if(['arrowleft','pageup'].includes(key)){e.preventDefault();showSlide(current-1);}
  else if(key==='arrowdown'){e.preventDefault();reveal();}
  else if(key==='arrowup'){e.preventDefault();reveals[current]=Math.max(0,reveals[current]-1);syncReveal();}
  else if(key==='home'){e.preventDefault();showSlide(0);}
  else if(key==='end'){e.preventDefault();showSlide(sections.length-1);}
  else if(key==='f'){e.preventDefault();fullscreen();}
  else if(key==='m'){e.preventDefault();$('#sound').click();}
});

const netResults=['✅ Có. Thầy cô và học sinh trao đổi qua mạng máy tính nhờ dịch vụ gọi video.','☕ Không, nếu mọi người đang ngồi nói chuyện trực tiếp. Tên của quán không quyết định cách giao tiếp.','✅ Có. Em trao đổi với trợ lí ảo thông qua dịch vụ trên mạng.'];
function selected(group,button){$$(group).forEach(b=>b.setAttribute('aria-pressed',String(b===button)));}
function paint(selector,text){const el=$(selector);el.textContent=text;el.classList.remove('pop');void el.offsetWidth;el.classList.add('pop');}
$$('[data-net]').forEach(b=>b.onclick=()=>{selected('[data-net]',b);paint('#network-result',netResults[Number(b.dataset.net)]);sound();});
$$('[data-example]').forEach(b=>b.onclick=()=>{const open=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',String(open));$('.example',b).textContent=open?'💡 '+b.dataset.example:'';sound();});
const scales=[[-10,'Lợi ích đang được phát huy','💚 Học từ xa giúp kết nối và tiết kiệm. Nên chọn thời gian phù hợp, tôn trọng lượt nói và giữ cân bằng với sinh hoạt ngoài đời.'],[10,'Cần chú ý rủi ro riêng tư','⚠️ Ảnh có thể bị lưu, chụp lại hoặc chuyển tiếp. Chỉ chia sẻ khi có sự đồng ý và với đúng người cần nhận.'],[0,'Chủ động cân bằng hai mặt','🛡️ Chọn công cụ phù hợp, kiểm tra quyền riêng tư, trao đổi rõ ràng và có phương án khi mất mạng.']];
$$('[data-scale]').forEach(b=>b.onclick=()=>{const [angle,label,text]=scales[Number(b.dataset.scale)];$('#beam').style.transform=`rotate(${angle}deg)`;$('#scale-focus').textContent=label;paint('#scale-result',text);selected('[data-scale]',b);sound();});
const moods=[['💬','Chỉ có chữ: người đọc có thể hiểu là khen, đùa hoặc mỉa mai tùy ngữ cảnh. Đừng vội kết luận ý định của người gửi.'],['😊','Nụ cười và giọng nói ấm áp giúp người nghe nhận ra sự khen ngợi chân thành.'],['😒','Giọng nói và nét mặt mỉa mai có thể khiến cùng câu chữ trở thành lời châm chọc.']];
$$('[data-mood]').forEach(b=>b.onclick=()=>{const [face,text]=moods[Number(b.dataset.mood)];$('#mood-face').textContent=face;paint('#mood-result',text);selected('[data-mood]',b);sound();});

const chatInitial={1:'Mình thấy bài tập này khó quá. Học cái này có ích gì đâu!',2:'Mình có ảnh và tin nhắn riêng của Hoa. Chuyển vào nhóm cho mọi người xem nhé?'};
const chatFeedback={1:[['Cách nói này phủ nhận ý kiến và dễ làm bạn tổn thương. Hãy trao đổi về vấn đề, tránh công kích người nói.','Mình cảm thấy ý kiến của mình không được tôn trọng.'],['Im lặng có thể tránh tranh cãi, nhưng bạn vẫn chưa nhận được sự thấu hiểu hay hỗ trợ. Em có thể hỏi bạn đang vướng ở đâu.','Mình vẫn đang vướng bài này…'],['Em đã hỏi để thấu hiểu, dùng lời lịch sự và sẵn sàng hỗ trợ. Một cuộc trao đổi tích cực bắt đầu từ đó.','Cảm ơn bạn. Mình chưa hiểu bước đầu, mình cùng xem nhé!']],2:[['Chuyển sang nhóm khác vẫn làm ảnh riêng tư lan rộng. Đừng tiếp tục phát tán, kể cả khi chỉ muốn hỏi ý kiến.','Ảnh đã bị chuyển tiếp thêm một lần. Bạn Hoa có thể bị tổn thương.'],['Không chia sẻ tiếp là một bước tốt. Tuy nhiên, lưu ảnh riêng tư để xem vẫn không tôn trọng bạn. Hãy từ chối và tìm cách hỗ trợ an toàn.','Nếu bạn ấy biết ảnh bị lưu lại, bạn ấy có thể cảm thấy thế nào?'],['Em đã ngăn việc lan truyền, tôn trọng quyền riêng tư và tìm sự hỗ trợ. Không cần tranh cãi hay đối đầu với người lạ.','Em sẽ không nhận hoặc chuyển tiếp. Mình hãy dừng lại và tìm người lớn đáng tin để hỗ trợ Hoa.']]};
const chatTimers=new Map();
function resetChat(id){clearTimeout(chatTimers.get(id));chatTimers.delete(id);$(`#chat-${id}`).innerHTML=`<div class="bubble">${esc(chatInitial[id])}</div>`;$(`#feedback-${id}`).textContent='';$(`#feedback-${id}`).classList.remove('good');$$(`[data-chat="${id}"]`).forEach(b=>{b.disabled=false;b.classList.remove('selected','correct','wrong');});}
$$('[data-chat-reset]').forEach(b=>b.onclick=()=>{resetChat(Number(b.dataset.chatReset));sound();});
$$('[data-chat]').forEach(b=>b.onclick=()=>{
  if(b.disabled)return;
  const id=Number(b.dataset.chat),choice=Number(b.dataset.choice),[feedback,reply]=chatFeedback[id][choice];
  $$(`[data-chat="${id}"]`).forEach(x=>x.disabled=true);b.classList.add('selected');
  const box=$(`#chat-${id}`),me=document.createElement('div');me.className='bubble me reply';me.textContent=$('span:last-child',b).textContent;box.append(me);
  const typing=document.createElement('div');typing.className='typing';typing.textContent='Đang phản hồi…';box.append(typing);box.scrollTop=box.scrollHeight;
  chatTimers.set(id,setTimeout(()=>{typing.remove();const answer=document.createElement('div');answer.className='bubble reply';answer.textContent=reply;box.append(answer);box.scrollTop=box.scrollHeight;const fb=$(`#feedback-${id}`);fb.textContent=(choice===2?'✓ ':'💭 ')+feedback;fb.classList.toggle('good',choice===2);b.classList.add(choice===2?'correct':'wrong');sound(choice===2?'good':'click');chatTimers.delete(id);},motion?550:0));
});

function resetPause(){clearInterval(liveTimer);liveTimer=undefined;$('#stop-time').textContent='3';$('#stop-button').disabled=false;$('#stop-button').textContent='⏳ Bắt đầu khoảng dừng';$('#stop-result').textContent='Tự hỏi: Điều này có đúng không? Có cần thiết không? Có tử tế không?';}
$('#stop-button').onclick=()=>{if(liveTimer)return;let count=3;$('#stop-button').disabled=true;$('#stop-result').textContent='Hít thở chậm. Đọc lại điều em sắp gửi.';liveTimer=setInterval(()=>{count--;$('#stop-time').textContent=String(count);if(count===0){clearInterval(liveTimer);liveTimer=undefined;$('#stop-button').disabled=false;$('#stop-button').textContent='↺ Thử lại';$('#stop-result').textContent='Bây giờ, em có muốn sửa câu chữ hoặc đợi bình tĩnh hơn rồi mới gửi không?';sound('good');}},1000);};
const contexts=[
  ['Tranh luận bằng lí lẽ','Nêu ý kiến rõ ràng, dẫn chứng phù hợp và lắng nghe phản hồi.','Tránh công kích cá nhân','Không chuyển từ bàn luận vấn đề sang chê bai người nói.'],
  ['Đọc kĩ trước khi bình luận','Xem ngữ cảnh, kiểm tra thông tin, hỏi lại khi chưa rõ.','Tránh hùa theo đám đông','Đừng chế giễu hoặc gây áp lực chỉ vì nhiều người đang làm vậy.'],
  ['Chào hỏi và trình bày rõ','Nêu mục đích, dùng lời lịch sự, tôn trọng tin nhắn riêng.','Tránh tự ý chuyển tiếp','Xin phép trước khi chia sẻ nội dung riêng của người khác.'],
  ['Tôn trọng cuộc trao đổi','Chọn nơi phù hợp, kiểm tra micro và xin lượt phát biểu.','Tránh làm lộ thông tin riêng','Chú ý hậu cảnh, chia sẻ màn hình và việc ghi hình.'],
  ['Kiểm chứng trước khi chia sẻ','Đọc nguồn, xem thời điểm, đối chiếu thông tin đáng tin cậy.','Tránh tiếp tay tin giả','Chưa rõ thì chưa chia sẻ; sửa hoặc gỡ khi biết mình đăng sai.'],
];
function showContext(i){const [a,b,c,d]=contexts[i];$('#context-result').innerHTML=`<div class="card"><span class="icon" aria-hidden="true">✓</span><h3 class="green-text">${a}</h3><p>${b}</p></div><div class="card"><span class="icon" aria-hidden="true">↪</span><h3 class="gold-text">${c}</h3><p>${d}</p></div>`;}
$$('[data-context]').forEach(b=>b.onclick=()=>{selected('[data-context]',b);showContext(Number(b.dataset.context));sound();});showContext(0);

const quizQuestions=[
  ['Trường hợp nào KHÔNG phải giao tiếp trong không gian mạng?',['Hai bạn ngồi nói chuyện trực tiếp ở quán Internet.','Hai bạn trao đổi bài qua tin nhắn.','Cả lớp học qua cuộc gọi video.','Em chat với trợ lí ảo trên website.'],0,'Cách trao đổi quyết định đây có phải giao tiếp qua mạng hay không. Tên của địa điểm không quyết định.'],
  ['Bạn nhắn “Bạn giỏi thật đấy!”. Em chưa rõ ý bạn. Nên làm gì?',['Kết luận ngay rằng bạn đang mỉa mai.','Hỏi lại bằng lời lịch sự để hiểu đúng ý.','Chụp tin nhắn gửi nhóm khác để bình luận.','Đáp lại gay gắt để tự bảo vệ mình.'],1,'Tin nhắn thuần chữ thiếu ngữ điệu và nét mặt. Hỏi lại giúp giảm hiểu nhầm mà vẫn tôn trọng bạn.'],
  ['Một người gửi ảnh riêng tư của bạn cùng lớp. Cách xử lý phù hợp nhất?',['Chuyển tiếp để hỏi ý kiến nhiều người.','Lưu lại vì mình chưa chia sẻ cho ai.','Không nhận, không phát tán và tìm cách hỗ trợ bạn an toàn.','Đăng lên để mọi người cùng bảo vệ bạn.'],2,'Đừng tiếp tục làm ảnh lan truyền. Có thể báo với người lớn đáng tin và hỗ trợ người bị ảnh hưởng.'],
  ['Đâu là bốn yếu tố ứng xử nhân văn trong bài học?',['Nhanh chóng – nổi bật – bí mật – tiết kiệm.','Im lặng – đề phòng – né tránh – tranh luận.','Tốc độ – tiện lợi – kết nối – công cụ.','Tôn trọng – lịch sự – thấu hiểu – sẵn sàng hỗ trợ.'],3,'Bốn yếu tố này giúp em nghĩ đến con người và cảm xúc phía sau màn hình.'],
  ['Em chưa đồng ý với ý kiến trong nhóm. Câu trả lời nào phù hợp?',['“Mình có cách nhìn khác vì… Bạn giải thích thêm nhé?”','“Bạn sai rồi, không cần bàn tiếp.”','“Ai cũng thấy bạn sai, chỉ bạn không biết.”','“Mình sẽ đưa đoạn chat này lên mạng.”'],0,'Trao đổi về lí lẽ và dẫn chứng, không công kích hay gây sức ép lên người nói.'],
  ['Xóa một bài đăng có bảo đảm mọi bản sao biến mất không?',['Có, xóa ở tài khoản mình là hết.','Không. Người khác có thể đã lưu hoặc sao chép nội dung.','Có, nếu bài chỉ mới đăng vài phút.','Có, nếu bài chưa nhận được lượt thích.'],1,'Vì có thể còn bản sao, hãy cân nhắc trước khi đăng và bảo vệ quyền riêng tư ngay từ đầu.'],
];
let quizIndex=0;const quizAnswers=quizQuestions.map(()=>null);
function renderQuiz(){
  const score=quizAnswers.filter((a,i)=>a===quizQuestions[i][2]).length,done=quizAnswers.filter(a=>a!==null).length;
  if(quizIndex===quizQuestions.length){$('#quiz').innerHTML=`<div class="card quiz-end"><div class="score-big">${score} / ${quizQuestions.length}</div><h3>Điểm của lượt chơi</h3><p>${score===quizQuestions.length?'Em đã vận dụng tốt. Hãy nêu một ví dụ ngoài đời!':'Xem lại lời giải, rồi thử một lượt mới nhé.'}</p><button class="action primary" id="quiz-reset">↺ Làm lại toàn bộ</button></div>`;$('#quiz-reset').onclick=resetQuiz;return;}
  const [q,options,correct,explain]=quizQuestions[quizIndex],picked=quizAnswers[quizIndex],answered=picked!==null;
  $('#quiz').innerHTML=`<div class="quiz-meta"><span>Câu ${quizIndex+1} / ${quizQuestions.length}</span><span>Đã làm ${done} · Đúng ${score}</span><button class="action" id="quiz-reset">↺ Làm lại</button></div><div class="card"><h3 class="quiz-question">${q}</h3><div class="quiz-options">${options.map((o,i)=>`<button class="choice ${answered?(i===correct?'correct':i===picked?'wrong':''):''}" data-quiz="${i}" ${answered?'disabled':''}><span class="letter">${answered&&i===correct?'✓':'ABCD'[i]}</span><span>${o}</span></button>`).join('')}</div><div class="feedback ${picked===correct?'good':''}">${answered?(picked===correct?'✓ Chính xác. ':'↪ Chưa đúng. ')+explain:''}</div><div class="quiz-actions"><button class="action" id="quiz-prev" ${quizIndex===0?'disabled':''}>← Câu trước</button><button class="action primary" id="quiz-next" ${answered?'':'disabled'}>${quizIndex===quizQuestions.length-1?'Xem tổng điểm':'Câu tiếp →'}</button></div></div>`;
  $('#quiz-reset').onclick=resetQuiz;$('#quiz-prev').onclick=()=>{quizIndex--;renderQuiz();};$('#quiz-next').onclick=()=>{quizIndex++;renderQuiz();if(quizIndex===quizQuestions.length){sound('good');if(score===quizQuestions.length)confetti();}};
  $$('[data-quiz]').forEach(b=>b.onclick=()=>{if(quizAnswers[quizIndex]!==null)return;quizAnswers[quizIndex]=Number(b.dataset.quiz);sound(quizAnswers[quizIndex]===correct?'good':'bad');renderQuiz();$('#quiz-next').focus({preventScroll:true});});
}
function resetQuiz(){quizAnswers.fill(null);quizIndex=0;renderQuiz();sound();}renderQuiz();

$$('.check').forEach(b=>b.onclick=()=>{const checked=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',String(checked));$('.check-icon',b).textContent=checked?'✓':'○';const count=$$('.check[aria-pressed="true"]').length;$('#pledge-status').textContent=count===5?'5 / 5 · Sẵn sàng ứng xử nhân văn!':`${count} / 5 việc sẵn sàng thực hiện`;$('#pledge-badge').textContent=count===5?'🏅':'🌱';$('#celebrate').disabled=count!==5;sound();});
let celebrationTimer;
function confetti(){if(!motion||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const layer=$('#confetti');clearTimeout(celebrationTimer);layer.replaceChildren();const colors=['#65e8e0','#ffcf77','#ffa7c4','#91e8b7'];for(let i=0;i<65;i++){const p=document.createElement('i');p.style.left=`${Math.random()*100}%`;p.style.animationDelay=`${Math.random()*.45}s`;p.style.background=colors[i%4];layer.append(p);}celebrationTimer=setTimeout(()=>layer.replaceChildren(),2500);}
$('#celebrate').onclick=()=>{sound('good');confetti();notify('🏅 Hoàn thành cam kết! Hãy thực hiện bằng hành động mỗi ngày.');};
showSlide(0,false);

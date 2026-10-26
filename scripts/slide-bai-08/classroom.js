// Kịch bản từ data/classroom.ts được nhúng khi build, dùng cả khi ngoại tuyến.
let classroomIndex = 0;
function renderClassroom() {
  const a = classroomPlan[classroomIndex];
  $('#classroom-plan').innerHTML = `<div class="pills">${classroomPlan.map((p,i)=>`<button class="action ${i===classroomIndex?'primary':''}" data-classroom="${i}" aria-pressed="${i===classroomIndex}">${esc(p.title)} · ${p.minutes}′</button>`).join('')}</div><div class="card" style="margin-top:20px"><h3>${esc(a.title)}</h3><p>${esc(a.situation)}</p><div class="grid two" style="margin-top:18px"><div><h3>Phân vai</h3><ul>${a.roles.map(r=>`<li>${esc(r)}</li>`).join('')}</ul></div><div><h3>Tiến trình</h3><ol>${a.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol></div></div><p><strong>Sản phẩm:</strong> ${esc(a.product)}</p>${a.starter?`<pre class="code-panel">${esc(a.starter)}</pre>`:''}<h3>Tiêu chí đối chiếu</h3><ul>${a.criteria.map(c=>`<li>${esc(c)}</li>`).join('')}</ul><p><strong>Câu hỏi chốt:</strong> ${esc(a.debrief)}</p><details><summary>Gợi ý sau khi học sinh đã thử</summary><p>${esc(a.hint)}</p></details><label for="classroom-note">Ghi phương án, kết quả kiểm thử và nhận xét của nhóm bạn</label><textarea id="classroom-note" rows="5" maxlength="30000" style="width:100%;box-sizing:border-box;margin-top:10px;padding:12px;color:#122b39;background:#fff;border:1px solid #748995;border-radius:12px"></textarea><p id="classroom-save" role="status">Phiếu lưu trên trình duyệt này, chưa gửi cho giáo viên.</p><div class="pills"><button class="action primary" id="classroom-to-studio">Mở xưởng thực hành →</button></div></div>`;
  $$('[data-classroom]').forEach(b=>b.onclick=()=>{classroomIndex=Number(b.dataset.classroom);renderClassroom();});
  const key='tin12:slide8:activity:'+a.id;
  try { $('#classroom-note').value=localStorage.getItem(key)||''; } catch { $('#classroom-save').textContent='Trình duyệt không cho đọc bản lưu. Em vẫn có thể ghi phiếu trên giấy.'; }
  $('#classroom-note').oninput=()=>{try{localStorage.setItem(key,$('#classroom-note').value);$('#classroom-save').textContent='Đã lưu phiếu trên trình duyệt này; chưa gửi cho giáo viên.';}catch{$('#classroom-save').textContent='Không lưu được. Hãy sao chép phiếu hoặc ghi ra giấy.';}};
  $('#classroom-to-studio').onclick=()=>showSlide(12);
}
$('#classroom-open').onclick=()=>showSlide(sections.length-1);
renderClassroom();

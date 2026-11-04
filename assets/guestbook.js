(() => {
  'use strict';
  const key = 'bmw2026-travel-guestbook-v1';
  const dialog = document.createElement('dialog');
  dialog.className = 'travelGuestbook';
  dialog.setAttribute('aria-labelledby', 'guestbookTitle');
  dialog.innerHTML = `
    <header class="guestbookHead"><div><p class="guestbookKicker">ON THE WAY · NOTES TO OUR NEXT SELVES</p><h2 id="guestbookTitle">下一站，留下你的心裡話。</h2><p>想去哪裡、想完成什麼，或想對一起走過的夥伴說些什麼？</p></div><button type="button" class="guestbookClose" aria-label="關閉留言板">×</button></header>
    <p class="guestbookScope">此裝置的留言板：留言只保存在目前瀏覽器，不會公開給其他人。</p>
    <div class="guestbookLayout"><form class="guestbookForm">
      <p class="guestbookFormTitle">寄一張給未來的我們 ✉</p>
      <label for="guestbookName">你的名字或暱稱 <span>選填</span></label><input id="guestbookName" name="nickname" maxlength="20" autocomplete="off" placeholder="例如：一起出發的旅伴">
      <label for="guestbookMessage">想留下的話</label><textarea id="guestbookMessage" name="message" required maxlength="250" rows="5" placeholder="下一站，我想和大家一起……"></textarea>
      <div class="guestbookLength" aria-hidden="true">0 / 250</div>
      <fieldset><legend>選一張喜歡的便箋</legend><label class="guestbookColor yellow"><input type="radio" name="color" value="yellow" checked><span>奶油黃</span></label><label class="guestbookColor pink"><input type="radio" name="color" value="pink"><span>櫻花粉</span></label><label class="guestbookColor mint"><input type="radio" name="color" value="mint"><span>薄荷綠</span></label></fieldset>
      <button class="guestbookSubmit" type="submit">貼上我的留言 ↗</button><p class="guestbookStatus" role="status" aria-live="polite"></p>
    </form><section class="guestbookNotes" aria-labelledby="guestbookNotesTitle"><div class="guestbookNotesHead"><h3 id="guestbookNotesTitle">旅伴的心裡話</h3><span class="guestbookCount"></span></div><div class="guestbookWall"></div></section></div>`;
  document.body.append(dialog);
  const select = s => dialog.querySelector(s);
  const form = select('form'), message = select('textarea'), status = select('.guestbookStatus');
  const wall = select('.guestbookWall');
  let notes = [], origin = null, oldOverflow = '', storageReady = false;
  const valid = n => n && typeof n.id === 'string' && typeof n.name === 'string' && typeof n.message === 'string' && n.message.length <= 250 && n.name.length <= 20 && ['yellow','pink','mint'].includes(n.color) && Number.isFinite(n.time);
  function read() {
    try {
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) throw new Error('Bad data');
      notes = parsed.filter(valid).slice(0,100);
      localStorage.setItem(key, JSON.stringify(notes));
      storageReady = true;
    } catch {
      notes = []; storageReady = false;
      status.textContent = '目前無法讀取或保存瀏覽器留言，請檢查瀏覽器儲存設定後重新開啟。';
    }
    select('.guestbookSubmit').disabled = !storageReady;
  }
  function save(next) {
    try { localStorage.setItem(key, JSON.stringify(next)); notes = next; return true; }
    catch { status.textContent = '留言未儲存成功，請確認瀏覽器儲存空間後再試一次。'; return false; }
  }
  function render() {
    wall.replaceChildren();
    select('.guestbookCount').textContent = `${notes.length} 則留言`;
    if (!notes.length) {
      const empty = document.createElement('div'); empty.className = 'guestbookEmpty';
      const icon = document.createElement('span'); icon.textContent = '✉'; icon.setAttribute('aria-hidden','true');
      const heading = document.createElement('h4'); heading.textContent = '第一張便箋，留給你。';
      const p = document.createElement('p'); p.textContent = '把下一站的期待，貼在這裡吧。';
      empty.append(icon,heading,p); wall.append(empty);
    }
    notes.forEach(note => {
      const card = document.createElement('article'); card.className = `guestbookNote ${note.color}`;
      const text = document.createElement('p'); text.textContent = note.message;
      const footer = document.createElement('footer'); const name = document.createElement('b'); name.textContent = note.name || '同行的旅伴';
      const time = document.createElement('time'); time.dateTime = new Date(note.time).toISOString(); time.textContent = new Intl.DateTimeFormat('zh-TW',{timeZone:'Asia/Taipei',month:'numeric',day:'numeric'}).format(note.time);
      const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'guestbookRemove'; remove.textContent = '移除'; remove.setAttribute('aria-label',`移除${name.textContent}的留言`);
      remove.addEventListener('click', () => { if (save(notes.filter(n=>n.id!==note.id))) {render(); status.textContent='已移除此裝置上的留言。'; select('.guestbookSubmit').focus();} });
      footer.append(name,time); card.append(text,footer,remove);wall.append(card);
    });
  }
  message.addEventListener('input',()=>{message.setCustomValidity('');select('.guestbookLength').textContent = `${message.value.length} / 250`;});
  form.addEventListener('submit',event=>{
    event.preventDefault(); if (!storageReady) return;
    const text = message.value.trim();
    if (!text) {message.setCustomValidity('請寫下想留下的話。');message.reportValidity();return;}
    if(notes.length>=100){status.textContent='此裝置已保存 100 則留言，請先移除部分留言再新增。';return;}
    const name = select('input[name="nickname"]').value.trim();
    const note = {id:crypto.randomUUID(),name,message:text,color:new FormData(form).get('color'),time:Date.now()};
    if (!save([note,...notes])) return;
    form.reset();select('.guestbookLength').textContent='0 / 250';render();status.textContent='已貼上，並保存在此瀏覽器。';
  });
  select('.guestbookClose').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{document.body.style.overflow=oldOverflow;origin?.focus({preventScroll:true});});
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
  window.BMWGuestbook = {open() {
    origin = document.activeElement;oldOverflow=document.body.style.overflow;
    status.textContent='';read();render();dialog.showModal();dialog.scrollTop=0;document.body.style.overflow='hidden';select('.guestbookClose').focus();
  }};
})();

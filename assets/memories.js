(() => {
  'use strict';
  const dialog = document.getElementById('memoryAlbum');
  const entries = [...document.querySelectorAll('[data-album]')];
  if (!dialog || !entries.length) return;
  const select = (name) => dialog.querySelector(name);
  const image = select('.albumMainImage'), stage = select('.albumStage');
  const previous = select('.albumPrev'), next = select('.albumNext');
  const play = select('.albumPlay'), thumbs = select('.albumThumbs');
  let albums = [], current = null, index = 0, timer = null, returnFocus = null, oldOverflow = '';
  function stop() { clearInterval(timer); timer = null; play.textContent = '播放相簿'; play.setAttribute('aria-pressed', 'false'); }
  function show(position) {
    const photos = current.photos;
    index = (position + photos.length) % photos.length;
    const photo = photos[index];
    image.src = photo.src;
    image.alt = photo.alt || photo.caption || `${current.title}花絮，第 ${index + 1} 張`;
    select('.albumBackdrop').style.backgroundImage = `url(${JSON.stringify(photo.src)})`;
    select('.albumCaption').textContent = photo.caption || '';
    select('.albumCounter').textContent = `${index + 1} / ${photos.length}`;
    [...thumbs.children].forEach((button, i) => button.setAttribute('aria-current', String(i === index)));
    const active = thumbs.children[index];

    if (active) thumbs.scrollLeft = active.offsetLeft - thumbs.offsetLeft - thumbs.clientWidth / 2 + active.clientWidth / 2;
  }
  function open(album, button) {
    stop(); current = album; index = 0; returnFocus = button;
    dialog.dataset.theme = album.id;
    dialog.classList.remove('isViewingPhoto');
    select('.albumEyebrow').textContent = album.id === 'dialogue' ? 'GOOD TALKS · GREAT MEMORIES' : `PHOTO DIARY / ${String(entries.indexOf(button) + 1).padStart(2, '0')}`;
    select('#memoryAlbumTitle').textContent = album.title;
    select('#memoryAlbumDescription').textContent = album.description;
    thumbs.replaceChildren();
    const count = album.photos.length;
    image.hidden = !count; select('.albumEmpty').hidden = !!count;
    previous.hidden = next.hidden = count < 2;
    play.disabled = count < 2; play.hidden = !count;
    select('.albumControls > span').hidden = !count;
    select('.albumCounter').textContent = count ? '' : '照片待補';
    select('.albumCaption').textContent = '';
    select('.albumBackdrop').style.backgroundImage = '';
    image.removeAttribute('src');
    album.photos.forEach((photo, i) => {
      const thumb = document.createElement('button'); thumb.type = 'button';
      thumb.setAttribute('aria-label', `查看第 ${i + 1} 張照片`);
      const img = document.createElement('img'); img.src = photo.thumbnail || photo.src; img.alt = ''; img.loading = 'lazy';
      thumb.append(img);
      if (album.id === 'dialogue' && photo.caption) {
        const title = document.createElement('span');
        title.className = 'albumPhotoTitle';
        title.textContent = photo.caption;
        thumb.append(title);
        thumb.setAttribute('aria-label', `查看第 ${i + 1} 張照片：${photo.caption}`);
      }
      thumb.addEventListener('click', () => { stop(); show(i); if (album.id === 'dialogue') { dialog.classList.add('isViewingPhoto'); dialog.scrollTo({top:0,behavior:'instant'}); } }); thumbs.append(thumb);
    });
    oldOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden';
    dialog.showModal(); dialog.scrollTop = 0;
    if (count) show(0);
    select('.albumClose').focus();
  }
  previous.addEventListener('click', () => { stop(); show(index - 1); });
  next.addEventListener('click', () => { stop(); show(index + 1); });
  play.setAttribute('aria-pressed', 'false');
  play.addEventListener('click', () => {
    if (timer) return stop();
    play.textContent = '暫停播放'; play.setAttribute('aria-pressed', 'true');
    timer = setInterval(() => { if (index === current.photos.length - 1) stop(); else show(index + 1); }, 4500);
  });
  select('.albumClose').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { stop(); document.body.style.overflow = oldOverflow; image.removeAttribute('src'); returnFocus?.focus({preventScroll:true}); });
  dialog.addEventListener('click', (event) => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
  dialog.addEventListener('keydown', (event) => {
    if (!current?.photos.length || !['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault(); stop(); show(index + (event.key === 'ArrowRight' ? 1 : -1));
  });
  let touch = null;
  stage.addEventListener('touchstart', event => { touch = event.touches.length === 1 ? {x:event.touches[0].clientX,y:event.touches[0].clientY} : null; }, {passive:true});
  stage.addEventListener('touchend', event => {
    if (!touch || !current?.photos.length) return;
    const dx = event.changedTouches[0].clientX - touch.x, dy = event.changedTouches[0].clientY - touch.y; touch = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) { stop(); show(index + (dx < 0 ? 1 : -1)); }
  }, {passive:true});
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });

  const rail = document.querySelector('#memories .polas');
  const railPrev = document.querySelector('.albumRailPrev'), railNext = document.querySelector('.albumRailNext');
  let drag = null, suppressClick = false;
  const updateArrows = () => {
    railPrev.disabled = rail.scrollLeft < 4;
    railNext.disabled = rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 4;
  };
  const moveRail = direction => rail.scrollBy({left: direction * (entries[0].offsetWidth + parseFloat(getComputedStyle(rail).gap)), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  railPrev.addEventListener('click', () => moveRail(-1));
  railNext.addEventListener('click', () => moveRail(1));
  rail.addEventListener('scroll', updateArrows, {passive:true});
  window.addEventListener('resize', updateArrows);
  rail.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    suppressClick = false; drag = {x:event.clientX, scroll:rail.scrollLeft, id:event.pointerId, moved:false};
  });
  rail.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x;
    if (Math.abs(dx) > 7 && !drag.moved) { drag.moved = true; rail.setPointerCapture(event.pointerId); rail.classList.add('isDragging'); }
    if (drag.moved) { event.preventDefault(); rail.scrollLeft = drag.scroll - dx; }
  });
  function endDrag(event) {
    if (!drag || event.pointerId !== drag.id) return;
    suppressClick = drag.moved;
    if (rail.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId);
    rail.classList.remove('isDragging'); drag = null;
    if (suppressClick) {
      const step = entries[0].offsetWidth + parseFloat(getComputedStyle(rail).gap);
      rail.scrollTo({left:Math.round(rail.scrollLeft / step) * step, behavior:'smooth'});
      setTimeout(() => { suppressClick = false; }, 0);
    }
  }
  rail.addEventListener('pointerup', endDrag); rail.addEventListener('pointercancel', endDrag);
  rail.addEventListener('pointerleave', event => { if (drag && !drag.moved) drag = null; });
  rail.addEventListener('click', event => { if (suppressClick) {event.preventDefault();event.stopImmediatePropagation();} }, true);
  updateArrows();

  const ready = fetch('assets/memories.json?v=17').then(response => { if (!response.ok) throw new Error('Album data unavailable'); return response.json(); }).then(data => {
    albums = data;
    entries.forEach(button => {
      const album = albums.find(item => item.id === button.dataset.album);
      if (album?.photos.length) button.querySelector('.albumEntryNote').textContent = `${album.photos.length} 張照片 · 點開相簿 ↗`;
    });
  });
  entries.forEach(button => button.addEventListener('click', async () => {
    try { await ready; const album = albums.find(item => item.id === button.dataset.album); if (album) open(album, button); }
    catch { button.querySelector('.albumEntryNote').textContent = '相簿暫時無法載入，請重新整理'; }
  }));
  ready.catch(() => {});
})();

(() => {
  'use strict';
  const audio = document.getElementById('siteBgm');
  const button = document.querySelector('.bgmToggle');
  const label = button?.querySelector('.bgmLabel');
  const status = document.querySelector('.bgmStatus');
  if (!audio || !button || !label || !status) return;
  let enabled = true, loading = false, failed = false, waitingGesture = false, attempt = 0;
  // Try on entry; browsers that require activation can start on the first interaction.
  audio.volume = .25;
  const detail = document.getElementById('detail');
  const videoOpen = () => !!detail?.matches('.open') && !!detail.querySelector('iframe');
  const videoAudible = () => [...document.querySelectorAll('video')].some(video => !video.paused && !video.ended && !video.muted && video.volume > 0);
  const blocked = () => document.hidden || videoOpen() || videoAudible();
  const render = () => {
    const suspended = enabled && blocked();
    const playing = enabled && !suspended && !audio.paused && !loading;
    button.dataset.state = playing ? 'playing' : waitingGesture ? 'waiting' : 'paused';
    button.setAttribute('aria-pressed', String(enabled && !waitingGesture));
    label.textContent = failed ? '音樂重試' : suspended ? '音樂暫停中' : loading ? '音樂載入中' : waitingGesture ? '點一下開啟音樂' : playing ? '暫停音樂' : '播放旅程音樂';
    button.setAttribute('aria-label', enabled && !waitingGesture ? '暫停背景音樂' : failed ? '重新播放背景音樂' : '播放背景音樂：BMW 2026');
  };
  const sync = async () => {
    const current = ++attempt;
    if (!enabled || blocked()) {
      loading = false;
      audio.pause();
      render();
      return;
    }
    if (!audio.paused) { render(); return; }
    loading = true;
    render();
    try {
      await audio.play();
      if (current !== attempt) return;
      loading = false;
      waitingGesture = false;
      render();
    } catch (error) {
      if (current !== attempt) return;
      loading = false;
      waitingGesture = error.name === 'NotAllowedError';
      failed = !waitingGesture;
      enabled = waitingGesture;
      render();
      status.textContent = waitingGesture ? '瀏覽器需先點擊頁面才能播放音樂，也可以使用音樂按鈕開啟。' : '音樂暫時無法播放，請按音樂按鈕重試。';
    }
  };
  button.addEventListener('click', () => {
    enabled = waitingGesture || !enabled;
    waitingGesture = false;
    failed = false;
    status.textContent = '';
    if (enabled && audio.error) audio.load();
    sync();
  });
  audio.addEventListener('playing', () => { loading = waitingGesture = false; render(); });
  audio.addEventListener('pause', render);
  audio.addEventListener('error', () => {
    ++attempt;
    enabled = loading = waitingGesture = false;
    failed = true;
    render();
    status.textContent = '音樂暫時無法載入，請按音樂按鈕重試。';
  });
  const activate = event => {
    if (!event.isTrusted || button.contains(event.target) || !enabled || !waitingGesture || blocked()) return;
    if (event.type === 'keydown' && !['Enter', ' '].includes(event.key)) return;
    waitingGesture = false;
    status.textContent = '';
    sync();
  };
  document.addEventListener('click', activate, true);
  document.addEventListener('keydown', activate, true);
  // Preserve the visitor's choice while a video or another browser tab is active.
  document.addEventListener('visibilitychange', sync);
  if (detail) new MutationObserver(sync).observe(detail, {attributes:true,attributeFilter:['class'],childList:true,subtree:true});
  ['play','pause','ended','volumechange'].forEach(event => document.addEventListener(event, e => {
    if (e.target instanceof HTMLVideoElement) sync();
  }, true));
  button.disabled = false;
  sync();
})();

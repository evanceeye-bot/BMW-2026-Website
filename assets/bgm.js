(() => {
  'use strict';
  const audio = document.getElementById('siteBgm');
  const button = document.querySelector('.bgmToggle');
  const label = button?.querySelector('.bgmLabel');
  const status = document.querySelector('.bgmStatus');
  if (!audio || !button || !label || !status) return;
  let enabled = false, loading = false, failed = false, attempt = 0;
  // No autoplay: the first play() is made directly from this button's click.
  audio.volume = .25;
  const detail = document.getElementById('detail');
  const videoOpen = () => !!detail?.matches('.open') && !!detail.querySelector('iframe');
  const videoAudible = () => [...document.querySelectorAll('video')].some(video => !video.paused && !video.ended && !video.muted && video.volume > 0);
  const blocked = () => document.hidden || videoOpen() || videoAudible();
  const render = () => {
    const suspended = enabled && blocked();
    const playing = enabled && !suspended && !audio.paused && !loading;
    button.dataset.state = playing ? 'playing' : 'paused';
    button.setAttribute('aria-pressed', String(enabled));
    label.textContent = failed ? '音樂重試' : suspended ? '音樂暫停中' : loading ? '音樂載入中' : playing ? '暫停音樂' : '播放旅程音樂';
    button.setAttribute('aria-label', enabled ? '暫停背景音樂' : failed ? '重新播放背景音樂' : '播放背景音樂：BMW 2026');
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
      render();
    } catch (error) {
      if (current !== attempt) return;
      enabled = loading = false;
      failed = true;
      render();
      status.textContent = error.name === 'NotAllowedError' ? '請再按一次音樂按鈕開始播放。' : '音樂暫時無法播放，請按音樂按鈕重試。';
    }
  };
  button.addEventListener('click', () => {
    enabled = !enabled;
    failed = false;
    status.textContent = '';
    if (enabled && audio.error) audio.load();
    sync();
  });
  audio.addEventListener('playing', () => { loading = false; render(); });
  audio.addEventListener('pause', render);
  audio.addEventListener('error', () => {
    ++attempt;
    enabled = loading = false;
    failed = true;
    render();
    status.textContent = '音樂暫時無法載入，請按音樂按鈕重試。';
  });
  // Preserve the visitor's choice while a video or another browser tab is active.
  document.addEventListener('visibilitychange', sync);
  if (detail) new MutationObserver(sync).observe(detail, {attributes:true,attributeFilter:['class'],childList:true,subtree:true});
  ['play','pause','ended','volumechange'].forEach(event => document.addEventListener(event, e => {
    if (e.target instanceof HTMLVideoElement) sync();
  }, true));
  button.disabled = false;
  render();
})();

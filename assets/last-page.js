(() => {
  'use strict';
  const root = document.querySelector('[data-last-page]');
  if (!root) return;
  const button = root.querySelector('.lastPageEnvelope');
  const reveal = root.querySelector('#lastPageReveal');
  const content = root.querySelector('#lastPageContent');
  const status = root.querySelector('.lastPageStatus');
  if (!button || !reveal || !content || !status) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let timer = null;
  // Template content is separate from the animation; images/video/other markup can replace it.
  const finish = () => {
    if (root.dataset.state !== 'opening') return;
    clearTimeout(timer);
    root.dataset.state = 'opened';
    reveal.inert = false;
    reveal.removeAttribute('aria-hidden');
    button.setAttribute('aria-expanded', 'true');
    button.setAttribute('aria-label', '旅程最後一封信已開啟');
    status.textContent = '信封已開啟。';
    const heading = reveal.querySelector('#lastPageMessageTitle');
    if (heading) heading.focus({preventScroll:true});
    root.dispatchEvent(new CustomEvent('lastpage:opened', {bubbles:true}));
  };
  button.addEventListener('click', () => {
    if (root.dataset.state !== 'sealed') return;
    // Freeze the current float offset before opening, without a position jump.
    button.style.translate = getComputedStyle(button).translate;
    root.dataset.state = 'opening';
    root.classList.add('isVisible');
    button.disabled = true;
    reveal.replaceChildren(content.content.cloneNode(true));
    reveal.hidden = false;
    reveal.inert = true;
    reveal.setAttribute('aria-hidden', 'true');
    const stage = root.querySelector('.lastPageStage');
    const sizeSheet = () => {
      const height = Math.max(matchMedia('(max-width:640px)').matches ? 320 : 360, reveal.offsetHeight + 40);
      stage.style.setProperty('--last-page-open-height', `${height}px`);
      reveal.style.setProperty('--paper-start-y', `${height - button.offsetHeight - 24}px`);
      reveal.style.setProperty('--paper-start-scale', String(button.clientWidth * .88 / reveal.clientWidth));
    };
    sizeSheet();
    // Keep replacement images/video and viewport resizing within the paper page.
    if ('ResizeObserver' in window) new ResizeObserver(sizeSheet).observe(reveal);
    if (reduced.matches) finish();
    else timer = setTimeout(finish, 3650); // The sheet finishes sliding before its text fades in.
  });
  reduced.addEventListener('change', event => {
    if (event.matches) {root.classList.add('isVisible');finish();}
  });
  button.disabled = false;
  if (reduced.matches || !('IntersectionObserver' in window)) root.classList.add('isVisible');
  else {
    root.classList.add('isReady');
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        root.classList.add('isVisible'); observer.disconnect();
      }
    }, {threshold:0.12});
    observer.observe(root.querySelector('.lastPageCard'));
  }
})();

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
    reveal.hidden = false;
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
    if (reduced.matches) finish();
    else timer = setTimeout(finish, 3650); // Flap + extraction, then 1.1s full-size paper reveal = 4.75s total.
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

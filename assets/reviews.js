(() => {
  const cards = [...document.querySelectorAll('#voices .review')];
  const mobile = matchMedia('(max-width:640px)');
  function measure() {
    cards.forEach(card => {
      const text = card.querySelector('p'), button = card.querySelector('.reviewExpand');
      if (!mobile.matches) { card.classList.remove('isExpanded'); button.setAttribute('aria-expanded','false'); button.textContent = '展開全文'; }
      button.hidden = !mobile.matches || (!card.classList.contains('isExpanded') && text.scrollHeight <= text.clientHeight + 1);
    });
  }
  cards.forEach(card => {
    const button = card.querySelector('.reviewExpand');
    button.addEventListener('click', () => {
      const expanded = card.classList.toggle('isExpanded');
      button.setAttribute('aria-expanded', String(expanded));
      button.textContent = expanded ? '收合全文' : '展開全文';
    });
  });
  window.addEventListener('resize', measure);
  if (document.fonts) document.fonts.ready.then(measure);
  measure();
})();

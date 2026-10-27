(() => {
  document.documentElement.classList.add('js');

  // Herovideo: mindre fil på mobil
  const video = document.querySelector('.hero-video');
  if (video) {
    const mobile = window.matchMedia('(max-width: 768px)').matches;
    video.src = mobile ? video.dataset.srcMobile : video.dataset.src;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) video.removeAttribute('autoplay');
    else video.play().catch(() => {});
  }

  // Rubriken tonar in bokstav för bokstav
  document.querySelectorAll('[data-split]').forEach(el => {
    const lines = el.innerHTML.split(/<br\s*\/?>/i);
    let i = 0;
    el.setAttribute('aria-label', el.textContent);
    el.innerHTML = lines.map(line =>
      line.trim().split(/\s+/).map(word =>
        '<span class="w" aria-hidden="true">' +
        [...word].map(ch => `<span class="ch" style="animation-delay:${(0.25 + i++ * 0.025).toFixed(3)}s">${ch}</span>`).join('') +
        '</span>'
      ).join(' ')
    ).join('<br>');
  });

  // Meny
  const wrap = document.querySelector('.nav-wrap');
  const toggle = document.querySelector('.nav-toggle');
  const setOpen = open => {
    wrap.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Stäng meny' : 'Öppna meny');
  };
  toggle.addEventListener('click', () => setOpen(!wrap.classList.contains('open')));
  document.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  const onScroll = () => wrap.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Sektioner glider in
  const targets = document.querySelectorAll('.about-text, .sec-head, .svc, .proj-head, .proj, .process-head, .timeline li, .team-head, .person, .reviews-head, .quote, .faq-head, .faq-list, .contact-grid > *');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    targets.forEach(t => { t.classList.add('rv'); io.observe(t); });
  }

  // Formuläret öppnar ett ifyllt mejl
  const form = document.querySelector('.form');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const d = new FormData(form);
    const tjanster = d.getAll('tjanst').join(', ') || '–';
    const body = [
      `Namn: ${d.get('namn')}`,
      `Telefon: ${d.get('telefon') || '–'}`,
      `E-post: ${d.get('epost')}`,
      `Ort: ${d.get('ort') || '–'}`,
      `Kund: ${d.get('kund')}`,
      `Gäller: ${tjanster}`,
      '',
      d.get('meddelande') || ''
    ].join('\n');
    const subject = `Förfrågan från ${d.get('namn')} (${d.get('kund')})`;
    location.href = `mailto:${form.dataset.mailto}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  const y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();

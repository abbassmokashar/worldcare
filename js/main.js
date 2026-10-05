(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const yrs = $('[data-years]');
  if (yrs) { const n = new Date().getFullYear() - 2017; yrs.dataset.count = n; yrs.textContent = n + '+'; }
  $('#yr').textContent = new Date().getFullYear();

  /* sticky nav shadow */
  const nav = $('#nav');
  const totop = $('#totop');
  const onScroll = () => { nav.classList.toggle('is-stuck', scrollY > 8); totop.classList.toggle('show', scrollY > 700); };
  totop.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* mobile menu */
  const burger = $('#burger'), menu = $('#menu');
  const setMenu = open => { menu.classList.toggle('open', open); burger.setAttribute('aria-expanded', open); };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu.addEventListener('click', e => e.target.closest('a') && setMenu(false));
  addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));

  /* nigeria map pins */
  const pins = [['Kano', 205, 95, 'Branch'], ['Lagos', 98, 238, 'Head Office'], ['Port Harcourt', 215, 280, 'Branch']];
  const g = $('#pins');
  if (g) g.innerHTML = pins.map(([n, x, y, t], i) =>
    `<g class="pin" style="--i:${i * 6}"><path transform="translate(${x} ${y})" d="M0 0C-9-10-12-15-12-21a12 12 0 0124 0c0 6-3 11-12 21z"/><circle cx="${x}" cy="${y - 21}" r="4.500" fill="#fff"/><text class="pinlbl" x="${x + 16}" y="${y - 20}">${n}</text><text x="${x + 16}" y="${y - 7}" font-size="10" font-weight="500" fill="#4a5b72">${t}</text></g>`).join('');

  /* scroll reveal + staggered children */
  $$('.trust li,.svc li,.stats li,.numbers li,.cities li,.card').forEach((el, i) => el.style.setProperty('--d', (i % 5) * 80 + 'ms'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in'); io.unobserve(en.target);
      if (en.target.matches('.stats li,.numbers li')) count($('strong', en.target));
    });
  }, { threshold: .15, rootMargin: '0px 0px -40px' });
  $$('.rv').forEach(el => io.observe(el));
  const mapIO = new IntersectionObserver(([e]) => { if (e.isIntersecting) { e.target.classList.add('in'); mapIO.disconnect(); } }, { threshold: .3 });
  const map = $('.map'); map && mapIO.observe(map);

  /* count-up */
  function count(el) {
    const end = +el.dataset.count, suf = el.dataset.suffix || '';
    if (reduce || el.hasAttribute('data-plain')) { el.textContent = end + suf; return; }
    const t0 = performance.now(), dur = 1100;
    const tick = t => {
      const p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * e) + suf;
      p < 1 && requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* carousel */
  const track = $('#track'), prev = $('.car__btn--prev'), next = $('.car__btn--next');
  const step = () => { const c = $('.card', track); return c.getBoundingClientRect().width + 14; };
  const sync = () => {
    prev.disabled = track.scrollLeft < 4;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
  };
  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  next.addEventListener('click', () => {
    if (next.disabled) return track.scrollTo({ left: 0, behavior: 'smooth' });
    track.scrollBy({ left: step(), behavior: 'smooth' });
  });
  track.addEventListener('scroll', sync, { passive: true });
  addEventListener('resize', sync); sync();
  track.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') track.scrollBy({ left: step(), behavior: 'smooth' });
    if (e.key === 'ArrowLeft') track.scrollBy({ left: -step(), behavior: 'smooth' });
  });

  /* active nav link on scroll */
  const links = $$('.menu a');
  const secIO = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  ['home', 'products', 'about', 'services', 'presence', 'contact'].forEach(id => { const s = document.getElementById(id); s && secIO.observe(s); });

  /* product search filter */
  const sIn = $('.search input');
  sIn && sIn.addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    $$('.card', track).forEach(c => c.style.display = !q || c.textContent.toLowerCase().includes(q) ? '' : 'none');
    sync();
  });
})();

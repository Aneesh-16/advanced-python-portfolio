(function () {
  'use strict';
  var d = document, root = d.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* mobile nav */
  var btn = d.querySelector('.menu-btn'), nav = d.querySelector('.nav');
  function setMenu(open) {
    if (!btn || !nav) return;
    btn.setAttribute('aria-expanded', open); nav.classList.toggle('open', open);
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (btn) {
    btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* header state, progress bar, back to top */
  var header = d.querySelector('.site-header'), bar = d.querySelector('.progress i'), top = d.querySelector('.to-top');
  var ticking = false;
  function onScroll() {
    var y = window.scrollY, h = root.scrollHeight - window.innerHeight;
    if (header) header.classList.toggle('scrolled', y > 8);
    if (bar) bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    if (top) top.classList.toggle('show', y > 700);
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  if (top) top.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    var t = d.getElementById('top'); if (t) { t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); }
  });

  /* reveal on scroll */
  var rev = d.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    rev.forEach(function (el, i) { el.style.setProperty('--d', (i % 3) * .08 + 's'); io.observe(el); });
  } else rev.forEach(function (el) { el.classList.add('in'); });

  /* active section indicators (header nav + blog side nav) */
  function spy(linkSel, offset) {
    var links = [].slice.call(d.querySelectorAll(linkSel)).filter(function (a) { return a.getAttribute('href').indexOf('#') !== -1; });
    var map = links.map(function (a) { var id = a.getAttribute('href').split('#')[1]; return { a: a, el: id && d.getElementById(id) }; }).filter(function (m) { return m.el; });
    if (!map.length || !('IntersectionObserver' in window)) return;
    function update() {
      var cur = null, line = window.innerHeight * offset;
      map.forEach(function (m) { if (m.el.getBoundingClientRect().top <= line) cur = m; });
      map.forEach(function (m) { m.a.classList.toggle('active', m === cur); });
    }
    window.addEventListener('scroll', function () { requestAnimationFrame(update); }, { passive: true }); update();
  }
  spy('.nav a', .35); spy('.story-aside a', .4);

  /* gallery filters */
  var filters = d.querySelectorAll('.filter'), cards = d.querySelectorAll('.card');
  filters.forEach(function (b) {
    b.addEventListener('click', function () {
      filters.forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      var f = b.dataset.filter;
      cards.forEach(function (c) { c.hidden = f !== 'all' && c.dataset.category !== f; });
    });
  });

  /* lightbox */
  var triggers = [].slice.call(d.querySelectorAll('[data-lightbox]'));
  if (triggers.length) {
    var lb = d.createElement('div');
    lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Image viewer');
    lb.innerHTML = '<button class="lb-close" aria-label="Close image">×</button><button class="lb-prev" aria-label="Previous image">‹</button><figure><img alt=""><figcaption></figcaption></figure><button class="lb-next" aria-label="Next image">›</button>';
    d.body.appendChild(lb);
    var img = lb.querySelector('img'), cap = lb.querySelector('figcaption'), idx = 0, last = null;
    var visible = function () { return triggers.filter(function (t) { return !t.closest('.card[hidden]'); }); };
    function show(i) {
      var list = visible(); idx = (i + list.length) % list.length;
      var t = list[idx], im = t.querySelector('img');
      img.src = t.getAttribute('href'); img.alt = im ? im.alt : '';
      cap.innerHTML = ''; cap.appendChild(d.createTextNode(t.dataset.caption || (im ? im.alt : '')));
      var o = d.createElement('a'); o.href = t.getAttribute('href'); o.target = '_blank'; o.rel = 'noopener'; o.textContent = 'Open original ↗'; cap.appendChild(o);
    }
    function open(t) { last = t; lb.classList.add('open'); d.body.style.overflow = 'hidden'; show(visible().indexOf(t)); lb.querySelector('.lb-close').focus(); }
    function close() { lb.classList.remove('open'); d.body.style.overflow = ''; if (last) last.focus(); }
    triggers.forEach(function (t) { t.addEventListener('click', function (e) { e.preventDefault(); open(t); }); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    lb.querySelector('.lb-close').onclick = close;
    lb.querySelector('.lb-prev').onclick = function () { show(idx - 1); };
    lb.querySelector('.lb-next').onclick = function () { show(idx + 1); };
    d.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(idx - 1);
      else if (e.key === 'ArrowRight') show(idx + 1);
      else if (e.key === 'Tab') {
        var f = [].slice.call(lb.querySelectorAll('button,a')), a = f[0], z = f[f.length - 1];
        if (e.shiftKey && d.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && d.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    });
  }
})();

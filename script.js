// script.js — Firli Portfolio v2

document.addEventListener('DOMContentLoaded', () => {

  // ── LOADER ──
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => loader && loader.classList.add('hidden'), 1400);
  });

  // ── CURSOR ──
  const cur = document.getElementById('cur');
  const cur2 = document.getElementById('cur2');
  let mx = 0, my = 0, fx = 0, fy = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (cur) { cur.style.left = mx + 'px'; cur.style.top = my + 'px'; }
  });
  (function loop() {
    fx += (mx - fx) * .13; fy += (my - fy) * .13;
    if (cur2) { cur2.style.left = fx + 'px'; cur2.style.top = fy + 'px'; }
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a,button,.pi,.sv-card,.f').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('ch'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('ch'));
  });

  // ── HEADER SCROLL ──
  const hdr = document.getElementById('hdr');
  window.addEventListener('scroll', () => {
    hdr && hdr.classList.toggle('on', window.scrollY > 50);
  }, { passive: true });

  // ── MOBILE NAV ──
  const nt = document.getElementById('nt');
  const nav = document.getElementById('nav');
  if (nt && nav) {
    nt.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      nt.classList.toggle('on', open);
      nt.setAttribute('aria-expanded', open);
    });
    nav.querySelectorAll('.nl').forEach(l => l.addEventListener('click', () => {
      nav.classList.remove('open');
      nt.classList.remove('on');
    }));
  }

  // ── SCROLL REVEAL ──
  document.querySelectorAll('.sv-card,.pi,.sec-title,.sec-label,.as-text p,.ct-left,.ct-form').forEach(el => {
    el.setAttribute('data-r', '');
  });
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const siblings = e.target.parentElement
          ? Array.from(e.target.parentElement.children).filter(c => c.hasAttribute('data-r'))
          : [];
        const delay = siblings.indexOf(e.target) * 75;
        setTimeout(() => e.target.classList.add('vis'), delay);
        ro.unobserve(e.target);
      }
    });
  }, { threshold: .1 });
  document.querySelectorAll('[data-r]').forEach(el => ro.observe(el));

  // ── PORTFOLIO FILTER ──
  const filters = document.querySelectorAll('.f');
  const items = document.querySelectorAll('.pi');
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tag = btn.dataset.f;
      items.forEach(item => {
        const tags = (item.dataset.tags || '').split(',');
        item.style.display = (tag === 'all' || tags.includes(tag)) ? 'block' : 'none';
      });
    });
  });

  // ── MODAL ──
  const modal  = document.getElementById('modal');
  const mimg   = document.getElementById('mimg');
  const mtitle = document.getElementById('mtitle');
  const mdesc  = document.getElementById('mdesc');
  const mtag   = document.getElementById('mtag');
  const mbg    = document.getElementById('mbg');
  const mx2    = document.getElementById('mx');
  const mprev  = document.getElementById('mprev');
  const mnext  = document.getElementById('mnext');
  let curIdx   = 0;

  const visible = () => Array.from(document.querySelectorAll('.pi')).filter(el => el.style.display !== 'none');

  function openModal(idx) {
    const list = visible();
    if (!list[idx]) return;
    curIdx = idx;
    const it = list[idx];
    // Live project — open URL instead of modal
    if (it.dataset.url) {
      window.open(it.dataset.url, '_blank', 'noopener');
      return;
    }
    mimg.src = it.dataset.img || '';
    mimg.alt = it.dataset.title || '';
    mtitle.textContent = it.dataset.title || '';
    mdesc.textContent  = it.dataset.desc  || '';
    mtag.textContent   = (it.dataset.tags || '').replace(/,/g,' · ').toUpperCase();
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.pi-btn').forEach(btn => {
    if (btn.tagName === 'BUTTON') {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const it = btn.closest('.pi');
        const list = visible();
        openModal(list.indexOf(it));
      });
    }
  });

  if (mbg) mbg.addEventListener('click', closeModal);
  if (mx2) mx2.addEventListener('click', closeModal);
  if (mprev) mprev.addEventListener('click', () => { const l = visible(); openModal((curIdx - 1 + l.length) % l.length); });
  if (mnext) mnext.addEventListener('click', () => { const l = visible(); openModal((curIdx + 1) % l.length); });
  document.addEventListener('keydown', e => {
    if (modal && modal.getAttribute('aria-hidden') === 'false') {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') mprev && mprev.click();
      if (e.key === 'ArrowRight') mnext && mnext.click();
    }
  });

  // ── CONTACT FORM ──
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const msg   = document.getElementById('message').value.trim();
      if (!name || !email || !msg) { showToast('Harap isi semua kolom yang diperlukan.', 'err'); return; }
      showToast(`Terima kasih, ${name}! Pesan dikirim ✓`, 'ok');
      form.reset();
    });
  }

  function showToast(text, type) {
    const old = document.getElementById('toast');
    if (old) old.remove();
    const t = document.createElement('div');
    t.id = 'toast';
    t.textContent = text;
    Object.assign(t.style, {
      position: 'fixed', bottom: '2rem', left: '50%',
      transform: 'translateX(-50%)',
      background: type === 'ok' ? '#d6f74a' : '#ff4747',
      color: type === 'ok' ? '#080a0e' : '#fff',
      padding: '.8rem 1.5rem', borderRadius: '100px',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '.78rem', fontWeight: '700',
      zIndex: '9999', boxShadow: '0 8px 24px rgba(0,0,0,.4)',
      transition: 'opacity .4s ease',
    });
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 400); }, 3500);
  }

  // ── ACTIVE NAV ON SCROLL ──
  const secs = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let cur = '';
    secs.forEach(s => { if (window.scrollY >= s.offsetTop - 130) cur = s.id; });
    document.querySelectorAll('.nl[href^="#"]').forEach(l => {
      l.style.color = l.getAttribute('href') === `#${cur}` ? 'var(--lime)' : '';
    });
  }, { passive: true });

});

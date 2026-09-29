/* ==========================================================
   Kali Robinson — Professional Site · interactions
   No dependencies. Each feature is a small, independent block.
   ========================================================== */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- Footer year ---------- */
  $('#year').textContent = new Date().getFullYear();

  /* ---------- Mobile nav ---------- */
  const nav = $('.nav'), toggle = $('.nav-toggle');
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
  });
  $$('.nav-links a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }));

  /* ---------- Typed role line ---------- */
  const roles = [
    'IT Strategic Consultant',
    'Systems Analyst',
    'Infrastructure Technician',
    'Identity & Access Administrator',
    'Tier II NOC Analyst',
  ];
  const typed = $('#typed');
  if (!reduceMotion) {
    let i = 0, j = roles[0].length, deleting = true;
    const tick = () => {
      const word = roles[i];
      j += deleting ? -1 : 1;
      typed.textContent = word.slice(0, j);
      let delay = deleting ? 35 : 70;
      if (!deleting && j === word.length) { deleting = true; delay = 2200; }
      else if (deleting && j === 0) { deleting = false; i = (i + 1) % roles.length; delay = 350; }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 2600);
  }

  /* ---------- Count-up stats ---------- */
  const countUp = el => {
    const end = +el.dataset.count;
    if (reduceMotion) { el.textContent = end; return; }
    const t0 = performance.now(), dur = 1200;
    const step = t => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  setTimeout(() => $$('[data-count]').forEach(countUp), 400);

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
  }, { threshold: 0.08 });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- Active nav link ---------- */
  const links = $$('.nav-links a[href^="#"]');
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(l => l.classList.toggle('is-current', l.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => spy.observe(s));

  /* ---------- Collapsible long roles ---------- */
  $$('.role').forEach(role => {
    const items = $$('.role-points li', role);
    if (items.length <= 4) return;
    role.classList.add('is-collapsible');
    const btn = document.createElement('button');
    btn.className = 'expand';
    const hidden = items.length - 3;
    btn.textContent = `+ ${hidden} more`;
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', () => {
      const open = role.classList.toggle('is-open');
      btn.textContent = open ? '− show less' : `+ ${hidden} more`;
      btn.setAttribute('aria-expanded', open);
    });
    $('.role-points', role).after(btn);
  });

  /* ---------- Skill highlighting ---------- */
  const chips = $$('.chip');
  const targets = $$('[data-skills]');
  const clearBtn = $('.clear-filter');
  let active = null;

  const applySkill = skill => {
    active = skill;
    document.body.classList.toggle('is-filtering', !!skill);
    chips.forEach(c => c.classList.toggle('is-active', c.dataset.skill === skill));
    targets.forEach(t => t.classList.toggle('is-match', !!skill && t.dataset.skills.split(' ').includes(skill)));
    clearBtn.hidden = !skill;
    if (skill) {
      // make sure matching projects aren't hidden by the category tabs
      setCategory('all');
      const first = targets.find(t => t.classList.contains('is-match'));
      const matches = targets.filter(t => t.classList.contains('is-match')).length;
      clearBtn.textContent = `× clear highlight · ${matches} match${matches === 1 ? '' : 'es'}`;
      const role = first && first.closest('.role.is-collapsible:not(.is-open)');
      if (role) $('.expand', role).click();
    }
  };
  chips.forEach(c => c.addEventListener('click', () => applySkill(active === c.dataset.skill ? null : c.dataset.skill)));
  clearBtn.addEventListener('click', () => applySkill(null));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && active) applySkill(null); });

  /* ---------- Project category tabs ---------- */
  const tabs = $$('.tab');
  const projects = $$('.project');
  function setCategory(cat) {
    tabs.forEach(t => {
      const on = t.dataset.filter === cat;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on);
    });
    projects.forEach(p => p.classList.toggle('is-hidden', cat !== 'all' && p.dataset.cat !== cat));
  }
  tabs.forEach(t => t.addEventListener('click', () => setCategory(t.dataset.filter)));

  /* ---------- Network background ---------- */
  const canvas = $('#bg');
  const ctx = canvas.getContext('2d');
  let w, h, nodes = [], dpr = Math.min(window.devicePixelRatio || 1, 2);
  const mouse = { x: -9999, y: -9999 };

  const resize = () => {
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
    const count = Math.round(Math.min(90, (innerWidth * innerHeight) / 16000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - .5) * .25 * dpr, vy: (Math.random() - .5) * .25 * dpr,
      r: (Math.random() * 1.4 + .6) * dpr,
    }));
  };
  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    const link = 150 * dpr;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      if (!reduceMotion) {
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;
      }
      for (let k = i + 1; k < nodes.length; k++) {
        const b = nodes[k], dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
        if (d < link) {
          ctx.strokeStyle = `rgba(127,166,255,${(1 - d / link) * .18})`;
          ctx.lineWidth = dpr * .7;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      const md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
      const glow = md < 180 * dpr ? 1 - md / (180 * dpr) : 0;
      ctx.fillStyle = `rgba(201,211,224,${.35 + glow * .6})`;
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r + glow * 1.5 * dpr, 0, Math.PI * 2); ctx.fill();
    }
    if (!reduceMotion) requestAnimationFrame(draw);
  };
  addEventListener('resize', () => { resize(); if (reduceMotion) draw(); });
  addEventListener('pointermove', e => { mouse.x = e.clientX * dpr; mouse.y = e.clientY * dpr; });
  resize(); draw();
})();

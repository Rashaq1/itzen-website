/* ═══════════════════════════════════════════
   IT'ZEN — interactions
   ═══════════════════════════════════════════ */
(() => {
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─────────── inline icon set ─────────── */
const ICONS = {
  globe:  '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18"/>',
  mic:    '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4M8 22h8"/>',
  shield: '<path d="M12 2.5 4.5 6v6c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6z"/><path d="m9 12 2 2 4-4"/>',
  brain:  '<path d="M9.5 3.5A2.5 2.5 0 0 0 7 6a2.5 2.5 0 0 0-2 4 2.5 2.5 0 0 0 1 4.5A2.5 2.5 0 0 0 9 20a2.5 2.5 0 0 0 3-.5V4a2.5 2.5 0 0 0-2.5-.5z"/><path d="M14.5 3.5A2.5 2.5 0 0 1 17 6a2.5 2.5 0 0 1 2 4 2.5 2.5 0 0 1-1 4.5A2.5 2.5 0 0 1 15 20a2.5 2.5 0 0 1-3-.5"/>',
  chart:  '<path d="M3 20h18"/><path d="m4 15 4.5-5 3.5 3.5 4-6.5L20 5"/>',
  sound:  '<path d="M4 9v6h3.5L13 20V4L7.5 9z"/><path d="M17 8.5a4.5 4.5 0 0 1 0 7M19.5 6a8 8 0 0 1 0 12"/>',
  chat:   '<path d="M20 14.5a2.5 2.5 0 0 1-2.5 2.5H8l-4 3.5V6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5z"/>',
  award:  '<circle cx="12" cy="9" r="5.5"/><path d="m8.5 13.5-1.5 8 5-2.5 5 2.5-1.5-8"/>',
  user:   '<circle cx="12" cy="8" r="3.8"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>',
  building:'<path d="M4 21V5.5A1.5 1.5 0 0 1 5.5 4h7A1.5 1.5 0 0 1 14 5.5V21"/><path d="M14 10h4.5A1.5 1.5 0 0 1 20 11.5V21M3 21h18"/><path d="M7 8h4M7 12h4M7 16h4M17 14h0M17 17.5h0"/>',
  target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
  info:   '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.6h0"/>',
  apple:  '<path d="M16.4 12.8c0-2.4 2-3.6 2.1-3.6-1.1-1.7-2.9-1.9-3.6-1.9-1.5-.2-3 .9-3.8.9s-2-.9-3.2-.9c-1.7 0-3.2 1-4 2.5-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8s1.9.8 3.2.8 2.2-1.2 3-2.4c.9-1.3 1.3-2.6 1.3-2.7 0 0-2.4-1-2.4-3.7z" stroke="none" fill="currentColor"/><path d="M14.2 5.6c.7-.8 1.1-1.9 1-3-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.2-.6 2.9-1.4z" stroke="none" fill="currentColor"/>'
};
$$('i[data-i]').forEach(el => {
  const g = ICONS[el.dataset.i];
  if (g) el.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${g}</svg>`;
});

/* ─────────── language toggle ─────────── */
const html = document.documentElement;
const toggle = $('#langToggle');
const flip = $('.lang-flip', toggle);

const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const toArabicDigits = s => String(s).replace(/\d/g, d => AR_DIGITS[+d]);
const toLatinDigits  = s => String(s).replace(/[٠-٩]/g, d => AR_DIGITS.indexOf(d));

function setLang(lang, persist = true) {
  const ar = lang === 'ar';
  html.lang = lang;
  html.dir  = ar ? 'rtl' : 'ltr';

  $$('[data-ar][data-en]').forEach(el => {
    const t = el.dataset[ar ? 'ar' : 'en'];
    if (t != null) el.textContent = t;
  });

  $$('[data-ar-ph][data-en-ph]').forEach(el => {
    el.placeholder = el.dataset[ar ? 'arPh' : 'enPh'];
  });

  // stat headline numbers follow the active numeral system
  $$('.stat-num').forEach(el => { el.textContent = statText(el, +el.dataset.count); });

  document.title = ar
    ? "إتزن IT'ZEN — ذكاء اصطناعي في خدمة الصحة النفسية"
    : "IT'ZEN — AI in service of mental wellbeing";

  flip.textContent = ar ? 'EN' : 'ع';
  toggle.setAttribute('aria-label', ar ? 'Switch to English' : 'التبديل إلى العربية');

  if (persist) { try { localStorage.setItem('itzen-lang', lang); } catch {} }
}

toggle.addEventListener('click', () => {
  toggle.classList.add('flip');
  setTimeout(() => {
    setLang(html.lang === 'ar' ? 'en' : 'ar');
    toggle.classList.remove('flip');
  }, 160);
});

// Arabic-first: only a returning visitor's explicit choice overrides it.
(() => {
  let saved = null;
  try { saved = localStorage.getItem('itzen-lang'); } catch {}
  if (saved === 'en') setLang('en', false);
})();

/* ─────────── nav ─────────── */
const nav = $('#nav');
const burger = $('#burger');
const links = $('.nav-links');

addEventListener('scroll', () => nav.classList.toggle('stuck', scrollY > 24), { passive: true });

burger.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(open));
});
links.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    links.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }
});

// scroll-spy
const navMap = new Map($$('.nav-links a')
  .map(a => [a.getAttribute('href').slice(1), a])
  .filter(([id]) => document.getElementById(id)));

const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    const a = navMap.get(e.target.id);
    if (a && e.isIntersecting) {
      navMap.forEach(l => l.classList.remove('active'));
      a.classList.add('active');
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
navMap.forEach((_, id) => spy.observe(document.getElementById(id)));

/* ─────────── scroll reveal ─────────── */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    io.unobserve(e.target);
    if (e.target.dataset.count !== undefined) countUp(e.target);
    if (e.target.classList.contains('score-card')) fillRing();
  });
}, { threshold: .18, rootMargin: '0px 0px -8% 0px' });

const observeReveals = () => $$('.reveal:not(.in)').forEach(el => io.observe(el));
observeReveals();
$$('.stat-num, .bars').forEach(el => io.observe(el));

/* ─────────── count-up ─────────── */

// Renders a stat at value `n` in the active language.
// A stat carrying data-ar-label/data-en-label is prose ("1 in 3") and never counts.
function statText(el, n) {
  const ar = html.lang === 'ar';
  const label = el.dataset[ar ? 'arLabel' : 'enLabel'];
  if (label) return label;
  const pre = el.dataset.prefix || '';
  const suf = (el.dataset.suffix === '%' && ar) ? '٪' : (el.dataset.suffix || '');
  return `${pre}${ar ? toArabicDigits(n) : n}${suf}`;
}

function countUp(el) {
  const target = +el.dataset.count;

  // prose stats and reduced-motion both land straight on the final value
  if (reduced || el.dataset.arLabel) { el.textContent = statText(el, target); return; }

  const dur = 1400, t0 = performance.now();
  const tick = now => {
    const p = Math.min((now - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = statText(el, Math.round(target * eased));
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = statText(el, target);
  };
  requestAnimationFrame(tick);
}

/* ─────────── score ring ─────────── */
let ringDone = false;
function fillRing() {
  if (ringDone) return;
  ringDone = true;

  const SCORE = 32, CIRC = 2 * Math.PI * 82;
  $('#ringFg').style.strokeDashoffset = CIRC * (1 - SCORE / 100);

  const num = $('#scoreNum');
  const render = v => { num.textContent = html.lang === 'ar' ? toArabicDigits(v) : v; };

  if (reduced) return render(SCORE);

  const dur = 1700, t0 = performance.now();
  const tick = now => {
    const p = Math.min((now - t0) / dur, 1);
    render(Math.round(SCORE * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ─────────── contact form ─────────── */
const form = $('#waitlistForm');
const note = $('#formNote');

// "Yes, I'd use this" preselects the matching interest — that click IS the demand signal
$$('[data-interest]').forEach(link => link.addEventListener('click', () => {
  const radio = $(`input[name=interest][value="${link.dataset.interest}"]`, form);
  if (radio) radio.checked = true;
}));

form.addEventListener('submit', async e => {
  e.preventDefault();
  const ar = html.lang === 'ar';
  const btn = $('button[type=submit]', form);
  const email = $('#email', form);

  if (!email.checkValidity()) {
    note.className = 'form-note err';
    note.textContent = ar ? 'من فضلك أدخل بريداً إلكترونياً صحيحاً.' : 'Please enter a valid email address.';
    email.focus();
    return;
  }

  btn.disabled = true;
  note.className = 'form-note';
  note.textContent = ar ? 'جارٍ التسجيل…' : 'Signing you up…';

  try {
    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString()
    });
    if (!res.ok) throw new Error(res.status);

    note.className = 'form-note ok';
    note.textContent = ar
      ? 'تم! سنعلمك فور إطلاق إتزن. 🎉'
      : "You're in! We'll tell you the moment IT'ZEN launches. 🎉";
    form.reset();
  } catch {
    note.className = 'form-note err';
    note.textContent = ar
      ? 'تعذّر الإرسال. راسلنا على hello@itzenhealth.com'
      : 'Something went wrong. Email us at hello@itzenhealth.com';
  } finally {
    btn.disabled = false;
  }
});

})();

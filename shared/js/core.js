/* ============================================================
   CORE.JS — Funciones compartidas del sistema de presentación
   Baumsystem Pitch Deck System
   ============================================================ */

'use strict';

/* ---- Barra de progreso de scroll -------------------------- */
function initProgressBar() {
  const bar = document.getElementById('progressBar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width  = Math.min(progress, 100) + '%';
  }, { passive: true });
}

/* ---- Contador animado ------------------------------------- */
/**
 * Anima un elemento de 0 a `target` usando GSAP si está disponible,
 * o un fallback con requestAnimationFrame.
 *
 * @param {HTMLElement} el       - Elemento que contiene el counter
 * @param {number}      target   - Valor final
 * @param {number}      duration - Duración en segundos (default 2)
 * @param {string}      suffix   - Sufijo a agregar ('+', '%', etc.)
 * @param {boolean}     isFloat  - Si true, muestra decimales
 */
function animateCounter(el, target, duration = 2, suffix = '', isFloat = false) {
  if (typeof gsap !== 'undefined') {
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration,
      ease: 'power2.out',
      snap: { val: isFloat ? 0.1 : 1 },
      onUpdate: () => {
        const v = isFloat ? obj.val.toFixed(1) : Math.round(obj.val).toLocaleString('es-CL');
        el.textContent = v + suffix;
      }
    });
  } else {
    // Fallback sin GSAP
    const start = performance.now();
    const ms    = duration * 1000;
    function step(now) {
      const p = Math.min((now - start) / ms, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = Math.round(eased * target);
      el.textContent = v.toLocaleString('es-CL') + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
}

/* ---- Inicializar contadores con IntersectionObserver ------ */
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        const target   = parseFloat(entry.target.dataset.counter);
        const suffix   = entry.target.dataset.suffix  || '';
        const duration = parseFloat(entry.target.dataset.duration) || 2;
        const isFloat  = entry.target.dataset.float === 'true';
        animateCounter(entry.target, target, duration, suffix, isFloat);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ---- Video autoplay con IntersectionObserver -------------- */
function initVideoAutoplay() {
  const videos = document.querySelectorAll('.phone__screen video, [data-autoplay]');
  if (!videos.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.4 });

  videos.forEach(v => {
    v.muted    = true;
    v.loop     = true;
    v.playsInline = true;
    observer.observe(v);
  });
}

/* ---- Video hover play en cards ---------------------------- */
function initVideoHover() {
  const cards = document.querySelectorAll('[data-video-hover]');
  cards.forEach(card => {
    const video = card.querySelector('video');
    if (!video) return;
    video.muted    = true;
    video.loop     = true;
    video.playsInline = true;
    card.addEventListener('mouseenter', () => video.play().catch(() => {}));
    card.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
  });
}

/* ---- Resize handler con debounce -------------------------- */
function debounce(fn, delay = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/* ---- Smooth reveal para elementos con data-reveal --------- */
function initReveal() {
  if (typeof gsap === 'undefined') return;
  const els = document.querySelectorAll('[data-reveal]');
  els.forEach(el => {
    const dir = el.dataset.reveal || 'up';
    const delay = parseFloat(el.dataset.delay) || 0;
    const fromVars = { opacity: 0, duration: 0.9, delay, ease: 'power3.out' };
    if (dir === 'up')    fromVars.y = 50;
    if (dir === 'down')  fromVars.y = -50;
    if (dir === 'left')  fromVars.x = 60;
    if (dir === 'right') fromVars.x = -60;

    gsap.from(el, {
      ...fromVars,
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });
  });
}

/* ---- Cargar datos JSON ------------------------------------ */
async function loadData(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error('No se pudo cargar: ' + path);
    return await res.json();
  } catch (err) {
    console.warn('loadData error:', err);
    return null;
  }
}

/* ---- Render de lista de features en HTML ------------------ */
function renderFeatureList(features, containerSelector) {
  const el = document.querySelector(containerSelector);
  if (!el || !features) return;
  el.innerHTML = features.map(f =>
    `<li class="feature-item">${f}</li>`
  ).join('');
}

/* ---- Actualizar tab activo -------------------------------- */
function setActiveTab(tabs, index) {
  tabs.forEach((tab, i) => {
    tab.classList.toggle('active', i === index);
  });
}

/* ---- Utilidad: format number ------------------------------ */
function formatNumber(n) {
  return n.toLocaleString('es-CL');
}

/* ---- Init global ----------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initProgressBar();
  initCounters();
  initVideoAutoplay();
  initVideoHover();
  initReveal();
});

/* ---- Exports para uso en main.js -------------------------- */
window.BaumCore = {
  animateCounter,
  initCounters,
  initProgressBar,
  initVideoAutoplay,
  initReveal,
  loadData,
  renderFeatureList,
  setActiveTab,
  formatNumber,
  debounce
};

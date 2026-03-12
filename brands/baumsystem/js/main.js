/* =============================================
   MAIN.JS — Baumsystem Pitch Deck
   Brand-specific GSAP animations & interactions
   ============================================= */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('Baumsystem: GSAP or ScrollTrigger not loaded.');
    initFallback();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  initHeroAnimations();
  initScrollReveal();
  initModuleTabs();
  initGrowthChart();
  initCTASection();
  initNavActiveState();
});

/* ============================================================
   1. HERO — entrance animations on load
   ============================================================ */
function initHeroAnimations() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.s-hero__eyebrow', { opacity: 0, y: 24, duration: 0.7, delay: 0.2 })
    .from('.s-hero__title',    { opacity: 0, y: 40, duration: 0.8 }, '-=0.4')
    .from('.s-hero__subtitle', { opacity: 0, y: 24, duration: 0.7 }, '-=0.5')
    .from('.s-hero__actions',  { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
    .from('.s-hero__social-proof', { opacity: 0, y: 16, duration: 0.6 }, '-=0.3')
    .from('.s-hero__visual .phone-mockup',
          { opacity: 0, x: 60, scale: 0.95, duration: 0.9 }, '-=0.8')
    .from('.s-hero__badge--1', { opacity: 0, x: 30, duration: 0.5 }, '-=0.4')
    .from('.s-hero__badge--2', { opacity: 0, x: -30, duration: 0.5 }, '-=0.3');
}

/* ============================================================
   2. SCROLL REVEAL — generic fade-up elements
   ============================================================ */
function initScrollReveal() {
  // Fade up
  gsap.utils.toArray('.anim-fade-up').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true
        }
      }
    );
  });

  // Fade left
  gsap.utils.toArray('.anim-fade-left').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, x: -50 },
      {
        opacity: 1, x: 0,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true
        }
      }
    );
  });

  // Fade right
  gsap.utils.toArray('.anim-fade-right').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, x: 50 },
      {
        opacity: 1, x: 0,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true
        }
      }
    );
  });

  // Scale in
  gsap.utils.toArray('.anim-scale-in').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, scale: 0.88 },
      {
        opacity: 1, scale: 1,
        duration: 0.9,
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true
        }
      }
    );
  });

  // Stagger children
  gsap.utils.toArray('[data-stagger]').forEach(parent => {
    const children = Array.from(parent.children);
    const delay    = parseFloat(parent.dataset.stagger) || 0.1;

    gsap.fromTo(children,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: delay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: parent,
          start: 'top 82%',
          once: true
        }
      }
    );
  });

  // ---- Problem section cards with pin effect ----
  ScrollTrigger.create({
    trigger: '.s-problem',
    start: 'top 70%',
    once: true,
    onEnter() {
      gsap.from('.s-problem__card', {
        opacity: 0,
        y: 60,
        scale: 0.95,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power2.out'
      });
    }
  });

  // ---- Solution section pillars ----
  ScrollTrigger.create({
    trigger: '.s-solution__pillars',
    start: 'top 80%',
    once: true,
    onEnter() {
      gsap.from('.s-solution__pillar', {
        opacity: 0,
        x: -30,
        stagger: 0.12,
        duration: 0.6,
        ease: 'power2.out'
      });
    }
  });

  // ---- Benefits cards ----
  ScrollTrigger.create({
    trigger: '.s-benefits__grid',
    start: 'top 75%',
    once: true,
    onEnter() {
      gsap.from('.s-benefits__card', {
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power2.out'
      });
    }
  });

  // ---- Process steps ----
  ScrollTrigger.create({
    trigger: '.s-process__steps',
    start: 'top 75%',
    once: true,
    onEnter() {
      gsap.from('.s-process__step', {
        opacity: 0,
        y: 40,
        stagger: 0.15,
        duration: 0.75,
        ease: 'power2.out'
      });
    }
  });

  // ---- KPI cards ----
  ScrollTrigger.create({
    trigger: '.s-kpis__grid',
    start: 'top 80%',
    once: true,
    onEnter() {
      gsap.from('.s-kpis__card', {
        opacity: 0,
        y: 40,
        scale: 0.9,
        stagger: 0.1,
        duration: 0.7,
        ease: 'back.out(1.4)'
      });
    }
  });

  // ---- Expansion prospects ----
  ScrollTrigger.create({
    trigger: '.s-kpis__expansion-grid',
    start: 'top 85%',
    once: true,
    onEnter() {
      gsap.from('.s-kpis__prospect', {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out'
      });
    }
  });

  // ---- CTA section animated entrance ----
  ScrollTrigger.create({
    trigger: '.s-cta',
    start: 'top 60%',
    once: true,
    onEnter() {
      const tl = gsap.timeline();
      tl.from('.s-cta__logo',     { opacity: 0, scale: 0.8, duration: 0.7, ease: 'back.out(1.5)' })
        .from('.s-cta__title',    { opacity: 0, y: 40, duration: 0.8, ease: 'power2.out' }, '-=0.3')
        .from('.s-cta__subtitle', { opacity: 0, y: 24, duration: 0.7, ease: 'power2.out' }, '-=0.4')
        .from('.s-cta__actions',  { opacity: 0, y: 20, duration: 0.6 }, '-=0.3')
        .from('.s-cta__proof',    { opacity: 0, y: 16, duration: 0.5 }, '-=0.2');
    }
  });

  // ---- Growth section ----
  ScrollTrigger.create({
    trigger: '.s-growth__layout',
    start: 'top 70%',
    once: true,
    onEnter() {
      gsap.from('.s-growth__text', { opacity: 0, x: -50, duration: 0.9, ease: 'power2.out' });
      gsap.from('.s-growth__chart-wrap', { opacity: 0, x: 50, duration: 0.9, ease: 'power2.out', delay: 0.1 });
      gsap.from('.s-growth__milestone', {
        opacity: 0,
        y: 20,
        stagger: 0.12,
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.3
      });
    }
  });
}

/* ============================================================
   3. MODULE TABS — interactive panel switching
   ============================================================ */
function initModuleTabs() {
  const tabNav    = document.getElementById('moduleTabNav');
  const panels    = document.querySelectorAll('.s-modules__panel');
  const tabBtns   = document.querySelectorAll('.tab-btn');

  if (!tabNav || !panels.length) return;

  function showPanel(idx) {
    // Hide all
    panels.forEach(p => {
      p.classList.remove('active');
    });
    tabBtns.forEach(b => b.classList.remove('active'));

    // Show selected
    const panel = document.querySelector(`.s-modules__panel[data-panel="${idx}"]`);
    const btn   = document.querySelector(`.tab-btn[data-tab="${idx}"]`);

    if (panel) {
      panel.classList.add('active');

      // Animate panel in
      gsap.fromTo(panel,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
      );

      // Re-trigger stagger children inside the newly active panel
      const staggerEls = panel.querySelectorAll('[data-stagger]');
      staggerEls.forEach(parent => {
        gsap.fromTo(Array.from(parent.children),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.15 }
        );
      });
    }

    if (btn) btn.classList.add('active');
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.tab, 10);
      showPanel(idx);
    });
  });

  // Ensure first panel is visible on load
  showPanel(0);
}

/* ============================================================
   4. GROWTH CHART — Chart.js lazy init
   ============================================================ */
function initGrowthChart() {
  if (typeof Chart === 'undefined') return;

  const canvas = document.getElementById('growthChart');
  if (!canvas) return;

  let created = false;

  ScrollTrigger.create({
    trigger: '#crecimiento',
    start: 'top 70%',
    once: true,
    onEnter() {
      if (created) return;
      created = true;

      new Chart(canvas, {
        type: 'line',
        data: {
          labels: ['2021', '2022', '2023', '2024', '2025', '2026 (proy.)'],
          datasets: [
            {
              label: 'Hectáreas bajo servicio',
              data: [1200, 2800, 4500, 7000, 10000, 14500],
              borderColor: '#1B4332',
              backgroundColor: 'rgba(27,67,50,0.06)',
              fill: true,
              tension: 0.4,
              pointBackgroundColor: '#1B4332',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 7,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 1200,
            easing: 'easeInOutQuart'
          },
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: {
              display: true,
              position: 'top',
              align: 'start',
              labels: {
                usePointStyle: true,
                pointStyle: 'circle',
                padding: 20,
                color: '#4A5D4C',
                font: { size: 12, family: 'Inter, sans-serif', weight: '600' }
              }
            },
            tooltip: {
              backgroundColor: '#1B4332',
              titleColor: '#D8F3DC',
              bodyColor: '#A7D5BC',
              cornerRadius: 10,
              padding: 12,
              callbacks: {
                label(ctx) {
                  return `  ${ctx.parsed.y.toLocaleString('es-CL')} ha`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(0,0,0,0.04)' },
              ticks: {
                color: '#8FA890',
                font: { size: 11, family: 'Inter, sans-serif' }
              }
            },
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(0,0,0,0.04)' },
              ticks: {
                color: '#8FA890',
                font: { size: 11, family: 'Inter, sans-serif' },
                callback: v => v.toLocaleString('es-CL') + ' ha'
              }
            }
          },
          elements: {
            line: { borderWidth: 2.5 }
          }
        }
      });
    }
  });
}

/* ============================================================
   5. CTA SECTION — pulsing button effect
   ============================================================ */
function initCTASection() {
  const ctaBtn = document.querySelector('.s-cta__btn-primary');
  if (!ctaBtn) return;

  // Subtle pulse on the CTA button
  gsap.to(ctaBtn, {
    boxShadow: '0 0 40px rgba(82,183,136,0.5), 0 0 80px rgba(82,183,136,0.15)',
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    delay: 3
  });
}

/* ============================================================
   6. NAV ACTIVE STATE — highlight current section
   ============================================================ */
function initNavActiveState() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  sections.forEach(section => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle(self) {
        if (self.isActive) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${section.id}`) {
              link.classList.add('active');
            }
          });
        }
      }
    });
  });
}

/* ============================================================
   7. FALLBACK — no GSAP, just make everything visible
   ============================================================ */
function initFallback() {
  document.querySelectorAll(
    '.anim-fade-up, .anim-fade-left, .anim-fade-right, .anim-scale-in'
  ).forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });

  // Still do module tabs with vanilla JS
  const tabBtns = document.querySelectorAll('.tab-btn');
  const panels  = document.querySelectorAll('.s-modules__panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.dataset.tab;
      panels.forEach(p => p.classList.remove('active'));
      tabBtns.forEach(b => b.classList.remove('active'));
      const panel = document.querySelector(`.s-modules__panel[data-panel="${idx}"]`);
      if (panel) panel.classList.add('active');
      btn.classList.add('active');
    });
  });
}

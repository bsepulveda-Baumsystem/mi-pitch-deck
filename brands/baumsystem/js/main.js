/* ============================================================
   MAIN.JS — Lógica de animaciones GSAP + Chart.js
   Baumsystem Pitch Deck
   ============================================================ */

'use strict';

/* ---- Registro de plugins GSAP ---------------------------- */
gsap.registerPlugin(ScrollTrigger);

/* ---- 1. Animación de entrada Hero (sin scroll) ----------- */
function initHeroAnimation() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.hero__logo',     { y: 30, opacity: 0, duration: 0.8 })
    .from('.hero__label',    { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')
    .from('.hero__title',    { y: 60, opacity: 0, duration: 1.0 }, '-=0.4')
    .from('.hero__subtitle', { y: 30, opacity: 0, duration: 0.7 }, '-=0.5')
    .from('.hero__stats .hero__stat',
                             { y: 24, opacity: 0, stagger: 0.12, duration: 0.6 }, '-=0.4')
    .from('.hero__cta-row',  { y: 20, opacity: 0, duration: 0.6 }, '-=0.3')
    .from('.scroll-indicator',{ y: 10, opacity: 0, duration: 0.5 }, '-=0.2');
}

/* ---- 2. Sección Problema (pinned) ------------------------- */
function initProblemSection() {
  const section = document.getElementById('problem');
  if (!section) return;

  const cards = gsap.utils.toArray('.pain-card');
  if (!cards.length) return;

  gsap.set(cards, { opacity: 0, y: 60 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: `+=${cards.length * 80}%`,
      pin: true,
      scrub: 1.2,
      anticipatePin: 1
    }
  });

  cards.forEach((card, i) => {
    tl.to(card, { opacity: 1, y: 0, duration: 0.5 }, i * 0.4)
      .to(card, { opacity: 1, duration: 0.3 }, i * 0.4 + 0.3);
  });
}

/* ---- 3. Sección Solución ---------------------------------- */
function initSolutionSection() {
  const section = document.getElementById('solution');
  if (!section) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 75%',
      once: true
    }
  });

  tl.from('#solution .section-header', { y: 50, opacity: 0, duration: 0.8 })
    .from('#solution .solution-col--left > *',
          { y: 40, opacity: 0, stagger: 0.1, duration: 0.7 }, '-=0.4')
    .from('#solution .phone-wrap',
          { x: 60, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.6');
}

/* ---- 4. Sección Process (cards una por una) -------------- */
function initProcessSection() {
  gsap.utils.toArray('.step-card').forEach((card, i) => {
    gsap.from(card, {
      y: 60,
      opacity: 0,
      duration: 0.7,
      delay: i * 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        once: true
      }
    });
  });
}

/* ---- 5. Módulos con tabs controlados por scroll ----------- */
function initModulesSection() {
  const section   = document.getElementById('modules');
  if (!section) return;

  const panels    = gsap.utils.toArray('.module-panel');
  const tabBtns   = gsap.utils.toArray('.tab-btn');
  if (!panels.length) return;

  const PANEL_COUNT = panels.length;

  // Estado inicial: primer panel visible
  gsap.set(panels[0], { opacity: 1, pointerEvents: 'auto' });
  tabBtns[0]?.classList.add('active');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: `+=${PANEL_COUNT * 110}%`,
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      onUpdate(self) {
        const raw      = self.progress * PANEL_COUNT;
        const idx      = Math.min(Math.floor(raw), PANEL_COUNT - 1);
        const localPct = raw - idx; // progreso dentro del panel actual

        // Actualizar opacidad de cada panel
        panels.forEach((p, i) => {
          let alpha = 0;
          if (i === idx) {
            alpha = Math.min(localPct * 3, 1); // fade in rápido
          } else if (i === idx - 1) {
            alpha = Math.max(1 - localPct * 3, 0); // fade out rápido
          } else if (i < idx) {
            alpha = 0;
          }
          gsap.set(p, { opacity: alpha, pointerEvents: alpha > 0.5 ? 'auto' : 'none' });
        });

        // Actualizar tabs
        tabBtns.forEach((btn, i) => btn.classList.toggle('active', i === idx));
      }
    }
  });

  // La timeline sólo necesita existir para que ScrollTrigger la controle
  tl.to({}, { duration: PANEL_COUNT });

  // Clic manual en tab (salta a esa posición)
  tabBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      // Calcular la posición de scroll que corresponde al panel i
      const st       = ScrollTrigger.getById('modules-st');
      if (!st) return;
      const target   = st.start + (i / PANEL_COUNT) * (st.end - st.start) + 10;
      window.scrollTo({ top: target, behavior: 'smooth' });
    });
  });
}

/* ---- 6. KPI Counters -------------------------------------- */
function initKPISection() {
  const section = document.getElementById('kpis');
  if (!section) return;

  gsap.from('.kpi-card', {
    y: 50,
    opacity: 0,
    stagger: 0.1,
    duration: 0.7,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: section,
      start: 'top 80%',
      once: true
    }
  });
}

/* ---- 7. Gráfico de crecimiento (Chart.js) ----------------- */
let growthChart = null;

async function initGrowthChart() {
  const canvas = document.getElementById('growthChart');
  if (!canvas) return;

  // Cargar datos desde JSON
  const data = await window.BaumCore?.loadData('../../data/baumsystem.json');
  if (!data) return;

  const { labels, hectares, isProjection } = data.growth;

  // Colores
  const solidColor   = 'rgba(34, 214, 114, 1)';
  const solidBg      = 'rgba(34, 214, 114, 0.15)';
  const projColor    = 'rgba(94, 234, 212, 0.7)';
  const projBg       = 'rgba(94, 234, 212, 0.08)';

  // Dividir en segmentos sólido y proyección
  const solidHa  = hectares.map((v, i) => isProjection[i] ? null : v);
  const projHa   = hectares.map((v, i) => {
    // El punto de transición debe aparecer en ambos
    if (isProjection[i]) return v;
    if (i > 0 && isProjection[i + 1]) return v; // último punto sólido
    return null;
  });

  const ctx = canvas.getContext('2d');

  growthChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Hectáreas bajo servicio',
          data: solidHa,
          borderColor: solidColor,
          backgroundColor: solidBg,
          fill: true,
          tension: 0.4,
          borderWidth: 3,
          pointBackgroundColor: solidColor,
          pointBorderColor: '#070d07',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          spanGaps: false
        },
        {
          label: 'Proyección',
          data: projHa,
          borderColor: projColor,
          backgroundColor: projBg,
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          borderDash: [6, 4],
          pointBackgroundColor: projColor,
          pointBorderColor: '#070d07',
          pointBorderWidth: 2,
          pointRadius: 5,
          spanGaps: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1800, easing: 'easeInOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(16, 26, 16, 0.95)',
          borderColor: 'rgba(34, 214, 114, 0.3)',
          borderWidth: 1,
          titleColor: '#22d672',
          bodyColor: '#d1fae5',
          padding: 12,
          callbacks: {
            label(ctx) {
              const v = ctx.raw;
              if (!v) return '';
              return ` ${v.toLocaleString('es-CL')} hectáreas`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(34, 214, 114, 0.05)' },
          ticks: { color: '#6b7280', font: { size: 11 } }
        },
        y: {
          grid: { color: 'rgba(34, 214, 114, 0.05)' },
          ticks: {
            color: '#6b7280',
            font: { size: 11 },
            callback: v => (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v)
          }
        }
      }
    }
  });

  // Inicializar chart al llegar a la sección
  let chartInited = false;
  ScrollTrigger.create({
    trigger: '#chart',
    start: 'top 80%',
    once: true,
    onEnter() {
      if (chartInited) return;
      chartInited = true;
      // Trigger update para que se anime al entrar
      growthChart.update('active');

      // Animar pipeline cards
      gsap.from('.pipeline-card', {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.4
      });
    }
  });
}

/* ---- 8. Benefits Section ---------------------------------- */
function initBenefitsSection() {
  gsap.utils.toArray('.benefit-card').forEach((card, i) => {
    gsap.from(card, {
      y: 50,
      opacity: 0,
      duration: 0.7,
      delay: i * 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        once: true
      }
    });
  });

  gsap.from('.testimonial', {
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.testimonial',
      start: 'top 85%',
      once: true
    }
  });
}

/* ---- 9. Closing Section (pinned) -------------------------- */
function initClosingSection() {
  const section = document.getElementById('closing');
  if (!section) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=150%',
      pin: true,
      scrub: 1,
      anticipatePin: 1
    }
  });

  tl.from('.closing__logo',    { scale: 0.7, opacity: 0, duration: 1 })
    .from('.closing__subtitle',{ y: 30, opacity: 0, duration: 0.6 }, '-=0.3')
    .from('.closing__actions > *',
                               { y: 20, opacity: 0, stagger: 0.15, duration: 0.5 }, '-=0.2')
    .from('.closing__contact', { opacity: 0, duration: 0.5 }, '-=0.1');
}

/* ---- 10. Section header reveals --------------------------- */
function initSectionRevealHeaders() {
  document.querySelectorAll('.section-header').forEach(el => {
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true
      }
    });
  });
}

/* ---- 11. Floating phone animation in hero ----------------- */
function initPhoneFloat() {
  gsap.to('.phone-wrap .phone', {
    y: -12,
    duration: 3,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true
  });
}

/* ---- 12. Animar barras del laptop mockup ------------------ */
function initLaptopBars() {
  const bars = document.querySelectorAll('.laptop-bar');
  bars.forEach((bar, i) => {
    const heights = [45, 72, 55, 88, 62, 76, 51, 93];
    bar.style.height = '0%';
    ScrollTrigger.create({
      trigger: bar,
      start: 'top 90%',
      once: true,
      onEnter() {
        gsap.to(bar, {
          height: heights[i % heights.length] + '%',
          duration: 1.2,
          delay: i * 0.08,
          ease: 'power3.out'
        });
      }
    });
  });
}

/* ---- Render de paneles desde JSON ------------------------- */
async function renderModulePanels() {
  const data = await window.BaumCore?.loadData('../../data/baumsystem.json');
  if (!data) return;

  // Rellenar features de cada panel
  data.modules.forEach((mod, i) => {
    const panel = document.getElementById(`panel-${mod.id}`);
    if (!panel) return;
    const list = panel.querySelector('.feature-list');
    if (!list) return;
    list.innerHTML = mod.features.map(f =>
      `<li class="feature-item">${f}</li>`
    ).join('');
  });

  // Rellenar pipeline cards
  const pipelineGrid = document.getElementById('pipelineGrid');
  if (pipelineGrid && data.pipeline) {
    pipelineGrid.innerHTML = data.pipeline.map(p => `
      <div class="pipeline-card">
        <div class="pipeline-card__flag">${p.flag}</div>
        <div class="pipeline-card__info">
          <div class="pipeline-card__company">${p.company}</div>
          <div class="pipeline-card__country">${p.country}</div>
        </div>
        <div class="pipeline-card__ha">${p.hectares.toLocaleString('es-CL')} ha</div>
      </div>
    `).join('');
  }
}

/* ---- Init principal --------------------------------------- */
async function init() {
  await renderModulePanels();

  initHeroAnimation();
  initProblemSection();
  initSolutionSection();
  initProcessSection();
  initModulesSection();
  initKPISection();
  initGrowthChart();
  initBenefitsSection();
  initClosingSection();
  initSectionRevealHeaders();
  initPhoneFloat();
  initLaptopBars();

  // Refresh ScrollTrigger después de render
  ScrollTrigger.refresh();
}

document.addEventListener('DOMContentLoaded', init);

// Refresh on resize
window.addEventListener('resize', window.BaumCore?.debounce(() => {
  ScrollTrigger.refresh();
  if (growthChart) growthChart.resize();
}, 300));

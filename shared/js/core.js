/* =============================================
   CORE.JS — Baumsystem Pitch Deck System
   Shared utilities: counters, video autoplay,
   progress bar, nav scroll, chart helpers
   ============================================= */

'use strict';

/* ---- 1. Progress Bar ---- */
const ProgressBar = {
  init() {
    const bar = document.querySelector('.progress-bar');
    if (!bar) return;

    const update = () => {
      const scrollTop = window.scrollY || window.pageYOffset;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docH > 0 ? (scrollTop / docH) * 100 : 0;
      bar.style.width = pct + '%';
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
  }
};

/* ---- 2. Nav Scroll Behaviour ---- */
const NavScroll = {
  init() {
    const nav = document.querySelector('.site-nav');
    if (!nav) return;

    const onScroll = () => {
      if (window.scrollY > 60) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
};

/* ---- 3. Animated Counter ---- */
const CounterAnimation = {
  /**
   * Animate a numeric counter using GSAP.
   * @param {HTMLElement} el - The target element.
   * @param {number} target - The final value.
   * @param {string} suffix - E.g. '+', '%', 'K'.
   * @param {number} duration - Animation duration in seconds.
   */
  animate(el, target, suffix = '', duration = 2) {
    if (!el || typeof gsap === 'undefined') return;

    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration,
      ease: 'power2.out',
      snap: { val: 1 },
      onUpdate() {
        el.textContent = Math.round(obj.val).toLocaleString('es-CL') + suffix;
      },
      onComplete() {
        el.textContent = target.toLocaleString('es-CL') + suffix;
      }
    });
  },

  /**
   * Set up all counter elements and trigger them on scroll.
   * Expects: data-counter="value" data-suffix="+" data-duration="2"
   */
  initAll() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    document.querySelectorAll('[data-counter]').forEach(el => {
      const target   = parseFloat(el.dataset.counter);
      const suffix   = el.dataset.suffix   || '';
      const duration = parseFloat(el.dataset.duration) || 2;
      let triggered  = false;

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        onEnter() {
          if (!triggered) {
            triggered = true;
            CounterAnimation.animate(el, target, suffix, duration);
          }
        }
      });
    });
  }
};

/* ---- 4. Video Autoplay via IntersectionObserver ---- */
const VideoAutoplay = {
  init() {
    const videos = document.querySelectorAll('.phone-mockup__screen video, [data-autoplay]');
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
      v.muted = true;
      v.loop  = true;
      v.playsInline = true;
      observer.observe(v);
    });
  },

  /**
   * Hover-play for card videos.
   */
  initHover() {
    document.querySelectorAll('[data-hover-play]').forEach(wrapper => {
      const video = wrapper.querySelector('video');
      if (!video) return;

      video.muted = true;
      video.loop  = true;
      video.playsInline = true;

      wrapper.addEventListener('mouseenter', () => video.play().catch(() => {}));
      wrapper.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
      });
    });
  }
};

/* ---- 5. Chart.js Helpers ---- */
const ChartHelper = {
  /**
   * Default chart theme aligned with base.css variables.
   */
  defaults: {
    colorPrimary:    '#1B4332',
    colorAccent:     '#52B788',
    colorAccentLight:'#74C69D',
    colorXlight:     '#D8F3DC',
    colorGrid:       'rgba(0,0,0,0.06)',
    fontFamily:      "'Inter', sans-serif",
  },

  /**
   * Apply global Chart.js defaults.
   */
  applyDefaults() {
    if (typeof Chart === 'undefined') return;

    Chart.defaults.font.family  = this.defaults.fontFamily;
    Chart.defaults.font.size    = 12;
    Chart.defaults.color        = '#8A9BA8';
    Chart.defaults.plugins.legend.display = false;
  },

  /**
   * Create an area/line growth chart.
   */
  createGrowthChart(canvas, labels, datasets) {
    if (typeof Chart === 'undefined' || !canvas) return null;

    return new Chart(canvas, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 20,
              font: { size: 12, family: this.defaults.fontFamily }
            }
          },
          tooltip: {
            backgroundColor: '#1B4332',
            titleColor: '#D8F3DC',
            bodyColor: '#A7D5BC',
            cornerRadius: 10,
            padding: 12,
          }
        },
        scales: {
          x: {
            grid: { color: this.defaults.colorGrid },
            ticks: { font: { size: 11 } }
          },
          y: {
            grid: { color: this.defaults.colorGrid },
            ticks: {
              font: { size: 11 },
              callback: v => v.toLocaleString('es-CL') + ' ha'
            }
          }
        },
        elements: {
          line: { tension: 0.4 },
          point: { radius: 4, hoverRadius: 6 }
        }
      }
    });
  },

  /**
   * Create a doughnut/pie chart.
   */
  createDoughnut(canvas, labels, data, colors) {
    if (typeof Chart === 'undefined' || !canvas) return null;

    return new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors || [
            this.defaults.colorPrimary,
            this.defaults.colorAccent,
            this.defaults.colorAccentLight,
            this.defaults.colorXlight,
          ],
          borderWidth: 2,
          borderColor: '#fff',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              padding: 16,
              usePointStyle: true,
              font: { size: 11, family: this.defaults.fontFamily }
            }
          }
        }
      }
    });
  }
};

/* ---- 6. Lazy init Chart on scroll ---- */
const LazyChart = {
  charts: [],

  register(canvasId, initFn) {
    if (typeof ScrollTrigger === 'undefined') {
      // Fallback: init immediately
      const el = document.getElementById(canvasId);
      if (el) initFn(el);
      return;
    }

    const el = document.getElementById(canvasId);
    if (!el) return;

    let created = false;
    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      onEnter() {
        if (!created) {
          created = true;
          const chart = initFn(el);
          if (chart) LazyChart.charts.push(chart);
        }
      }
    });
  }
};

/* ---- 7. Smooth scroll for anchor links ---- */
const SmoothScroll = {
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }
};

/* ---- 8. Mobile nav toggle ---- */
const MobileNav = {
  init() {
    const toggle = document.querySelector('.nav-toggle');
    const links  = document.querySelector('.nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.classList.toggle('active');
    });
  }
};

/* ---- 9. Stagger children on scroll ---- */
const StaggerReveal = {
  init() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    document.querySelectorAll('[data-stagger]').forEach(parent => {
      const children = parent.children;
      const delay    = parseFloat(parent.dataset.stagger) || 0.1;

      gsap.fromTo(Array.from(children),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: delay,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: parent,
            start: 'top 80%',
          }
        }
      );
    });
  }
};

/* ---- 10. Typewriter Effect ---- */
const Typewriter = {
  /**
   * @param {HTMLElement} el
   * @param {string[]} words
   * @param {number} speed ms per character
   */
  init(el, words, speed = 80) {
    if (!el || !words.length) return;

    let wordIdx = 0;
    let charIdx = 0;
    let deleting = false;

    const tick = () => {
      const current = words[wordIdx];
      if (deleting) {
        el.textContent = current.substring(0, charIdx--);
        if (charIdx < 0) {
          deleting = false;
          wordIdx  = (wordIdx + 1) % words.length;
          setTimeout(tick, 500);
          return;
        }
        setTimeout(tick, speed / 2);
      } else {
        el.textContent = current.substring(0, charIdx++);
        if (charIdx > current.length) {
          deleting = true;
          setTimeout(tick, 2000);
          return;
        }
        setTimeout(tick, speed);
      }
    };

    tick();
  }
};

/* ---- 11. Init all on DOMContentLoaded ---- */
document.addEventListener('DOMContentLoaded', () => {
  ProgressBar.init();
  NavScroll.init();
  SmoothScroll.init();
  MobileNav.init();
  VideoAutoplay.init();
  VideoAutoplay.initHover();

  // These need GSAP/ScrollTrigger — called after scripts load:
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    ChartHelper.applyDefaults();
    CounterAnimation.initAll();
    StaggerReveal.init();
  }
});

/* Export for use in main.js */
window.BaumCore = {
  ProgressBar,
  NavScroll,
  CounterAnimation,
  VideoAutoplay,
  ChartHelper,
  LazyChart,
  SmoothScroll,
  StaggerReveal,
  Typewriter,
};

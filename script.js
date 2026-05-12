/* ===============================================
   CREDITUZ — Landing Page Interactions
   - 30s loop countdown timer (visual)
   - Number counters on scroll
   - Reveal animations on scroll
   - ROI calculator with linked sliders + inputs
   - FAQ accordion: one open at a time
   =============================================== */

(function () {
  'use strict';

  /* -------- 30s Countdown Timer -------- */
  const timerEl = document.getElementById('timerSeconds');
  const progressEl = document.getElementById('timerProgress');

  if (timerEl && progressEl) {
    const TOTAL = 30;
    const circumference = 2 * Math.PI * 88; // ≈ 553
    progressEl.style.strokeDasharray = circumference;
    progressEl.style.strokeDashoffset = 0;

    let count = TOTAL;
    function tick() {
      timerEl.textContent = count;
      const offset = circumference * (1 - count / TOTAL);
      progressEl.style.strokeDashoffset = offset;

      if (count <= 0) {
        // reset loop
        setTimeout(() => {
          count = TOTAL;
          progressEl.style.transition = 'none';
          progressEl.style.strokeDashoffset = 0;
          requestAnimationFrame(() => {
            progressEl.style.transition = 'stroke-dashoffset 1s linear';
          });
        }, 1500);
      }
      count--;
    }
    tick();
    setInterval(tick, 1000);
  }

  /* -------- Number Counters (intersection observer) -------- */
  const counters = document.querySelectorAll('.counter');
  if (counters.length) {
    const animateCounter = (el) => {
      const target = parseInt(el.dataset.target, 10) || 0;
      if (target === 0) {
        el.textContent = '0';
        return;
      }
      const duration = 1600;
      const start = performance.now();
      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    };

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach((c) => obs.observe(c));
  }

  /* -------- Reveal animations on scroll -------- */
  const revealSelectors = [
    '.section-head',
    '.pain-card',
    '.agent-card',
    '.segment-card',
    '.result-card',
    '.faq-item',
    '.roi-wrapper',
    '.testimonial',
    '.final-card',
    '.flow-line'
  ];
  const revealEls = document.querySelectorAll(revealSelectors.join(','));
  revealEls.forEach((el) => el.classList.add('reveal'));

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // gentle stagger when multiple from same parent enter at once
        const delay = Math.min(i * 60, 240);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach((el) => revealObs.observe(el));

  /* -------- ROI Calculator -------- */
  const PLANO_TIME = 1290; // referência hipotética / mês

  const vendasMes = document.getElementById('vendasMes');
  const ticketMedio = document.getElementById('ticketMedio');
  const margem = document.getElementById('margem');

  const vendasMesRange = document.getElementById('vendasMesRange');
  const ticketMedioRange = document.getElementById('ticketMedioRange');
  const margemRange = document.getElementById('margemRange');

  const receitaAdd = document.getElementById('receitaAdd');
  const receitaAno = document.getElementById('receitaAno');
  const payback = document.getElementById('payback');

  const fmtBRL = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  function syncPair(numInput, rangeInput) {
    if (!numInput || !rangeInput) return;
    numInput.addEventListener('input', () => {
      rangeInput.value = numInput.value;
      updateROI();
    });
    rangeInput.addEventListener('input', () => {
      numInput.value = rangeInput.value;
      updateROI();
    });
  }

  function updateROI() {
    if (!vendasMes || !ticketMedio || !margem) return;
    const ticket = Number(ticketMedio.value) || 0;
    const m = (Number(margem.value) || 0) / 100;

    const ganhoPorVenda = ticket * m;
    const mensal = ganhoPorVenda; // 1 venda a mais por mês
    const anual = mensal * 12;
    const paybackVendas = ganhoPorVenda > 0
      ? Math.max(1, Math.ceil(PLANO_TIME / ganhoPorVenda))
      : 0;

    receitaAdd.textContent = fmtBRL.format(mensal);
    receitaAno.textContent = fmtBRL.format(anual);
    payback.textContent = paybackVendas === 1
      ? '1 venda'
      : paybackVendas + ' vendas';
  }

  syncPair(vendasMes, vendasMesRange);
  syncPair(ticketMedio, ticketMedioRange);
  syncPair(margem, margemRange);
  updateROI();

  /* -------- FAQ: one open at a time -------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach((other) => {
          if (other !== item && other.open) other.open = false;
        });
      }
    });
  });

  /* -------- Mobile menu (basic toggle if needed) -------- */
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  }
})();

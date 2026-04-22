/**
 * VoltchZ Brasil - Scripts de Interatividade
 */

// ──────────────────────────────────────────
//  LOGO AUTO-LOADER
// ──────────────────────────────────────────
(function () {
  const logoSrc = 'IMAGENS/logo.png';
  document.querySelectorAll('img[alt="VoltchZ Brasil"]').forEach(img => img.src = logoSrc);
})();

// ──────────────────────────────────────────
//  CLIENTS SLIDER JS
// ──────────────────────────────────────────
let currentClientSlide = 0;
const clientSlides = document.querySelectorAll('.client-slide');
const dotsContainer = document.querySelector('.client-slider-dots');
let clientTimer = null;

if (clientSlides.length > 0) {
  // Create dots dynamically
  clientSlides.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.className = 'client-slider-dot' + (idx === 0 ? ' active' : '');
    dot.addEventListener('click', () => { goToClientSlide(idx); resetClientTimer(); });
    dotsContainer.appendChild(dot);
  });

  const clientDots = document.querySelectorAll('.client-slider-dot');

  window.moveClientSlide = function (dir) {
    let next = currentClientSlide + dir;
    if (next >= clientSlides.length) next = 0;
    if (next < 0) next = clientSlides.length - 1;
    goToClientSlide(next);
    resetClientTimer();
  };

  window.goToClientSlide = function (idx) {
    clientSlides[currentClientSlide].classList.remove('active');
    if (clientDots[currentClientSlide]) clientDots[currentClientSlide].classList.remove('active');

    currentClientSlide = idx;

    clientSlides[currentClientSlide].classList.add('active');
    if (clientDots[currentClientSlide]) clientDots[currentClientSlide].classList.add('active');
  };

  function resetClientTimer() {
    clearInterval(clientTimer);
    clientTimer = setInterval(() => { moveClientSlide(1); }, 4000);
  }

  // Pause on hover
  const wrapper = document.getElementById('clients-slider');
  if (wrapper) {
    wrapper.addEventListener('mouseenter', () => clearInterval(clientTimer));
    wrapper.addEventListener('mouseleave', resetClientTimer);
  }

  resetClientTimer();
}

// ──────────────────────────────────────────
//  CAROUSEL (HERO)
// ──────────────────────────────────────────
(function () {
  const TOTAL = 3;
  let current = 0;
  let timer = null;
  const AUTOPLAY_DELAY = 6000;

  const heroSection = document.getElementById('hero-section');
  if (!heroSection) return;

  function goTo(idx) {
    const prevSlide = document.getElementById('slide-' + current);
    const prevDot = document.getElementById('dot-' + current);
    
    if (prevSlide) prevSlide.classList.remove('active');
    if (prevDot) {
      prevDot.classList.remove('active');
      prevDot.setAttribute('aria-selected', 'false');
    }

    current = (idx + TOTAL) % TOTAL;

    const nextSlide = document.getElementById('slide-' + current);
    const nextDot = document.getElementById('dot-' + current);

    if (nextSlide) nextSlide.classList.add('active');
    if (nextDot) {
      nextDot.classList.add('active');
      nextDot.setAttribute('aria-selected', 'true');
    }
  }

  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(() => goTo(current + 1), AUTOPLAY_DELAY);
  }
  function stopAutoplay() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); startAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); startAutoplay(); });

  for (let i = 0; i < TOTAL; i++) {
    const dot = document.getElementById('dot-' + i);
    if (dot) dot.addEventListener('click', () => { goTo(i); startAutoplay(); });
  }

  // Pause on hover
  heroSection.addEventListener('mouseenter', stopAutoplay);
  heroSection.addEventListener('mouseleave', startAutoplay);

  // Touch/swipe support
  let touchStartX = 0;
  heroSection.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; stopAutoplay(); }, { passive: true });
  heroSection.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) { goTo(dx < 0 ? current + 1 : current - 1); }
    startAutoplay();
  }, { passive: true });

  startAutoplay();
})();

// ──────────────────────────────────────────
//  NAV SCROLL & ACTIVE LINKS
// ──────────────────────────────────────────
const nav = document.getElementById('main-nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveLink();
  }, { passive: true });
}

function updateActiveLink() {
  const sections = ['servicos', 'o-que-faz', 'sobre', 'clientes', 'contato'];
  const links = document.querySelectorAll('#nav-links a');
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 100) current = id;
  });
  links.forEach(a => {
    const href = a.getAttribute('href').replace('#', '');
    a.classList.toggle('active', href === current);
  });
}

// ──────────────────────────────────────────
//  FAQ ACCORDION
// ──────────────────────────────────────────
window.toggleFaq = function (btn) {
  const item = btn.closest('.faq-item');
  const answer = item.querySelector('.faq-answer');
  const isOpen = item.classList.contains('open');
  
  document.querySelectorAll('.faq-item').forEach(i => {
    i.classList.remove('open');
    i.querySelector('.faq-answer').classList.remove('open');
    i.querySelector('button').setAttribute('aria-expanded', 'false');
  });

  if (!isOpen) {
    item.classList.add('open');
    answer.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }
};

// ──────────────────────────────────────────
//  COUNTER ANIMATION
// ──────────────────────────────────────────
function animateCounters() {
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    const prefix = el.dataset.prefix || '';
    const start = performance.now();
    const dur = 1800;
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.floor(eased * target);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

// ──────────────────────────────────────────
//  INTERSECTION OBSERVER (Fade-in & Counters)
// ──────────────────────────────────────────
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
      // Special logic for observers that trigger styles
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      io.unobserve(e.target);
    }
  });
}, { threshold: .12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.observe').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  io.observe(el);
});

// Counter trigger
const statsEl = document.querySelector('.stats-grid');
if (statsEl) {
  const counterIO = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { 
      animateCounters(); 
      counterIO.disconnect(); 
    }
  }, { threshold: .3 });
  counterIO.observe(statsEl);
}

// ──────────────────────────────────────────
//  SMOOTH SCROLL
// ──────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) { 
      e.preventDefault(); 
      target.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
    }
  });
});

// ──────────────────────────────────────────
//  MOBILE MENU TOGGLE
// ──────────────────────────────────────────
window.toggleMobileMenu = function() {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

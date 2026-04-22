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
//  CLIENTS SLIDER & LIGHTBOX
// ──────────────────────────────────────────
(function() {
  const clientImages = [
    'IMAGENS/CLIENTES/cliente-1.png',
    'IMAGENS/CLIENTES/cliente-2.png',
    'IMAGENS/CLIENTES/cliente-3.png'
  ];
  
  const slider = document.getElementById('clients-slider');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  let currentIdx = 0;
  let timer = null;

  if (slider) {
    // Inject slides
    clientImages.forEach((src, idx) => {
      const slide = document.createElement('div');
      slide.className = 'client-slide' + (idx === 0 ? ' active' : '');
      slide.style.backgroundImage = `url('${src}')`;
      slide.onclick = () => openLightbox(src);
      slider.appendChild(slide);
    });

    function nextSlide() {
      const slides = slider.querySelectorAll('.client-slide');
      slides[currentIdx].classList.remove('active');
      currentIdx = (currentIdx + 1) % slides.length;
      slides[currentIdx].classList.add('active');
    }

    function startTimer() {
      stopTimer();
      timer = setInterval(nextSlide, 4000);
    }

    function stopTimer() {
      if (timer) clearInterval(timer);
    }

    window.openLightbox = (src) => {
      stopTimer();
      lightboxImg.src = src;
      lightbox.classList.remove('hidden');
      lightbox.classList.add('flex');
    };

    window.closeLightbox = () => {
      lightbox.classList.add('hidden');
      lightbox.classList.remove('flex');
      startTimer();
    };

    startTimer();
  }

  // LOGOS
  const logos = [
    'IMAGENS/LOGOS-CLIENTES/logo-1.png',
    'IMAGENS/LOGOS-CLIENTES/logo-2.png',
    'IMAGENS/LOGOS-CLIENTES/logo-3.png'
  ];
  const logosContainer = document.getElementById('logos-container');
  if (logosContainer) {
    logos.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = 'Logo Cliente';
      img.className = 'h-12 w-auto object-contain';
      logosContainer.appendChild(img);
    });
  }
})();

// ──────────────────────────────────────────
//  CAROUSEL (HERO)
// ──────────────────────────────────────────
(function () {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  const TOTAL = slides.length;
  if (TOTAL === 0) return;

  let current = 0;
  let timer = null;
  const AUTOPLAY_DELAY = 6000;

  const heroSection = document.getElementById('hero-section');
  if (!heroSection) return;

  function goTo(idx) {
    const prevSlide = slides[current];
    const prevDot = dots[current];
    
    if (prevSlide) prevSlide.classList.remove('active');
    if (prevDot) {
      prevDot.classList.remove('active');
      prevDot.classList.remove('bg-white');
      prevDot.classList.add('bg-white/40');
      prevDot.setAttribute('aria-selected', 'false');
    }

    current = (idx + TOTAL) % TOTAL;

    const nextSlide = slides[current];
    const nextDot = dots[current];

    if (nextSlide) nextSlide.classList.add('active');
    if (nextDot) {
      nextDot.classList.add('active');
      nextDot.classList.add('bg-white');
      nextDot.classList.remove('bg-white/40');
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

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startAutoplay(); });
  });

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
//  NAV SCROLL & PROGRESS BAR
// ──────────────────────────────────────────
const nav = document.getElementById('main-nav');
const progressBar = document.getElementById('progress-bar');

if (nav) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    nav.classList.toggle('scrolled', scrollY > 40);
    updateActiveLink();
    
    // Progress Bar
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (progressBar) progressBar.style.width = scrolled + "%";
  }, { passive: true });
}

function updateActiveLink() {
  const sections = ['servicos', 'o-que-faz', 'clientes', 'sobre', 'contato'];
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
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      // Add slight delay for staggered feel if elements are near
      io.unobserve(e.target);
    }
  });
}, { threshold: .1, rootMargin: '0px 0px -50px 0px' });

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

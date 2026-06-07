/* ============================================
   مروة إمام — JavaScript
   Particles, Scroll Effects, Slider, Counter, FAQ
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initTestimonialsSlider();
  initHeroFloatingCards();
});

/* ============================================
   PARTICLE SYSTEM
   ============================================ */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.fadeDirection = Math.random() > 0.5 ? 1 : -1;
      this.color = Math.random() > 0.6
        ? 'rgba(200, 168, 110,' // gold
        : 'rgba(58, 171, 171,'; // teal
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.opacity += this.fadeDirection * 0.003;

      if (this.opacity <= 0.05 || this.opacity >= 0.6) {
        this.fadeDirection *= -1;
      }

      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.opacity + ')';
      ctx.fill();
    }
  }

  // Create particles
  const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(200, 168, 110, ${0.06 * (1 - distance / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connectParticles();
    animationId = requestAnimationFrame(animate);
  }

  animate();
}

/* ============================================
   NAVBAR
   ============================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });

  // Smooth scroll for nav links
  document.querySelectorAll('.navbar-links a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.offsetTop - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        
        // Close mobile menu
        document.getElementById('navLinks').classList.remove('active');
        document.getElementById('mobileMenuBtn').classList.remove('active');
      }
    });
  });
}

/* ============================================
   MOBILE MENU
   ============================================ */
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const links = document.getElementById('navLinks');

  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    links.classList.toggle('active');
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !links.contains(e.target)) {
      btn.classList.remove('active');
      links.classList.remove('active');
    }
  });
}

/* ============================================
   SCROLL REVEAL
   ============================================ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ============================================
   COUNTER ANIMATION
   ============================================ */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        counters.forEach(counter => {
          animateCounter(counter);
        });
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));

  // Also animate hero floating cards
  const heroCounters = document.querySelectorAll('.hero-floating-card .card-number');
  let heroAnimated = false;

  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !heroAnimated) {
        heroAnimated = true;
        heroCounters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'));
          animateNumber(counter, target);
        });
      }
    });
  }, { threshold: 0.5 });

  heroCounters.forEach(c => heroObserver.observe(c));
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'));
  const plusEl = element.querySelector('.plus');
  const plusText = plusEl ? plusEl.textContent : '';
  const duration = 2000;
  const start = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    const current = Math.floor(eased * target);

    if (plusEl) {
      if (element.textContent.indexOf('%') !== -1 || plusText === '%') {
        element.innerHTML = current + '<span class="plus">%</span>';
      } else {
        element.innerHTML = '<span class="plus">+</span>' + current;
      }
    } else {
      element.textContent = current;
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function animateNumber(element, target) {
  const duration = 2000;
  const start = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.floor(eased * target);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* ============================================
   TESTIMONIALS SLIDER
   ============================================ */
function initTestimonialsSlider() {
  const track = document.getElementById('testimonialsTrack');
  const dotsContainer = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const total = cards.length;
  let current = 0;
  let autoSlideInterval;

  // Create dots
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('button');
    dot.classList.add('slider-dot');
    dot.setAttribute('aria-label', `الشهادة ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }

  function goTo(index) {
    current = index;
    // RTL: use positive translateX
    track.style.transform = `translateX(${current * 100}%)`;
    updateDots();
  }

  function updateDots() {
    document.querySelectorAll('.slider-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  function next() {
    current = (current + 1) % total;
    goTo(current);
  }

  function prev() {
    current = (current - 1 + total) % total;
    goTo(current);
  }

  nextBtn.addEventListener('click', () => {
    next();
    resetAutoSlide();
  });

  prevBtn.addEventListener('click', () => {
    prev();
    resetAutoSlide();
  });

  // Auto slide
  function startAutoSlide() {
    autoSlideInterval = setInterval(next, 5000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  startAutoSlide();

  // Touch/Swipe support
  let startX = 0;
  let isDragging = false;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  track.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    const diff = startX - e.changedTouches[0].clientX;
    // RTL: swipe directions are reversed
    if (Math.abs(diff) > 50) {
      if (diff < 0) {
        next();
      } else {
        prev();
      }
      resetAutoSlide();
    }
    isDragging = false;
  });
}

/* ============================================
   HERO FLOATING CARDS ANIMATION
   ============================================ */
function initHeroFloatingCards() {
  // Already animated via CSS, but we add parallax on mouse move
  const hero = document.querySelector('.hero');
  const cards = document.querySelectorAll('.hero-floating-card');

  if (!hero || cards.length === 0) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    cards.forEach((card, i) => {
      const factor = (i + 1) * 15;
      card.style.transform = `translateY(${Math.sin(Date.now() / 1000) * 15}px) translate(${x * factor}px, ${y * factor}px)`;
    });
  });

  hero.addEventListener('mouseleave', () => {
    cards.forEach(card => {
      card.style.transform = '';
    });
  });
}

/* ============================================
   FAQ ACCORDION
   ============================================ */
function toggleFaq(element) {
  const item = element.parentElement;
  const answer = item.querySelector('.faq-answer');
  const isActive = item.classList.contains('active');

  // Close all other FAQs
  document.querySelectorAll('.faq-item.active').forEach(faq => {
    faq.classList.remove('active');
    faq.querySelector('.faq-answer').style.maxHeight = '0';
  });

  if (!isActive) {
    item.classList.add('active');
    answer.style.maxHeight = answer.scrollHeight + 'px';
  }
}

/* ============================================
   CONTACT FORM
   ============================================ */
function handleFormSubmit(event) {
  event.preventDefault();
  
  const btn = document.getElementById('submitBtn');
  const originalText = btn.textContent;
  
  btn.textContent = 'جاري الإرسال...';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  // Simulate sending
  setTimeout(() => {
    btn.textContent = 'تم الإرسال بنجاح ✓';
    btn.style.background = 'linear-gradient(135deg, #31A24C, #25862F)';
    
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
      btn.style.opacity = '1';
      btn.style.background = '';
      document.getElementById('contactForm').reset();
    }, 3000);
  }, 1500);
}

/* ============================================
   SMOOTH ANIMATIONS ON LOAD
   ============================================ */
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

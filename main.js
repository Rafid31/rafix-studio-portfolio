/* ============================================================
   RAFID PORTFOLIO — main.js
   GSAP Animations | Custom Cursor | Scroll Reveal | Filters
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. PAGE LOADER
  ---------------------------------------------------------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => {
        loader.style.display = 'none';
        initHeroAnimation();
      }, 500);
    }, 2000);
  });

  /* ----------------------------------------------------------
     2. CUSTOM CURSOR
  ---------------------------------------------------------- */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Cursor scale on hoverable elements
  const hoverTargets = document.querySelectorAll(
    'a, button, .project-card, .bento-card, .tool-item, .filter-btn, input, textarea'
  );
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
      follower.style.width  = '60px';
      follower.style.height = '60px';
      follower.style.opacity = '0.3';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      follower.style.width  = '36px';
      follower.style.height = '36px';
      follower.style.opacity = '0.6';
    });
  });

  /* ----------------------------------------------------------
     3. NAVBAR SCROLL BEHAVIOUR
  ---------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  /* ----------------------------------------------------------
     4. MOBILE HAMBURGER MENU
  ---------------------------------------------------------- */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  // Close on link click
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  /* ----------------------------------------------------------
     5. SMOOTH SCROLL FOR NAV LINKS
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ----------------------------------------------------------
     6. ACTIVE NAV LINK ON SCROLL
  ---------------------------------------------------------- */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  /* ----------------------------------------------------------
     7. HERO GSAP ANIMATION
  ---------------------------------------------------------- */
  function initHeroAnimation() {
    if (typeof gsap === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl
      .from('.hero-greeting',  { y: 40, opacity: 0, duration: 0.7 })
      .from('.hero-name',      { y: 60, opacity: 0, duration: 0.8 }, '-=0.4')
      .from('.hero-title',     { y: 40, opacity: 0, duration: 0.7 }, '-=0.4')
      .from('.hero-desc',      { y: 30, opacity: 0, duration: 0.6 }, '-=0.3')
      .from('.hero-actions',   { y: 30, opacity: 0, duration: 0.6 }, '-=0.3')
      .from('.hero-socials',   { y: 20, opacity: 0, duration: 0.5 }, '-=0.3')
      .from('.hero-visual',    { x: 60, opacity: 0, duration: 0.9 }, '-=0.8')
      .from('.hero-floating-card', { scale: 0.8, opacity: 0, duration: 0.5, stagger: 0.2 }, '-=0.4')
      .from('.hero-scroll-hint',   { opacity: 0, duration: 0.5 }, '-=0.2');
  }

  /* ----------------------------------------------------------
     8. SCROLL REVEAL (Intersection Observer fallback)
  ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll(
    '.section-label, .section-title, .about-text, .about-bento, ' +
    '.skill-category, .tool-item, .project-card, .timeline-item, ' +
    '.contact-info, .contact-form, .bento-card'
  );

  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ----------------------------------------------------------
     9. SKILL BAR ANIMATION
  ---------------------------------------------------------- */
  const skillBars = document.querySelectorAll('.skill-bar-fill');

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.getAttribute('data-width');
        entry.target.style.width = width + '%';
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  skillBars.forEach(bar => barObserver.observe(bar));

  /* ----------------------------------------------------------
     10. PROJECT FILTER
  ---------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ----------------------------------------------------------
     11. CONTACT FORM HANDLER
  ---------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      btn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
      btn.disabled = true;

      // Simulate send (replace with EmailJS or Formspree later)
      setTimeout(() => {
        btn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
        btn.disabled = false;
        formSuccess.classList.add('show');
        contactForm.reset();
        setTimeout(() => formSuccess.classList.remove('show'), 5000);
      }, 1800);
    });
  }

  /* ----------------------------------------------------------
     12. GSAP SCROLL TRIGGERS (if GSAP loaded)
  ---------------------------------------------------------- */
  window.addEventListener('load', () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // Section titles
    gsap.utils.toArray('.section-title').forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
        y: 50, opacity: 0, duration: 0.8, ease: 'power3.out'
      });
    });

    // Bento cards stagger
    gsap.from('.bento-card', {
      scrollTrigger: { trigger: '.about-bento', start: 'top 80%' },
      y: 40, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out'
    });

    // Tool items stagger
    gsap.from('.tool-item', {
      scrollTrigger: { trigger: '.tools-grid', start: 'top 85%' },
      y: 30, opacity: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out'
    });

    // Project cards stagger
    gsap.from('.project-card', {
      scrollTrigger: { trigger: '.projects-grid', start: 'top 80%' },
      y: 50, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out'
    });

    // Timeline items
    gsap.from('.timeline-item', {
      scrollTrigger: { trigger: '.timeline-grid', start: 'top 80%' },
      x: -30, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out'
    });
  });

});

/* --- Fade-in keyframe for filter --- */
const styleEl = document.createElement('style');
styleEl.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .nav-link.active { color: #F5F5F5 !important; }
  .nav-link.active::after { width: 100% !important; }
`;
document.head.appendChild(styleEl);

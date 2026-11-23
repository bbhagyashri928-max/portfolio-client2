/**
 * ==========================================================================
 * PRINCIPAL PORTFOLIO - MR. MANOJ L. DESHMUKH
 * Core Interactive Script: Counters, Testimonials Slider, Lightbox, Contact
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMilestoneCounters();
  initTestimonialSlider();
  initAchievementsLightbox();
  initContactForm();
  initBackToTop();
});

/* ==========================================================================
   1. NAVBAR & MOBILE NAVIGATION
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.site-navbar');
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const navMenuWrapper = document.querySelector('.nav-menu-wrapper');
  const navBackdrop = document.getElementById('nav-backdrop');
  const navLinks = document.querySelectorAll('.nav-item-link');
  const getInTouchBtn = document.querySelector('.nav-contact-beside-btn');

  function openMenu() {
    navMenuWrapper?.classList.add('mobile-show');
    toggleBtn?.classList.add('is-active');
    toggleBtn?.setAttribute('aria-expanded', 'true');
    navBackdrop?.classList.add('active');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    navMenuWrapper?.classList.remove('mobile-show');
    toggleBtn?.classList.remove('is-active');
    toggleBtn?.setAttribute('aria-expanded', 'false');
    navBackdrop?.classList.remove('active');
    document.body.classList.remove('menu-open');
  }

  if (toggleBtn && navMenuWrapper) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navMenuWrapper.classList.contains('mobile-show')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navBackdrop?.addEventListener('click', closeMenu);

    navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    getInTouchBtn?.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenuWrapper.classList.contains('mobile-show')) {
        closeMenu();
      }
    });
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Scrollspy active link
    const scrollPos = window.scrollY + 120;
    const sections = document.querySelectorAll('section[id]');

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   2. ANIMATED MILESTONE COUNTERS
   ========================================================================== */
function initMilestoneCounters() {
  const counterElements = document.querySelectorAll('.stat-counter-number[data-target]');
  let started = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        counterElements.forEach(el => {
          const target = parseInt(el.getAttribute('data-target'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          const duration = 2000;
          const startTime = performance.now();

          function step(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const easeVal = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeVal * target);

            el.textContent = `${currentVal}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              el.textContent = `${target}${suffix}`;
            }
          }

          requestAnimationFrame(step);
        });
      }
    });
  }, { threshold: 0.3 });

  const milestonesSection = document.getElementById('milestones');
  if (milestonesSection) {
    observer.observe(milestonesSection);
  }
}

/* ==========================================================================
   3. TESTIMONIALS SLIDER
   ========================================================================== */
function initTestimonialSlider() {
  const prevBtn = document.getElementById('prev-testimonial');
  const nextBtn = document.getElementById('next-testimonial');
  const dots = document.querySelectorAll('.pagination-dot');
  const cards = document.querySelectorAll('.testimonial-single-card');
  let currentIndex = 0;

  function updateSlider(index) {
    currentIndex = (index + cards.length) % cards.length;
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === currentIndex);
    });

    if (window.innerWidth <= 950) {
      cards.forEach((c, i) => {
        c.style.display = i === currentIndex ? 'flex' : 'none';
      });
    } else {
      cards.forEach(c => c.style.display = 'flex');
    }
  }

  prevBtn?.addEventListener('click', () => {
    updateSlider(currentIndex - 1);
  });

  nextBtn?.addEventListener('click', () => {
    updateSlider(currentIndex + 1);
  });

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      updateSlider(idx);
    });
  });

  window.addEventListener('resize', () => {
    updateSlider(currentIndex);
  });

  // Touch swipe gesture support for mobile devices
  const sliderContainer = document.querySelector('.testimonials-cards-row');
  let touchStartX = 0;
  let touchEndX = 0;

  sliderContainer?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  sliderContainer?.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        updateSlider(currentIndex + 1); // Swiped left -> next
      } else {
        updateSlider(currentIndex - 1); // Swiped right -> prev
      }
    }
  }, { passive: true });

  updateSlider(0);
}

/* ==========================================================================
   4. ACHIEVEMENTS LIGHTBOX MODAL
   ========================================================================== */
function initAchievementsLightbox() {
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const closeBtn = document.getElementById('close-lightbox');
  const cards = document.querySelectorAll('.achievement-card-item');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img')?.getAttribute('src');
      const title = card.getAttribute('data-title') || card.querySelector('.achievement-caption-title')?.textContent;
      const desc = card.getAttribute('data-desc') || "Achievement at Government B.Sc. Nursing College, Jalna.";

      if (lightboxImg) lightboxImg.src = img;
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxDesc) lightboxDesc.textContent = desc;

      lightbox?.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox?.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

/* ==========================================================================
   5. CONTACT FORM HANDLER
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const alertBox = document.getElementById('form-status-alert');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending Message...</span>`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        if (alertBox) {
          alertBox.classList.add('active-success');
          alertBox.innerHTML = `
            <strong>Thank You!</strong> Your message has been received by the Secretariat of Mr. Manoj L. Deshmukh. Our office will respond promptly.
          `;
          form.reset();

          setTimeout(() => {
            alertBox.classList.remove('active-success');
            alertBox.style.display = 'none';
          }, 6000);
        }
      }, 1000);
    });
  }
}

/* ==========================================================================
   6. FLOATING SCROLL-TO-TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
  });

  // Add some playful animations for game items
  const gameItems = document.querySelectorAll('.game-item');
  gameItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
  });

  /* Lightweight Featured Slider */
  const featuredSlider = document.querySelector('.featured-slider');
  if (featuredSlider) {
    const track = featuredSlider.querySelector('.slider-track');
    const slides = Array.from(track.querySelectorAll('.featured-card'));
    const prev = featuredSlider.querySelector('.slider-prev');
    const next = featuredSlider.querySelector('.slider-next');
    const dotsContainer = featuredSlider.querySelector('.slider-dots');
    let current = 0;
    const total = slides.length;
    const positions = slides.map(slide => slide.offsetLeft);

    function update() {
      const offsetLeft = positions[current];
      const gapAdjustment = window.innerHeight > window.innerWidth ? 0 : 8; // no gap in portrait
      track.scrollTo({ left: offsetLeft - gapAdjustment, behavior: 'smooth' });
      // update dots
      if (dotsContainer) {
        dotsContainer.querySelectorAll('button').forEach((b, i) => {
          b.style.background = i === current ? 'var(--primary-color)' : 'rgba(0,0,0,0.2)';
        });
      }
    }

    // create dots
    if (dotsContainer) {
      slides.forEach((s, i) => {
        const b = document.createElement('button');
        b.addEventListener('click', () => { current = i; update(); });
        dotsContainer.appendChild(b);
      });
    }

    prev && prev.addEventListener('click', () => { current = (current - 1 + total) % total; update(); });
    next && next.addEventListener('click', () => { current = (current + 1) % total; update(); });

    // keyboard support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { current = (current - 1 + total) % total; update(); }
      if (e.key === 'ArrowRight') { current = (current + 1) % total; update(); }
    });

    // autoplay (default on if attribute is missing)
    const autoplay = featuredSlider.dataset.autoplay === undefined ? true : featuredSlider.dataset.autoplay === 'true';
    const interval = parseInt(featuredSlider.dataset.interval, 10) || 4000;
    if (autoplay && total > 1) {
      setInterval(() => { current = (current + 1) % total; update(); }, interval);
    }

    // initial update
    update();
  }
});

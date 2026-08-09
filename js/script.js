// ============ Nav scroll state ============
const nav = document.querySelector('.nav');
const onScroll = () => {
  if (!nav) return;
  nav.classList.toggle('scrolled', window.scrollY > 40);
};
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ============ Hero title: split into letters that "load" like plates ============
function splitHeroTitle() {
  document.querySelectorAll('.hero__title .line').forEach((line, lineIndex) => {
    const text = line.textContent;
    line.textContent = '';
    let charDelay = lineIndex * 0.35; // stagger between lines
    const words = text.split(' ');
    words.forEach((word, wIndex) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'word';
      [...word].forEach((ch) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = ch;
        span.style.animationDelay = `${0.15 + charDelay}s`;
        charDelay += 0.045;
        wordSpan.appendChild(span);
      });
      line.appendChild(wordSpan);
      if (wIndex < words.length - 1) charDelay += 0.02;
    });
  });
}
splitHeroTitle();

// ============ Scroll reveal ============
const revealEls = document.querySelectorAll('.reveal, .reveal-stagger, .tl-item');
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
);
revealEls.forEach((el) => io.observe(el));

// ============ Animated stat counters ============
const counters = document.querySelectorAll('[data-count]');
const countIo = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const decimals = el.dataset.count.includes('.') ? 1 : 0;
      const duration = 1400;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = target * eased;
        el.textContent = (decimals ? val.toFixed(1) : Math.round(val)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      countIo.unobserve(el);
    });
  },
  { threshold: 0.4 }
);
counters.forEach((el) => countIo.observe(el));

// ============ Subtle parallax on banner images ============
const banners = document.querySelectorAll('.banner img, .hero__bg img');
document.addEventListener(
  'scroll',
  () => {
    banners.forEach((img) => {
      const rect = img.parentElement.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const shift = (progress - 0.5) * 40;
      img.style.transform = `scale(1.06) translateY(${shift}px)`;
    });
  },
  { passive: true }
);

// ============ Hero cursor glow ============
const heroGlow = document.querySelector('.hero__glow');
const heroEl = document.querySelector('.hero');
if (heroGlow && heroEl) {
  heroEl.addEventListener('pointermove', (e) => {
    const rect = heroEl.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    heroGlow.style.setProperty('--gx', `${x}%`);
    heroGlow.style.setProperty('--gy', `${y}%`);
  });
}

// ============ Pin-panel stat highlight on scroll ============
const pinStats = document.querySelectorAll('.pin-panel__stat');
if (pinStats.length) {
  const pinIo = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting);
      });
    },
    { threshold: 0.5 }
  );
  pinStats.forEach((el) => pinIo.observe(el));
}

// ============ Mark active nav link ============
const path = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__links a').forEach((a) => {
  const href = a.getAttribute('href');
  if (href === path || (path === '' && href === 'index.html')) {
    a.classList.add('is-active');
  }
});

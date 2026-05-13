// ── Navigation ──────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
  });
}

// Highlight active nav link
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.href === location.href || location.pathname.endsWith(a.getAttribute('href'))) {
    a.classList.add('active');
  }
});

// ── Language Dropdown ────────────────────────────────────────
const langDropdown = document.getElementById('langDropdown');
if (langDropdown) {
  const langBtn = langDropdown.querySelector('.lang-btn');
  langBtn.addEventListener('click', e => {
    e.stopPropagation();
    langDropdown.classList.toggle('open');
  });
  document.addEventListener('click', () => langDropdown.classList.remove('open'));
}

// ── FAQ Accordion ────────────────────────────────────────────
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ── Scroll to top ────────────────────────────────────────────
const scrollBtn = document.getElementById('scrollTop');
if (scrollBtn) {
  window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('visible', window.scrollY > 400);
  });
  scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ── OS Tab switcher ──────────────────────────────────────────
document.querySelectorAll('.os-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const group = tab.closest('.os-tabs-wrap') || tab.parentElement.parentElement;
    group.querySelectorAll('.os-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const target = tab.dataset.target;
    group.querySelectorAll('.os-panel').forEach(p => {
      p.style.display = p.id === target ? 'block' : 'none';
    });
  });
});

// ── Animate lang bars ────────────────────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.lang-row-fill').forEach(bar => {
        bar.style.width = bar.dataset.width;
      });
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.lang-progress').forEach(el => {
  el.querySelectorAll('.lang-row-fill').forEach(bar => bar.style.width = '0');
  observer.observe(el);
});

// ── Smooth reveal on scroll ──────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('revealed'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

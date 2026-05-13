// ==========================================
// 7-Zip Data Forge - Interactions & i18n
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initI18n();
  initNavbar();
  init3DTilt();
  initVisualizer();
  initFormatCarousel();
  initScrollAnimations();
});

// --- 1. Internationalization (i18n) Engine ---
function initI18n() {
  const supportedLangs = ['en', 'zh-CN', 'zh-TW', 'fr', 'de', 'hi', 'ja', 'pt-BR', 'es', 'th', 'vi', 'eo', 'bn'];
  const langDropdown = document.getElementById('langDropdown');
  const langBtns = document.querySelectorAll('.lang-menu button');
  const activeLangDisplay = document.getElementById('activeLang');
  
  // Detect or load saved language
  let currentLang = localStorage.getItem('7zip_lang');
  
  if (!currentLang) {
    // Auto-detect from browser
    const browserLang = navigator.language || navigator.userLanguage;
    const shortLang = browserLang.split('-')[0];
    
    if (supportedLangs.includes(browserLang)) {
      currentLang = browserLang;
    } else if (supportedLangs.includes(shortLang)) {
      currentLang = shortLang;
    } else {
      currentLang = 'en'; // Fallback
    }
  }

  setLanguage(currentLang);

  // Setup click handlers for language menu
  langBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetLang = e.currentTarget.getAttribute('data-lang');
      setLanguage(targetLang);
      
      // Close menu (handled by CSS hover, but good for mobile/click)
      const menu = document.querySelector('.lang-menu');
      menu.style.display = 'none';
      setTimeout(() => menu.style.display = '', 100);
    });
  });

  function setLanguage(lang) {
    if (!translations[lang]) lang = 'en'; // Safe fallback
    
    localStorage.setItem('7zip_lang', lang);
    document.documentElement.lang = lang;
    
    // Update active state in menu
    langBtns.forEach(b => b.classList.remove('active'));
    const activeBtn = document.querySelector(`.lang-menu button[data-lang="${lang}"]`);
    if(activeBtn) {
      activeBtn.classList.add('active');
      if(activeLangDisplay) activeLangDisplay.textContent = activeBtn.textContent;
    }
    
    // Walk DOM and replace text
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang][key]) {
        if (el.tagName === 'INPUT' && el.type === 'placeholder') {
          el.placeholder = translations[lang][key];
        } else {
          el.textContent = translations[lang][key];
        }
      } else if (translations['en'][key]) {
        // Fallback to English if key missing in translation
        el.textContent = translations['en'][key];
      }
    });
  }
}

// --- 2. Floating Navbar ---
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('compact');
    } else {
      navbar.classList.remove('compact');
    }
  });

  // Mobile Menu Toggle
  const navLinks = document.querySelector('.nav-links');
  if (navbar && navLinks) {
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'menu-toggle';
    toggleBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
    navbar.insertBefore(toggleBtn, navLinks);

    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }
}

// --- 3. 3D Card Tilt Effect ---
function init3DTilt() {
  // Respect prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = document.querySelectorAll('.bento-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element
      const y = e.clientY - rect.top;  // y position within the element
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Max rotation is 5 degrees
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      
      card.style.transform = `translateZ(10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = `translateZ(0) rotateX(0) rotateY(0)`;
      // Smooth reset handled by CSS transition
    });
  });
}

// --- 4. Compression Visualizer ---
function initVisualizer() {
  const compBar = document.getElementById('visCompBar');
  const valOut = document.getElementById('visValOut');
  if(!compBar) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        // Delay slightly for effect
        setTimeout(() => {
          compBar.classList.add('animate');
          // Animate the number counting down
          let start = 100;
          const target = 28;
          const duration = 2000;
          const startTime = performance.now();
          
          function updateNum(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            const currentVal = Math.floor(start - (start - target) * easeProgress);
            valOut.textContent = currentVal + 'MB';
            
            if (progress < 1) {
              requestAnimationFrame(updateNum);
            }
          }
          requestAnimationFrame(updateNum);
        }, 500);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  observer.observe(compBar);
}

// --- 5. Format Carousel Drag-to-Scroll ---
function initFormatCarousel() {
  const slider = document.querySelector('.format-strip');
  if(!slider) return;
  
  let isDown = false;
  let startX;
  let scrollLeft;

  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.style.cursor = 'grabbing';
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });
  slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.style.cursor = 'grab';
  });
  slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.style.cursor = 'grab';
  });
  slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2; // Scroll-fast
    slider.scrollLeft = scrollLeft - walk;
  });
}

// --- 6. Scroll Animations (Counters) ---
function initScrollAnimations() {
  const counters = document.querySelectorAll('.count-up');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out expo
          const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          
          entry.target.textContent = Math.floor(target * easeProgress);
          
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            entry.target.textContent = target; // Ensure exact finish
          }
        }
        
        requestAnimationFrame(updateCounter);
        observer.unobserve(entry.target);
      }
    });
  });
  
  counters.forEach(c => observer.observe(c));
}

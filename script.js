/* ========== SNOW ========== */

const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
let flakes = [];
let animFrame;

function resizeCanvas() {
  const hero = document.querySelector(".hero");
  canvas.width = hero.offsetWidth;
  canvas.height = hero.offsetHeight;
}

class Snowflake {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 4 + 1;
    this.speedY = Math.random() * 0.8 + 0.3;
    this.speedX = Math.random() * 0.3 - 0.15;
    this.opacity = Math.random() * 0.6 + 0.2;
    this.swing = Math.random() * 2;
    this.swingSpeed = Math.random() * 0.02 + 0.005;
    this.angle = Math.random() * Math.PI * 2;
  }

  update() {
    this.angle += this.swingSpeed;
    this.x += this.speedX + Math.sin(this.angle) * this.swing;
    this.y += this.speedY;

    if (this.y > canvas.height + 10) {
      this.y = -10;
      this.x = Math.random() * canvas.width;
    }
    if (this.x < -10 || this.x > canvas.width + 10) {
      this.x = Math.random() * canvas.width;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.fill();
  }
}

function initSnow() {
  flakes = [];
  const count = Math.min(120, Math.floor((canvas.width * canvas.height) / 10000));
  for (let i = 0; i < count; i++) {
    flakes.push(new Snowflake());
  }
}

function animateSnow() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  flakes.forEach((f) => {
    f.update();
    f.draw();
  });
  animFrame = requestAnimationFrame(animateSnow);
}

function startSnow() {
  resizeCanvas();
  initSnow();
  animateSnow();
}

startSnow();

window.addEventListener("resize", () => {
  resizeCanvas();
  initSnow();
});

/* ========== NAVBAR ========== */

const navbar = document.getElementById("navbar");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const navAnchors = navLinks.querySelectorAll("a");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});

navToggle.addEventListener("click", () => {
  navToggle.classList.toggle("active");
  navLinks.classList.toggle("open");
});

navAnchors.forEach((link) => {
  link.addEventListener("click", () => {
    navToggle.classList.remove("active");
    navLinks.classList.remove("open");
  });
});

/* ========== LUCIDE ICONS ========== */

function initLucide() {
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

initLucide();

/* ========== THEME TOGGLE ========== */

const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle.querySelector("i[data-lucide]");

function setTheme(theme) {
  document.body.classList.toggle("light", theme === "light");
  themeIcon.setAttribute("data-lucide", theme === "light" ? "sun" : "moon");
  localStorage.setItem("theme", theme);
  if (typeof lucide !== "undefined") lucide.createIcons();
}

initLucide();

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") setTheme("light");

themeToggle.addEventListener("click", () => {
  const isLight = document.body.classList.contains("light");
  setTheme(isLight ? "dark" : "light");
});

/* ========== KONAMI CODE ========== */

const konami = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
let konamiIdx = 0;

document.addEventListener("keydown", (e) => {
  if (e.key === konami[konamiIdx]) {
    konamiIdx++;
    if (konamiIdx === konami.length) {
      document.body.classList.add("konami-active");
      setTimeout(() => document.body.classList.remove("konami-active"), 4000);
      konamiIdx = 0;
    }
  } else {
    konamiIdx = 0;
  }
});

/* ========== RESUME TOGGLE & PDF.JS ========== */

const toggleBtn = document.getElementById("toggleResume");
const resumePreview = document.getElementById("resumePreview");

if (toggleBtn && resumePreview) {
  toggleBtn.addEventListener("click", () => {
    const isHidden = resumePreview.classList.toggle("hidden");
    toggleBtn.textContent = isHidden ? "Show Resume" : "Hide Resume";
  });
}

if (typeof pdfjsLib !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  const canvas = document.getElementById("pdfCanvas");
  const ctx = canvas.getContext("2d");
  const prevBtn = document.getElementById("pdfPrev");
  const nextBtn = document.getElementById("pdfNext");
  const curSpan = document.getElementById("pdfCurrent");
  const totalSpan = document.getElementById("pdfTotal");
  let pdfDoc = null, pageNum = 1;

  function renderPage(num) {
    pdfDoc.getPage(num).then(page => {
      const vp = page.getViewport({ scale: 1.5 });
      canvas.width = vp.width;
      canvas.height = vp.height;
      page.render({ canvasContext: ctx, viewport: vp });
      curSpan.textContent = num;
      prevBtn.disabled = num <= 1;
      nextBtn.disabled = num >= pdfDoc.numPages;
    });
  }

  pdfjsLib.getDocument("resume.pdf").promise.then(doc => {
    pdfDoc = doc;
    totalSpan.textContent = doc.numPages;
    renderPage(1);
  });

  prevBtn.addEventListener("click", () => { if (pageNum > 1) { pageNum--; renderPage(pageNum); } });
  nextBtn.addEventListener("click", () => { if (pageNum < pdfDoc.numPages) { pageNum++; renderPage(pageNum); } });
}

/* ========== HERO TEXT SCRAMBLE ANIMATION ========== */

(function() {
  const hero = document.getElementById("home");
  const heroTitle = document.querySelector(".hero-title");
  const heroSubtitle = document.querySelector(".hero-subtitle");
  const titleHTML = heroTitle.innerHTML;
  const subtitleHTML = heroSubtitle.innerHTML;
  const titleText = heroTitle.textContent;
  const subtitleText = heroSubtitle.textContent;
  const chars = "!<>-_\\/[]{}—=+*^?#________";
  let busy = false;

  function doScramble(el, text, cb) {
    const len = text.length;
    el.textContent = "";
    const spans = [];
    for (let i = 0; i < len; i++) {
      const s = document.createElement("span");
      s.className = "scramble-char";
      s.textContent = chars[Math.floor(Math.random() * chars.length)];
      el.appendChild(s);
      spans.push(s);
    }
    let pos = 0;
    function reveal() {
      if (pos >= len) { if (cb) cb(); return; }
      spans[pos].textContent = text[pos];
      pos++;
      setTimeout(reveal, 50);
    }
    let flickers = 0;
    const flicker = setInterval(() => {
      spans.forEach(s => {
        s.textContent = chars[Math.floor(Math.random() * chars.length)];
      });
      flickers++;
      if (flickers > 8) {
        clearInterval(flicker);
        reveal();
      }
    }, 60);
  }

  function resetText() {
    heroTitle.innerHTML = titleHTML;
    heroSubtitle.innerHTML = subtitleHTML;
    heroTitle.style.height = "";
    heroSubtitle.style.height = "";
  }

  function playScramble() {
    if (busy) return;
    busy = true;
    heroTitle.style.height = heroTitle.offsetHeight + "px";
    heroSubtitle.style.height = heroSubtitle.offsetHeight + "px";
    heroTitle.classList.add("anim-scramble");
    heroSubtitle.classList.add("anim-scramble");
    doScramble(heroTitle, titleText, () => {
      heroTitle.innerHTML = titleHTML;
      setTimeout(() => {
        heroSubtitle.classList.add("anim-scramble");
        doScramble(heroSubtitle, subtitleText, () => {
          heroSubtitle.innerHTML = subtitleHTML;
          busy = false;
        });
      }, 400);
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        resetText();
        playScramble();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(hero);
})();

/* ========== TIMELINE SCROLL ANIMATION ========== */

(function() {
  const timeline = document.querySelector(".timeline");
  if (!timeline) return;
  const items = timeline.querySelectorAll(".timeline-item");

  const fill = document.createElement("div");
  fill.className = "timeline-fill";
  timeline.appendChild(fill);

  function updateLine() {
    const rect = timeline.getBoundingClientRect();
    const vh = window.innerHeight;
    const totalH = rect.bottom - rect.top;
    const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + totalH)));
    timeline.style.setProperty("--line-height", (progress * 100) + "%");
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: "0px 0px -40px 0px" });

  items.forEach(item => obs.observe(item));

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateLine();
        ticking = false;
      });
      ticking = true;
    }
  });
  updateLine();
})();

/* ── Send Message ── */
(function() {
  const form = document.getElementById('contactForm');
  const btn = document.getElementById('sendBtn');
  const status = document.getElementById('formStatus');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      status.textContent = 'Please fill in all fields.';
      status.className = 'form-status error';
      return;
    }

    btn.classList.add('loading');
    btn.querySelector('span').textContent = 'Sending...';
    status.textContent = '';
    status.className = 'form-status';

    const formData = new URLSearchParams();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);

    try {
      const res = await fetch('https://formspree.io/f/xnjkwlgk', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        status.textContent = 'Message sent successfully! I\'ll get back to you soon.';
        status.className = 'form-status success';
        form.reset();
      } else {
        status.textContent = 'Something went wrong. Please try again or email me directly.';
        status.className = 'form-status error';
      }
    } catch {
      window.location.href = `mailto:pramitdatta725@gmail.com?subject=Portfolio Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0A%0AFrom: ${encodeURIComponent(email)}`;
      status.textContent = 'Redirecting to your email client...';
      status.className = 'form-status success';
    }

    btn.classList.remove('loading');
    btn.querySelector('span').textContent = 'Send Message';
  });
})();

/* ── Floating Pikachu ── */
(function() {
  const p = document.getElementById('pikachu');
  if (!p) return;
  const pad = 20;
  let w = window.innerWidth, h = window.innerHeight;
  let cx = w - 70, cy = h - 80;
  let intervalId, dragging = false, offX, offY;

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  function moveTo(x, y) {
    cx = clamp(x, pad, w - 60);
    cy = clamp(y, pad, h - 70);
    p.style.left = cx + 'px';
    p.style.top = cy + 'px';
  }

  function pickTarget() {
    if (dragging) return;
    const tx = pad + Math.random() * (w - 100 - pad * 2);
    const ty = pad + Math.random() * (h - 100 - pad * 2);
    p.style.transition = 'left 2.5s cubic-bezier(0.45, 0.05, 0.2, 0.99), top 2.5s cubic-bezier(0.45, 0.05, 0.2, 0.99)';
    moveTo(tx, ty);
  }

  p.addEventListener('mousedown', function(e) {
    dragging = true;
    clearInterval(intervalId);
    const rect = p.getBoundingClientRect();
    offX = e.clientX - rect.left;
    offY = e.clientY - rect.top;
    p.style.transition = 'none';
    p.style.cursor = 'grabbing';
    e.preventDefault();
  });

  document.addEventListener('mousemove', function(e) {
    if (!dragging) return;
    moveTo(e.clientX - offX, e.clientY - offY);
  });

  document.addEventListener('mouseup', function() {
    if (!dragging) return;
    dragging = false;
    p.style.cursor = 'grab';
    p.style.transition = 'left 2.5s cubic-bezier(0.45, 0.05, 0.2, 0.99), top 2.5s cubic-bezier(0.45, 0.05, 0.2, 0.99)';
    pickTarget();
    intervalId = setInterval(pickTarget, 3000);
  });

  function onResize() {
    w = window.innerWidth;
    h = window.innerHeight;
    cx = parseFloat(p.style.left) || cx;
    cy = parseFloat(p.style.top) || cy;
    moveTo(cx, cy);
  }

  p.style.position = 'fixed';
  p.style.bottom = 'auto';
  p.style.right = 'auto';
  p.style.left = cx + 'px';
  p.style.top = cy + 'px';
  p.style.cursor = 'grab';

  pickTarget();
  intervalId = setInterval(pickTarget, 3000);
  window.addEventListener('resize', onResize);
})();

/* ── Circle Menu ── */
(function() {
  const menu = document.getElementById('circleMenu');
  const btn = document.getElementById('circleMenuBtn');
  if (!menu || !btn) return;

  let open = false;

  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    open = !open;
    menu.classList.toggle('open', open);
    if (open) {
      btn.innerHTML = '<i data-lucide="x"></i>';
    } else {
      btn.innerHTML = '<i data-lucide="settings"></i>';
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
  });

  document.addEventListener('click', function() {
    if (open) {
      open = false;
      menu.classList.remove('open');
      btn.innerHTML = '<i data-lucide="settings"></i>';
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  });

  menu.querySelectorAll('.circle-menu-item').forEach(function(item) {
    item.addEventListener('click', function(e) {
      e.stopPropagation();
      const action = item.dataset.action;

      if (action === 'theme') {
        const isLight = document.body.classList.contains('light');
        document.body.classList.toggle('light', !isLight);
        localStorage.setItem('theme', isLight ? 'dark' : 'light');
        const navIcon = document.querySelector('#themeToggle i');
        if (navIcon) navIcon.setAttribute('data-lucide', isLight ? 'moon' : 'sun');
        item.innerHTML = isLight ? '<i data-lucide="moon"></i>' : '<i data-lucide="sun"></i>';
      }

      if (action === 'brightness') {
        const overlay = document.getElementById('brightnessOverlay') || (function() {
          const el = document.createElement('div');
          el.id = 'brightnessOverlay';
          el.style.cssText = 'position:fixed;inset:0;z-index:9997;pointer-events:none;transition:background 0.3s';
          document.body.appendChild(el);
          return el;
        })();
        let level = parseFloat(overlay.dataset.level || '0');
        level = level >= 0.6 ? 0 : level + 0.3;
        overlay.dataset.level = level;
        overlay.style.background = `rgba(0,0,0,${level})`;
      }

      if (action === 'translate') {
        const html = document.documentElement;
        if (html.lang === 'bn') {
          html.lang = 'en';
          item.innerHTML = '<i data-lucide="languages"></i>';
        } else {
          html.lang = 'bn';
          item.innerHTML = '<span style="font-size:0.75rem;">বাং</span>';
        }
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }

      open = false;
      menu.classList.remove('open');
      btn.innerHTML = '<i data-lucide="settings"></i>';
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
  });
})();

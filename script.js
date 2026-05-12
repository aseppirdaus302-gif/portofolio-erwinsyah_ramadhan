/* ============================================================
   PORTFOLIO - SMA Student | script.js
   ============================================================ */

const currentPage = window.location.pathname.split('/').pop() || 'index.html';

/* ============================================================
   NAVBAR
   ============================================================ */
function initNavbar() {
  const navbar    = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navMobile = document.querySelector('.nav-mobile');
  const allNavLinks = document.querySelectorAll('.nav-links a, .nav-mobile a');

  allNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  if (hamburger && navMobile) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navMobile.classList.toggle('open');
    });
    navMobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMobile.classList.remove('open');
      });
    });
  }

  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

/* ============================================================
   TYPING ANIMATION
   ============================================================ */
function initTyping() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const texts = ['Technology Student'];
  let textIndex = 0, charIndex = 0, isDeleting = false, typingDelay = 120;

  function type() {
    const current = texts[textIndex];
    el.textContent = isDeleting
      ? current.substring(0, charIndex - 1)
      : current.substring(0, charIndex + 1);

    isDeleting ? charIndex-- : charIndex++;
    typingDelay = isDeleting ? 60 : 120;

    if (!isDeleting && charIndex === current.length) {
      isDeleting = true; typingDelay = 1800;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      typingDelay = 400;
    }
    setTimeout(type, typingDelay);
  }
  setTimeout(type, 800);
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), entry.target.dataset.delay || 0);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(
    '.skills-grid .skill-card, .projects-grid .project-card, .cert-grid .cert-card, ' +
    '.highlights-grid .highlight-card, .org-grid .org-card, .soft-skills-grid .soft-card'
  ).forEach((el, i) => { el.dataset.delay = i * 80; });

  reveals.forEach(el => observer.observe(el));
}

/* ============================================================
   SKILL BARS
   ============================================================ */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => { entry.target.style.width = entry.target.dataset.pct + '%'; }, 200);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

/* ============================================================
   PROJECT FILTER
   ============================================================ */
function initProjectFilter() {
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !show);
        if (show) card.style.animation = 'fadeInUp 0.4s ease both';
      });
    });
  });
}

/* ============================================================
   CERTIFICATE MODAL
   ============================================================ */
function initCertModal() {
  const modal    = document.getElementById('cert-modal');
  const closeBtn = document.getElementById('modal-close');
  const certCards = document.querySelectorAll('.cert-card');
  if (!modal || !certCards.length) return;

  certCards.forEach(card => {
    card.addEventListener('click', () => {
      document.getElementById('modal-title').textContent = card.dataset.title;
      document.getElementById('modal-desc').textContent  = card.dataset.desc;

      const imgEl = modal.querySelector('.modal-img');
      const phEl  = modal.querySelector('.modal-img-placeholder');
      if (card.dataset.img) {
        imgEl.src = card.dataset.img; imgEl.style.display = 'block';
        if (phEl) phEl.style.display = 'none';
      } else {
        if (imgEl) imgEl.style.display = 'none';
        if (phEl) phEl.style.display = 'flex';
      }

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => { modal.classList.remove('open'); document.body.style.overflow = ''; };
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

/* ============================================================
   CONTACT FORM — mailto (tanpa backend/layanan pihak ketiga)
   
   Cara kerja:
   1. User isi form → klik Kirim
   2. JS validasi semua field
   3. Kalau valid → buka aplikasi email user (Gmail, Outlook, dll)
      dengan TO, Subject, dan Body sudah terisi otomatis
   4. User tinggal klik Send di aplikasi email mereka
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameField  = form.querySelector('#name');
  const emailField = form.querySelector('#email');
  const subjField  = form.querySelector('#subject');
  const msgField   = form.querySelector('#message');
  const successEl  = document.getElementById('form-success');

  /* Helper error */
  function setError(field, msg) {
    const group = field.closest('.form-group');
    group.classList.add('error');
    group.querySelector('.form-error').textContent = msg;
  }
  function clearError(field) {
    field.closest('.form-group').classList.remove('error');
  }

  [nameField, emailField, msgField].forEach(f => {
    if (f) f.addEventListener('input', () => clearError(f));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    /* Validasi nama */
    if (!nameField.value.trim()) {
      setError(nameField, 'Nama tidak boleh kosong.');
      valid = false;
    }

    /* Validasi email */
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailField.value.trim()) {
      setError(emailField, 'Email tidak boleh kosong.');
      valid = false;
    } else if (!emailRe.test(emailField.value.trim())) {
      setError(emailField, 'Format email tidak valid.');
      valid = false;
    }

    /* Validasi pesan */
    if (!msgField.value.trim()) {
      setError(msgField, 'Pesan tidak boleh kosong.');
      valid = false;
    } else if (msgField.value.trim().length < 10) {
      setError(msgField, 'Pesan terlalu singkat (min. 10 karakter).');
      valid = false;
    }

    if (!valid) return;

    /* ── Buat mailto link dengan semua isi form terbawa ── */
    const toEmail  = 'erwinsyahramadhan0908@gmail.com';
    const subject  = encodeURIComponent(
      subjField.value.trim() || `Pesan dari ${nameField.value.trim()}`
    );
    const body = encodeURIComponent(
      `Nama    : ${nameField.value.trim()}\n` +
      `Email   : ${emailField.value.trim()}\n` +
      `Subjek  : ${subjField.value.trim() || '-'}\n\n` +
      `Pesan:\n${msgField.value.trim()}`
    );

    const mailtoLink = `mailto:${toEmail}?subject=${subject}&body=${body}`;

    /* Buka aplikasi email user */
    window.location.href = mailtoLink;

    /* Tampilkan notifikasi sukses */
    if (successEl) {
      successEl.classList.add('show');
      setTimeout(() => successEl.classList.remove('show'), 6000);
    }

    /* Reset form setelah jeda singkat */
    setTimeout(() => form.reset(), 1000);
  });
}

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
}

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const end = parseInt(el.dataset.target, 10);
        let cur = 0;
        const step = Math.ceil(end / 40);
        const timer = setInterval(() => {
          cur += step;
          if (cur >= end) { cur = end; clearInterval(timer); }
          el.textContent = cur;
        }, 40);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ============================================================
   INIT ALL
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTyping();
  initScrollReveal();
  initSkillBars();
  initProjectFilter();
  initCertModal();
  initContactForm();
  initSmoothScroll();
  initCounters();
});
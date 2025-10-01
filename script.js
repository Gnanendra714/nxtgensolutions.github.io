// Mobile nav toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }));
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    if (id && id.length > 1) {
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

// Modal helpers
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Attach open buttons
document.querySelectorAll('[data-open]').forEach(btn => {
  btn.addEventListener('click', () => openModal(btn.getAttribute('data-open')));
});

// Close on backdrop or close button
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', e => {
    const target = e.target;
    if (target instanceof HTMLElement && (target.hasAttribute('data-close') || target.classList.contains('modal'))) {
      closeModal(modal);
    }
  });
  // close on Esc
  modal.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal(modal);
  });
});

// Switch between login and signup
document.querySelectorAll('[data-switch]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('data-switch');
    const current = link.closest('.modal');
    if (current) closeModal(current);
    if (targetId) openModal(targetId);
  });
});

// Note: Firebase auth handlers are in auth.js now.


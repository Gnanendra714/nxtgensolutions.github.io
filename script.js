// ---------------- Modal toggles ----------------
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');

const loginLinks = document.querySelectorAll('#login-link');
const signupLinks = document.querySelectorAll('#signup-link, #signup-link-hero');

loginLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    if (loginModal) loginModal.style.display = 'flex';
  });
});

signupLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    if (signupModal) signupModal.style.display = 'flex';
  });
});

// Close buttons
const closeLogin = document.getElementById('close-login');
const closeSignup = document.getElementById('close-signup');

if (closeLogin && loginModal) {
  closeLogin.addEventListener('click', () => loginModal.style.display = 'none');
}
if (closeSignup && signupModal) {
  closeSignup.addEventListener('click', () => signupModal.style.display = 'none');
}

// Optional: close modal if clicking outside content
window.addEventListener('click', (e) => {
  if (e.target === loginModal) loginModal.style.display = 'none';
  if (e.target === signupModal) signupModal.style.display = 'none';
});

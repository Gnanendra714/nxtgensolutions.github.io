/* Client-side auth & UI helpers using localStorage.
   NOTE: This is for demo/local static usage only. For production use a backend and proper auth.
*/

document.addEventListener('DOMContentLoaded', () => {
  // common footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // mobile nav toggle
  const toggle = document.querySelector('.mobile-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const nav = document.querySelector('.nav-links');
      if (nav) nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    });
  }

  // Smooth in-page scrolling
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // ---- Redirect if already logged in (on login/signup pages) ----
  if ((window.location.pathname.endsWith('login.html') || window.location.pathname.endsWith('signup.html'))
    && localStorage.getItem('loggedIn')) {
    window.location.href = 'dashboard.html';
  }

  // ---- Signup logic ----
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const name = document.getElementById('signupName').value.trim();
      const email = document.getElementById('signupEmail').value.trim().toLowerCase();
      const pw = document.getElementById('signupPassword').value;
      const msg = document.getElementById('signupMessage');

      if (!name || !email || pw.length < 6) {
        msg.textContent = '⚠️ Please fill valid details (password min 6 chars).';
        msg.style.color = 'red';
        return;
      }

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.find(u => u.email === email)) {
        msg.textContent = '⚠️ Account with that email already exists. Please login.';
        msg.style.color = 'red';
        return;
      }

      const hashedPw = btoa(pw); // simple obfuscation
      users.push({ name, email, password: hashedPw, created: new Date().toISOString() });
      localStorage.setItem('users', JSON.stringify(users));

      localStorage.setItem('loggedIn', email);
      msg.textContent = '✅ Signup successful! Redirecting...';
      msg.style.color = 'green';
      setTimeout(() => window.location.href = 'dashboard.html', 1000);
    });
  }

  // ---- Login logic ----
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const email = document.getElementById('loginEmail').value.trim().toLowerCase();
      const pw = document.getElementById('loginPassword').value;
      const msg = document.getElementById('loginMessage');

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email && u.password === btoa(pw));
      if (!user) {
        msg.textContent = '❌ Invalid email or password.';
        msg.style.color = 'red';
        return;
      }

      localStorage.setItem('loggedIn', email);
      msg.textContent = '✅ Login successful! Redirecting...';
      msg.style.color = 'green';
      setTimeout(() => window.location.href = 'dashboard.html', 800);
    });
  }

  // ---- Dashboard protection & UX ----
  if (window.location.pathname.endsWith('dashboard.html')) {
    const loggedIn = localStorage.getItem('loggedIn');
    if (!loggedIn) {
      window.location.href = 'login.html';
    } else {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const me = users.find(u => u.email === loggedIn) || { name: loggedIn, email: loggedIn };

      const nameEl = document.getElementById('userName');
      if (nameEl) nameEl.textContent = me.name || me.email;

      const emailEl = document.getElementById('userEmail');
      if (emailEl) emailEl.textContent = me.email;
    }

    // logout handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('loggedIn');
        window.location.href = 'login.html';
      });
    }

    // device toggle buttons with On/Off states
    document.querySelectorAll('button[data-device]').forEach(btn => {
      btn.dataset.state = "off"; // default state
      btn.textContent = "Turn On";

      btn.addEventListener('click', () => {
        const isOn = btn.dataset.state === "on";
        if (isOn) {
          btn.textContent = "Turn On";
          btn.dataset.state = "off";
        } else {
          btn.textContent = "Turn Off";
          btn.dataset.state = "on";
        }
        btn.classList.add('active');
        setTimeout(() => btn.classList.remove('active'), 600);
      });
    });
  }
});

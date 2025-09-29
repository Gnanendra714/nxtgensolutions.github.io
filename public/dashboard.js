// dashboard.js
document.addEventListener('DOMContentLoaded', () => {
  // ---- Dashboard protection ----
  const loggedIn = localStorage.getItem('loggedIn');
  if (!loggedIn) {
    window.location.href = 'login.html';
    return;
  }

  // Fetch user info
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const me = users.find(u => u.email === loggedIn) || { name: loggedIn, email: loggedIn };

  // Populate user info in dashboard
  const userNameEl = document.getElementById('userName');
  if (userNameEl) userNameEl.textContent = me.name;

  const userEmailEl = document.getElementById('userEmail');
  if (userEmailEl) userEmailEl.textContent = me.email;

  const dashboardUserNameEl = document.getElementById('dashboardUserName');
  if (dashboardUserNameEl) dashboardUserNameEl.textContent = me.name;

  // ---- Logout ----
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('loggedIn');
      window.location.href = 'login.html';
    });
  }

  // ---- Tab switching ----
  const navHome = document.getElementById('nav-home');
  const navDevice = document.getElementById('nav-device');
  const tabHome = document.getElementById('live-energy');
  const tabDevice = document.getElementById('device-control-section');

  if (navHome && navDevice && tabHome && tabDevice) {
    navHome.addEventListener('click', (e) => {
      e.preventDefault();
      navHome.classList.add('active');
      navDevice.classList.remove('active');
      tabHome.style.display = '';
      tabDevice.style.display = 'none';
    });

    navDevice.addEventListener('click', (e) => {
      e.preventDefault();
      navDevice.classList.add('active');
      navHome.classList.remove('active');
      tabHome.style.display = 'none';
      tabDevice.style.display = '';
    });
  }

  // ---- Device toggle switches ----
  const deviceCheckboxes = document.querySelectorAll('.device-control-item input[type="checkbox"]');
  deviceCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const parent = checkbox.closest('.device-control-item');
      const valueEl = parent.querySelector('.device-control-item-value');
      if (checkbox.checked) {
        valueEl.textContent = "On"; // Update value when switched on
      } else {
        valueEl.textContent = "Off"; // Update value when switched off
      }
      // Optional: add visual feedback
      parent.classList.add('active');
      setTimeout(() => parent.classList.remove('active'), 400);
    });
  });

  // ---- Mobile nav toggle ----
  const toggle = document.querySelector('.mobile-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const nav = document.querySelector('.nav-links');
      if (nav) nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    });
  }
});


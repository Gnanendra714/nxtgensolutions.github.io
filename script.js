// script.js (Firebase-powered Auth + Dashboard)

// ---------------- Common UI ----------------
document.addEventListener('DOMContentLoaded', () => {
  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const toggle = document.querySelector('.mobile-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const nav = document.querySelector('.nav-links');
      if (nav) nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    });
  }

  // Smooth scroll
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

  // ---------------- Signup ----------------
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('signupName').value.trim();
      const email = document.getElementById('signupEmail').value.trim().toLowerCase();
      const pw = document.getElementById('signupPassword').value;
      const msg = document.getElementById('signupMessage');

      if (!name || !email || pw.length < 6) {
        msg.textContent = '⚠️ Please fill valid details (password min 6 chars).';
        msg.style.color = 'red';
        return;
      }

      try {
        const userCred = await auth.createUserWithEmailAndPassword(email, pw);
        const uid = userCred.user.uid;

        // Store user profile in Firestore
        await db.collection("users").doc(uid).set({
          fullname: name,
          email: email,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        msg.textContent = '✅ Signup successful! Redirecting...';
        msg.style.color = 'green';
        setTimeout(() => window.location.href = 'dashboard.html', 1000);
      } catch (err) {
        msg.textContent = err.message;
        msg.style.color = 'red';
      }
    });
  }

  // ---------------- Login ----------------
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim().toLowerCase();
      const pw = document.getElementById('loginPassword').value;
      const msg = document.getElementById('loginMessage');

      try {
        await auth.signInWithEmailAndPassword(email, pw);
        msg.textContent = '✅ Login successful! Redirecting...';
        msg.style.color = 'green';
        setTimeout(() => window.location.href = 'dashboard.html', 800);
      } catch (err) {
        msg.textContent = '❌ ' + err.message;
        msg.style.color = 'red';
      }
    });
  }

  // ---------------- Dashboard ----------------
  if (window.location.pathname.endsWith('dashboard.html')) {
    auth.onAuthStateChanged(async (user) => {
      if (!user) {
        window.location.href = 'index.html';
      } else {
        // Load user profile
        const userDoc = await db.collection("users").doc(user.uid).get();
        const me = userDoc.data() || { fullname: user.email, email: user.email };

        const nameEl = document.getElementById('userName');
        if (nameEl) nameEl.textContent = me.fullname || me.email;

        const emailEl = document.getElementById('userEmail');
        if (emailEl) emailEl.textContent = me.email;

        // Attach logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', () => {
            auth.signOut().then(() => window.location.href = 'index.html');
          });
        }

        // Example: Realtime device listener
        db.collection("users").doc(user.uid).collection("devices")
          .onSnapshot(snapshot => {
            snapshot.forEach(doc => {
              console.log("Device update:", doc.id, doc.data());
              // TODO: update dashboard UI for each device
            });
          });
      }
    });
  }
});

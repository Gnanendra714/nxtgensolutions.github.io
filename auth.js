// auth.js
// assumes firebase-config.js defines: const auth = firebase.auth(); const db = firebase.firestore();

document.addEventListener("DOMContentLoaded", () => {
  // Helpers
  const authModal   = () => document.getElementById('authModal');
  const loginForm   = () => document.getElementById('loginForm');
  const signupForm  = () => document.getElementById('signupForm');

  // Safe attach function
  function onClick(id, fn) {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", fn);
  }

  // Modal logic
  function openModal() { if(authModal()) authModal().style.display = 'flex'; }
  function closeModal(){ if(authModal()) authModal().style.display = 'none'; }
  function showTab(tab) {
    if (!loginForm() || !signupForm()) return;
    if (tab === 'login') {
      loginForm().classList.remove('hidden');
      signupForm().classList.add('hidden');
      document.getElementById('tabLogin')?.classList.add('active');
      document.getElementById('tabSignup')?.classList.remove('active');
    } else {
      loginForm().classList.add('hidden');
      signupForm().classList.remove('hidden');
      document.getElementById('tabLogin')?.classList.remove('active');
      document.getElementById('tabSignup')?.classList.add('active');
    }
  }

  // Attach modal buttons
  onClick('openAuth', openModal);
  onClick('openAuthFooter', openModal);
  onClick('getStarted', openModal);
  onClick('closeAuth', closeModal);
  onClick('tabLogin', () => showTab('login'));
  onClick('tabSignup', () => showTab('signup'));

  // Signup
  async function signupUser(e) {
    e.preventDefault();
    const name     = document.getElementById('signupName')?.value.trim();
    const email    = document.getElementById('signupEmail')?.value.trim();
    const password = document.getElementById('signupPassword')?.value;

    if (!name || !email || !password || password.length < 6) {
      return alert("Please fill all fields with valid details (password >= 6 chars)");
    }

    try {
      const userCred = await auth.createUserWithEmailAndPassword(email, password);
      const uid = userCred.user.uid;

      // User doc
      await db.collection('users').doc(uid).set({
        fullname: name,
        email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      // Example default devices
      const devices = [
        { id: 'fan', name: 'Fan', power: 50, status: true },
        { id: 'light', name: 'Light', power: 10, status: false },
        { id: 'ac', name: 'AC', power: 1200, status: true }
      ];
      const batch = db.batch();
      devices.forEach(d => {
        const ref = db.collection('users').doc(uid).collection('devices').doc(d.id);
        batch.set(ref, {...d, lastUpdated: firebase.firestore.FieldValue.serverTimestamp()});
      });
      await batch.commit();

      window.location.href = 'dashboard.html';
    } catch (err) {
      alert(err.message);
    }
  }

  // Login
  async function loginUser(e) {
    e.preventDefault();
    const email    = document.getElementById('loginEmail')?.value.trim();
    const password = document.getElementById('loginPassword')?.value;

    try {
      await auth.signInWithEmailAndPassword(email, password);
      window.location.href = 'dashboard.html';
    } catch (err) {
      alert(err.message);
    }
  }

  // Attach form listeners safely
  if (loginForm())  loginForm().addEventListener("submit", loginUser);
  if (signupForm()) signupForm().addEventListener("submit", signupUser);

  // Auto redirect if logged in
  auth.onAuthStateChanged(user => {
    const path = window.location.pathname;
    if (user && (path.endsWith("index.html") || path.endsWith("/"))) {
      window.location.href = "dashboard.html";
    }
  });
});

// auth.js
// requires firebase-config.js (auth, db already available)

// UI helpers
const authModal = () => document.getElementById('authModal');
const loginForm = () => document.getElementById('loginForm');
const signupForm = () => document.getElementById('signupForm');

document.getElementById('openAuth').addEventListener('click', () => openModal());
document.getElementById('openAuthFooter').addEventListener('click', () => openModal());
document.getElementById('closeAuth').addEventListener('click', () => closeModal());
document.getElementById('getStarted').addEventListener('click', () => openModal());
document.getElementById('tabLogin').addEventListener('click', () => showTab('login'));
document.getElementById('tabSignup').addEventListener('click', () => showTab('signup'));

function openModal() { authModal().style.display = 'flex'; }
function closeModal(){ authModal().style.display = 'none'; }
function showTab(tab) {
  if (tab === 'login') {
    loginForm().classList.remove('hidden');
    signupForm().classList.add('hidden');
    document.getElementById('tabLogin').classList.add('active');
    document.getElementById('tabSignup').classList.remove('active');
  } else {
    loginForm().classList.add('hidden');
    signupForm().classList.remove('hidden');
    document.getElementById('tabLogin').classList.remove('active');
    document.getElementById('tabSignup').classList.add('active');
  }
}

// Signup
async function signupUser(){
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  if(!name || !email || password.length < 6) return alert('Please fill valid details');

  try {
    const userCred = await auth.createUserWithEmailAndPassword(email, password);
    const uid = userCred.user.uid;

    // Create user doc
    await db.collection('users').doc(uid).set({
      fullname: name,
      email: email,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    // Create default devices (demo)
    const devices = [
      { id: 'fan', name: 'Fan', power: 50, status: true },
      { id: 'light', name: 'Light', power: 10, status: false },
      { id: 'ac', name: 'AC', power: 1200, status: true }
    ];
    const batch = db.batch();
    devices.forEach(d => {
      const docRef = db.collection('users').doc(uid).collection('devices').doc(d.id);
      batch.set(docRef, {...d, lastUpdated: firebase.firestore.FieldValue.serverTimestamp()});
    });
    await batch.commit();

    // redirect to dashboard
    window.location.href = 'dashboard.html';
  } catch (err) {
    alert(err.message);
  }
}

// Login
async function loginUser(){
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  try {
    await auth.signInWithEmailAndPassword(email, password);
    window.location.href = 'dashboard.html';
  } catch (err) {
    alert(err.message);
  }
}

// Auto-redirect if already logged in
auth.onAuthStateChanged(user => {
  // If user on landing and logged in -> go to dashboard
  if (user && window.location.pathname.endsWith('index.html') || user && window.location.pathname.endsWith('/')) {
    window.location.href = 'dashboard.html';
  }
});

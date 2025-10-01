// dashboard.js
// expects firebase-config.js to be loaded first

let devicesRef = null;
let chart = null;
let chartLabels = [];
let chartData = [];

auth.onAuthStateChanged(async user => {
  if (!user) {
    window.location.href = 'index.html';
    return;
  }
  const uid = user.uid;
  initDashboard(uid);
});

function initDashboard(uid){
  devicesRef = db.collection('users').doc(uid).collection('devices');

  // initial read & realtime listener
  devicesRef.onSnapshot(snapshot => {
    let total = 0;
    snapshot.forEach(doc => {
      const data = doc.data();
      total += (data.power || 0);
      renderOrUpdateDeviceCard(doc.id, data);
    });
    document.getElementById('totalPower').innerText = Math.round(total) + ' W';
    pushChart(total);
  });

  setupChart();
}

function renderOrUpdateDeviceCard(id, data){
  const container = document.getElementById('devices');
  let el = document.getElementById('device-' + id);
  if (!el) {
    el = document.createElement('div');
    el.className = 'device-card';
    el.id = 'device-' + id;
    el.innerHTML = `
      <h4 class="d-name">${data.name || id}</h4>
      <p>Power: <span class="d-power">${data.power || 0}</span> W</p>
      <p>Status: <span class="d-status">${data.status ? 'ON' : 'OFF'}</span></p>
      <button class="btn-outline" onclick="toggleDevice('${id}')">Toggle</button>
    `;
    container.appendChild(el);
  } else {
    el.querySelector('.d-power').innerText = data.power || 0;
    el.querySelector('.d-status').innerText = data.status ? 'ON' : 'OFF';
  }
}

async function toggleDevice(deviceId){
  const docRef = devicesRef.doc(deviceId);
  const doc = await docRef.get();
  if (!doc.exists) return;
  const cur = doc.data();
  const newStatus = !cur.status;
  const newPower = newStatus ? (cur.name && cur.name.toLowerCase().includes('ac') ? 1200 : (cur.name.toLowerCase().includes('fan') ? 50 : 10)) : 0;

  await docRef.update({
    status: newStatus,
    power: newPower,
    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
  });
}

// Chart
function setupChart(){
  const ctx = document.getElementById('usageChart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartLabels,
      datasets: [{
        label: 'Total Power (W)',
        data: chartData,
        borderColor: '#2c699a',
        tension: 0.3,
        fill: false
      }]
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } } }
  });
}

function pushChart(total){
  const t = new Date().toLocaleTimeString();
  chartLabels.push(t);
  chartData.push(Math.round(total));
  if (chartLabels.length > 12) { chartLabels.shift(); chartData.shift(); }
  chart.update();
}

// Simulate dev updates (writes random power values to each device) — for demo only
async function simulateUpdate(){
  const snapshot = await devicesRef.get();
  const batch = db.batch();
  snapshot.forEach(doc => {
    const id = doc.id;
    const cur = doc.data();
    const newPower = cur.status ? Math.max(1, Math.round(cur.power * (0.6 + Math.random()*0.8))) : 0;
    const ref = devicesRef.doc(id);
    batch.update(ref, { power: newPower, lastUpdated: firebase.firestore.FieldValue.serverTimestamp() });
  });
  await batch.commit();
}

// Logout
function signOut(){
  auth.signOut().then(()=> window.location.href = 'index.html');
}

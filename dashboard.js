// Auth guard using Firebase and user info fill
if (window.firebase && firebase.auth) {
  firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      window.location.href = 'index.html';
      return;
    }
    const nameEl = document.getElementById('userName');
    if (nameEl) nameEl.value = user.displayName || user.email || '';
    const emailEl = document.getElementById('userEmail');
    if (emailEl) emailEl.value = user.email || '';
  });
}

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    try {
      if (window.firebase && firebase.auth) {
        await firebase.auth().signOut();
      }
    } catch (e) { /* ignore */ }
    window.location.href = 'index.html';
  });
}

const menu = document.getElementById('menu');
const pageTitle = document.getElementById('pageTitle');
const sections = Array.from(document.querySelectorAll('.content'));
const hideSidebar = document.getElementById('hideSidebar');
const sidebar = document.querySelector('.sidebar');

// Sidebar toggle for mobile
hideSidebar.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

// Menu navigation
menu.addEventListener('click', (e) => {
  const btn = e.target.closest('.menu-item');
  if (!btn) return;
  menu.querySelectorAll('.menu-item').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const section = btn.dataset.section;
  sections.forEach(s => s.classList.toggle('show', s.id === `section-${section}`));
  pageTitle.textContent = btn.querySelector('span').textContent;
});

// Populate sample data
const deviceUsage = [
  { name: 'Air Conditioning', value: 0.8, pct: 35 },
  { name: 'Water Heater', value: 0.6, pct: 25 },
  { name: 'Refrigerator', value: 0.3, pct: 15 },
  { name: 'Lighting', value: 0.3, pct: 12 },
  { name: 'Electronics', value: 0.4, pct: 13 },
];

function renderUsage(listId, data) {
  const ul = document.getElementById(listId);
  ul.innerHTML = '';
  data.forEach(item => {
    const li = document.createElement('li');
    li.className = 'usage-item';
    li.innerHTML = `<span>${item.name}</span>
      <div class="bar"><span style="width:${item.pct}%"></span></div>
      <strong>${item.pct}%</strong>`;
    ul.appendChild(li);
  });
}

renderUsage('deviceUsage', deviceUsage);
renderUsage('roomUsage', [
  { name: 'Living Room', pct: 28 },
  { name: 'Kitchen', pct: 22 },
  { name: 'Master Bedroom', pct: 18 },
  { name: 'Office', pct: 16 },
  { name: 'Bathroom', pct: 16 },
]);

// Devices grid
const deviceGrid = document.getElementById('deviceGrid');
const devices = [
  { name: 'Living Room AC', room: 'Living Room', status: 'Online', power: '0.8 kW' },
  { name: 'Kitchen Fridge', room: 'Kitchen', status: 'Online', power: '0.3 kW' },
  { name: 'Master Bedroom Light', room: 'Master Bedroom', status: 'Offline', power: '0 kW' },
  { name: 'Water Heater', room: 'Utility', status: 'Online', power: '0.6 kW' },
  { name: 'Office Computer', room: 'Office', status: 'Online', power: '0.2 kW' },
];

function renderDevices() {
  deviceGrid.innerHTML = '';
  devices.forEach(d => {
    const card = document.createElement('div');
    card.className = 'device-card';
    const isOnline = d.status === 'Online';
    card.innerHTML = `
      <div class="head">
        <strong>${d.name}</strong>
        <div class="status"><span class="dot ${isOnline ? 'on' : 'off'}"></span>${d.status}</div>
      </div>
      <div>Room: <strong>${d.room}</strong></div>
      <div>Power: <strong>${d.power}</strong></div>
      <button class="btn btn-outline">⚙ Configure</button>
    `;
    deviceGrid.appendChild(card);
  });
}

renderDevices();

// Control cards
const controlGrid = document.getElementById('controlGrid');
devices.slice(0, 2).forEach(d => {
  const panel = document.createElement('div');
  panel.className = 'panel';
  panel.innerHTML = `
    <h3>${d.name}</h3>
    <div class="form-grid">
      <label>Power<select><option>ON</option><option>OFF</option></select></label>
      <label>Auto Mode<select><option>Enabled</option><option>Disabled</option></select></label>
      <label>Turn On<input type="time" value="08:00"></label>
      <label>Turn Off<input type="time" value="22:00"></label>
    </div>
  `;
  controlGrid.appendChild(panel);
});

// Trend bars
const trendBars = document.getElementById('trendBars');
['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].forEach((day, idx) => {
  const pct = [60,75,55,70,85,65,80][idx];
  const row = document.createElement('div');
  row.className = 'bar-row';
  row.innerHTML = `<div class="label">${day}</div><div class="bar"><span style="width:${pct}%"></span></div>`;
  trendBars.appendChild(row);
});

document.addEventListener('DOMContentLoaded', () => {
    // Check if the settings section exists on the page
    const settingsContainer = document.querySelector('.settings-container');
    if (!settingsContainer) return;

    const settingItems = document.querySelectorAll('.setting-item');
    const settingPanels = document.querySelectorAll('.setting-panel');

    function switchSettingPanel(panelName) {
        // 1. Deactivate all menu items
        settingItems.forEach(item => {
            item.classList.remove('active');
        });

        // 2. Hide all panels
        settingPanels.forEach(panel => {
            panel.classList.remove('show');
        });

        // 3. Activate the clicked menu item
        const activeItem = document.querySelector(`[data-setting-panel="${panelName}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }

        // 4. Show the corresponding panel
        const activePanel = document.getElementById(`setting-${panelName}`);
        if (activePanel) {
            activePanel.classList.add('show');
        }
    }

    // Set up click listeners for the settings menu
    settingItems.forEach(item => {
        item.addEventListener('click', () => {
            const panelName = item.getAttribute('data-setting-panel');
            switchSettingPanel(panelName);
        });
    });

    // Optional: Integrate with the main sidebar menu logic
    // When the user clicks the main "Settings" link in the sidebar,
    // ensure the "Profile" sub-panel is shown by default.
    const mainSettingsButton = document.querySelector('[data-section="settings"]');
    if (mainSettingsButton) {
        mainSettingsButton.addEventListener('click', () => {
            // Wait a moment to ensure the main section transition completes
            setTimeout(() => {
                // Default to showing the 'profile' panel when entering settings
                switchSettingPanel('profile'); 
            }, 50); 
        });
    }

    // Initialize: Ensure the default active panel is visible on load
    switchSettingPanel('profile');
});
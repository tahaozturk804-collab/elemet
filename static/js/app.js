/* ═══════════════════════════════════════════════════
   ElementWars — Global JS Utilities
   ═══════════════════════════════════════════════════ */

// ── API Helper ──────────────────────────────────────
const api = {
  async get(url) {
    const r = await fetch(url, { credentials: 'include' });
    return r.json();
  },
  async post(url, data) {
    const r = await fetch(url, {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return r.json();
  },
  async put(url, data) {
    const r = await fetch(url, {
      method: 'PUT', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return r.json();
  },
  async delete(url) {
    const r = await fetch(url, { method: 'DELETE', credentials: 'include' });
    return r.json();
  }
};

// ── Toast Notifications ──────────────────────────────
function toast(message, type = 'info') {
  const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle' };
  const container = document.getElementById('toast-container');
  if (!container) return;
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${message}</span>`;
  container.appendChild(el);
  setTimeout(() => {
    el.classList.add('toast-out');
    setTimeout(() => el.remove(), 350);
  }, 3000);
}

// ── Loader ────────────────────────────────────────────
function hideLoader() {
  const loader = document.getElementById('ew-loading');
  if (loader) { loader.classList.add('hidden'); setTimeout(() => loader.remove(), 400); }
}

// ── Format helpers ────────────────────────────────────
function fmt(n) { return parseFloat(n).toFixed(2); }
function fmtDate(ts) {
  if (!ts) return '—';
  const d = new Date(ts * 1000);
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}
function timeAgo(ts) {
  const diff = Math.floor(Date.now() / 1000) - ts;
  if (diff < 60) return 'Az önce';
  if (diff < 3600) return `${Math.floor(diff/60)} dk önce`;
  if (diff < 86400) return `${Math.floor(diff/3600)} saat önce`;
  if (diff < 2592000) return `${Math.floor(diff/86400)} gün önce`;
  if (diff < 31536000) return `${Math.floor(diff/2592000)} ay önce`;
  return `${Math.floor(diff/31536000)} yıl önce`;
}

// ── Auth State ────────────────────────────────────────
let currentUser = null;

async function loadAuth() {
  try {
    const data = await api.get('/api/auth/me');
    currentUser = data.logged_in ? data : null;
  } catch { currentUser = null; }
  renderNav();
  return currentUser;
}

function renderNav() {
  const loginBtn   = document.getElementById('nav-login-btn');
  const userBlock  = document.getElementById('nav-user-block');
  const dropdown   = document.getElementById('user-dropdown');

  if (!currentUser) {
    if (loginBtn) loginBtn.style.display = 'flex';
    if (userBlock) userBlock.style.display = 'none';
    if (dropdown) dropdown.innerHTML = '';
    return;
  }

  if (loginBtn) loginBtn.style.display = 'none';
  if (userBlock) {
    userBlock.style.display = 'flex';
    const un = userBlock.querySelector('.nav-username');
    const av = userBlock.querySelector('.nav-avatar');
    if (un) un.textContent = currentUser.username;
    if (av) av.src = `https://mc-heads.net/avatar/${currentUser.username}/34`;
  }

  if (dropdown) {
    dropdown.innerHTML = `
      <div class="user-drop-header">
        <img src="https://mc-heads.net/avatar/${currentUser.username}/52" class="user-drop-avatar">
        <div class="flex-1">
          <div class="user-drop-name">${currentUser.username}</div>
          <div class="user-drop-email">${currentUser.email}</div>
        </div>
        <div class="user-drop-logout" onclick="logout()">
          <i class="fas fa-sign-out-alt"></i> Çıkış
        </div>
      </div>
      <div class="user-drop-stats">
        <div class="user-drop-stat">
          <div class="val">${fmt(currentUser.credit)} USD</div>
          <div class="lbl">Kredi</div>
        </div>
        <div class="user-drop-stat">
          <div class="val" style="color:var(--accent)">${currentUser.is_admin ? 'Admin' : 'Üye'}</div>
          <div class="lbl">Rol</div>
        </div>
      </div>
      <div class="user-drop-links">
        <div class="user-drop-link" onclick="goto('/profile')">
          <span><i class="fas fa-user"></i> Profilim</span><i class="fas fa-chevron-right fs-11"></i>
        </div>
        <div class="user-drop-link" onclick="goto('/cart')">
          <span><i class="fas fa-shopping-basket"></i> Sepetim</span><i class="fas fa-chevron-right fs-11"></i>
        </div>
        <div class="user-drop-link" onclick="goto('/support')">
          <span><i class="fas fa-headset"></i> Destek</span><i class="fas fa-chevron-right fs-11"></i>
        </div>
        ${currentUser.is_admin ? `
        <div class="divider"></div>
        <div class="user-drop-link" onclick="goto('/dashboard')" style="color:var(--accent)">
          <span><i class="fas fa-tachometer-alt"></i> Yönetim Paneli</span><i class="fas fa-chevron-right fs-11"></i>
        </div>` : ''}
      </div>
    `;
  }
}

function toggleUserMenu() {
  const dd = document.getElementById('user-dropdown');
  if (dd) dd.classList.toggle('open');
}

document.addEventListener('click', e => {
  const dd = document.getElementById('user-dropdown');
  const btn = document.getElementById('nav-user-block');
  if (dd && !dd.contains(e.target) && btn && !btn.contains(e.target)) {
    dd.classList.remove('open');
  }
});

async function logout() {
  await api.post('/api/auth/logout', {});
  window.location.href = '/';
}

function goto(url) { window.location.href = url; }

// ── Cart Count ─────────────────────────────────────────
async function refreshCartCount() {
  if (!currentUser) return;
  try {
    const data = await api.get('/api/cart');
    const badge = document.querySelector('.nav-cart-badge');
    if (badge) badge.textContent = (data.items || []).length;
  } catch {}
}

// ── Modal Helpers ──────────────────────────────────────
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('open');
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
}

// close modal on overlay click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});

// ── Table sort / search (client-side) ─────────────────
function filterTable(inputId, tableBodyId) {
  const input = document.getElementById(inputId);
  const tbody = document.getElementById(tableBodyId);
  if (!input || !tbody) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    Array.from(tbody.rows).forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
}

// ── Active nav link ────────────────────────────────────
function setActiveNavLink() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-link[data-path]').forEach(link => {
    link.classList.toggle('active', link.dataset.path === path || (path.startsWith(link.dataset.path) && link.dataset.path !== '/'));
  });
}

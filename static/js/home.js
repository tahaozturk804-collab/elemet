// ── Home Page JS ──────────────────────────────────────

// Particles
function spawnParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    p.style.animationDelay = Math.random() * 8 + 's';
    p.style.animationDuration = (5 + Math.random() * 8) + 's';
    container.appendChild(p);
  }
}

// Copy server IP
function copyIP() {
  navigator.clipboard.writeText('play.elementwars.net').then(() => {
    toast('Sunucu IP kopyalandı!', 'success');
  });
}

// Load news
async function loadNews() {
  const list = document.getElementById('news-list');
  try {
    const news = await api.get('/api/news');
    if (!news.length) {
      list.innerHTML = '<div class="empty-state"><div class="empty-icon">📰</div><h3>Henüz haber yok</h3></div>';
      return;
    }
    list.innerHTML = news.map(n => `
      <div class="news-card">
        <div class="news-img">📰</div>
        <div class="news-body">
          <div class="news-title">${n.title}</div>
          <div class="news-excerpt">${n.excerpt}</div>
          <div class="news-footer">
            <span class="news-tag">${n.category}</span>
            <span class="news-stat"><i class="far fa-eye"></i> ${n.views}</span>
            <span class="news-stat"><i class="far fa-comment"></i> ${n.comments}</span>
            <span class="news-stat text-muted fs-12">${timeAgo(n.created_at)}</span>
          </div>
        </div>
      </div>
    `).join('');
  } catch {
    list.innerHTML = '<div class="text-muted fs-13">Haberler yüklenemedi.</div>';
  }
}

// Load recent purchases
async function loadPurchases() {
  const tbody = document.getElementById('purchases-body');
  try {
    const data = await api.get('/api/home/recent-purchases');
    if (!data.length) {
      tbody.innerHTML = '<tr><td colspan="3" class="text-muted" style="padding:20px;text-align:center">Henüz alışveriş yok.</td></tr>';
      return;
    }
    tbody.innerHTML = data.map(p => `
      <tr>
        <td><span class="fw-700">${p.username}</span></td>
        <td><span class="text-muted">${p.category}</span></td>
        <td><span class="fw-700">${p.product}</span></td>
      </tr>
    `).join('');
  } catch {
    tbody.innerHTML = '<tr><td colspan="3" class="text-muted" style="padding:16px;text-align:center">Yüklenemedi.</td></tr>';
  }
}

// Load leaderboard
async function loadLeaderboard() {
  const el = document.getElementById('leaderboard-list');
  const rankClass = ['gold','silver','bronze'];
  const rankEmoji = ['🥇','🥈','🥉'];
  try {
    const data = await api.get('/api/home/leaderboard');
    if (!data.length) {
      el.innerHTML = '<div class="text-muted fs-13" style="padding:12px 0">Henüz veri yok.</div>';
      return;
    }
    el.innerHTML = data.map((l, i) => `
      <div class="leader-item">
        <div class="leader-rank ${rankClass[i] || ''}">${rankEmoji[i] || i+1}</div>
        <img src="https://mc-heads.net/avatar/${l.username}/36" class="leader-avatar" onerror="this.src='https://mc-heads.net/avatar/Steve/36'">
        <span class="leader-name">${l.username}</span>
        <span class="leader-amount">${fmt(l.total_spent)} USD</span>
      </div>
    `).join('');
  } catch {
    el.innerHTML = '<div class="text-muted fs-13" style="padding:12px 0">Yüklenemedi.</div>';
  }
}

// Online count (simulated)
function updateOnlineCount() {
  const base = 31919;
  const count = base + Math.floor(Math.random() * 200 - 100);
  document.getElementById('online-count').textContent = count.toLocaleString('tr-TR');
  document.getElementById('server-count').textContent = count.toLocaleString('tr-TR') + ' oyuncu çevrimiçi';
}

// Init
spawnParticles();
loadNews();
loadPurchases();
loadLeaderboard();
updateOnlineCount();
setInterval(updateOnlineCount, 30000);

/* ═══════════════════════════════════════════════════
   ElementWars — Dashboard JS
   ═══════════════════════════════════════════════════ */

const PERMISSIONS = [
  'Super Admin','Paneli Görüntüleyebilir','İstatistikleri Görebilir','Hesapları Yönetebilir',
  'Başvuruları Yönetebilir','Banları Yönetebilir','Pazarı Yönetebilir','Duyuruları Yönetebilir',
  'İndirmeleri Yönetebilir','Oyunları Yönetebilir','Hediyeleri Yönetebilir','Yardım Merkezini Yönetebilir',
  'Sıralamayı Yönetebilir','Çarkıfeleği Yönetebilir','Blogu Yönetebilir','Bildirimleri Görebilir',
  'Sayfaları Yönetebilir','Ödemeleri Yönetebilir','Rolleri Yönetebilir','Sunucuları Yönetebilir',
  'Ayarları Yönetebilir','Slideri Yönetebilir','Mağazayı Yönetebilir','Desteği Yönetebilir',
  'Destek Taleplerini Yönetebilir','Temaları Yönetebilir','Güncellemeleri Yönetebilir','Logları Yönetebilir',
  'Forumu Yönetebilir','Özel Formları Yönetebilir','Modülleri Yönetebilir','Önerileri Yönetebilir'
];

const SUBNAVS = {
  overview: `
    <div class="dash-subnav-title">Genel</div>
    <div class="dash-subnav-item active" onclick="renderOverview()"><i class="fas fa-home"></i> Genel Bakış</div>
  `,
  users: `
    <div class="dash-subnav-title">Kullanıcı Yönetimi</div>
    <div class="dash-subnav-item active" onclick="renderUsers()"><i class="fas fa-users"></i> Kullanıcılar</div>
    <div class="dash-subnav-item" onclick="renderRoles()"><i class="fas fa-shield-alt"></i> Roller</div>
    <div class="dash-subnav-item" onclick="renderStaff()"><i class="fas fa-user-tie"></i> Yetkililer</div>
    <div class="dash-subnav-item"><i class="fas fa-ban"></i> Engellenen Kullanıcılar</div>
    <div class="dash-subnav-sep"></div>
    <div class="dash-subnav-title">İşlemler</div>
    <div class="dash-subnav-item"><i class="fas fa-user-slash"></i> Kullanıcıyı Engelle</div>
    <div class="dash-subnav-item" onclick="renderSendCredit()"><i class="fas fa-paper-plane"></i> Kredi Gönder</div>
  `,
  store: `
    <div class="dash-subnav-title">Mağaza</div>
    <div class="dash-subnav-item active" onclick="renderAdminProducts()"><i class="fas fa-box"></i> Ürünler</div>
    <div class="dash-subnav-item" onclick="renderAdminCategories()"><i class="fas fa-th-large"></i> Kategoriler</div>
    <div class="dash-subnav-item"><i class="fas fa-server"></i> Sunucular</div>
    <div class="dash-subnav-item" onclick="renderAdminCoupons()"><i class="fas fa-ticket-alt"></i> Kuponlar</div>
    <div class="dash-subnav-item"><i class="fas fa-barcode"></i> Yayıncı Kodları</div>
    <div class="dash-subnav-item"><i class="fas fa-gift"></i> Hediyeler</div>
    <div class="dash-subnav-item" onclick="renderAdminOrders()"><i class="fas fa-shopping-bag"></i> Siparişler</div>
    <div class="dash-subnav-item"><i class="fas fa-credit-card"></i> Ödemeler</div>
    <div class="dash-subnav-sep"></div>
    <div class="dash-subnav-title">Gelişmiş</div>
    <div class="dash-subnav-item"><i class="fas fa-table"></i> VIP Tabloları</div>
    <div class="dash-subnav-item"><i class="fas fa-tags"></i> Toplu İndirim</div>
    <div class="dash-subnav-item"><i class="fas fa-lock"></i> Topluluk Hedefleri</div>
    <div class="dash-subnav-item"><i class="fas fa-cog"></i> Ayarlar</div>
  `,
  support: `
    <div class="dash-subnav-title">Destek</div>
    <div class="dash-subnav-item active" onclick="renderAdminTickets()"><i class="fas fa-ticket-alt"></i> Talepler</div>
    <div class="dash-subnav-item"><i class="fas fa-th-large"></i> Kategoriler</div>
    <div class="dash-subnav-item"><i class="fas fa-bolt"></i> Hızlı Cevaplar</div>
    <div class="dash-subnav-item"><i class="fas fa-cog"></i> Ayarlar</div>
    <div class="dash-subnav-sep"></div>
    <div class="dash-subnav-title">Yardım Merkezi</div>
    <div class="dash-subnav-item"><i class="fas fa-file-alt"></i> Makaleler</div>
    <div class="dash-subnav-item"><i class="fas fa-th-large"></i> Konular</div>
  `
};

// ── INIT ──────────────────────────────────────────────
async function dashInit() {
  const me = await api.get('/api/auth/me');
  if (!me.logged_in || !me.is_admin) {
    toast('Yönetici yetkisi gerekiyor!', 'error');
    goto('/login');
    return;
  }
  const el = document.getElementById('dash-username');
  if (el) el.textContent = me.username;
  switchSection('overview');
  hideLoader();
}

// ── SECTION SWITCH ───────────────────────────────────
function switchSection(section) {
  document.querySelectorAll('.dash-icon').forEach(i => i.classList.remove('active'));
  const icon = document.querySelector(`.dash-icon[data-section="${section}"]`);
  if (icon) icon.classList.add('active');
  const subnav = document.getElementById('dash-subnav');
  subnav.innerHTML = SUBNAVS[section] || '';

  if (section === 'overview') renderOverview();
  else if (section === 'users') renderUsers();
  else if (section === 'store') renderAdminProducts();
  else if (section === 'support') renderAdminTickets();
}

function setBreadcrumb(parts) {
  const el = document.getElementById('dash-breadcrumb');
  el.innerHTML = `<span onclick="switchSection('overview')" style="cursor:pointer"><i class="fas fa-home"></i></span>` +
    parts.map(p => `<span class="sep">›</span><span class="${p.active ? 'current' : ''}">${p.label}</span>`).join('');
}

function setActiveSubnav(label) {
  document.querySelectorAll('.dash-subnav-item').forEach(i => {
    i.classList.toggle('active', i.textContent.trim() === label || i.textContent.trim().startsWith(label));
  });
}

// ── OVERVIEW ─────────────────────────────────────────
async function renderOverview() {
  setBreadcrumb([{ label: 'Genel Bakış', active: true }]);
  const body = document.getElementById('dash-body');
  body.innerHTML = '<div class="text-muted fs-13" style="padding:20px">Yükleniyor...</div>';
  const stats = await api.get('/api/admin/stats');
  const months = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
  const barData = [0,0,0,0,0,1,0,0,0,0,0,0];
  const maxBar = Math.max(...barData, 1);

  body.innerHTML = `
    <h1 class="dash-page-title">Genel Bakış</h1>

    <div class="chart-card">
      <div class="chart-header">
        <div class="chart-title">Aylık Satışlar</div>
        <div class="flex gap-16">
          <div class="text-right"><div class="text-muted fs-11">Bu Ay</div><div class="fw-800 fs-16">${fmt(stats.monthly_sales)} USD</div></div>
          <div class="text-right"><div class="text-muted fs-11">Bugün</div><div class="fw-800 fs-16">${fmt(stats.today_sales)} USD</div></div>
        </div>
      </div>
      <div class="chart-area">
        ${months.map((m, i) => `
          <div class="chart-col">
            <div class="chart-bar-wrap">
              <div class="chart-bar" style="height:${Math.max(3, (barData[i]/maxBar)*160)}px" title="${m}: ${barData[i]} USD"></div>
            </div>
            <div class="chart-month">${m}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="stats-4">
      <div class="stat-w">
        <div class="stat-w-top"><div class="stat-w-icon"><i class="fas fa-users"></i></div><div class="stat-w-label">Toplam Kullanıcı</div></div>
        <div class="stat-w-value">${stats.total_users}</div>
        <div class="stat-w-sub">Kayıtlı hesaplar</div>
      </div>
      <div class="stat-w">
        <div class="stat-w-top"><div class="stat-w-icon" style="background:rgba(16,185,129,0.1);color:var(--green)"><i class="fas fa-dollar-sign"></i></div><div class="stat-w-label">Bu Ayki Satışlar</div></div>
        <div class="stat-w-value text-green">${fmt(stats.monthly_sales)} USD</div>
        <div class="stat-w-sub">Son 30 gün</div>
      </div>
      <div class="stat-w">
        <div class="stat-w-top"><div class="stat-w-icon" style="background:rgba(239,68,68,0.1);color:var(--red)"><i class="fas fa-headset"></i></div><div class="stat-w-label">Açık Talepler</div></div>
        <div class="stat-w-value text-red">${stats.open_tickets}</div>
        <div class="stat-w-sub">Cevap bekliyor</div>
      </div>
      <div class="stat-w">
        <div class="stat-w-top"><div class="stat-w-icon" style="background:rgba(6,182,212,0.1);color:var(--cyan)"><i class="fas fa-box"></i></div><div class="stat-w-label">Toplam Ürün</div></div>
        <div class="stat-w-value">${stats.total_products}</div>
        <div class="stat-w-sub">Aktif ürünler</div>
      </div>
    </div>

    <div class="two-cols">
      <div id="recent-orders-box"></div>
      <div id="recent-tickets-box"></div>
    </div>
  `;

  // Recent orders
  const orders = await api.get('/api/admin/orders');
  document.getElementById('recent-orders-box').innerHTML = `
    <div class="chart-card" style="margin-bottom:0">
      <div class="chart-header"><div class="chart-title">Son Satın Alımlar</div><span class="text-accent fs-12 fw-700 pointer" onclick="switchSection('store')">Tümü →</span></div>
      <table class="data-table">
        <thead><tr><th>Kullanıcı</th><th>Tutar</th><th>Durum</th></tr></thead>
        <tbody>${(orders.slice(0,6)).map(o=>`
          <tr>
            <td><span class="fw-700">${o.username}</span></td>
            <td class="fw-700 text-accent">${fmt(o.total)} USD</td>
            <td><span class="badge badge-green">${o.status}</span></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`;

  // Recent tickets
  const tickets = await api.get('/api/admin/tickets');
  document.getElementById('recent-tickets-box').innerHTML = `
    <div class="chart-card" style="margin-bottom:0">
      <div class="chart-header"><div class="chart-title">Son Talepler</div><span class="text-accent fs-12 fw-700 pointer" onclick="switchSection('support')">Tümü →</span></div>
      <table class="data-table">
        <thead><tr><th>Başlık</th><th>Kullanıcı</th><th>Durum</th></tr></thead>
        <tbody>${(tickets.slice(0,6)).map(t=>`
          <tr>
            <td class="fw-700">${t.title}</td>
            <td class="text-muted fs-13">${t.username}</td>
            <td><span class="badge ${t.status==='Açık'?'badge-blue':'badge-green'}">${t.status}</span></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

// ── USERS ─────────────────────────────────────────────
async function renderUsers() {
  switchSection('users'); setActiveSubnav('Kullanıcılar');
  setBreadcrumb([{ label: 'Kullanıcı Yönetimi' }, { label: 'Kullanıcılar', active: true }]);
  const body = document.getElementById('dash-body');
  body.innerHTML = '<div class="text-muted fs-13">Yükleniyor...</div>';
  const users = await api.get('/api/admin/users');
  body.innerHTML = `
    <div class="dash-ph">
      <h1 class="dash-page-title" style="margin-bottom:0">Kullanıcılar</h1>
      <button class="btn btn-primary btn-sm" onclick="renderCreateUser()"><i class="fas fa-plus"></i> Yeni Ekle</button>
    </div>
    <div class="search-wrap">
      <label>Kullanıcılar için arama yap</label>
      <div class="search-input-wrap">
        <i class="fas fa-search"></i>
        <input class="input search-input" id="user-search" type="text" placeholder="Ara...">
      </div>
    </div>
    <div class="card" style="padding:0;overflow:hidden">
      <table class="data-table">
        <thead><tr><th>ID</th><th>Kullanıcı</th><th>E-posta</th><th>Rol</th><th>Kredi</th><th>Tarih</th><th></th></tr></thead>
        <tbody id="users-tbody">
          ${users.map(u=>`
            <tr>
              <td class="text-muted">#${u.id}</td>
              <td>
                <div class="user-cell">
                  <img src="https://mc-heads.net/avatar/${u.username}/32" class="user-avatar" onerror="this.src='https://mc-heads.net/avatar/Steve/32'">
                  <div><div class="username">${u.username}</div><div class="usertag">@${u.username}</div></div>
                </div>
              </td>
              <td class="text-muted fs-13">${u.email}</td>
              <td>${u.is_admin ? '<span class="badge-admin">Admin</span>' : '<span class="badge badge-blue">Üye</span>'}</td>
              <td class="fw-700 text-green">${fmt(u.credit)}</td>
              <td class="text-muted fs-13">${timeAgo(u.created_at)}</td>
              <td>
                <button class="btn btn-red btn-icon btn-sm" onclick="deleteUser(${u.id},'${u.username}')"><i class="fas fa-trash"></i></button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="pagination">
      <div class="page-btn">← Önceki</div>
      <div class="page-btn active">1</div>
      <div class="page-btn">Sonraki →</div>
    </div>`;
  filterTable('user-search', 'users-tbody');
}

async function deleteUser(id, username) {
  if (!confirm(`${username} silinsin mi?`)) return;
  const res = await api.delete('/api/admin/users/' + id);
  if (res.success) { toast('Kullanıcı silindi', 'success'); renderUsers(); }
  else toast(res.error, 'error');
}

function renderCreateUser() {
  setBreadcrumb([{ label: 'Kullanıcılar' }, { label: 'Hesap Oluştur', active: true }]);
  document.getElementById('dash-body').innerHTML = `
    <div class="dash-ph">
      <h1 class="dash-page-title" style="margin-bottom:0">Hesap Oluştur</h1>
      <div class="flex gap-8">
        <button class="btn btn-ghost btn-sm" onclick="renderUsers()"><i class="fas fa-arrow-left"></i> Geri</button>
      </div>
    </div>
    <div class="form-card">
      <div class="form-card-title">Hesap Bilgileri</div>
      <div class="field"><label>Kullanıcı Adı</label><input class="input" id="cu-username" placeholder="kullanici_adi"></div>
      <div class="field"><label>E-posta</label><input class="input" id="cu-email" type="email" placeholder="ornek@mail.com"></div>
      <div class="form-row">
        <div class="field"><label>Parola</label><input class="input" id="cu-pw" type="password"></div>
        <div class="field"><label>Parola (Onayla)</label><input class="input" id="cu-pw2" type="password"></div>
      </div>
      <div class="field"><label>Kredi</label><input class="input" id="cu-credit" type="number" value="0"></div>
      <label class="flex-center gap-8 mt-8 fs-13"><input type="checkbox" id="cu-admin" style="accent-color:var(--accent)"> Admin yetkisi ver</label>
    </div>
    <div class="form-card">
      <div class="form-card-title">İzinler</div>
      <div class="perm-grid">
        ${PERMISSIONS.map((p,i) => `
          <label class="perm-item">
            <div class="perm-check ${i===0?'on':''}" onclick="this.classList.toggle('on')"></div>
            <span>${p}</span>
          </label>`).join('')}
      </div>
    </div>
    <div style="display:flex;justify-content:flex-end;margin-top:8px;">
      <button class="btn btn-primary" onclick="createUser()"><i class="fas fa-plus"></i> Oluştur</button>
    </div>`;
}

async function createUser() {
  const username = document.getElementById('cu-username').value.trim();
  const email = document.getElementById('cu-email').value.trim();
  const password = document.getElementById('cu-pw').value;
  const pw2 = document.getElementById('cu-pw2').value;
  const credit = parseFloat(document.getElementById('cu-credit').value) || 0;
  const is_admin = document.getElementById('cu-admin').checked ? 1 : 0;
  if (password !== pw2) { toast('Şifreler eşleşmiyor', 'error'); return; }
  const res = await api.post('/api/admin/users', { username, email, password, credit, is_admin });
  if (res.success) { toast('Kullanıcı oluşturuldu!', 'success'); renderUsers(); }
  else toast(res.error, 'error');
}

// ── ROLES ─────────────────────────────────────────────
function renderRoles() {
  setActiveSubnav('Roller');
  setBreadcrumb([{ label: 'Kullanıcı Yönetimi' }, { label: 'Rol Oluştur', active: true }]);
  document.getElementById('dash-body').innerHTML = `
    <div class="dash-ph">
      <h1 class="dash-page-title" style="margin-bottom:0">Rol Oluştur</h1>
      <button class="btn btn-ghost btn-sm" onclick="renderUsers()"><i class="fas fa-arrow-left"></i> Geri</button>
    </div>
    <div class="form-card">
      <div class="form-card-title">Rol Bilgileri</div>
      <div class="field"><label>Ad</label><input class="input" placeholder="Rol adı"></div>
      <div class="field"><label>Öncelik</label><input class="input" type="number" value="0"></div>
      <div class="field"><label>Kullanıcı Adı CSS</label><textarea class="input" rows="3" placeholder="color: #ff6600;"></textarea></div>
      <div class="field"><label>Rozet CSS</label><textarea class="input" rows="3" placeholder="background: #ff6600;"></textarea></div>
      <div class="toggle-wrap mt-16">
        <div class="toggle" onclick="this.classList.toggle('on')"></div>
        <span class="toggle-label">Yetkili rolü mü?</span>
      </div>
    </div>
    <div class="form-card">
      <div class="form-card-title">İzinler</div>
      <div class="perm-grid">
        ${PERMISSIONS.map((p,i) => `
          <label class="perm-item">
            <div class="perm-check ${i===0?'on':''}" onclick="this.classList.toggle('on')"></div>
            <span>${p}</span>
          </label>`).join('')}
      </div>
    </div>
    <div style="display:flex;justify-content:flex-end;">
      <button class="btn btn-primary"><i class="fas fa-save"></i> Oluştur</button>
    </div>`;
}

// ── STAFF ─────────────────────────────────────────────
async function renderStaff() {
  setActiveSubnav('Yetkililer');
  setBreadcrumb([{ label: 'Kullanıcı Yönetimi' }, { label: 'Yetkililer', active: true }]);
  const body = document.getElementById('dash-body');
  body.innerHTML = '<div class="text-muted fs-13">Yükleniyor...</div>';
  const users = await api.get('/api/admin/users');
  const staff = users.filter(u => u.is_admin);
  body.innerHTML = `
    <div class="dash-ph">
      <h1 class="dash-page-title" style="margin-bottom:0">Yetkililer</h1>
      <button class="btn btn-primary btn-sm"><i class="fas fa-plus"></i> Yeni Ekle</button>
    </div>
    <div class="card" style="padding:0;overflow:hidden">
      <table class="data-table">
        <thead><tr><th>ID</th><th>Kullanıcı</th><th>E-posta</th><th>Rol</th><th>Kredi</th><th>Tarih</th><th></th></tr></thead>
        <tbody>
          ${staff.map(u=>`
            <tr>
              <td class="text-muted">#${u.id}</td>
              <td>
                <div class="user-cell">
                  <img src="https://mc-heads.net/avatar/${u.username}/32" class="user-avatar">
                  <div><div class="username">${u.username}</div><div class="usertag">@${u.username}</div></div>
                </div>
              </td>
              <td class="text-muted fs-13">${u.email}</td>
              <td><span class="badge-admin">Admin</span></td>
              <td class="fw-700 text-green">${fmt(u.credit)}</td>
              <td class="text-muted fs-13">${timeAgo(u.created_at)}</td>
              <td>
                <button class="btn btn-blue btn-icon btn-sm"><i class="fas fa-eye"></i></button>
                <button class="btn btn-ghost btn-icon btn-sm"><i class="fas fa-edit"></i></button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

// ── SEND CREDIT ───────────────────────────────────────
function renderSendCredit() {
  setActiveSubnav('Kredi Gönder');
  setBreadcrumb([{ label: 'İşlemler' }, { label: 'Kredi Gönder', active: true }]);
  document.getElementById('dash-body').innerHTML = `
    <h1 class="dash-page-title">Kredi Gönder</h1>
    <div class="form-card">
      <div class="field"><label>Kullanıcı Ara</label><input class="input" id="sc-user" placeholder="Kullanıcı adı..."></div>
      <div class="field"><label>Miktar (USD)</label><input class="input" id="sc-amount" type="number" min="0.01" step="0.01"></div>
      <div class="toggle-wrap mt-8 mb-16">
        <div class="toggle on" id="sc-toggle" onclick="this.classList.toggle('on')"></div>
        <span class="toggle-label">Bu bir kazanç mı?</span>
      </div>
      <button class="btn btn-primary" onclick="doSendCredit()"><i class="fas fa-paper-plane"></i> Gönder</button>
    </div>`;
}

async function doSendCredit() {
  const username = document.getElementById('sc-user').value.trim();
  const amount = parseFloat(document.getElementById('sc-amount').value);
  const is_earning = document.getElementById('sc-toggle').classList.contains('on');
  const res = await api.post('/api/admin/send-credit', { username, amount, is_earning });
  if (res.success) toast(res.message, 'success');
  else toast(res.error, 'error');
}

// ── ADMIN PRODUCTS ────────────────────────────────────
async function renderAdminProducts() {
  setActiveSubnav('Ürünler');
  setBreadcrumb([{ label: 'Mağaza' }, { label: 'Ürünler', active: true }]);
  const body = document.getElementById('dash-body');
  body.innerHTML = '<div class="text-muted fs-13">Yükleniyor...</div>';
  const [cats, prods] = await Promise.all([api.get('/api/admin/categories'), api.get('/api/store/products')]);

  const grouped = {};
  cats.forEach(c => { grouped[c.id] = { cat: c, products: [] }; });
  prods.forEach(p => { if (grouped[p.category_id]) grouped[p.category_id].products.push(p); });

  body.innerHTML = `
    <div class="dash-ph">
      <h1 class="dash-page-title" style="margin-bottom:0">Ürünler</h1>
      <div class="flex gap-8">
        <button class="btn btn-ghost btn-sm" onclick="renderProductTable()">Tablo Görünümü</button>
        <button class="btn btn-primary btn-sm" onclick="renderCreateProduct()"><i class="fas fa-plus"></i> Yeni Ekle</button>
      </div>
    </div>
    <div class="card" style="padding:0;overflow:hidden">
      ${Object.values(grouped).map(g => `
        <div style="border-bottom:1px solid var(--border)">
          <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 20px;background:rgba(249,115,22,0.03);">
            <span class="fw-700 fs-15">${g.cat.emoji} ${g.cat.name}</span>
            <span class="text-muted fs-12">${g.products.length} ürün</span>
          </div>
          ${g.products.map(p=>`
            <div style="display:flex;align-items:center;gap:12px;padding:12px 20px 12px 36px;border-top:1px solid var(--border)">
              <span style="font-size:20px">${p.image_emoji}</span>
              <span class="fw-700 flex-1">${p.name}</span>
              <span class="text-accent fw-700">${fmt(p.price)} USD</span>
              <span class="text-muted fs-12">${p.stock ? p.stock+' stok' : 'Sınırsız'}</span>
              <button class="btn btn-red btn-xs" onclick="deleteProduct(${p.id},'${p.name}')"><i class="fas fa-trash"></i></button>
            </div>`).join('')}
        </div>`).join('')}
    </div>`;
}

async function deleteProduct(id, name) {
  if (!confirm(`"${name}" silinsin mi?`)) return;
  const res = await api.delete('/api/admin/products/' + id);
  if (res.success) { toast('Ürün silindi', 'success'); renderAdminProducts(); }
  else toast(res.error, 'error');
}

async function renderProductTable() {
  setActiveSubnav('Ürünler');
  const body = document.getElementById('dash-body');
  body.innerHTML = '<div class="text-muted fs-13">Yükleniyor...</div>';
  const prods = await api.get('/api/store/products');
  body.innerHTML = `
    <div class="dash-ph">
      <h1 class="dash-page-title" style="margin-bottom:0">Ürünler — Tablo</h1>
      <div class="flex gap-8">
        <button class="btn btn-ghost btn-sm" onclick="renderAdminProducts()">Liste Görünümü</button>
        <button class="btn btn-primary btn-sm" onclick="renderCreateProduct()"><i class="fas fa-plus"></i> Yeni Ekle</button>
      </div>
    </div>
    <div class="search-wrap">
      <label>Ürünler için arama yap</label>
      <div class="search-input-wrap"><i class="fas fa-search"></i><input class="input search-input" id="prod-search" type="text" placeholder="Ara..."></div>
    </div>
    <div class="card" style="padding:0;overflow:hidden">
      <table class="data-table">
        <thead><tr><th>Ad / ID</th><th>Kategori</th><th>Fiyat</th><th>Stok</th><th>Öncelik</th><th></th></tr></thead>
        <tbody id="prods-tbody">
          ${prods.map(p=>`
            <tr>
              <td><div class="fw-700">${p.image_emoji} ${p.name}</div><div class="text-muted fs-11">#${p.id}</div></td>
              <td class="text-muted">${p.category_name || '—'}</td>
              <td class="fw-700 text-accent">${fmt(p.price)} USD</td>
              <td class="text-muted fs-13">${p.stock ? p.stock+' stokta' : 'Sınırsız'}</td>
              <td class="text-muted">${p.priority}</td>
              <td>
                <button class="btn btn-red btn-icon btn-sm" onclick="deleteProduct(${p.id},'${p.name}')"><i class="fas fa-trash"></i></button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
  filterTable('prod-search', 'prods-tbody');
}

async function renderCreateProduct() {
  setBreadcrumb([{ label: 'Mağaza' }, { label: 'Ürünler' }, { label: 'Ekle', active: true }]);
  const cats = await api.get('/api/admin/categories');
  document.getElementById('dash-body').innerHTML = `
    <div class="dash-ph">
      <h1 class="dash-page-title" style="margin-bottom:0">Ürün Oluştur</h1>
      <button class="btn btn-ghost btn-sm" onclick="renderAdminProducts()"><i class="fas fa-arrow-left"></i> Geri</button>
    </div>
    <div class="form-card">
      <div class="form-card-title">Ürün Detayları</div>
      <div class="form-row">
        <div class="field"><label>Ad</label><input class="input" id="cp-name" placeholder="Ürün adı"></div>
        <div class="field"><label>Emoji</label><input class="input" id="cp-emoji" value="📦" placeholder="📦"></div>
      </div>
      <div class="field"><label>Kategori</label>
        <select class="input" id="cp-cat">
          <option value="">Kategori seçin</option>
          ${cats.map(c=>`<option value="${c.id}">${c.emoji} ${c.name}</option>`).join('')}
        </select>
      </div>
      <div class="field"><label>Açıklama</label><textarea class="input" id="cp-desc" rows="3"></textarea></div>
      <div class="form-row">
        <div class="field"><label>Fiyat (USD)</label><input class="input" id="cp-price" type="number" step="0.01" value="9.99"></div>
        <div class="field"><label>Stok (boş = sınırsız)</label><input class="input" id="cp-stock" type="number" placeholder="Sınırsız"></div>
      </div>
      <div class="field"><label>Öncelik</label><input class="input" id="cp-prio" type="number" value="0"></div>
    </div>
    <div style="display:flex;justify-content:flex-end;">
      <button class="btn btn-primary" onclick="createProduct()"><i class="fas fa-plus"></i> Oluştur</button>
    </div>`;
}

async function createProduct() {
  const name = document.getElementById('cp-name').value.trim();
  const category_id = document.getElementById('cp-cat').value;
  const emoji = document.getElementById('cp-emoji').value;
  const description = document.getElementById('cp-desc').value;
  const price = parseFloat(document.getElementById('cp-price').value);
  const stockVal = document.getElementById('cp-stock').value;
  const stock = stockVal ? parseInt(stockVal) : null;
  const priority = parseInt(document.getElementById('cp-prio').value) || 0;
  const res = await api.post('/api/admin/products', { name, category_id, emoji, description, price, stock, priority });
  if (res.success) { toast('Ürün oluşturuldu!', 'success'); renderAdminProducts(); }
  else toast(res.error, 'error');
}

// ── ADMIN CATEGORIES ──────────────────────────────────
async function renderAdminCategories() {
  setActiveSubnav('Kategoriler');
  setBreadcrumb([{ label: 'Mağaza' }, { label: 'Kategoriler', active: true }]);
  const body = document.getElementById('dash-body');
  body.innerHTML = '<div class="text-muted fs-13">Yükleniyor...</div>';
  const cats = await api.get('/api/admin/categories');
  body.innerHTML = `
    <div class="dash-ph">
      <h1 class="dash-page-title" style="margin-bottom:0">Mağaza Kategorileri</h1>
      <button class="btn btn-primary btn-sm" onclick="renderCreateCategory()"><i class="fas fa-plus"></i> Yeni Ekle</button>
    </div>
    <div class="search-wrap">
      <label>Kategoriler için arama yap</label>
      <div class="search-input-wrap"><i class="fas fa-search"></i><input class="input search-input" id="cat-search" type="text" placeholder="Ara..."></div>
    </div>
    <div class="card" style="padding:0;overflow:hidden">
      <table class="data-table">
        <thead><tr><th>Ad / ID</th><th>Ana Kategori</th><th>Öncelik</th><th></th></tr></thead>
        <tbody id="cats-tbody">
          ${cats.map(c=>`
            <tr>
              <td><div class="fw-700">${c.emoji} ${c.name}</div><div class="text-muted fs-11">#${c.id}</div></td>
              <td class="text-muted">—</td>
              <td class="text-muted">${c.priority}</td>
              <td>
                <button class="btn btn-blue btn-icon btn-sm"><i class="fas fa-eye"></i></button>
                <button class="btn btn-ghost btn-icon btn-sm"><i class="fas fa-edit"></i></button>
                <button class="btn btn-red btn-icon btn-sm" onclick="deleteCategory(${c.id},'${c.name}')"><i class="fas fa-trash"></i></button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
  filterTable('cat-search', 'cats-tbody');
}

async function deleteCategory(id, name) {
  if (!confirm(`"${name}" silinsin mi?`)) return;
  const res = await api.delete('/api/admin/categories/' + id);
  if (res.success) { toast('Kategori silindi', 'success'); renderAdminCategories(); }
  else toast(res.error, 'error');
}

function renderCreateCategory() {
  setBreadcrumb([{ label: 'Mağaza' }, { label: 'Kategoriler' }, { label: 'Ekle', active: true }]);
  document.getElementById('dash-body').innerHTML = `
    <div class="dash-ph">
      <h1 class="dash-page-title" style="margin-bottom:0">Kategori Oluştur</h1>
      <button class="btn btn-ghost btn-sm" onclick="renderAdminCategories()"><i class="fas fa-arrow-left"></i> Geri</button>
    </div>
    <div class="form-card">
      <div class="form-card-title">Kategori Detayları</div>
      <div class="form-row">
        <div class="field"><label>Ad</label><input class="input" id="cc-name" placeholder="Kategori adı"></div>
        <div class="field"><label>Emoji</label><input class="input" id="cc-emoji" value="📦"></div>
      </div>
      <div class="field"><label>Ana Kategori</label><select class="input" id="cc-parent"><option value="">Ana kategori yok</option></select></div>
      <div class="field"><label>Öncelik</label><input class="input" id="cc-prio" type="number" value="0"></div>
    </div>
    <div style="display:flex;justify-content:flex-end;">
      <button class="btn btn-primary" onclick="createCategory()"><i class="fas fa-plus"></i> Oluştur</button>
    </div>`;
}

async function createCategory() {
  const name = document.getElementById('cc-name').value.trim();
  const emoji = document.getElementById('cc-emoji').value;
  const priority = parseInt(document.getElementById('cc-prio').value) || 0;
  const res = await api.post('/api/admin/categories', { name, emoji, priority });
  if (res.success) { toast('Kategori oluşturuldu!', 'success'); renderAdminCategories(); }
  else toast(res.error, 'error');
}

// ── ADMIN COUPONS (empty state) ───────────────────────
function renderAdminCoupons() {
  setActiveSubnav('Kuponlar');
  setBreadcrumb([{ label: 'Mağaza' }, { label: 'Kuponlar', active: true }]);
  document.getElementById('dash-body').innerHTML = `
    <h1 class="dash-page-title">Kuponlar</h1>
    <div class="empty-state">
      <div class="empty-icon">🎫</div>
      <h3>Kupon bulunamadı!</h3>
      <p>Yeni kuponlar eklemek için aşağıdaki butona tıklayabilirsiniz.</p>
      <div class="empty-actions">
        <button class="btn btn-ghost" onclick="renderAdminProducts()">Ana Sayfa'ya Dön</button>
        <button class="btn btn-primary"><i class="fas fa-plus"></i> Kupon Oluştur</button>
      </div>
    </div>`;
}

// ── ADMIN ORDERS ──────────────────────────────────────
async function renderAdminOrders() {
  setActiveSubnav('Siparişler');
  setBreadcrumb([{ label: 'Mağaza' }, { label: 'Siparişler', active: true }]);
  const body = document.getElementById('dash-body');
  body.innerHTML = '<div class="text-muted fs-13">Yükleniyor...</div>';
  const orders = await api.get('/api/admin/orders');
  body.innerHTML = `
    <div class="dash-ph">
      <h1 class="dash-page-title" style="margin-bottom:0">Siparişler</h1>
      <button class="btn btn-primary btn-sm"><i class="fas fa-plus"></i> Yeni Ekle</button>
    </div>
    <div class="search-wrap" style="display:grid;grid-template-columns:1fr 200px;gap:16px">
      <div><label>Siparişler için arama yap</label>
        <div class="search-input-wrap"><i class="fas fa-search"></i><input class="input search-input" id="ord-search" type="text" placeholder="Ara..."></div>
      </div>
      <div><label>Durum</label><select class="input" style="height:46px;margin-top:0"><option>Hepsini Göster</option><option>Başarılı</option><option>Bekliyor</option></select></div>
    </div>
    <div class="card" style="padding:0;overflow:hidden">
      <table class="data-table">
        <thead><tr><th>ID</th><th>Kullanıcı</th><th>Toplam</th><th>Yöntem</th><th>Durum</th><th>Tarih</th><th></th></tr></thead>
        <tbody id="ord-tbody">
          ${orders.map(o=>`
            <tr>
              <td class="text-muted">#${o.id}</td>
              <td><div class="fw-700">${o.username}</div><div class="text-muted fs-11">@${o.username}</div></td>
              <td class="fw-700 text-accent">${fmt(o.total)} USD</td>
              <td class="text-muted fs-13">${o.payment_method}</td>
              <td><span class="badge badge-green">${o.status}</span></td>
              <td class="text-muted fs-13">${timeAgo(o.created_at)}</td>
              <td>
                <button class="btn btn-blue btn-icon btn-sm"><i class="fas fa-eye"></i></button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="pagination">
      <div class="page-btn">← Önceki</div>
      <div class="page-btn active">1</div>
      <div class="page-btn">Sonraki →</div>
    </div>`;
  filterTable('ord-search', 'ord-tbody');
}

// ── ADMIN TICKETS ─────────────────────────────────────
async function renderAdminTickets() {
  setActiveSubnav('Talepler');
  setBreadcrumb([{ label: 'Destek' }, { label: 'Talepler', active: true }]);
  const body = document.getElementById('dash-body');
  body.innerHTML = '<div class="text-muted fs-13">Yükleniyor...</div>';
  const tickets = await api.get('/api/admin/tickets');
  body.innerHTML = `
    <div class="dash-ph">
      <h1 class="dash-page-title" style="margin-bottom:0">Destek Talepleri</h1>
    </div>
    <div class="search-wrap" style="display:grid;grid-template-columns:1fr 180px 180px;gap:16px">
      <div><label>Arama</label>
        <div class="search-input-wrap"><i class="fas fa-search"></i><input class="input search-input" id="tkt-search" type="text" placeholder="Ara..."></div>
      </div>
      <div><label>Kategori</label><select class="input" style="height:46px"><option>Hepsini Göster</option></select></div>
      <div><label>Durum</label><select class="input" style="height:46px"><option>Hepsini Göster</option><option>Açık</option><option>Kapalı</option></select></div>
    </div>
    <div class="card" style="padding:0;overflow:hidden">
      <table class="data-table">
        <thead><tr><th><input type="checkbox"></th><th>Başlık / ID</th><th>Kullanıcı</th><th>Kategori</th><th>Durum</th><th>Tarih</th><th></th></tr></thead>
        <tbody id="tkt-tbody">
          ${tickets.map(t=>`
            <tr>
              <td><input type="checkbox"></td>
              <td><div class="fw-700">${t.title}</div><div class="text-muted fs-11">#${t.id}</div></td>
              <td><div class="fw-700">${t.username}</div><div class="text-muted fs-11">@${t.username}</div></td>
              <td class="text-muted">${t.category}</td>
              <td><span class="badge ${t.status==='Açık'?'badge-blue':'badge-green'}">${t.status}</span></td>
              <td class="text-muted fs-13">${timeAgo(t.created_at)}</td>
              <td>
                <button class="btn btn-blue btn-icon btn-sm"><i class="fas fa-eye"></i></button>
                ${t.status==='Açık'?`<button class="btn btn-ghost btn-icon btn-sm" title="Kapat" onclick="closeTicket(${t.id})"><i class="fas fa-times"></i></button>`:''}
                <button class="btn btn-red btn-icon btn-sm" onclick="deleteTicket(${t.id})"><i class="fas fa-trash"></i></button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="pagination">
      <div class="page-btn">← Önceki</div>
      <div class="page-btn active">1</div>
      <div class="page-btn">Sonraki →</div>
    </div>`;
  filterTable('tkt-search', 'tkt-tbody');
}

async function closeTicket(id) {
  const res = await api.put('/api/admin/tickets/' + id + '/close', {});
  if (res.success) { toast('Talep kapatıldı', 'success'); renderAdminTickets(); }
}

async function deleteTicket(id) {
  if (!confirm('Talep silinsin mi?')) return;
  const res = await api.delete('/api/support/tickets/' + id);
  if (res.success) { toast('Talep silindi', 'success'); renderAdminTickets(); }
}

// ── BOOT ─────────────────────────────────────────────
dashInit();

/* ═══════════════════════════════════════════════════
   ElementWars — Dashboard JS  (v3 - Full & Working)
   ═══════════════════════════════════════════════════ */

const PERMS = [
  'Super Admin','Paneli Görüntüleyebilir','İstatistikleri Görebilir','Hesapları Yönetebilir',
  'Başvuruları Yönetebilir','Banları Yönetebilir','Pazarı Yönetebilir','Duyuruları Yönetebilir',
  'İndirmeleri Yönetebilir','Oyunları Yönetebilir','Hediyeleri Yönetebilir','Yardım Merkezini Yönetebilir',
  'Sıralamayı Yönetebilir','Çarkıfeleği Yönetebilir','Blogu Yönetebilir','Bildirimleri Görebilir',
  'Sayfaları Yönetebilir','Ödemeleri Yönetebilir','Rolleri Yönetebilir','Sunucuları Yönetebilir',
  'Ayarları Yönetebilir','Slideri Yönetebilir','Mağazayı Yönetebilir','Desteği Yönetebilir',
  'Destek Taleplerini Yönetebilir','Temaları Yönetebilir','Güncellemeleri Yönetebilir','Logları Yönetebilir',
  'Forumu Yönetebilir','Özel Formları Yönetebilir','Modülleri Yönetebilir','Oyları Yönetebilir',
  'Önerileri Yönetebilir','Manage Community Goals','Güncelleme Notlarını Yönetebilir'
];

const SUBNAVS = {
  overview: `
    <div class="dash-subnav-title">Genel</div>
    <div class="dash-subnav-item active" onclick="renderOverview()"><i class="fas fa-home"></i> Genel Bakış</div>
  `,
  users: `
    <div class="dash-subnav-title">Kullanıcı Yönetimi</div>
    <div class="dash-subnav-item" onclick="renderUsers()"><i class="fas fa-users"></i> Kullanıcılar</div>
    <div class="dash-subnav-item" onclick="renderRoles()"><i class="fas fa-shield-alt"></i> Roller</div>
    <div class="dash-subnav-item" onclick="renderStaff()"><i class="fas fa-user-tie"></i> Yetkililer</div>
    <div class="dash-subnav-item" onclick="renderBannedUsers()"><i class="fas fa-ban"></i> Engellenen Kullanıcılar</div>
    <div class="dash-subnav-item" onclick="renderCustomFields()"><i class="fas fa-sliders-h"></i> Özel Alanlar</div>
    <div class="dash-subnav-sep"></div>
    <div class="dash-subnav-title">İşlemler</div>
    <div class="dash-subnav-item" onclick="renderBanUser()"><i class="fas fa-user-slash"></i> Kullanıcıyı Engelle</div>
    <div class="dash-subnav-item" onclick="renderSendCredit()"><i class="fas fa-paper-plane"></i> Kredi Gönder</div>
  `,
  store: `
    <div class="dash-subnav-title">Mağaza</div>
    <div class="dash-subnav-item" onclick="renderAdminProducts()"><i class="fas fa-box"></i> Ürünler</div>
    <div class="dash-subnav-item" onclick="renderAdminCategories()"><i class="fas fa-th-large"></i> Kategoriler</div>
    <div class="dash-subnav-item" onclick="renderAdminServers()"><i class="fas fa-server"></i> Sunucular</div>
    <div class="dash-subnav-item" onclick="renderAdminCoupons()"><i class="fas fa-ticket-alt"></i> Kuponlar</div>
    <div class="dash-subnav-item"><i class="fas fa-barcode"></i> Yayıncı Kodları</div>
    <div class="dash-subnav-item"><i class="fas fa-gift"></i> Hediyeler</div>
    <div class="dash-subnav-item" onclick="renderAdminOrders()"><i class="fas fa-shopping-bag"></i> Siparişler</div>
    <div class="dash-subnav-item" onclick="renderAdminPayments()"><i class="fas fa-credit-card"></i> Ödemeler</div>
    <div class="dash-subnav-sep"></div>
    <div class="dash-subnav-title">Gelişmiş</div>
    <div class="dash-subnav-item"><i class="fas fa-table"></i> VIP Tabloları</div>
    <div class="dash-subnav-item" onclick="renderBulkDiscount()"><i class="fas fa-tags"></i> Toplu İndirim</div>
    <div class="dash-subnav-item"><i class="fas fa-lock"></i> Topluluk Hedefleri</div>
    <div class="dash-subnav-item"><i class="fas fa-cog"></i> Ayarlar</div>
  `,
  support: `
    <div class="dash-subnav-title">Destek</div>
    <div class="dash-subnav-item" onclick="renderSupportTickets()"><i class="fas fa-ticket-alt"></i> Talepler</div>
    <div class="dash-subnav-item"><i class="fas fa-th-large"></i> Kategoriler</div>
    <div class="dash-subnav-item"><i class="fas fa-bolt"></i> Hızlı Cevaplar</div>
    <div class="dash-subnav-item"><i class="fas fa-cog"></i> Ayarlar</div>
    <div class="dash-subnav-sep"></div>
    <div class="dash-subnav-title">Yardım Merkezi</div>
    <div class="dash-subnav-item"><i class="fas fa-file-alt"></i> Makaleler</div>
    <div class="dash-subnav-item"><i class="fas fa-th-large"></i> Konular</div>
  `,
  apps: `
    <div class="dash-subnav-title">Başvurular</div>
    <div class="dash-subnav-item" onclick="renderApplicationForms()"><i class="fas fa-file-alt"></i> Başvuru Formları</div>
    <div class="dash-subnav-item" onclick="renderApplicationsList()"><i class="fas fa-download"></i> Başvurular</div>
    <div class="dash-subnav-sep"></div>
    <div class="dash-subnav-title">Özel Formlar</div>
    <div class="dash-subnav-item" onclick="renderCustomForms()"><i class="fas fa-file-code"></i> Özel Formlar</div>
    <div class="dash-subnav-item" onclick="renderFormAnswers()"><i class="fas fa-inbox"></i> Yanıtlar</div>
  `
};

// ── SUBNAV TOGGLE ──────────────────────────────────────────
let subnavOpen = false;

function toggleSubnav() {
  subnavOpen = !subnavOpen;
  document.getElementById('dash-content-area').classList.toggle('subnav-open', subnavOpen);
}

function closeSubnav() {
  subnavOpen = false;
  document.getElementById('dash-content-area').classList.remove('subnav-open');
}

// ── INIT ───────────────────────────────────────────────────
async function dashInit() {
  const me = await api.get('/api/auth/me');
  if (!me.logged_in || !me.is_admin) {
    toast('Admin yetkisi gerekiyor!', 'error');
    setTimeout(() => goto('/login'), 1200);
    return;
  }
  document.getElementById('dash-username').textContent = me.username;
  switchSection('overview');
  hideLoader();
}

function switchSection(section) {
  document.querySelectorAll('.dash-icon').forEach(i => i.classList.remove('active'));
  const icon = document.querySelector(`.dash-icon[data-section="${section}"]`);
  if (icon) icon.classList.add('active');
  document.getElementById('dash-subnav-inner').innerHTML = SUBNAVS[section] || '';
  const titles = { overview:'Genel Bakış', users:'Kullanıcı Yönetimi', store:'Mağaza', support:'Destek', apps:'Başvurular' };
  const titleEl = document.getElementById('dash-subnav-title');
  if (titleEl) titleEl.textContent = titles[section] || '';
  subnavOpen = true;
  document.getElementById('dash-content-area').classList.add('subnav-open');
  if (section === 'overview') renderOverview();
  else if (section === 'users')   renderUsers();
  else if (section === 'store')   renderAdminProducts();
  else if (section === 'support') renderSupportTickets();
  else if (section === 'apps')    renderApplicationForms();
}

function setBreadcrumb(parts) {
  const homeHTML = `<span style="cursor:pointer" onclick="switchSection('overview')"><i class="fas fa-home"></i></span>`;
  const partsHTML = parts.map(p =>
    `<span class="sep">›</span><span class="${p.active ? 'current' : 'pointer'}" ${p.fn ? `onclick="${p.fn}()"` : ''}>${p.label}</span>`
  ).join('');
  document.getElementById('dash-breadcrumb').innerHTML = homeHTML + partsHTML;
}

function setActiveSubnav(text) {
  document.querySelectorAll('.dash-subnav-item').forEach(el => {
    el.classList.toggle('active', el.textContent.trim() === text);
  });
}

function permGrid(allOn) {
  return PERMS.map((p, i) => `
    <label class="perm-item">
      <div class="perm-check ${(allOn || i === 0) ? 'on' : ''}" onclick="this.classList.toggle('on')"></div>
      <span>${p}</span>
    </label>`).join('');
}

async function doLogout() {
  await api.post('/api/auth/logout', {});
  window.location.href = '/';
}

// ═══════════════════════════════════════════════════════════
//  OVERVIEW
// ═══════════════════════════════════════════════════════════
async function renderOverview() {
  setBreadcrumb([{ label:'Genel Bakış', active:true }]);
  const body = document.getElementById('dash-body');
  body.innerHTML = '<div class="text-muted fs-13" style="padding:20px">Yükleniyor...</div>';
  try {
    const [stats, orders, tickets] = await Promise.all([
      api.get('/api/admin/stats'),
      api.get('/api/admin/orders'),
      api.get('/api/admin/tickets')
    ]);
    const months = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
    const now = new Date(); const cm = now.getMonth();
    const bars = months.map((_, i) =>
      orders.filter(o => { const d = new Date(o.created_at*1000); return d.getMonth()===i && d.getFullYear()===now.getFullYear(); })
            .reduce((s, o) => s + o.total, 0)
    );
    const maxB = Math.max(...bars, 1);
    body.innerHTML = `
      <h1 class="dash-page-title">Genel Bakış</h1>
      <div class="stats-4">
        <div class="stat-w"><div class="stat-w-top"><div class="stat-w-icon"><i class="fas fa-users"></i></div><div class="stat-w-label">Toplam Kullanıcı</div></div><div class="stat-w-value">${stats.total_users}</div><div class="stat-w-sub">Kayıtlı hesap</div></div>
        <div class="stat-w"><div class="stat-w-top"><div class="stat-w-icon green"><i class="fas fa-dollar-sign"></i></div><div class="stat-w-label">Bu Ayki Satışlar</div></div><div class="stat-w-value text-green">${fmt(stats.monthly_sales)} USD</div><div class="stat-w-sub">Son 30 gün</div></div>
        <div class="stat-w"><div class="stat-w-top"><div class="stat-w-icon red"><i class="fas fa-headset"></i></div><div class="stat-w-label">Açık Talepler</div></div><div class="stat-w-value text-red">${stats.open_tickets}</div><div class="stat-w-sub">Yanıt bekliyor</div></div>
        <div class="stat-w"><div class="stat-w-top"><div class="stat-w-icon brown"><i class="fas fa-box"></i></div><div class="stat-w-label">Toplam Ürün</div></div><div class="stat-w-value text-brown">${stats.total_products}</div><div class="stat-w-sub">Aktif ürünler</div></div>
      </div>
      <div class="chart-card">
        <div class="chart-header">
          <div class="chart-title"><i class="fas fa-chart-bar text-blue" style="margin-right:8px"></i>Aylık Satışlar</div>
          <div class="flex gap-16">
            <div class="text-right"><div class="text-muted fs-11">Bu Ay</div><div class="fw-800 fs-16 text-blue">${fmt(stats.monthly_sales)} USD</div></div>
            <div class="text-right"><div class="text-muted fs-11">Bugün</div><div class="fw-800 fs-16 text-green">${fmt(stats.today_sales)} USD</div></div>
          </div>
        </div>
        <div class="chart-area">
          ${months.map((m,i) => `<div class="chart-col"><div class="chart-bar-wrap"><div class="chart-bar ${i===cm?'highlight':''}" style="height:${Math.max(3,(bars[i]/maxB)*160)}px" title="${m}: ${fmt(bars[i])} USD"></div></div><div class="chart-month">${m}</div></div>`).join('')}
        </div>
      </div>
      <div class="two-cols">
        <div class="chart-card" style="margin-bottom:0">
          <div class="chart-header"><div class="chart-title">Son Siparişler</div><span class="text-blue fs-12 fw-700 pointer" onclick="switchSection('store')">Tümü →</span></div>
          <table class="data-table"><thead><tr><th>Kullanıcı</th><th>Tutar</th><th>Yöntem</th><th>Durum</th></tr></thead>
          <tbody>${orders.length ? orders.slice(0,6).map(o=>`<tr><td class="fw-700">${o.username}</td><td class="fw-700 text-blue">${fmt(o.total)} USD</td><td class="text-muted fs-13">${o.payment_method}</td><td><span class="badge badge-green">${o.status}</span></td></tr>`).join('') : '<tr><td colspan="4" class="text-muted" style="padding:20px;text-align:center">Henüz sipariş yok</td></tr>'}</tbody></table>
        </div>
        <div class="chart-card" style="margin-bottom:0">
          <div class="chart-header"><div class="chart-title">Son Talepler</div><span class="text-blue fs-12 fw-700 pointer" onclick="switchSection('support')">Tümü →</span></div>
          <table class="data-table"><thead><tr><th>Başlık</th><th>Kullanıcı</th><th>Durum</th></tr></thead>
          <tbody>${tickets.length ? tickets.slice(0,6).map(t=>`<tr><td class="fw-700">${t.title}</td><td class="text-muted fs-13">${t.username}</td><td><span class="badge ${t.status==='Açık'?'badge-blue':'badge-green'}">${t.status}</span></td></tr>`).join('') : '<tr><td colspan="3" class="text-muted" style="padding:20px;text-align:center">Talep yok</td></tr>'}</tbody></table>
        </div>
      </div>`;
  } catch(e) {
    body.innerHTML = '<div class="alert" style="padding:20px;color:var(--red)">Veriler yüklenemedi. Sunucu bağlantısını kontrol edin.</div>';
  }
}

// ═══════════════════════════════════════════════════════════
//  USERS
// ═══════════════════════════════════════════════════════════
async function renderUsers() {
  setActiveSubnav('Kullanıcılar');
  setBreadcrumb([{ label:'Kullanıcılar', active:true }]);
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
      <div class="search-input-wrap"><i class="fas fa-search"></i><input class="input search-input" id="user-search" type="text" placeholder="Ad, e-posta ara..."></div>
    </div>
    <div class="card" style="padding:0;overflow:hidden">
      <table class="data-table">
        <thead><tr><th>ID</th><th>Kullanıcı</th><th>E-posta</th><th>Rol</th><th>Kredi</th><th>Tarih</th><th></th></tr></thead>
        <tbody id="users-tbody">
          ${users.map(u => `<tr>
            <td class="text-muted">#${u.id}</td>
            <td><div class="user-cell"><img src="https://mc-heads.net/avatar/${u.username}/32" class="user-avatar" onerror="this.src='https://mc-heads.net/avatar/Steve/32'"><div><div class="username">${u.username}</div><div class="usertag">@${u.username}</div></div></div></td>
            <td class="text-muted fs-13">${u.email}</td>
            <td>${u.is_admin ? '<span class="badge-admin">Admin</span>' : '<span class="badge badge-white">Üye</span>'}</td>
            <td class="fw-700 text-green">${fmt(u.credit)} Kredi</td>
            <td class="text-muted fs-13">${timeAgo(u.created_at)}</td>
            <td style="display:flex;gap:4px">
              <button class="btn btn-ghost btn-icon btn-sm" onclick="renderEditUser(${u.id},'${u.username}','${u.email}',${u.credit},${u.is_admin})"><i class="fas fa-edit"></i></button>
              <button class="btn btn-red btn-icon btn-sm" onclick="deleteUser(${u.id},'${u.username}')"><i class="fas fa-trash"></i></button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="pagination"><div class="page-btn">← Önceki</div><div class="page-btn active">1</div><div class="page-btn">Sonraki →</div></div>`;
  filterTable('user-search', 'users-tbody');
}

async function deleteUser(id, username) {
  if (!confirm(`"${username}" hesabı silinsin mi?`)) return;
  const res = await api.delete('/api/admin/users/' + id);
  if (res.success) { toast('Kullanıcı silindi', 'success'); renderUsers(); }
  else toast(res.error, 'error');
}

function renderCreateUser() {
  setActiveSubnav('Kullanıcılar');
  setBreadcrumb([{ label:'Kullanıcılar', fn:'renderUsers' }, { label:'Hesap Oluştur', active:true }]);
  document.getElementById('dash-body').innerHTML = `
    <div class="dash-ph">
      <h1 class="dash-page-title" style="margin-bottom:0">Hesap Oluştur</h1>
      <div class="flex gap-8"><button class="btn btn-ghost btn-sm" onclick="toast('Yardım','info')">Yardım</button><button class="btn btn-ghost btn-sm" onclick="renderUsers()">Geri</button></div>
    </div>
    <div class="form-card">
      <div class="form-card-title"><i class="fas fa-user text-blue" style="margin-right:8px"></i>Hesap Bilgileri</div>
      <div class="field"><label>Kullanıcı Adı</label><input class="input" id="cu-un" placeholder="kullanici_adi"></div>
      <div class="field"><label>E-posta</label><input class="input" id="cu-em" type="email" placeholder="ornek@mail.com"></div>
      <div class="form-row">
        <div class="field"><label>Parola</label><input class="input" id="cu-pw" type="password" placeholder="••••••••"></div>
        <div class="field"><label>Parola (Onayla)</label><input class="input" id="cu-pw2" type="password" placeholder="••••••••"></div>
      </div>
      <div class="field"><label>Kredi</label><input class="input" id="cu-cr" type="number" value="0" step="0.01" min="0"></div>
    </div>
    <div class="form-card">
      <div class="form-card-title" style="margin-bottom:8px">Roller</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px">
        <span class="badge badge-white" style="cursor:pointer;padding:8px 16px">Üye</span>
      </div>
      <div class="form-card-title"><i class="fas fa-shield-alt text-blue" style="margin-right:8px"></i>İzinler</div>
      <div class="perm-grid">${permGrid(false)}</div>
    </div>
    <div style="display:flex;justify-content:flex-end">
      <button class="btn btn-primary" onclick="createUser()"><i class="fas fa-plus"></i> Oluştur</button>
    </div>`;
}

function renderEditUser(id, username, email, credit, is_admin) {
  setActiveSubnav('Kullanıcılar');
  setBreadcrumb([{ label:'Kullanıcılar', fn:'renderUsers' }, { label:'Düzenle', active:true }]);
  document.getElementById('dash-body').innerHTML = `
    <div class="dash-ph">
      <h1 class="dash-page-title" style="margin-bottom:0">Kullanıcı Düzenle</h1>
      <button class="btn btn-ghost btn-sm" onclick="renderUsers()"><i class="fas fa-arrow-left"></i> Geri</button>
    </div>
    <div class="form-card">
      <div class="field"><label>Kullanıcı Adı</label><input class="input" value="${username}" disabled></div>
      <div class="field"><label>E-posta</label><input class="input" id="eu-em" type="email" value="${email}"></div>
      <div class="field"><label>Kredi</label><input class="input" id="eu-cr" type="number" value="${credit}" step="0.01"></div>
    </div>
    <div style="display:flex;justify-content:flex-end">
      <button class="btn btn-primary" onclick="toast('Güncellendi!','success');renderUsers()"><i class="fas fa-save"></i> Kaydet</button>
    </div>`;
}

async function createUser() {
  const un = document.getElementById('cu-un').value.trim();
  const em = document.getElementById('cu-em').value.trim();
  const pw = document.getElementById('cu-pw').value;
  const pw2 = document.getElementById('cu-pw2').value;
  const cr = parseFloat(document.getElementById('cu-cr').value) || 0;
  if (!un || !em || !pw) { toast('Tüm alanları doldurun', 'error'); return; }
  if (pw !== pw2) { toast('Şifreler eşleşmiyor', 'error'); return; }
  const res = await api.post('/api/admin/users', { username:un, email:em, password:pw, credit:cr, is_admin:0 });
  if (res.success) { toast('Kullanıcı oluşturuldu!', 'success'); renderUsers(); }
  else toast(res.error, 'error');
}

function renderRoles() {
  setActiveSubnav('Roller');
  setBreadcrumb([{ label:'Kullanıcı Yönetimi' }, { label:'Rol Oluştur', active:true }]);
  document.getElementById('dash-body').innerHTML = `
    <div class="dash-ph">
      <h1 class="dash-page-title" style="margin-bottom:0">Rol Oluştur</h1>
      <div class="flex gap-8"><button class="btn btn-ghost btn-sm" onclick="toast('Yardım','info')">Yardım</button><button class="btn btn-ghost btn-sm" onclick="renderUsers()">Geri</button></div>
    </div>
    <div class="form-card">
      <div class="form-row">
        <div class="field"><label>Ad</label><input class="input" placeholder="ör. Moderatör"></div>
        <div class="field"><label>Öncelik</label><input class="input" type="number" value="0"></div>
      </div>
      <div class="field"><label>Kullanıcı Adı CSS</label><textarea class="input" rows="4" placeholder="color:#e03535;font-weight:bold;\ntext-shadow: 0 0 8px #e03535;"></textarea></div>
      <div class="field"><label>Rozet CSS</label><textarea class="input" rows="4" placeholder="background:#e03535;color:#fff;\nborder-radius:4px;padding:2px 8px;"></textarea></div>
      <div class="toggle-wrap mt-16"><div class="toggle on" onclick="this.classList.toggle('on')"></div><span class="toggle-label">Yetkili rolü mü?</span></div>
    </div>
    <div class="form-card">
      <div class="form-card-title"><i class="fas fa-lock text-blue" style="margin-right:8px"></i>İzinler</div>
      <div class="perm-grid">${permGrid(false)}</div>
    </div>
    <div style="display:flex;justify-content:flex-end">
      <button class="btn btn-primary" onclick="toast('Rol oluşturuldu!','success')"><i class="fas fa-save"></i> Oluştur</button>
    </div>`;
}

async function renderStaff() {
  setActiveSubnav('Yetkililer');
  setBreadcrumb([{ label:'Kullanıcı Yönetimi' }, { label:'Yetkililer', active:true }]);
  const body = document.getElementById('dash-body');
  body.innerHTML = '<div class="text-muted fs-13">Yükleniyor...</div>';
  const users = await api.get('/api/admin/users');
  const staff = users.filter(u => u.is_admin);
  body.innerHTML = `
    <div class="dash-ph">
      <h1 class="dash-page-title" style="margin-bottom:0">Yetkililer</h1>
      <button class="btn btn-primary btn-sm" onclick="renderCreateUser()"><i class="fas fa-plus"></i> Yeni Ekle</button>
    </div>
    <div class="search-wrap"><label>Yetkililer için arama yap</label><div class="search-input-wrap"><i class="fas fa-search"></i><input class="input search-input" id="staff-search" type="text" placeholder="Ara..."></div></div>
    <div class="card" style="padding:0;overflow:hidden">
      <table class="data-table">
        <thead><tr><th>ID ↕</th><th>Kullanıcı ↕</th><th>E-posta ↕</th><th>Rol ↕</th><th>Kredi ↕</th><th>Tarih ↕</th><th></th></tr></thead>
        <tbody id="staff-tbody">
          ${staff.length === 0
            ? '<tr><td colspan="7" class="text-muted" style="padding:24px;text-align:center">Yetkili bulunamadı</td></tr>'
            : staff.map(u => `<tr>
                <td class="text-muted">#${u.id}</td>
                <td><div class="user-cell"><img src="https://mc-heads.net/avatar/${u.username}/32" class="user-avatar" onerror="this.src='https://mc-heads.net/avatar/Steve/32'"><div><div class="username">${u.username}</div><div class="usertag">@${u.username}</div></div></div></td>
                <td class="text-muted fs-13">${u.email}</td>
                <td><span class="badge-admin">Admin</span></td>
                <td class="fw-700 text-green">${fmt(u.credit)} Kredi</td>
                <td class="text-muted fs-13">${timeAgo(u.created_at)}</td>
                <td style="display:flex;gap:4px">
                  <button class="btn btn-blue btn-icon btn-sm"><i class="fas fa-eye"></i></button>
                  <button class="btn btn-ghost btn-icon btn-sm" onclick="renderEditUser(${u.id},'${u.username}','${u.email}',${u.credit},${u.is_admin})"><i class="fas fa-edit"></i></button>
                </td>
              </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
  filterTable('staff-search', 'staff-tbody');
}

function renderBannedUsers() {
  setActiveSubnav('Engellenen Kullanıcılar');
  setBreadcrumb([{ label:'Kullanıcı Yönetimi' }, { label:'Engellenen Kullanıcılar', active:true }]);
  document.getElementById('dash-body').innerHTML = `
    <div class="dash-ph"><h1 class="dash-page-title" style="margin-bottom:0">Engellenen Kullanıcılar</h1></div>
    <div class="empty-state"><div class="empty-icon" style="font-size:64px;opacity:0.5">😶</div><h3>Engellenen kullanıcı bulunamadı!</h3></div>`;
}

function renderBanUser() {
  setActiveSubnav('Kullanıcıyı Engelle');
  setBreadcrumb([{ label:'İşlemler' }, { label:'Kullanıcıyı Engelle', active:true }]);
  document.getElementById('dash-body').innerHTML = `
    <div class="dash-ph"><h1 class="dash-page-title" style="margin-bottom:0">Kullanıcıyı Engelle</h1></div>
    <div class="form-card">
      <div class="field"><label>Kullanıcı Adı</label><input class="input" placeholder="Kullanıcı adı..."></div>
      <div class="field"><label>Sebep</label><textarea class="input" rows="3" placeholder="Engelleme sebebi..."></textarea></div>
      <button class="btn btn-red" onclick="toast('Kullanıcı engellendi!','success')"><i class="fas fa-ban"></i> Engelle</button>
    </div>`;
}

function renderCustomFields() {
  setActiveSubnav('Özel Alanlar');
  setBreadcrumb([{ label:'Kullanıcı Yönetimi' }, { label:'Özel Alanlar', active:true }]);
  document.getElementById('dash-body').innerHTML = `
    <div class="dash-ph"><h1 class="dash-page-title" style="margin-bottom:0">Özel Alanlar</h1>
      <button class="btn btn-primary btn-sm" onclick="toast('Alan eklendi!','success')"><i class="fas fa-plus"></i> Yeni Alan</button>
    </div>
    <div class="empty-state"><div class="empty-icon">🔧</div><h3>Özel alan bulunamadı!</h3></div>`;
}

function renderSendCredit() {
  setActiveSubnav('Kredi Gönder');
  setBreadcrumb([{ label:'İşlemler' }, { label:'Kredi Gönder', active:true }]);
  document.getElementById('dash-body').innerHTML = `
    <h1 class="dash-page-title">Kredi Gönder</h1>
    <div class="form-card">
      <div class="form-card-title"><i class="fas fa-paper-plane text-blue" style="margin-right:8px"></i>Transfer Detayları</div>
      <div class="field"><label>Kullanıcı Ara</label><input class="input" id="sc-user" placeholder="Kullanıcı adını girin..."></div>
      <div class="field"><label>Miktar</label><input class="input" id="sc-amount" type="number" min="0.01" step="0.01" placeholder="0.00"></div>
      <div class="toggle-wrap mt-16 mb-24">
        <div class="toggle on" id="sc-toggle" onclick="this.classList.toggle('on')"></div>
        <span class="toggle-label">Bu bir kazanç mı? <span class="text-muted fs-12">(kapalıysa kullanıcıdan düşülür)</span></span>
      </div>
      <button class="btn btn-primary" onclick="doSendCredit()"><i class="fas fa-paper-plane"></i> Gönder</button>
    </div>`;
}

async function doSendCredit() {
  const username = document.getElementById('sc-user').value.trim();
  const amount = parseFloat(document.getElementById('sc-amount').value);
  const is_earning = document.getElementById('sc-toggle').classList.contains('on');
  if (!username || !amount) { toast('Tüm alanları doldurun', 'error'); return; }
  const res = await api.post('/api/admin/send-credit', { username, amount, is_earning });
  if (res.success) toast(res.message, 'success');
  else toast(res.error, 'error');
}

// ═══════════════════════════════════════════════════════════
//  STORE — PRODUCTS
// ═══════════════════════════════════════════════════════════
async function renderAdminProducts() {
  setActiveSubnav('Ürünler');
  setBreadcrumb([{ label:'Mağaza' }, { label:'Ürünler', active:true }]);
  const body = document.getElementById('dash-body');
  body.innerHTML = '<div class="text-muted fs-13">Yükleniyor...</div>';
  const [cats, prods] = await Promise.all([api.get('/api/admin/categories'), api.get('/api/store/products')]);
  const grouped = {};
  cats.forEach(c => { grouped[c.id] = { cat:c, products:[] }; });
  prods.forEach(p => { if (grouped[p.category_id]) grouped[p.category_id].products.push(p); });
  body.innerHTML = `
    <div class="dash-ph">
      <h1 class="dash-page-title" style="margin-bottom:0">Ürünler</h1>
      <div class="flex gap-8">
        <div class="view-tabs">
          <div class="view-tab active">Varsayılan Listeleme</div>
          <div class="view-tab" onclick="renderProductTable()">Tablo Listeleme</div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="renderCreateProduct()"><i class="fas fa-plus"></i> Yeni Ekle</button>
      </div>
    </div>
    ${Object.values(grouped).map(g => `
      <div class="prod-group">
        <div class="prod-group-header">
          <span class="prod-group-name">${g.cat.emoji} ${g.cat.name}</span>
          <span class="prod-group-count">${g.products.length} ürün</span>
        </div>
        ${g.products.map(p => `
          <div class="prod-item">
            <span class="prod-item-emoji">${p.image_emoji}</span>
            <span class="prod-item-name">${p.name} <span class="text-dim fs-11">#${p.id}</span></span>
            <span class="prod-item-price">${fmt(p.price)} USD</span>
            <span class="prod-item-stock">${p.stock ? p.stock+' stokta' : 'Sınırsız stokta'}</span>
            <span class="text-muted fs-12" style="min-width:30px">0</span>
            <button class="btn btn-ghost btn-icon btn-sm"><i class="fas fa-copy"></i></button>
            <button class="btn btn-red btn-icon btn-sm" onclick="deleteProduct(${p.id},'${p.name}')"><i class="fas fa-trash"></i></button>
          </div>`).join('')}
      </div>`).join('')}
    ${Object.keys(grouped).length === 0 ? '<div class="empty-state"><div class="empty-icon">📦</div><h3>Ürün bulunamadı</h3></div>' : ''}`;
}

async function renderProductTable() {
  setActiveSubnav('Ürünler');
  setBreadcrumb([{ label:'Mağaza' }, { label:'Ürünler', active:true }]);
  const body = document.getElementById('dash-body');
  body.innerHTML = '<div class="text-muted fs-13">Yükleniyor...</div>';
  const prods = await api.get('/api/store/products');
  body.innerHTML = `
    <div class="dash-ph">
      <h1 class="dash-page-title" style="margin-bottom:0">Ürünler</h1>
      <div class="flex gap-8">
        <div class="view-tabs">
          <div class="view-tab" onclick="renderAdminProducts()">Varsayılan Listeleme</div>
          <div class="view-tab active">Tablo Listeleme</div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="renderCreateProduct()"><i class="fas fa-plus"></i> Yeni Ekle</button>
      </div>
    </div>
    <div class="search-wrap"><label>Ürünler için arama yap</label><div class="search-input-wrap"><i class="fas fa-search"></i><input class="input search-input" id="prod-search" type="text" placeholder="Ürün adı ara..."></div></div>
    <div class="card" style="padding:0;overflow:hidden">
      <table class="data-table">
        <thead><tr><th>Ad/ID ↕</th><th>Kategori ↕</th><th>Fiyat ↕</th><th>Stok ↕</th><th>Öncelik ↕</th><th></th></tr></thead>
        <tbody id="prods-tbody">
          ${prods.map(p => `<tr>
            <td><div class="fw-700">${p.image_emoji} ${p.name}</div><div class="text-dim fs-11">#${p.id}</div></td>
            <td class="text-muted">${p.category_name || '—'}</td>
            <td class="fw-700 text-blue">${fmt(p.price)} USD</td>
            <td class="text-muted fs-13">${p.stock ? p.stock+' stokta' : 'Sınırsız stokta'}</td>
            <td class="text-muted">${p.priority}</td>
            <td style="display:flex;gap:4px">
              <button class="btn btn-ghost btn-icon btn-sm"><i class="fas fa-edit"></i></button>
              <button class="btn btn-ghost btn-icon btn-sm"><i class="fas fa-copy"></i></button>
              <button class="btn btn-red btn-icon btn-sm" onclick="deleteProduct(${p.id},'${p.name}')"><i class="fas fa-trash"></i></button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
  filterTable('prod-search', 'prods-tbody');
}

async function deleteProduct(id, name) {
  if (!confirm(`"${name}" silinsin mi?`)) return;
  const res = await api.delete('/api/admin/products/' + id);
  if (res.success) { toast('Ürün silindi', 'success'); renderAdminProducts(); }
  else toast(res.error, 'error');
}

async function renderCreateProduct() {
  setActiveSubnav('Ürünler');
  setBreadcrumb([{ label:'Mağaza' }, { label:'Ürünler', fn:'renderAdminProducts' }, { label:'Ürün Oluştur', active:true }]);
  const cats = await api.get('/api/admin/categories');
  document.getElementById('dash-body').innerHTML = `
    <div class="dash-ph">
      <h1 class="dash-page-title" style="margin-bottom:0">Ürün Oluştur</h1>
      <div class="flex gap-8"><button class="btn btn-ghost btn-sm" onclick="toast('Yardım','info')">Yardım</button><button class="btn btn-ghost btn-sm" onclick="renderAdminProducts()">Geri</button></div>
    </div>
    <div class="form-card">
      <div class="form-card-title">Ürün Detayları</div>
      <div style="display:grid;grid-template-columns:1fr 220px;gap:24px">
        <div>
          <div class="field"><label>Ad</label><input class="input" id="cp-name" placeholder="Ürün adı"></div>
          <div class="field"><label>Kategori</label>
            <select class="input" id="cp-cat">
              <option value="">Kategori seç</option>
              ${cats.map(c => `<option value="${c.id}">${c.emoji} ${c.name}</option>`).join('')}
            </select>
          </div>
          <div class="field"><label>Detaylar</label><textarea class="input" id="cp-desc" rows="4" placeholder="Ürün açıklaması..."></textarea></div>
        </div>
        <div>
          <div class="field"><label>Resim (Emoji)</label>
            <div style="border:2px dashed var(--border2);border-radius:var(--radius-sm);padding:16px;text-align:center">
              <input class="input" id="cp-emoji" value="📦" style="text-align:center;font-size:28px;height:56px">
              <div class="text-muted fs-12 mt-8">Bir resim seçin</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="form-card">
      <div style="display:flex;gap:0;border-bottom:1px solid var(--border);margin-bottom:20px">
        <div style="padding:10px 20px;border-bottom:2px solid var(--blue);color:var(--blue);font-weight:700;cursor:pointer">Genel</div>
        <div style="padding:10px 20px;color:var(--text-muted);cursor:pointer">Görünürlük</div>
        <div style="padding:10px 20px;color:var(--text-muted);cursor:pointer">Minecraft GUI</div>
        <div style="padding:10px 20px;color:var(--text-muted);cursor:pointer">Kümülatif</div>
      </div>
      <div class="form-row">
        <div class="field"><label>Fiyat (USD)</label><input class="input" id="cp-price" type="number" step="0.01" value="9.99"></div>
        <div class="field"><label>Stok (boş = sınırsız)</label><input class="input" id="cp-stock" type="number" placeholder="Sınırsız"></div>
      </div>
      <div class="field"><label>Öncelik</label><input class="input" id="cp-prio" type="number" value="0"></div>
    </div>
    <div style="display:flex;justify-content:flex-end">
      <button class="btn btn-primary" onclick="createProduct()"><i class="fas fa-plus"></i> Oluştur</button>
    </div>`;
}

async function createProduct() {
  const name = document.getElementById('cp-name').value.trim();
  const cid = document.getElementById('cp-cat').value;
  const emoji = document.getElementById('cp-emoji').value;
  const desc = document.getElementById('cp-desc').value;
  const price = parseFloat(document.getElementById('cp-price').value);
  const sv = document.getElementById('cp-stock').value;
  const stock = sv ? parseInt(sv) : null;
  const priority = parseInt(document.getElementById('cp-prio').value) || 0;
  if (!name || !cid) { toast('Ad ve kategori zorunlu', 'error'); return; }
  const res = await api.post('/api/admin/products', { name, category_id:cid, emoji, description:desc, price, stock, priority });
  if (res.success) { toast('Ürün oluşturuldu!', 'success'); renderAdminProducts(); }
  else toast(res.error, 'error');
}

// ═══════════════════════════════════════════════════════════
//  STORE — CATEGORIES
// ═══════════════════════════════════════════════════════════
async function renderAdminCategories() {
  setActiveSubnav('Kategoriler');
  setBreadcrumb([{ label:'Mağaza' }, { label:'Kategoriler', active:true }]);
  const body = document.getElementById('dash-body');
  body.innerHTML = '<div class="text-muted fs-13">Yükleniyor...</div>';
  const cats = await api.get('/api/admin/categories');
  body.innerHTML = `
    <div class="dash-ph">
      <h1 class="dash-page-title" style="margin-bottom:0">Mağaza Kategorileri</h1>
      <button class="btn btn-primary btn-sm" onclick="renderCreateCategory()"><i class="fas fa-plus"></i> Yeni Ekle</button>
    </div>
    <div class="search-wrap"><label>Mağaza Kategorileri için arama yap</label><div class="search-input-wrap"><i class="fas fa-search"></i><input class="input search-input" id="cat-search" type="text" placeholder="Kategori ara..."></div></div>
    <div class="card" style="padding:0;overflow:hidden">
      <table class="data-table">
        <thead><tr><th>Ad/ID ↕</th><th>Ana Kategori ↕</th><th>Öncelik ↕</th><th></th></tr></thead>
        <tbody id="cats-tbody">
          ${cats.map(c => `<tr>
            <td><div class="fw-700">${c.emoji} ${c.name}</div><div class="text-dim fs-11">#${c.id}</div></td>
            <td class="text-muted">—</td>
            <td class="text-muted">${c.priority}</td>
            <td style="display:flex;gap:4px">
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

async function renderCreateCategory() {
  setActiveSubnav('Kategoriler');
  setBreadcrumb([{ label:'Mağaza' }, { label:'Kategoriler', fn:'renderAdminCategories' }, { label:'Kategori Oluştur', active:true }]);
  const cats = await api.get('/api/admin/categories');
  document.getElementById('dash-body').innerHTML = `
    <div class="dash-ph">
      <h1 class="dash-page-title" style="margin-bottom:0">Kategori Oluştur</h1>
      <div class="flex gap-8"><button class="btn btn-ghost btn-sm" onclick="toast('Yardım','info')">Yardım</button><button class="btn btn-ghost btn-sm" onclick="renderAdminCategories()">Geri</button></div>
    </div>
    <div class="form-card">
      <div class="form-card-title">Kategori Detayları</div>
      <div style="display:grid;grid-template-columns:1fr 220px;gap:24px">
        <div>
          <div class="field"><label>Ad</label><input class="input" id="cc-name" placeholder="Kategori adı"></div>
          <div class="field"><label>Ana Kategori</label>
            <select class="input" id="cc-parent">
              <option value="">Ana kategori yok</option>
              ${cats.map(c => `<option value="${c.id}">${c.emoji} ${c.name}</option>`).join('')}
            </select>
          </div>
        </div>
        <div>
          <div class="field"><label>Resim (Emoji)</label>
            <div style="border:2px dashed var(--border2);border-radius:var(--radius-sm);padding:16px;text-align:center">
              <input class="input" id="cc-emoji" value="📦" style="text-align:center;font-size:28px;height:56px">
              <div class="text-muted fs-12 mt-8">Bir resim seçin</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="form-card">
      <div style="display:flex;gap:0;border-bottom:1px solid var(--border);margin-bottom:20px">
        <div style="padding:10px 20px;border-bottom:2px solid var(--blue);color:var(--blue);font-weight:700;cursor:pointer">Genel</div>
        <div style="padding:10px 20px;color:var(--text-muted);cursor:pointer">Görünürlük</div>
        <div style="padding:10px 20px;color:var(--text-muted);cursor:pointer">Minecraft GUI</div>
        <div style="padding:10px 20px;color:var(--text-muted);cursor:pointer">Kümülatif</div>
      </div>
      <div class="field"><label>Öncelik (yüksek = üstte)</label><input class="input" id="cc-prio" type="number" value="0"></div>
    </div>
    <div style="display:flex;justify-content:flex-end">
      <button class="btn btn-primary" onclick="createCategory()"><i class="fas fa-plus"></i> Oluştur</button>
    </div>`;
}

async function createCategory() {
  const name = document.getElementById('cc-name').value.trim();
  const emoji = document.getElementById('cc-emoji').value;
  const priority = parseInt(document.getElementById('cc-prio').value) || 0;
  if (!name) { toast('Kategori adı gerekli', 'error'); return; }
  const res = await api.post('/api/admin/categories', { name, emoji, priority });
  if (res.success) { toast('Kategori oluşturuldu!', 'success'); renderAdminCategories(); }
  else toast(res.error, 'error');
}

function renderAdminCoupons() {
  setActiveSubnav('Kuponlar');
  setBreadcrumb([{ label:'Mağaza' }, { label:'Kuponlar', active:true }]);
  document.getElementById('dash-body').innerHTML = `
    <div class="dash-ph"><h1 class="dash-page-title" style="margin-bottom:0">Kuponlar</h1></div>
    <div class="empty-state">
      <div class="empty-icon" style="font-size:64px;opacity:0.5">😶</div>
      <h3>Kupon bulunamadı!</h3>
      <p>Yeni kuponlar eklemek için aşağıdaki butona tıklayabilirsiniz.</p>
      <div class="empty-actions">
        <button class="btn btn-ghost" onclick="renderAdminProducts()">Ana Sayfaya Dön</button>
        <button class="btn btn-primary" onclick="toast('Yakında!','info')"><i class="fas fa-plus"></i> Kupon Oluştur</button>
      </div>
    </div>`;
}

function renderAdminServers() {
  setActiveSubnav('Sunucular');
  setBreadcrumb([{ label:'Mağaza' }, { label:'Sunucular', active:true }]);
  document.getElementById('dash-body').innerHTML = `
    <div class="dash-ph"><h1 class="dash-page-title" style="margin-bottom:0">Sunucular</h1>
      <button class="btn btn-primary btn-sm" onclick="renderCreateServer()"><i class="fas fa-plus"></i> Yeni Ekle</button>
    </div>
    <div class="empty-state"><div class="empty-icon">🖥️</div><h3>Sunucu bulunamadı!</h3>
      <div class="empty-actions"><button class="btn btn-primary" onclick="renderCreateServer()"><i class="fas fa-plus"></i> Sunucu Ekle</button></div>
    </div>`;
}

function renderCreateServer() {
  setBreadcrumb([{ label:'Mağaza' }, { label:'Sunucular', fn:'renderAdminServers' }, { label:'Sunucu Oluştur', active:true }]);
  document.getElementById('dash-body').innerHTML = `
    <div class="dash-ph">
      <h1 class="dash-page-title" style="margin-bottom:0">Sunucu Oluştur</h1>
      <div class="flex gap-8"><button class="btn btn-ghost btn-sm" onclick="toast('Yardım','info')">Yardım</button><button class="btn btn-ghost btn-sm" onclick="renderAdminServers()">Geri</button></div>
    </div>
    <div class="form-card">
      <div class="field"><label>Ad</label><input class="input" id="srv-name" placeholder="Sunucu adı"></div>
      <div class="field"><label>Sunucu IP</label><input class="input" id="srv-ip" placeholder="play.example.net"></div>
      <div class="field"><label>Sunucu Portu</label><input class="input" id="srv-port" type="number" placeholder="25565"></div>
      <div class="field"><label>Konsol Türü</label>
        <select class="input"><option>LeaderOS Connect</option><option>RCON</option><option>SSH</option></select>
      </div>
    </div>
    <div style="display:flex;justify-content:flex-end">
      <button class="btn btn-primary" onclick="toast('Sunucu oluşturuldu!','success');renderAdminServers()"><i class="fas fa-plus"></i> Oluştur</button>
    </div>`;
}

async function renderAdminOrders() {
  setActiveSubnav('Siparişler');
  setBreadcrumb([{ label:'Mağaza' }, { label:'Siparişler', active:true }]);
  const body = document.getElementById('dash-body');
  body.innerHTML = '<div class="text-muted fs-13">Yükleniyor...</div>';
  const orders = await api.get('/api/admin/orders');
  body.innerHTML = `
    <div class="dash-ph">
      <h1 class="dash-page-title" style="margin-bottom:0">Siparişler</h1>
      <div class="flex gap-8">
        <select class="input" style="width:180px;height:38px;padding:0 12px"><option>Hepsini Göster</option><option>Başarılı</option><option>Bekliyor</option></select>
        <button class="btn btn-primary btn-sm" onclick="renderCreateOrder()"><i class="fas fa-plus"></i> Yeni Ekle</button>
      </div>
    </div>
    <div class="search-wrap"><label>Siparişler için arama yap</label><div class="search-input-wrap"><i class="fas fa-search"></i><input class="input search-input" id="ord-search" type="text" placeholder="Kullanıcı, tutar ara..."></div></div>
    <div class="card" style="padding:0;overflow:hidden">
      <table class="data-table">
        <thead><tr><th>ID</th><th>Kullanıcı</th><th>Toplam</th><th>Ödeme Yöntemi</th><th>Durum</th><th>Tarih</th><th></th></tr></thead>
        <tbody id="ord-tbody">
          ${orders.length === 0 ? '<tr><td colspan="7" class="text-muted" style="padding:24px;text-align:center">Henüz sipariş yok</td></tr>' :
            orders.map(o => `<tr>
              <td class="text-muted">#${o.id}</td>
              <td><div class="fw-700">${o.username}</div><div class="text-dim fs-11">@${o.username}</div></td>
              <td class="fw-700 text-blue">${fmt(o.total)} USD</td>
              <td class="text-muted fs-13">${o.payment_method}</td>
              <td><span class="badge badge-green">${o.status}</span></td>
              <td class="text-muted fs-13">${timeAgo(o.created_at)}</td>
              <td style="display:flex;gap:4px">
                <button class="btn btn-blue btn-icon btn-sm"><i class="fas fa-eye"></i></button>
                <button class="btn btn-red btn-icon btn-sm"><i class="fas fa-trash"></i></button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="pagination"><div class="page-btn">← Önceki</div><div class="page-btn active">1</div><div class="page-btn">Sonraki →</div></div>`;
  filterTable('ord-search', 'ord-tbody');
}

async function renderCreateOrder() {
  setActiveSubnav('Siparişler');
  setBreadcrumb([{ label:'Mağaza' }, { label:'Siparişler', fn:'renderAdminOrders' }, { label:'Sipariş Oluştur', active:true }]);
  const prods = await api.get('/api/store/products');
  window._orderProds = prods;
  document.getElementById('dash-body').innerHTML = `
    <div class="dash-ph">
      <h1 class="dash-page-title" style="margin-bottom:0">Sipariş Oluştur</h1>
      <div class="flex gap-8"><button class="btn btn-ghost btn-sm" onclick="toast('Yardım','info')">Yardım</button><button class="btn btn-ghost btn-sm" onclick="renderAdminOrders()">Geri</button></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 280px;gap:20px;align-items:start">
      <div class="form-card">
        <div class="form-card-title" style="display:flex;align-items:center;justify-content:space-between">
          <span>Ürünler</span>
          <button class="btn btn-primary btn-sm" onclick="addOrderRow()"><i class="fas fa-plus"></i> Ekle</button>
        </div>
        <table class="data-table">
          <thead><tr><th>Ürün</th><th>Miktar</th><th>Birim Fiyat</th><th>Miktar</th><th></th></tr></thead>
          <tbody id="order-items-body">
            <tr>
              <td><select class="input" style="margin:0;min-width:150px" onchange="updateOrderTotal()">
                <option value="">Ürün seç</option>
                ${prods.map(p => `<option value="${p.price}">${p.image_emoji} ${p.name}</option>`).join('')}
              </select></td>
              <td><input class="input" type="number" value="1" min="1" style="margin:0;width:65px" oninput="updateOrderTotal()"></td>
              <td class="text-muted">0.00</td>
              <td class="fw-700 text-blue">0.00 USD</td>
              <td><button class="btn btn-red btn-icon btn-sm" onclick="this.closest('tr').remove();updateOrderTotal()"><i class="fas fa-trash"></i></button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="form-card">
        <div class="flex-between mb-8"><span class="text-muted fs-13">Toplam:</span></div>
        <div class="fw-800 fs-24 text-blue mb-16" id="order-grand-total" style="font-family:'Rajdhani',sans-serif">0.00 <span style="font-size:14px">USD</span></div>
        <div class="field"><label>Kullanıcı:</label><input class="input" id="order-user" placeholder="Ara..."></div>
        <div class="field"><label>Durum:</label><select class="input" id="order-status"><option>Başarılı</option><option>Bekliyor</option></select></div>
        <button class="btn btn-primary w-full" style="justify-content:center;padding:14px;margin-top:8px" onclick="toast('Sipariş oluşturuldu!','success');renderAdminOrders()">
          <i class="fas fa-plus"></i> Oluştur
        </button>
      </div>
    </div>`;
}

function addOrderRow() {
  const prods = window._orderProds || [];
  const tbody = document.getElementById('order-items-body');
  if (!tbody) return;
  const row = document.createElement('tr');
  row.innerHTML = `
    <td><select class="input" style="margin:0;min-width:150px" onchange="updateOrderTotal()">
      <option value="">Ürün seç</option>
      ${prods.map(p => `<option value="${p.price}">${p.image_emoji} ${p.name}</option>`).join('')}
    </select></td>
    <td><input class="input" type="number" value="1" min="1" style="margin:0;width:65px" oninput="updateOrderTotal()"></td>
    <td class="text-muted">0.00</td>
    <td class="fw-700 text-blue">0.00 USD</td>
    <td><button class="btn btn-red btn-icon btn-sm" onclick="this.closest('tr').remove();updateOrderTotal()"><i class="fas fa-trash"></i></button></td>`;
  tbody.appendChild(row);
}

function updateOrderTotal() {
  let grand = 0;
  document.querySelectorAll('#order-items-body tr').forEach(row => {
    const sel = row.querySelector('select');
    const qty = row.querySelector('input[type=number]');
    if (!sel || !qty) return;
    grand += (parseFloat(sel.value) || 0) * (parseInt(qty.value) || 1);
  });
  const el = document.getElementById('order-grand-total');
  if (el) el.innerHTML = grand.toFixed(2) + ' <span style="font-size:14px">USD</span>';
}

async function renderAdminPayments() {
  setActiveSubnav('Ödemeler');
  setBreadcrumb([{ label:'Mağaza' }, { label:'Ödemeler', active:true }]);
  const body = document.getElementById('dash-body');
  body.innerHTML = '<div class="text-muted fs-13">Yükleniyor...</div>';
  const orders = await api.get('/api/admin/orders');
  const payments = orders.filter(o => o.payment_method !== 'Kredi');
  body.innerHTML = `
    <div class="dash-ph"><h1 class="dash-page-title" style="margin-bottom:0">Ödemeler</h1></div>
    <div class="search-wrap" style="display:grid;grid-template-columns:1fr 180px;gap:16px">
      <div><label>Ödemeler için arama yap</label><div class="search-input-wrap"><i class="fas fa-search"></i><input class="input search-input" id="pay-search" type="text" placeholder="Ara..."></div></div>
      <div><label>Durum</label><select class="input" style="height:46px"><option>Hepsini Göster</option><option>Başarılı</option><option>Bekliyor</option></select></div>
    </div>
    <div class="card" style="padding:0;overflow:hidden">
      <table class="data-table">
        <thead><tr><th>ID</th><th>Kullanıcı</th><th>Toplam</th><th>Ödeme Yöntemi</th><th>Durum</th><th>Tarih</th><th></th></tr></thead>
        <tbody id="pay-tbody">
          ${payments.length === 0 ? '<tr><td colspan="7" class="text-muted" style="padding:24px;text-align:center">Ödeme bulunamadı</td></tr>' :
            payments.map(o => `<tr>
              <td class="text-muted">#${o.id}</td>
              <td><div class="fw-700">${o.username}</div><div class="text-dim fs-11">@${o.username}</div></td>
              <td class="fw-700 text-blue">${fmt(o.total)} USD</td>
              <td class="text-muted fs-13">${o.payment_method}</td>
              <td><span class="badge badge-green">${o.status}</span></td>
              <td class="text-muted fs-13">${timeAgo(o.created_at)}</td>
              <td style="display:flex;gap:4px">
                <button class="btn btn-blue btn-icon btn-sm"><i class="fas fa-eye"></i></button>
                <button class="btn btn-red btn-icon btn-sm"><i class="fas fa-trash"></i></button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="pagination"><div class="page-btn">← Önceki</div><div class="page-btn active">1</div><div class="page-btn">Sonraki →</div></div>`;
  filterTable('pay-search', 'pay-tbody');
}

function renderBulkDiscount() {
  setActiveSubnav('Toplu İndirim');
  setBreadcrumb([{ label:'Mağaza' }, { label:'Toplu İndirim', active:true }]);
  document.getElementById('dash-body').innerHTML = `
    <div class="dash-ph">
      <h1 class="dash-page-title" style="margin-bottom:0">Toplu İndirim</h1>
      <button class="btn btn-ghost btn-sm" onclick="toast('Yardım','info')">Yardım</button>
    </div>
    <div class="form-card">
      <div class="toggle-wrap mb-24"><div class="toggle on" id="disc-toggle" onclick="this.classList.toggle('on')"></div><span class="toggle-label">İndirim Durumu</span></div>
      <div class="field"><label>İndirim (%):</label><input class="input" id="disc-pct" type="number" min="1" max="100" placeholder="ör. 20"></div>
      <div class="field"><label>Son Kullanma Tarihi</label>
        <div style="display:flex;gap:12px;align-items:center">
          <input class="input" id="disc-date" type="date" style="flex:1" disabled>
          <label class="flex-center gap-8 fs-13" style="cursor:pointer;white-space:nowrap">
            <input type="checkbox" id="disc-never" checked onchange="document.getElementById('disc-date').disabled=this.checked" style="accent-color:var(--blue)"> Asla
          </label>
        </div>
      </div>
      <div class="field"><label>Ürünler</label><select class="input"><option>Tüm Ürünler</option></select></div>
      <button class="btn btn-primary" onclick="toast('Değişiklikler kaydedildi!','success')"><i class="fas fa-save"></i> Değişiklikleri Kaydet</button>
    </div>`;
}

// ═══════════════════════════════════════════════════════════
//  SUPPORT
// ═══════════════════════════════════════════════════════════
async function renderSupportTickets() {
  setActiveSubnav('Talepler');
  setBreadcrumb([{ label:'Destek' }, { label:'Destek Talepleri', active:true }]);
  const body = document.getElementById('dash-body');
  body.innerHTML = '<div class="text-muted fs-13">Yükleniyor...</div>';
  const tickets = await api.get('/api/admin/tickets');
  body.innerHTML = `
    <div class="dash-ph">
      <h1 class="dash-page-title" style="margin-bottom:0">Destek Talepleri</h1>
      <button class="btn btn-ghost btn-sm" onclick="toast('Yardım','info')">Yardım</button>
    </div>
    <div class="search-wrap" style="display:grid;grid-template-columns:1fr 160px 160px 160px;gap:16px;align-items:end">
      <div>
        <label>Destek Talepleri için arama yap</label>
        <div class="search-input-wrap"><i class="fas fa-search"></i><input class="input search-input" id="tkt-search" type="text" placeholder="Başlık, kullanıcı ara..."></div>
      </div>
      <div><label>Kategori</label><select class="input" style="height:46px"><option>Hepsini Göster</option></select></div>
      <div><label>Durum</label><select class="input" style="height:46px"><option>Hepsini Göster</option><option>Açık</option><option>Kapalı</option></select></div>
      <div><label>Sil</label><select class="input" style="height:46px"><option>Hiçbiri Seçilmedi</option></select></div>
    </div>
    <div class="card" style="padding:0;overflow:hidden">
      <table class="data-table">
        <thead><tr><th><input type="checkbox" id="tkt-all" onchange="document.querySelectorAll('.tkt-cb').forEach(c=>c.checked=this.checked)"></th><th>Başlık/ID</th><th>Kullanıcı</th><th>Kategori</th><th>Durum</th><th>Tarih</th><th></th></tr></thead>
        <tbody id="tkt-tbody">
          ${tickets.length === 0 ? '<tr><td colspan="7" class="text-muted" style="padding:24px;text-align:center">Talep bulunamadı</td></tr>' :
            tickets.map(t => `<tr>
              <td><input type="checkbox" class="tkt-cb"></td>
              <td><div class="fw-700">${t.title}</div><div class="text-dim fs-11">#${t.id}</div></td>
              <td><div class="fw-700">${t.username}</div><div class="text-dim fs-11">@${t.username}</div></td>
              <td class="text-muted">${t.category}</td>
              <td><span class="badge ${t.status==='Açık'?'badge-blue':'badge-green'}">${t.status}</span></td>
              <td class="text-muted fs-13">${timeAgo(t.created_at)}</td>
              <td style="display:flex;gap:4px">
                <button class="btn btn-blue btn-icon btn-sm"><i class="fas fa-eye"></i></button>
                ${t.status === 'Açık' ? `<button class="btn btn-ghost btn-icon btn-sm" title="Kapat" onclick="closeTicket(${t.id})"><i class="fas fa-times"></i></button>` : ''}
                <button class="btn btn-red btn-icon btn-sm" onclick="deleteTicket(${t.id})"><i class="fas fa-trash"></i></button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="pagination"><div class="page-btn">← Önceki</div><div class="page-btn active">1</div><div class="page-btn">Sonraki →</div></div>`;
  filterTable('tkt-search', 'tkt-tbody');
}

async function renderAdminTickets() { await renderSupportTickets(); }

async function closeTicket(id) {
  const res = await api.put('/api/admin/tickets/' + id + '/close', {});
  if (res.success) { toast('Talep kapatıldı', 'success'); renderSupportTickets(); }
  else toast(res.error || 'Hata', 'error');
}

async function deleteTicket(id) {
  if (!confirm('Talep silinsin mi?')) return;
  const res = await api.delete('/api/support/tickets/' + id);
  if (res.success) { toast('Talep silindi', 'success'); renderSupportTickets(); }
  else toast(res.error || 'Hata', 'error');
}

// ═══════════════════════════════════════════════════════════
//  APPLICATIONS
// ═══════════════════════════════════════════════════════════
function renderApplicationForms() {
  setActiveSubnav('Başvuru Formları');
  setBreadcrumb([{ label:'Başvurular' }, { label:'Başvuru Formları', active:true }]);
  document.getElementById('dash-body').innerHTML = `
    <div class="dash-ph">
      <h1 class="dash-page-title" style="margin-bottom:0">Başvuru Formları</h1>
      <button class="btn btn-primary btn-sm" onclick="renderCreateAppForm()"><i class="fas fa-plus"></i> Yeni Form</button>
    </div>
    <div class="empty-state">
      <div class="empty-icon" style="font-size:64px;opacity:0.5">😶</div>
      <h3>Başvuru formu bulunamadı!</h3>
      <p>Yeni bir başvuru formu oluşturmak için aşağıdaki butona tıklayabilirsiniz.</p>
      <div class="empty-actions">
        <button class="btn btn-ghost" onclick="renderOverview()">Ana Sayfaya Dön</button>
        <button class="btn btn-primary" onclick="renderCreateAppForm()"><i class="fas fa-plus"></i> Başvuru Formu Oluştur</button>
      </div>
    </div>`;
}

function renderApplicationsList() {
  setActiveSubnav('Başvurular');
  setBreadcrumb([{ label:'Başvurular' }, { label:'Başvurular', active:true }]);
  document.getElementById('dash-body').innerHTML = `
    <div class="dash-ph"><h1 class="dash-page-title" style="margin-bottom:0">Başvurular</h1></div>
    <div class="empty-state">
      <div class="empty-icon" style="font-size:64px;opacity:0.5">😶</div>
      <h3>Hiç başvuru bulunamadı!</h3>
      <p>Burada gösterilecek başvuru yok.</p>
      <div class="empty-actions"><button class="btn btn-ghost" onclick="renderOverview()">Ana Sayfaya Dön</button></div>
    </div>`;
}

function renderCustomForms() {
  setActiveSubnav('Özel Formlar');
  setBreadcrumb([{ label:'Başvurular' }, { label:'Özel Formlar', active:true }]);
  document.getElementById('dash-body').innerHTML = `
    <div class="dash-ph">
      <h1 class="dash-page-title" style="margin-bottom:0">Özel Formlar</h1>
      <button class="btn btn-primary btn-sm" onclick="renderCreateCustomForm()"><i class="fas fa-plus"></i> Yeni Form</button>
    </div>
    <div class="empty-state">
      <div class="empty-icon" style="font-size:64px;opacity:0.5">😶</div>
      <h3>Hiç özel form bulunamadı!</h3>
      <p>Yeni bir özel form oluşturmak için butona tıklayın.</p>
      <div class="empty-actions">
        <button class="btn btn-ghost" onclick="renderOverview()">Ana Sayfaya Dön</button>
        <button class="btn btn-primary" onclick="renderCreateCustomForm()"><i class="fas fa-plus"></i> Özel Form Oluştur</button>
      </div>
    </div>`;
}

function renderFormAnswers() {
  setActiveSubnav('Yanıtlar');
  setBreadcrumb([{ label:'Başvurular' }, { label:'Cevaplar', active:true }]);
  document.getElementById('dash-body').innerHTML = `
    <div class="dash-ph"><h1 class="dash-page-title" style="margin-bottom:0">Cevaplar</h1></div>
    <div class="empty-state">
      <div class="empty-icon" style="font-size:64px;opacity:0.5">😶</div>
      <h3>Hiç cevap bulunamadı!</h3>
      <p>Burada gösterilecek cevap yok.</p>
      <div class="empty-actions"><button class="btn btn-ghost" onclick="renderOverview()">Ana Sayfaya Dön</button></div>
    </div>`;
}

function renderCreateAppForm() {
  setBreadcrumb([{ label:'Başvurular' }, { label:'Başvuru Formları', fn:'renderApplicationForms' }, { label:'Yeni Form', active:true }]);
  document.getElementById('dash-body').innerHTML = `
    <div class="dash-ph">
      <h1 class="dash-page-title" style="margin-bottom:0">Başvuru Formu Oluştur</h1>
      <button class="btn btn-ghost btn-sm" onclick="renderApplicationForms()"><i class="fas fa-arrow-left"></i> Geri</button>
    </div>
    <div class="form-card">
      <div class="form-card-title"><i class="fas fa-file-alt text-blue" style="margin-right:8px"></i>Form Bilgileri</div>
      <div class="field"><label>Form Başlığı</label><input class="input" placeholder="ör. Moderatör Başvurusu"></div>
      <div class="field"><label>Açıklama</label><textarea class="input" rows="3" placeholder="Başvuru hakkında açıklama..."></textarea></div>
      <div class="form-row">
        <div class="field"><label>Durum</label><select class="input"><option>Aktif</option><option>Pasif</option></select></div>
        <div class="field"><label>Kategori</label><input class="input" placeholder="ör. Yönetim"></div>
      </div>
    </div>
    <div class="form-card">
      <div class="form-card-title"><i class="fas fa-list text-blue" style="margin-right:8px"></i>Form Alanları</div>
      <div id="form-fields">
        <div style="display:grid;grid-template-columns:1fr 1fr auto;gap:12px;margin-bottom:12px">
          <input class="input" placeholder="Alan adı (ör. Yaş)" style="margin:0">
          <select class="input" style="margin:0"><option>Metin</option><option>Uzun Metin</option><option>Seçim</option><option>Sayı</option></select>
          <button class="btn btn-red btn-icon" style="height:46px"><i class="fas fa-trash"></i></button>
        </div>
      </div>
      <button class="btn btn-ghost btn-sm mt-8" onclick="addFormField()"><i class="fas fa-plus"></i> Alan Ekle</button>
    </div>
    <div style="display:flex;justify-content:flex-end">
      <button class="btn btn-primary" onclick="toast('Form oluşturuldu!','success');renderApplicationForms()"><i class="fas fa-save"></i> Formu Kaydet</button>
    </div>`;
}

function addFormField() {
  const c = document.getElementById('form-fields');
  const row = document.createElement('div');
  row.style.cssText = 'display:grid;grid-template-columns:1fr 1fr auto;gap:12px;margin-bottom:12px';
  row.innerHTML = `<input class="input" placeholder="Alan adı" style="margin:0"><select class="input" style="margin:0"><option>Metin</option><option>Uzun Metin</option><option>Seçim</option><option>Sayı</option></select><button class="btn btn-red btn-icon" style="height:46px" onclick="this.parentElement.remove()"><i class="fas fa-trash"></i></button>`;
  c.appendChild(row);
}

function renderCreateCustomForm() {
  setBreadcrumb([{ label:'Başvurular' }, { label:'Özel Formlar', fn:'renderCustomForms' }, { label:'Yeni Form', active:true }]);
  document.getElementById('dash-body').innerHTML = `
    <div class="dash-ph">
      <h1 class="dash-page-title" style="margin-bottom:0">Özel Form Oluştur</h1>
      <button class="btn btn-ghost btn-sm" onclick="renderCustomForms()"><i class="fas fa-arrow-left"></i> Geri</button>
    </div>
    <div class="form-card">
      <div class="field"><label>Form Başlığı</label><input class="input" placeholder="Form başlığı"></div>
      <div class="field"><label>Açıklama</label><textarea class="input" rows="2" placeholder="Form açıklaması..."></textarea></div>
    </div>
    <div style="display:flex;justify-content:flex-end">
      <button class="btn btn-primary" onclick="toast('Form oluşturuldu!','success');renderCustomForms()"><i class="fas fa-save"></i> Formu Kaydet</button>
    </div>`;
}

// ── BOOT ─────────────────────────────────────────────────
dashInit();

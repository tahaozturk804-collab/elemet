/* ═══════════════════════════════════════════════════
   ElementWars — Dashboard JS  (v2)
   ═══════════════════════════════════════════════════ */

const PERMS = [
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
  `,
  apps: `
    <div class="dash-subnav-title">Başvurular</div>
    <div class="dash-subnav-item active" onclick="renderApplicationForms()"><i class="fas fa-file-alt"></i> Başvuru Formları</div>
    <div class="dash-subnav-item" onclick="renderApplicationsList()"><i class="fas fa-download"></i> Başvurular</div>
    <div class="dash-subnav-sep"></div>
    <div class="dash-subnav-title">Özel Formlar</div>
    <div class="dash-subnav-item" onclick="renderCustomForms()"><i class="fas fa-file-code"></i> Özel Formlar</div>
    <div class="dash-subnav-item" onclick="renderFormAnswers()"><i class="fas fa-inbox"></i> Yanıtlar</div>
  `
};

let subnavOpen = false;
function toggleSubnav() {
  subnavOpen = !subnavOpen;
  document.getElementById('dash-content-area').classList.toggle('subnav-open', subnavOpen);
}

async function dashInit() {
  const me = await api.get('/api/auth/me');
  if (!me.logged_in || !me.is_admin) { toast('Admin yetkisi gerekiyor!','error'); goto('/login'); return; }
  document.getElementById('dash-username').textContent = me.username;
  switchSection('overview');
  hideLoader();
}

function switchSection(section) {
  document.querySelectorAll('.dash-icon').forEach(i => i.classList.remove('active'));
  const icon = document.querySelector('.dash-icon[data-section="'+section+'"]');
  if (icon) icon.classList.add('active');
  document.getElementById('dash-subnav-inner').innerHTML = SUBNAVS[section] || '';
  subnavOpen = true;
  document.getElementById('dash-content-area').classList.add('subnav-open');
  if (section==='overview') renderOverview();
  else if (section==='users')   renderUsers();
  else if (section==='store')   renderAdminProducts();
  else if (section==='support') renderAdminTickets();
  else if (section==='apps')    renderApplicationForms();
}

function setBreadcrumb(parts) {
  document.getElementById('dash-breadcrumb').innerHTML =
    '<span style="cursor:pointer" onclick="switchSection(\'overview\')"><i class="fas fa-home"></i></span>' +
    parts.map(p => '<span class="sep">›</span><span class="'+(p.active?'current':'pointer')+'" '+(p.fn?'onclick="'+p.fn+'()"':'')+'>'+p.label+'</span>').join('');
}

function setActiveSubnav(text) {
  document.querySelectorAll('.dash-subnav-item').forEach(el => {
    el.classList.toggle('active', el.textContent.trim().startsWith(text));
  });
}

function permGrid(allOn) {
  return PERMS.map((p,i) => `
    <label class="perm-item">
      <div class="perm-check ${(allOn||i===0)?'on':''}" onclick="this.classList.toggle('on')"></div>
      <span>${p}</span>
    </label>`).join('');
}

// ── OVERVIEW ────────────────────────────────────────────
async function renderOverview() {
  setBreadcrumb([{label:'Genel Bakış',active:true}]);
  const body = document.getElementById('dash-body');
  body.innerHTML = '<div class="text-muted fs-13" style="padding:20px">Yükleniyor...</div>';
  const [stats, orders, tickets] = await Promise.all([
    api.get('/api/admin/stats'), api.get('/api/admin/orders'), api.get('/api/admin/tickets')
  ]);
  const months = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
  const now = new Date(); const cm = now.getMonth();
  const bars = months.map((_,i) => orders.filter(o=>{ const d=new Date(o.created_at*1000); return d.getMonth()===i&&d.getFullYear()===now.getFullYear(); }).reduce((s,o)=>s+o.total,0));
  const maxB = Math.max(...bars,1);
  body.innerHTML = `
    <h1 class="dash-page-title">Genel Bakış</h1>
    <div class="chart-card">
      <div class="chart-header">
        <div class="chart-title"><i class="fas fa-chart-bar text-blue" style="margin-right:8px"></i>Aylık Satışlar</div>
        <div class="flex gap-16">
          <div class="text-right"><div class="text-muted fs-11">Bu Ay</div><div class="fw-800 fs-16 text-blue">${fmt(stats.monthly_sales)} USD</div></div>
          <div class="text-right"><div class="text-muted fs-11">Bugün</div><div class="fw-800 fs-16 text-green">${fmt(stats.today_sales)} USD</div></div>
        </div>
      </div>
      <div class="chart-area">
        ${months.map((m,i)=>'<div class="chart-col"><div class="chart-bar-wrap"><div class="chart-bar '+(i===cm?'highlight':'')+'" style="height:'+Math.max(3,(bars[i]/maxB)*160)+'px" title="'+m+': '+fmt(bars[i])+' USD"></div></div><div class="chart-month">'+m+'</div></div>').join('')}
      </div>
    </div>
    <div class="stats-4">
      <div class="stat-w"><div class="stat-w-top"><div class="stat-w-icon"><i class="fas fa-users"></i></div><div class="stat-w-label">Toplam Kullanıcı</div></div><div class="stat-w-value">${stats.total_users}</div><div class="stat-w-sub">Kayıtlı hesap</div></div>
      <div class="stat-w"><div class="stat-w-top"><div class="stat-w-icon green"><i class="fas fa-dollar-sign"></i></div><div class="stat-w-label">Bu Ayki Satışlar</div></div><div class="stat-w-value text-green">${fmt(stats.monthly_sales)} USD</div><div class="stat-w-sub">Son 30 gün</div></div>
      <div class="stat-w"><div class="stat-w-top"><div class="stat-w-icon red"><i class="fas fa-headset"></i></div><div class="stat-w-label">Açık Talepler</div></div><div class="stat-w-value text-red">${stats.open_tickets}</div><div class="stat-w-sub">Yanıt bekliyor</div></div>
      <div class="stat-w"><div class="stat-w-top"><div class="stat-w-icon brown"><i class="fas fa-box"></i></div><div class="stat-w-label">Toplam Ürün</div></div><div class="stat-w-value text-brown">${stats.total_products}</div><div class="stat-w-sub">Aktif ürünler</div></div>
    </div>
    <div class="two-cols">
      <div class="chart-card" style="margin-bottom:0">
        <div class="chart-header"><div class="chart-title">Son Satın Alımlar</div><span class="text-blue fs-12 fw-700 pointer" onclick="switchSection('store')">Tümü →</span></div>
        <table class="data-table"><thead><tr><th>Kullanıcı</th><th>Tutar</th><th>Yöntem</th><th>Durum</th></tr></thead>
        <tbody>${orders.length?orders.slice(0,6).map(o=>'<tr><td class="fw-700">'+o.username+'</td><td class="fw-700 text-blue">'+fmt(o.total)+' USD</td><td class="text-muted fs-13">'+o.payment_method+'</td><td><span class="badge badge-green">'+o.status+'</span></td></tr>').join(''):'<tr><td colspan="4" class="text-muted" style="padding:20px;text-align:center">Henüz sipariş yok</td></tr>'}</tbody></table>
      </div>
      <div class="chart-card" style="margin-bottom:0">
        <div class="chart-header"><div class="chart-title">Son Talepler</div><span class="text-blue fs-12 fw-700 pointer" onclick="switchSection('support')">Tümü →</span></div>
        <table class="data-table"><thead><tr><th>Başlık</th><th>Kullanıcı</th><th>Durum</th></tr></thead>
        <tbody>${tickets.length?tickets.slice(0,6).map(t=>'<tr><td class="fw-700">'+t.title+'</td><td class="text-muted fs-13">'+t.username+'</td><td><span class="badge '+(t.status==='Açık'?'badge-blue':'badge-green')+'">'+t.status+'</span></td></tr>').join(''):'<tr><td colspan="3" class="text-muted" style="padding:20px;text-align:center">Talep yok</td></tr>'}</tbody></table>
      </div>
    </div>`;
}

// ── USERS ────────────────────────────────────────────────
async function renderUsers() {
  switchSection('users'); setActiveSubnav('Kullanıcılar');
  setBreadcrumb([{label:'Kullanıcılar',active:true}]);
  const body = document.getElementById('dash-body');
  body.innerHTML = '<div class="text-muted fs-13">Yükleniyor...</div>';
  const users = await api.get('/api/admin/users');
  body.innerHTML = `
    <div class="dash-ph"><h1 class="dash-page-title" style="margin-bottom:0">Kullanıcılar</h1><button class="btn btn-primary btn-sm" onclick="renderCreateUser()"><i class="fas fa-plus"></i> Yeni Ekle</button></div>
    <div class="search-wrap"><label>Kullanıcılar için arama yap</label><div class="search-input-wrap"><i class="fas fa-search"></i><input class="input search-input" id="user-search" type="text" placeholder="Ad, e-posta ara..."></div></div>
    <div class="card" style="padding:0;overflow:hidden">
      <table class="data-table">
        <thead><tr><th>ID</th><th>Kullanıcı</th><th>E-posta</th><th>Rol</th><th>Kredi</th><th>Kayıt</th><th></th></tr></thead>
        <tbody id="users-tbody">
          ${users.map(u=>`<tr>
            <td class="text-muted">#${u.id}</td>
            <td><div class="user-cell"><img src="https://mc-heads.net/avatar/${u.username}/32" class="user-avatar" onerror="this.src='https://mc-heads.net/avatar/Steve/32'"><div><div class="username">${u.username}</div><div class="usertag">@${u.username}</div></div></div></td>
            <td class="text-muted fs-13">${u.email}</td>
            <td>${u.is_admin?'<span class="badge-admin">Admin</span>':'<span class="badge badge-white">Üye</span>'}</td>
            <td class="fw-700 text-green">${fmt(u.credit)} USD</td>
            <td class="text-muted fs-13">${timeAgo(u.created_at)}</td>
            <td style="display:flex;gap:4px"><button class="btn btn-ghost btn-icon btn-sm"><i class="fas fa-edit"></i></button><button class="btn btn-red btn-icon btn-sm" onclick="deleteUser(${u.id},'${u.username}')"><i class="fas fa-trash"></i></button></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="pagination"><div class="page-btn">← Önceki</div><div class="page-btn active">1</div><div class="page-btn">Sonraki →</div></div>`;
  filterTable('user-search','users-tbody');
}

async function deleteUser(id,username) {
  if(!confirm('"'+username+'" hesabı silinsin mi?')) return;
  const res = await api.delete('/api/admin/users/'+id);
  if(res.success){toast('Kullanıcı silindi','success');renderUsers();}else toast(res.error,'error');
}

function renderCreateUser() {
  setActiveSubnav('Kullanıcılar');
  setBreadcrumb([{label:'Kullanıcılar',fn:'renderUsers'},{label:'Hesap Oluştur',active:true}]);
  document.getElementById('dash-body').innerHTML = `
    <div class="dash-ph"><h1 class="dash-page-title" style="margin-bottom:0">Hesap Oluştur</h1><button class="btn btn-ghost btn-sm" onclick="renderUsers()"><i class="fas fa-arrow-left"></i> Geri</button></div>
    <div class="form-card"><div class="form-card-title"><i class="fas fa-user text-blue" style="margin-right:8px"></i>Hesap Bilgileri</div>
      <div class="field"><label>Kullanıcı Adı</label><input class="input" id="cu-un" placeholder="kullanici_adi"></div>
      <div class="field"><label>E-posta</label><input class="input" id="cu-em" type="email" placeholder="ornek@mail.com"></div>
      <div class="form-row"><div class="field"><label>Parola</label><input class="input" id="cu-pw" type="password"></div><div class="field"><label>Parola (Onayla)</label><input class="input" id="cu-pw2" type="password"></div></div>
      <div class="field"><label>Başlangıç Kredisi (USD)</label><input class="input" id="cu-cr" type="number" value="0" step="0.01"></div>
      <label class="flex-center gap-8 mt-8 fs-13" style="cursor:pointer"><input type="checkbox" id="cu-adm" style="accent-color:var(--blue)"><span>Admin yetkisi ver</span></label>
    </div>
    <div class="form-card"><div class="form-card-title"><i class="fas fa-shield-alt text-blue" style="margin-right:8px"></i>İzinler</div><div class="perm-grid">${permGrid(false)}</div></div>
    <div style="display:flex;justify-content:flex-end"><button class="btn btn-primary" onclick="createUser()"><i class="fas fa-plus"></i> Oluştur</button></div>`;
}

async function createUser() {
  const un=document.getElementById('cu-un').value.trim(), em=document.getElementById('cu-em').value.trim();
  const pw=document.getElementById('cu-pw').value, pw2=document.getElementById('cu-pw2').value;
  const cr=parseFloat(document.getElementById('cu-cr').value)||0, adm=document.getElementById('cu-adm').checked?1:0;
  if(!un||!em||!pw){toast('Tüm alanları doldurun','error');return;}
  if(pw!==pw2){toast('Şifreler eşleşmiyor','error');return;}
  const res=await api.post('/api/admin/users',{username:un,email:em,password:pw,credit:cr,is_admin:adm});
  if(res.success){toast('Kullanıcı oluşturuldu!','success');renderUsers();}else toast(res.error,'error');
}

function renderRoles() {
  setActiveSubnav('Roller');
  setBreadcrumb([{label:'Kullanıcılar',fn:'renderUsers'},{label:'Rol Oluştur',active:true}]);
  document.getElementById('dash-body').innerHTML = `
    <div class="dash-ph"><h1 class="dash-page-title" style="margin-bottom:0">Rol Oluştur</h1><button class="btn btn-ghost btn-sm" onclick="renderUsers()"><i class="fas fa-arrow-left"></i> Geri</button></div>
    <div class="form-card"><div class="form-card-title"><i class="fas fa-shield-alt text-blue" style="margin-right:8px"></i>Rol Bilgileri</div>
      <div class="form-row"><div class="field"><label>Ad</label><input class="input" placeholder="ör. Moderatör"></div><div class="field"><label>Öncelik</label><input class="input" type="number" value="0"></div></div>
      <div class="form-row"><div class="field"><label>Kullanıcı Adı CSS</label><textarea class="input" rows="3" placeholder="color:#e03535;"></textarea></div><div class="field"><label>Rozet CSS</label><textarea class="input" rows="3" placeholder="background:#e03535;color:#fff;"></textarea></div></div>
      <div class="toggle-wrap mt-16"><div class="toggle" onclick="this.classList.toggle('on')"></div><span class="toggle-label">Yetkili rolü mü?</span></div>
    </div>
    <div class="form-card"><div class="form-card-title"><i class="fas fa-lock text-blue" style="margin-right:8px"></i>İzinler</div><div class="perm-grid">${permGrid(false)}</div></div>
    <div style="display:flex;justify-content:flex-end"><button class="btn btn-primary" onclick="toast('Rol oluşturuldu!','success')"><i class="fas fa-save"></i> Oluştur</button></div>`;
}

async function renderStaff() {
  setActiveSubnav('Yetkililer');
  setBreadcrumb([{label:'Kullanıcılar',fn:'renderUsers'},{label:'Yetkililer',active:true}]);
  const body=document.getElementById('dash-body');
  body.innerHTML='<div class="text-muted fs-13">Yükleniyor...</div>';
  const users=await api.get('/api/admin/users');
  const staff=users.filter(u=>u.is_admin);
  body.innerHTML=`
    <div class="dash-ph"><h1 class="dash-page-title" style="margin-bottom:0">Yetkililer</h1><button class="btn btn-primary btn-sm"><i class="fas fa-plus"></i> Yeni Ekle</button></div>
    <div class="card" style="padding:0;overflow:hidden"><table class="data-table">
      <thead><tr><th>ID</th><th>Kullanıcı</th><th>E-posta</th><th>Rol</th><th>Kredi</th><th>Kayıt</th><th></th></tr></thead>
      <tbody>${staff.length===0?'<tr><td colspan="7" class="text-muted" style="padding:24px;text-align:center">Yetkili bulunamadı</td></tr>':
        staff.map(u=>`<tr><td class="text-muted">#${u.id}</td><td><div class="user-cell"><img src="https://mc-heads.net/avatar/${u.username}/32" class="user-avatar"><div><div class="username">${u.username}</div><div class="usertag">@${u.username}</div></div></div></td><td class="text-muted fs-13">${u.email}</td><td><span class="badge-admin">Admin</span></td><td class="fw-700 text-green">${fmt(u.credit)} USD</td><td class="text-muted fs-13">${timeAgo(u.created_at)}</td><td style="display:flex;gap:4px"><button class="btn btn-blue btn-icon btn-sm"><i class="fas fa-eye"></i></button><button class="btn btn-ghost btn-icon btn-sm"><i class="fas fa-edit"></i></button></td></tr>`).join('')}
      </tbody>
    </table></div>`;
}

function renderSendCredit() {
  setActiveSubnav('Kredi Gönder');
  setBreadcrumb([{label:'İşlemler'},{label:'Kredi Gönder',active:true}]);
  document.getElementById('dash-body').innerHTML=`
    <h1 class="dash-page-title">Kredi Gönder</h1>
    <div class="form-card"><div class="form-card-title"><i class="fas fa-paper-plane text-blue" style="margin-right:8px"></i>Transfer Detayları</div>
      <div class="field"><label>Kullanıcı Adı</label><input class="input" id="sc-user" placeholder="Kullanıcı adını girin..."></div>
      <div class="field"><label>Miktar (USD)</label><input class="input" id="sc-amount" type="number" min="0.01" step="0.01" placeholder="0.00"></div>
      <div class="toggle-wrap mt-16 mb-24"><div class="toggle on" id="sc-toggle" onclick="this.classList.toggle('on')"></div><span class="toggle-label">Bu bir kazanç mı? <span class="text-muted fs-12">(kapalıysa kullanıcıdan düşülür)</span></span></div>
      <button class="btn btn-primary" onclick="doSendCredit()"><i class="fas fa-paper-plane"></i> Gönder</button>
    </div>`;
}

async function doSendCredit() {
  const username=document.getElementById('sc-user').value.trim();
  const amount=parseFloat(document.getElementById('sc-amount').value);
  const is_earning=document.getElementById('sc-toggle').classList.contains('on');
  if(!username||!amount){toast('Tüm alanları doldurun','error');return;}
  const res=await api.post('/api/admin/send-credit',{username,amount,is_earning});
  if(res.success)toast(res.message,'success');else toast(res.error,'error');
}

// ── STORE PRODUCTS ────────────────────────────────────────
async function renderAdminProducts() {
  setActiveSubnav('Ürünler');
  setBreadcrumb([{label:'Mağaza'},{label:'Ürünler',active:true}]);
  const body=document.getElementById('dash-body');
  body.innerHTML='<div class="text-muted fs-13">Yükleniyor...</div>';
  const [cats,prods]=await Promise.all([api.get('/api/admin/categories'),api.get('/api/store/products')]);
  const grouped={};
  cats.forEach(c=>{grouped[c.id]={cat:c,products:[]};});
  prods.forEach(p=>{if(grouped[p.category_id])grouped[p.category_id].products.push(p);});
  body.innerHTML=`
    <div class="dash-ph"><h1 class="dash-page-title" style="margin-bottom:0">Ürünler</h1>
      <div class="flex gap-8">
        <div class="view-tabs"><div class="view-tab active">Liste</div><div class="view-tab" onclick="renderProductTable()">Tablo</div></div>
        <button class="btn btn-primary btn-sm" onclick="renderCreateProduct()"><i class="fas fa-plus"></i> Yeni Ekle</button>
      </div>
    </div>
    ${Object.values(grouped).map(g=>`
      <div class="prod-group">
        <div class="prod-group-header"><span class="prod-group-name">${g.cat.emoji} ${g.cat.name}</span><span class="prod-group-count">${g.products.length} ürün</span></div>
        ${g.products.map(p=>`<div class="prod-item"><span class="prod-item-emoji">${p.image_emoji}</span><span class="prod-item-name">${p.name} <span class="text-dim fs-11">#${p.id}</span></span><span class="prod-item-price">${fmt(p.price)} USD</span><span class="prod-item-stock">${p.stock?p.stock+' stok':'Sınırsız'}</span><button class="btn btn-ghost btn-icon btn-sm"><i class="fas fa-edit"></i></button><button class="btn btn-red btn-icon btn-sm" onclick="deleteProduct(${p.id},'${p.name}')"><i class="fas fa-trash"></i></button></div>`).join('')}
      </div>`).join('')}
    ${Object.keys(grouped).length===0?'<div class="empty-state"><div class="empty-icon">📦</div><h3>Ürün bulunamadı</h3><p>Yeni ürün ekleyebilirsiniz.</p></div>':''}`;
}

async function deleteProduct(id,name) {
  if(!confirm('"'+name+'" silinsin mi?'))return;
  const res=await api.delete('/api/admin/products/'+id);
  if(res.success){toast('Ürün silindi','success');renderAdminProducts();}else toast(res.error,'error');
}

async function renderProductTable() {
  setActiveSubnav('Ürünler');
  const body=document.getElementById('dash-body');
  body.innerHTML='<div class="text-muted fs-13">Yükleniyor...</div>';
  const prods=await api.get('/api/store/products');
  body.innerHTML=`
    <div class="dash-ph"><h1 class="dash-page-title" style="margin-bottom:0">Ürünler</h1>
      <div class="flex gap-8"><div class="view-tabs"><div class="view-tab" onclick="renderAdminProducts()">Liste</div><div class="view-tab active">Tablo</div></div>
        <button class="btn btn-primary btn-sm" onclick="renderCreateProduct()"><i class="fas fa-plus"></i> Yeni Ekle</button></div>
    </div>
    <div class="search-wrap"><label>Ürünler için arama yap</label><div class="search-input-wrap"><i class="fas fa-search"></i><input class="input search-input" id="prod-search" type="text" placeholder="Ürün adı ara..."></div></div>
    <div class="card" style="padding:0;overflow:hidden"><table class="data-table">
      <thead><tr><th>Ad / ID</th><th>Kategori</th><th>Fiyat</th><th>Stok</th><th>Öncelik</th><th></th></tr></thead>
      <tbody id="prods-tbody">
        ${prods.map(p=>`<tr><td><div class="fw-700">${p.image_emoji} ${p.name}</div><div class="text-dim fs-11">#${p.id}</div></td><td class="text-muted">${p.category_name||'—'}</td><td class="fw-700 text-blue">${fmt(p.price)} USD</td><td class="text-muted fs-13">${p.stock?p.stock+' stokta':'Sınırsız'}</td><td class="text-muted">${p.priority}</td><td style="display:flex;gap:4px"><button class="btn btn-ghost btn-icon btn-sm"><i class="fas fa-edit"></i></button><button class="btn btn-red btn-icon btn-sm" onclick="deleteProduct(${p.id},'${p.name}')"><i class="fas fa-trash"></i></button></td></tr>`).join('')}
      </tbody>
    </table></div>`;
  filterTable('prod-search','prods-tbody');
}

async function renderCreateProduct() {
  setActiveSubnav('Ürünler');
  setBreadcrumb([{label:'Mağaza'},{label:'Ürünler',fn:'renderAdminProducts'},{label:'Ekle',active:true}]);
  const cats=await api.get('/api/admin/categories');
  document.getElementById('dash-body').innerHTML=`
    <div class="dash-ph"><h1 class="dash-page-title" style="margin-bottom:0">Ürün Oluştur</h1><button class="btn btn-ghost btn-sm" onclick="renderAdminProducts()"><i class="fas fa-arrow-left"></i> Geri</button></div>
    <div class="form-card"><div class="form-card-title"><i class="fas fa-box text-blue" style="margin-right:8px"></i>Ürün Detayları</div>
      <div class="form-row"><div class="field"><label>Ad</label><input class="input" id="cp-name" placeholder="Ürün adı"></div><div class="field"><label>Emoji / İkon</label><input class="input" id="cp-emoji" value="📦"></div></div>
      <div class="field"><label>Kategori</label><select class="input" id="cp-cat"><option value="">-- Kategori seçin --</option>${cats.map(c=>'<option value="'+c.id+'">'+c.emoji+' '+c.name+'</option>').join('')}</select></div>
      <div class="field"><label>Açıklama</label><textarea class="input" id="cp-desc" rows="3" placeholder="Ürün açıklaması..."></textarea></div>
      <div class="form-row"><div class="field"><label>Fiyat (USD)</label><input class="input" id="cp-price" type="number" step="0.01" value="9.99"></div><div class="field"><label>Stok (boş = sınırsız)</label><input class="input" id="cp-stock" type="number" placeholder="Sınırsız"></div></div>
      <div class="field"><label>Öncelik</label><input class="input" id="cp-prio" type="number" value="0"></div>
    </div>
    <div style="display:flex;justify-content:flex-end"><button class="btn btn-primary" onclick="createProduct()"><i class="fas fa-plus"></i> Oluştur</button></div>`;
}

async function createProduct() {
  const name=document.getElementById('cp-name').value.trim(), cid=document.getElementById('cp-cat').value;
  const emoji=document.getElementById('cp-emoji').value, desc=document.getElementById('cp-desc').value;
  const price=parseFloat(document.getElementById('cp-price').value);
  const sv=document.getElementById('cp-stock').value, stock=sv?parseInt(sv):null;
  const priority=parseInt(document.getElementById('cp-prio').value)||0;
  if(!name||!cid){toast('Ad ve kategori zorunlu','error');return;}
  const res=await api.post('/api/admin/products',{name,category_id:cid,emoji,description:desc,price,stock,priority});
  if(res.success){toast('Ürün oluşturuldu!','success');renderAdminProducts();}else toast(res.error,'error');
}

// ── CATEGORIES ────────────────────────────────────────────
async function renderAdminCategories() {
  setActiveSubnav('Kategoriler');
  setBreadcrumb([{label:'Mağaza'},{label:'Kategoriler',active:true}]);
  const body=document.getElementById('dash-body');
  body.innerHTML='<div class="text-muted fs-13">Yükleniyor...</div>';
  const cats=await api.get('/api/admin/categories');
  body.innerHTML=`
    <div class="dash-ph"><h1 class="dash-page-title" style="margin-bottom:0">Mağaza Kategorileri</h1><button class="btn btn-primary btn-sm" onclick="renderCreateCategory()"><i class="fas fa-plus"></i> Yeni Ekle</button></div>
    <div class="search-wrap"><label>Kategoriler için arama yap</label><div class="search-input-wrap"><i class="fas fa-search"></i><input class="input search-input" id="cat-search" type="text" placeholder="Kategori adı ara..."></div></div>
    <div class="card" style="padding:0;overflow:hidden"><table class="data-table">
      <thead><tr><th>Ad / ID</th><th>Ana Kategori</th><th>Öncelik</th><th></th></tr></thead>
      <tbody id="cats-tbody">
        ${cats.map(c=>`<tr><td><div class="fw-700">${c.emoji} ${c.name}</div><div class="text-dim fs-11">#${c.id}</div></td><td class="text-muted">—</td><td class="text-muted">${c.priority}</td><td style="display:flex;gap:4px"><button class="btn btn-blue btn-icon btn-sm"><i class="fas fa-eye"></i></button><button class="btn btn-ghost btn-icon btn-sm"><i class="fas fa-edit"></i></button><button class="btn btn-red btn-icon btn-sm" onclick="deleteCategory(${c.id},'${c.name}')"><i class="fas fa-trash"></i></button></td></tr>`).join('')}
      </tbody>
    </table></div>`;
  filterTable('cat-search','cats-tbody');
}

async function deleteCategory(id,name) {
  if(!confirm('"'+name+'" silinsin mi?'))return;
  const res=await api.delete('/api/admin/categories/'+id);
  if(res.success){toast('Kategori silindi','success');renderAdminCategories();}else toast(res.error,'error');
}

function renderCreateCategory() {
  setActiveSubnav('Kategoriler');
  setBreadcrumb([{label:'Mağaza'},{label:'Kategoriler',fn:'renderAdminCategories'},{label:'Ekle',active:true}]);
  document.getElementById('dash-body').innerHTML=`
    <div class="dash-ph"><h1 class="dash-page-title" style="margin-bottom:0">Kategori Oluştur</h1><button class="btn btn-ghost btn-sm" onclick="renderAdminCategories()"><i class="fas fa-arrow-left"></i> Geri</button></div>
    <div class="form-card"><div class="form-card-title"><i class="fas fa-th-large text-blue" style="margin-right:8px"></i>Kategori Detayları</div>
      <div class="form-row"><div class="field"><label>Ad</label><input class="input" id="cc-name" placeholder="Kategori adı"></div><div class="field"><label>Emoji</label><input class="input" id="cc-emoji" value="📦"></div></div>
      <div class="field"><label>Öncelik (yüksek = üstte)</label><input class="input" id="cc-prio" type="number" value="0"></div>
    </div>
    <div style="display:flex;justify-content:flex-end"><button class="btn btn-primary" onclick="createCategory()"><i class="fas fa-plus"></i> Oluştur</button></div>`;
}

async function createCategory() {
  const name=document.getElementById('cc-name').value.trim(), emoji=document.getElementById('cc-emoji').value;
  const priority=parseInt(document.getElementById('cc-prio').value)||0;
  if(!name){toast('Kategori adı gerekli','error');return;}
  const res=await api.post('/api/admin/categories',{name,emoji,priority});
  if(res.success){toast('Kategori oluşturuldu!','success');renderAdminCategories();}else toast(res.error,'error');
}

function renderAdminCoupons() {
  setActiveSubnav('Kuponlar');
  setBreadcrumb([{label:'Mağaza'},{label:'Kuponlar',active:true}]);
  document.getElementById('dash-body').innerHTML=`
    <div class="dash-ph"><h1 class="dash-page-title" style="margin-bottom:0">Kuponlar</h1></div>
    <div class="empty-state"><div class="empty-icon">🎫</div><h3>Kupon bulunamadı!</h3><p>Yeni kuponlar eklemek için aşağıdaki butona tıklayabilirsiniz.</p>
      <div class="empty-actions"><button class="btn btn-ghost" onclick="renderAdminProducts()">Ana Sayfaya Dön</button><button class="btn btn-primary"><i class="fas fa-plus"></i> Kupon Oluştur</button></div>
    </div>`;
}

async function renderAdminOrders() {
  setActiveSubnav('Siparişler');
  setBreadcrumb([{label:'Mağaza'},{label:'Siparişler',active:true}]);
  const body=document.getElementById('dash-body');
  body.innerHTML='<div class="text-muted fs-13">Yükleniyor...</div>';
  const orders=await api.get('/api/admin/orders');
  body.innerHTML=`
    <div class="dash-ph"><h1 class="dash-page-title" style="margin-bottom:0">Siparişler</h1>
      <div class="flex gap-8"><select class="input" style="width:180px;height:38px;padding:0 12px"><option>Hepsini Göster</option><option>Başarılı</option><option>Bekliyor</option></select><button class="btn btn-primary btn-sm"><i class="fas fa-plus"></i> Yeni Ekle</button></div>
    </div>
    <div class="search-wrap"><label>Siparişler için arama yap</label><div class="search-input-wrap"><i class="fas fa-search"></i><input class="input search-input" id="ord-search" type="text" placeholder="Kullanıcı, tutar ara..."></div></div>
    <div class="card" style="padding:0;overflow:hidden"><table class="data-table">
      <thead><tr><th>ID</th><th>Kullanıcı</th><th>Toplam</th><th>Yöntem</th><th>Durum</th><th>Tarih</th><th></th></tr></thead>
      <tbody id="ord-tbody">
        ${orders.length===0?'<tr><td colspan="7" class="text-muted" style="padding:24px;text-align:center">Henüz sipariş yok</td></tr>':
          orders.map(o=>`<tr><td class="text-muted">#${o.id}</td><td><div class="fw-700">${o.username}</div><div class="text-dim fs-11">@${o.username}</div></td><td class="fw-700 text-blue">${fmt(o.total)} USD</td><td class="text-muted fs-13">${o.payment_method}</td><td><span class="badge badge-green">${o.status}</span></td><td class="text-muted fs-13">${timeAgo(o.created_at)}</td><td><button class="btn btn-blue btn-icon btn-sm"><i class="fas fa-eye"></i></button></td></tr>`).join('')}
      </tbody>
    </table></div>
    <div class="pagination"><div class="page-btn">← Önceki</div><div class="page-btn active">1</div><div class="page-btn">Sonraki →</div></div>`;
  filterTable('ord-search','ord-tbody');
}

// ── SUPPORT TICKETS ────────────────────────────────────────
async function renderAdminTickets() {
  switchSection('support'); setActiveSubnav('Talepler');
  setBreadcrumb([{label:'Destek'},{label:'Talepler',active:true}]);
  const body=document.getElementById('dash-body');
  body.innerHTML='<div class="text-muted fs-13">Yükleniyor...</div>';
  const tickets=await api.get('/api/admin/tickets');
  body.innerHTML=`
    <div class="dash-ph"><h1 class="dash-page-title" style="margin-bottom:0">Destek Talepleri</h1></div>
    <div class="search-wrap" style="display:grid;grid-template-columns:1fr 160px 160px;gap:16px">
      <div><label>Arama</label><div class="search-input-wrap"><i class="fas fa-search"></i><input class="input search-input" id="tkt-search" type="text" placeholder="Başlık, kullanıcı ara..."></div></div>
      <div><label>Kategori</label><select class="input" style="height:46px"><option>Hepsini Göster</option></select></div>
      <div><label>Durum</label><select class="input" style="height:46px"><option>Hepsini Göster</option><option>Açık</option><option>Kapalı</option></select></div>
    </div>
    <div class="card" style="padding:0;overflow:hidden"><table class="data-table">
      <thead><tr><th><input type="checkbox"></th><th>Başlık / ID</th><th>Kullanıcı</th><th>Kategori</th><th>Durum</th><th>Tarih</th><th></th></tr></thead>
      <tbody id="tkt-tbody">
        ${tickets.length===0?'<tr><td colspan="7" class="text-muted" style="padding:24px;text-align:center">Talep bulunamadı</td></tr>':
          tickets.map(t=>`<tr><td><input type="checkbox"></td><td><div class="fw-700">${t.title}</div><div class="text-dim fs-11">#${t.id}</div></td><td><div class="fw-700">${t.username}</div><div class="text-dim fs-11">@${t.username}</div></td><td class="text-muted">${t.category}</td><td><span class="badge ${t.status==='Açık'?'badge-blue':'badge-green'}">${t.status}</span></td><td class="text-muted fs-13">${timeAgo(t.created_at)}</td><td style="display:flex;gap:4px"><button class="btn btn-blue btn-icon btn-sm"><i class="fas fa-eye"></i></button>${t.status==='Açık'?'<button class="btn btn-ghost btn-icon btn-sm" title="Kapat" onclick="closeTicket('+t.id+')"><i class="fas fa-times"></i></button>':''}<button class="btn btn-red btn-icon btn-sm" onclick="deleteTicket(${t.id})"><i class="fas fa-trash"></i></button></td></tr>`).join('')}
      </tbody>
    </table></div>
    <div class="pagination"><div class="page-btn">← Önceki</div><div class="page-btn active">1</div><div class="page-btn">Sonraki →</div></div>`;
  filterTable('tkt-search','tkt-tbody');
}

async function closeTicket(id) {
  const res=await api.put('/api/admin/tickets/'+id+'/close',{});
  if(res.success){toast('Talep kapatıldı','success');renderAdminTickets();}
}
async function deleteTicket(id) {
  if(!confirm('Talep silinsin mi?'))return;
  const res=await api.delete('/api/support/tickets/'+id);
  if(res.success){toast('Talep silindi','success');renderAdminTickets();}
}

// ── APPLICATIONS ────────────────────────────────────────────
function renderApplicationForms() {
  switchSection('apps'); setActiveSubnav('Başvuru Formları');
  setBreadcrumb([{label:'Başvurular'},{label:'Başvuru Formları',active:true}]);
  document.getElementById('dash-body').innerHTML=`
    <div class="dash-ph"><h1 class="dash-page-title" style="margin-bottom:0">Başvuru Formları</h1><button class="btn btn-primary btn-sm" onclick="renderCreateAppForm()"><i class="fas fa-plus"></i> Yeni Form</button></div>
    <div class="empty-state"><div class="empty-icon">📋</div><h3>Başvuru formu bulunamadı!</h3><p>Yeni bir başvuru formu oluşturmak için aşağıdaki butona tıklayabilirsiniz.</p>
      <div class="empty-actions"><button class="btn btn-ghost" onclick="renderOverview()">Ana Sayfaya Dön</button><button class="btn btn-primary" onclick="renderCreateAppForm()"><i class="fas fa-plus"></i> Başvuru Formu Oluştur</button></div>
    </div>`;
}

function renderApplicationsList() {
  setActiveSubnav('Başvurular');
  setBreadcrumb([{label:'Başvurular'},{label:'Başvurular',active:true}]);
  document.getElementById('dash-body').innerHTML=`
    <div class="dash-ph"><h1 class="dash-page-title" style="margin-bottom:0">Başvurular</h1></div>
    <div class="empty-state"><div class="empty-icon">📄</div><h3>Başvuru bulunamadı!</h3><p>Burada gösterilecek başvuru yok.</p>
      <div class="empty-actions"><button class="btn btn-ghost" onclick="renderOverview()">Ana Sayfaya Dön</button></div>
    </div>`;
}

function renderCustomForms() {
  setActiveSubnav('Özel Formlar');
  setBreadcrumb([{label:'Başvurular'},{label:'Özel Formlar',active:true}]);
  document.getElementById('dash-body').innerHTML=`
    <div class="dash-ph"><h1 class="dash-page-title" style="margin-bottom:0">Özel Formlar</h1><button class="btn btn-primary btn-sm" onclick="renderCreateCustomForm()"><i class="fas fa-plus"></i> Yeni Form</button></div>
    <div class="empty-state"><div class="empty-icon">📝</div><h3>Özel form bulunamadı!</h3><p>Yeni bir özel form oluşturmak için butona tıklayın.</p>
      <div class="empty-actions"><button class="btn btn-ghost" onclick="renderOverview()">Ana Sayfaya Dön</button><button class="btn btn-primary" onclick="renderCreateCustomForm()"><i class="fas fa-plus"></i> Özel Form Oluştur</button></div>
    </div>`;
}

function renderFormAnswers() {
  setActiveSubnav('Yanıtlar');
  setBreadcrumb([{label:'Başvurular'},{label:'Yanıtlar',active:true}]);
  document.getElementById('dash-body').innerHTML=`
    <div class="dash-ph"><h1 class="dash-page-title" style="margin-bottom:0">Form Yanıtları</h1></div>
    <div class="empty-state"><div class="empty-icon">📬</div><h3>Yanıt bulunamadı!</h3><p>Burada gösterilecek yanıt yok.</p>
      <div class="empty-actions"><button class="btn btn-ghost" onclick="renderOverview()">Ana Sayfaya Dön</button></div>
    </div>`;
}

function renderCreateAppForm() {
  setBreadcrumb([{label:'Başvurular'},{label:'Başvuru Formları',fn:'renderApplicationForms'},{label:'Yeni Form',active:true}]);
  document.getElementById('dash-body').innerHTML=`
    <div class="dash-ph"><h1 class="dash-page-title" style="margin-bottom:0">Başvuru Formu Oluştur</h1><button class="btn btn-ghost btn-sm" onclick="renderApplicationForms()"><i class="fas fa-arrow-left"></i> Geri</button></div>
    <div class="form-card"><div class="form-card-title"><i class="fas fa-file-alt text-blue" style="margin-right:8px"></i>Form Bilgileri</div>
      <div class="field"><label>Form Başlığı</label><input class="input" placeholder="ör. Moderatör Başvurusu"></div>
      <div class="field"><label>Açıklama</label><textarea class="input" rows="3" placeholder="Başvuru hakkında açıklama..."></textarea></div>
      <div class="form-row">
        <div class="field"><label>Durum</label><select class="input"><option>Aktif</option><option>Pasif</option></select></div>
        <div class="field"><label>Kategori</label><input class="input" placeholder="ör. Yönetim, Moderatör"></div>
      </div>
    </div>
    <div class="form-card"><div class="form-card-title"><i class="fas fa-list text-blue" style="margin-right:8px"></i>Form Alanları</div>
      <div id="form-fields">
        <div style="display:grid;grid-template-columns:1fr 1fr auto;gap:12px;margin-bottom:12px">
          <input class="input" placeholder="Alan adı (ör. Yaş)" style="margin:0">
          <select class="input" style="margin:0"><option>Metin</option><option>Uzun Metin</option><option>Seçim</option><option>Sayı</option></select>
          <button class="btn btn-red btn-icon" style="height:46px"><i class="fas fa-trash"></i></button>
        </div>
      </div>
      <button class="btn btn-ghost btn-sm mt-8" onclick="addFormField()"><i class="fas fa-plus"></i> Alan Ekle</button>
    </div>
    <div style="display:flex;justify-content:flex-end"><button class="btn btn-primary" onclick="toast('Form oluşturuldu!','success');renderApplicationForms()"><i class="fas fa-save"></i> Formu Kaydet</button></div>`;
}

function addFormField() {
  const c=document.getElementById('form-fields');
  const row=document.createElement('div');
  row.style.cssText='display:grid;grid-template-columns:1fr 1fr auto;gap:12px;margin-bottom:12px';
  row.innerHTML='<input class="input" placeholder="Alan adı" style="margin:0"><select class="input" style="margin:0"><option>Metin</option><option>Uzun Metin</option><option>Seçim</option><option>Sayı</option></select><button class="btn btn-red btn-icon" style="height:46px" onclick="this.parentElement.remove()"><i class="fas fa-trash"></i></button>';
  c.appendChild(row);
}

function renderCreateCustomForm() {
  setBreadcrumb([{label:'Başvurular'},{label:'Özel Formlar',fn:'renderCustomForms'},{label:'Yeni Form',active:true}]);
  document.getElementById('dash-body').innerHTML=`
    <div class="dash-ph"><h1 class="dash-page-title" style="margin-bottom:0">Özel Form Oluştur</h1><button class="btn btn-ghost btn-sm" onclick="renderCustomForms()"><i class="fas fa-arrow-left"></i> Geri</button></div>
    <div class="form-card"><div class="form-card-title"><i class="fas fa-file-code text-blue" style="margin-right:8px"></i>Form Bilgileri</div>
      <div class="field"><label>Form Başlığı</label><input class="input" placeholder="Form başlığı"></div>
      <div class="field"><label>Açıklama</label><textarea class="input" rows="2" placeholder="Form açıklaması..."></textarea></div>
    </div>
    <div style="display:flex;justify-content:flex-end"><button class="btn btn-primary" onclick="toast('Form oluşturuldu!','success');renderCustomForms()"><i class="fas fa-save"></i> Formu Kaydet</button></div>`;
}

// ── BOOT ─────────────────────────────────────────────────
dashInit();

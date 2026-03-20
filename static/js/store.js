let storeView = 'categories';
let currentCat = null;

async function showCategories() {
  storeView = 'categories'; currentCat = null;
  const wrap = document.getElementById('store-wrap');
  wrap.innerHTML = '<div class="text-muted fs-13" style="padding:40px;text-align:center">Yükleniyor...</div>';
  try {
    const cats = await api.get('/api/store/categories');
    wrap.innerHTML = `
      <h2 class="store-section-title">Kategoriler</h2>
      <div class="cat-grid">
        ${cats.map(c => `
          <div class="cat-card" onclick="showProducts(${c.id},'${c.name}','${c.emoji}')">
            <div class="cat-img">${c.emoji}</div>
            <div class="cat-footer">
              <span class="cat-name">${c.name}</span>
              <div class="cat-arrow"><i class="fas fa-chevron-right"></i></div>
            </div>
          </div>
        `).join('')}
      </div>`;
  } catch { wrap.innerHTML = '<div class="text-muted" style="padding:40px">Yüklenemedi.</div>'; }
}

async function showProducts(catId, catName, emoji) {
  storeView = 'products'; currentCat = catId;
  const wrap = document.getElementById('store-wrap');
  wrap.innerHTML = '<div class="text-muted fs-13" style="padding:40px;text-align:center">Yükleniyor...</div>';
  try {
    const prods = await api.get(`/api/store/categories/${catId}/products`);
    wrap.innerHTML = `
      <div class="back-btn" onclick="showCategories()"><i class="fas fa-arrow-left"></i> Kategorilere Dön</div>
      <h2 class="store-section-title">${emoji} ${catName}</h2>
      ${!prods.length ? '<div class="empty-state"><div class="empty-icon">📦</div><h3>Bu kategoride ürün yok</h3></div>' :
        `<div class="prod-grid">${prods.map(p => `
          <div class="prod-card">
            <div class="prod-img">${p.image_emoji}</div>
            <div class="prod-body">
              <div class="prod-name">${p.name}</div>
              <div class="prod-price">${fmt(p.price)} USD</div>
              <div class="prod-stock">${p.stock ? p.stock + ' stokta' : 'Sınırsız stok'}</div>
              <button class="prod-btn" onclick="addToCart(${p.id},'${p.name}',event)">
                <i class="fas fa-basket-shopping"></i> Sepete Ekle
              </button>
            </div>
          </div>`).join('')}</div>`}`;
  } catch { wrap.innerHTML = '<div class="text-muted" style="padding:40px">Yüklenemedi.</div>'; }
}

async function addToCart(productId, name, e) {
  e.stopPropagation();
  const user = await api.get('/api/auth/me');
  if (!user.logged_in) { toast('Sepete eklemek için giriş yapın!', 'error'); goto('/login'); return; }
  const res = await api.post('/api/cart/add', { product_id: productId, quantity: 1 });
  if (res.success) { toast(`${name} sepete eklendi!`, 'success'); refreshCartCount(); }
  else toast(res.error, 'error');
}

showCategories();

# ElementWars — Minecraft Server Platform

Flask + PostgreSQL (Supabase) web uygulaması.

---

## 🚀 Hızlı Başlangıç

```bash
pip install -r requirements.txt
cp .env.example .env     # .env dosyasını düzenle
python app.py
```

**Demo:** `demo` / `demo123`

---

## 🌐 Supabase Kurulumu (Ücretsiz Cloud DB)

### 1. Supabase hesabı aç
→ https://supabase.com → **Start for free** → GitHub ile giriş

### 2. Proje oluştur
- **New project** → İsim: `elementwars` → Şifre belirle → Region: **eu-central-1** (Avrupa)
- ~2 dakika bekle

### 3. Tabloları oluştur
- Sol menü: **SQL Editor** → **New query**
- `supabase_migration.sql` dosyasını aç → içeriği kopyala → **Run**

### 4. Bağlantı stringini al
- Sol menü: **Project Settings** → **Database**
- **"Transaction pooler"** bölümü → **Connection string** → kopyala
- Format: `postgresql://postgres.[ref]:[sifre]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`

### 5. .env dosyasını düzenle
```env
SECRET_KEY=guclu-bir-sifre-yaz-buraya
DATABASE_URL=postgresql://postgres.xxxx:SifreniziYazin@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

### 6. Çalıştır!
```bash
python app.py
```
Otomatik olarak demo verisini Supabase'e yükler.

---

## ☁️ Ücretsiz Deployment Seçenekleri

### Railway (En kolay)
```bash
# railway.app → New project → Deploy from GitHub
# Environment Variables'a DATABASE_URL ve SECRET_KEY ekle
```

### Render
```bash
# render.com → New Web Service → GitHub repo
# Environment: DATABASE_URL, SECRET_KEY
# Build: pip install -r requirements.txt
# Start: python app.py
```

### Fly.io
```bash
fly launch
fly secrets set DATABASE_URL="postgresql://..."
fly secrets set SECRET_KEY="..."
fly deploy
```

---

## 📁 Proje Yapısı

```
elementwars/
├── app.py                 ← Flask + 43 API endpoint (Postgres + SQLite)
├── .env.example           ← Ortam değişkenleri şablonu
├── .env                   ← Kendi ayarlarınız (git'e eklemeyin!)
├── supabase_migration.sql ← Supabase SQL Editor'e yapıştır
├── requirements.txt       ← flask, psycopg2-binary, python-dotenv
├── templates/             ← 9 HTML sayfası
└── static/
    ├── css/               ← 6 CSS dosyası
    └── js/                ← 4 JS dosyası
```

---

## 🗄️ Veritabanı Çalışma Mantığı

`app.py` otomatik olarak şunu yapar:
- `DATABASE_URL` varsa → **PostgreSQL (Supabase)**
- `DATABASE_URL` yoksa → **SQLite** (local fallback)

Yani local geliştirme için `.env` olmadan da çalışır!

---

## 🔑 API Endpoint'leri (43 adet)

| Grup | Endpoint | Yöntem |
|------|----------|--------|
| Auth | `/api/auth/login` `/api/auth/register` `/api/auth/logout` `/api/auth/me` | POST/GET |
| Store | `/api/store/categories` `/api/store/products` | GET |
| Cart | `/api/cart` `/api/cart/add` `/api/cart/remove/<id>` `/api/cart/checkout` | GET/POST/DELETE |
| Support | `/api/support/tickets` `/api/support/tickets/<id>` | GET/POST/DELETE |
| Account | `/api/account/orders` `/api/account/credit-history` `/api/account/profile` `/api/account/change-password` | GET/PUT |
| Admin | `/api/admin/stats` `/api/admin/users` `/api/admin/categories` `/api/admin/products` `/api/admin/orders` `/api/admin/tickets` `/api/admin/send-credit` | GET/POST/DELETE/PUT |
| Home | `/api/home/leaderboard` `/api/home/recent-purchases` `/api/news` | GET |

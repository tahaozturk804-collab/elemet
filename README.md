# ElementWars — Minecraft Server Management Platform

Tam stack web uygulaması. Python (Flask) backend, SQLite veritabanı, vanilla HTML/CSS/JS frontend.

---

## 📁 Proje Yapısı

```
elementwars/
├── app.py                  ← Flask uygulaması + tüm API endpoint'leri
├── elementwars.db          ← SQLite veritabanı (ilk çalıştırmada otomatik oluşur)
├── requirements.txt        ← Python bağımlılıkları
│
├── templates/              ← Jinja2 HTML şablonları
│   ├── base.html           ← Ana layout (navbar, toast, loader)
│   ├── index.html          ← Anasayfa (hero, haberler, leaderboard)
│   ├── store.html          ← Mağaza (kategoriler + ürünler)
│   ├── login.html          ← Giriş sayfası
│   ├── register.html       ← Kayıt sayfası
│   ├── cart.html           ← Sepet + ödeme
│   ├── support.html        ← Destek talepleri
│   ├── profile.html        ← Kullanıcı profili (tab'lı)
│   └── dashboard.html      ← Yönetim paneli
│
└── static/
    ├── css/
    │   ├── main.css        ← Global stiller (renk değişkenleri, butonlar, formlar...)
    │   ├── home.css        ← Anasayfa stilleri
    │   ├── store.css       ← Mağaza stilleri
    │   ├── auth.css        ← Giriş/Kayıt stilleri
    │   ├── inner.css       ← Sepet, destek, profil stilleri
    │   └── dashboard.css   ← Admin panel stilleri
    └── js/
        ├── app.js          ← Global yardımcılar (api, toast, auth, format)
        ├── home.js         ← Anasayfa JS (partiküller, haberler, leaderboard)
        ├── store.js        ← Mağaza JS (kategoriler, ürünler, sepete ekle)
        └── dashboard.js    ← Admin panel JS (tüm CRUD işlemleri)
```

---

## 🚀 Kurulum ve Çalıştırma

### 1. Gereksinimler
- Python 3.8+
- Flask 3.x

### 2. Kurulum
```bash
# Proje klasörüne gir
cd elementwars

# Bağımlılıkları yükle
pip install -r requirements.txt

# Uygulamayı başlat
python app.py
```

### 3. Tarayıcıda Aç
```
http://localhost:5000
```

---

## 🔑 Demo Hesapları

| Kullanıcı | Şifre    | Yetki |
|-----------|----------|-------|
| `demo`    | `demo123` | Admin |
| `player1` | `demo123` | Üye   |

---

## 📡 API Endpoint'leri

### Auth
| Yöntem | URL | Açıklama |
|--------|-----|----------|
| GET    | `/api/auth/me` | Oturum bilgisi |
| POST   | `/api/auth/login` | Giriş yap |
| POST   | `/api/auth/register` | Kayıt ol |
| POST   | `/api/auth/logout` | Çıkış yap |

### Mağaza
| Yöntem | URL | Açıklama |
|--------|-----|----------|
| GET    | `/api/store/categories` | Tüm kategoriler |
| GET    | `/api/store/categories/<id>/products` | Kategoriye göre ürünler |
| GET    | `/api/store/products` | Tüm ürünler |

### Sepet
| Yöntem | URL | Açıklama |
|--------|-----|----------|
| GET    | `/api/cart` | Sepet içeriği |
| POST   | `/api/cart/add` | Sepete ürün ekle |
| DELETE | `/api/cart/remove/<id>` | Ürün çıkar |
| POST   | `/api/cart/checkout` | Ödeme yap |

### Destek
| Yöntem | URL | Açıklama |
|--------|-----|----------|
| GET    | `/api/support/tickets` | Talepler |
| POST   | `/api/support/tickets` | Yeni talep |
| DELETE | `/api/support/tickets/<id>` | Talep sil |

### Hesap
| Yöntem | URL | Açıklama |
|--------|-----|----------|
| GET    | `/api/account/orders` | Siparişlerim |
| GET    | `/api/account/credit-history` | Kredi geçmişim |
| PUT    | `/api/account/profile` | Profil güncelle |
| PUT    | `/api/account/change-password` | Şifre değiştir |

### Admin (Admin yetkisi gerekir)
| Yöntem | URL | Açıklama |
|--------|-----|----------|
| GET    | `/api/admin/stats` | Genel istatistikler |
| GET    | `/api/admin/users` | Tüm kullanıcılar |
| POST   | `/api/admin/users` | Kullanıcı oluştur |
| DELETE | `/api/admin/users/<id>` | Kullanıcı sil |
| POST   | `/api/admin/send-credit` | Kredi gönder |
| GET/POST | `/api/admin/categories` | Kategoriler |
| DELETE | `/api/admin/categories/<id>` | Kategori sil |
| POST   | `/api/admin/products` | Ürün oluştur |
| DELETE | `/api/admin/products/<id>` | Ürün sil |
| GET    | `/api/admin/orders` | Tüm siparişler |
| GET    | `/api/admin/tickets` | Tüm talepler |
| PUT    | `/api/admin/tickets/<id>/close` | Talep kapat |

---

## 🗄️ Veritabanı Şeması

```
users            → Kullanıcı hesapları
categories       → Mağaza kategorileri
products         → Mağaza ürünleri
cart_items       → Sepet içerikleri
orders           → Siparişler
order_items      → Sipariş ürünleri
tickets          → Destek talepleri
credit_history   → Kredi geçmişi
news             → Haberler
```

---

## 🎨 Tasarım Sistemi

- **Renkler:** CSS değişkenleri (`--accent`, `--green`, `--red` vb.)
- **Font:** Rajdhani (başlıklar) + Nunito (metin)
- **Tema:** Koyu arka plan, turuncu vurgu rengi
- **Bileşenler:** Kart, Tablo, Rozet, Toast, Modal, Toggle

---

## ⚙️ Ortam Değişkenleri

```bash
SECRET_KEY=gizli-anahtar-buraya   # Flask oturum şifreleme anahtarı
```

---

*ElementWars v1.0.0 — Tüm hakları saklıdır.*

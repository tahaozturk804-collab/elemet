-- ════════════════════════════════════════════════════════════
--  ElementWars — Supabase Migration
--  Supabase Dashboard → SQL Editor → Yeni sorgu → Çalıştır
-- ════════════════════════════════════════════════════════════

-- Mevcut tabloları temizle (gerekirse)
-- DROP TABLE IF EXISTS credit_history, order_items, tickets, cart_items, orders, products, categories, news, users CASCADE;

-- ── TABLOLAR ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
    id          SERIAL PRIMARY KEY,
    username    TEXT UNIQUE NOT NULL,
    email       TEXT UNIQUE NOT NULL,
    password    TEXT NOT NULL,
    credit      NUMERIC(12,2) DEFAULT 0,
    is_admin    INTEGER DEFAULT 0,
    first_name  TEXT DEFAULT '',
    last_name   TEXT DEFAULT '',
    phone       TEXT DEFAULT '',
    discord     TEXT DEFAULT '',
    created_at  BIGINT
);

CREATE TABLE IF NOT EXISTS categories (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    parent_id   INTEGER,
    priority    INTEGER DEFAULT 0,
    emoji       TEXT DEFAULT '📦',
    created_at  BIGINT
);

CREATE TABLE IF NOT EXISTS products (
    id           SERIAL PRIMARY KEY,
    name         TEXT NOT NULL,
    category_id  INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    price        NUMERIC(12,2) DEFAULT 0,
    stock        INTEGER,
    description  TEXT DEFAULT '',
    image_emoji  TEXT DEFAULT '📦',
    priority     INTEGER DEFAULT 0,
    created_at   BIGINT
);

CREATE TABLE IF NOT EXISTS cart_items (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_id  INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity    INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS orders (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users(id) ON DELETE SET NULL,
    total           NUMERIC(12,2),
    payment_method  TEXT,
    status          TEXT DEFAULT 'Bekliyor',
    created_at      BIGINT
);

CREATE TABLE IF NOT EXISTS order_items (
    id          SERIAL PRIMARY KEY,
    order_id    INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id  INTEGER REFERENCES products(id) ON DELETE SET NULL,
    quantity    INTEGER,
    price       NUMERIC(12,2)
);

CREATE TABLE IF NOT EXISTS tickets (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title       TEXT,
    category    TEXT,
    message     TEXT,
    status      TEXT DEFAULT 'Açık',
    created_at  BIGINT
);

CREATE TABLE IF NOT EXISTS credit_history (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount      NUMERIC(12,2),
    type        TEXT,
    created_at  BIGINT
);

CREATE TABLE IF NOT EXISTS news (
    id          SERIAL PRIMARY KEY,
    title       TEXT,
    excerpt     TEXT,
    category    TEXT DEFAULT 'Updates',
    views       INTEGER DEFAULT 0,
    comments    INTEGER DEFAULT 0,
    created_at  BIGINT
);

-- ── DEMO VERİSİ ─────────────────────────────────────────────
-- Şifre: demo123 (SHA-256)
INSERT INTO users (username,email,password,credit,is_admin,created_at)
VALUES
  ('demo',    'demo@elementwars.net',    '3b02742398e66e9b35e8f5c26ded7dfbe0000000a8a859d9a62b5ce9b4c67b50', 735.01, 1, EXTRACT(EPOCH FROM NOW())::BIGINT),
  ('player1', 'player1@elementwars.net', '3b02742398e66e9b35e8f5c26ded7dfbe0000000a8a859d9a62b5ce9b4c67b50', 165.02, 0, EXTRACT(EPOCH FROM NOW())::BIGINT)
ON CONFLICT (username) DO NOTHING;

-- NOT: Yukarıdaki şifre hash'i örnek için kısaltılmıştır.
-- app.py init_db() fonksiyonu gerçek SHA-256 hash ile demo kullanıcıları oluşturur.
-- Bu SQL'i çalıştırdıktan sonra python app.py çalıştırırsanız otomatik seed yapılır.

-- Kategoriler
INSERT INTO categories (id,name,priority,emoji,created_at) VALUES
  (1,'VIP',99,'👑',EXTRACT(EPOCH FROM NOW())::BIGINT),
  (2,'Skyblock',50,'🏝️',EXTRACT(EPOCH FROM NOW())::BIGINT),
  (3,'Survival',30,'⚔️',EXTRACT(EPOCH FROM NOW())::BIGINT)
ON CONFLICT (id) DO NOTHING;
SELECT setval('categories_id_seq',(SELECT MAX(id) FROM categories));

-- Ürünler
INSERT INTO products (name,category_id,price,stock,description,image_emoji,priority,created_at) VALUES
  ('VIP',           1,  9.99, NULL, 'Temel VIP paketi',        '👑', 3, EXTRACT(EPOCH FROM NOW())::BIGINT),
  ('VIP+',          1, 14.99, NULL, 'Gelişmiş VIP paketi',     '💎', 2, EXTRACT(EPOCH FROM NOW())::BIGINT),
  ('MVIP',          1, 29.99, NULL, 'Maksimum VIP paketi',     '⭐', 1, EXTRACT(EPOCH FROM NOW())::BIGINT),
  ('Iron Golem Spawner', 2, 9.99, 25, 'Iron Golem spawner',   '⚙️', 3, EXTRACT(EPOCH FROM NOW())::BIGINT),
  ('Chicken Spawner',    2, 4.99, NULL, 'Chicken spawner',     '🐔', 2, EXTRACT(EPOCH FROM NOW())::BIGINT),
  ('Cow Spawner',        2, 4.99, NULL, 'Cow spawner',         '🐄', 1, EXTRACT(EPOCH FROM NOW())::BIGINT),
  ('Iron Set',      3,  7.99, NULL, 'Demir armor seti',        '🛡️', 2, EXTRACT(EPOCH FROM NOW())::BIGINT),
  ('Diamond Set',   3, 19.99,   10, 'Elmas armor seti',        '💠', 1, EXTRACT(EPOCH FROM NOW())::BIGINT);

-- Haberler
INSERT INTO news (title,excerpt,category,views,comments,created_at) VALUES
  ('ElementWars v2.0 Yayında!', 'Yeni sezon başlıyor! Tüm oyunculara çift XP haftası...', 'Updates', 24, 5, EXTRACT(EPOCH FROM NOW())::BIGINT),
  ('Skyblock Güncellemesi', 'Yeni adalar, yeni bosslar ve özel ödüller sizi bekliyor...', 'Updates', 12, 3, EXTRACT(EPOCH FROM NOW())::BIGINT),
  ('PvP Turnuvası Başlıyor', 'Bu hafta sonu büyük PvP turnuvası! Ödüller çok cazip...', 'Events', 30, 8, EXTRACT(EPOCH FROM NOW())::BIGINT);

-- ElementWars Database Dump
-- Generated: 2026-03-18 11:17:16
-- Demo: demo / demo123

PRAGMA foreign_keys = OFF;

-- cart_items
DROP TABLE IF EXISTS cart_items;
CREATE TABLE cart_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER, product_id INTEGER, quantity INTEGER DEFAULT 1
        );


-- categories
DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL, parent_id INTEGER, priority INTEGER DEFAULT 0,
            emoji TEXT DEFAULT '📦', created_at INTEGER
        );

INSERT INTO categories (id, name, parent_id, priority, emoji, created_at) VALUES (1, 'VIP', NULL, 99, '👑', 1773817131);
INSERT INTO categories (id, name, parent_id, priority, emoji, created_at) VALUES (2, 'Skyblock', NULL, 50, '🏝️', 1773817131);
INSERT INTO categories (id, name, parent_id, priority, emoji, created_at) VALUES (3, 'Survival', NULL, 30, '⚔️', 1773817131);

-- credit_history
DROP TABLE IF EXISTS credit_history;
CREATE TABLE credit_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER, amount REAL, type TEXT, created_at INTEGER
        );

INSERT INTO credit_history (id, user_id, amount, type, created_at) VALUES (1, 1, 250.0, 'Manuel Ödeme', 1773817131);

-- news
DROP TABLE IF EXISTS news;
CREATE TABLE news (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT, excerpt TEXT, category TEXT DEFAULT 'Updates',
            views INTEGER DEFAULT 0, comments INTEGER DEFAULT 0, created_at INTEGER
        );

INSERT INTO news (id, title, excerpt, category, views, comments, created_at) VALUES (1, 'ElementWars v2.0 Yayında!', 'Yeni sezon başlıyor! Tüm oyunculara çift XP haftası...', 'Updates', 12, 3, 1773817131);
INSERT INTO news (id, title, excerpt, category, views, comments, created_at) VALUES (2, 'Skyblock Güncellemesi', 'Yeni adalar, yeni bosslar ve özel ödüller sizi bekliyor...', 'Updates', 12, 3, 1773817131);

-- order_items
DROP TABLE IF EXISTS order_items;
CREATE TABLE order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER, product_id INTEGER, quantity INTEGER, price REAL
        );

INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES (1, 1, 1, 1, 14.99);

-- orders
DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER, total REAL, payment_method TEXT,
            status TEXT DEFAULT 'Bekliyor', created_at INTEGER
        );

INSERT INTO orders (id, user_id, total, payment_method, status, created_at) VALUES (1, 1, 250.0, 'Manuel', 'Başarılı', 1773817131);

-- products
DROP TABLE IF EXISTS products;
CREATE TABLE products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL, category_id INTEGER, price REAL DEFAULT 0,
            stock INTEGER, description TEXT DEFAULT '', image_emoji TEXT DEFAULT '📦',
            priority INTEGER DEFAULT 0, created_at INTEGER,
            FOREIGN KEY (category_id) REFERENCES categories(id)
        );

INSERT INTO products (id, name, category_id, price, stock, description, image_emoji, priority, created_at) VALUES (1, 'VIP', 1, 9.99, NULL, 'Temel VIP paketi', '👑', 3, 1773817131);
INSERT INTO products (id, name, category_id, price, stock, description, image_emoji, priority, created_at) VALUES (2, 'VIP+', 1, 14.99, NULL, 'Gelişmiş VIP paketi', '💎', 2, 1773817131);
INSERT INTO products (id, name, category_id, price, stock, description, image_emoji, priority, created_at) VALUES (3, 'MVIP', 1, 29.99, NULL, 'Maksimum VIP paketi', '⭐', 1, 1773817131);
INSERT INTO products (id, name, category_id, price, stock, description, image_emoji, priority, created_at) VALUES (4, 'Iron Golem Spawner', 2, 9.99, 25, 'Iron Golem spawner', '⚙️', 3, 1773817131);
INSERT INTO products (id, name, category_id, price, stock, description, image_emoji, priority, created_at) VALUES (5, 'Chicken Spawner', 2, 4.99, NULL, 'Chicken spawner', '🐔', 2, 1773817131);
INSERT INTO products (id, name, category_id, price, stock, description, image_emoji, priority, created_at) VALUES (6, 'Cow Spawner', 2, 4.99, NULL, 'Cow spawner', '🐄', 1, 1773817131);
INSERT INTO products (id, name, category_id, price, stock, description, image_emoji, priority, created_at) VALUES (7, 'Iron Set', 3, 7.99, NULL, 'Demir armor seti', '🛡️', 2, 1773817131);
INSERT INTO products (id, name, category_id, price, stock, description, image_emoji, priority, created_at) VALUES (8, 'Diamond Set', 3, 19.99, 10, 'Elmas armor seti', '💠', 1, 1773817131);

-- tickets
DROP TABLE IF EXISTS tickets;
CREATE TABLE tickets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER, title TEXT, category TEXT,
            message TEXT, status TEXT DEFAULT 'Açık', created_at INTEGER
        );

INSERT INTO tickets (id, user_id, title, category, message, status, created_at) VALUES (1, 1, 'Help me!', 'Game', 'Yardım lazım...', 'Açık', 1773817131);

-- users
DROP TABLE IF EXISTS users;
CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL, email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL, credit REAL DEFAULT 0, is_admin INTEGER DEFAULT 0,
            first_name TEXT DEFAULT '', last_name TEXT DEFAULT '',
            phone TEXT DEFAULT '', discord TEXT DEFAULT '', created_at INTEGER
        );

INSERT INTO users (id, username, email, password, credit, is_admin, first_name, last_name, phone, discord, created_at) VALUES (1, 'demo', 'demo@elementwars.net', 'd3ad9315b7be5dd53b31a273b3b3aba5defe700808305aa16a3062b76658a791', 735.01, 1, '', '', '', '', 1773817131);
INSERT INTO users (id, username, email, password, credit, is_admin, first_name, last_name, phone, discord, created_at) VALUES (2, 'player1', 'player1@elementwars.net', 'd3ad9315b7be5dd53b31a273b3b3aba5defe700808305aa16a3062b76658a791', 165.02, 0, '', '', '', '', 1773817131);

PRAGMA foreign_keys = ON;
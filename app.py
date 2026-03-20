"""
ElementWars — Minecraft Server Management Platform
Supports PostgreSQL (Supabase) and SQLite (local dev)
Set DATABASE_URL in .env for Supabase.
"""

import os, time, re, hashlib
from functools import wraps

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from flask import Flask, render_template, request, jsonify, session

try:
    import psycopg2, psycopg2.extras
    DB_DRIVER = "postgres"
except ImportError:
    import sqlite3
    DB_DRIVER = "sqlite"

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "elementwars-dev-secret")
DATABASE_URL  = os.environ.get("DATABASE_URL", "")
SQLITE_PATH   = os.path.join(os.path.dirname(__file__), "elementwars.db")

# ─────────────────────────────────────────
#  DATABASE HELPERS
# ─────────────────────────────────────────
def _connect():
    if DB_DRIVER == "postgres" and DATABASE_URL:
        url = DATABASE_URL.replace("postgres://", "postgresql://", 1)
        conn = psycopg2.connect(url); conn.autocommit = False
        return conn, "postgres"
    conn = sqlite3.connect(SQLITE_PATH); conn.row_factory = sqlite3.Row
    return conn, "sqlite"

def query(sql, args=(), one=False):
    conn, drv = _connect()
    try:
        if drv == "postgres":
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as c:
                c.execute(sql.replace("?","%s"), args); rv = [dict(r) for r in c.fetchall()]
            conn.commit()
        else:
            rv = [dict(r) for r in conn.execute(sql, args).fetchall()]
        return (rv[0] if rv else None) if one else rv
    finally:
        conn.close()

def modify(sql, args=()):
    conn, drv = _connect()
    try:
        if drv == "postgres":
            pg = sql.replace("?","%s")
            if pg.strip().upper().startswith("INSERT"): pg = pg.rstrip(";") + " RETURNING id"
            with conn.cursor() as c:
                c.execute(pg, args)
                lid = c.fetchone()[0] if pg.upper().find("RETURNING")>0 else None
            conn.commit(); return lid
        else:
            c = conn.execute(sql, args); conn.commit(); return c.lastrowid
    finally:
        conn.close()

def hashpw(pw): return hashlib.sha256(pw.encode()).hexdigest()

# ─────────────────────────────────────────
#  DECORATORS
# ─────────────────────────────────────────
def login_required(f):
    @wraps(f)
    def d(*a,**k):
        if "user_id" not in session: return jsonify({"success":False,"error":"Giriş gerekiyor"}),401
        return f(*a,**k)
    return d

def admin_required(f):
    @wraps(f)
    def d(*a,**k):
        if "user_id" not in session: return jsonify({"success":False,"error":"Giriş gerekiyor"}),401
        u = query("SELECT is_admin FROM users WHERE id=?",[session["user_id"]],one=True)
        if not u or not u["is_admin"]: return jsonify({"success":False,"error":"Admin yetkisi gerekiyor"}),403
        return f(*a,**k)
    return d

# ─────────────────────────────────────────
#  PAGE ROUTES
# ─────────────────────────────────────────
@app.route("/")           
def index():          return render_template("index.html")
@app.route("/store")      
def store():          return render_template("store.html")
@app.route("/login")      
def login_page():     return render_template("login.html")
@app.route("/register")   
def register_page():  return render_template("register.html")
@app.route("/cart")       
def cart_page():      return render_template("cart.html")
@app.route("/support")    
def support_page():   return render_template("support.html")
@app.route("/profile")    
def profile_page():   return render_template("profile.html")
@app.route("/dashboard")  
def dashboard_page(): return render_template("dashboard.html")

@app.route("/dashboard/users")
def dashboard_users(): return render_template("dashboard_users.html")

@app.route("/dashboard/store")
def dashboard_store(): return render_template("dashboard_store.html")

@app.route("/dashboard/support")
def dashboard_support(): return render_template("dashboard_support.html")

@app.route("/dashboard/apps")
def dashboard_apps(): return render_template("dashboard_apps.html")

@app.route("/apply")
def apply_page(): return render_template("apply.html")

# ─────────────────────────────────────────
#  AUTH
# ─────────────────────────────────────────
@app.route("/api/auth/register", methods=["POST"])
def api_register():
    d = request.get_json()
    un,em,pw = (d.get("username") or "").strip(), (d.get("email") or "").strip(), d.get("password") or ""
    if not un or not em or not pw: return jsonify({"success":False,"error":"Tüm alanları doldurun"})
    if len(un)<3: return jsonify({"success":False,"error":"Kullanıcı adı en az 3 karakter"})
    if not re.match(r"[^@]+@[^@]+\.[^@]+",em): return jsonify({"success":False,"error":"Geçersiz e-posta"})
    if len(pw)<6: return jsonify({"success":False,"error":"Şifre en az 6 karakter"})
    if query("SELECT id FROM users WHERE username=? OR email=?",[un,em],one=True):
        return jsonify({"success":False,"error":"Kullanıcı adı veya e-posta zaten kullanılıyor"})
    uid = modify("INSERT INTO users (username,email,password,credit,is_admin,created_at) VALUES (?,?,?,?,?,?)",
                 [un,em,hashpw(pw),0.0,0,int(time.time())])
    session["user_id"]=uid; session["username"]=un; session["is_admin"]=False
    return jsonify({"success":True,"redirect":"/"})

@app.route("/api/auth/login", methods=["POST"])
def api_login():
    d = request.get_json()
    un,pw = (d.get("username") or "").strip(), d.get("password") or ""
    u = query("SELECT * FROM users WHERE (username=? OR email=?) AND password=?",[un,un,hashpw(pw)],one=True)
    if not u: return jsonify({"success":False,"error":"Kullanıcı adı veya şifre hatalı"})
    session["user_id"]=u["id"]; session["username"]=u["username"]; session["is_admin"]=bool(u["is_admin"])
    return jsonify({"success":True,"is_admin":bool(u["is_admin"]),"redirect":"/"})

@app.route("/api/auth/logout", methods=["POST"])
def api_logout():
    session.clear(); return jsonify({"success":True,"redirect":"/"})

@app.route("/api/auth/me")
def api_me():
    if "user_id" not in session: return jsonify({"logged_in":False})
    u = query("SELECT id,username,email,credit,is_admin,created_at FROM users WHERE id=?",[session["user_id"]],one=True)
    if not u: session.clear(); return jsonify({"logged_in":False})
    return jsonify({"logged_in":True,**u,"is_admin":bool(u["is_admin"])})

# ─────────────────────────────────────────
#  STORE
# ─────────────────────────────────────────
@app.route("/api/store/categories")
def api_categories():
    return jsonify(query("SELECT * FROM categories ORDER BY priority DESC"))

@app.route("/api/store/categories/<int:cid>/products")
def api_cat_products(cid):
    return jsonify(query("SELECT * FROM products WHERE category_id=? ORDER BY priority DESC",[cid]))

@app.route("/api/store/products")
def api_products():
    return jsonify(query("SELECT p.*,c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id=c.id ORDER BY p.priority DESC"))

# ─────────────────────────────────────────
#  CART
# ─────────────────────────────────────────
@app.route("/api/cart")
@login_required
def api_get_cart():
    items = query("SELECT ci.id,ci.quantity,p.id AS product_id,p.name,p.price,p.image_emoji FROM cart_items ci JOIN products p ON ci.product_id=p.id WHERE ci.user_id=?",[session["user_id"]])
    return jsonify({"items":items,"total":round(sum(i["price"]*i["quantity"] for i in items),2)})

@app.route("/api/cart/add", methods=["POST"])
@login_required
def api_cart_add():
    d = request.get_json(); pid=d.get("product_id"); qty=int(d.get("quantity",1))
    if not query("SELECT id FROM products WHERE id=?",[pid],one=True):
        return jsonify({"success":False,"error":"Ürün bulunamadı"})
    ex = query("SELECT id FROM cart_items WHERE user_id=? AND product_id=?",[session["user_id"],pid],one=True)
    if ex: modify("UPDATE cart_items SET quantity=quantity+? WHERE user_id=? AND product_id=?",[qty,session["user_id"],pid])
    else:  modify("INSERT INTO cart_items (user_id,product_id,quantity) VALUES (?,?,?)",[session["user_id"],pid,qty])
    return jsonify({"success":True,"message":"Sepete eklendi!"})

@app.route("/api/cart/remove/<int:item_id>", methods=["DELETE"])
@login_required
def api_cart_remove(item_id):
    modify("DELETE FROM cart_items WHERE id=? AND user_id=?",[item_id,session["user_id"]]); return jsonify({"success":True})

@app.route("/api/cart/checkout", methods=["POST"])
@login_required
def api_checkout():
    d = request.get_json(); use_credit=d.get("use_credit",False)
    u = query("SELECT * FROM users WHERE id=?",[session["user_id"]],one=True)
    items = query("SELECT ci.quantity,p.price,p.id AS pid FROM cart_items ci JOIN products p ON ci.product_id=p.id WHERE ci.user_id=?",[session["user_id"]])
    if not items: return jsonify({"success":False,"error":"Sepet boş"})
    total = round(sum(i["price"]*i["quantity"] for i in items),2)
    if use_credit and u["credit"]<total: return jsonify({"success":False,"error":"Yetersiz kredi"})
    if use_credit: modify("UPDATE users SET credit=credit-? WHERE id=?",[total,session["user_id"]])
    oid = modify("INSERT INTO orders (user_id,total,payment_method,status,created_at) VALUES (?,?,?,?,?)",
                 [session["user_id"],total,"Kredi" if use_credit else "Manuel","Başarılı",int(time.time())])
    for i in items: modify("INSERT INTO order_items (order_id,product_id,quantity,price) VALUES (?,?,?,?)",[oid,i["pid"],i["quantity"],i["price"]])
    modify("DELETE FROM cart_items WHERE user_id=?",[session["user_id"]])
    return jsonify({"success":True,"order_id":oid,"message":"Ödeme başarılı!"})

# ─────────────────────────────────────────
#  SUPPORT
# ─────────────────────────────────────────
@app.route("/api/support/tickets")
@login_required
def api_tickets():
    if session.get("is_admin"):
        return jsonify(query("SELECT t.*,u.username FROM tickets t LEFT JOIN users u ON t.user_id=u.id ORDER BY t.created_at DESC"))
    return jsonify(query("SELECT t.*,u.username FROM tickets t LEFT JOIN users u ON t.user_id=u.id WHERE t.user_id=? ORDER BY t.created_at DESC",[session["user_id"]]))

@app.route("/api/support/tickets", methods=["POST"])
@login_required
def api_create_ticket():
    d = request.get_json()
    title,msg,cat = (d.get("title") or "").strip(),(d.get("message") or "").strip(),(d.get("category") or "General").strip()
    if not title or not msg: return jsonify({"success":False,"error":"Başlık ve mesaj gerekli"})
    tid = modify("INSERT INTO tickets (user_id,title,category,message,status,created_at) VALUES (?,?,?,?,?,?)",[session["user_id"],title,cat,msg,"Açık",int(time.time())])
    return jsonify({"success":True,"ticket_id":tid})

@app.route("/api/support/tickets/<int:tid>", methods=["DELETE"])
@login_required
def api_del_ticket(tid):
    t = query("SELECT * FROM tickets WHERE id=?",[tid],one=True)
    if not t: return jsonify({"success":False,"error":"Bulunamadı"}),404
    if not session.get("is_admin") and t["user_id"]!=session["user_id"]: return jsonify({"success":False,"error":"Yetki yok"}),403
    modify("DELETE FROM tickets WHERE id=?",[tid]); return jsonify({"success":True})

# ─────────────────────────────────────────
#  ACCOUNT
# ─────────────────────────────────────────
@app.route("/api/account/orders")
@login_required
def api_orders():
    return jsonify(query("SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC",[session["user_id"]]))

@app.route("/api/account/credit-history")
@login_required
def api_credit_history():
    return jsonify(query("SELECT * FROM credit_history WHERE user_id=? ORDER BY created_at DESC",[session["user_id"]]))

@app.route("/api/account/profile", methods=["PUT"])
@login_required
def api_update_profile():
    d = request.get_json()
    modify("UPDATE users SET first_name=?,last_name=?,phone=?,discord=? WHERE id=?",[d.get("first_name",""),d.get("last_name",""),d.get("phone",""),d.get("discord",""),session["user_id"]])
    return jsonify({"success":True,"message":"Profil güncellendi"})

@app.route("/api/account/change-password", methods=["PUT"])
@login_required
def api_change_pw():
    d = request.get_json(); u = query("SELECT * FROM users WHERE id=?",[session["user_id"]],one=True)
    if u["password"]!=hashpw(d.get("current_password","")): return jsonify({"success":False,"error":"Mevcut şifre hatalı"})
    new=d.get("new_password","")
    if len(new)<6: return jsonify({"success":False,"error":"Yeni şifre en az 6 karakter"})
    modify("UPDATE users SET password=? WHERE id=?",[hashpw(new),session["user_id"]])
    return jsonify({"success":True,"message":"Şifre güncellendi"})

# ─────────────────────────────────────────
#  ADMIN
# ─────────────────────────────────────────
@app.route("/api/admin/stats")
@admin_required
def api_admin_stats():
    n = int(time.time())
    return jsonify({
        "total_users":    query("SELECT COUNT(*) AS c FROM users",one=True)["c"],
        "today_sales":    round(query("SELECT COALESCE(SUM(total),0) AS s FROM orders WHERE status='Başarılı' AND created_at>=?",[n-86400],one=True)["s"],2),
        "monthly_sales":  round(query("SELECT COALESCE(SUM(total),0) AS s FROM orders WHERE status='Başarılı' AND created_at>=?",[n-2592000],one=True)["s"],2),
        "open_tickets":   query("SELECT COUNT(*) AS c FROM tickets WHERE status='Açık'",one=True)["c"],
        "total_products": query("SELECT COUNT(*) AS c FROM products",one=True)["c"],
        "total_orders":   query("SELECT COUNT(*) AS c FROM orders",one=True)["c"],
    })

@app.route("/api/admin/users")
@admin_required
def api_admin_users():
    return jsonify(query("SELECT id,username,email,credit,is_admin,created_at FROM users ORDER BY id"))

@app.route("/api/admin/users", methods=["POST"])
@admin_required
def api_admin_create_user():
    d = request.get_json(); un,em,pw = (d.get("username") or "").strip(),(d.get("email") or "").strip(),d.get("password") or ""
    if not un or not em or not pw: return jsonify({"success":False,"error":"Tüm alanları doldurun"})
    if query("SELECT id FROM users WHERE username=? OR email=?",[un,em],one=True):
        return jsonify({"success":False,"error":"Kullanıcı adı veya e-posta zaten var"})
    uid = modify("INSERT INTO users (username,email,password,credit,is_admin,created_at) VALUES (?,?,?,?,?,?)",
                 [un,em,hashpw(pw),float(d.get("credit",0)),int(d.get("is_admin",0)),int(time.time())])
    return jsonify({"success":True,"user_id":uid})

@app.route("/api/admin/users/<int:uid>", methods=["DELETE"])
@admin_required
def api_admin_del_user(uid):
    if uid==session["user_id"]: return jsonify({"success":False,"error":"Kendinizi silemezsiniz"})
    modify("DELETE FROM users WHERE id=?",[uid]); return jsonify({"success":True})

@app.route("/api/admin/send-credit", methods=["POST"])
@admin_required
def api_admin_send_credit():
    d = request.get_json(); un=(d.get("username") or "").strip(); amount=float(d.get("amount",0)); earn=d.get("is_earning",True)
    u = query("SELECT * FROM users WHERE username=?",[un],one=True)
    if not u: return jsonify({"success":False,"error":"Kullanıcı bulunamadı"})
    if amount<=0: return jsonify({"success":False,"error":"Geçersiz miktar"})
    if earn: modify("UPDATE users SET credit=credit+? WHERE id=?",[amount,u["id"]])
    else:
        if u["credit"]<amount: return jsonify({"success":False,"error":"Yetersiz bakiye"})
        modify("UPDATE users SET credit=credit-? WHERE id=?",[amount,u["id"]])
    modify("INSERT INTO credit_history (user_id,amount,type,created_at) VALUES (?,?,?,?)",
           [u["id"],amount if earn else -amount,"Yönetici Transferi",int(time.time())])
    return jsonify({"success":True,"message":f"{amount:.2f} USD {'gönderildi' if earn else 'düşüldü'}"})

@app.route("/api/admin/categories", methods=["GET"])
@admin_required
def api_admin_cats():
    return jsonify(query("SELECT * FROM categories ORDER BY priority DESC"))

@app.route("/api/admin/categories", methods=["POST"])
@admin_required
def api_admin_create_cat():
    d = request.get_json(); name=(d.get("name") or "").strip()
    if not name: return jsonify({"success":False,"error":"Ad gerekli"})
    cid = modify("INSERT INTO categories (name,parent_id,priority,emoji,created_at) VALUES (?,?,?,?,?)",
                 [name,d.get("parent_id"),int(d.get("priority",0)),d.get("emoji","📦"),int(time.time())])
    return jsonify({"success":True,"category_id":cid})

@app.route("/api/admin/categories/<int:cid>", methods=["DELETE"])
@admin_required
def api_admin_del_cat(cid):
    modify("DELETE FROM categories WHERE id=?",[cid]); return jsonify({"success":True})

@app.route("/api/admin/products", methods=["POST"])
@admin_required
def api_admin_create_product():
    d = request.get_json(); name=(d.get("name") or "").strip(); cid=d.get("category_id")
    if not name or not cid: return jsonify({"success":False,"error":"Ad ve kategori gerekli"})
    sv=d.get("stock"); stock=int(sv) if sv else None
    pid = modify("INSERT INTO products (name,category_id,price,stock,description,image_emoji,priority,created_at) VALUES (?,?,?,?,?,?,?,?)",
                 [name,cid,float(d.get("price",0)),stock,d.get("description",""),d.get("emoji","📦"),int(d.get("priority",0)),int(time.time())])
    return jsonify({"success":True,"product_id":pid})

@app.route("/api/admin/products/<int:pid>", methods=["DELETE"])
@admin_required
def api_admin_del_product(pid):
    modify("DELETE FROM products WHERE id=?",[pid]); return jsonify({"success":True})

@app.route("/api/admin/orders")
@admin_required
def api_admin_orders():
    return jsonify(query("SELECT o.*,u.username FROM orders o LEFT JOIN users u ON o.user_id=u.id ORDER BY o.created_at DESC LIMIT 200"))

@app.route("/api/admin/tickets")
@admin_required
def api_admin_tickets():
    return jsonify(query("SELECT t.*,u.username FROM tickets t LEFT JOIN users u ON t.user_id=u.id ORDER BY t.created_at DESC"))

@app.route("/api/admin/tickets/<int:tid>/close", methods=["PUT"])
@admin_required
def api_admin_close_ticket(tid):
    modify("UPDATE tickets SET status='Kapalı' WHERE id=?",[tid]); return jsonify({"success":True})

# ─────────────────────────────────────────
#  HOME / NEWS
# ─────────────────────────────────────────
@app.route("/api/home/leaderboard")
def api_leaderboard():
    return jsonify(query("SELECT u.username,SUM(o.total) AS total_spent FROM orders o JOIN users u ON o.user_id=u.id WHERE o.status='Başarılı' GROUP BY o.user_id,u.username ORDER BY total_spent DESC LIMIT 10"))

@app.route("/api/home/recent-purchases")
def api_recent_purchases():
    return jsonify(query("SELECT u.username,c.name AS category,p.name AS product FROM orders o JOIN users u ON o.user_id=u.id JOIN order_items oi ON oi.order_id=o.id JOIN products p ON oi.product_id=p.id JOIN categories c ON p.category_id=c.id ORDER BY o.created_at DESC LIMIT 10"))

@app.route("/api/news")
def api_news():
    return jsonify(query("SELECT * FROM news ORDER BY created_at DESC LIMIT 10"))

# ─────────────────────────────────────────
#  INIT DB + SEED
# ─────────────────────────────────────────
def init_db():
    conn, drv = _connect()
    cur = conn.cursor()

    if drv == "postgres":
        schema = """
        CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY,username TEXT UNIQUE NOT NULL,email TEXT UNIQUE NOT NULL,password TEXT NOT NULL,credit NUMERIC(12,2) DEFAULT 0,is_admin INTEGER DEFAULT 0,first_name TEXT DEFAULT '',last_name TEXT DEFAULT '',phone TEXT DEFAULT '',discord TEXT DEFAULT '',created_at BIGINT);
        CREATE TABLE IF NOT EXISTS categories(id SERIAL PRIMARY KEY,name TEXT NOT NULL,parent_id INTEGER,priority INTEGER DEFAULT 0,emoji TEXT DEFAULT '📦',created_at BIGINT);
        CREATE TABLE IF NOT EXISTS products(id SERIAL PRIMARY KEY,name TEXT NOT NULL,category_id INTEGER REFERENCES categories(id),price NUMERIC(12,2) DEFAULT 0,stock INTEGER,description TEXT DEFAULT '',image_emoji TEXT DEFAULT '📦',priority INTEGER DEFAULT 0,created_at BIGINT);
        CREATE TABLE IF NOT EXISTS cart_items(id SERIAL PRIMARY KEY,user_id INTEGER REFERENCES users(id),product_id INTEGER REFERENCES products(id),quantity INTEGER DEFAULT 1);
        CREATE TABLE IF NOT EXISTS orders(id SERIAL PRIMARY KEY,user_id INTEGER REFERENCES users(id),total NUMERIC(12,2),payment_method TEXT,status TEXT DEFAULT 'Bekliyor',created_at BIGINT);
        CREATE TABLE IF NOT EXISTS order_items(id SERIAL PRIMARY KEY,order_id INTEGER REFERENCES orders(id),product_id INTEGER REFERENCES products(id),quantity INTEGER,price NUMERIC(12,2));
        CREATE TABLE IF NOT EXISTS tickets(id SERIAL PRIMARY KEY,user_id INTEGER REFERENCES users(id),title TEXT,category TEXT,message TEXT,status TEXT DEFAULT 'Açık',created_at BIGINT);
        CREATE TABLE IF NOT EXISTS credit_history(id SERIAL PRIMARY KEY,user_id INTEGER REFERENCES users(id),amount NUMERIC(12,2),type TEXT,created_at BIGINT);
        CREATE TABLE IF NOT EXISTS news(id SERIAL PRIMARY KEY,title TEXT,excerpt TEXT,category TEXT DEFAULT 'Updates',views INTEGER DEFAULT 0,comments INTEGER DEFAULT 0,created_at BIGINT);
        """
        cur.execute(schema)
    else:
        conn.executescript("""
        CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT,username TEXT UNIQUE NOT NULL,email TEXT UNIQUE NOT NULL,password TEXT NOT NULL,credit REAL DEFAULT 0,is_admin INTEGER DEFAULT 0,first_name TEXT DEFAULT '',last_name TEXT DEFAULT '',phone TEXT DEFAULT '',discord TEXT DEFAULT '',created_at INTEGER);
        CREATE TABLE IF NOT EXISTS categories(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,parent_id INTEGER,priority INTEGER DEFAULT 0,emoji TEXT DEFAULT '📦',created_at INTEGER);
        CREATE TABLE IF NOT EXISTS products(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,category_id INTEGER,price REAL DEFAULT 0,stock INTEGER,description TEXT DEFAULT '',image_emoji TEXT DEFAULT '📦',priority INTEGER DEFAULT 0,created_at INTEGER,FOREIGN KEY(category_id)REFERENCES categories(id));
        CREATE TABLE IF NOT EXISTS cart_items(id INTEGER PRIMARY KEY AUTOINCREMENT,user_id INTEGER,product_id INTEGER,quantity INTEGER DEFAULT 1);
        CREATE TABLE IF NOT EXISTS orders(id INTEGER PRIMARY KEY AUTOINCREMENT,user_id INTEGER,total REAL,payment_method TEXT,status TEXT DEFAULT 'Bekliyor',created_at INTEGER);
        CREATE TABLE IF NOT EXISTS order_items(id INTEGER PRIMARY KEY AUTOINCREMENT,order_id INTEGER,product_id INTEGER,quantity INTEGER,price REAL);
        CREATE TABLE IF NOT EXISTS tickets(id INTEGER PRIMARY KEY AUTOINCREMENT,user_id INTEGER,title TEXT,category TEXT,message TEXT,status TEXT DEFAULT 'Açık',created_at INTEGER);
        CREATE TABLE IF NOT EXISTS credit_history(id INTEGER PRIMARY KEY AUTOINCREMENT,user_id INTEGER,amount REAL,type TEXT,created_at INTEGER);
        CREATE TABLE IF NOT EXISTS news(id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT,excerpt TEXT,category TEXT DEFAULT 'Updates',views INTEGER DEFAULT 0,comments INTEGER DEFAULT 0,created_at INTEGER);
        """)
    conn.commit()

    # Count users
    cur.execute("SELECT COUNT(*) FROM users")
    count = cur.fetchone()[0]

    if count == 0:
        pw=hashpw("demo123"); ts=int(time.time())
        seed_u=[("demo","demo@elementwars.net",pw,735.01,1,ts),("player1","player1@elementwars.net",pw,165.02,0,ts)]
        seed_c=[(1,"VIP",None,99,"👑",ts),(2,"Skyblock",None,50,"🏝️",ts),(3,"Survival",None,30,"⚔️",ts)]
        seed_p=[("VIP",1,9.99,None,"Temel VIP paketi","👑",3,ts),("VIP+",1,14.99,None,"Gelişmiş VIP","💎",2,ts),("MVIP",1,29.99,None,"Maksimum VIP","⭐",1,ts),("Iron Golem Spawner",2,9.99,25,"Iron Golem spawner","⚙️",3,ts),("Chicken Spawner",2,4.99,None,"Chicken spawner","🐔",2,ts),("Cow Spawner",2,4.99,None,"Cow spawner","🐄",1,ts),("Iron Set",3,7.99,None,"Demir armor","🛡️",2,ts),("Diamond Set",3,19.99,10,"Elmas armor","💠",1,ts)]
        seed_n=[("ElementWars v2.0 Yayında!","Yeni sezon başlıyor! Çift XP haftası...","Updates",24,5,ts),("Skyblock Güncellemesi","Yeni adalar, bosslar ve ödüller...","Updates",12,3,ts),("PvP Turnuvası Başlıyor","Bu hafta sonu büyük PvP turnuvası!","Events",30,8,ts)]

        if drv=="postgres":
            for r in seed_u: cur.execute("INSERT INTO users(username,email,password,credit,is_admin,created_at)VALUES(%s,%s,%s,%s,%s,%s)",r)
            for r in seed_c: cur.execute("INSERT INTO categories(id,name,parent_id,priority,emoji,created_at)VALUES(%s,%s,%s,%s,%s,%s)",r)
            cur.execute("SELECT setval('categories_id_seq',(SELECT MAX(id) FROM categories))")
            for r in seed_p: cur.execute("INSERT INTO products(name,category_id,price,stock,description,image_emoji,priority,created_at)VALUES(%s,%s,%s,%s,%s,%s,%s,%s)",r)
            for r in seed_n: cur.execute("INSERT INTO news(title,excerpt,category,views,comments,created_at)VALUES(%s,%s,%s,%s,%s,%s)",r)
            cur.execute("SELECT id FROM users WHERE username='demo'"); uid=cur.fetchone()[0]
            cur.execute("INSERT INTO orders(user_id,total,payment_method,status,created_at)VALUES(%s,%s,%s,%s,%s)RETURNING id",[uid,250.0,"Manuel","Başarılı",ts]); oid=cur.fetchone()[0]
            cur.execute("INSERT INTO order_items(order_id,product_id,quantity,price)VALUES(%s,%s,%s,%s)",[oid,1,1,14.99])
            cur.execute("INSERT INTO tickets(user_id,title,category,message,status,created_at)VALUES(%s,%s,%s,%s,%s,%s)",[uid,"Help me!","Game","Yardım lazım...","Açık",ts])
            cur.execute("INSERT INTO credit_history(user_id,amount,type,created_at)VALUES(%s,%s,%s,%s)",[uid,250.0,"Manuel Ödeme",ts])
        else:
            for r in seed_u: conn.execute("INSERT INTO users(username,email,password,credit,is_admin,created_at)VALUES(?,?,?,?,?,?)",r)
            for r in seed_c: conn.execute("INSERT INTO categories(id,name,parent_id,priority,emoji,created_at)VALUES(?,?,?,?,?,?)",r)
            for r in seed_p: conn.execute("INSERT INTO products(name,category_id,price,stock,description,image_emoji,priority,created_at)VALUES(?,?,?,?,?,?,?,?)",r)
            for r in seed_n: conn.execute("INSERT INTO news(title,excerpt,category,views,comments,created_at)VALUES(?,?,?,?,?,?)",r)
            uid=conn.execute("SELECT id FROM users WHERE username='demo'").fetchone()[0]
            oid=conn.execute("INSERT INTO orders(user_id,total,payment_method,status,created_at)VALUES(?,?,?,?,?)",[uid,250.0,"Manuel","Başarılı",ts]).lastrowid
            conn.execute("INSERT INTO order_items(order_id,product_id,quantity,price)VALUES(?,?,?,?)",[oid,1,1,14.99])
            conn.execute("INSERT INTO tickets(user_id,title,category,message,status,created_at)VALUES(?,?,?,?,?,?)",[uid,"Help me!","Game","Yardım lazım...","Açık",ts])
            conn.execute("INSERT INTO credit_history(user_id,amount,type,created_at)VALUES(?,?,?,?)",[uid,250.0,"Manuel Ödeme",ts])
        conn.commit()
        print(f"  ✓ Demo verisi oluşturuldu ({drv})")

    if drv=="postgres": cur.close()
    conn.close()

if __name__ == "__main__":
    print("\n" + "="*55)
    print("  ElementWars Platform")
    print(f"  Driver  : {DB_DRIVER.upper()}")
    if DB_DRIVER=="postgres" and DATABASE_URL:
        print(f"  DB URL  : {DATABASE_URL[:40]}...")
    else:
        print(f"  DB File : {SQLITE_PATH}")
        if not DATABASE_URL: print("  ⚠  DATABASE_URL not set → SQLite fallback")
    print("  URL     : http://localhost:5000")
    print("  Demo    : demo / demo123")
    print("="*55+"\n")
    init_db()
    app.run(debug=True, host="0.0.0.0", port=5000)

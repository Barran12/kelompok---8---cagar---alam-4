/* =========================================================
   PUSAKA SUNDA — db.js
   Lapisan akses data dengan dua backend & API seragam:
     all(filter) · get(kode) · insert(row) · update(kode,row) · remove(kode) · count()
   Backend dipilih otomatis:
     • SQLite (better-sqlite3) bila modul native tersedia  -> "database" sungguhan
     • Berkas JSON (fs)        bila tidak                    -> tetap persisten, nol native dep
   ========================================================= */
const fs = require("fs");
const path = require("path");

const SEED_PATH = path.join(__dirname, "seed.json");

function readSeed() {
  try { return JSON.parse(fs.readFileSync(SEED_PATH, "utf8")); }
  catch (e) { return []; }
}

/* -------------------- Backend A: SQLite -------------------- */
function makeSqliteBackend() {
  const Database = require("better-sqlite3"); // dapat melempar bila tak terpasang
  const db = new Database(path.join(__dirname, "pusaka.db"));
  db.exec(`CREATE TABLE IF NOT EXISTS sites (
    kode TEXT PRIMARY KEY, nama TEXT NOT NULL, kategori TEXT NOT NULL,
    era TEXT, lokasi TEXT, arsitek TEXT, lat REAL, lng REAL,
    foto TEXT, deskripsi TEXT, status TEXT DEFAULT 'usulan');`);

  const api = {
    backend: "sqlite",
    all: () => db.prepare("SELECT * FROM sites").all(),
    get: (kode) => db.prepare("SELECT * FROM sites WHERE kode=?").get(kode),
    count: () => db.prepare("SELECT COUNT(*) AS n FROM sites").get().n,
    insert: (r) => {
      db.prepare(`INSERT INTO sites
        (kode,nama,kategori,era,lokasi,arsitek,lat,lng,foto,deskripsi,status)
        VALUES (@kode,@nama,@kategori,@era,@lokasi,@arsitek,@lat,@lng,@foto,@deskripsi,@status)`).run(r);
      return r;
    },
    update: (kode, r) => {
      db.prepare(`UPDATE sites SET nama=@nama,kategori=@kategori,era=@era,lokasi=@lokasi,
        arsitek=@arsitek,lat=@lat,lng=@lng,foto=@foto,deskripsi=@deskripsi,status=@status
        WHERE kode=@kode`).run(Object.assign({}, r, { kode }));
      return api.get(kode);
    },
    remove: (kode) => db.prepare("DELETE FROM sites WHERE kode=?").run(kode).changes > 0,
  };
  if (api.count() === 0) readSeed().forEach(api.insert);
  return api;
}

/* -------------------- Backend B: JSON file -------------------- */
function makeJsonBackend() {
  const FILE = path.join(__dirname, "pusaka.data.json");
  let rows = [];
  function load() {
    try { rows = JSON.parse(fs.readFileSync(FILE, "utf8")); }
    catch (e) { rows = readSeed(); save(); }
  }
  function save() { fs.writeFileSync(FILE, JSON.stringify(rows, null, 2)); }
  load();

  return {
    backend: "json",
    all: () => rows.slice(),
    get: (kode) => rows.find((r) => r.kode === kode) || null,
    count: () => rows.length,
    insert: (r) => { rows.push(r); save(); return r; },
    update: (kode, r) => {
      const i = rows.findIndex((x) => x.kode === kode);
      if (i === -1) return null;
      rows[i] = Object.assign({}, rows[i], r, { kode });
      save();
      return rows[i];
    },
    remove: (kode) => {
      const before = rows.length;
      rows = rows.filter((r) => r.kode !== kode);
      save();
      return rows.length < before;
    },
  };
}

/* -------------------- pemilihan otomatis -------------------- */
let backend;
try {
  backend = makeSqliteBackend();
  console.log("Database: SQLite (better-sqlite3).");
} catch (e) {
  backend = makeJsonBackend();
  console.log("Database: berkas JSON (better-sqlite3 tidak tersedia, memakai fallback).");
}

module.exports = backend;

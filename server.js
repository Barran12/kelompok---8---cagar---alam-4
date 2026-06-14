/* =========================================================
   PUSAKA SUNDA — server.js
   Backend MVP: Express + lapisan db.js (SQLite / JSON fallback).
   - Menyajikan frontend statis dari /public
   - REST API CRUD untuk situs cagar budaya & cagar alam
   ========================================================= */
const express = require("express");
const path = require("path");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

/* validasi sederhana di sisi server */
function validate(b) {
  const errors = [];
  if (!b.nama || String(b.nama).trim().length < 3) errors.push("nama minimal 3 karakter");
  if (!["cagar-budaya", "cagar-alam"].includes(b.kategori)) errors.push("kategori tidak valid");
  if (b.lat == null || isNaN(parseFloat(b.lat))) errors.push("lat tidak valid");
  if (b.lng == null || isNaN(parseFloat(b.lng))) errors.push("lng tidak valid");
  if (!b.deskripsi || String(b.deskripsi).trim().length < 20) errors.push("deskripsi minimal 20 karakter");
  return errors;
}

function buildRow(b, kode, fallbackStatus) {
  return {
    kode,
    nama: String(b.nama).trim(),
    kategori: b.kategori,
    era: b.era || "",
    lokasi: b.lokasi || "",
    arsitek: b.arsitek || "",
    lat: parseFloat(b.lat),
    lng: parseFloat(b.lng),
    foto: b.foto || "",
    deskripsi: String(b.deskripsi).trim(),
    status: b.status || fallbackStatus || "usulan",
  };
}

/* ---------- READ: daftar (mendukung ?kategori= & ?q=) ---------- */
app.get("/api/sites", (req, res) => {
  let rows = db.all();
  const { kategori, q } = req.query;
  if (kategori && kategori !== "semua") rows = rows.filter((r) => r.kategori === kategori);
  if (q) {
    const s = String(q).toLowerCase();
    rows = rows.filter((r) =>
      [r.nama, r.lokasi, r.era, r.kode, r.arsitek].join(" ").toLowerCase().includes(s));
  }
  res.json(rows);
});

/* ---------- READ: satu situs ---------- */
app.get("/api/sites/:kode", (req, res) => {
  const row = db.get(req.params.kode);
  if (!row) return res.status(404).json({ error: "Situs tidak ditemukan." });
  res.json(row);
});

/* ---------- CREATE ---------- */
app.post("/api/sites", (req, res) => {
  const b = req.body || {};
  const errors = validate(b);
  if (errors.length) return res.status(400).json({ error: errors.join("; ") });

  let kode = b.kode;
  if (!kode) {
    const prefix = b.kategori === "cagar-alam" ? "CA" : "CB";
    const n = db.all().filter((r) => r.kategori === b.kategori).length + 1;
    kode = `${prefix}-32-${900 + n}`;
  }
  const row = db.insert(buildRow(b, kode, "usulan"));
  res.status(201).json(row);
});

/* ---------- UPDATE ---------- */
app.put("/api/sites/:kode", (req, res) => {
  const existing = db.get(req.params.kode);
  if (!existing) return res.status(404).json({ error: "Situs tidak ditemukan." });
  const b = req.body || {};
  const errors = validate(b);
  if (errors.length) return res.status(400).json({ error: errors.join("; ") });
  const row = db.update(req.params.kode, buildRow(b, req.params.kode, existing.status));
  res.json(row);
});

/* ---------- DELETE ---------- */
app.delete("/api/sites/:kode", (req, res) => {
  const ok = db.remove(req.params.kode);
  if (!ok) return res.status(404).json({ error: "Situs tidak ditemukan." });
  res.json({ ok: true, kode: req.params.kode });
});

/* ---------- fallback ke index ---------- */
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

app.listen(PORT, () => console.log(`Pusaka Sunda berjalan di http://localhost:${PORT}`));

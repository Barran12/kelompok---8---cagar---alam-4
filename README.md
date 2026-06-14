# Pusaka Sunda — Registry Cagar Budaya & Cagar Alam

> **Topik 8 — Tugas Besar Pengembangan Web** · Kelas Bisnis Digital 2024
> Semester Genap 2025–2026 · Dosen: Asep Maulana, PhD · **Kelompok 8**

Ensiklopedia & portal pelestarian **cagar budaya dan cagar alam tanah Sunda** (Jawa Barat).
Pengguna dapat menelusuri katalog situs, melihat sebarannya di peta interaktif, dan
**mengajukan situs baru** untuk diverifikasi — sebuah purwarupa fungsional (MVP).

---

## ✨ Fitur Utama

| Fitur | Keterangan | Bagian CRUD |
|---|---|---|
| Katalog situs | Kartu bergaya "kartu arsip": kode registry, era, kategori, stempel status | **Read** |
| Pencarian & filter | Cari berdasar nama/kota/era; saring Cagar Budaya / Cagar Alam | Read |
| Peta interaktif | Penanda Leaflet per situs, popup ringkasan, warna per kategori | Read |
| Detail situs | Modal berisi foto, era, arsitek, dan deskripsi lengkap | Read |
| Ajukan situs baru | Form tervalidasi → tersimpan ke database berstatus *usulan* | **Create** |
| Ubah situs | Tombol "Ubah" memuat data ke form lalu menyimpan perubahan | **Update** |
| Hapus situs | Tombol "Hapus" dengan konfirmasi | **Delete** |

Desain: arah **"dosir pelestarian"** — lembar survei/gambar ukur arsitektur. Palet batu
andesit + indigo batik (limewash dingin, bukan krem), tipografi teknis *Space Grotesk* +
*Newsreader* + *Spline Sans Mono* (ledger), grid surveyor, dan koordinat asli tiap situs.
Responsif penuh (Flexbox + Grid), `prefers-reduced-motion` dihormati.

---

## 🧱 Teknologi

- **Frontend:** HTML5, CSS (Grid/Flexbox), **Vanilla JavaScript** (tanpa framework)
- **Peta:** Leaflet.js + OpenStreetMap
- **Backend:** Node.js + Express (REST API)
- **Database:** SQLite (`better-sqlite3`) — *otomatis fallback ke berkas JSON* bila modul native tak tersedia, sehingga tetap berjalan di mana saja

---

## 📁 Struktur Proyek

```
pusaka-sunda/
├── server.js            # Express: static + REST API CRUD
├── db.js                # Lapisan database (SQLite ⇄ JSON fallback)
├── package.json
├── data/
│   └── seed.json        # Data benih (8 situs nyata Jawa Barat)
├── public/              # Frontend (yang di-deploy sebagai situs statis)
│   ├── index.html
│   ├── css/style.css
│   └── js/app.js
└── demo.html            # Versi 1-berkas (CSS+JS+data digabung) untuk pratinjau cepat
```

---

## 🚀 Menjalankan Secara Lokal

```bash
# 1. masuk folder & pasang dependensi
npm install

# 2. jalankan server
npm start

# 3. buka di peramban
#    http://localhost:3000
```

Saat pertama dijalankan, database otomatis diisi 8 situs dari `data/seed.json`.

> Hanya ingin melihat frontend tanpa backend? Buka **`demo.html`** langsung di peramban —
> ia berjalan mandiri dengan penyimpanan lokal (localStorage) / memori.

---

## 🔌 REST API

Basis: `/api/sites`

| Method | Endpoint | Fungsi |
|---|---|---|
| `GET` | `/api/sites` | Daftar semua situs (`?kategori=` & `?q=` opsional) |
| `GET` | `/api/sites/:kode` | Detail satu situs |
| `POST` | `/api/sites` | Tambah situs (Create) |
| `PUT` | `/api/sites/:kode` | Ubah situs (Update) |
| `DELETE` | `/api/sites/:kode` | Hapus situs (Delete) |

Validasi sisi server: nama ≥ 3 karakter, kategori valid, lat/lng numerik, deskripsi ≥ 20 karakter.

---

## ☁️ Deployment

**Opsi A — Statis (paling cepat, untuk presentasi Minggu 1 & demo CRUD sisi-klien):**
Deploy folder `public/` ke **Netlify** atau **Vercel** (drag-and-drop atau hubungkan repo).
Karena `app.js` punya fallback **localStorage**, fitur CRUD tetap berfungsi & persisten di peramban.

**Opsi B — Full-stack dengan database (untuk demo Minggu 2):**
Deploy seluruh repo ke **Render** / **Railway** (mendukung Node.js):
- Build command: `npm install`
- Start command: `npm start`
- Frontend otomatis disajikan oleh Express di route yang sama dengan API.

---

## 📅 Pembagian Kerja & Timeline (sesuai panduan 2 minggu)

**Minggu 1 (Presentasi 1 — 50%): antarmuka statis**
- Wireframe Figma halaman utama + form
- Slicing `index.html` + `css/style.css` (Grid/Flexbox, responsif HP)
- Halaman utama, katalog statis, dan layout form selesai

**Minggu 2 (Presentasi 2 — 50%): interaktivitas + backend**
- `app.js`: render katalog, filter/cari, peta Leaflet, modal
- Validasi form + CRUD (Create/Update/Delete)
- `server.js` + `db.js`: REST API + database, integrasi `fetch`
- Deploy live + riwayat commit Git yang merata antaranggota

Saran peran: **(1)** UI/CSS & responsif · **(2)** Leaflet & katalog · **(3)** Form & validasi JS · **(4)** Backend/DB & deploy. *Sesuaikan dengan jumlah anggota; pastikan tiap orang punya commit.*

---

## 🎯 Pemetaan ke Rubrik

| Kriteria | Bobot | Dipenuhi oleh |
|---|---|---|
| Kesesuaian Desain & Responsivitas | 35% | `style.css` (Grid/Flexbox, breakpoint HP), tema earthy, tipografi |
| Fungsionalitas CRUD & Backend MVP | 35% | `server.js` + `db.js` (database), API CRUD lengkap & tervalidasi |
| Interaktivitas Frontend & Form | 15% | `app.js`: filter, peta, modal, validasi real-time, toast |
| Deployment & GitHub | 15% | Panduan deploy Netlify/Render + alur commit kelompok |

---

*Data situs bersifat purwarupa (mock data) untuk keperluan akademik.*

/* =========================================================
   PUSAKA SUNDA — app.js
   Vanilla JS: CRUD, validasi form, peta Leaflet, interaktivitas.

   LAPISAN DATA (berurutan, otomatis fallback):
   1) REST API Node.js  (GET/POST/PUT/DELETE /api/sites)  -> mode server + database
   2) localStorage                                        -> deploy statis (Netlify/Vercel)
   3) memori (array)                                      -> pratinjau / sandbox
   ========================================================= */
(function () {
  "use strict";

  /* ---------- data benih (fallback bila API & file tak tersedia) ---------- */
  var DEFAULT_SEED = [
  {
    "kode": "CB-32-001",
    "nama": "Gedung Sate",
    "kategori": "cagar-budaya",
    "era": "1920 (Hindia Belanda)",
    "lokasi": "Bandung",
    "lat": -6.902546,
    "lng": 107.618881,
    "arsitek": "J. Gerber",
    "deskripsi": "Bekas Gouvernements Bedrijven, kini Kantor Gubernur Jawa Barat. Memadukan langgam Indo-Eropa dengan ornamen Nusantara; puncak menaranya dihiasi enam tusuk sate yang menjadi ikon kota Bandung.",
    "status": "terverifikasi",
    "foto": "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=900&q=70&auto=format&fit=crop"
  },
  {
    "kode": "CB-32-002",
    "nama": "Villa Isola",
    "kategori": "cagar-budaya",
    "era": "1933 (Art Deco)",
    "lokasi": "Bandung",
    "lat": -6.860944,
    "lng": 107.587667,
    "arsitek": "C.P. Wolff Schoemaker",
    "deskripsi": "Mahakarya Art Deco tropis yang kini menjadi Bumi Siliwangi UPI. Garis-garis streamline melengkung mengikuti kontur bukit, sebuah dialog antara modernitas dan lanskap Bandung Utara.",
    "status": "terverifikasi",
    "foto": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&q=70&auto=format&fit=crop"
  },
  {
    "kode": "CB-32-003",
    "nama": "Keraton Kasepuhan Cirebon",
    "kategori": "cagar-budaya",
    "era": "1529 (Kesultanan)",
    "lokasi": "Cirebon",
    "lat": -6.721167,
    "lng": 108.571028,
    "arsitek": "Pangeran Cakrabuana",
    "deskripsi": "Keraton tertua di Cirebon, perpaduan langgam Sunda, Jawa, Islam, Tiongkok, dan Eropa. Menyimpan Kereta Singa Barong serta tembok bata merah khas pesisir utara.",
    "status": "terverifikasi",
    "foto": "https://images.unsplash.com/photo-1609921141835-710b7fa6e438?w=900&q=70&auto=format&fit=crop"
  },
  {
    "kode": "CB-32-004",
    "nama": "Candi Cangkuang",
    "kategori": "cagar-budaya",
    "era": "Abad ke-8 (Hindu)",
    "lokasi": "Leles, Garut",
    "lat": -7.094389,
    "lng": 107.918583,
    "arsitek": "Tidak diketahui",
    "deskripsi": "Satu-satunya candi Hindu utuh di Tatar Sunda, berdiri di tengah danau yang dikelilingi Kampung Pulo. Diapit oleh makam Embah Dalem Arief Muhammad sebagai simbol akulturasi.",
    "status": "terverifikasi",
    "foto": "https://images.unsplash.com/photo-1604999333679-b86d54738315?w=900&q=70&auto=format&fit=crop"
  },
  {
    "kode": "CA-32-051",
    "nama": "Situs Megalitikum Gunung Padang",
    "kategori": "cagar-alam",
    "era": "Prasejarah",
    "lokasi": "Cianjur",
    "lat": -6.994722,
    "lng": 107.055833,
    "arsitek": "Peradaban megalitik",
    "deskripsi": "Punden berundak terbesar di Asia Tenggara, tersusun dari ribuan balok batu kolom andesit. Lanskap budaya purba yang masih menyimpan misteri lapisan usianya.",
    "status": "terverifikasi",
    "foto": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&q=70&auto=format&fit=crop"
  },
  {
    "kode": "CA-32-052",
    "nama": "Kawah Tangkuban Parahu",
    "kategori": "cagar-alam",
    "era": "Lanskap vulkanik",
    "lokasi": "Lembang, Bandung Barat",
    "lat": -6.759722,
    "lng": 107.609722,
    "arsitek": "Proses geologis",
    "deskripsi": "Gunung api strato dengan kawah perahu terbalik yang melegenda lewat kisah Sangkuriang. Kawah Ratu memamerkan dinding belerang dan kepulan uap sulfatara.",
    "status": "terverifikasi",
    "foto": "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=900&q=70&auto=format&fit=crop"
  },
  {
    "kode": "CA-32-053",
    "nama": "Kawah Putih Ciwidey",
    "kategori": "cagar-alam",
    "era": "Lanskap vulkanik",
    "lokasi": "Ciwidey, Bandung",
    "lat": -7.166111,
    "lng": 107.402222,
    "arsitek": "Proses geologis",
    "deskripsi": "Danau kawah Gunung Patuha berwarna toska keputihan akibat kandungan belerang tinggi. Salah satu lanskap alam paling ikonik di selatan Bandung.",
    "status": "terverifikasi",
    "foto": "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=900&q=70&auto=format&fit=crop"
  },
  {
    "kode": "CA-32-054",
    "nama": "Kampung Adat Naga",
    "kategori": "cagar-alam",
    "era": "Tradisi Sunda",
    "lokasi": "Salawu, Tasikmalaya",
    "lat": -7.353944,
    "lng": 108.106694,
    "arsitek": "Masyarakat adat Sunda",
    "deskripsi": "Permukiman adat dengan rumah panggung beratap ijuk yang menjaga aturan leluhur. Lanskap budaya hidup yang memperlihatkan harmoni manusia Sunda dengan alam.",
    "status": "terverifikasi",
    "foto": "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=900&q=70&auto=format&fit=crop"
  }
];
  var SEED = window.__SEED__ || DEFAULT_SEED;
  var LS_KEY = "pusaka-sunda:v1";
  var API = "/api/sites";

  var state = {
    sites: [],
    filter: "semua",
    query: "",
    mode: "memori", // 'api' | 'local' | 'memori'
  };

  var map, markerLayer, markers = {};

  /* ===========================================================
     UTIL
     =========================================================== */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function genKode(kategori) {
    var prefix = kategori === "cagar-alam" ? "CA" : "CB";
    var n = state.sites.filter(function (s) { return s.kategori === kategori; }).length + 1;
    return prefix + "-32-" + String(900 + n); // rentang khusus usulan
  }
  var DEFAULT_IMG =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250">' +
      '<rect width="400" height="250" fill="#D6D1C1"/>' +
      '<text x="50%" y="50%" fill="#767C73" font-family="monospace" font-size="16" ' +
      'letter-spacing="2" text-anchor="middle" dominant-baseline="middle">FOTO BELUM TERSEDIA</text></svg>'
    );

  /* format koordinat gaya survei: 6.9025°S 107.6189°E */
  function fmtCoord(lat, lng) {
    var la = parseFloat(lat), ln = parseFloat(lng);
    if (isNaN(la) || isNaN(ln)) return "—";
    return Math.abs(la).toFixed(4) + "\u00B0" + (la < 0 ? "S" : "N") + "  " +
           Math.abs(ln).toFixed(4) + "\u00B0" + (ln < 0 ? "W" : "E");
  }

  /* ===========================================================
     LAPISAN DATA — load & persist dengan fallback bertingkat
     =========================================================== */
  function persistLocal() {
    if (state.mode === "local") {
      try { localStorage.setItem(LS_KEY, JSON.stringify(state.sites)); } catch (e) {}
    }
  }

  function loadData() {
    // 1) coba REST API
    return fetch(API)
      .then(function (r) { if (!r.ok) throw new Error("no api"); return r.json(); })
      .then(function (data) {
        state.sites = data;
        state.mode = "api";
      })
      .catch(function () {
        // 2) localStorage (jika tersedia & sudah ada isi)
        var hasLS = false;
        try { hasLS = typeof localStorage !== "undefined"; } catch (e) { hasLS = false; }
        if (hasLS) {
          state.mode = "local";
          var saved = null;
          try { saved = localStorage.getItem(LS_KEY); } catch (e) {}
          if (saved) { state.sites = JSON.parse(saved); return; }
        }
        // 3) data benih tertanam (selalu tersedia, tak bergantung path file)
        if (state.mode !== "local") state.mode = "memori";
        state.sites = JSON.parse(JSON.stringify(SEED));
      })
      .then(function () { if (state.mode === "local") persistLocal(); });
  }

  /* operasi CRUD — sinkron ke API bila mode 'api', selain itu lokal/memori */
  function createSite(site) {
    state.sites.push(site);
    if (state.mode === "api") {
      fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(site) }).catch(noop);
    }
    persistLocal();
  }
  function updateSite(kode, patch) {
    var s = state.sites.find(function (x) { return x.kode === kode; });
    if (!s) return;
    Object.assign(s, patch);
    if (state.mode === "api") {
      fetch(API + "/" + encodeURIComponent(kode), { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(s) }).catch(noop);
    }
    persistLocal();
  }
  function deleteSite(kode) {
    state.sites = state.sites.filter(function (x) { return x.kode !== kode; });
    if (state.mode === "api") {
      fetch(API + "/" + encodeURIComponent(kode), { method: "DELETE" }).catch(noop);
    }
    persistLocal();
  }
  function noop() {}

  /* ===========================================================
     RENDER — katalog, statistik
     =========================================================== */
  function filteredSites() {
    var q = state.query.trim().toLowerCase();
    return state.sites.filter(function (s) {
      if (state.filter !== "semua" && s.kategori !== state.filter) return false;
      if (!q) return true;
      return (s.nama + " " + s.lokasi + " " + s.era + " " + s.kode + " " + (s.arsitek || ""))
        .toLowerCase().indexOf(q) !== -1;
    });
  }

  function renderStats() {
    $("#statTotal").textContent = state.sites.length;
    $("#statBudaya").textContent = state.sites.filter(function (s) { return s.kategori === "cagar-budaya"; }).length;
    $("#statAlam").textContent = state.sites.filter(function (s) { return s.kategori === "cagar-alam"; }).length;
  }

  function catalogCard(s) {
    var isAlam = s.kategori === "cagar-alam";
    var badgeClass = isAlam ? "alam" : "budaya";
    var badgeText = isAlam ? "Cagar Alam" : "Cagar Budaya";
    var st = s.status === "usulan"
      ? '<span class="st usulan">Usulan</span>'
      : '<span class="st ok">Terverifikasi</span>';
    return (
      '<article class="card" data-kode="' + esc(s.kode) + '">' +
        '<div class="card-head"><span class="kode">' + esc(s.kode) + '</span>' +
          '<span class="tag ' + badgeClass + '">' + badgeText + '</span></div>' +
        '<div class="card-plate">' + st +
          '<div class="frame-sm"><img loading="lazy" src="' + esc(s.foto || DEFAULT_IMG) + '" ' +
          'alt="' + esc(s.nama) + '" onerror="this.src=\'' + DEFAULT_IMG + '\'"></div></div>' +
        '<div class="card-body">' +
          '<h3>' + esc(s.nama) + '</h3>' +
          '<p class="card-coord">' + esc(s.era) + '<span class="sep">·</span>' + esc(s.lokasi) +
            '<br>' + fmtCoord(s.lat, s.lng) + '</p>' +
          '<p class="card-desc">' + esc(s.deskripsi) + '</p>' +
        '</div>' +
        '<div class="card-foot">' +
          '<button class="act go" data-act="map">Peta</button>' +
          '<button class="act" data-act="view">Detail</button>' +
          '<button class="act" data-act="edit">Ubah</button>' +
          '<button class="act danger" data-act="delete">Hapus</button>' +
        '</div>' +
      '</article>'
    );
  }

  function renderCatalog() {
    var list = filteredSites();
    var el = $("#catalog");
    if (!list.length) {
      el.innerHTML =
        '<div class="empty"><b>Tidak ada situs yang cocok</b>' +
        'Coba ubah kata kunci atau saringan kategori, atau ajukan situs baru di bawah.</div>';
      return;
    }
    el.innerHTML = list.map(catalogCard).join("");
  }

  function renderAll() {
    renderStats();
    renderCatalog();
    renderMarkers();
  }

  /* ===========================================================
     PETA — Leaflet
     =========================================================== */
  function colorFor(s) {
    if (s.status === "usulan") return "#213A52";
    return s.kategori === "cagar-alam" ? "#4C5E3A" : "#93662B";
  }
  function makeIcon(s) {
    var c = colorFor(s);
    return L.divIcon({
      className: "pin",
      html: '<div style="width:18px;height:18px;border-radius:50% 50% 50% 0;background:' + c +
            ';transform:rotate(-45deg);border:2px solid #E9E6DB;box-shadow:0 2px 6px rgba(0,0,0,.4)"></div>',
      iconSize: [18, 18],
      iconAnchor: [9, 18],
      popupAnchor: [0, -16],
    });
  }
  function initMap() {
    map = L.map("map", { scrollWheelZoom: false }).setView([-6.95, 107.65], 9);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
      maxZoom: 18,
    }).addTo(map);
    markerLayer = L.layerGroup().addTo(map);
  }
  function renderMarkers() {
    if (!map) return;
    markerLayer.clearLayers();
    markers = {};
    var pts = [];
    state.sites.forEach(function (s) {
      var lat = parseFloat(s.lat), lng = parseFloat(s.lng);
      if (isNaN(lat) || isNaN(lng)) return;
      var m = L.marker([lat, lng], { icon: makeIcon(s) }).addTo(markerLayer);
      m.bindPopup(
        '<div class="pop"><small>' + esc(s.kode) + '</small>' +
        '<b>' + esc(s.nama) + '</b>' +
        '<p>' + esc(s.era) + " · " + esc(s.lokasi) + '</p></div>'
      );
      markers[s.kode] = m;
      pts.push([lat, lng]);
    });
    if (pts.length) {
      try { map.fitBounds(pts, { padding: [40, 40], maxZoom: 11 }); } catch (e) {}
    }
  }
  function focusOnMap(kode) {
    var s = state.sites.find(function (x) { return x.kode === kode; });
    if (!s || !markers[kode]) return;
    document.getElementById("peta").scrollIntoView({ behavior: "smooth" });
    setTimeout(function () {
      map.setView([parseFloat(s.lat), parseFloat(s.lng)], 13, { animate: true });
      markers[kode].openPopup();
    }, 450);
  }

  /* ===========================================================
     MODAL detail
     =========================================================== */
  function openModal(kode) {
    var s = state.sites.find(function (x) { return x.kode === kode; });
    if (!s) return;
    $("#modalImg").src = s.foto || DEFAULT_IMG;
    $("#modalImg").alt = s.nama;
    $("#modalKode").textContent = s.kode + " · " + (s.kategori === "cagar-alam" ? "Cagar Alam" : "Cagar Budaya");
    $("#modalName").textContent = s.nama;
    $("#modalMeta").textContent = s.era + "  ·  " + s.lokasi + (s.arsitek ? "  ·  " + s.arsitek : "") +
      "  ·  " + fmtCoord(s.lat, s.lng);
    $("#modalDesc").textContent = s.deskripsi;
    $("#modal").classList.add("open");
  }
  function closeModal() { $("#modal").classList.remove("open"); }

  /* ===========================================================
     TOAST
     =========================================================== */
  function toast(msg, type) {
    var t = document.createElement("div");
    t.className = "toast " + (type || "ok");
    t.textContent = msg;
    $("#toasts").appendChild(t);
    setTimeout(function () {
      t.style.transition = "opacity .3s, transform .3s";
      t.style.opacity = "0";
      t.style.transform = "translateX(20px)";
      setTimeout(function () { t.remove(); }, 320);
    }, 3000);
  }

  /* ===========================================================
     FORM — validasi + create/update
     =========================================================== */
  var rules = {
    nama: function (v) { return v.trim().length >= 3 || "Nama minimal 3 karakter."; },
    kategori: function (v) { return v !== "" || "Pilih kategori situs."; },
    era: function (v) { return v.trim().length >= 2 || "Isi era atau tahun situs."; },
    lokasi: function (v) { return v.trim().length >= 2 || "Isi kota / kabupaten."; },
    lat: function (v) {
      var n = parseFloat(v);
      if (isNaN(n)) return "Lintang harus berupa angka.";
      return (n >= -11 && n <= 6) || "Lintang Indonesia kira-kira -11 s/d 6.";
    },
    lng: function (v) {
      var n = parseFloat(v);
      if (isNaN(n)) return "Bujur harus berupa angka.";
      return (n >= 95 && n <= 141) || "Bujur Indonesia kira-kira 95 s/d 141.";
    },
    deskripsi: function (v) { return v.trim().length >= 20 || "Deskripsi minimal 20 karakter."; },
    foto: function (v) {
      if (!v.trim()) return true;
      return /^https?:\/\/.+/i.test(v.trim()) || "URL foto harus diawali http(s)://";
    },
  };

  function setFieldError(name, message) {
    var input = document.getElementById(name);
    var field = input.closest(".field");
    var err = field.querySelector('.err[data-for="' + name + '"]');
    if (message === true) {
      field.classList.remove("invalid");
      if (err) err.textContent = "";
      return true;
    }
    field.classList.add("invalid");
    if (err) err.textContent = message;
    return false;
  }

  function validateField(name) {
    if (!rules[name]) return true;
    var input = document.getElementById(name);
    return setFieldError(name, rules[name](input.value));
  }

  function validateForm() {
    var ok = true;
    Object.keys(rules).forEach(function (name) {
      if (!validateField(name)) ok = false;
    });
    return ok;
  }

  function fillForm(s) {
    $("#editKode").value = s.kode;
    $("#nama").value = s.nama;
    $("#kategori").value = s.kategori;
    $("#era").value = s.era;
    $("#lokasi").value = s.lokasi;
    $("#arsitek").value = s.arsitek || "";
    $("#lat").value = s.lat;
    $("#lng").value = s.lng;
    $("#foto").value = s.foto || "";
    $("#deskripsi").value = s.deskripsi;
    $("#formTitle").textContent = "Ubah Situs · " + s.kode;
    $("#submitBtn").textContent = "Simpan Perubahan";
  }

  function resetFormMode() {
    $("#editKode").value = "";
    $("#formTitle").textContent = "Formulir Usulan Situs";
    $("#submitBtn").textContent = "Kirim Usulan";
    $all(".field").forEach(function (f) { f.classList.remove("invalid"); });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) {
      toast("Periksa kembali isian yang ditandai merah.", "warn");
      var firstBad = $(".field.invalid input, .field.invalid select, .field.invalid textarea");
      if (firstBad) firstBad.focus();
      return;
    }
    var editing = $("#editKode").value;
    var payload = {
      nama: $("#nama").value.trim(),
      kategori: $("#kategori").value,
      era: $("#era").value.trim(),
      lokasi: $("#lokasi").value.trim(),
      arsitek: $("#arsitek").value.trim(),
      lat: parseFloat($("#lat").value),
      lng: parseFloat($("#lng").value),
      foto: $("#foto").value.trim(),
      deskripsi: $("#deskripsi").value.trim(),
    };

    if (editing) {
      updateSite(editing, payload);
      toast("Perubahan pada " + editing + " tersimpan.", "ok");
    } else {
      payload.kode = genKode(payload.kategori);
      payload.status = "usulan";
      createSite(payload);
      toast("Usulan tercatat sebagai " + payload.kode + " (menunggu verifikasi).", "ok");
    }

    e.target.reset();
    resetFormMode();
    renderAll();
    document.getElementById("katalog").scrollIntoView({ behavior: "smooth" });
  }

  /* ===========================================================
     EVENTS
     =========================================================== */
  function bindEvents() {
    // delegasi tombol kartu
    $("#catalog").addEventListener("click", function (e) {
      var btn = e.target.closest("[data-act]");
      if (!btn) return;
      var card = e.target.closest(".card");
      var kode = card.getAttribute("data-kode");
      var act = btn.getAttribute("data-act");
      if (act === "map") focusOnMap(kode);
      else if (act === "view") openModal(kode);
      else if (act === "edit") {
        var s = state.sites.find(function (x) { return x.kode === kode; });
        fillForm(s);
        document.getElementById("ajukan").scrollIntoView({ behavior: "smooth" });
      } else if (act === "delete") {
        if (confirm("Hapus situs " + kode + " dari registry?")) {
          deleteSite(kode);
          renderAll();
          toast(kode + " dihapus dari registry.", "warn");
        }
      }
    });

    // pencarian
    var searchTimer;
    $("#searchInput").addEventListener("input", function (e) {
      clearTimeout(searchTimer);
      var val = e.target.value;
      searchTimer = setTimeout(function () { state.query = val; renderCatalog(); }, 120);
    });

    // filter chips
    $("#filterChips").addEventListener("click", function (e) {
      var chip = e.target.closest(".chip");
      if (!chip) return;
      $all(".chip").forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
      chip.setAttribute("aria-pressed", "true");
      state.filter = chip.getAttribute("data-filter");
      renderCatalog();
    });

    // form
    $("#siteForm").addEventListener("submit", handleSubmit);
    $("#resetBtn").addEventListener("click", resetFormMode);
    Object.keys(rules).forEach(function (name) {
      var input = document.getElementById(name);
      input.addEventListener("blur", function () { validateField(name); });
      input.addEventListener("input", function () {
        if (input.closest(".field").classList.contains("invalid")) validateField(name);
      });
    });

    // modal
    $("#modalClose").addEventListener("click", closeModal);
    $("#modal").addEventListener("click", function (e) { if (e.target === this) closeModal(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });

    // nav mobile
    $("#navToggle").addEventListener("click", function () {
      var open = $("#navLinks").classList.toggle("open");
      this.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $all("#navLinks a").forEach(function (a) {
      a.addEventListener("click", function () { $("#navLinks").classList.remove("open"); });
    });
  }

  /* reveal on load */
  function revealOnLoad() {
    setTimeout(function () { $all(".reveal").forEach(function (el, i) {
      setTimeout(function () { el.classList.add("in"); }, i * 120);
    }); }, 80);
  }

  /* ===========================================================
     INIT
     =========================================================== */
  document.addEventListener("DOMContentLoaded", function () {
    try { initMap(); } catch (e) { console.warn("Peta tidak dapat dimuat:", e.message); map = null; }
    bindEvents();
    revealOnLoad();
    loadData().then(function () {
      renderAll();
      if (state.mode !== "api") {
        // catatan halus saat berjalan tanpa backend (sandbox/statis)
        console.info("[Pusaka Sunda] Mode data: " + state.mode +
          " — backend API tidak terdeteksi, menggunakan penyimpanan " +
          (state.mode === "local" ? "localStorage (persisten di peramban)." : "memori (sementara)."));
      }
    });
  });
})();

# ⚽ Gamified Soccer App
![CI Status](https://github.com/b46usf/Gamified_Soccer_App/actions/workflows/ci.yml/badge.svg)
[![Vercel Status](https://img.shields.io/github/deployments/b46usf/Gamified_Soccer_App/production?label=vercel&logo=vercel)](https://gamified-soccer-app.vercel.app/)
[![Coverage Status](https://img.shields.io/codecov/c/github/b46usf/Gamified_Soccer_App?logo=codecov)](https://app.codecov.io/gh/b46usf/Gamified_Soccer_App)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18-green?logo=node.js)](https://nodejs.org/)
[![Last Commit](https://img.shields.io/github/last-commit/b46usf/Gamified_Soccer_App)](https://github.com/b46usf/Gamified_Soccer_App/commits/main)
[![Issues](https://img.shields.io/github/issues/b46usf/Gamified_Soccer_App)](https://github.com/b46usf/Gamified_Soccer_App/issues)
[![Stars](https://img.shields.io/github/stars/b46usf/Gamified_Soccer_App)](https://github.com/b46usf/Gamified_Soccer_App/stargazers)

---

**Gamified Soccer App** adalah aplikasi permainan bertema sepak bola yang memadukan elemen gamifikasi untuk memberikan pengalaman interaktif dan menyenangkan bagi pemain.  
Aplikasi ini dirancang untuk dimainkan secara daring dengan alur permainan yang jelas dan halaman-halaman fitur yang terstruktur.

---

## 📋 Panduan Bermain

Sebelum bermain, pastikan membaca [**Guidelines.md**](guidelines/Guidelines.md)  
File tersebut berisi panduan lengkap cara bermain di setiap halaman, termasuk flowchart alur permainan.

---

## 📜 Attributions

Kami menggunakan beberapa komponen dan aset pihak ketiga, detailnya dapat dilihat di [**Attributions.md**](Attributions.md).

---

## ​ Demo
Coba versi live di: **[gamified-soccer-app.vercel.app](https://gamified-soccer-app.vercel.app/)**

---

## 📦 Fitur yang Ditambahkan dalam Setup Ini

- **package.json** (scripts: `dev`, `build`, `preview`)
- **vite.config.ts**
- **tsconfig.json**
- **index.html**
- **src/main.tsx**
- **src/App.tsx** *(placeholder)*
- **src/styles/globals.css**
- **tailwind.config.cjs**
- **postcss.config.cjs**
- **vercel.json**
- **README.md** *(update dengan panduan lengkap)*

---

## 🚀 Instalasi & Menjalankan Secara Lokal

Pastikan Anda sudah menginstal **Node.js** (versi 18 atau lebih baru) dan **npm**.

## 🛠 Cara Instalasi & Menjalankan Secara Lokal

```bash
# 1. Install dependencies
npm install

# 2. Jalankan server development
npm run dev

# 3. Build untuk production
npm run build

# 4. Preview hasil build
npm run preview
```
---

## 🌐 Deploy ke Vercel

1. Push proyek ini ke GitHub.
2. Buka Vercel dan buat proyek baru.
3. Pastikan pengaturan build:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Tambahkan environment variables jika diperlukan.
5. Klik Deploy dan tunggu hingga proses selesai.

---

## 📂 Struktur Direktori

<pre>
Gamified_Soccer_App/
│
├── public/                 # Asset publik
├── src/                    # Kode sumber aplikasi
│   ├── components/         # Komponen UI
│   ├── pages/              # Halaman utama
│   ├── styles/             # File CSS / Tailwind
│   ├── App.tsx             # Root component
│   └── main.tsx            # Entry point React
│
├── guidelines/Guidelines.md
├── Attributions.md
├── package.json
├── vite.config.ts
└── tailwind.config.cjs
</pre>

---

## 🤝 Kontribusi
Kami terbuka untuk kontribusi dari siapa pun.
Silakan fork repositori ini, buat branch baru, lakukan perubahan, lalu kirim pull request.

---


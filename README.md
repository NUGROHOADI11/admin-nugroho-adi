# Admin CMS - Nugroho Adi Portfolio

Frontend **Admin Content Management System (CMS)** berbasis **Next.js 16 (App Router)**, **React 19**, **TypeScript**, dan **Tailwind CSS v4** yang dirancang khusus untuk mempermudah mengelola, menambah, mengedit, dan menghapus seluruh konten website portofolio [nugroho-adi](../nugroho-adi) melalui backend [be-nugroho-adi](../be-nugroho-adi).

---

## 🌟 Fitur Utama

- **Dashboard Overview (`/`)**: Ringkasan metrik statistik real-time (jumlah proyek, milestone timeline, pencapaian, skill, dan pesan masuk yang belum dibaca) serta jalan pintas cepat (*quick actions*).
- **Projects Manager (`/projects`)**: CRUD lengkap studi kasus proyek dengan filter tab (`Web`, `Mobile`, `Cloud`), pencarian instan, dan editor dwibahasa (Inggris & Indonesia).
- **Timeline & Experience Manager (`/experiences`)**: CRUD riwayat pengalaman dengan konfigurasi visual grid 24-kolom (`startColumn`, `span`, `row`, `variant`) serta editor dinamis poin modal popup (*bullet points*).
- **Achievements & Awards (`/achievements`)**: CRUD sertifikasi dan penghargaan kompetisi dengan pilihan preset warna highlight dan ikon.
- **Skills & Toolkit Manager (`/skills`)**: Pengelolaan daftar keahlian teknis berdasarkan kategori (Mobile, Web, Cloud, Language, AI, DevOps, Database, Design).
- **Inbound Inquiries Inbox (`/messages`)**: Kotak masuk pesan dari form kontak portofolio dengan drawer pembaca pesan, penanda status (`UNREAD`, `READ`, `REPLIED`, `ARCHIVED`), dan kolom catatan tindak lanjut internal (*internal reply notes*).
- **Profile & Bio Settings (`/profile`)**: Kustomisasi bio, status ketersediaan kerja, teks heading hero, peran kepemimpinan, badges gaya hidup, kutipan filosofi (*quote*), dan akun media sosial.
- **Dukungan Dwibahasa (Bilingual EN & ID)**: Setiap modal input menyediakan tab switcher instan antara konten Bahasa Inggris dan Bahasa Indonesia.
- **Otentikasi & Keamanan JWT**: Dilengkapi halaman login modern dengan tombol *auto-fill demo credentials*, pengecekan sesi aktif via token Bearer, dan proteksi rute otomatis.

---

## 🚀 Panduan Memulai (Quick Start)

### 1. Prasyarat
Pastikan Backend API [be-nugroho-adi](../be-nugroho-adi) sudah berjalan pada port `5000`:
```bash
cd /home/dee/Documents/web/be-nugroho-adi
npm run start:dev
```

### 2. Konfigurasi Environment (`.env.local`)
File `.env.local` sudah disiapkan mengarah ke backend:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Menjalankan Server Admin CMS
Masuk ke direktori `admin-nugroho-adi`:
```bash
cd /home/dee/Documents/web/admin-nugroho-adi
npm run dev
```

Buka browser di: **`http://localhost:3001`**

---

## 🔐 Kredensial Login Admin Default

- **Email**: `admin@nugrohoadi.com`
- **Password**: `adminpassword123`

*(Tersedia tombol satu-klik **"Fill Default Admin Credentials"** di halaman login untuk mempermudah akses cepat)*

---

## 🌐 Ekosistem 3 Project

| Project | Direktori | Port Default | Fungsi |
| :--- | :--- | :--- | :--- |
| **Portfolio FE** | `/home/dee/Documents/web/nugroho-adi` | `:3000` | Website portofolio publik untuk pengunjung |
| **Backend API** | `/home/dee/Documents/web/be-nugroho-adi` | `:5000` | REST API (NestJS + Prisma + Neon PostgreSQL + Swagger) |
| **Admin CMS** | `/home/dee/Documents/web/admin-nugroho-adi` | `:3001` | Panel admin untuk CRUD seluruh konten portofolio |

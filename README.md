# Gatherly — Praktikum Pengembangan UI Lanjut (Vue 3 + Vite)

**Gatherly** adalah aplikasi web katalog, pendaftaran peserta, dan manajemen acara (*event management*) berbasis **Vue 3 (Composition API)**, **Vue Router**, dan **Vite** yang dikembangkan secara bertahap dari **Modul 1 hingga Modul 6** pada mata kuliah **Pengembangan UI Lanjut**.

---

## 📋 Daftar Isi
1. [Prasyarat Sistem](#1-prasyarat-sistem)
2. [Cara Menjalankan Proyek (Quick Start)](#2-cara-menjalankan-proyek-quick-start)
3. [Daftar Branch per Modul & Cara Berpindah Branch](#3-daftar-branch-per-modul--cara-berpindah-branch)
4. [Konfigurasi REST API / MockAPI (Khusus Modul 6)](#4-konfigurasi-rest-api--mockapi-khusus-modul-6)
5. [Panduan Pengujian Fitur di Aplikasi](#5-panduan-pengujian-fitur-di-aplikasi)
6. [Struktur Direktori Proyek](#6-struktur-direktori-proyek)
7. [Daftar Perintah NPM](#7-daftar-perintah-npm)

---

## 1. Prasyarat Sistem
Pastikan perangkat Anda sudah terpasang:
- **Node.js** (Disarankan versi LTS `>= 20.x` atau `>= 22.x`)
- **NPM** (Bawaan saat menginstal Node.js)
- **Git**

Cek versi di terminal dengan:
```bash
node -v
npm -v
```

---

## 2. Cara Menjalankan Proyek (Quick Start)

### Langkah 1: Clone Repository & Masuk ke Folder Proyek
Jika baru pertama kali mengunduh dari GitHub:
```bash
git clone https://github.com/HansMain/FARHAN_102042300164_UILANJUT.git
cd FARHAN_102042300164_UILANJUT
```
Jika membuka langsung dari folder lokal di laptop:
```powershell
cd "c:\SEM 7 UI\SEM 7 UI\belajar_vue"
```

### Langkah 2: Pilih Branch Modul yang Ingin Dijalankan
Secara *default*, gunakan branch **`Modul-6`** untuk menjalankan versi paling lengkap:
```bash
git checkout Modul-6
```

### Langkah 3: Instal Seluruh Dependency
Jalankan perintah berikut satu kali untuk mengunduh seluruh paket di `node_modules`:
```bash
npm install
```

### Langkah 4: Konfigurasi File `.env` (Khusus Modul 6)
Pastikan terdapat file `.env` di *root* folder proyek (`belajar_vue/.env`) yang berisi URL endpoint MockAPI Anda:
```env
# Konfigurasi Base URL endpoint REST API
VITE_API_URL=https://6xxxxxxxxxxxxxxxxxxxxxxx.mockapi.io/api/v1
```
*(Lihat bagian [4. Konfigurasi REST API / MockAPI](#4-konfigurasi-rest-api--mockapi-khusus-modul-6) di bawah untuk cara membuat URL MockAPI).*

### Langkah 5: Jalankan Server Development
```bash
npm run dev
```
Setelah server menyala, buka browser dan akses alamat lokal yang muncul di terminal (biasanya **`http://localhost:5173`**).

---

## 3. Daftar Branch per Modul & Cara Berpindah Branch

Setiap modul praktikum disimpan pada *branch* terpisah. Gunakan perintah `git checkout <nama-branch>` untuk melihat dan menjalankan kode pada modul tertentu:

| Nama Branch | Materi Praktikum | Perintah Pindah Branch |
| :--- | :--- | :--- |
| **`main`** | **Modul 1:** Struktur Aplikasi dan Navigasi dalam Vue.js (Multi-Layout & Nested Routing) | `git checkout main` |
| **`Modul-2`** | **Modul 2:** Visual Hierarchy & Layout System (8pt Spatial System, Grid 12 Kolom, F-Pattern) | `git checkout Modul-2` |
| **`Modul-3`** | **Modul 3:** Implementasi UI Berbasis Component (Props, Emits, Slots, Reusable UI) | `git checkout Modul-3` |
| **`Modul-4`** | **Modul 4:** Manajemen State dan Interaksi Pengguna (`ref`, `computed`, `watch`, `useEvents`) | `git checkout Modul-4` |
| **`Modul-5`** | **Modul 5:** User Flow & Interaction Flow (Validasi Form Pendaftaran, Kuota, Tiket Digital) | `git checkout Modul-5` |
| **`Modul-6`** | **Modul 6:** Integrasi UI dengan Layanan Sistem (REST API Asinkron, MockAPI, 4 UI States) | `git checkout Modul-6` |

---

## 4. Konfigurasi REST API / MockAPI (Khusus Modul 6)

Pada **Modul 6**, aplikasi menggunakan layanan **MockAPI** sebagai *server cloud* penyimpanan data acara:

1. Buka [https://mockapi.io/](https://mockapi.io/) dan *login* menggunakan akun GitHub atau Google.
2. Klik **New Project** (`+`), isi:
   - **Name:** `gatherly-api`
   - **API Prefix:** `/api/v1`
   - Klik **Create**.
3. Masuk ke project `gatherly-api`, klik **New Resource**, lalu beri **Resource name:** `events`.
4. Buat skema kolom (*Schema*) berikut:
   - `id` (`Object ID` - bawaan)
   - `title` (`String`)
   - `cat` (`String`)
   - `date` (`Date` / `String`)
   - `loc` (`String`)
   - `quota` (`Number`)
   - `desc` (`String`)
   - `done` (`Boolean`)
5. Klik tombol **Create**, lalu klik tombol **Data** pada resource `events` dan tempelkan JSON 5 acara awal berikut, kemudian klik **Update**:
   ```json
   [
     {
       "id": "1",
       "title": "Vue 3 Composition API Deep Dive",
       "cat": "Workshop",
       "date": "Nov 15, 2026 • 09:00 AM",
       "loc": "Telkom University, Gedung Tokong Nanas Lt. 3",
       "quota": 45,
       "desc": "Hands-on workshop building enterprise applications using Vue 3, Composition API, and modern state management patterns.",
       "done": false
     },
     {
       "id": "2",
       "title": "Bandung Tech Meetup The Future of AI in Web Development",
       "cat": "Meetup",
       "date": "Nov 20, 2026 • 01:30 PM",
       "loc": "Bandung Digital Valley, Jl. Gegerkalong Hilir",
       "quota": 80,
       "desc": "Casual networking and tech talk about incorporating generative AI agents directly into frontend workflows.",
       "done": false
     },
     {
       "id": "3",
       "title": "National UI/UX Design Hackathon 2026",
       "cat": "Competition",
       "date": "Nov 28, 2026 • 08:00 AM",
       "loc": "Auditorium Damar Telkom University",
       "quota": 120,
       "desc": "Compete with top student designers across Indonesia to design inclusive accessibility-first digital products in 24 hours.",
       "done": false
     },
     {
       "id": "4",
       "title": "Modern Frontend Architecture & Micro-Frontends",
       "cat": "Seminar",
       "date": "Dec 05, 2026 • 10:00 AM",
       "loc": "Online via Zoom Webinar",
       "quota": 250,
       "desc": "Learn how tech companies scale large frontend codebases cleanly using modular component architecture and micro-services.",
       "done": false
     },
     {
       "id": "5",
       "title": "Cloud Native & DevOps Summit 2026",
       "cat": "Conference",
       "date": "Dec 12, 2026 • 08:30 AM",
       "loc": "Grand Ballroom Pullman Hotel Bandung",
       "quota": 15,
       "desc": "Annual gathering of system architects, DevOps engineers, and cloud infrastructure specialists sharing enterprise war stories.",
       "done": false
     }
   ]
   ```
6. Salin URL API Endpoint dari MockAPI Anda (contoh: `https://67xxxx.mockapi.io/api/v1`) dan masukkan ke file `.env`:
   ```env
   VITE_API_URL=https://67xxxx.mockapi.io/api/v1
   ```
7. *Restart* terminal `npm run dev` agar perubahan `.env` terbaca oleh Vite.

---

## 5. Panduan Pengujian Fitur di Aplikasi

Setelah `npm run dev` berjalan dan Anda membuka `http://localhost:5173`:

1. **Katalog Acara & 4 Kondisi UI (`/browse/events`)**
   - Melihat animasi *Skeleton Shimmer* saat *loading* data dari API.
   - Mencari acara melalui **SearchBar** dan memfilter kategori melalui **CategoryFilter**.
   - Menguji tombol **🔄 Muat Ulang** untuk memanggil ulang `GET /events`.
   - Menguji kondisi *Network Error* (bisa disimulasikan melalui *Browser DevTools -> Network -> Offline*).
2. **Detail Acara & Pendaftaran Peserta (`/browse/events/:id`)**
   - Klik **View Event Details** pada salah satu acara.
   - Klik **Register Now** untuk mengisi formulir pendaftaran peserta (`/browse/events/:id/register`) yang dilengkapi validasi *real-time* per kolom.
   - Setelah berhasil mendaftar, Anda akan diarahkan ke halaman **Tiket Digital (`TicketReceipt`)** lengkap dengan kode *booking* unik (`GTH-xxxx`).
3. **Daftar Tiket Saya (`/browse/your-events`)**
   - Melihat seluruh acara yang sudah Anda daftari, membuka kembali tiket digital, atau membatalkan pendaftaran (*Cancel Registration*).
4. **Dasbor Panitia / Organizer (`/dashboard` & `/dashboard/events`)**
   - Melihat ringkasan statistik jumlah acara aktif, selesai, dan total pendaftar.
   - Masuk ke menu **Event Management** (`/dashboard/events`) untuk:
     - **Create Event (`POST /events`):** Membuat acara baru dengan validasi formulir dan indikator *spinner loading* pada tombol submit.
     - **Complete Event (`PUT /events/:id`):** Menandai acara selesai dan memindahkannya ke tab *Completed Events*.
     - **Delete Event (`DELETE /events/:id`):** Menghapus acara dari server melalui *modal* konfirmasi beserta pembersihan tiket terkait (*cascading delete*).

---

## 6. Struktur Direktori Proyek

```text
belajar_vue/
├── .env                                 # Konfigurasi URL endpoint REST API (MockAPI)
├── package.json                         # Daftar dependency dan script npm
└── src/
    ├── main.js                          # Entry point aplikasi Vue & registrasi router
    ├── App.vue                          # Root component
    ├── assets/
    │   └── main.css                     # Design system global, variabel CSS, animasi shimmer & error state
    ├── router/
    │   └── index.js                     # Konfigurasi rute publik (AppLayout) & panitia (DashboardLayout)
    ├── composables/
    │   └── useEvents.js                 # Service layer terpusat (REST API fetch, state reaktif, localStorage)
    ├── layouts/
    │   ├── App.vue                      # Layout halaman publik (Navbar + Breadcrumb + Footer)
    │   └── DashboardLayout.vue          # Layout halaman Organizer Dashboard (Sidebar + Main Content)
    ├── components/
    │   ├── app/
    │   │   ├── Navbar.vue               # Navigasi utama aplikasi
    │   │   └── Breadcrumb.vue           # Penunjuk hierarki halaman
    │   ├── ui/
    │   │   ├── AppButton.vue            # Komponen tombol reusable dengan dukungan loading spinner
    │   │   ├── AppCard.vue              # Komponen pembungkus kartu reusable
    │   │   └── AppModal.vue             # Komponen dialog konfirmasi melayang
    │   └── event/
    │       ├── EventCard.vue            # Kartu acara pada halaman katalog publik
    │       ├── OrganizerEventCard.vue   # Kartu acara pada halaman manajemen panitia
    │       ├── EventCreateForm.vue      # Formulir pembuatan acara baru + validasi kolom
    │       ├── SearchBar.vue            # Input pencarian acara
    │       ├── CategoryFilter.vue       # Filter kategori acara (pills)
    │       ├── RegistrationForm.vue     # Formulir pendaftaran peserta
    │       ├── RegistrationSummary.vue  # Ringkasan acara di samping form pendaftaran
    │       └── RegistrationReceipt.vue  # Komponen tampilan bukti tiket digital
    └── views/
        ├── Home.vue                     # Halaman beranda (Landing Page)
        ├── About.vue                    # Halaman informasi aplikasi
        ├── Contact.vue                  # Halaman kontak
        ├── Browse.vue                   # Induk rute halaman eksplorasi acara
        ├── EventList.vue                # Katalog acara (Loading, Error, Empty, & Data State)
        ├── Category.vue                 # Halaman eksplorasi berdasarkan kategori
        ├── EventDetail.vue              # Halaman rincian acara + penanganan status 404
        ├── EventRegistration.vue        # Halaman proses pendaftaran peserta
        ├── TicketReceipt.vue            # Halaman tiket pendaftaran peserta
        ├── YourEvents.vue               # Halaman daftar acara yang diikuti pengguna
        ├── Dashboard.vue                # Halaman ringkasan statistik panitia
        └── EventManagement.vue          # Halaman kelola acara panitia (Active, Create, Completed)
```

---

## 7. Daftar Perintah NPM

| Perintah | Fungsi |
| :--- | :--- |
| `npm install` | Menginstal seluruh *package dependencies* proyek |
| `npm run dev` | Menjalankan server *development* lokal dengan fitur *Hot-Reload* |
| `npm run build` | Mengompilasi dan meminifikasi proyek untuk *production* ke folder `dist/` |
| `npm run preview` | Menjalankan pratinjau hasil *build production* secara lokal |
| `npm run format` | Merapikan format kode di dalam folder `src/` menggunakan Prettier |

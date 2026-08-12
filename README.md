# Panduan Instalasi

Requirements:
- Node.js (versi 20 atau 24+)
- Docker Desktop (opsional)

---

## Opsi 1: Menjalankan Secara Lokal (Node.js)

1. Clone repositori dan masuk ke direktori project:
   ```bash
   git clone https://github.com/aftyne/bts-test.git
   cd bts-test
   ```

2. Install dependency:
   ```bash
   npm i
   ```

3. Jalankan development server:
   ```bash
   npm run dev
   ```

Akses melalui browser di `http://localhost:5173`.

---

## Opsi 2: Menggunakan Docker

1. Pastikan Docker Desktop berjalan.
2. Jalankan perintah berikut pada direktori project:
```bash
docker compose up
```

Akses melalui browser di `http://localhost:5173`.

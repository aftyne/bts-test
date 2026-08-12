```markdown
# Panduan Instalasi

Requirements:
- Node.js (versi 20 atau 24+)
- Docker Desktop (opsional)

---

## Opsi 1: Menjalankan Secara Lokal (Node.js)

1. Clone repositori dan masuk ke direktori proyek:
   ```bash
   git clone <URL_REPOSITORY>
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

1. Pastikan Docker Desktop sedang berjalan.
2. Jalankan perintah berikut pada direktori utama proyek:
```bash
docker compose up

```



Aplikasi dapat diakses melalui browser di `http://localhost:5173`.

```

```
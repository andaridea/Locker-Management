# Locker-Management

## Cara Install

```bash
npm install
```

---

## Cara Menjalankan Aplikasi

```bash
npm start
```

## Struktur Proyek

```
src/
  index.ts              - Entry point
  models/
    User.ts             - Tipe data User
    Locker.ts           - Tipe data Locker
  storage/
    Store.ts            - Penyimpanan data in-memory
  services/
    LockerService.ts    - Logika bisnis loker
    SessionService.ts   - Logika login/logout
  commands/
    CommandHandler.ts   - Routing perintah
```
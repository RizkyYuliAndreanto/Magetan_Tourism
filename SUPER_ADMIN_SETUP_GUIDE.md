# Super Admin Setup Guide

## 🚀 Instalasi & Setup

### 1. Jalankan Migration (Menambah kolom is_blocked)

```bash
cd Backend
npx sequelize-cli db:migrate
```

### 2. Jalankan Seeder (Membuat Super Admin pertama)

```bash
npx sequelize-cli db:seed --seed create-super-admin.js
```

### 3. Login Credentials Super Admin

```
Username/Email: superadmin atau superadmin@magetan.go.id
Password: superadmin123
```

⚠️ **PENTING**: Ganti password setelah login pertama!

## 📊 Fitur Super Admin

### ✅ Manajemen User

- ✅ Lihat daftar semua users/admins dengan pagination
- ✅ Cari user berdasarkan username/email/nama
- ✅ Filter berdasarkan level akses
- ✅ Lihat statistik users

### ✅ CRUD Operations

- ✅ Membuat admin/superadmin baru
- ✅ Update profil user (nama, email, username, level akses)
- ✅ Reset password user
- ✅ Blokir/Unblokir akun user
- ✅ Hapus akun user/admin

### ✅ Security Features

- ✅ Tidak bisa mengubah level akses sendiri
- ✅ Tidak bisa blokir/hapus akun sendiri
- ✅ Akun yang diblokir tidak bisa login
- ✅ Semua aktivitas tercatat dalam activity log
- ✅ Validasi input yang ketat

## 🛡️ Endpoint Security

Semua endpoint super admin memerlukan:

1. **Authentication**: Bearer Token dalam header
2. **Authorization**: Level akses `superadmin`
3. **Validation**: Input validation dengan express-validator

## 📖 API Endpoints

### Base URL: `/api/super-admin`

| Method | Endpoint                    | Deskripsi                               |
| ------ | --------------------------- | --------------------------------------- |
| GET    | `/users`                    | Daftar users dengan pagination & filter |
| GET    | `/users/stats`              | Statistik users                         |
| GET    | `/users/:id`                | Detail user                             |
| POST   | `/users`                    | Buat admin/superadmin baru              |
| PUT    | `/users/:id`                | Update user                             |
| PATCH  | `/users/:id/status`         | Blokir/unblokir user                    |
| PATCH  | `/users/:id/reset-password` | Reset password                          |
| DELETE | `/users/:id`                | Hapus user                              |

## 🧪 Testing API

### Quick Test (Aman)

```bash
cd Backend
node test-super-admin-api.js
```

### Manual Testing dengan curl

1. **Login Super Admin:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "superadmin",
    "password": "superadmin123"
  }'
```

2. **Lihat Statistik Users:**

```bash
curl -X GET http://localhost:5000/api/super-admin/users/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

3. **Lihat Daftar Users:**

```bash
curl -X GET "http://localhost:5000/api/super-admin/users?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

4. **Buat Admin Baru:**

```bash
curl -X POST http://localhost:5000/api/super-admin/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin_baru",
    "password": "password123",
    "email": "admin@dinas.go.id",
    "nama_lengkap": "Admin Pariwisata",
    "level_akses": "admin"
  }'
```

## 🔧 Troubleshooting

### Error: Column 'is_blocked' doesn't exist

**Solusi**: Jalankan migration

```bash
npx sequelize-cli db:migrate
```

### Error: Super admin not found

**Solusi**: Jalankan seeder

```bash
npx sequelize-cli db:seed --seed create-super-admin.js
```

### Error: JWT malformed

**Solusi**: Pastikan JWT_SECRET ada di file .env

```env
JWT_SECRET=your-very-secure-secret-key
JWT_EXPIRE=24h
```

### Error: Forbidden access

**Solusi**: Pastikan login dengan akun superadmin yang benar

## 📋 Best Practices

### 1. Keamanan

- Selalu ganti password default super admin
- Gunakan password yang kuat (min 12 karakter)
- Jangan share credentials super admin
- Monitor activity log secara berkala

### 2. Manajemen User

- Buat admin dengan level sesuai kebutuhan
- Blokir akun yang mencurigakan, jangan langsung hapus
- Review dan update akses secara berkala
- Backup data sebelum menghapus user

### 3. Monitoring

- Cek activity log untuk aktivitas mencurigakan
- Monitor statistik users
- Review akun yang tidak aktif

## 🚨 Emergency Procedures

### Jika Super Admin terkunci:

1. Akses database langsung
2. Update field `is_blocked = false` untuk akun superadmin
3. Reset password jika perlu:

```sql
UPDATE Admins
SET password = '$2a$12$HASHED_PASSWORD_HERE', is_blocked = false
WHERE level_akses = 'superadmin' AND username = 'superadmin';
```

### Membuat Super Admin baru via database:

```sql
INSERT INTO Admins (username, password, email, level_akses, is_blocked, created_at, updated_at)
VALUES ('emergency_admin', '$2a$12$HASHED_PASSWORD', 'emergency@dinas.go.id', 'superadmin', false, NOW(), NOW());
```

## 📞 Support

Untuk bantuan teknis, hubungi developer atau cek:

- Activity logs di database
- Server logs untuk error details
- API documentation di `SUPER_ADMIN_API_DOCS.md`

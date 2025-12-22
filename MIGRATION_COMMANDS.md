# Commands untuk menjalankan migration dan seeder Super Admin

## 📁 Migration Command (untuk file add-is-blocked-to-admins.js)

### PowerShell (Windows):

```powershell
cd "d:\PROJECT\Magetan Tourism\Backend"
npx sequelize-cli db:migrate --migrations-path src/migrations --name add-is-blocked-to-admins.js
```

### Atau jika nama file lengkap dengan timestamp:

```powershell
npx sequelize-cli db:migrate --migrations-path src/migrations --to add-is-blocked-to-admins.js
```

### Atau jalankan semua migration yang pending:

```powershell
npx sequelize-cli db:migrate --migrations-path src/migrations
```

## 📁 Seeder Command (untuk file create-super-admin.js)

### PowerShell (Windows):

```powershell
npx sequelize-cli db:seed --seed src/seeders/create-super-admin.js
```

## 🔄 Rollback Commands (jika diperlukan)

### Rollback migration terakhir:

```powershell
npx sequelize-cli db:migrate:undo --migrations-path src/migrations
```

### Rollback migration spesifik:

```powershell
npx sequelize-cli db:migrate:undo --migrations-path src/migrations --to add-is-blocked-to-admins.js
```

### Rollback seeder:

```powershell
npx sequelize-cli db:seed:undo --seed src/seeders/create-super-admin.js
```

## 📋 Status Check Commands

### Cek status migration:

```powershell
npx sequelize-cli db:migrate:status --migrations-path src/migrations
```

### Cek status seeder:

```powershell
npx sequelize-cli db:seed:status --seeders-path src/seeders
```

## ⚡ Quick Setup (All in One):

```powershell
cd "d:\PROJECT\Magetan Tourism\Backend"
npx sequelize-cli db:migrate --migrations-path src/migrations
npx sequelize-cli db:seed --seed src/seeders/create-super-admin.js
```

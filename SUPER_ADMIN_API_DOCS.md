# Super Admin API Documentation

## Overview

API endpoints khusus untuk Super Admin yang memungkinkan pengelolaan user, admin, dan super admin lainnya.

## Base URL

```
/api/super-admin
```

## Authentication

Semua endpoints memerlukan:

- Bearer Token dalam header Authorization
- Level akses: `superadmin`

## Endpoints

### 1. GET /users

Mendapatkan daftar semua users dengan pagination dan filter.

**Query Parameters:**

```
page?: number (default: 1)
limit?: number (default: 10, max: 100)
search?: string (search by username, email, nama_lengkap)
level_akses?: "user" | "admin" | "superadmin"
sort?: "created_at" | "updated_at" | "username" | "email" | "level_akses"
order?: "ASC" | "DESC" (default: "DESC")
```

**Response:**

```json
{
  "message": "Users retrieved successfully",
  "data": [
    {
      "id_admin": 1,
      "username": "john_doe",
      "nama_lengkap": "John Doe",
      "email": "john@example.com",
      "level_akses": "admin",
      "is_blocked": false,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### 2. GET /users/stats

Mendapatkan statistik users.

**Response:**

```json
{
  "message": "User statistics retrieved successfully",
  "data": {
    "total_users": 100,
    "super_admins": 2,
    "admins": 8,
    "regular_users": 90,
    "blocked_users": 3,
    "recent_users_7_days": 5
  }
}
```

### 3. GET /users/:id

Mendapatkan detail user berdasarkan ID.

**Response:**

```json
{
  "message": "User details retrieved successfully",
  "data": {
    "id_admin": 1,
    "username": "john_doe",
    "nama_lengkap": "John Doe",
    "email": "john@example.com",
    "level_akses": "admin",
    "is_blocked": false,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. POST /users

Membuat admin atau superadmin baru.

**Request Body:**

```json
{
  "username": "new_admin",
  "password": "securepassword123",
  "nama_lengkap": "Admin Baru",
  "email": "admin@example.com",
  "level_akses": "admin" // or "superadmin"
}
```

**Response:**

```json
{
  "message": "admin account created successfully",
  "data": {
    "id_admin": 123,
    "username": "new_admin",
    "nama_lengkap": "Admin Baru",
    "email": "admin@example.com",
    "level_akses": "admin",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. PUT /users/:id

Update data user/admin.

**Request Body:**

```json
{
  "username": "updated_username",
  "nama_lengkap": "Updated Name",
  "email": "updated@example.com",
  "level_akses": "admin",
  "password": "newpassword123" // optional
}
```

**Response:**

```json
{
  "message": "User updated successfully",
  "data": {
    "id_admin": 1,
    "username": "updated_username",
    "nama_lengkap": "Updated Name",
    "email": "updated@example.com",
    "level_akses": "admin",
    "is_blocked": false,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 6. PATCH /users/:id/status

Blokir atau aktifkan akun user.

**Request Body:**

```json
{
  "is_blocked": true // atau false
}
```

**Response:**

```json
{
  "message": "User blocked successfully",
  "data": {
    "id_admin": 1,
    "username": "john_doe",
    "is_blocked": true
  }
}
```

### 7. PATCH /users/:id/reset-password

Reset password user.

**Request Body:**

```json
{
  "new_password": "newsecurepassword123"
}
```

**Response:**

```json
{
  "message": "Password reset successfully",
  "user": {
    "id_admin": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### 8. DELETE /users/:id

Hapus akun user/admin.

**Response:**

```json
{
  "message": "User deleted successfully",
  "deleted_user": {
    "username": "john_doe",
    "nama_lengkap": "John Doe",
    "email": "john@example.com",
    "level_akses": "admin"
  }
}
```

## Error Responses

### 401 Unauthorized

```json
{
  "message": "Unauthorized: Authentication required"
}
```

### 403 Forbidden

```json
{
  "message": "Forbidden: Super admin access required"
}
```

### 404 Not Found

```json
{
  "error": "User not found"
}
```

### 400 Bad Request

```json
{
  "error": "Username 'john_doe' already exists. Please choose another."
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error"
}
```

## Business Rules

1. **Super Admin Creation**: Hanya super admin yang bisa membuat super admin lain
2. **Self-modification Protection**: Super admin tidak bisa:
   - Mengubah level aksesnya sendiri
   - Memblokir dirinya sendiri
   - Menghapus akunnya sendiri
3. **Account Blocking**: Akun yang diblokir tidak bisa login
4. **Activity Logging**: Semua aktivitas super admin dicatat dalam activity log
5. **Validation**: Semua input divalidasi untuk keamanan dan konsistensi data

## Usage Examples

### Mencari admin berdasarkan nama

```
GET /api/super-admin/users?search=john&level_akses=admin&page=1&limit=20
```

### Memblokir user

```
PATCH /api/super-admin/users/123/status
Content-Type: application/json
{
  "is_blocked": true
}
```

### Membuat admin baru

```
POST /api/super-admin/users
Content-Type: application/json
{
  "username": "admin_baru",
  "password": "password123",
  "email": "admin@dinas.go.id",
  "nama_lengkap": "Admin Pariwisata",
  "level_akses": "admin"
}
```

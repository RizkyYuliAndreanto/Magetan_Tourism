#!/bin/bash
# setup-super-admin.sh - Script untuk setup sistem Super Admin

echo "🚀 Setting up Super Admin System..."
echo "=================================="

# Warna untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fungsi untuk print dengan warna
print_step() {
    echo -e "${BLUE}📋 Step $1:${NC} $2"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Step 1: Cek apakah di direktori Backend
print_step "1" "Checking current directory..."
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
    print_error "Please run this script from Backend directory"
    exit 1
fi
print_success "In correct directory"

# Step 2: Jalankan migration untuk menambah kolom is_blocked
print_step "2" "Running migration to add is_blocked column..."
npx sequelize-cli db:migrate --migrations-path src/migrations --config config/config.js

if [ $? -eq 0 ]; then
    print_success "Migration completed successfully"
else
    print_error "Migration failed"
    exit 1
fi

# Step 3: Jalankan seeder untuk membuat Super Admin
print_step "3" "Creating Super Admin account..."
npx sequelize-cli db:seed --seed src/seeders/create-super-admin.js --config config/config.js

if [ $? -eq 0 ]; then
    print_success "Super Admin created successfully"
else
    print_warning "Super Admin creation failed or already exists"
fi

# Step 4: Informasi login
echo ""
echo "🎉 Setup completed!"
echo "=================="
print_success "Super Admin Login Credentials:"
echo "   📧 Email: superadmin@magetan.go.id"
echo "   👤 Username: superadmin"
echo "   🔑 Password: superadmin123"
echo ""
print_warning "IMPORTANT: Change the password after first login!"
echo ""
echo "🔗 API Base URL: /api/super-admin"
echo "📖 Documentation: SUPER_ADMIN_API_DOCS.md"
echo "🧪 Test Script: node test-super-admin-api.js"
// test-super-admin-api.js
// Script untuk testing API Super Admin
const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";
let authToken = "";

// Login sebagai super admin
async function loginSuperAdmin() {
  try {
    console.log("🔐 Logging in as Super Admin...");
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      identifier: "superadmin", // Sesuaikan dengan username/email super admin Anda
      password: "password123", // Sesuaikan dengan password super admin Anda
    });

    authToken = response.data.token;
    console.log("✅ Login successful!");
    console.log(
      "User:",
      response.data.admin.username,
      "-",
      response.data.admin.level_akses
    );
    return response.data;
  } catch (error) {
    console.error(
      "❌ Login failed:",
      error.response?.data?.error || error.message
    );
    throw error;
  }
}

// Helper untuk membuat request dengan auth
const apiRequest = (method, endpoint, data = null) => {
  return axios({
    method,
    url: `${BASE_URL}/super-admin${endpoint}`,
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    data,
  });
};

// Test 1: Mendapatkan statistik users
async function testGetUserStats() {
  try {
    console.log("\n📊 Testing GET /users/stats...");
    const response = await apiRequest("GET", "/users/stats");
    console.log("✅ Stats retrieved:", response.data.data);
  } catch (error) {
    console.error("❌ Failed:", error.response?.data || error.message);
  }
}

// Test 2: Mendapatkan daftar users
async function testGetAllUsers() {
  try {
    console.log("\n👥 Testing GET /users...");
    const response = await apiRequest("GET", "/users?page=1&limit=5");
    console.log("✅ Users retrieved:", response.data.data.length, "users");
    console.log("Pagination:", response.data.pagination);
    return response.data.data;
  } catch (error) {
    console.error("❌ Failed:", error.response?.data || error.message);
    return [];
  }
}

// Test 3: Membuat admin baru
async function testCreateAdmin() {
  try {
    console.log("\n➕ Testing POST /users (Create Admin)...");
    const newAdmin = {
      username: `admin_test_${Date.now()}`,
      password: "testpassword123",
      email: `admin_${Date.now()}@test.com`,
      nama_lengkap: "Admin Test",
      level_akses: "admin",
    };

    const response = await apiRequest("POST", "/users", newAdmin);
    console.log("✅ Admin created:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("❌ Failed:", error.response?.data || error.message);
    return null;
  }
}

// Test 4: Update user
async function testUpdateUser(userId) {
  try {
    console.log(`\n✏️ Testing PUT /users/${userId}...`);
    const updateData = {
      nama_lengkap: "Updated Admin Name",
      email: `updated_${Date.now()}@test.com`,
    };

    const response = await apiRequest("PUT", `/users/${userId}`, updateData);
    console.log("✅ User updated:", response.data.data);
  } catch (error) {
    console.error("❌ Failed:", error.response?.data || error.message);
  }
}

// Test 5: Blokir user
async function testBlockUser(userId) {
  try {
    console.log(`\n🚫 Testing PATCH /users/${userId}/status (Block)...`);
    const response = await apiRequest("PATCH", `/users/${userId}/status`, {
      is_blocked: true,
    });
    console.log("✅ User blocked:", response.data.data);
  } catch (error) {
    console.error("❌ Failed:", error.response?.data || error.message);
  }
}

// Test 6: Unblokir user
async function testUnblockUser(userId) {
  try {
    console.log(`\n✅ Testing PATCH /users/${userId}/status (Unblock)...`);
    const response = await apiRequest("PATCH", `/users/${userId}/status`, {
      is_blocked: false,
    });
    console.log("✅ User unblocked:", response.data.data);
  } catch (error) {
    console.error("❌ Failed:", error.response?.data || error.message);
  }
}

// Test 7: Reset password user
async function testResetPassword(userId) {
  try {
    console.log(`\n🔑 Testing PATCH /users/${userId}/reset-password...`);
    const response = await apiRequest(
      "PATCH",
      `/users/${userId}/reset-password`,
      {
        new_password: "newpassword123",
      }
    );
    console.log("✅ Password reset:", response.data.user);
  } catch (error) {
    console.error("❌ Failed:", error.response?.data || error.message);
  }
}

// Test 8: Mendapatkan detail user
async function testGetUserDetails(userId) {
  try {
    console.log(`\n🔍 Testing GET /users/${userId}...`);
    const response = await apiRequest("GET", `/users/${userId}`);
    console.log("✅ User details:", response.data.data);
  } catch (error) {
    console.error("❌ Failed:", error.response?.data || error.message);
  }
}

// Test 9: Hapus user (hati-hati!)
async function testDeleteUser(userId) {
  try {
    console.log(`\n🗑️ Testing DELETE /users/${userId}...`);
    const response = await apiRequest("DELETE", `/users/${userId}`);
    console.log("✅ User deleted:", response.data.deleted_user);
  } catch (error) {
    console.error("❌ Failed:", error.response?.data || error.message);
  }
}

// Main testing function
async function runAllTests() {
  try {
    console.log("🚀 Starting Super Admin API Tests...\n");

    // Login terlebih dahulu
    await loginSuperAdmin();

    // Test basic functionality
    await testGetUserStats();
    const users = await testGetAllUsers();

    // Test CRUD operations
    const newAdmin = await testCreateAdmin();

    if (newAdmin) {
      const userId = newAdmin.id_admin;

      await testGetUserDetails(userId);
      await testUpdateUser(userId);
      await testBlockUser(userId);
      await testUnblockUser(userId);
      await testResetPassword(userId);

      // Konfirmasi sebelum menghapus
      console.log(`\n⚠️ About to delete test user with ID: ${userId}`);
      console.log("Waiting 3 seconds...");
      await new Promise((resolve) => setTimeout(resolve, 3000));

      await testDeleteUser(userId);
    }

    console.log("\n🎉 All tests completed!");
  } catch (error) {
    console.error("💥 Test suite failed:", error.message);
  }
}

// Test search functionality
async function testSearchUsers() {
  try {
    console.log("\n🔍 Testing search functionality...");

    // Search by username
    const searchResponse = await apiRequest(
      "GET",
      "/users?search=admin&limit=3"
    );
    console.log(
      "✅ Search results:",
      searchResponse.data.data.length,
      "users found"
    );

    // Filter by level_akses
    const filterResponse = await apiRequest("GET", "/users?level_akses=admin");
    console.log(
      "✅ Admin users:",
      filterResponse.data.data.length,
      "admins found"
    );
  } catch (error) {
    console.error(
      "❌ Search test failed:",
      error.response?.data || error.message
    );
  }
}

// Run specific tests
async function runBasicTests() {
  try {
    await loginSuperAdmin();
    await testGetUserStats();
    await testGetAllUsers();
    await testSearchUsers();
  } catch (error) {
    console.error("Basic tests failed:", error.message);
  }
}

// Export functions untuk testing individual
module.exports = {
  runAllTests,
  runBasicTests,
  loginSuperAdmin,
  testGetUserStats,
  testGetAllUsers,
  testCreateAdmin,
  testSearchUsers,
};

// Run tests jika file dijalankan langsung
if (require.main === module) {
  // Uncomment salah satu:
  runBasicTests(); // Test dasar yang aman
  // runAllTests(); // Test lengkap termasuk create/delete
}

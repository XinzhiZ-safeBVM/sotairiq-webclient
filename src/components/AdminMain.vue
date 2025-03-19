<template>
  <div class="container">
    <div class="header">
      <img src="@/assets/safebvm-logo.png" alt="SafeBVM Logo" class="logo">
      <button @click="logout" class="logout-button">Log Out</button>
    </div>
    <h1>Admin Dashboard</h1>
    <div class="admin-buttons">
      <router-link to="/admin/users" class="admin-button">
        <span class="button-icon">👥</span>
        User Management
      </router-link>
      <router-link to="/admin/data" class="admin-button">
        <span class="button-icon">📊</span>
        Data Management
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminMain',
  created() {
    // Check if user has admin privileges
    if (!this.$store?.state?.user?.isAdmin) {
      this.$router.push('/login')
    }
  },
  methods: {
    logout() {
      // Clear user state
      this.$store.commit('clearUser')
      // Redirect to login page
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.logo {
  width: 150px;
}

.logout-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.logout-button:hover {
  background-color: #c82333;
}

h1 {
  color: #007bff;
  margin-bottom: 30px;
}

.admin-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
}

.admin-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  background-color: #ffffff;
  border: 2px solid #007bff;
  border-radius: 10px;
  text-decoration: none;
  color: #007bff;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.admin-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  background-color: #007bff;
  color: #ffffff;
}

.button-icon {
  font-size: 48px;
  margin-bottom: 10px;
}
</style>
<template>
  <div class="container">
    <img src="@/assets/safebvm-logo.png" alt="SafeBVM Logo" class="logo">
    <h1>Welcome, {{ username }}</h1>
    <p>Please choose an option below:</p>
    <router-link to="/download" class="button">Download Sotair IQ</router-link>
    <router-link to="/scoreboard" class="button">Go to Provider Performance Scoreboard</router-link>
    <button @click="handleLogout" class="button logout-button">Logout</button>
  </div>
</template>

<script>
export default {
  name: 'UserMain',
  data() {
    return {
      username: ''
    }
  },
  created() {
    const currentUser = localStorage.getItem('currentUser')
    if (!currentUser) {
      this.$router.push('/login')
    } else {
      this.username = currentUser
    }
  },
  methods: {
    handleLogout() {
      localStorage.removeItem('currentUser')
      this.username = ''
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.container {
  width: 80%;
  max-width: 600px;
  background: #ffffff;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  text-align: center;
  border: 2px solid #007bff;
}
.logo {
  width: 150px;
  margin-bottom: 20px;
}
h1 {
  color: #007bff;
  margin-bottom: 20px;
}
.button {
  display: inline-block;
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  margin: 10px;
  text-decoration: none;
  border-radius: 5px;
  font-size: 16px;
  transition: background-color 0.3s;
  border: none;
  cursor: pointer;
}
.button:hover {
  background-color: #0056b3;
}
.logout-button {
  background-color: #dc3545;
}
.logout-button:hover {
  background-color: #c82333;
}
</style>
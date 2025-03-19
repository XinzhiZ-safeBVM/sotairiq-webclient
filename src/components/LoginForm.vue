<template>
  <div class="login-container">
    <img src="@/assets/safebvm-logo.png" alt="SafeBVM Logo" class="logo">
    <h1>Login to Sotair IQ</h1>
    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <input
          type="text"
          v-model="username"
          placeholder="Username"
          required
          class="form-input"
        >
      </div>
      <div class="form-group">
        <input
          type="password"
          v-model="password"
          placeholder="Password"
          required
          class="form-input"
        >
      </div>
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <button type="submit" class="button">Login</button>
    </form>
  </div>
</template>

<script>
const demoUsers = [
  { username: 'demo1', password: 'password1', isAdmin: false },
  { username: 'demo2', password: 'password2', isAdmin: false },
  { username: 'admin', password: 'admin123', isAdmin: true }
]

export default {
  name: 'LoginForm',
  data() {
    return {
      username: '',
      password: '',
      error: ''
    }
  },
  methods: {
    handleLogin() {
      const user = demoUsers.find(
        u => u.username === this.username && u.password === this.password
      )

      if (user) {
        // 使用Vuex store保存用户状态
        this.$store.dispatch('login', {
          username: user.username,
          isAdmin: user.isAdmin
        })

        // 根据用户角色跳转到相应页面
        if (user.isAdmin) {
          this.$router.push('/admin')
        } else {
          this.$router.push('/user')
        }
      } else {
        this.error = 'Invalid username or password'
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  width: 80%;
  max-width: 400px;
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

.login-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  margin-bottom: 15px;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.button:hover {
  background-color: #0056b3;
}

.error-message {
  color: #dc3545;
  margin-bottom: 10px;
}
</style>
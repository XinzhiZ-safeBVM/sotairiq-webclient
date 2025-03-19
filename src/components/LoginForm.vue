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
      <button type="submit" class="button" :disabled="loading">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
    </form>
  </div>
</template>

<script>
import authService from '@/services/authService';

export default {
  name: 'LoginForm',
  data() {
    return {
      username: '',
      password: '',
      error: '',
      loading: false
    }
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.error = '';
      
      try {
        const result = await authService.login(this.username, this.password);
        
        if (result.success) {
          // Get user info from the token (you might want to decode the JWT)
          // For demo purposes, we'll just use the username
          this.$store.dispatch('login', {
            username: this.username,
            // You would typically extract isAdmin from the token
            isAdmin: this.username.toLowerCase() === 'admin'
          });
          
          // Redirect based on user role
          if (this.username.toLowerCase() === 'admin') {
            this.$router.push('/admin');
          } else {
            this.$router.push('/user');
          }
        } else {
          this.error = result.error || 'Login failed. Please check your credentials.';
        }
      } catch (error) {
        console.error('Login error:', error);
        this.error = 'An unexpected error occurred. Please try again.';
      } finally {
        this.loading = false;
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
  width: calc(100% - 22px); /* Accounting for padding and border */
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box; /* This ensures padding is included in width calculation */
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
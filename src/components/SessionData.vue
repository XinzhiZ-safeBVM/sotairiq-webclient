<template>
  <div class="container">
    <div class="header">
      <img src="@/assets/safebvm-logo.png" alt="SafeBVM Logo" class="logo">
      <div class="button-group">
        <router-link to="/user" class="main-button">Main</router-link>
        <button @click="handleLogout" class="exit-button">Exit</button>
      </div>
    </div>
    <h1>Provider Performance Dashboard</h1>
    <div class="provider-name">Provider: {{ providerName }} | Session: {{ sessionId }}</div>
    <table>
      <thead>
        <tr>
          <th>Breath</th>
          <th>Time (s)</th>
          <th>Inspiratory Flow Time (s)</th>
          <th>Inspiratory Flow Volume (mL)</th>
          <th>Expiratory Volume (mL)</th>
          <th>Peak Flow (L/min)</th>
          <th>Pressure (cmH<sub>2</sub>O)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="data in sessionData" :key="data.breath">
          <td>{{ data.breath }}</td>
          <td>{{ data.ts_s }}</td>
          <td>{{ data.in_flow_time_s }}</td>
          <td>{{ data.in_flow_vol_ml }}</td>
          <td>{{ data.ex_vol_ml }}</td>
          <td>{{ data.pk_flow_slm }}</td>
          <td>{{ data.p_press_cmH2O }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import authService from '@/services/authService';
import apiService from '@/services/apiService';

export default {
  name: 'SessionData',
  data() {
    return {
      providerName: '',
      sessionId: this.$route.params.id,
      sessionData: []
    }
  },
  async created() {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      this.$router.push('/login');
      return;
    }
    
    try {
      // Load session data by ID
      const session = await apiService.getSessionById(this.sessionId);
      
      if (session) {
        this.providerName = session.user_name || session.id;
        
        // Use the parsed breath data
        if (session.breathsData && session.breathsData.length > 0) {
          this.sessionData = session.breathsData;
        } else {
          console.error('No breath data found for session');
        }
      } else {
        console.error('Session not found');
      }
    } catch (error) {
      console.error('Error loading session data:', error);
    }
  },
  methods: {
    handleLogout() {
      // Clear authentication data
      authService.logout();
      // Clear user state in Vuex store
      if (this.$store) {
        this.$store.dispatch('logout');
      }
      // Redirect to landing page
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.container {
  width: 90%;
  max-width: 1200px;
  background: #ffffff;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  text-align: center;
  border: 2px solid #007bff;
  overflow-y: auto;
  max-height: 90vh;
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
.exit-button {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}
.exit-button:hover {
  background-color: #5a6268;
}
h1 {
  color: #007bff;
  margin-bottom: 10px;
}
.provider-name {
  font-size: 1.2em;
  margin-bottom: 20px;
  color: #333;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}
table, th, td {
  border: 1px solid #007bff;
}
th, td {
  padding: 12px;
  text-align: left;
}
th {
  background-color: #007bff;
  color: white;
}
.button-group {
  display: flex;
  gap: 10px;
}
.main-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}
.main-button:hover {
  background-color: #0056b3;
}
</style>
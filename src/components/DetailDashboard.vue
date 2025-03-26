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
    <div class="provider-name">Provider: {{ providerName }}</div>
    <table>
      <thead>
        <tr>
          <th>Session Number</th>
          <th>Breaths</th>
          <th>Time (s)</th>
          <th>BPM</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="session in sessions" :key="session.number">
          <td>
            <router-link :to="`/session/${session.number}`" class="session-link">{{ session.number }}</router-link>
          </td>
          <td>{{ session.breaths }}</td>
          <td>{{ session.time_s }}</td>
          <td>{{ session.bpm }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import authService from '@/services/authService';
import apiService from '@/services/apiService';

export default {
  name: 'DetailDashboard',
  data() {
    return {
      providerName: '',
      providerId: this.$route.params.id,
      sessions: []
    }
  },
  async created() {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      this.$router.push('/login');
      return;
    }
    
    try {
      // Load session data from sample file
      const sessions = await apiService.loadSampleSessions();
      
      // Find the session that matches the provider ID
      const providerSession = sessions.find(session => session.id === this.providerId);
      
      if (providerSession) {
        this.providerName = providerSession.id;
        
        // Create session data from the summary
        if (providerSession.summaryData && providerSession.summaryData.length > 0) {
          const summary = providerSession.summaryData[0];
          this.sessions = [
            {
              number: providerSession.id,
              breaths: summary.breaths,
              time_s: summary.time_s,
              bpm: summary.bpm
            }
          ];
        }
      } else {
        console.error('Provider session not found');
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
.session-link {
  color: #007bff;
  text-decoration: none;
}
.session-link:hover {
  text-decoration: underline;
}
.container {
  width: 80%;
  max-width: 900px;
  background: #ffffff;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  text-align: center;
  border: 2px solid #007bff;
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
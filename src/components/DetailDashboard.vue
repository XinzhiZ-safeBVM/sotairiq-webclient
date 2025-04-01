<template>
  <div class="container">
    <div class="header">
      <img src="@/assets/safebvm-logo.png" alt="SafeBVM Logo" class="logo">
      <div class="button-group">
        <router-link to="user" class="main-button">Main</router-link>
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
            <router-link :to="`${providerId}/${session.number}`" class="session-link">{{ session.number }}</router-link>
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
      this.$router.push('login');
      return;
    }
    
    // Set provider name from route params
    this.providerName = this.providerId;
    
    try {
      // Get sessions for this trainee
      const sessions = await apiService.getSessionsByTrainee(this.providerId);
      
      // Process each session to extract summary data
      this.sessions = sessions.map(session => {
        // Parse the summary data
        const parsedSession = apiService.parseSummaryData(session);
        const summaryData = parsedSession.summaryData || {};
        
        return {
          number: session.id,
          breaths: summaryData.breaths || '-',
          time_s: summaryData.time_s ? parseFloat(summaryData.time_s).toFixed(2) : '-',
          bpm: summaryData.bpm ? parseFloat(summaryData.bpm).toFixed(1) : '-'
        };
      });
    } catch (error) {
      console.error('Error loading session data:', error);
    }
  },
  methods: {
    handleLogout() {
      authService.logout();
      if (this.$store) {
        this.$store.dispatch('logout');
      }
      this.$router.push('');
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
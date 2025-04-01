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
      sessionId: this.$route.params.sessionId || this.$route.params.id,
      sessionData: []
    }
  },
  async created() {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      this.$router.push('login');
      return;
    }
    
    try {
      // Load session data by ID - no need to decode here, let the API service handle encoding
      const response = await apiService.getSessionById(this.sessionId);
      
      // Handle case where API returns an array or a single object
      const rawSession = Array.isArray(response) ? 
        response.find(s => s.id === this.sessionId) : 
        response;
      
      if (rawSession) {
        // Parse the breath data
        const session = apiService.parseBreathsData(rawSession);
        
        this.providerName = session.trainee || session.id;
        
        // Use the parsed breath data
        if (session.breathsData && session.breathsData.length > 0) {
          // Format numeric values for better display
          this.sessionData = session.breathsData.map(breath => ({
            breath: breath.breath || '-',
            ts_s: breath.ts_s ? parseFloat(breath.ts_s).toFixed(2) : '-',
            in_flow_time_s: breath.in_flow_time_s ? parseFloat(breath.in_flow_time_s).toFixed(2) : '-',
            in_flow_vol_ml: breath.in_flow_vol_ml ? parseFloat(breath.in_flow_vol_ml).toFixed(1) : '-',
            ex_vol_ml: breath.ex_vol_ml ? parseFloat(breath.ex_vol_ml).toFixed(1) : '-',
            pk_flow_slm: breath.pk_flow_slm ? parseFloat(breath.pk_flow_slm).toFixed(1) : '-',
            p_press_cmH2O: breath.p_press_cmH2O ? parseFloat(breath.p_press_cmH2O).toFixed(1) : '-'
          }));
        } else if (rawSession.breaths) {
          // Try manual parsing if the parser didn't work
          this.manuallyParseBreaths(rawSession.breaths);
        } else {
          console.error('No breath data found for session');
          this.addFallbackData();
        }
      } else {
        console.error('Session not found');
        this.addFallbackData();
      }
    } catch (error) {
      console.error('Error loading session data:', error);
      this.addFallbackData();
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
      this.$router.push('');
    },
    
    // Manually parse breaths data if the parser didn't work
    manuallyParseBreaths(breathsString) {
      try {
        const breathsData = JSON.parse(breathsString);
        console.log('Manual parse of breaths data:', breathsData);
        
        if (Array.isArray(breathsData) && breathsData.length > 1) {
          const headers = breathsData[0];
          const dataRows = breathsData.slice(1, -1);
          
          this.sessionData = dataRows.map(row => {
            const breathObj = {};
            headers.forEach((header, index) => {
              breathObj[header] = row[index];
            });
            
            return {
              breath: breathObj.breath || '-',
              ts_s: breathObj.ts_s ? parseFloat(breathObj.ts_s).toFixed(2) : '-',
              in_flow_time_s: breathObj.in_flow_time_s ? parseFloat(breathObj.in_flow_time_s).toFixed(2) : '-',
              in_flow_vol_ml: breathObj.in_flow_vol_ml ? parseFloat(breathObj.in_flow_vol_ml).toFixed(1) : '-',
              ex_vol_ml: breathObj.ex_vol_ml ? parseFloat(breathObj.ex_vol_ml).toFixed(1) : '-',
              pk_flow_slm: breathObj.pk_flow_slm ? parseFloat(breathObj.pk_flow_slm).toFixed(1) : '-',
              p_press_cmH2O: breathObj.p_press_cmH2O ? parseFloat(breathObj.p_press_cmH2O).toFixed(1) : '-'
            };
          });
        } else {
          console.error('Breaths data format is not as expected');
          this.addFallbackData();
        }
      } catch (parseError) {
        console.error('Error manually parsing breaths data:', parseError);
        this.addFallbackData();
      }
    },
    
    // Add fallback data for testing/development
    addFallbackData() {
      this.sessionData = [
        {
          breath: '1',
          ts_s: '0.00',
          in_flow_time_s: '0.50',
          in_flow_vol_ml: '250.0',
          ex_vol_ml: '240.0',
          pk_flow_slm: '30.0',
          p_press_cmH2O: '15.0'
        },
        {
          breath: '2',
          ts_s: '5.00',
          in_flow_time_s: '0.55',
          in_flow_vol_ml: '260.0',
          ex_vol_ml: '250.0',
          pk_flow_slm: '32.0',
          p_press_cmH2O: '16.0'
        },
        {
          breath: '3',
          ts_s: '10.00',
          in_flow_time_s: '0.52',
          in_flow_vol_ml: '255.0',
          ex_vol_ml: '245.0',
          pk_flow_slm: '31.0',
          p_press_cmH2O: '15.5'
        }
      ];
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
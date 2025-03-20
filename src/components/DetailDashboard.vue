<template>
  <div class="container">
    <div class="header">
      <img src="@/assets/safebvm-logo.png" alt="SafeBVM Logo" class="logo">
      <div class="button-group">
        <router-link to="/user" class="main-button">Main</router-link>
        <router-link to="/" class="exit-button">Exit</router-link>
      </div>
    </div>
    <h1>Provider Performance Dashboard</h1>
    <div class="provider-name">Provider: {{ providerName }}</div>
    <table>
      <thead>
        <tr>
          <th>Session Number</th>
          <th>Average Volume</th>
          <th>Average Flow</th>
          <th>Average Pressure</th>
          <th>Average Inspiratory Flow Time</th>
          <th>Average Number of Sotair Triggers</th>
          <th>Sotair IQ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="session in sessions" :key="session.number">
          <td>
            <router-link :to="`/session/${session.number}`" class="session-link">{{ session.number }}</router-link>
          </td>
          <td>{{ session.volume }}</td>
          <td>{{ session.flow }}</td>
          <td>{{ session.pressure }}</td>
          <td>{{ session.flowTime }}</td>
          <td>{{ session.triggers }}</td>
          <td>{{ session.score }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'DetailDashboard',
  data() {
    return {
      providerName: 'John Doe',
      sessions: [
        {
          number: 1,
          volume: '500 mL',
          flow: '25 L/min',
          pressure: '20 cmH2O',
          flowTime: '1.2 s',
          triggers: 3,
          score: '85%'
        },
        {
          number: 2,
          volume: '520 mL',
          flow: '28 L/min',
          pressure: '22 cmH2O',
          flowTime: '1.3 s',
          triggers: 2,
          score: '90%'
        },
        {
          number: 3,
          volume: '510 mL',
          flow: '26 L/min',
          pressure: '21 cmH2O',
          flowTime: '1.25 s',
          triggers: 2,
          score: '88%'
        }
      ]
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
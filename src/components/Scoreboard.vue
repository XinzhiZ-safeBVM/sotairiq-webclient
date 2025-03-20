<template>
  <div class="container">
    <div class="header">
      <img src="@/assets/safebvm-logo.png" alt="SafeBVM Logo" class="logo">
      <div class="button-group">
        <router-link to="/user" class="main-button">Main</router-link>
        <router-link to="/" class="exit-button">Exit</router-link>
      </div>
    </div>
    <h1>Provider Performance Scoreboard</h1>
    <table>
      <thead>
        <tr>
          <th>Provider Name</th>
          <th>Performance Score</th>
          <th>Last Updated</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="provider in providers" :key="provider.id">
          <td>
            <router-link :to="`/dashboard/${provider.id}`" class="provider-link">{{ provider.name }}</router-link>
          </td>
          <td>{{ provider.score }}</td>
          <td>{{ provider.lastUpdated }}</td>
          <td>{{ provider.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'Scoreboard',
  data() {
    return {
      providers: [
        { id: 1, name: 'Provider A', score: '95%', lastUpdated: '2024-01-23', status: 'Active' },
        { id: 2, name: 'Provider B', score: '88%', lastUpdated: '2024-01-22', status: 'Active' },
        { id: 3, name: 'Provider C', score: '92%', lastUpdated: '2024-01-21', status: 'Active' }
      ]
    }
  }
}
</script>

<style scoped>
.provider-link {
  color: #007bff;
  text-decoration: none;
}
.provider-link:hover {
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
  margin-bottom: 20px;
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
tr:nth-child(even) {
  background-color: #f8f9fa;
}
tr:hover {
  background-color: #e9f5ff;
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
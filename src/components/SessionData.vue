<template>
  <div class="container">
    <img src="@/assets/safebvm-logo.png" alt="SafeBVM Logo" class="logo">
    <h1>Provider Performance Dashboard</h1>
    <div class="provider-name">Provider: {{ providerName }} | Session: {{ sessionId }}</div>
    <table>
      <thead>
        <tr>
          <th>Breath Count</th>
          <th>Time (s)</th>
          <th>Inspiratory Volume (mL)</th>
          <th>Expiratory Volume (mL)</th>
          <th>Pressure (cmH<sub>2</sub>O)</th>
          <th>Flow (L/min)</th>
          <th>Inspiratory Flow Time (s)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="data in sessionData" :key="data.breathCount">
          <td>{{ data.breathCount }}</td>
          <td>{{ data.time }}</td>
          <td>{{ data.inspiratoryVolume }}</td>
          <td>{{ data.expiratoryVolume }}</td>
          <td>{{ data.pressure }}</td>
          <td>{{ data.flow }}</td>
          <td>{{ data.inspiratoryFlowTime }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'SessionData',
  data() {
    return {
      providerName: 'John Doe',
      sessionId: this.$route.params.id,
      sessionData: []
    }
  },
  created() {
    // 在组件创建时根据sessionId加载数据
    this.sessionData = [
      { breathCount: 1, time: 4.92, inspiratoryVolume: 521, expiratoryVolume: -465, pressure: 15.14, flow: 30.89, inspiratoryFlowTime: 1.2 },
      { breathCount: 2, time: 8.65, inspiratoryVolume: 492, expiratoryVolume: -520, pressure: 16.06, flow: 34.08, inspiratoryFlowTime: 1.3 },
      { breathCount: 3, time: 11.84, inspiratoryVolume: 499, expiratoryVolume: -452, pressure: 25.17, flow: 49.33, inspiratoryFlowTime: 1.1 },
      { breathCount: 4, time: 15.23, inspiratoryVolume: 511, expiratoryVolume: -490, pressure: 19.34, flow: 36.10, inspiratoryFlowTime: 1.4 },
      { breathCount: 5, time: 18.19, inspiratoryVolume: 498, expiratoryVolume: -497, pressure: 21.34, flow: 43.63, inspiratoryFlowTime: 1.2 },
      { breathCount: 6, time: 21.84, inspiratoryVolume: 652, expiratoryVolume: -631, pressure: 24.26, flow: 42.22, inspiratoryFlowTime: 1.3 },
      { breathCount: 7, time: 25.34, inspiratoryVolume: 444, expiratoryVolume: -477, pressure: 26.45, flow: 47.48, inspiratoryFlowTime: 1.1 },
      { breathCount: 8, time: 28.73, inspiratoryVolume: 616, expiratoryVolume: -626, pressure: 26.68, flow: 47.44, inspiratoryFlowTime: 1.2 },
      { breathCount: 9, time: 31.41, inspiratoryVolume: 268, expiratoryVolume: -302, pressure: 17.95, flow: 49.11, inspiratoryFlowTime: 1.3 },
      { breathCount: 10, time: 34.46, inspiratoryVolume: 342, expiratoryVolume: -349, pressure: 19.17, flow: 48.89, inspiratoryFlowTime: 1.1 },
      { breathCount: 11, time: 37.66, inspiratoryVolume: 556, expiratoryVolume: -483, pressure: 25.68, flow: 49.27, inspiratoryFlowTime: 1.4 },
      { breathCount: 12, time: 41.02, inspiratoryVolume: 488, expiratoryVolume: -472, pressure: 34.11, flow: 47.07, inspiratoryFlowTime: 1.2 },
      { breathCount: 13, time: 44.44, inspiratoryVolume: 741, expiratoryVolume: -690, pressure: 34.11, flow: 47.07, inspiratoryFlowTime: 1.3 },
      { breathCount: 14, time: 48.33, inspiratoryVolume: 742, expiratoryVolume: -680, pressure: 25.92, flow: 46.83, inspiratoryFlowTime: 1.1 },
      { breathCount: 15, time: 51.75, inspiratoryVolume: 580, expiratoryVolume: -566, pressure: 33.17, flow: 46.66, inspiratoryFlowTime: 1.4 },
      { breathCount: 16, time: 55.07, inspiratoryVolume: 678, expiratoryVolume: -624, pressure: 26.45, flow: 45.32, inspiratoryFlowTime: 1.2 },
      { breathCount: 17, time: 58.23, inspiratoryVolume: 408, expiratoryVolume: -465, pressure: 22.79, flow: 42.15, inspiratoryFlowTime: 1.3 },
      { breathCount: 18, time: 61.41, inspiratoryVolume: 511, expiratoryVolume: -566, pressure: 27.79, flow: 43.89, inspiratoryFlowTime: 1.1 },
      { breathCount: 19, time: 64.11, inspiratoryVolume: 300, expiratoryVolume: -345, pressure: 29.33, flow: 44.12, inspiratoryFlowTime: 1.4 },
      { breathCount: 20, time: 67.55, inspiratoryVolume: 480, expiratoryVolume: -489, pressure: 30.18, flow: 44.85, inspiratoryFlowTime: 1.2 }
    ]
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
.logo {
  width: 150px;
  margin-bottom: 20px;
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
</style>
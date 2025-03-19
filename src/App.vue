<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: 'Arial', sans-serif;
  background-color: #e9f5ff;
}

#app {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Global responsive styles */
@media (max-width: 768px) {
  .container {
    width: 90% !important;
    padding: 15px !important;
  }
  
  .logo {
    width: 120px !important;
  }
  
  h1 {
    font-size: 1.5rem !important;
  }
  
  .button {
    padding: 8px 16px !important;
    font-size: 14px !important;
    margin: 5px !important;
  }
}

@media (max-width: 480px) {
  .container {
    width: 95% !important;
    padding: 10px !important;
  }
  
  .logo {
    width: 100px !important;
  }
  
  h1 {
    font-size: 1.2rem !important;
  }
  
  .button {
    padding: 6px 12px !important;
    font-size: 12px !important;
    display: block !important;
    margin: 10px auto !important;
  }
}
</style>
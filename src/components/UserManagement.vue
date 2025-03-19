<template>
  <div class="container">
    <img src="@/assets/safebvm-logo.png" alt="SafeBVM Logo" class="logo">
    <h1>User Management</h1>
    
    <!-- Add User Button -->
    <button class="action-button" @click="showAddUserModal = true">
      <span class="button-icon">➕</span> Add New User
    </button>

    <!-- User List Table -->
    <table>
      <thead>
        <tr>
          <th>Username</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.username">
          <td>{{ user.username }}</td>
          <td>{{ user.isAdmin ? 'Admin' : 'User' }}</td>
          <td class="actions">
            <button class="icon-button" @click="showChangePasswordModal(user)">
              🔑
            </button>
            <button class="icon-button delete" @click="confirmDeleteUser(user)">
              ❌
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Add User Modal -->
    <div class="modal" v-if="showAddUserModal">
      <div class="modal-content">
        <h2>Add New User</h2>
        <form @submit.prevent="addUser">
          <div class="form-group">
            <label>Username:</label>
            <input v-model="newUser.username" required>
          </div>
          <div class="form-group">
            <label>Password:</label>
            <input type="password" v-model="newUser.password" required>
          </div>
          <div class="form-group">
            <label>Role:</label>
            <select v-model="newUser.isAdmin">
              <option :value="false">User</option>
              <option :value="true">Admin</option>
            </select>
          </div>
          <div class="modal-buttons">
            <button type="submit" class="action-button">Add User</button>
            <button type="button" class="action-button cancel" @click="showAddUserModal = false">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Change Password Modal -->
    <div class="modal" v-if="showPasswordModal">
      <div class="modal-content">
        <h2>Change Password</h2>
        <form @submit.prevent="changePassword">
          <div class="form-group">
            <label>New Password:</label>
            <input type="password" v-model="newPassword" required>
          </div>
          <div class="modal-buttons">
            <button type="submit" class="action-button">Change Password</button>
            <button type="button" class="action-button cancel" @click="showPasswordModal = false">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserManagement',
  data() {
    return {
      users: [
        { username: 'admin', isAdmin: true },
        { username: 'user1', isAdmin: false },
        { username: 'user2', isAdmin: false }
      ],
      showAddUserModal: false,
      showPasswordModal: false,
      newUser: {
        username: '',
        password: '',
        isAdmin: false
      },
      selectedUser: null,
      newPassword: ''
    }
  },
  created() {
    // Check if user has admin privileges
    if (!this.$store?.state?.user?.isAdmin) {
      this.$router.push('/login')
    }
  },
  methods: {
    addUser() {
      // Add new user to the list
      this.users.push({
        username: this.newUser.username,
        isAdmin: this.newUser.isAdmin
      })
      // Reset form and close modal
      this.newUser = { username: '', password: '', isAdmin: false }
      this.showAddUserModal = false
    },
    showChangePasswordModal(user) {
      this.selectedUser = user
      this.showPasswordModal = true
      this.newPassword = ''
    },
    changePassword() {
      // Update user password
      console.log(`Changing password for ${this.selectedUser.username}`)
      this.showPasswordModal = false
      this.selectedUser = null
      this.newPassword = ''
    },
    confirmDeleteUser(user) {
      if (confirm(`Are you sure you want to delete user ${user.username}?`)) {
        this.users = this.users.filter(u => u.username !== user.username)
      }
    }
  }
}
</script>

<style scoped>
.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.logo {
  width: 150px;
  margin-bottom: 20px;
}

h1 {
  color: #007bff;
  margin-bottom: 30px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #007bff;
  color: white;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.action-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  margin: 10px;
}

.action-button.cancel {
  background-color: #6c757d;
}

.icon-button {
  background: none;
  border: none;
  font-size: 1.2em;
  cursor: pointer;
  padding: 5px;
}

.icon-button.delete:hover {
  color: #dc3545;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}
</style>
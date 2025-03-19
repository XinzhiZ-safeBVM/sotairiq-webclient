import { createStore } from 'vuex'

export default createStore({
  state: {
    user: {
      username: null,
      isAdmin: false
    }
  },
  mutations: {
    setUser(state, { username, isAdmin }) {
      state.user.username = username
      state.user.isAdmin = isAdmin
    },
    clearUser(state) {
      state.user.username = null
      state.user.isAdmin = false
    }
  },
  actions: {
    login({ commit }, { username, isAdmin }) {
      commit('setUser', { username, isAdmin })
    },
    logout({ commit }) {
      commit('clearUser')
    }
  },
  getters: {
    isLoggedIn: state => !!state.user.username,
    isAdmin: state => state.user.isAdmin
  }
})
import { createStore } from 'vuex';

export default createStore({
  state: {
    token: null,
    userInfo: null,
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
  },
  actions: {
    saveToken({ commit }, token) {
      commit('setToken', token);
      localStorage.setItem('token', token);
    },
    saveUserInfo({ commit }, userInfo) {
      commit('setUserInfo', userInfo);
    },
    clearAuthData({ commit }) {
      commit('setToken', null);
      commit('setUserInfo', null);
      localStorage.removeItem('token');
    },
  },
  getters: {
    isAuthenticated(state) {
      return !!state.token;
    },
    getUserInfo(state) {
      return state.userInfo;
    },
  },
});

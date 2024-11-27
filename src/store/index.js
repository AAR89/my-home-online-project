import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem("token") || "",
    appeals: [],
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem("token", token);
    },
    SET_APPEALS(state, appeals) {
      state.appeals = appeals;
    },
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await axios.post(
          "https://dev.moydomonline.ru/api/auth/login/",
          credentials
        );
        commit("SET_TOKEN", response.data.key);
        return true;
      } catch (error) {
        throw new Error("Неправильные данные");
      }
    },
    async fetchAppeals({ state, commit }) {
      try {
        const response = await axios.get(
          "https://dev.moydomonline.ru/api/appeals/v1.0/appeals/",
          {
            headers: { Authorization: `Token ${state.token}` },
          }
        );
        commit("SET_APPEALS", response.data.results);
      } catch (error) {
        console.error(error);
      }
    },
  },
});

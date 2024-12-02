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
    ADD_APPEAL(state, appeal) {
      state.appeals.push(appeal);
    },
    UPDATE_APPEAL(state, updatedAppeal) {
      const index = state.appeals.findIndex((a) => a.id === updatedAppeal.id);
      if (index !== -1) {
        Vue.set(state.appeals, index, updatedAppeal);
      }
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
        console.log(response.data.results);
        // console.log(response.data.results.at(0).number + 1);
        commit("SET_APPEALS", response.data.results);
      } catch (error) {
        console.error(error);
      }
    },
    async createAppeal({ state, commit }, appeal) {
      try {
        const response = await axios.post(
          "https://dev.moydomonline.ru/api/appeals/v1.0/appeals/",
          appeal,
          {
            headers: { Authorization: `Token ${state.token}` },
          }
        );
        commit("ADD_APPEAL", response.data);
      } catch (error) {
        console.error("Ошибка при создании заявки", error);
      }
    },
    async updateAppeal({ state, commit }, appeal) {
      try {
        const response = await axios.put(
          `https://dev.moydomonline.ru/api/appeals/v1.0/appeals/${appeal.id}/`,
          appeal,
          {
            headers: { Authorization: `Token ${state.token}` },
          }
        );
        commit("UPDATE_APPEAL", response.data);
      } catch (error) {
        console.error("Ошибка при обновлении заявки", error);
      }
    },
  },
});

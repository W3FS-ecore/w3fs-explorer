import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    language: "",
    header: false,
    CHAIN_RPC: "",
    coincap: "",
    Contact: [],
  },
  getters: {
    language: (state) => {
      if (state.language) {
        return state.language;
      } else {
        let lang = localStorage.getItem("language");
        lang = lang ? lang : "en";
        Vue.set(state, "language", lang);
        return lang;
      }
    },
  },
  mutations: {
    SetLanguage(state, payload) {
      Vue.set(state, "language", payload);
    },
    SetHeader(state, payload) {
      Vue.set(state, "header", payload);
    },
    SetContants(state, payload) {
      Vue.set(state, "CHAIN_RPC", payload.CHAIN_RPC);
      Vue.set(state, "coincap", payload.coincap);
      Vue.set(state, "Contact", payload.Contact);
    },
  },
  actions: {
    SetLanguage({ commit }, payload) {
      commit("SetLanguage", payload);
    },
    SetHeader({ commit }, payload) {
      commit("SetHeader", payload);
    },
    SetContants({ commit }, payload) {
      commit("SetContants", payload);
    },
  },
});

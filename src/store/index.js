import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import actions from "./actions"
import getters from "./getters"
import moduleA from "./modules/moduleA"

Vue.use(Vuex);

const store = new Vuex.Store({
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters,
  modules: {
    moduleA: moduleA
  }
});

export default store

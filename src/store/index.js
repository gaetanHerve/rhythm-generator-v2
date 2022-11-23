import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    timeSignature: {numBeats: 4, beatValue: 4},
  },
  getters: {
    timeSignature: state => {
      return state.timeSignature;
    }
  },
  mutations: {
    setTimeSignature(state, signature) {
      state.timeSignature = {
        numBeats: signature.numBeats,
        beatValue: signature.beatValue,
      };
    }
  },
  actions: {},
  modules: {}
});

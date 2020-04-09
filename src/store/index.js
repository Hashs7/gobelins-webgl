import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    canvasRef: null,
    isLoading: false,
    quality: null,
  },
  mutations: {
    initScene(state, canvas) {
      state.canvasRef = canvas;
    },
    changeScene(state, { scene, camera }) {
      state.scene = scene;
      state.camera = camera;
    },
    setLoader(state, value) {
      state.isLoading = value;
    },
    setQuality(state, value) {
      state.quality = value;
    }
  },
  actions: {
  },
  modules: {
  }
})

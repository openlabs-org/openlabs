import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import { ethers } from 'ethers'

export default new Vuex.Store({
  state: {
    isConnected: false,
    provider: null
  },
  mutations: {
    setIsConnected: (state, value) => (state.isConnected = value),
    setProvider: (state, value) => (state.provider = value)
  },
  actions: {
    connect({ commit }) {
      if (!window.ethereum) {
        throw new Error('Metamask is not installed')
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      commit('setIsConnected', true)
      commit('setProvider', provider)
    },
    disconnect({ commit }) {
      commit('setIsConnected', false)
      commit('setProvider', null)
    }
  }
})

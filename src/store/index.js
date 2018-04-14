// 组装模块并导出 store 的地方

import Vue from 'vue'
import Vuex from 'vuex'
import map from './modules/map'
import user from './modules/userInfo'
// import createLogger from '../../../src/plugins/logger'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    namespaced: true,
    map,
    user
  },
  strict: debug
  // plugins: debug ? [createLogger()] : []
})

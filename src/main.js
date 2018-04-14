// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import Mint from 'mint-ui'
import util from './util/util'
import 'mint-ui/lib/style.min.css'
import VueAMap from 'vue-amap'
import store from './store'
// import 'vconsole'
import md5 from 'js-md5'
import VueSocket from 'vue-socket.io'
import '../static/css/main.css'
Vue.use(VueAMap);
Vue.use(util);
// Vue.use(VueSocket,'http://112.74.182.160:6001')
// 初始化vue-amap
VueAMap.initAMapApiLoader({
  // 高德的key
  key: '5a56c9f0200552fc3d02f25e387f9bdc',
  // 插件集合
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor','AMap.Geocoder'],
  uiVersion: '1.0' // 版本号
});
Vue.use(Mint)
//把mint-ui中的toast提示组件放到vue对象中
Vue.prototype.$http = axios
Vue.prototype.HOST = ''
// Vue.prototype.HOST = '/api'
Vue.prototype.toast = Mint.Toast
Vue.prototype.Indicator = Mint.Indicator
Vue.prototype.messageBox = Mint.MessageBox
Vue.config.productionTip = false
Vue.prototype.mapKey = '5a56c9f0200552fc3d02f25e387f9bdc'
import './assets/sass/main.scss'
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

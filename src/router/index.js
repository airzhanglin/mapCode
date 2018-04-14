import Vue from 'vue'
import Router from 'vue-router'
const enclosure=()=>import('@/views/enclosure/enclosure'),
editMap=()=>import('@/views/enclosure/editMap'),
mapInfo_edit=()=>import('@/views/enclosure/mapInfo_edit');
Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      name:'enclosure',
      component:enclosure
    },
    {
      path:'/editMap',
      name:'editMap',
      component:editMap,
      children:[
        {
          path:'mapInfo_edit',
          name:'mapInfo_edit',
          component:mapInfo_edit
        }
      ]
    }
  ]
})

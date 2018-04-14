<template>
  <div>
    <mt-header title="电子围栏">
       <div  @click="gopage" slot="right" class="head-right"><i class="fa fa-plus"></i></div>
    </mt-header>
    <div id="contaner">
      <template v-if="list.length!=0">
 <mt-cell-swipe v-for="(item,index) in list" :key="item.gid" :title="item.name"  :label="item.alert_condition=='0'?'进围栏报警':'离开栏报警'" :to="`/editMap?gid=${item.gid}&id=${item.id}`"
         :right="[
    {
      content: '删除',
      style: { background: 'red', color: '#fff' },
      handler: () => deletes(item)
    }
  ]"
         is-link></mt-cell-swipe>
      </template>
       
    </div>
  </div>
</template>
<script>
  import {mapGetters} from "vuex";
export default {
  data() {
    return {
      list: []
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created() {
    this.getdata();
    //调用app方法
    var ua = navigator.userAgent.toLowerCase();//获取当前设备信息
    if (/iphone|ipad|ipod/.test(ua)) {//如果是ios
      try{
        window.toggleNav('');
      }catch (e){
        if (e instanceof TypeError){
          console.log('无该函数方法')
        }
      }
    } else if (/android/.test(ua)) {//安卓
      try{
        window.clientJS.toggleNav('');
      }catch (e){
        if (e instanceof TypeError){
          console.log('无该函数方法')
        }
      }
    }
  },
  methods: {
    gopage(){
      this.$router.push({ path: 'editMap' })
    },
    getdata() {
      //获取列表数据
      this.$http
        .get(`http://restapi.amap.com/v4/geofence/meta`, {
          params: {
            key:this.mapKey
          }
        })
        .then(res => {
          let data = res.data;
          if(data.data.rs_list.length==0){
              this.basicinfo = '暂无数据';
              this.toast('暂无数据')
          }else{

            this.list = data.data.rs_list;
          }
        })
        .catch(err => {
          this.toast("查询失败");
        });
    },
    deletes(item) {
      console.log(item);
      //删除操作
      this.messageBox
        .confirm("确定执行此操作?")
        .then(action => {
          this.$http
            .post(`http://restapi.amap.com/v4/geofence/meta?key=${this.mapKey}&gid=${item.gid}&method=delete`)
            .then(res => {
              if (res.data.data.message == "成功") {
                // this.deleteServer(item);
              }else{
                this.toast("操作失败");
              }
            })
            .catch(res => {
              this.toast("操作失败");
            });
        })
        .catch(err => {
          console.log(err);
        });
    },
    // deleteServer(item) {//删除服务器上数据
    //   this.$http
    //     .post(`${this.HOST}/post/deleteEnclosure`, {
    //       userToken: this.userInfo.userToken,
    //       id: item.id
    //     })
    //     .then(res => {
    //       if (res.data.code == "000000") {
    //         this.toast(res.data.msg);
    //         this.getdata();
    //       }
    //     })
    //     .catch(res => {
    //       this.toast("操作失败");
    //     });
    // },
    goback(){
      this.$router.go(-1)
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/sass/_mixins.scss";
@import "../../assets/sass/_parameters.scss";
#contaner {
  .mint-cell-text {
    color: $enclosure-color !important;
  }
  .is-right{
 height: 100%;
  }
  .head-right{
   
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>



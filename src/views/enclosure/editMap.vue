<template>
  <div class="editmap-body">
    <mt-header title="电子围栏">
     <mt-button icon="back" @click="goback" slot="left"></mt-button>
     <span slot="right" @click="sheetVisible=true">围栏类型</span>
    </mt-header>
    <div id="container" tabindex="0"></div>
    <div class="drag-body" v-show="drawType==0">
      <div class="drag">
          <mt-range v-model="radius"  :min="100" :step="100" :max="1500">
            <div slot="start" style="margin-right: 5px;">100</div>
            <div slot="end" style="margin-left: 5px;">150</div>
          </mt-range>
          <p v-show="!isdraw">当前圆形半径为：{{radius}}</p>
      </div>
    </div>
      <div class="footer-tip">
        <p v-if="drawType==1">请在地图上点击三个以上的点组成一个闭合的多边形作为安全范围的区域</p>
        <p v-else>请在地图上点击任意位置</p>
        <button class="btn-ok" @click="goedit">确定</button>
      </div>
       <mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet>
       <transition name="slide">
          <router-view class="router-body"></router-view>
       </transition>
  </div>
</template>
<script>
var postionMark;
var positionMarkPry;
let circle, polygon, geolocation;
export default {
  data() {
    return {
      mapInfo: {},
      sheetVisible: false,
      actions: [
        { name: "圆形（默认）", method: this.drawClk, type: 0 },
        { name: "自定义形状", method: this.drawClk, type: 1 }
      ],
      drawType: 0,
      markers: [],
      markerArray: [],
      isClik: true,
      isdraw: true,
      radius: 500,
      isfirstLoding: false
    };
  },
  created() {
    if (this.$route.query.gid) {
      this.getdata();
    }
  },
  mounted() {
    let _this = this;
    this.map = new AMap.Map("container", {
      //创建地图
      resizeEnable: true,
      zoom: 14
    });
    if (!this.$route.query.gid) {
      //如果是新建那么就获取用户所在位置
      this.map.plugin("AMap.Geolocation", function() {
        geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, //是否使用高精度定位，默认:true
          timeout: 10000, //超过10秒后停止定位，默认：无穷大
          buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          buttonPosition: "RB"
        });
        _this.map.addControl(geolocation);
        geolocation.getCurrentPosition();
      });
    }
    postionMark = this.map;
    this.map.on("click", res => {
      let data = { Lng: res.lnglat.getLng(), lat: res.lnglat.getLat() };
      this.mapClk(data);
    });
  },
  methods: {
    getdata() {
      this.isfirstLoding = true;
      this.$http
        .get("http://restapi.amap.com/v4/geofence/meta", {
          params: {
            key: this.mapKey,
            gid: this.$route.query.gid,
            page_no: 1,
            page_size: 20
          }
        })
        .then(res => {
          this.mapInfo = res.data.data.rs_list[0];
          let data = this.mapInfo.center.split(",");
          this.map.setCenter([data[0], data[1]]); //设置地图中心点
          if (this.mapInfo.points=='') {
            let data = this.mapInfo.center.split(",");
            this.mapClk({ Lng: data[0], lat: data[1] });
            this.radius = this.mapInfo.radius; //圆形半径
          } else {//多边形
            let data = this.mapInfo.points.split(";");
            this.drawType = 1;
            data.forEach((ary, index) => {
              this.markers.push({
                icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                position: [ary.split(",")[0], ary.split(",")[1]]
              });
              if (index == data.length - 1) {
                this.setting();
                this.drawSt();
                this.isfirstLoding = false;
              }
            });
          }
        })
        .catch(err => {
          this.toast("查询失败");
        });
    },
    mapClk(res) {
      if (this.drawType == 0) {
        this.markers = [
          {
            icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
            position: [res.Lng, res.lat]
          }
        ];
        //如果是圆形类型
        this.setting();
        this.drawSt();
      } else {
        //自定义形状
        this.markers.push({
          icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
          position: [res.Lng, res.lat]
        });
        this.setting();
        if (this.markers.length > 3 || this.markers.length == 3) {
          this.drawSt();
        }
      }
    },
    setting() {
      //设置标记点
      let _this = this;
      if (this.drawType == 0) {
        if (this.isClik) {
          //第一次点击设置标记
          postionMark = new AMap.Marker({
            map: _this.map,
            icon: _this.markers[0].icon,
            position: [
              _this.markers[0].position[0],
              _this.markers[0].position[1]
            ],
            offset: new AMap.Pixel(-12, -36)
          });
          postionMark.setMap(_this.map);
          this.isClik = false;
        } else {
          //第二次更新标记
          postionMark.setPosition([
            _this.markers[0].position[0],
            _this.markers[0].position[1]
          ]); //更新点标记位置
        }
      } else {
        //多边形标记
        this.markers.forEach(function(marker) {
          positionMarkPry = new AMap.Marker({
            map: _this.map,
            icon: marker.icon,
            position: [marker.position[0], marker.position[1]],
            offset: new AMap.Pixel(-12, -36)
          });
          _this.markerArray.push(positionMarkPry);
          positionMarkPry.setMap(_this.map);
        });
      }
    },
    drawSt() {
      //画围栏事件
      let _this = this;
      //画出围栏
      if (this.drawType == 0) {
        //圆形类型
        if (this.isdraw) {
          //第一个设置圆形
          circle = new AMap.Circle({
            center: new AMap.LngLat(
              _this.markers[0].position[0],
              _this.markers[0].position[1]
            ), // 圆心位置
            radius: _this.radius, //半径
            strokeColor: "#F33", //线颜色
            strokeOpacity: 1, //线透明度
            strokeWeight: 3, //线粗细度
            fillColor: "#ee2200", //填充颜色
            fillOpacity: 0.35 //填充透明度
          });
          circle.setMap(this.map);
          this.isdraw = false;
        } else {
          //更新圆形中心位置
          circle.setCenter([
            this.markers[0].position[0],
            this.markers[0].position[1]
          ]);
        }
      } else {
        //自定义类型
        let polygonArr = new Array(); //多边形覆盖物节点坐标数组
        this.markers.forEach(function(marker) {
          polygonArr.push([marker.position[0], marker.position[1]]);
        });
        polygon = new AMap.Polygon({
          path: polygonArr, //设置多边形边界路径
          strokeColor: "#FF33FF", //线颜色
          strokeOpacity: 0.2, //线透明度
          strokeWeight: 3, //线宽
          fillColor: "#1791fc", //填充色
          fillOpacity: 0.35 //填充透明度
        });
        polygon.setMap(this.map);
      }
    },
    drawClk(val) {
      //选择围栏类型
      this.drawType = val.type;
    },
    goback() {
      //返回上一页
      this.$router.go(-1);
    },
    goedit() {
      let datajson;
      if (this.markers.length == 0) {
        this.toast("请先设置围栏");
        return false;
      }
      if (this.drawType == 0) {
        datajson = {
          type: this.drawType,
          data: this.markers,
          radius: this.radius
        };
      } else {
        datajson = { type: this.drawType, data: this.markers, radius: "" };
      }
      this.$store.commit("setMap", datajson); //把数据存入仓库当中
      this.$router.push({
        path: "/editMap/mapInfo_edit",
        query: { gid: this.$route.query.gid, name: this.mapInfo.name,id:this.$route.query.id}
      });
    }
  },
  watch: {
    radius(val) {
      //监听改变拖动value的值
      circle.setRadius(val);
    },
    drawType(val) {
      /***
       * 当this.drawType为0时切换为了圆形围栏，那么需要置空多边形。设置isClick为true,isdraw为true
       *
       */
      console.log(this.isfirstLoding)
      if (!this.isfirstLoding) {
        console.log('变化')
        //判断是否为编辑围栏，如果为编辑围栏那么初次进入页面注销watch事件
        if (this.markers.length > 0) {
          if (val == 0) {
            this.map.remove(this.markerArray);
            polygon.setMap(null);
            this.isClik = true;
            this.isdraw = true;
          } else {
            postionMark.setMap(null);
            circle.setMap(null);
          }
          this.markers = [];
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/sass/_mixins.scss";
@import "../../assets/sass/_parameters.scss";
.editmap-body {
  height: 100%;
  overflow: hidden;
  #container {
    height: 100%;
    margin: 0px;
    position: relative;
  }
  .footer-tip {
    position: fixed;
    bottom: 0;
    background: #f0e7a4;
    display: flex;
    width: 100%;
    @include wh(100%,60px);
    z-index: 555;
    padding: 10px 12px;
    box-sizing: border-box;
    color: #fff;
    p {
      flex: 1;
      color: #008ceb;
      height: 100%;
      margin: auto;
    }
  }
  .router-body {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    @include wh(100%,100%);
    z-index: 666;
    background: #fff;
  }
  .drag-body {
    display: flex;
    justify-content: center;
    .drag {
      position: fixed;
      padding-top: 12px;
      align-items: center;
      top: 40px;
      margin: auto;
      padding: 12px 12px;
      box-sizing: border-box;
      @include wh(100%,80px);
      background: #fff;
      p {
        margin-top: 8px;
        margin-bottom: 8px;
      }
    }
  }
}
</style>



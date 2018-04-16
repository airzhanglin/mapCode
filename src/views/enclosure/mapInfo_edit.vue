<template>
  <div class="info-body">
    <mt-header title="电子围栏">
      <mt-button icon="back" @click="goback" slot="left"></mt-button>
    </mt-header>
    <mt-field label="围栏名称" placeholder="填写围栏名称" v-model="formdata.name"></mt-field>
    <mt-radio align="right" v-model="formdata.alert_condition" :options="options">
    </mt-radio>
    <div class="opreate">
      <button class="btn-sub" @click="sub">确定</button>
    </div>
  </div>
</template>
<script>
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        formdata: {
          name: "",
          alert_condition: "enter"
        },
        options: [
          {
            value: "enter",
            label: "进围栏报警"
          },
          {
            value: "leave",
            label: "出围栏报警"
          }
        ]
      };
    },
    computed: {
      ...mapGetters(["enclosureInfo","userInfo"])
    },
    created() {
      if (this.$route.query.gid) {
        this.formdata.name = this.$route.query.name;
      }
    },
    methods: {
      goback() {
        this.$router.go(-1);
      },
      sub() {
        if (this.formdata.name == "") {
          this.toast("围栏名称不能为空");
        } else {
          this.Indicator.open({
            text: "请稍后...",
            spinnerType: "fading-circle"
          });
          let date1 = new Date();
          let month = date1.getMonth() + 1;
          let day = date1.getDate();
          if (month < 10) {
            month = `0${date1.getMonth() + 1}`;
          }
          if (day < 10) {
            day = `0${day}`;
          }
          let time1 = date1.getFullYear() + "-" + month + "-" + day; //time1表示当前时间
          let dataJosn;
          if (this.enclosureInfo.type == 0) {
            console.log(
              `${this.enclosureInfo.data[0].position[0]},${this.enclosureInfo
                .data[0].position[1]}`
            );
            //圆形围栏数据格式设置
            dataJosn = {
              name: this.formdata.name,
              center: `${this.enclosureInfo.data[0].position[0]},${this
                .enclosureInfo.data[0].position[1]}`,
              radius: this.enclosureInfo.radius,
              enable: "true",
              repeat: "Mon,Tues,Wed,Thur,Fri,Sat,Sun",
              time: "00:00,11:59;13:00,23:59",
              desc: "测试围栏描述",
              alert_condition: this.formdata.alert_condition
            };
          } else {
            //多边形
            let pointsArray = this.enclosureInfo.data;
            let points = "";
            pointsArray.forEach((element, index) => {
              if (index == pointsArray.length - 1) {
                points = `${points}${element.position[0]},${element.position[1]}`;
              } else {
                points = `${points}${element.position[0]},${element
                  .position[1]};`;
              }
            });
            dataJosn = {
              name: this.formdata.name,
              points: points,
              enable: "true",
              valid_time: time1,
              repeat: "Mon,Tues,Wed,Thur,Fri,Sat,Sun",
              time: "00:00,11:59;13:00,23:59",
              desc: "测试围栏描述",
              alert_condition: this.formdata.alert_condition
            };
          }
          if (this.$route.query.gid) {
            delete dataJosn.enable; //更新围栏不能含有enable参数，删除
            //如果路由存在该gid说明为更新围栏
            this.$http
              .post(
                `https://restapi.amap.com/v4/geofence/meta?key=${this
                  .mapKey}&gid=${this.$route.query.gid}&method=patch`,
                dataJosn
              )
              .then(res => {
                  this.toast('更新围栏成功')
                  setTimeout(() => {
                  this.$router.replace({path: "/"}); //回到围栏列表页
                }, 1500);
              })
              .catch(err => {
                this.toast("更新围栏失败");
              });
          } else {
            //新建围栏
            this.$http
              .post(
                `https://restapi.amap.com/v4/geofence/meta?key=${this.mapKey}`,
                dataJosn
              )
              .then(res => {
                if (res.data.data.message == "成功") {
                  // this.subServer(dataJosn, res.data.data);
                  this.toast('创建围栏成功')
                  setTimeout(() => {
                  this.$router.replace({path: "/"}); //回到围栏列表页
                }, 1500);
                } else {
                  this.Indicator.close();
                }
              })
              .catch(err => {
                this.Indicator.close();
                this.toast("创建围栏失败");
              });
          }
        }
      },
      subServer(data, serverData) {
        if (this.$route.query.gid) {
          this.$http
            .post(`${this.HOST}/post/editEnclosure`, {
              id: this.$route.query.id,
              userToken: this.userInfo.userToken,
              student_id: this.userInfo.student_id,
              s_id: '0',
              g_id: this.$route.query.gid,
              name: data.name,
              desc: "",
              center: this.enclosureInfo.type == 0 ? data.center : "",
              radius: this.enclosureInfo.type == 0 ? data.radius : "",
              points: this.enclosureInfo.type == 0 ? "" : data.points,
              enable: true,
              repeat: data.repeat,
              fixed_date: "",
              time: data.time,
              alert_condition: data.alert_condition == "enter" ? '0' : '1'
            })
            .then(res => {
              if (res.data.code == "000000") {
                this.Indicator.close();
                this.toast("更新围栏成功");
                setTimeout(() => {
                  this.$router.replace({path: "/enclosure"}); //回到围栏列表页
                }, 1500);
              }
            })
            .catch(err => {
              this.toast("保存失败");
            });
        } else {
          this.$http
            .post(`${this.HOST}/post/addEnclosure`, {
              userToken: this.userInfo.userToken,
              student_id: this.userInfo.student_id,
              s_id: serverData.id,
              g_id: serverData.gid,
              name: data.name,
              desc: "",
              center: this.enclosureInfo.type == 0 ? data.center : "",
              radius: this.enclosureInfo.type == 0 ? data.radius : "",
              points: this.enclosureInfo.type == 0 ? "" : data.points,
              enable: data.enable,
              valid_time: data.valid_time,
              repeat: data.repeat,
              fixed_date: "",
              time: data.time,
              alert_condition: data.alert_condition == "enter" ? '0' : '1'
            })
            .then(res => {
              if (res.data.code == "000000") {
                this.Indicator.close();
                this.toast("创建围栏成功");
                setTimeout(() => {
                  this.$router.replace({path: "/"}); //回到围栏列表页
                }, 1500);
              }
            })
            .catch(err => {
              this.toast("保存失败");
            });
        }
      }

    }
  };
</script>
<style lang="scss" scoped>
  @import "../../assets/sass/_mixins.scss";
  @import "../../assets/sass/_parameters.scss";

  .info-body {
    color: #008ceb;
  }

  .mint-cell-text {
    color: #008ceb !important;
  }

  .opreate {
    margin-top: 29%;
    width: 100%;
    display: flex;
    justify-content: center;
    .btn-sub {
      background: $enclosure-color;
      color: #fff;
      border-color: $enclosure-color;
      border-radius: 5px;
      @include wh(70%, 45px);
      font-size: 14px;
    }
  }
</style>



import md5 from 'js-md5'
export default {
  install(Vue, options) {
    Vue.prototype.createToken = function(userType,routname) {
      return userType+md5.hex(routname+this.gettime())
    }
    Vue.prototype.gettime = function() {
      let time = Date.parse(new Date())
      return (time = time / 1000)
    }
    Vue.prototype.imgLogo = function(item) {
      return Vue.prototype.HOST + "/getImg?sid=" + item;
    }
    Vue.prototype.getLocalTime= function (timestamp) {
      var date1 = new Date(timestamp * 1000);    //根据时间戳生成的时间对象
      let month = date1.getMonth() + 1,
        day = date1.getDate(),
        Hours = date1.getHours(),
        Minutes = date1.getMinutes(),
        Seconds = date1.getSeconds();
      if (month < 10) {
        month = "0" + month
      }
      if (day < 10) {
        day = "0" + day
      }
      if (Hours < 10) {
        Hours = "0" + Hours
      }
      if (Minutes < 10) {
        Minutes = "0" + Minutes
      }
      if (Seconds < 10) {
        Seconds = "0" + Seconds
      }
      let date = date1.getFullYear() + "-" + month + "-" + day + " " + Hours + ":" + Minutes + ":" + Seconds;//time1表示当前时间
      return date;
    }
  }
}

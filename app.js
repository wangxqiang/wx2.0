var Bmob = require('util/bmob.js');
Bmob.initialize("e6a3d6ddcdab9593e46dd88e7188a456", "5f03abef208dcf09dfdc3a0023530039");
App({
  onLaunch: function () {
  },
  onShow: function () {
  },
  onHide: function () {
  },
  globalData: {
    hasLogin: false
  },
  //头像和名字
   getUserInfo: function(cb) {
    var that = this;
    if (this.globalData.userInfo) {
        typeof cb == "function" && cb(this.globalData.userInfo);
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo);
        }, fail: function(){
              wx.showModal({
                  title: '用户未授权',
                  content: '此操作会影响菜单栏的页面效果',
                  showCancel: false,
                  success: function (res) {
                      if (res.confirm) {
                          console.log('用户点击确定');
                          wx.openSetting({
                                  success:function (){
                                        res.authSetting = {
                                            "scope.userInfo": true,
                                            "scope.userLocation": true
                                   }
                              }
                      })
                      }
                  }
              })
          }
      })
    }
  },
//头像和名字结束
})

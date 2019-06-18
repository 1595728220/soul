//app.js
App({
  onLaunch: function() {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {
      openId: null
    }
    wx.cloud.callFunction({
      name: "login"
    }).then(res => {
      this.globalData.openId = res.result.openid
      // console.log(this.globalData.openId)
    }).catch(err => console.log(err))
  }
})
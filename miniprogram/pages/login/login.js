// miniprogram/pages/login/login.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    // 查看是否授权
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: res => {
              // console.log(getApp().globalData)
              // console.log(res)
              this.successLogin(res)
            }
          })
        }
      }
    })
  },
  //成功登陆后执行的方法
  successLogin(res) {
    // console.log(res)
    wx.showLoading({
      title: '正在登陆中',
    })
    getApp().globalData.userInfo = res.userInfo
    let {
      nickName: nick,
      avatarUrl: avatar
    } = getApp().globalData.userInfo
    let {
      openId: _openid
    } = getApp().globalData
    console.log()
    db.collection("soul_user").where({
      _openid
    }).get().then(res => {
      // console.log(res)
      if (res.data.length === 0) {
        console.log("添加新用户信息")
        db.collection("soul_user").add({
          data: {
            nick,
            avatar
          }
        }).then(res => {
          console.log("添加新用户成功")
          wx.hideLoading()
          wx.showToast({
            title: '登陆成功',
          })
          wx.switchTab({
            url: "/pages/square/square"
          })

        })
      } else {
        console.log("更新当前用户信息")
        db.collection("soul_user").doc(res.data[0]._id).update({
          data: {
            nick,
            avatar
          }
        }).then(res => {
          console.log("更新当前用户信息成功")
          wx.hideLoading()
          wx.switchTab({
            url: "/pages/square/square"
          })
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  bindGetUserInfo: function(res) {
    // console.log(res)
    this.successLogin(res.detail)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
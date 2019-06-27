// pages/chat/chat.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    socketOpen: false,
    msgList: [], //对象数组，对象保存用户id和最近的消息,
  },
  connectChat() {
    wx.connectSocket({
      url: 'ws://127.0.0.1:8181'
    })
    wx.onSocketOpen(res => {
      this.setData({
        socketOpen: true
      })
    })
    wx.onSocketMessage(res => {
      console.log(res)
      res = JSON.parse(res.data)
      // console.log(res)
      if (res.code === 2) {
        this.setData({
          msgList: res.data
        })
      }
    })
  },
  toP2pchat(e) {
    let id = e.target.dataset.id
    wx.navigateTo({
      url: '/pages/p2pchat/p2pchat?recive_openid=' + id+"&msgList="+JSON.stringify(this.data.msgList),
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.connectChat()

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
    wx.closeSocket({
      code: 1000,
      complete: () => {
        console.log("关闭socket连接")
        this.setData({
          socketOpen: false
        })
      }
    })
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
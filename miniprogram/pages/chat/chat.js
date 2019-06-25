// pages/chat/chat.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scoketOpen: false,
    msgList:[] //对象数组，对象保存用户id和最近的消息
  },
  connectChat() {

    const socketMsgQueue = []
    wx.connectSocket({
      url: 'ws://127.0.0.1:8181'
    })
    wx.onSocketOpen(res => {
      this.setData({
        socketOpen: true
      })
      // sendSocketMessage("走我")
      console.log(res)
    })
    wx.onSocketMessage(res => console.log(res))

    function sendSocketMessage(msg) {
      if (this.data.socketOpen) {
        wx.sendSocketMessage({
          data: msg
        })
      }
    }
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
// pages/chat/chat.js
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    socketOpen: false,
    msgList: [], //对象数组，对象保存用户id和最近的消息,
    simpleList: [], //对要展示的内容进行筛选
  },
  connectChat() {
    wx.connectSocket({
      url: 'wss://soul.urlip.cn:8181'
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
        //将消息数据保存到本地列表
        this.setData({
          msgList: res.data
        })
        //筛选出发送给我的消息
        this.setData({
          simpleList: this.data.msgList.filter(el => {
            return el.recive_openid === getApp().globalData.openId
          })
        })
        //如果没有我的消息,退出函数
        if(this.data.simpleList.length === 0){
          return
        }
        //将我的信息本地化
        let simpleList = this.data.simpleList,tmp = []
        //每个给我发消息的人只保留最后一条信息
          simpleList = simpleList.reverse().filter((el,i,arr)=>{
            let sign = false
            if(tmp.indexOf(el.own_openId) === -1){
              tmp.push(el.own_openId)
              sign = true
            }
            return sign
          })
        simpleList.msg_time = new Date(simpleList.msg_time).toLocaleString()
        this.setData({
          ["simpleList.msg_time"]:time
        })
      }
    })
  },
  toP2pchat(e) {
    let id = e.target.dataset.id
    wx.navigateTo({
      url: '/pages/p2pchat/p2pchat?recive_openid=' + id + "&msgList=" + JSON.stringify(this.data.msgList),
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
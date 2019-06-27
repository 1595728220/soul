// pages/p2pchat/p2pchat.js
const db = wx.cloud.database()
const _ = db.command
let socketOpen = false,
  SocketTask
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgObj: {
      own_openid: "",
      recive_openid: "",
      msg: "",
      own_avatar: "",
      recive_avatar: ""
    },
    own_list: [],
    recive_list: []
  },
  onChange(val) {
    this.setData({
      ["msgObj.msg"]: val.detail,
    })
  },
  //用于发送消息
  sendSocketMessage() {
    if (this.data.msgObj.msg !== "") {
      wx.sendSocketMessage({
        data: JSON.stringify(this.data.msgObj)
      })

    } else {
      wx.showModal({
        title: '注意',
        content: '请输入要发送的内容',
      })
    }
  },
  // 创建连接
  connectChat() {
    SocketTask = wx.connectSocket({
      url: 'ws://127.0.0.1:8181',
      success(res) {
        console.log("连接成功")
      },
      fail(err) {
        console.log("连接失败")
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let own_openid =
      getApp().globalData.openId,
      // "otcZZ5OBn4W_F2xIOF7XWC8HvElk",
      recive_openid =
      // "otcZZ5GiW9ldjjfSbNx53XJrSFvQ"
    options.recive_openid
    ,msgList = JSON.parse(options.msgList)
    // console.log(msgList)
    
    console.log(recive_openid)
    db.collection("soul_user").where({
      _openid: _.in([own_openid, recive_openid])
    }).get().then(res => {
      // console.log(res)
      this.setData({
        ["msgObj.own_openid"]: own_openid,
        ["msgObj.recive_openid"]: recive_openid,
        ["msgObj.own_avatar"]: res.data.filter(el => el._openid === own_openid)[0].avatar,
        ["msgObj.recive_avatar"]: res.data.filter(el => el._openid === recive_openid)[0].avatar,
      })
      // console.log(this.data.msgObj)
      msgList.forEach(el => this.concatList(el))
    }).catch(err => console.log(err))
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    //监听socket的开启,关闭,发生错误,接收到信息
    SocketTask.onOpen(res => {
      socketOpen = true
      console.log('监听 WebSocket 连接打开事件。', res)
    })
    SocketTask.onClose(onClose => {
      console.log('监听 WebSocket 连接关闭事件。', onClose)
      socketOpen = false;
    })
    SocketTask.onError(onError => {
      console.log('监听 WebSocket 错误。错误信息', onError)
      socketOpen = false
    })
    SocketTask.onMessage(res => {
      console.log(res)
      res = JSON.parse(res.data)
      console.log(res)
      if (res.code === 1) {
        this.concatList(res.data)
      }
    })
  },
  /**
   * 将消息对象中数据放入own_list或recive_list
   */
  concatList(res) {
    console.log(res)
    // 是我接收到信息,加载完后清空表单值
    if (res.recive_openid === this.data.msgObj.own_openid && res.own_openid === this.data.msgObj.recive_openid) {
      this.setData({
        recive_list: this.data.recive_list.concat([res]),
        ["msgObj.msg"]: ""
      })
    }
    // 是我发的信息,加载完后清空表单值
    if (res.recive_openid === this.data.msgObj.recive_openid && res.own_openid === this.data.msgObj.own_openid) {
      this.setData({
        own_list: this.data.own_list.concat([res]),
        ["msgObj.msg"]: ""
      })
    }
  },
  //将接受到的消息对象，放入对应的数组
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (!socketOpen) {
      this.connectChat()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    SocketTask.close(function(close) {
      console.log('关闭 WebSocket 连接。', close)
    })
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
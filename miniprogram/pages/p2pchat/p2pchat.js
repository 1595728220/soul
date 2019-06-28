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
    //用户输入的消息
    msgObj: {
      own_openid: "",
      recive_openid: "",
      msg: "",
      own_avatar: "",
      recive_avatar: "",
      own_nick: "",
      recive_nick: ""
    },
    //我发的消息
    own_list: [],
    //我接受到的消息
    recive_list: [],
    //与我有关的所有信息
    total_list: []
  },
  //用户输入消息时,将消息保存到消息对象中
  onChange(val) {
    this.setData({
      ["msgObj.msg"]: val.detail,
    })
  },
  //用于发送消息的方法
  sendSocketMessage() {
    //如果用户输入的消息不为空
    if (this.data.msgObj.msg !== "") {
      //将消息对象序列化后调用函数发送到服务器端
      wx.sendSocketMessage({
        data: JSON.stringify(this.data.msgObj)
      })

    } else { //消息为空提示输入消息
      wx.showModal({
        title: '注意',
        content: '请输入要发送的内容',
      })
    }
  },
  // 创建Socket连接
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
    //获取跳转得到的参数
    let own_openid = getApp().globalData.openId,
      recive_openid = options.recive_openid,
      msgList = options.msgList && JSON.parse(options.msgList)
    // console.log(msgList)
    console.log(options)
    console.log(own_openid,recive_openid)
    //查询mgdb数据库获得我和对方的详细信息
    db.collection("soul_user").where({
      _openid: _.in([own_openid, recive_openid])
    }).get().then(res => {
      console.log(res)
      //将我的信息和对方的信息分开存储
      let own = res.data.filter(el => el._openid === own_openid)[0],
        recive = res.data.filter(el => el._openid === recive_openid)[0]
      //如果查询失败的话返回上一页面，让用户重新进入
      if (!recive || !own) {
        wx.showModal({
          title: '错误',
          content: '加载数据失败，请重新进入',
          confirmText:"确定",
          complete(){
            wx.navigateBack({
              delta:1
            })
          }
        })  
      }
      //将用户信息保存到消息对象中
      this.setData({
        ["msgObj.own_openid"]: own_openid,
        ["msgObj.recive_openid"]: recive_openid,
        ["msgObj.own_avatar"]: own.avatar,
        ["msgObj.recive_avatar"]: recive.avatar,
        ["msgObj.own_nick"]: own.nick,
        ["msgObj.recive_nick"]: recive.nick,
      })
      // console.log(this.data.msgObj)
      //将从聊天页面的消息列表验证不为空后调用concatList将消息放入对应数组
      msgList && msgList.forEach(el => this.concatList(el))
    }).catch(err => console.log(err))
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    //监听socket的开启发生
    SocketTask.onOpen(res => {
      socketOpen = true
      console.log('监听 WebSocket 连接打开事件。', res)
    })
    //关闭
    SocketTask.onClose(onClose => {
      console.log('监听 WebSocket 连接关闭事件。', onClose)
      socketOpen = false;
    })
    //错误
    SocketTask.onError(onError => {
      console.log('监听 WebSocket 错误。错误信息', onError)
      socketOpen = false
    })
    //接收到信息
    SocketTask.onMessage(res => {
      console.log(res)
      //反序列化消息对象
      res = JSON.parse(res.data)
      console.log(res)
      //如果是新的消息
      if (res.code === 1) {
        //将消息保存到列表
        this.concatList(res.data)
      }
    })
  },
  /**
   * 将消息对象中数据放入own_list或recive_list
   */
  concatList(res) {
    // console.log(res)
    // 是我接收到信息,添加标记,存入消息列表,加载完后清空表单值
    if (res.recive_openid === this.data.msgObj.own_openid && res.own_openid === this.data.msgObj.recive_openid) {
      res.who = "recive"
      this.setData({
        total_list: this.data.total_list.concat([res]),
        ["msgObj.msg"]: ""
      })
    }
    // 是我发的信息,添加标记,存入消息列表,加载完后清空表单值
    if (res.recive_openid === this.data.msgObj.recive_openid && res.own_openid === this.data.msgObj.own_openid) {
      res.who = "own"
      this.setData({
        total_list: this.data.total_list.concat([res]),
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

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    //关闭socket
    SocketTask.close(function(close) {
      console.log('关闭 WebSocket 连接。', close)
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
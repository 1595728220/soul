// pages/otherSelf/otherSelf.js
const db = wx.cloud.database()
wx.cloud.init({
  env: 'web-test-01-eshmo'
})
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //当前访问对象的id
    _openid: null,
    //瞬间
    moment: null,
    //用户信息
    user: null,
    //关注列表
    guanzhu: [],
    //
    _id: null,
    //我是否关注
    guanzhuState: false,
    //我的id
    controlId:null
  },
  //根据时间判断是否是晚上 超过18时认为是晚上
  isMoon(time) {
    let now = new Date(parseInt(time)).getHours()
    return now > 18
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options)
    //将路由传参的值保存到变量中
    this.setData({
      _openid: options._openid,
      controlId:getApp().globalData.openId
    })
    //加载用户信息
    this.loadUser()
  },
  //查询当前查看的用户信息
  loadUser() {
    wx.showLoading({
      title: '加载中',
    })
    //查询云数据库,获取当前查看的用户的信息
    db.collection("soul_user").where({
      _openid: this.data._openid
    }).get().then(res => {
      let user = res.data[0]
      // console.log(res)
      this.setData({
        user
      })
      //加载瞬间
      this.loadMoment()
      //获取我的关注列表
      this.getGuanzhu()
    }).catch(err => console.log(err))
  },
  //加载当前访问的用户发布的所有瞬间
  loadMoment() {
    db.collection("soul").where({
      _openid: this.data._openid
    }).get().then(res => {
      // console.log(res)
      //添加用户发瞬间的时间是否在晚上
      res.data.forEach(el => {
        el.isMoon = this.isMoon(el.time)
      })
      //将瞬间保存到变量
      this.setData({
        moment: res.data
      })
      // console.log(this.data.moment)
      wx.hideLoading()
    }).catch(err => console.log(err))
  },
  //点击私聊按钮触发跳转到私聊页面
  toP2pChat() {
    wx.navigateTo({
      url: '/pages/p2pchat/p2pchat?recive_openid=' + this.data._openid,
    })
  },
  //获取我的关注列表
  getGuanzhu() {
    // console.log(getApp().globalData.openId)
    //查询云数据库，获取我的关注列表
    db.collection("soul_user").where({
      _openid: this.data.controlId
    }).get().then(res => {
      //  console.log(res)
      let guanzhu = res.data[0].guanzhu,
        guanzhuState 
      //如果当前用户在我的关注列表中
      guanzhuState = guanzhu.indexOf(this.data._openid) !== -1
      //保存到变量
      this.setData({
        guanzhu,
        //保存我的用户记录的id
        _id: res.data[0]._id,
        guanzhuState
      })
    }).catch(err => console.log(err))
  },
  //添加用户到我的关注列表
  guanzhu() {
    let guanzhu = this.data.guanzhu
    guanzhu.push(this.data._openid)
    db.collection("soul_user").doc(this.data._id).update({
      data: {
        guanzhu
      }
    }).then(res => {
      console.log(res)
      //重新获取关注列表
      this.getGuanzhu()
      //修改关注状态
      // this.updategz(true)

    }).catch(err => console.log(err))
  },
  //取消关注
  cancelguanzhu() {
    let guanzhu = this.data.guanzhu,
      index = guanzhu.indexOf(this.data._openid)
    //将用户从当前关注列表中删除
    guanzhu.splice(index, 1)
    //同步到数据库中
    db.collection("soul_user").doc(this.data._id).update({
      data: {
        guanzhu
      }
    }).then(res => {
      console.log(res)
      //重新获取关注列表
      this.getGuanzhu()
      //修改关注状态
      // this.updategz(false)
    }).catch(err => console.log(err))
  },
  // updategz(gz){
  //   let _openid = this.data._openid
  //   wx.cloud.callFunction({
  //     name:"changegz",
  //     data:{
  //       gz,
  //       _openid
  //     }
  //   }).then(res=>console.log(res)).catch(err=>console.log(err))
  // },
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
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
    _openid: null,
    moment: null,
    user: null,
    guanzhu: [],
    _id: null,
    guanzhuState: false,
    controlId:null
  },
  isMoon(time) {
    let now = new Date(parseInt(time)).getHours()
    return now > 18
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options)

    this.setData({
      _openid: options._openid,
      controlId:getApp().globalData.openId
    })
    this.loadUser()
  },
  loadUser() {
    wx.showLoading({
      title: '加载中',
    })
    db.collection("soul_user").where({
      _openid: this.data._openid
    }).get().then(res => {
      let user = res.data[0]
      // console.log(res)
      this.setData({
        user
      })
      this.loadMoment()
      this.getGuanzhu()
    }).catch(err => console.log(err))
  },
  loadMoment() {
    db.collection("soul").where({
      _openid: this.data._openid
    }).get().then(res => {
      // console.log(res)
      res.data.forEach(el => {
        el.isMoon = this.isMoon(el.time)
      })
      this.setData({
        moment: res.data
      })
      // console.log(this.data.moment)
      wx.hideLoading()
    }).catch(err => console.log(err))
  },
  toP2pChat() {
    wx.navigateTo({
      url: '/pages/p2pchat/p2pchat?_openid=' + this.data._openid,
    })
  },
  //获取关注列表
  getGuanzhu() {
    // console.log(getApp().globalData.openId)
    db.collection("soul_user").where({
      _openid: this.data.controlId
    }).get().then(res => {
      //  console.log(res)
      let guanzhu = res.data[0].guanzhu,
        guanzhuState 
      guanzhuState = guanzhu.indexOf(this.data._openid) !== -1
      this.setData({
        guanzhu,
        _id: res.data[0]._id,
        guanzhuState
      })
    }).catch(err => console.log(err))
  },
  guanzhu() {
    let guanzhu = this.data.guanzhu
    guanzhu.push(this.data._openid)
    db.collection("soul_user").doc(this.data._id).update({
      data: {
        guanzhu
      }
    }).then(res => {
      console.log(res)
      this.getGuanzhu()
      this.updategz(true)

    }).catch(err => console.log(err))
  },
  cancelguanzhu() {
    let guanzhu = this.data.guanzhu,
      index = guanzhu.indexOf(this.data._openid)
    guanzhu.splice(index, 1)
    db.collection("soul_user").doc(this.data._id).update({
      data: {
        guanzhu
      }
    }).then(res => {
      console.log(res)
      this.getGuanzhu()
      this.updategz(false)
    }).catch(err => console.log(err))
  },
  updategz(gz){
    let _openid = this.data._openid
    wx.cloud.callFunction({
      name:"changegz",
      data:{
        gz,
        _openid
      }
    }).then(res=>console.log(res)).catch(err=>console.log(err))
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
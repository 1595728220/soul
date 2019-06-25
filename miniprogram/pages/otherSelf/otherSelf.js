// pages/otherSelf/otherSelf.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _openid: null,
    moment: null,
    user: null
  },
  isMoon(time) {
    let now = new Date(parseInt(time)).getHours()
    return now > 18
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      _openid: options._openid
    })
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
    }).catch(err => console.log(err))
  },
  loadMoment() {
    db.collection("soul").where({
      _openid: this.data._openid
    }).get().then(res => {
      console.log(res)
      res.data.forEach(el => {
        el.isMoon = this.isMoon(el.time)
      })
      this.setData({
        moment: res.data
      })
      console.log(this.data.moment)
      wx.hideLoading()
    }).catch(err => console.log(err))
  },
  toP2pChat(){
    wx.navigateTo({
      url: '/pages/p2pchat/p2pchat?_openid='+this.data._openid,
    })
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
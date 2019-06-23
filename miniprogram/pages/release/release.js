// pages/release/release.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message: "",
    controlHidden: false,
    tempFilePaths: [],
    fileID:[]
  },
  showControl() {
    this.setData({
      controlHidden: false
    })
  },
  remove(e) {
    let arr = this.data.tempFilePaths,
      index = e.target.dataset.index
    arr.splice(index, 1)
    this.setData({
      tempFilePaths: arr
    })
  },
  hiddenControl() {
    this.setData({
      controlHidden: true
    })
  },
  getImg() {
    if (this.data.tempFilePaths.length >= 5) {
      wx.showModal({
        title: '最多添加五张图片',
      })
      return
    }
    wx.chooseImage({
      count: 5,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: res => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = this.data.tempFilePaths.concat(res.tempFilePaths)
        // console.log(tempFilePaths)
        this.setData({
          tempFilePaths
        })
      }
    })
  },
  getCamero() {
    if (this.data.tempFilePaths.length >= 5) {
      wx.showModal({
        title: '最多添加三张图片',
      })
      return
    }
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ["camera"],
      success: res => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = this.data.tempFilePaths.concat(res.tempFilePaths)
        console.log(tempFilePaths)
        this.setData({
          tempFilePaths
        })
      }
    })
  },
  upload() {
    wx.showLoading({
      title: '上传中',
    })
    let imgUrl = this.data.tempFilePaths
    imgUrl = imgUrl.map(el => {
      let suffix = el.match(/.\w+$/)[0]
      return new Promise((resolve) => {
        console.log("上传图片")
        wx.cloud.uploadFile({
          cloudPath: `${new Date().getTime()}${parseInt(Math.random() * 1000)}${suffix}`,
          filePath: el,
          success:res=>{
            let fileID = this.data.fileID
            fileID.push(res.fileID)
            this.setData({
              fileID
            })
            resolve()
          },
          fail:err=>console.log(err)
        })
      })
    })
    
    Promise.all(imgUrl).then(()=>{
      console.log(this.data.message)
      console.log(this.data.fileID)
      db.collection("soul").add({
        data:{
          avatar: getApp().globalData.userInfo.avatarUrl,
          content:this.data.message,
          fenxiangcount:0,
          gz:"true",
          msgcount:0,
          nick: getApp().globalData.userInfo.nickName,
          time:new Date().getTime(),
          tj:true,
          xihuan:false,
          xihuancount:0,
          zx:true,
          img:this.data.fileID
        }
      }).then(res=>{
        wx.hideLoading()
        wx.showToast({
          title: '发布成功',
        })
        this.setData({
          message:"",
          tempFilePaths:[],
          fileID:[]
        })
      }).catch(err=>{
        wx.hideLoading()
        wx.showToast({
          title: '发布失败',
        })
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
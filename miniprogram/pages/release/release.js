// pages/release/release.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message: "",
    //按钮是否隐藏
    controlHidden: false,
    //用户选择的图片列表
    tempFilePaths: [],
    //云存储中图片id
    fileID:[]
  },
  //显示按钮
  showControl() {
    this.setData({
      controlHidden: false
    })
  },
  //隐藏按钮
  hiddenControl() {
    this.setData({
      controlHidden: true
    })
  },
  //删除不要的图片
  remove(e) {
    let arr = this.data.tempFilePaths,
      index = e.target.dataset.index
    arr.splice(index, 1)
    this.setData({
      tempFilePaths: arr
    })
  },
  //点击图片触发获取要上传的图片的事件
  getImg() {
    //如果保存的图片数量已经超过5张就提示超出，并不保存图片
    if (this.data.tempFilePaths.length >= 5) {
      wx.showModal({
        title: '最多添加五张图片',
      })
      return
    }
    //将选中的图片保存到图片列表变量中
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
  //点击相机按钮，触发获取要上传的图片的事件
  getCamero() {
    if (this.data.tempFilePaths.length >= 5) {
      wx.showModal({
        title: '最多添加五张图片',
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
  //点击发布按钮触发的上传图片到云存储的事件
  upload() {
    wx.showLoading({
      title: '上传中',
    })
    //本地化待上传图片列表
    let imgUrl = this.data.tempFilePaths
    //将图片列表封装成promise对象
    imgUrl = imgUrl.map(el => {
      //获取当前图片的下标
      let suffix = el.match(/.\w+$/)[0]
      return new Promise((resolve) => {
        console.log("上传图片")
        //图片上传到云存储
        wx.cloud.uploadFile({
          //保存的文件名
          cloudPath: `${new Date().getTime()}${parseInt(Math.random() * 1000)}${suffix}`,
          //要上传的图片名
          filePath: el,
          //成功后将保存的图片的id保存到变量中
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
    //同时执行上传图片的promise对象数组
    Promise.all(imgUrl).then(()=>{
      //当所有图片都上传成功
      console.log(this.data.message)
      console.log(this.data.fileID)
      //将瞬间内容保存到云数据库
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
        //初始化用户的输入值
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
// pages/star/star.js
const gl = require("../../miniprogram_npm/gl-matrix/index.js"),
  ctx = wx.createCanvasContext('stage')
let m,p,v, points = [],
  numOfPoints = 10000,
  timer
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: "",
    windowWidth: ""
  },
  init() {
    // create points
    for (let i = 0; i < numOfPoints; i++) {
      points = points.concat(this.randomPoint())
    }
    let eye,center,up
    p = gl.mat4.create()
    gl.mat4.perspective(p, 30, this.data.windowWidth / this.data.windowHeight, 0, 100);
    v = gl.mat4.create()
    eye = gl.vec3.fromValues(1, 1, -2)
    center = gl.vec3.fromValues(0, 0, 0)
    up = gl.vec3.fromValues(0, 1, 0)
    gl.mat4.lookAt(v, eye, center, up);
    // create model matrix
    m = gl.mat4.create()
  },
  loop() {
    // console.log("定时绘制")
    // create pvm matrix
    var vm = gl.mat4.create();
    gl.mat4.multiply(vm, v, m);
    var pvm = gl.mat4.create();
    gl.mat4.multiply(pvm, p, vm);
    // rotate sphere by rotate its model matrix
    gl.mat4.rotateY(m, m, Math.PI / 180);
    ctx.clearRect(0, 0, this.data.windowWidth, this.data.windowHeight)
    ctx.save();
    ctx.translate(this.data.windowWidth / 2, this.data.windowHeight / 2);
    // draw points
    for (var i = 0; i < numOfPoints; i++) {
      ctx.beginPath()
      var point = gl.vec3.fromValues(points[i].x, points[i].y, points[i].z);
      // calculate color by depth
      var localPoint = gl.vec3.create();
      gl.vec3.transformMat4(localPoint, point, m);
      ctx.setFillStyle("rgba(39,120,123," + ((1 - localPoint[2]) / 2) + ")");
      ctx.setStrokeStyle("#aaa")
      // calculate point size
      var pSize = (1 - localPoint[2]) * 0.5;
      // calculate screen position by apply pvm matrix to point
      var screenPoint = gl.vec3.create();
      gl.vec3.transformMat4(screenPoint, point, pvm);
      // draw point
      ctx.arc(screenPoint[0] * this.data.windowWidth / 2, screenPoint[1] * this.data.windowHeight / 2, pSize, 0, 2 * Math.PI);
      ctx.fill()
      // ctx.stroke()
    }
    ctx.draw()

    ctx.restore();
    let tmp = this.loop
    timer = setTimeout(() => {
      this.loop()
    }, 500);
  },
  randomPoint() {
    //三维球面上的Marsaglia 方法
    let u, v, rpow
    do {
      u = Math.random() * 2 - 1
      v = Math.random() * 2 - 1
      rpow = u * u + v * v
    } while (rpow > 1)
    return {
      x: 2 * u * Math.sqrt(1 - rpow),
      y: 2 * v * Math.sqrt(1 - rpow),
      z: 1 - 2 * rpow
    }
    //生成两个随机分布的角度，并且按照球坐标的形式产生
    // var theta = 2 * Math.random() * Math.PI;
    // // var phi = 2 * Math.asin(Math.sqrt(Math.random()));
    // var phi = Math.random() * Math.PI
    // return {
    //   x: Math.sin(phi) * Math.cos(theta),
    //   y: Math.sin(phi) * Math.sin(theta),
    //   z: Math.cos(phi)
    // }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getSystemInfo({
      success: res => {
        // 屏幕宽度、高度
        this.setData({
          windowHeight:  res.windowHeight,
          windowWidth: res.windowWidth
        })
        this.init()
      }
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
    this.loop()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    clearTimeout(timer)
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
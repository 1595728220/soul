// pages/star/star.js
const gl = require("../../miniprogram_npm/gl-matrix/index.js"),
  ctx = wx.createCanvasContext('stage')
let m, p, v, eye, center, up, points = [],
  halfWidth = 150,
  halfHeight = 250,
  numOfPoints = 100
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  init() {

    // create points
    for (let i = 0; i < numOfPoints; i++) {
      // this.setData({
      //   points: this.data.points.concat(this.randomPoint())
      // })
      points = points.concat(this.randomPoint())
    }
    // // create perspective matrix
    // this.setData({
    //   p: gl.mat4.create(),
    // });
    p = gl.mat4.create()
    gl.mat4.perspective(p, 30, halfWidth / halfHeight, 0, 100);

    // // create view matrix
    // this.setData({
    //   v: gl.mat4.create(),
    //   eye: gl.vec3.fromValues(1, 1, -2),
    //   center: gl.vec3.fromValues(0, 0, 0),
    //   up: gl.vec3.fromValues(0, 1, 0)
    // })
    v = gl.mat4.create()
    eye = gl.vec3.fromValues(1, 1, -2)
    center = gl.vec3.fromValues(0, 0, 0)
    up = gl.vec3.fromValues(0, 1, 0)
    gl.mat4.lookAt(v, eye, center, up);
    console.log(gl.mat4.create())
    // create model matrix
    // this.setData({
    //   m: gl.mat4.create(),
    // })
    m = gl.mat4.create()
  },
  randomPoint() {
    var theta = 2 * Math.random() * Math.PI;
    var phi = 2 * Math.asin(Math.sqrt(Math.random()));
    return {
      x: Math.sin(phi) * Math.cos(theta),
      y: Math.sin(phi) * Math.sin(theta),
      z: Math.cos(phi)
    }
  },
  loop() {
    console.log("定时绘制")
    // create pvm matrix
    var vm = gl.mat4.create();
    gl.mat4.multiply(vm, v, m);
    var pvm = gl.mat4.create();
    gl.mat4.multiply(pvm, p, vm);
    // rotate sphere by rotate its model matrix
    gl.mat4.rotateY(m, m, Math.PI / 180);
    // clear screen
    // ctx.setFillStyle("#FFFFFF");
    // ctx.rect(0, 0, 2 * halfWidth, 2 * halfHeight);
    ctx.clearRect(0, 0, 2 * halfWidth, 2 * halfHeight)
    ctx.save();
    ctx.translate(halfWidth, halfHeight);
    // draw center
    // ctx.setFillStyle("#FF0000")
    // ctx.rect(0, 0, 5, 5);

    // draw points
    for (var i = 0; i < numOfPoints; i++) {
      ctx.beginPath()
      var point = gl.vec3.fromValues(points[i].x, points[i].y, points[i].z);

      // calculate color by depth
      var localPoint = gl.vec3.create();
      gl.vec3.transformMat4(localPoint, point, m);
      ctx.setFillStyle("rgba(0,0,0," + ((1 - localPoint[2]) / 2) + ")");

      // calculate point size
      var pSize = (1 - localPoint[2]) * 3;

      // calculate screen position by apply pvm matrix to point
      var screenPoint = gl.vec3.create();
      gl.vec3.transformMat4(screenPoint, point, pvm);
      console.log(pSize)
      // draw point
      ctx.arc(screenPoint[0] * halfWidth, screenPoint[1] * halfHeight, pSize, 0, 2 * Math.PI);
      // ctx.rect(screenPoint[0] * halfWidth, screenPoint[1] * halfHeight, pSize, pSize);
      ctx.fill()
    }
    ctx.draw()

    ctx.restore();
    let tmp = this.loop
    setTimeout(() => {
      this.loop()
    }, 60);
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
    this.init()
    this.loop()
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
// pages/star/star.js
const gl = require("../../miniprogram_npm/gl-matrix/index.js")
let m, p, v, points = []
Page({
  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: "",
    windowWidth: "",
    initFinish: false,
    numOfPoints: 0,
    timer: null
  },
  //当用户点击星球触发的时间
  clickStar(e){
    //获取鼠标的位置
    let {x,y} = e.detail
    console.log(x,y)
    points.forEach(el=>{
      console.log(el.ex,el.ey)
      //计算鼠标点击位置与圆心的距离
      let juli = this.juli(x,y,el.ex,el.ey)
      // console.log(juli)
      if(juli < el.er + 20 && el.opa > 0.3){
        console.log("捕捉点击的点")
        //跳转到对应的用户
        wx.navigateTo({
          url: '/pages/otherSelf/otherSelf?_openid='+el._openid,
        })
      }
    })
    console.log("用户点击")
  },
  //计算距离的方法，返回距离
  juli(x1,y1,x2,y2){
    let {sqrt,pow} = Math
    return sqrt(pow(x1-x2,2)+pow(y1-y2,2))
  },
  //初始化数据
  init() {
    return new Promise(resolve => {
      console.log("获取所有用户列表")
      wx.cloud.database().collection("soul_user").get().then(res => {
        // console.log(res.data)
        points = res.data
        //保存当前用户数量
        this.setData({
          numOfPoints: points.length
        })
        // create points
        for (let i = 0; i < this.data.numOfPoints; i++) {
          let tmpObj = this.randomPoint()
          // console.log(points)
          Object.assign(points[i], tmpObj)
        }

        let eye, center, up
        this.setData({
          ctx: wx.createCanvasContext('stage')
        })
        p = gl.mat4.create()
        gl.mat4.perspective(p, 30, this.data.windowWidth / this.data.windowHeight, 0, 100);
        v = gl.mat4.create()
        eye = gl.vec3.fromValues(1, 1, -2)
        center = gl.vec3.fromValues(0, 0, 0)
        up = gl.vec3.fromValues(0, 1, 0)
        gl.mat4.lookAt(v, eye, center, up);
        // create model matrix
        m = gl.mat4.create()
        this.setData({
          initFinish: true
        })
        console.log("数据初始化完成")
        resolve()
      }).catch(err => console.log(err))
    })

  },
  //循环绘制点和文字
  loop() {
    // console.log("定时绘制")
    let ctx = this.data.ctx
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
    // draw center 
    ctx.beginPath()
    ctx.setFillStyle("#1f1f1f");
    ctx.arc(0, 0, 5, 0, 2 * Math.PI)
    ctx.fill()
    // draw points
    for (var i = 0; i < this.data.numOfPoints; i++) {
      ctx.beginPath()
      var point = gl.vec3.fromValues(points[i].x, points[i].y, points[i].z);
      // calculate color by depth
      var localPoint = gl.vec3.create();
      gl.vec3.transformMat4(localPoint, point, m);
      ctx.setFillStyle("rgba(39,120,123," + ((1 - localPoint[2]) / 2) + ")");
      ctx.setStrokeStyle("#aaa")
      // calculate point size
      var pSize = (1 - localPoint[2]) * 3;
      // calculate screen position by apply pvm matrix to point
      var screenPoint = gl.vec3.create();
      gl.vec3.transformMat4(screenPoint, point, pvm);
      // draw point
      ctx.arc(screenPoint[0] * this.data.windowWidth / 2, screenPoint[1] * this.data.windowHeight / 2, pSize, 0, 2 * Math.PI);
      points[i].ex = (1+screenPoint[0]) * this.data.windowWidth / 2
      points[i].ey = (1+screenPoint[1]) * this.data.windowHeight / 2
      points[i].er = pSize
      points[i].opa = (1 - localPoint[2]) / 2
      ctx.fill()
      //draw text
      ctx.setFontSize(12)
      ctx.fillText(points[i].nick, screenPoint[0] * this.data.windowWidth / 2 - 3 * points[i].nick.length, screenPoint[1] * this.data.windowHeight / 2 - 10,100)
      // ctx.stroke()
    }
    ctx.draw()

    ctx.restore();
    let timer = setTimeout(() => {
      this.loop()
    }, 60);
    this.setData({
      timer
    })
  },
  //生成均匀分布的坐标点
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
        this.init().then(this.loop)
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
    if (this.data.initFinish) {
      console.log("开始绘制")
      this.loop()

    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log("结束绘制")
    clearTimeout(this.data.timer)
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
// components/squareitem/squareitem.js
const db = wx.cloud.database();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    xihuan: [],
    localItem: {},
    count: 0
  },
  /*组件的的生命周期也可以在 lifetimes 字段内进行声明*/

  lifetimes: {
    attached: function() {
      this.setData({
        localItem: this.data.item,
        count: this.data.item.xihuan.filter(el => {
          return el.value
        }).length
      })
      let localItem = this.data.localItem
      //在组件实例刚刚被创建时执行
      let xihuan = this.data.localItem.xihuan.filter(el => {
        // console.log(el._openid)
        return el._openid === getApp().globalData.openId
      })
      // console.log(xihuan)
      if (xihuan.length === 0) {
        xihuan = [{
          _openid: getApp().globalData.openId,
          value: false
        }]
        localItem.xihuan = localItem.xihuan.concat(xihuan)
        this.setData({
          localItem
        })
      }
      this.setData({
        xihuan
      })
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toOtherSelf() {
      wx.navigateTo({
        url: '/pages/otherSelf/otherSelf?_openid=' + this.data.item._openid,
      })
    },
    changeXiHuan() {
      // console.log(this.data.item)
      let {
        xihuan,
        _id: _id
      } = this.data.localItem

      xihuan.forEach(el => {
        if (el._openid === getApp().globalData.openId) {
          el.value = !el.value
        }
      })
      console.log(xihuan)

      this.setData({
        xihuan: xihuan.filter(el=>{
          return el._openid === getApp().globalData.openId
        }),
        count: xihuan.filter(el => {
          return el.value
        }).length
      })
      // console.log(xihuan)
      wx.cloud.callFunction({
        name: "changexihuan",
        data: {
          xihuan,
          _id,
        }
      }).then(res => {
        res.result.stats.updated !== 0 && this.triggerEvent('myEvent')
      }).catch(err => console.log(err))

    },
    pinglun() {
      console.log("去评论")
      let url = `/pages/comment/comment?id=${this.data.item._id}`
      wx.navigateTo({
        url
      })
    },
    fenxiang() {
      console.log("去分享")
      let url = `/pages/share/share?id=${this.data.item._id}`
      wx.navigateTo({
        url
      })
    }
  }
})
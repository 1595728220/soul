// components/squareitem/squareitem.js
const db = wx.cloud.database();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

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
        _id: _id,
        xihuancount: count
      } = this.data.item
      wx.cloud.callFunction({
        name:"changexihuan",
        data:{
          xihuan,
          _id,
          count
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
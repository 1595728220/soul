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
    changeXiHuan(e) {
      let {
        xihuan,
        _id: id,
        xihuancount: count
      } = this.data.item

      xihuan ? count-- : count++
        // console.log(xihuan, id, count)

        db.collection("soul").doc(id).update({
          data: {
            xihuan: !xihuan,
            xihuancount: count
          }
        }).then(res => {
          console.log(res)
          if (res.stats.updated !== 0) {
            // console.log(111)
            this.triggerEvent('myEvent')
          }
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
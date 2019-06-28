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
        //喜欢该瞬间的用户列表
        localItem: this.data.item,
        //喜欢该瞬间的用户数量
        count: this.data.item.xihuan.filter(el => {
          return el.value
        }).length
      })
      let localItem = this.data.localItem
      // 取出我的喜欢信息对象
      let xihuan = this.data.localItem.xihuan.filter(el => {
        // console.log(el._openid)
        return el._openid === getApp().globalData.openId
      })
      // console.log(xihuan)
      //如果我没有喜欢该瞬间
      if (xihuan.length === 0) {
        //初始化喜欢对象
        xihuan = [{
          _openid: getApp().globalData.openId,
          value: false
        }]
        //添加到该瞬间的喜欢状态列表
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
    //跳转到个人页面的方法
    toOtherSelf() {
      wx.navigateTo({
        url: '/pages/otherSelf/otherSelf?_openid=' + this.data.item._openid,
      })
    },
    //修改喜欢状态
    changeXiHuan() {
      // console.log(this.data.item)
      let {
        xihuan,
        _id: _id
      } = this.data.localItem
      //在该瞬间的喜欢的用户列表中修改我的喜欢状态
      xihuan.forEach(el => {
        if (el._openid === getApp().globalData.openId) {
          el.value = !el.value
        }
      })
      console.log(xihuan)

      // console.log(xihuan)
      //调用云函数修改喜欢该瞬间用的户列表
      wx.cloud.callFunction({
        name: "changexihuan",
        data: {
          xihuan,
          _id,
        }
      }).then(res => {
        //触发父组件的事件重新获取瞬间列表
        res.result.stats.updated !== 0 && this.triggerEvent('myEvent')
        this.setData({
          xihuan: xihuan.filter(el => {
            return el._openid === getApp().globalData.openId
          }),
          count: xihuan.filter(el => {
            return el.value
          }).length
        })
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
// components/squarebanner/squarebanner.js
const db = wx.cloud.database();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    listkey: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    loadMsg() {
      let wherequery = {}
      switch (this.data.listkey) {
        case "关注":
          wherequery = {
            gz: true
          }
          break;
        case "最新":
          wherequery = {
            zx: true
          }
          break;
        default:
          wherequery = {
            tj: true
          }
      }
      db
        .collection("soul")
        .where(wherequery)
        .get().then(res => {
          // console.log(res)
          this.setData({
            list: res.data
          })
          // console.log(this.data.list)
        })
        .catch(err => console.log(err))
    }
  },
  /*组件的的生命周期也可以在 lifetimes 字段内进行声明*/
  lifetimes: {
    created: function() {
      //在组件实例刚刚被创建时执行
      this.loadMsg()
    },
  }
})
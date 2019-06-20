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
      //显示加载中
      wx.showLoading({
        title: '加载中',
      })
      //创建查询条件的对象
      let wherequery = {}
      //根据关键词不同添加对应的条件参数
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
      //根据请求参数请求集合soul获取用户的瞬间内容
      db
        .collection("soul")
        .where(wherequery)
        .get().then(res => {
          // console.log(res)
          //保存查询结果到data的list属性中
          this.setData({
            list: res.data
          })
          // console.log(this.data.list)
          //加载完成
          wx.hideLoading()
        })
        .catch(err =>{
          console.log(err)
          //加载完成
          wx.hideLoading()
        } )
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
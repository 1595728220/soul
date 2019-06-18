// components/squareitem/squareitem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object
    }
  },
  getTime(time) {
    console.log(111)
    let now = new Date().getTime(),
      del = Math.floor((now - time) / 1000)
    if (del < 60) return `${del}秒前`
    else if (del < 60 * 60) return `${Math.floor(del / 60)}分钟前`
    else if (del < 60 * 60 * 24) return `${Math.floor(del / 3600)}小时前`
    else return `${Math.floor(del / 3600 / 24)}天前`
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

  }
})
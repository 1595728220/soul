// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = (event, context) => {
  const wxContext = cloud.getWXContext()
  let {
    gz,_openid
  } = event, mySoul_id
  db.collection("soul").where({
    _openid
  }).get().then((res) => {
    mySoul_id = res.data.map(el => {
      new Promise((resolve)=>{
        db.collection("soul").doc(el._id).update({
          data: {
            gz
          }
        })
      }) 
    })
    return  Promise.all(mySoul_id).then(()=>{
      return "更新完成"
    })

  })

}
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  let {
    xihuan,
    _id,
    count
  } = event
  xihuan ? count-- : count++
    // console.log(xihuan, id, count)
    try {
      return await db.collection("soul").doc(_id).update({
        data: {
          xihuan: !xihuan,
          xihuancount: count
        }
      })
    } catch (err) { console.log(err)}
}
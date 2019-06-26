const express = require('express');
const pool = require("./pool.js")
let app = express();
const WebSocket = require('ws');
let wss = new WebSocket.Server({
  port: 8181
}); // 小程序 connectSocket的url地址
// 模拟数据

wss.on('connection', function(ws) {
  console.log('client connected')
  ws.on('message', function(message) {
    console.log(message)
    let {
      own_openid,
      recive_openid,
      msg
    }
    let now = new Date().getTime()
    let sql = "insert into chat values(null,?,?,?,?)"
    pool.query(sql, [own_openid, recive_openid, msg, now], (err, result) => {
      if (err) throw err
      if (result.affectedRow > 0) {
        ws.send({
          code: 1,
          msg: "有新消息",
          data: {
            own_openid,
            recive_openid,
            msg,
            now
          }
        })
      }
    })
  })
})

app.listen(3000, function() {
  console.log('listen 3000')
})
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
    message = JSON.parse(message)
    let {
      own_openid,
      recive_openid,
      msg,
      own_avatar,
      recive_avatar,
      own_nick,
      recive_nick
    } = message

    let now = new Date().getTime()
    let sql = "insert into chat values(null,?,?,?,?,?,?,?,?)"
    pool.query(sql, [own_openid, recive_openid, msg, now, own_avatar, recive_avatar, own_nick,recive_nick], (err, result) => {
      if (err) throw err
      console.log(result)
      console.log(ws.send)
      if (result.affectedRows > 0) {
        console.log("添加消息完成即将转发")
        let tmp = {
          code: 1,
          msg: "有新消息",
          data: {
            own_openid,
            recive_openid,
            msg,
            now,
            own_avatar,
            recive_avatar,
            own_nick,
            recive_nick
          }
        }
        tmp = JSON.stringify(tmp)
        wss.clients.forEach((client) =>{
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(tmp);
          }
        });
      }
    })
  })
  sql = "select * from chat"
  pool.query(sql, (err, result) => {
    if (err) throw err
    let tmp = {
      code: 2,
      msg: "首次加载所有信息",
      data: result
    }
    tmp = JSON.stringify(tmp)
    ws.send(tmp)
  })
})

app.listen(3000, function() {
  console.log('listen 3000')
})
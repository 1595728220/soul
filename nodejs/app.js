const express = require('express');
const pool = require("./pool.js")
let app = express();
const WebSocket = require('ws');
let wss = new WebSocket.Server({
  port: 8181
}); // 小程序 connectSocket的url地址
// 模拟数据

wss.on('connection', function (ws) {
  console.log('client connected')
  ws.on('message', function (message) {
    console.log(message)
  })
  ws.send("揍你")
})

app.listen(3000, function() {
  console.log('listen 3000')
})
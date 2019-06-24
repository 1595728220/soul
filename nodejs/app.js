var express = require('express');
var app = express();
var ws = require('ws').Server;
var wss = new ws({port: 8181});      // 小程序 connectSocket的url地址
// 模拟数据

wss.on('connection', function (ws) {
    console.log('client connected')
    ws.on('message', function (message) {
//        let obj = JSON.parse(message)
//        if (obj.cmd == 'excans') {
//            wss.clients.forEach(function (client) {        // wss.clients表示连接的所有客户端socket
//                let data = JSON.stringify(obj)
//                client.send(data)
//            })
//        } else if (obj.cmd == 'reqq') {
//            let index = obj.index
//            wss.clients.forEach(function (client) {
//                let data = JSON.stringify(subjects[index])
//                client.send(data)
//            })
//        }
		console.log(message)
		wss.client.send("走你")
    })
})

app.listen(3000, function () {
    console.log('listen 3000')
})
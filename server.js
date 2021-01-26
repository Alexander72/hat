const express = require('express')
const app = express()
const enableWs = require('express-ws')(app)

app.use(express.static('public'));
let sockets = [];

app.ws('/ws', (ws, req) => {
	sockets[req.ip] = ws;
    ws.on('message', msg => {
    	console.log(req.headers);
    	console.log(req.ip);
    	console.log(req.connection.remoteAddress);
    	for (let ip in sockets) {
    		if (req.ip != ip) {
				sockets[ip].send(msg);
			}
    	}
    })

    ws.on('close', () => {
        console.log('WebSocket was closed')
    })
})

app.listen(3000)
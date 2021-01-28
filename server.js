const express = require('express')
const app = express()
const GameMessageHandler = require('./app/Handlers/GameMessageHandler.js');

require('express-ws')(app)

app.use(express.static('public'));

app.post('/game', (req, res) => {

})

app.ws('/ws/game/:gameId', (ws, req) => {
	let messageHandler = new GameMessageHandler(req, ws);
    ws.on('message', msg => {
		console.log('Message received');
    	try {
			messageHandler.handle(msg);
		} catch (e) {
			ws.send(e.toString());
		}
    })

    ws.on('close', () => {
        console.log('WebSocket was closed')
    })
})

app.listen(3000)
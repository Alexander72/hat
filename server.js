const express = require('express')
const app = express()

const GameMessageHandler = require('./app/Handlers/GameMessageHandler.js');
const GameRepository = require('./app/Repositories/GameRepository.js');

const gameRepository = new GameRepository();

require('express-ws')(app)

app.use(express.static('public'));

app.post('/game', (req, res) => {

})

app.ws('/ws/game/:gameId', (ws, req) => {
	const messageHandler = new GameMessageHandler(req, ws, gameRepository);
    ws.on('message', msg => {
    	try {
			messageHandler.handle(msg);
		} catch (e) {
			ws.send(e.toString());
		}
    })

    ws.on('close', () => {
		messageHandler.disconnected();
    })
})

app.listen(3000)
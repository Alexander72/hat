const express = require('express')
const app = express()

const PlayerMessageHandler = require('./app/Handlers/PlayerMessageHandler.js');
const GameRepository = require('./app/Repositories/GameRepository.js');
const GameNotificator = require('./app/Services/GameNotificator.js');

// Singletons
const gameRepository = new GameRepository();
const gameNotificator = new GameNotificator();

// Setup Application
require('express-ws')(app)
app.use(express.static('public'));

// Routes
app.post('/game', (req, res) => {

})

// WebSocket routes
app.ws('/ws/game/:gameId', (ws, req) => {
	const playerMessageHandler = new PlayerMessageHandler(req, ws, gameRepository,gameNotificator);
    ws.on('message', msg => {
    	try {
			playerMessageHandler.handle(msg);
		} catch (e) {
			ws.send(e.toString());
		}
    })

    ws.on('close', () => {
		playerMessageHandler.disconnected();
    })
})

app.listen(3000)
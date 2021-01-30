const express = require('express')
const app = express()

const CreateGameHandler = require('./app/Handlers/CreateGameHandler.js');
const GetCreateGamePageHandler = require('./app/Handlers/GetCreateGamePageHandler.js');
const GetGamePageHandler = require('./app/Handlers/GetGamePageHandler.js');

const PlayerMessageHandler = require('./app/Handlers/PlayerMessageHandler.js');

const GameRepository = require('./app/Repositories/GameRepository.js');
const GameNotificator = require('./app/Services/GameNotificator.js');

// Singletons
const gameRepository = new GameRepository();
const gameNotificator = new GameNotificator();

// Setup Application
require('express-ws')(app)
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))

// Routes
app.get('/create-game', (req, res) => {
	(new GetCreateGamePageHandler()).handle(req, res);
})

app.post('/create-game', (req, res) => {
	(new CreateGameHandler(gameRepository)).handle(req, res);
})

app.get('/game/:gameId', (req, res) => {
	(new GetGamePageHandler()).handle(req, res);
})

// WebSocket routes
app.ws('/ws/game/:gameId', (ws, req) => {
	try {
		const playerMessageHandler = new PlayerMessageHandler(req, ws, gameRepository,gameNotificator);

		ws.on('message', msg => {
			console.log('Received message: ' + msg);
			try {
				playerMessageHandler.handle(msg);
			} catch (e) {
				ws.send(e.toString());
			}
		})

		ws.on('close', () => {
			playerMessageHandler.disconnect();
		})
	} catch (e) {
		console.error(e);
	}
})

app.listen(3000)
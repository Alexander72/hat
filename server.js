const dotenv = require('dotenv')
const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
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
dotenv.config();
require('express-ws')(app)
app.set('trust proxy', 1)
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))
app.use(session({
	secret: process.env.APP_KEY,
	store: new MongoStore({ url: process.env.MONGODB_URL })
}));

// Routes
app.get('/create-game', (req, res) => {
	(new GetCreateGamePageHandler()).handle(req, res);
})

app.post('/create-game', (req, res) => {
	(new CreateGameHandler(gameRepository)).handle(req, res);
})

app.get('/game/:gameId', (req, res) => {
	(new GetGamePageHandler(gameRepository)).handle(req, res);
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
				ws.send(e.toString() + e.stack);
			}
		})

		ws.on('close', () => {
			playerMessageHandler.disconnect();
		})
	} catch (e) {
		ws.on('message', msg => {
			ws.send(e.toString());
		});
	}
})

let dbClient;
MongoClient.connect(process.env.MONGODB_URL, function(err, db) {
	if (err) {
		return console.log(err);
	}

	dbClient = db;
	app.locals.mongoDB = db;
	gameRepository.mongoDB = db.db();

	app.listen(3000, function(){
		console.log("Express is ready to handle connections...");
	});
});
process.on("SIGINT", () => {
	dbClient.close();
	process.exit();
});
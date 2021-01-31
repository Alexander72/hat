const Game = require('../models/Game.js');
const Settings = require('../models/Settings.js');

class CreateGameHandler {
    gameRepository;

    constructor(gameRepository) {
        this.gameRepository = gameRepository;
    }

    handle(req, res) {
        const settings = new Settings();
        settings.playersCount = req.body.playersCount;
        settings.wordsPerPlayer = req.body.wordsPerPlayer;
        settings.turnDurationInMilliseconds = req.body.turnDurationInSeconds * 1000;

        const game = new Game(req.body.title, settings);
        this.gameRepository.createGame(game, settings);

        res.redirect(`/game/${game.id}`);
    }
}

module.exports = CreateGameHandler;
const Game = require("../Models/Game");
const Settings = require("../Models/Settings");

class GameRepository {
    games = [];
    mongoDB;

    createGame(game) {
        game.id = Math.random().toString(36).substring(2, 12);
        this.games[game.id] = game;
        this.mongoDB.collection('games').insertOne(game.getData());
    }

    updateGame(game) {
        if (!game.id) {
            throw new Error('Game without id, unable to update.');
        }
        this.games[game.id] = game;
    }

    deleteGameById(gameId) {
        this.games.splice(gameId, 1);
    }

    getGameById(gameId) {
        if (this.games[gameId]) {
            return this.games[gameId];
        }

        const gameData = this.mongoDB.collection('games').findOne({id: gameId});

        if (!gameData) {
            throw new Error(`Game with id '${gameId}' not found.`);
        }

        // todo fill all the data
        this.games[gameId] = new Game(gameData.title, Object.assign(new Settings(), gameData.settings));

        return this.games[gameId];
    }
}

module.exports = GameRepository;
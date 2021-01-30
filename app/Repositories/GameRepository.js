class GameRepository {
    games = [];

    createGame(game) {
        const id = Math.round(Math.random() * 100000);
        game.id = id;
        this.games[id] = game;

        return id;
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

        throw new Error(`Game with id '${gameId}' not found.`);
    }
}

module.exports = GameRepository;
const ErrorMessage = require('./ErrorMessage.js');

class GameMessageHandler {
    req;
    ws;
    game;
    gameRepository;

    constructor(req, ws, gameRepository) {
        this.req = req;
        this.ws = ws;
        this.gameRepository = gameRepository;
        this.game = gameRepository.getGameById(req.params.gameId);
        gameNotificator.subscribe(game);
    }

    handle(rawMessage) {
        const message = this.validateAndGetMessage(rawMessage);

        switch (message.type) {
            case "get_game":
                // return game to keep client updated
            case "add_player":
                // add player and words and start the game if enough players
            case "ready_to_explain":
                // check if correct player and start turn
            case "word_explained":
                // current word explained
            default:
                // throw error
        }
    }

    validateAndGetMessage(rawMessage) {
        const message = JSON.parse(rawMessage);

        if (!message.hasOwnProperty('type')) {
            this.throwError(new ErrorMessage(ErrorMessage.MISSED_PROPERTY, "Property 'type' is missed"));
        }
        return message;
    }

    throwError(errorMessage) {
        throw new Error(JSON.stringify(errorMessage));
    }
}

module.exports = GameMessageHandler;
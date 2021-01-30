const ErrorMessage = require('./ErrorMessage.js');
const Player = require('../models/Player.js');

class PlayerMessageHandler {
    req;
    ws;
    game;
    player;
    gameRepository;
    gameNotificator;

    constructor(req, ws, gameRepository, gameNotificator) {
        this.req = req;
        this.ws = ws;
        this.gameRepository = gameRepository;
        this.gameNotificator = gameNotificator;

        this.game = gameRepository.getGameById(req.params.gameId);
        this.player = this.findMatchedPlayer(this.game, req, ws);

        // pass proper arguments
        this.gameNotificator.subscribe(this.game);
    }

    handle(rawMessage) {
        const message = this.validateAndGetMessage(rawMessage);

        switch (message.type) {
            case "get_game":
                this.ws.send(JSON.stringify(this.game));

            case "add_player":
                this.game.addPlayer(this.player);

            case "add_player_words":
                this.game.addWords(message.words, this.player);

            case "explainer_is_ready_to_explain":
                this.checkCurrentPlayerIsExplainer("Trying to tell that explainer is ready to explain, however you are not explainer");
                this.game.startTurn();

            case "word_explained":
                this.checkCurrentPlayerIsExplainer("Trying to tell that word was explained, however you are not explainer");
                this.game.currentWordExplained();

            default:
                this.throwError(`Incorrect message type: ${message.type}`);

        }
    }

    checkCurrentPlayerIsExplainer(errorMessage) {
        if (this.player.id !== this.game.getExplainer().id) {
            this.throwError(new ErrorMessage(ErrorMessage.ACCESS_VIOLATION, errorMessage));
        }
    }

    validateAndGetMessage(rawMessage) {
        const message = JSON.parse(rawMessage);

        if (!message.hasOwnProperty('type')) {
            this.throwError(new ErrorMessage(ErrorMessage.MISSED_PROPERTY, "Property 'type' is missed"));
        }

        return message;
    }

    disconnected() {
        // pass proper arguments
        this.gameNotificator.unsubscribe(this.game);
    }

    throwError(errorMessage) {
        throw new Error(JSON.stringify(errorMessage));
    }

    findMatchedPlayer(game, req, ws) {
        if (!this.player) {
            if (!req.headers['Player-Id']) {
                this.throwError('Unable to authenticate player. Provide Player-Id header.');
            }
            const player = game.getPlayerById(req.headers['Player-Id']);
            this.player = player ? player : new Player(req.headers['Player-Id']);
            this.player.sockets.push(ws);
        }

        return this.player;
    }
}

module.exports = PlayerMessageHandler;
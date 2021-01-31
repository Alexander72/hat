const fs = require('fs')

class GetGamePageHandler {
    gameRepository;

    constructor(gameRepository) {
        this.gameRepository = gameRepository;
    }

    handle(req, res) {
        try {
            const game = this.gameRepository.getGameById(req.params.gameId);
            if (!req.session['Player-Id']) {
                req.session['Player-Id'] = Math.random().toString(36).substring(2, 17);
            }
            res.send(fs.readFileSync(__dirname + '/../../public/index.html', 'utf8'))
        } catch (e) {
            res.sendStatus(404);
        }
    }
}

module.exports = GetGamePageHandler;
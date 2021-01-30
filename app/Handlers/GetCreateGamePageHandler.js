const fs = require('fs')

class GetCreateGamePageHandler {
    handle(req, res)  {
        res.send(fs.readFileSync(__dirname + '/../../frontend/html/create-game.html', 'utf8'))
    }
}

module.exports = GetCreateGamePageHandler;

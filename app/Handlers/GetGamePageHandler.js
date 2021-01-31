const fs = require('fs')

class GetGamePageHandler {
    handle(req, res) {
        req.session['Player-Id'] = Math.random().toString(36).substring(2, 17);
        res.send(fs.readFileSync(__dirname + '/../../public/index.html', 'utf8'))
    }
}

module.exports = GetGamePageHandler;
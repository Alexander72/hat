class GameMessageHandler {
    messages = [];
    constructor(req, ws) {

    }

    handle(message) {
        this.messages.push(message.repeat(1024 * 1024 * 100));
        console.log('Message stored. Messages stored: ' + this.messages.length);
    }
}

module.exports = GameMessageHandler;
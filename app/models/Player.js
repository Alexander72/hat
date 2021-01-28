class Player {
    id;
    name;
    sockets = [];

    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

module.exports = Player;
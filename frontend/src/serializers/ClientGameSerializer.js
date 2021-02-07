class ClientGameSerializer {
    serialize(game) {
        return JSON.stringify({
            title: game.title,
            players: game.players.map((player) => {
                return {id: player.id, name: player.name}
            }),
            roundWords: game.roundWords.map(word => btoa(word)),
            settings: game.settings,
            teams: game.teams
        });
    }

    deserialize(serializedGame) {
        let game = JSON.parse(serializedGame);
        game.roundWords = game.roundWords.map(word => atob(word))

        return game;
    }
}

module.exports = ClientGameSerializer;
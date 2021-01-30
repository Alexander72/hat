const MIN_PLAYERS_COUNT = 4;

class Settings {
    playersCount = 4;
    wordsPerPlayer = 2;
    roundsCount = 3;
    turnDurationInMilliseconds = 5 * 100;

    getMinPlayersCount() {
        return MIN_PLAYERS_COUNT;
    }

    getTotalWordsCount() {
        return this.playersCount * this.wordsPerPlayer;
    }

    set wordsPerPlayer(wordsPerPlayer) {
        return this.wordsPerPlayer = wordsPerPlayer
    }
    set roundsCount(roundsCount) {
        return this.roundsCoun = roundsCount
    }
    set explanationDurationInMilliseconds(turnDurationInMilliseconds) {
        return this.turnDurationInMilliseconds = turnDurationInMilliseconds
    }
    set playersCount(playersCount) {
        if (playersCount < this.getMinPlayersCount()) {
            throw new Error('Incorrect players count')
        }

        this.playersCount = playersCount;
    }
}

module.exports = Settings;
const MIN_PLAYERS_COUNT = 4;

class Settings {
    playersCount = 4;
    wordsPerPlayer = 2;
    roundsCount = 3;
    turnDurationInSeconds = 5;

    getMinPlayersCount() {
        return MIN_PLAYERS_COUNT;
    }

    get playersCount() {
        return this.playersCount
    }
    get wordsPerPlayer() {
        return this.wordsPerPlayer
    }   
    get roundsCount() {
        return this.roundsCount
    }
    get explanationDurationInSeconds() {
        return this.turnDurationInSeconds
    }

    set wordsPerPlayer(wordsPerPlayer) {
        return this.wordsPerPlayer = wordsPerPlayer
    }
    set roundsCount(roundsCount) {
        return this.roundsCoun = roundsCount
    }
    set explanationDurationInSeconds(explanationDurationInSeconds) {
        return this.turnDurationInSeconds = explanationDurationInSeconds
    }
    set playersCount(playersCount) {
        if (playersCount < this.getMinPlayersCount()) {
            throw new Error('Incorrect players')
        }

        this.playersCount = playersCount;
    }
}

module.exports = Settings;
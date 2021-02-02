const EventEmitter = require('events');
const Timer = require('../../frontend/src/services/Timer');

// states
const INITIALIZATION = 'initialization';
const READY_FOR_EXPLANATION = 'in_progress';
const EXPLANATION = 'explanation';
const FINISHED = 'finished';

// events
const PLAYER_ADDED = 'player_added';
const PLAYER_UPDATED = 'player_updated';
const WORD_ADDED = 'word_added';
const GAME_STARTED = 'game_started';
const TURN_STARTED = 'turn_started';
const TURN_TIME_IS_UP = 'turn_time_is_up';
const NEXT_TURN_REWINDED = 'next_turn_rewinded';
const WORD_EXPLAINED = 'word_explained';
const GAME_IS_OVER = 'game_is_over';
const NEW_ROUND_STARTED = 'new_round_started';

class Game extends EventEmitter {
    id;
    title;
    players = [];
    words = [];
    settings;
    teams = [];
    state = INITIALIZATION;
    currentTeamIndex = 0;
    currentRoundIndex = 0;
    roundWords = [];
    turnTimer;

    constructor(title, settings, emitterOptions) {
        super(emitterOptions);

        this.title = title;
        this.settings = settings;

        this.registerListeners();
    }

    getData() {
        let gameData = {...this};
        delete gameData._events;
        delete gameData._eventsCount;
        delete gameData._maxListeners;
        delete gameData.turnTimer;

        return gameData;
    }

    addWords(words) {
        if (!Array.isArray(words)) {
            throw new Error('words variable is not array, unable to add. ' + words);
        }
        let self = this;
        words.map(function(word){
            self.addWord(word);
        })
    }

    addWord(word) {
        this.checkState(INITIALIZATION, 'Unable to add word because state is not initialisation but ' + this.state);

        this.words.push(word);
        this.emit(WORD_ADDED, word, this);
    }

    getPlayerById(playerId) {
        return this.players.find(player => player.id === playerId);
    }

    addPlayer(player) {
        this.checkState(INITIALIZATION, 'Unable to add player because state is not initialisation but ' + this.state);

        if (this.hasPlayer(player)) {
            this.updatePlayer(player);
        } else {
            this.players.push(player);
            this.emit(PLAYER_ADDED, player, this);
        }
    }

    start() {
        this.checkState(INITIALIZATION, 'Unable to start game because state is not initialisation but ' + this.state)

        this.generateTeams();
        this.resetWordsForNewRound();
        this.state = READY_FOR_EXPLANATION;

        this.emit(GAME_STARTED, this);
    }

    startTurn() {
        this.checkState(READY_FOR_EXPLANATION, 'Unable to start turn because state is not in_progress but ' + this.state);

        this.state = EXPLANATION;
        this.startTurnTimer();
        this.emit(TURN_STARTED, this);
    }

    timeIsUp() {
        this.checkState(EXPLANATION, 'State inconsistency. Trying to do things after time is up but the state is not \'' + EXPLANATION + '\' but \'' + this.state + '\'');

        this.emit(TURN_TIME_IS_UP, this);
        this.state = READY_FOR_EXPLANATION;
        this.nextTurn();
    }

    nextTurn() {
        this.state = READY_FOR_EXPLANATION;
        this.stopTimer();
        this.rewindNextExplainerInTheTeam(this.getCurrentTeam());
        this.rewindNextTeam();
        this.emit(NEXT_TURN_REWINDED, this);
    }

    getExplainer() {
        this.checkState([READY_FOR_EXPLANATION, EXPLANATION], 'Unable to return explainer. Game in incorrect state: ' + this.state);
        return this.getCurrentTeam().explainer;
    }

    getGuessers() {
        this.checkState([READY_FOR_EXPLANATION, EXPLANATION], 'Unable to return explainer. Game in incorrect state: ' + this.state);
        return this.getCurrentTeam().members.filter(member => member.id !== this.getExplainer().id);
    }

    getWordForExplanation() {
        this.checkState([READY_FOR_EXPLANATION, EXPLANATION], 'Unable to return explainer. Game in incorrect state: ' + this.state);
        if (this.roundWords.length === 0) {
            throw new Error('Unable to return a word for explanation: not enough words in the current round left');
        }
        return this.roundWords[0];
    }

    currentWordExplained() {
        this.checkState(EXPLANATION, 'Incorrect state to commit explained word: ' + this.state);

        const wordForExplanation = this.getWordForExplanation();
        this.roundWords.shift();
        this.getCurrentTeam().score[this.currentRoundIndex]++;
        this.emit(WORD_EXPLAINED, wordForExplanation);

        if (this.roundWords.length === 0) {
            this.nextRound();
        }
    }

    generateTeams() {
        const playersInTheTeam = 2;
        let players = this.players;
        players.sort(() => Math.random() - 0.5);

        for (let teamIndex = 0; teamIndex < players.length / playersInTheTeam; teamIndex++) {
            this.teams[teamIndex] = {
                members: [],
                explainer: null,
                score: [],
            }

            for (let indexInTeam = 0; indexInTeam < playersInTheTeam; indexInTeam++) {
                let player = players[teamIndex * playersInTheTeam + indexInTeam];
                this.teams[teamIndex].members.push(player);
                if (indexInTeam === 0) {
                    this.teams[teamIndex].explainer = player;
                }
            }
            for (let roundIndex = 0; roundIndex < this.settings.roundsCount; roundIndex++){
                this.teams[teamIndex]['score'][roundIndex] = 0;
            }
        }
    }

    resetWordsForNewRound() {
        this.roundWords = [...this.words];
        this.roundWords.sort(() => Math.random() - 0.5);
    }

    nextRound() {
        this.stopTimer();
        this.state = READY_FOR_EXPLANATION;

        if (this.currentRoundIndex === this.settings.roundsCount) {
            this.finalize();
        } else {
            this.currentRoundIndex++;
            this.rewindNextTeam();
            this.resetWordsForNewRound();
            this.emit(NEW_ROUND_STARTED, this);
        }
    }

    finalize() {
        this.state = FINISHED;
        this.emit(GAME_IS_OVER, this);
    }

    getCurrentTeam() {
        return this.teams[this.currentTeamIndex];
    }

    rewindNextExplainerInTheTeam(team) {
        const explainerIndex = this.teams.indexOf(team.explainer);
        const newExplainerIndex = explainerIndex + 1 >= team.members.length ? 0 : explainerIndex + 1;
        team.explainer = team.members[newExplainerIndex];
    }

    rewindNextTeam() {
        this.currentTeamIndex = this.currentTeamIndex + 1 >= this.teams.length ? 0 : this.currentTeamIndex + 1;
    }

    startTurnTimer() {
        const self = this;
        let turnEndsAt = new Date();
        turnEndsAt.setSeconds(turnEndsAt.getSeconds() + this.settings.turnDurationInSeconds);

        this.turnTimer = new Timer(turnEndsAt);
        this.turnTimer.start();
        this.turnTimer.on('time_is_up', function () {
            self.timeIsUp();
        });
    }

    stopTimer() {
        if (this.turnTimer) {
            this.turnTimer.stop();
            this.turnTimer = null;
        }
    }

    checkState(states, errorMessage) {
        if (!Array.isArray(states)) {
            states = [states];
        }

        if (states.indexOf(this.state) === -1) {
            throw new Error(errorMessage ? errorMessage : 'State expected: \'' + states + '\'');
        }
    }

    hasPlayer(player) {
        return this.players.filter((oneOfThePlayers) => {
            return oneOfThePlayers.id === player.id;
        }).length >= 1;
    }

    updatePlayer(player) {
        this.players = this.players.map((oneOfThePlayers) => {
            return oneOfThePlayers.id === player.id ? player : oneOfThePlayers;
        });
        this.emit(PLAYER_UPDATED, player, this);
    }

    registerListeners() {
        const checkStartConditionsAndStartIfMet = () => {
            if (
                this.words.length >= this.settings.getTotalWordsCount() &&
                this.players.length >= this.settings.playersCount
            ) {
                this.start();
            }
        };

        this.on(WORD_ADDED, checkStartConditionsAndStartIfMet)
        this.on(PLAYER_ADDED, checkStartConditionsAndStartIfMet)
    }
}

module.exports = Game;
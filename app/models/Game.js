const INITIALIZATION = 'initialization';
const READY_FOR_EXPLANATION = 'in_progress';
const EXPLANATION = 'explanation';
const FINISHED = 'finished';

class Game {
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
    turnTimerId;

    constructor(title, settings) {
        this.title = title;
        this.settings = settings;
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
    }

    addPlayer(player) {
        this.checkState(INITIALIZATION, 'Unable to add player because state is not initialisation but ' + this.state);
        this.players.push(player);
    }

    start() {
        this.checkState(INITIALIZATION, 'Unable to start game because state is not initialisation but ' + this.state)

        this.generateTeams();

        this.state = READY_FOR_EXPLANATION;

        this.resetWordsForNewRound();
    }

    startTurn() {
        this.checkState(READY_FOR_EXPLANATION, 'Unable to start turn because state is not in_progress but ' + this.state);

        this.state = EXPLANATION;

        let game = this;
        this.turnTimerId = setTimeout(function() {
            game.timeIsUp();
        }, this.settings.turnDurationInSeconds * 1000);

        console.log('Turn was started.');
    }

    timeIsUp() {
        this.checkState(EXPLANATION, 'State inconsistency. Trying to do things after time is up but the state is not ' + READY_FOR_EXPLANATION + ' but ' + this.state);
        console.log('Turn time is up!');
        this.state = READY_FOR_EXPLANATION;
        this.nextTurn();
    }

    nextTurn() {
        this.state = READY_FOR_EXPLANATION;
        this.stopTimer();
        this.rewindNextExplainerInTheTeam(this.getCurrentTeam());
        this.rewindNextTeam();
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
        this.roundWords.shift();
        this.getCurrentTeam().score[this.currentRoundIndex]++;

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
        console.log('New round started.');

        this.stopTimer();
        this.state = READY_FOR_EXPLANATION;

        if (this.currentRoundIndex === this.settings.roundsCount) {
            this.finalize();
        } else {
            this.currentRoundIndex++;
            this.rewindNextTeam();
            this.resetWordsForNewRound();
        }
    }

    finalize() {
        this.state = FINISHED;
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

    stopTimer() {
        if (this.turnTimerId) {
            clearTimeout(this.turnTimerId);
        }
    }

    checkState(states, errorMessage) {
        if (!Array.isArray(states)) {
            states = [states];
        }

        if (states.indexOf(this.state) === -1) {
            throw new Error(errorMessage ? errorMessage : 'State expected: \'' + state + '\'');
        }
    }
}

module.exports = Game;
const INITIALIZATION = 'initialization';
const IN_PROGRESS = 'in_progress';
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
        if (this.state !== INITIALIZATION) {
            throw new Error('Unable to add word because state is not initialisation but ' + this.state.toString());
        }

        this.words.push(word);
    }

    addPlayer(player) {
        if (this.state !== INITIALIZATION) {
            throw new Error('Unable to add player because state is not initialisation but ' + this.state.toString());
        }
        this.players.push(player);
    }

    start() {
        if (this.state !== INITIALIZATION) {
            throw new Error('Unable to start game because state is not initialisation but ' + this.state.toString());
        }

        this.generateTeams();

        this.state = IN_PROGRESS;

        this.resetWordsForNewRound();
    }

    getExplainer() {
        return this.teams[this.currentTeamIndex]['explainer'];
    }

    getGuessers() {
        let explainer = this.getExplainer();

        return this.teams[this.currentTeamIndex]['members'].filter(member => member.id !== explainer.id);
    }

    getWordForExplanation() {
        if (this.roundWords.length === 0) {
            throw new Error('Unable to return a word for explanation: not enough words in the current round left');
        }
        return this.roundWords[0];
    }

    currentWordExplained() {
        this.roundWords.shift();
        this.teams[this.currentTeamIndex]['score'][this.currentRoundIndex]++;

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
        this.roundWords = this.words;
        this.roundWords.sort(() => Math.random() - 0.5);
    }

    nextRound() {
        if (this.currentRoundIndex === this.settings.roundsCount) {
            this.finalize();
        } else {
            this.currentRoundIndex++;
        }
    }

    finalize() {
        this.state = FINISHED;
    }
}

module.exports = Game;
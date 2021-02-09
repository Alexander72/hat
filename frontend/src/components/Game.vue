<template>
  <div id="game">
    <div class="inner">
      <h1>{{ game.title }}</h1>
      <template v-if="game.state === 'initialization'">

        <template v-if="!currentPlayer.name">
          <label>Type your name: <input v-model="currentPlayer.name"/></label>
          <button v-on:click="editCurrentPlayerName">ok</button>
        </template>

        <template v-else-if="didPlayerFillAllWords(currentPlayer.id)">
          <h3>Add words:</h3>
          <div v-for="index in game.settings.wordsPerPlayer" v-bind:key="index">
            <label>{{index}}) <input v-model="game.playersWords[currentPlayer.id][index - 1]"/></label>
          </div>
          <button v-on:click="editCurrentPlayerWords">Add</button>
        </template>

        <template v-else>
          <table>
            <tr>
              <th>#</th>
              <th>Player</th>
              <th>Words typed</th>
            </tr>
            <tr v-for="index in game.settings.playersCount" v-bind:key="index">
              <td>{{index}}</td>
              <td v-if="typeof game.players[index - 1] !== 'undefined'">{{game.players[index - 1].name}}</td>
              <td v-else>?</td>
              <td v-if="typeof game.players[index - 1] !== 'undefined' && typeof game.playersWords[game.players[index - 1].id] !== 'undefined'">
                {{game.playersWords[game.players[index - 1].id].length}}
                <span v-if="didPlayerFillAllWords(game.players[index - 1].id)">✅</span>
              </td>
              <td v-else>?</td>
            </tr>
          </table>
        </template>

      </template>

      <template v-else>
        <h3>Current player: {{currentPlayer.name}}</h3>

        <template v-if="game.state === 'in_progress'">
          <template v-if="isPlayerInCurrentTeam">
            <template v-if="currentPlayer.id === currentTeam.explainer.id">
              <p>Are you ready to explain to <span v-for="(member, index) in currentGuessers" v-bind:key="index">{{ member.name }}</span>?</p>
              <button>Ready</button>
            </template>
            <template v-else>
              <p>Now <span>{{ currentTeam.explainer.name }}</span> will explain you</p>
            </template>
          </template>
          <template v-else>
            <p>Now <span>{{ currentExplainer.name }}</span> will explain to <span v-for="(member, index) in currentGuessers" v-bind:key="index">{{ member.name }}</span></p>
          </template>
        </template>

        <template v-if="game.state === 'explanation'">
          <p>Time left: <span>{{ timeForExplanationLeft }}</span></p>
          <template v-if="isPlayerInCurrentTeam">
            <template v-if="currentPlayer.id === currentTeam.explainer.id">
              <h3>{{ currentWordForExplanation }}</h3>
              <button v-on:click="onWordExplained">Explained</button>
            </template>
            <template v-else>
              <p>Now <span>{{ currentTeam.explainer.name }}</span> is explaining you</p>
            </template>
          </template>
          <template v-else>
            <p>Now <span>{{ currentExplainer.name }}</span> is explaining to <span v-for="(member, index) in currentGuessers" v-bind:key="index">{{ member.name }}</span></p>
          </template>
        </template>

        <hr>

        <score-table :game="game"></score-table>
      </template>

    </div>
  </div>
</template>

<script>
import WebSocketService from '../services/WebSocketService';
import ScoreTable from './ScoreTable.vue';
const Timer = require('../services/Timer.js');

export default {
  name: 'game',
  mounted() {
    this.initTimer();
    this.webSocketService = new WebSocketService();
    //this.webSocketService.connect('ws://localhost:3000/ws/game/cfohxi4z25');
  },
  destroyed() {
    //this.webSocketService.close();
  },
  components: {
    ScoreTable: ScoreTable
  },
  data() {
    let explanationEndsAt = new Date();
    explanationEndsAt.setSeconds(explanationEndsAt.getSeconds() + 10);
    return {
      currentPlayer: {"id": 4, "name": "Test 4"},
      game: {
        title: "test game",
        players: [
          {"id": 1, "name": "Test 1"},
          {"id": 2, "name": "Test 2"},
          {"id": 4, "name": "Test 4"},
          {"id": 3, "name": "Test 3"}
        ],
        playersWords: {
          1: ["cow"],
          2: ["dog"],
          3: ["sun"],
          4: ["rat","rat"],
        },
        words: ["cow", "dog", "sun", "rat"],
        settings: {"playersCount": 4, "wordsPerPlayer": 2, "roundsCount": 3, "turnDurationInMilliseconds": 500},
        teams: [
          {
            members: [
              {"id": 1, "name": "Test 1"},
              {"id": 2, "name": "Test 2"}
            ],
            explainer: {id: 1, name: "Test 1"},
            score: [2, 2, 0]
          },
          {
            members: [
              {id: 4, name: "Test 4"},
              {id: 3, name: "Test 3"}
              ],
            explainer: {id: 4, name: "Test 4"},
            score: [2, 0, 0]
          }
        ],
        state: "initialization",
        currentTeamIndex: 1,
        currentRoundIndex: 1,
        roundWords: ["sun", "dog"],
        explanationEndsAt: explanationEndsAt
      },
      timeForExplanationLeft: 30,
      timer: null
    }
  },
  computed: {
    currentTeam() {
      return this.game.teams[this.game.currentTeamIndex];
    },
    isPlayerInCurrentTeam() {
      return this.currentTeam.members.find(member => member.id === this.currentPlayer.id) !== undefined;
    },
    currentExplainer() {
      return this.currentTeam.explainer;
    },
    currentGuessers() {
      return this.currentTeam.members.filter(member => member.id !== this.currentExplainer.id);
    },
    currentWordForExplanation() {
      return this.game.roundWords[0];
    }
  },
  methods: {
    getPlayerWords(playerId) {
      return typeof this.game.playersWords[playerId] !== 'undefined' ? this.game.playersWords[playerId] : undefined;
    },
    didPlayerFillAllWords(playerId) {
      return typeof this.getPlayerWords(playerId) !== 'undefined' &&
          this.getPlayerWords(playerId).length === this.game.settings.wordsPerPlayer;
    },
    editCurrentPlayerName() {
      console.log(this.currentPlayer.name);
    },
    editCurrentPlayerWords() {
      console.log(this.getPlayerWords(this.currentPlayer.id));
    },
    onWordExplained() {
      //let playerIndex = Math.floor(Math.random() * this.game.players.length);
      //this.currentPlayer = this.game.players[playerIndex];
      //this.game.teams[0].score.splice(0, 1, 3);
      this.webSocketService.send({type:"get_game"})
    },
    initTimer() {
      let self = this;
      this.timer = new Timer(this.game.explanationEndsAt);
      this.timer.on('time_is_up', function(timer) {
        timer.stop();
      });
      this.timer.on('tick', function() {
        self.updateTimeForExplanationLeft();
      });
      this.timer.start();
    },
    updateTimeForExplanationLeft() {
      this.timeForExplanationLeft = Math.max(this.game.explanationEndsAt.getSeconds() - new Date().getSeconds(), 0)
    },
    initSocket() {
      //this.socket = new WebSocket();
      //this.socket.onmessage()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.inner {
  max-width: 500px;
  background: #42b983;
  margin: auto;
  padding: 20px;
  border-radius: 25px;
}

.score-table {
  display: inline-block;
}
table, th, td {
  border: 2px solid #2c3e50;
  border-collapse: collapse;
}
th, td {
  padding: 5px;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

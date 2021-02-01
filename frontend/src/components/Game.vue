<template>
  <div id="game">
    <div class="inner">
      <h1>{{ game.title }}</h1>

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

      <hr>
      <div class="score-table">
        <table>
          <tr>
            <th>Team</th>
            <th v-for="i in game.settings.roundsCount" v-bind:key="i">Round {{ i }}</th>
            <th>Total</th>
          </tr>
          <tr v-for="(team, index) in game.teams" v-bind:key="index">
            <td>
              <span v-for="(member, index) in team.members" v-bind:key="index">{{ member.name }}</span>
            </td>
            <td v-for="(roundScore, index) in team.score" v-bind:key="index">
              <span>{{ roundScore }}</span>
            </td>
            <td>{{ team.score.reduce((totalScore, score) => totalScore + score, 0) }}</td>
          </tr>
        </table>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Game',
  props: {
    msg: String
  },
  data() {
    return {
      currentPlayer: {"id": 1, "name": "Test 1"},
      game: {
        "title": "test game",
        "players": [
          {"id": 1, "name": "Test 1"},
          {"id": 2, "name": "Test 2"},
          {"id": 4, "name": "Test 4"},
          {"id": 3, "name": "Test 3"}
        ],
        "words": ["cow", "dog", "sun", "rat"],
        "settings": {"playersCount": 4, "wordsPerPlayer": 1, "roundsCount": 3, "turnDurationInMilliseconds": 500},
        "teams": [
          {
            "members": [
              {"id": 1, "name": "Test 1"},
              {"id": 2, "name": "Test 2"}
            ],
            "explainer": {"id": 1, "name": "Test 1"},
            "score": [2, 2, 0]
          },
          {
            "members": [
              {"id": 4, "name": "Test 4"},
              {"id": 3, "name": "Test 3"}
              ],
            "explainer": {"id": 4, "name": "Test 4"},
            "score": [2, 0, 0]
          }
        ],
        "state": "in_progress",
        "currentTeamIndex": 1,
        "currentRoundIndex": 1,
        "roundWords": ["sun", "dog"]
      }
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

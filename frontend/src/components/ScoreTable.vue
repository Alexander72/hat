<template>

  <div class="score-table">
    <h1>{{game.title}}</h1>
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

</template>

<script>
export default {
  name: "score-table",
  props: ["game"],
}
</script>

<style scoped>

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
</style>
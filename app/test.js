const Game = require('./models/Game.js');
const Player = require('./models/Player.js');
const Settings = require('./models/Settings.js');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async function() {
    let settings = new Settings();
    settings.wordsPerPlayer = 1;
    settings.playersCount = 4;

    let game = new Game('test game', settings);

    game.addPlayer(new Player(1, 'Test 1'));
    game.addPlayer(new Player(2, 'Test 2'));
    game.addPlayer(new Player(3, 'Test 3'));
    game.addPlayer(new Player(4, 'Test 4'));

    game.addWords(['cow', 'dog', 'sun', 'rat']);

    game.startTurn();

    await sleep(2 * 100);
    console.log(game.getExplainer().name + ' explained word \'' + game.getWordForExplanation() + '\' to ' + game.getGuessers().map(guesser => guesser.name).join(', '));
    game.currentWordExplained();

    await sleep(2 * 100);
    console.log(game.getExplainer().name + ' explained word \'' + game.getWordForExplanation() + '\' to ' + game.getGuessers().map(guesser => guesser.name).join(', '));
    game.currentWordExplained();

    await sleep(2 * 100);

    console.log('Expected turn time is up. Starting new turn..');

    game.startTurn();

    await sleep(2 * 100);
    console.log(game.getExplainer().name + ' explained word \'' + game.getWordForExplanation() + '\' to ' + game.getGuessers().map(guesser => guesser.name).join(', '));
    game.currentWordExplained();

    await sleep(2 * 100);
    console.log(game.getExplainer().name + ' explained word \'' + game.getWordForExplanation() + '\' to ' + game.getGuessers().map(guesser => guesser.name).join(', '));
    game.currentWordExplained();

    console.log('Expected all words in the round were explained. Starting new round..');

    game.startTurn();

    await sleep(2 * 100);
    console.log(game.getExplainer().name + ' explained word \'' + game.getWordForExplanation() + '\' to ' + game.getGuessers().map(guesser => guesser.name).join(', '));
    game.currentWordExplained();

    await sleep(2 * 100);
    console.log(game.getExplainer().name + ' explained word \'' + game.getWordForExplanation() + '\' to ' + game.getGuessers().map(guesser => guesser.name).join(', '));
    game.currentWordExplained();

    await sleep(2 * 100);

    //console.log(require('util').inspect(game, {showHidden: false, depth: null}))
    console.log(JSON.stringify(game))
})();
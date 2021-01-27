const Game = require('./models/Game.js');
const Player = require('./models/Player.js');
const Settings = require('./models/Settings.js');

let settings = new Settings();
let game = new Game('test game', settings);

game.addPlayer(new Player(1, 'Test 1'));
game.addPlayer(new Player(2, 'Test 2'));
game.addPlayer(new Player(3, 'Test 3'));
game.addPlayer(new Player(4, 'Test 4'));

game.addWords(['cow', 'dog', 'sun', 'rat']);

game.start();

let explainer = game.getExplainer();
let guessers = game.getGuessers();

let wordForExplanation;
wordForExplanation = game.getWordForExplanation();
console.log(explainer.name + ' explains word \'' + wordForExplanation + '\' to ' + guessers.map(guesser => guesser.name).join(', '));
game.currentWordExplained();
wordForExplanation = game.getWordForExplanation();
console.log(explainer.name + ' explains word \'' + wordForExplanation + '\' to ' + guessers.map(guesser => guesser.name).join(', '));
game.currentWordExplained();
wordForExplanation = game.getWordForExplanation();
console.log(explainer.name + ' explains word \'' + wordForExplanation + '\' to ' + guessers.map(guesser => guesser.name).join(', '));
game.currentWordExplained();
wordForExplanation = game.getWordForExplanation();
console.log(explainer.name + ' explains word \'' + wordForExplanation + '\' to ' + guessers.map(guesser => guesser.name).join(', '));
game.currentWordExplained();

const util = require('util')

console.log(util.inspect(game, {showHidden: false, depth: null}))
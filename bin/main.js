const Game = require("../lib/game");
const HumanPlayer = require("../lib/human_player");

const black = new HumanPlayer('black');
const white = new HumanPlayer('white');

const game = new Game(black, white);
game.play();

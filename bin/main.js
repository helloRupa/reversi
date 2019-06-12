const Game = require("../lib/game");
const HumanPlayer = require("../lib/human_player");
const AiPlayer = require("../lib/ai_player");

const black = new AiPlayer('black');
const white = new AiPlayer('white');

const game = new Game(black, white);
game.play();

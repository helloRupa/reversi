const readline = require("readline");
const Piece = require("./piece.js");
const Board = require("./board.js");

/**
 * Sets up the game with a board and the first player to play a turn.
 */
function Game (player1, player2) {
  this.board = new Board();
  this.player1 = player1;
  this.player2 = player2;
  this.turn = player1;
}

/**
 * Flips the current turn to the opposite color.
 */
Game.prototype._flipTurn = function () {
  this.turn = (this.turn == this.player1) ? this.player2: this.player1;
};

// Dreaded global state!
let rlInterface;

/**
 * Creates a readline interface and starts the run loop.
 */
Game.prototype.play = function () {
  rlInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  this.runLoop(function () {
    rlInterface.close();
    rlInterface = null;
  });
};

/**
 * Gets the next move from the current player and
 * attempts to make the play.
 */
Game.prototype.playTurn = function (callback) {
  this.board.print();
  this.turn.chooseMove(rlInterface, handleResponse, this);

  function handleResponse(answer) {
    const pos = Array.isArray(answer) ? answer : answer.split(', ').map(num => parseInt(num));
    
    if (!this.board.validMove(pos, this.turn.color)) {
      console.log("Invalid move!");
      this.playTurn(callback);
      return;
    }

    this.board.placePiece(pos, this.turn.color);
    this._flipTurn();
    callback();
  }
};

/**
 * Continues game play, switching turns, until the game is over.
 */
Game.prototype.runLoop = function (overCallback) {
  if (this.board.isOver()) {
    this.board.print();
    console.log("The game is over!");
    console.log(this.board.winner());
    overCallback();
  } else if (!this.board.hasMove(this.turn.color)) {
    console.log(`${this.turn.color} has no move!`);
    this._flipTurn();
    this.runLoop(overCallback);
  } else {
    this.playTurn(this.runLoop.bind(this, overCallback));
  }
};

module.exports = Game;

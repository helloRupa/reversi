function AiPlayer(color) {
  this.color = color;
}

AiPlayer.prototype.chooseMove = function(_display, callback, game) {
  const moves = game.board.validMoves(this.color);
  const choice = Math.floor(Math.random() * moves.length);
  console.log(`${this.color}, where do you want to move? ${moves[choice]}`);
  callback.call(game, moves[choice]);
};

module.exports = AiPlayer;

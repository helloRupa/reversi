function HumanPlayer(color) {
  this.color = color;
}

HumanPlayer.prototype.chooseMove = function(display, callback, game) {
  display.question(
    `${this.color}, where do you want to move?`,
    callback.bind(game)
  );
};

module.exports = HumanPlayer;

/**
 * Initializes the Piece with its color.
 */
function Piece (color) {
  this.color = color;
  Piece.registerColor(color);
}

// add colors automatically
Piece.registerColor = function(color) {
  Piece.colors = Piece.colors || [];
  Piece.colors.push(color);
};
/**
 * Returns the color opposite the current piece.
 */
Piece.prototype.oppColor = function () {
  return (this.color === Piece.colors[0]) ? Piece.colors[1] : Piece.colors[0];
};


/**
 * Changes the piece's color to the opposite color.
 */
Piece.prototype.flip = function () {
  this.color = this.oppColor();
};

/**
 * Returns a string representation of the string
 * based on its color.
 */
Piece.prototype.toString = function () {
  return this.color[0].toUpperCase();
};

module.exports = Piece;

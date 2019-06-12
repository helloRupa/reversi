let Piece = require("./piece");
const gridSize = 8;
const dark = 'black';
const light = 'white';

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  let board = [...Array(gridSize)].map(row => Array(gridSize).fill(null));
  board[3][4] = new Piece(dark);
  board[4][3] = new Piece(dark);
  board[3][3] = new Piece(light);
  board[4][4] = new Piece(light);
  return board;
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  const [x, y] = pos;

  if(!this.isValidPos(pos)) { throw new Error('No valid pos!'); }

  return this.grid[x][y];
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  return this.validMoves(color).length !== 0;
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  const piece = this.getPiece(pos);
  return (piece && piece.color === color);
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  return this.getPiece(pos) instanceof Piece;
};

/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
  return !this.hasMove(dark) && !this.hasMove(light);
};

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  const [x, y] = pos;
  const row = [0, 1, 2, 3, 4, 5, 6, 7];

  return row.includes(x) && row.includes(y);
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns null if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns null if it hits an empty position.
 *
 * Returns null if no pieces of the opposite color are found.
 */
function _positionsToFlip (board, pos, color, dir, piecesToFlip = []) {
  let move = [pos[0] + dir[0], pos[1] + dir[1]];

  if(!board.isValidPos(move)) { return null; }

  let piece = board.getPiece(move);

  if(!piece || (piece.color === color && piecesToFlip.length === 0)) { return null; }
  if(piece.color === color) { return piece; }

  piecesToFlip.push(piece);

  let last_piece = _positionsToFlip(board, move, color, dir, piecesToFlip);

  return (last_piece) ? piecesToFlip : null;
}

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  if(this.validMove(pos, color)) {
    this.grid[pos[0]][pos[1]] = new Piece(color);

    Board.DIRS.forEach(dir => {
      let flips = _positionsToFlip (this, pos, color, dir);
      if(flips) {
        flips.forEach(fPiece => fPiece.flip());
      }
    });
  } else {
    throw new Error('Invalid Move');
  }
};

/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
  this.grid.forEach((row, idx) => {
    console.log(` ${row.map(el => el ? el : ' ').join(' | ')} `);
    if(idx !== gridSize - 1) {
      console.log('-'.repeat(32));
    }
  });
};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  return !this.isOccupied(pos) && this.validMoves(color).some(move => _findComplexArray(move, pos));
};

const _findComplexArray = function(arr, target) {
  return arr[0] === target[0] && arr[1] === target[1];
};

const _isTouchingEnemy = function(board, color, pos) {
  for(let i = 0; i < Board.DIRS.length; i++) {
    let dir = Board.DIRS[i];
    let move = [pos[0] + dir[0], pos[1] + dir[1]];
    if(board.isValidPos(move)) {
      let piece = board.getPiece(move);
      if(piece && piece.color !== color) { return true; }
    }
  }
  return false;
};

const _isFlippable = function(board, pos, color) {
  for(let i = 0; i < Board.DIRS.length; i++) {
    if(_positionsToFlip(board, pos, color, Board.DIRS[i])) {
      return true;
    }
  }
  return false;
};
/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  let moves = [];

  for(let i = 0; i < gridSize; i++) {
    for(let j = 0; j < gridSize; j++) {
      if(!this.getPiece([i, j]) && _isTouchingEnemy(this, color, [i, j])) {
        if(_isFlippable(this, [i, j], color)) { moves.push([i, j]); }
      }
    }
  }
  return moves;
};

Board.prototype.winner = function() {
  let whiteCount = 0;
  let blackCount = 0;

  this.grid.forEach(row => {
    row.forEach(piece => {
      if(piece) {
        if(piece.color === light) { whiteCount++; }
        else { blackCount++; }
      }
    });
  });

  if(whiteCount == blackCount) { return "No winner, it's a tie!"; }
  const winner = (whiteCount > blackCount) ? light : dark;
  return `Winner: ${winner}, ${dark}: ${blackCount}, ${light}: ${whiteCount}`;
};

module.exports = Board;

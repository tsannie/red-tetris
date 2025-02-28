class Player {
  constructor(id, pseudo, socket) {
    this.socket = socket;
    this.id = id;
    this.pseudo = pseudo;
    this.score = 0;
    this.board = null;
    this.n_tetriminos = 0;
    this.tetrimino = null;
  }

  updateScore(points) {
    this.score += points;
  }
}

export default Player;

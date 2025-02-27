class Player {
  constructor(socket, pseudo) {
    this.id = id;
    this.pseudo = pseudo;
    this.score = 0;
    this.board = null;
    this.n_tetriminos = 0;
  }

  updateScore(points) {
    this.score += points;
  }
}

export default Player;

class Room {
  constructor(id, name, player) {
    this.id = id;
    this.name = name;
    this.players = [player];
    this.admin = player;
    this.game = null;
  }
}

export default Room;

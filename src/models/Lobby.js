/**
 * Lobby model
 */
class Lobby {
  constructor(data = {}) {
    this.categories = null;
    this.gameMode = null;
    this.excludedChars = null;
    this.id = null;
    this.rounds = null;
    this.roundDuration = null;
    this.lobbyName = null;
    this.lobbyPassword = null;
    this.game = null;
    this.players = null;
    this.autoCorrectMode = null;
    Object.assign(this, data);
  }
}

export default Lobby;

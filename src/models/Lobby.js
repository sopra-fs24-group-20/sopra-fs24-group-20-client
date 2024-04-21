/**
 * Lobby model
 */
class Lobby {
  constructor(data = {}) {
    this.lobbyId = null;
    this.lobbyName = null;
    this.lobbyPassword = null;
    this.roundDuration = null;
    this.rounds = null;
    this.gameMode = null;
    this.autoCorrectMode = null;
    this.categories = null;
    this.excludedChars = null;
    this.game = null;
    this.players = null;
    Object.assign(this, data);
  }
}

export default Lobby;

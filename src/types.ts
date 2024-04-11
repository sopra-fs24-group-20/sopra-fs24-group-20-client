export type User = {
  username: string;
  lobby: any;
  id: number;
  stats: any;
  token: string;
  ready: boolean;
  password: string;
};

export type Lobby = {
  categories: any;
  gameMode: number;
  excludedChars: any;
  id: number;
  rounds: number;
  roundDuration: number;
  lobbyName: string;
  lobbyPassword: string;
  game: any;
  players: any;
  autoCorrectMode: boolean;
  players_ready: number;
};

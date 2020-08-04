export type GameStatus = {
  AwayTeam: Team,
  HomeTeam: Team,
  Options: GameEvent,
};

export type Team = {
  city: string,
  color: string,
  logo: string,
  name: string,
  score: number,
  timeout: Timeout,
};

export enum Timeout {
  NONE = 0,
  ONE = 1,
  TWO = 2,
  THREE = 3,
};

export type GameEvent = {
  quarter: Quarter,
  possession: TeamPossession,
  flag: boolean,
  showScoreboard: boolean,
};

export enum TeamPossession {
  NONE = 0,
  AWAY = 1,
  HOME = 2,
};

export enum Quarter {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
};
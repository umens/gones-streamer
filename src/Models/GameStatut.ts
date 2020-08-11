export type StoreType = {
  GameStatut: GameStatut,
  LiveSettings: LiveSettings,
  BackgroundImage: string | null,
};

export type GameStatut = {
  AwayTeam: Team,
  HomeTeam: Team,
  Options: GameEvent
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

export type LiveSettings = {
  bitrate: number,
  buffer: number,
  streamKey: string,
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

export enum SceneName {
  Replay = 'Replay',
  Live = 'Live',
  Starting = 'Starting',
  Halftime = 'Halftime',
  Ending = 'Ending',
  Sponsors = 'Sponsors',
  Background = '* bg',
  ScoreBackground = '* Score bg',
}

export enum Animation {
  TOUCHDOWN = 'touchdown_animation',
  PAT = 'pat_animation',
  EXTRAPOINT = 'extrapoint_animation',
  SAFETY = 'safety_animation',
  FIELDGOAL = 'fieldgoal_animation',
}

export type FileUp = {
  file: File;
  pathElectron: string;
}
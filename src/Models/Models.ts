// import { FileWithPath } from "react-dropzone";

/**
 * Types
 */
export type OBSVideoInput = {
  itemEnabled: boolean;
  itemName: string;
  itemValue: string;
}
export type PathsType = {
  binFolder: string;
  appFolder: string;
  sponsorsFolder: string;
  playersFolder: string;
}

export type StoreType = {
  GameStatut: GameStatut;
  LiveSettings: LiveSettings;
  BackgroundImage: string | null;
  CamerasHardware: CameraHardware[];
  Sponsors: Sponsor[];
  Players: Player[];
};

export type GameStatut = {
  AwayTeam: Team;
  HomeTeam: Team;
  Options: GameEvent
};

export type Team = {
  city: string;
  color: string;
  logo: string;
  name: string;
  score: number;
  timeout: Timeout;
};

export type GameEvent = {
  quarter: Quarter;
  possession: TeamPossession;
  flag: boolean;
  showScoreboard: boolean;
  competition: string;
  journee: string;
  clock: GameClock;
};

export type LiveSettings = {
  bitrate: number;
  buffer: number;
  streamKey: string;
  sport: StreamingSport;
  streamingService: StreamingService;
};

export type FileUp = {
  file: File;
  pathElectron: string;
}

export type CameraHardware = {
  title: string;
  active: boolean;
  deviceid?: MediaDeviceInfo["deviceId"];
}

export type GameClock = {
  minutes: number;
  seconds: number;
  active: boolean;
  isOn: boolean;
}

export type Sponsor = {
  uuid?: string;
  label: string;
  media?: string;
  mediaType?: MediaType;
  duration?: number;
}

export type Player = {
  uuid?: string;
  firstname: string;
  lastname: string;
  num: number;
  position: string;
  age?: number;
  media?: string;
  weight?: number;
  height?: number;
}

export type StreamingStats = {
  totalStreamTime: string;
  oldDroppedFrame: number;
  droppedFrame: number;
  cpuUsage: number[];
  memoryUsage: number[];
  bytesPerSec: number;
}

/**
 * Enums
 */

export enum Timeout {
  NONE = 0,
  ONE = 1,
  TWO = 2,
  THREE = 3,
};

export enum TeamPossession {
  NONE = 0,
  AWAY = 1,
  HOME = 2,
};

export enum Quarter {
  Q1 = 1,
  Q2 = 2,
  Q3 = 3,
  Q4 = 4,
  OT = 5,
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
  Soundboard = '* Soundboard',
}

export enum StreamingSport {
  Football = 0,
  Soccer = 1,
  Basketball = 2,
  Handball = 3,
}

export enum ScoreType {
  TOUCHDOWN = 'touchdown_animation',
  PAT = 'pat_animation',
  EXTRAPOINT = 'extrapoint_animation',
  SAFETY = 'safety_animation',
  FIELDGOAL = 'fieldgoal_animation',
}

export enum AnimationType {
  TIMEOUT = 'timeout_animation',
  TOUCHDOWN = 'touchdown_animation',
  PAT = 'pat_animation',
  EXTRAPOINT = 'extrapoint_animation',
  SAFETY = 'safety_animation',
  FIELDGOAL = 'fieldgoal_animation',
}

export enum StreamingService {
  Youtube = 'youtube',
  Facebook = 'facebook',
}

export enum MediaType {
  Video = 'video',
  Image = 'image',
}

export enum SponsorDisplayType {
  Fullscreen = 'full',
  Big = 'big',
  Small = 'small',
}

export enum SponsorDisplayTypeSceneIdBig {
  Ending = 7,
  Halftime = 8,
  Live = 9,
  Starting = 10,
}
export enum SponsorDisplayTypeSceneIdSmall {
  Ending = 11,
  Halftime = 12,
  Live = 13,
  Starting = 14,
}

export enum FPS {
  slow = 1000/15, // var 15fps = 1000/15; // 66
  normal = 1000/24, // var 24fps = 1000/24; // 42
  regular = 1000/30, // var 30fps = 1000/30; // 33
  fast = 1000/60, // var 60fps = 1000/60; // 16
}

/** 
 * Functions
*/

export function GetDefaultConfig(): StoreType {  
  const GameStatut: GameStatut = {
    AwayTeam: {
      city: 'Ville Equipe 2',
      color: '#612323',
      logo: '../../../../appDatas/away.png',
      name: 'Equipe 2',
      score: 0,
      timeout: 3
    },
    HomeTeam: {
      city: 'Ville Equipe 1',
      color: '#133155',
      logo: '../../../../appDatas/home.png',
      name: 'Equipe 1',
      score: 0,
      timeout: 3
    },
    Options: {
      quarter: Quarter.Q1,
      possession: TeamPossession.HOME,
      flag: false,
      showScoreboard: true,
      competition: 'FFFA D2',
      journee: 'Week 1',
      clock: {
        minutes: 12,
        seconds: 0,
        isOn: false,
        active: true,
      }     
    }
  };
  const LiveSettings: LiveSettings = {
    bitrate: 6000,
    buffer: 15,
    streamKey: '',
    sport: StreamingSport.Football,
    streamingService: StreamingService.Youtube,
  };
  const CamerasHardware: CameraHardware[] = [
    {
      title: 'Field',
      active: true,
      deviceid: 'OBS Virtual Camera:'
    }
  ];
  const Sponsors: Sponsor[] = [];
  const Players: Player[] = [];
  const BackgroundImage = '../../../../appDatas/bg.jpg';
  let storedConfigDefault: StoreType = {
    GameStatut,
    LiveSettings,
    BackgroundImage,
    CamerasHardware,
    Sponsors,
    Players,
  };
  return storedConfigDefault;
}
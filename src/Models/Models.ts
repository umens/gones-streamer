// import { FileWithPath } from "react-dropzone";

import { Datum } from "@nivo/line";

/**
 * Types
 */
export type OBSInputProps = {
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
  AudioHardware: AudioHardware[];
  Sponsors: Sponsor[];
  Players: Player[];
  UpdateChannel: string;
  TextsSettings: TextsSettings;
  ScoreboardSettings: ScoreboardSettings;
};

export type ScoreboardSettings = {
  position: ScoreboardSettingsPosition,
  style: ScoreboardSettingsStyle,
}

export type TextsSettings = {
  font: string;
  homeTeamColor: string;
  awayTeamColor: string;
  scoreColor: string;
  journeyColor: string;
}

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
  uuid?: string;
  title: string;
  active: boolean;
  deviceid: MediaDeviceInfo["deviceId"];
}

export type AudioHardware = {
  uuid?: string;
  title: string;
  deviceid: MediaDeviceInfo["deviceId"];
  type: AudioType;
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
  bytesPerSec: number;
}

export type CoreStats = {
  cpuUsage: Datum[];
  memoryUsage: Datum[];
  oldDroppedFrame: number;
  droppedFrame: number;
}

export type AutoUpdaterData = {
  message?: string;
  releaseNote?: string;
  more?: string;
  version?: string;
  download? : {
    bytesPerSecond: number;
    percent: number;
    transferred: number;
    total: number;
  }
}

/**
 * Enums
 */

export enum ScoreboardSettingsPosition {
  TL = 'top left',
  TC = 'top center',
  TR = 'top right',
  BL = 'bottom left',
  BC = 'bottom center',
  BR = 'bottom right',
}

export enum ScoreboardSettingsStyle {
  STYLE1 = 'style 1',
  STYLE2 = 'style 2',
}

export enum AutoUpdaterEvent {
  QUITANDINSTALL = 'install-requested-updater',
  DOWNLOADRESQUESTED = 'download-requested-updater',
  CHECKRESQUESTED = 'check-requested-updater',
  CHECKING = 'checking-for-update-updater',
  AVAILABLE = 'update-available-updater',
  NOUPDATE = 'update-not-available-updater',
  ERROR = 'error-updater',
  DOWNLOADING = 'download-progress-updater',
  DOWNLOADED = 'update-downloaded-updater',
  CHANNELCHANGED = 'channel-changed-updater',
};
export enum UpdateChannel {
  STABLE = 'latest',
  BETA = 'beta',
};

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
  FOOTBALL = 'football',
  SOCCER = 'soccer',
  BASKETBALL = 'basketball',
  HANDBALL = 'handball',
  RUGBY = 'rugby',
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
  YOUTUBE = 'youtube',
  FACEBOOK = 'facebook',
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

export enum AudioType {
  Input = 'wasapi_input_capture',
  Output = 'wasapi_output_capture',
}

export interface IVolmeter {
  magnitude: number[];
  peak: number[];
  inputPeak: number[];
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
    sport: StreamingSport.FOOTBALL,
    streamingService: StreamingService.YOUTUBE,
  };
  const CamerasHardware: CameraHardware[] = [
    {
      title: 'Field',
      active: true,
      deviceid: 'OBS Virtual Camera:'
    }
  ];
  const AudioHardware: AudioHardware[] = [];
  const Sponsors: Sponsor[] = [];
  const Players: Player[] = [];
  const BackgroundImage = '../../../../appDatas/bg.jpg';
  const TextsSettings: TextsSettings = {
    awayTeamColor: '#ffffff',
    font: 'Impact',
    homeTeamColor: '#ffffff',
    journeyColor: '#ffffff',
    scoreColor: '#ffffff',
  };
  const ScoreboardSettings: ScoreboardSettings = {
    position: ScoreboardSettingsPosition.TR,
    style: ScoreboardSettingsStyle.STYLE1
  };
  let storedConfigDefault: StoreType = {
    GameStatut,
    LiveSettings,
    BackgroundImage,
    CamerasHardware,
    AudioHardware,
    Sponsors,
    Players,
    UpdateChannel: 'latest',
    TextsSettings,
    ScoreboardSettings,
  }
  return storedConfigDefault;
}
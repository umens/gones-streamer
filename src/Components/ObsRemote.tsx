import { Component } from "react";
import OBSWebSocket, { EventSubscription } from 'obs-websocket-js';
import { notification } from "antd";
import { StoreType, SceneName, GameStatut as IGameStatut, Timeout, Team, GameEvent, TeamPossession, Quarter, FileUp, ScoreType, GetDefaultConfig, AnimationType, Sponsor, Player, SponsorDisplayType, MediaType, SponsorDisplayTypeSceneIdSmall, SponsorDisplayTypeSceneIdBig, StreamingStats, CameraHardware, OBSInputProps, AudioHardware, AudioType, TextsSettings, CoreStats, AutoUpdaterEvent } from "../Models";
import { Utilities } from "../Utils";
import { Datum } from "@nivo/line";
import { ScoreboardSettings, ScoreboardSettingsStyle } from "../Models/Models";

const obsWs = new OBSWebSocket();

type ObsRemoteProps = {
  children: any;
};
type ObsRemoteState = {
  live: boolean;
  firstStart: boolean;
  connectingObs: boolean;
  connected2Obs: boolean;
  firstDatasLoaded: boolean;
  // appPaths?: PathsType;
  scenes: {
    currentScene: string | null;
    scenes: any[];
  } | null;
  // {
  //   messageId: string;
  //   status: "ok";
  //   "current-scene": string | null;
  //   scenes: any[];
  // } | null;
  store: StoreType | null;
  timeoutConnection?: NodeJS.Timeout;
  sponsorDisplayType?: SponsorDisplayType;
  Utilitites?: Utilities;
  streamingStats?: StreamingStats;
  coreStats?: CoreStats;
  stats: { enable: boolean; core: boolean; stream: boolean; };

  reconnectObs: () => Promise<void>;
  goLive: () => Promise<void>;
  changeActiveScene: (name: SceneName) => Promise<void>;
  changeActiveCam: (name: string) => Promise<void>;
  updateLiveStatus: () => Promise<void>;
  updateTextProps: ({ props, value, homeTeam, bg, withAnimation  }: { props: keyof Team; value: string | number | FileUp | Timeout; homeTeam?: boolean; bg?: boolean; withAnimation?: boolean;  }) => Promise<void>;
  updateSettings: (value: any) => Promise<void>;
  setScore: ({ isHomeTeam, scoreType, withAnimation }: { isHomeTeam: boolean; scoreType: ScoreType; withAnimation?: boolean; }) => Promise<void>;
  changePossession: () => Promise<void>;
  updateGameEventProps: ({ props, value }: { props: keyof GameEvent; value: boolean | Quarter | TeamPossession | string; }) => Promise<void>;
  startReplay: () => Promise<void>;
  getScreenshot: ({ imageWidth, imageHeight }: { imageWidth?: number, imageHeight?: number }) => Promise<{ img?: string }>;
  resetGame: () => Promise<void>;
  newGame: ({ name1, name2, city1, city2, logo1, logo2 }: { name1: string, name2: string, city1?: string, city2?: string, logo1?: string, logo2?: string }) => Promise<void>;
  startStopClock: (isTimeout?: boolean) => Promise<void>;
  resetClock: () => Promise<void>;
  toggleClock: () => Promise<void>;
  setGameClock: ({ minutes, seconds }: { minutes: number; seconds: number; }) => Promise<void>;
  togglePlayerHighlight: (show: boolean, uuid: string) => Promise<void>;
  toggleSponsor: ({show, uuid, previousScene, sponsorDisplayType}: {show: boolean, uuid: string, previousScene: SceneName, sponsorDisplayType?: SponsorDisplayType}) => Promise<void>;
  // resetSponosorScene: () => Promise<void>;
  updateSponsorsList: (sponsors: Sponsor[]) => Promise<void>;
  updatePlayersList: (players: Player[]) => Promise<void>;
  addCamera: (camera: CameraHardware) => Promise<void>;
  editCamera: (camera: CameraHardware) => Promise<void>;
  removeCamera: (camera: CameraHardware) => Promise<void>;
  getAvailableCameras: () => Promise<OBSInputProps[]>;
  getAudioSources: () => Promise<any[]>;
  startListenerVolumeter: (listenerFunc: (args_0: { inputs: any; }) => void) => void;
  stopListenerVolumeter: () => void;
  startListenerMutedState: (listenerFunc: (args_0: { inputName: string; inputMuted: boolean; }) => void) => void;
  stopListenerMutedState: () => void;
  startListenerVolumeChanged: (listenerFunc: (args_0: { inputName: string; inputVolumeMul: number; inputVolumeDb: number; }) => void) => void;
  stopListenerVolumeChanged: () => void;
  getVolumeFromInput: (inputName: string) => Promise<number>;
  getMuteStateFromInput: (inputName: string) => Promise<boolean>;
  getAvailableAudios: () => Promise<{ type: AudioType, devices: OBSInputProps[] }[]>;
  addAudio: (audio: AudioHardware) => Promise<void>;
  editAudio: (audio: AudioHardware) => Promise<void>;
  removeAudio: (audio: AudioHardware) => Promise<void>;
  updateTextsSettings: (values: TextsSettings) => Promise<void>;
  toggleMute: (inputName: string) => Promise<void>;
  changeVolume: (volume: number, inputName: string) => Promise<void>;
  firstLoadDone: () => Promise<void>;
  startCoreStats: () => Promise<void>;
  stoptCoreStats: () => Promise<void>;
  startStats: () => Promise<void>;
  stopStats: () => Promise<void>;
  toogleStats: () => Promise<void>;
  sendUpdateToScoreboardWindow: () => Promise<void>;
  updateScoreboardSettings: (values: ScoreboardSettings) => Promise<void>;
};

class ObsRemote extends Component<ObsRemoteProps, ObsRemoteState> {

  intervalClockId?: number;
  intervalStatsId?: number;
  intervalCoreStatsId?: number;

  constructor(props: Readonly<ObsRemoteProps>) {
    super(props);
    this.state = {
      live: false,
      firstStart: true,
      connectingObs: false,
      connected2Obs: false,
      firstDatasLoaded: false,
      scenes: null,
      stats: { enable: true, core: true, stream: false },
      // homeTeam: null,
      // awayTeam: null,
      store: null,
      reconnectObs: this.connectObs.bind(this),
      goLive: this.goLive.bind(this),
      changeActiveScene: this.changeActiveScene.bind(this),
      changeActiveCam: this.changeActiveCam.bind(this),
      updateLiveStatus: this.updateLiveStatus.bind(this),
      updateTextProps: this.updateTextProps.bind(this),
      updateSettings: this.updateSettings.bind(this),
      setScore: this.setScore.bind(this),
      changePossession: this.changePossession.bind(this),
      updateGameEventProps: this.updateGameEventProps.bind(this),
      startReplay: this.startReplay.bind(this),
      getScreenshot: this.getScreenshot.bind(this),
      resetGame: this.resetGame.bind(this),
      newGame: this.newGame.bind(this),
      startStopClock: this.startStopClock.bind(this),
      resetClock: this.resetClock.bind(this),
      toggleClock: this.toggleClock.bind(this),
      setGameClock: this.setGameClock.bind(this),
      togglePlayerHighlight: this.togglePlayerHighlight.bind(this),
      toggleSponsor: this.toggleSponsor.bind(this),
      updateSponsorsList: this.updateSponsorsList.bind(this),
      updatePlayersList: this.updatePlayersList.bind(this),
      addCamera: this.addCamera.bind(this),
      editCamera: this.editCamera.bind(this),
      removeCamera: this.removeCamera.bind(this),
      getAvailableCameras: this.getAvailableCameras.bind(this),
      // resetSponosorScene: this.resetSponosorScene.bind(this),
      getAudioSources: this.getAudioSources.bind(this),
      startListenerVolumeter: this.startListenerVolumeter.bind(this),
      stopListenerVolumeter: this.stopListenerVolumeter.bind(this),
      startListenerMutedState: this.startListenerMutedState.bind(this),
      stopListenerMutedState: this.stopListenerMutedState.bind(this),
      startListenerVolumeChanged: this.startListenerVolumeChanged.bind(this),
      stopListenerVolumeChanged: this.stopListenerVolumeChanged.bind(this),
      getVolumeFromInput: this.getVolumeFromInput.bind(this),
      getMuteStateFromInput: this.getMuteStateFromInput.bind(this),
      getAvailableAudios: this.getAvailableAudios.bind(this),
      addAudio: this.addAudio.bind(this),
      editAudio: this.editAudio.bind(this),
      removeAudio: this.removeAudio.bind(this),
      updateTextsSettings: this.updateTextsSettings.bind(this),
      toggleMute: this.toggleMute.bind(this),
      changeVolume: this.changeVolume.bind(this),
      firstLoadDone: this.firstLoadDone.bind(this),
      startCoreStats: this.startCoreStats.bind(this),
      stoptCoreStats: this.stoptCoreStats.bind(this),
      startStats: this.startStats.bind(this),
      stopStats: this.stopStats.bind(this),
      toogleStats: this.toogleStats.bind(this),
      sendUpdateToScoreboardWindow: this.sendUpdateToScoreboardWindow.bind(this),
      updateScoreboardSettings: this.updateScoreboardSettings.bind(this),
    };

    // obsWs.on('StreamStarted', async () => {
    //   try {
    //     await this.setState({ live: true });
    //     obsWs.on('StreamStatus', async (data) => {
    //       let oldDroppedFrame = 0;
    //       let cpuUsage: number[] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    //       let memoryUsage: number[] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    //       if(this.state.streamingStats !== undefined) {
    //         oldDroppedFrame = this.state.streamingStats.droppedFrame;
    //         cpuUsage = this.state.streamingStats.cpuUsage;
    //         memoryUsage = this.state.streamingStats.memoryUsage;
    //       }
    //       cpuUsage = this.addToStatArray(data["cpu-usage"], cpuUsage);
    //       memoryUsage = this.addToStatArray(data["memory-usage"], memoryUsage);
    //       await this.setState({
    //         streamingStats: {
    //           oldDroppedFrame,
    //           droppedFrame: data["strain"],
    //           // droppedFrame: (100 * data["num-dropped-frames"]) / data["num-total-frames"],
    //           totalStreamTime: moment().startOf('day').seconds(data["total-stream-time"]).format('HH:mm:ss'),
    //           cpuUsage,
    //           bytesPerSec: data["bytes-per-sec"] * 10,
    //           memoryUsage,
    //         }
    //       });
    //     });
    //   } catch (error) {
        
    //   }
    // });

    // obsWs.on('Heartbeat', async (data) => {
    //   try {
    //     console.log(data);
    //     // if(Object.values(SceneName).includes(data["scene-name"] as SceneName)) {
    //     //   await this.changeActiveScene(data["scene-name"] as SceneName);
    //     // }
    //   } catch (error) {
        
    //   }
    // });
  }
  
  handleCoreStatsDatas = async () => {
    try {
      const stats = await obsWs.call('GetStats');
      let oldDroppedFrame = 0;
      let cpuUsage: Datum[] = [];
      let memoryUsage: Datum[] = [];
      if(this.state.coreStats !== undefined) {
        oldDroppedFrame = this.state.coreStats.droppedFrame;
        cpuUsage = this.state.coreStats.cpuUsage;
        memoryUsage = this.state.coreStats.memoryUsage;
      }
      cpuUsage = this.addToStatArray(stats.cpuUsage, cpuUsage);
      memoryUsage = this.addToStatArray(stats.memoryUsage, memoryUsage);
      
      await this.setState({
        coreStats: {
          cpuUsage,
          memoryUsage,
          oldDroppedFrame,
          droppedFrame: (100 * stats.renderSkippedFrames) / stats.renderTotalFrames,
        }
      });
    } catch (error) {
      console.log(error)
    }
  }

  handleStatsDatas = async () => {
    try {
      const statsStream = await obsWs.call('GetStreamStatus');
      let streamTime = function msToTime(s: number) {
        // Pad to 2 or 3 digits, default is 2
        var pad = (n: number, z = 2) => ('00' + n).slice(-z);
        return pad(s/3.6e6|0) + ':' + pad((s%3.6e6)/6e4 | 0) + ':' + pad((s%6e4)/1000|0);
      }
      await this.setState({
        streamingStats: {
          totalStreamTime: streamTime(statsStream.outputDuration),
          bytesPerSec: (!Number.isFinite((statsStream.outputBytes * 10) / (statsStream.outputDuration / 1000))) ? 0 : (statsStream.outputBytes * 10) / (statsStream.outputDuration / 1000),
        }
      });
    } catch (error) {
      console.log(error)
    }
  }
  
  startStats = async (): Promise<void> => {
    if(this.state.stats.enable) {
      this.intervalStatsId = window.setInterval(this.handleStatsDatas, 1000);
      this.setState({ stats: { enable: this.state.stats.enable, core: this.state.stats.core, stream: true }});
    }
  }
  
  stopStats = async (): Promise<void> => {
    if (this.intervalStatsId) {
      clearInterval(this.intervalStatsId);
    }
    this.setState({ stats: { enable: this.state.stats.enable, core: this.state.stats.core, stream: false }});
  }
  
  startCoreStats = async (): Promise<void> => {
    if(this.state.stats.enable) {
      this.intervalCoreStatsId = window.setInterval(this.handleCoreStatsDatas, 1000);
      this.setState({ stats: { enable: this.state.stats.enable, core: true, stream: this.state.stats.stream }});
    }
  }
  
  stoptCoreStats = async (): Promise<void> => {
    if (this.intervalCoreStatsId) {
      clearInterval(this.intervalCoreStatsId);
    }
    this.setState({ stats: { enable: this.state.stats.enable, core: false, stream: this.state.stats.stream }});
  }

  toogleStats = async (): Promise<void> => {
    if(this.state.stats.enable === false) {
      await this.setState({ stats: { enable: true, core: true, stream: this.state.live ? true : false }});
      await this.startCoreStats();
      if(this.state.live) {
        await this.startStats();
      }
    } else {
      await this.setState({ 
        stats: { 
          enable: false, 
          core: false, 
          stream: this.state.live ? true : false 
        },
        streamingStats: {
          bytesPerSec: 0,
          totalStreamTime: '00:00:00',
        },
        // coreStats: {
        //   cpuUsage: [{ x : new Date(), y: 0 }],
        //   droppedFrame: 0,
        //   memoryUsage: [{ x : new Date(), y: 0 }],
        //   oldDroppedFrame: 0,
        // }
      });
      await this.stoptCoreStats();
      if(this.state.live) {
        await this.stopStats();
      }
    }
  }

  onConnectionClosed = async (): Promise<void> => {
    try {
      await this.setState({ connected2Obs: false });
    } catch (error) {
      
    }
  };

  onCurrentProgramSceneChanged = async (data: any): Promise<void> => {
    try {
      if(Object.values(SceneName).includes(data.sceneName as SceneName)) {
        await this.changeActiveScene(data.sceneName as SceneName);
      }
    } catch (error) {
      
    }
  };

  onStreamStateChanged = async (data: any): Promise<void> => {
    try {
      if(data.outputActive) {
        await this.startStats();
      } else {
        this.stopStats();
      }
      // obsWs.removeAllListeners('StreamStatus');
      await this.setState({ streamingStats: undefined, live: data.outputActive });
    } catch (error) {
      
    }
  };

  componentDidMount = (): void => {
    try {
      setTimeout(async () => {
        const appPaths = await window.app.getPaths();
        await this.setState({ Utilitites: Utilities.getInstance(appPaths) });
        await this.startApp();
      }, 3000);
    } catch (error) {
      console.log(error)
    }
  }

  findIdFromSceneItemName = async (sceneName: string, sourceName: string): Promise<number> => {
    try {
      const { sceneItemId } = await obsWs.call('GetSceneItemId', { sceneName, sourceName });
      return sceneItemId;
    } catch (error) {
      throw error;      
    }
  } 

  startApp = async() => {
    try {      
      const store = await window.app.manageStoredConfig({ action: 'get'});
      await this.setState({ store });
      await this.startCoreStats();
      await this.connectObs();
      await this.getScenes();
      await this.initGameStatut();
      const streamStatus = await obsWs.call('GetStreamStatus');
      if(streamStatus.outputActive) {
        await this.setState({ live: true });
        // obsWs.on('StreamStatus', async (data) => {
        //   let oldDroppedFrame = 0;
        //   let cpuUsage: number[] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        //   let memoryUsage: number[] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        //   if(this.state.streamingStats !== undefined) {
        //     oldDroppedFrame = this.state.streamingStats.droppedFrame;
        //     cpuUsage = this.state.streamingStats.cpuUsage;
        //     memoryUsage = this.state.streamingStats.memoryUsage;
        //   }
        //   cpuUsage = this.addToStatArray(data["cpu-usage"], cpuUsage);
        //   memoryUsage = this.addToStatArray(data["memory-usage"], memoryUsage);
        //   await this.setState({
        //     streamingStats: {
        //       oldDroppedFrame,
        //       droppedFrame: data["strain"],
        //       // droppedFrame: (100 * data["num-dropped-frames"]) / data["num-total-frames"],
        //       totalStreamTime: moment().startOf('day').seconds(data["total-stream-time"]).format('HH:mm:ss'),
        //       cpuUsage,
        //       bytesPerSec: data["bytes-per-sec"] * 10,
        //       memoryUsage,
        //     }
        //   });
        // });
      }
      if(this.state.timeoutConnection) {
        await this.setState({ timeoutConnection: undefined });
      }
      obsWs.on('ConnectionClosed', this.onConnectionClosed);
      obsWs.on('CurrentProgramSceneChanged', this.onCurrentProgramSceneChanged);
      obsWs.on('StreamStateChanged', this.onStreamStateChanged);

      obsWs.once('ExitStarted', () => {
        console.log('OBS started shutdown');
      
        // Just for example, not necessary should you want to reuse this instance by re-connect()
        obsWs.off('ConnectionClosed', this.onConnectionClosed);
        obsWs.off('CurrentProgramSceneChanged', this.onCurrentProgramSceneChanged);
        obsWs.off('StreamStateChanged', this.onStreamStateChanged);
      });
    } catch (error) {
      let timeout = setTimeout(async() => {
        await this.startApp();
      }, 5000);
      await this.setState({ timeoutConnection: timeout });      
    }
  }

  componentWillUnmount = async (): Promise<void> => {
    try {
      await this.disconnectObs();
    } catch (error) {

    }
  }

  // workOnEvent(event: any): void {
  //   // tslint:disable-next-line: no-console
  //   console.debug(event);
  //   switch (event['update-type']) {
  //     case 'SwitchScenes':
  //       // if (event['scene-name'] === AvailableScenes.LIVE && this.replayPlaying) {
  //       //   this.replayPlaying = false;
  //       // }
  //       // if (event['scene-name'] === AvailableScenes.REPLAY && !this.replayPlaying) {
  //       //   this.replayPlaying = true;
  //       // }
  //       // if (this.scenes.find(scene => scene.name === event['scene-name']) !== undefined) {
  //       //   this.scenes.find(scene => scene.active).active = false;
  //       //   this.scenes.find(scene => scene.name === event['scene-name']).active = true;
  //       // }
  //       // // tslint:disable-next-line: no-string-literal
  //       // // this.scenes.find(scene => scene.name === event['scene-name']).sources = event['sources'];
  //       // // this.activeScene = event['scene-name'];
  //       break;
  //     case 'ScenesChanged':
  //     case 'SceneCollectionChanged':
  //     case 'SceneCollectionListChanged':
  //     case 'SwitchTransition':
  //     case 'TransitionListChanged':
  //     case 'TransitionDurationChanged':
  //     case 'ProfileChanged':
  //     case 'ProfileListChanged':
  //       break;
  //     case 'SceneItemVisibilityChanged':
  //       // tslint:disable-next-line: max-line-length
  //       // this.scenes.find(scene => scene.active).sources.find(source => source.name === event['item-name']).render = event['item-visible'];
  //       break;
  //     case 'StreamStatus':
  //       // const streamStatus = new StreamStatus(event);
  //       // // console.log(streamStatus);
  //       // // const newData = [];
  //       // this.streamTime = event['stream-timecode'];
  //       // this.liveUpdateChartData.push({
  //       //   value: [
  //       //     new Date().toISOString(),
  //       //     Math.round(streamStatus.cpuUsage),
  //       //   ],
  //       // });

  //       // this.framesChartData[0].value = streamStatus.numDroppedFrames;
  //       // this.framesChartData[1].value = streamStatus.numTotalFrames - streamStatus.numDroppedFrames;
  //       // if (this.liveUpdateChartData.length > 50) {
  //       //   this.liveUpdateChartData.shift();
  //       // }
  //       // // newData.push({ value: [new Date(), event['cpu-usage']] });
  //       // this.liveUpdateChartData = [...this.liveUpdateChartData];
  //       // this.framesChartData = [...this.framesChartData];
  //       // this.isStreaming = streamStatus.streaming;
  //       // // tslint:disable-next-line: no-string-literal
  //       // // this.isStreaming = event['streaming'];
  //       // // // tslint:disable-next-line: no-string-literal
  //       // // this.isRecording = event['recording'];
  //       // // this.streamLength = event['total-stream-time'];

  //       // // // tslint:disable-next-line: no-string-literal
  //       // // this.fps = event['fps'];
  //       // // this.droppedFrames = event['num-dropped-frames'];
  //       // // this.totalFrames = event['num-total-frames'];
  //       // // // tslint:disable-next-line: no-string-literal
  //       // // this.droppedFramesPercent = event['strain'];
  //       // // this.transmittionSpeed = event['kbits-per-sec'];
  //       // // this.transmittionSpeedB = event['bytes-per-sec'];
  //       // // {
  //       // //   bytes - per - sec: 63972
  //       // //   fps: 30.000000300000007
  //       // //   kbits - per - sec: 499
  //       // //   num - dropped - frames: 1165
  //       // //   num - total - frames: 1473
  //       // //   preview - only: false
  //       // //   recording: false
  //       // //   strain: 1
  //       // //   stream - timecode: "00:00:50.014"
  //       // //   streaming: true
  //       // //   total - stream - time: 50
  //       // //   update - type: "StreamStatus"
  //       // // }
  //       break;

  //     case 'TransitionBegin':
  //       break;
  //     case 'StudioModeSwitched':
  //     case 'StreamStarting':
  //     case 'StreamStopping':
  //     case 'ReplayStarting':
  //     case 'ReplayStarted':
  //     case 'ReplayStopping':
  //     case 'ReplayStopped':
  //       // tslint:disable-next-line:no-console
  //       // console.debug(event);
  //       break;

  //     case 'StreamStarted':
  //       // this.isStreaming = true;

  //       // // start replay buffer
  //       // // this.obsWebsocket.StartReplayBuffer().catch((err: Error) => { console.error(err); });
  //       break;

  //     case 'StreamStopped':
  //       // this.isStreaming = false;
  //       // // reset charts datas
  //       // this.liveUpdateChartData = [];
  //       // this.framesChartData[0].value = 0;
  //       // this.framesChartData[1].value = 0;
  //       // this.framesChartData = [...this.framesChartData];
  //       // // stop replay buffer
  //       // // this.obsWebsocket.StopReplayBuffer().catch((err: Error) => { console.error(err); });
  //       // this.obsWebsocket.setCurrentScene(AvailableScenes.STARTING).catch((err: Error) => { console.error(err); });
  //       break;

  //     default:
  //       // tslint:disable-next-line:no-console
  //       // console.debug(event);
  //       break;
  //   }
  // }

  connectObs = async (): Promise<void> => {
    try {
      await this.setState({ connectingObs: true });
      // await obsWs.connect({ address: 'localhost:4444' });
      await obsWs.connect('ws://127.0.0.1:4444', 'IxqGV59RRNzMyQNo', { 
        eventSubscriptions: EventSubscription.All | EventSubscription.InputVolumeMeters,
      });
      notification['success']({
        message: 'Connecté à OBS',
        // description: '',
        placement: 'bottomRight',
      });
      await this.setState({ connectingObs: false, connected2Obs: true });
    } catch (error: any) {
      notification['error']({
        message: 'Connection à OBS impossible, Retrying...',
        description: `${error.description}`,
        placement: 'bottomRight',
      });
      await this.setState({ connectingObs: false });
      throw error;      
    }
  }

  getScenes = async (): Promise<void> => {
    try {
      let scenesData = await obsWs.call('GetSceneList');
      const scenesDataState = scenesData.scenes.filter((item: any) => {
        const itemGrbg: {sceneIndex: number, sceneName: string} = item as {sceneIndex: number, sceneName: string};
        return !itemGrbg.sceneName.startsWith('*');
        // return !item!.name.startsWith('*');
      });
      await this.changeActiveScene(scenesData.currentProgramSceneName as SceneName);
      await this.setState({ scenes: { currentScene: scenesData.currentProgramSceneName as SceneName, scenes: scenesDataState } });
    } catch (error) {

    }
  }

  initGameStatut = async (): Promise<void> => {
    try {
      const store = this.state.store!;
      // const defaultConfig = GetDefaultConfig();

      //scoreboard      
      await obsWs.call('SetSceneItemEnabled', { sceneItemId: await this.findIdFromSceneItemName(SceneName.Live, 'scoreboard'), sceneItemEnabled: store.GameStatut.Options.showScoreboard, sceneName: SceneName.Live });

      // home team
      await obsWs.call('SetInputSettings', { inputName: 'Home Name Text', inputSettings: { text: store.GameStatut.HomeTeam.name } });
      await obsWs.call('SetInputSettings', { inputName: 'Home City Text', inputSettings: { text: store.GameStatut.HomeTeam.city } });
      await obsWs.call('SetInputSettings', { inputName: 'Home Score Text', inputSettings: { text: store.GameStatut.HomeTeam.score } });
      const bgImgH = await (await obsWs.call('GetInputSettings', { inputName: 'Home Logo' })).inputSettings;
      const bgImgH64 = await this.state.Utilitites!.getBase64FromFilePath(bgImgH.file as string);
      store.GameStatut.HomeTeam.logo = bgImgH64;

      // away team
      await obsWs.call('SetInputSettings', { inputName: 'Away Name Text', inputSettings: { text: store.GameStatut.AwayTeam.name } });
      await obsWs.call('SetInputSettings', { inputName: 'Away City Text', inputSettings: { text: store.GameStatut.AwayTeam.city } });
      await obsWs.call('SetInputSettings', { inputName: 'Away Score Text', inputSettings: { text: store.GameStatut.AwayTeam.score } });
      const bgImgA = await (await obsWs.call('GetInputSettings', { inputName: 'Away Logo' })).inputSettings;
      const bgImgA64 = await this.state.Utilitites!.getBase64FromFilePath(bgImgA.file as string);
      store.GameStatut.AwayTeam.logo = bgImgA64;
      
      await obsWs.call('SetInputSettings', { inputName: 'Week Text', inputSettings: { text: `${store.GameStatut.Options.competition} - ${store.GameStatut.Options.journee}` } });
      
      await obsWs.call('SetInputSettings', { inputName: 'Camera - Field', inputSettings: { duration: store.LiveSettings.buffer * 1000 }});

      await obsWs.call('SetInputSettings', { inputName: 'Replay Video', inputSettings: { duration: store.LiveSettings.buffer * 1000 }});
      
      await window.app.manageObsSettings({ setter: true, bitrate: store.LiveSettings.bitrate });
      await obsWs.call('SetStreamServiceSettings', { streamServiceType: 'rtmp_common', streamServiceSettings: { key: store.LiveSettings.streamKey } });

      await this.updateTextsSettings(store.TextsSettings);

      const bgImg = await (await obsWs.call('GetInputSettings', { inputName: 'Background' })).inputSettings;
      const bgImg64 = await this.state.Utilitites!.getBase64FromFilePath(bgImg.file as string);
      store.BackgroundImage = bgImg64;
      
      await this.setState({ store, firstDatasLoaded: true });
      await this.sendUpdateToScoreboardWindow();
    } catch (error) {
      console.log(error)
    }
  }

  firstLoadDone = async (): Promise<void> => {
    await this.setState({ firstStart: false });
  }

  updateSettings = async (value: any): Promise<void> => {
    try {
      await obsWs.call('SetInputSettings', { inputName: 'Camera - Field', inputSettings: { duration: +value.buffer * 1000 } });
      await obsWs.call('SetInputSettings', { inputName: 'Replay Video', inputSettings: { duration: +value.buffer * 1000 } });
      await obsWs.call('SetStreamServiceSettings', { streamServiceType: 'rtmp_common', streamServiceSettings: { key: value.key } });
      // await obsWs.call('SetProfileParameter', { parameterCategory: 'Output', parameterName: 'VBitrate', parameterValue: value.bitrate });
    
      await window.app.handleUpdater(AutoUpdaterEvent.CHANNELCHANGED, value.updateChannel);
      await window.app.manageObsSettings({ setter: true, bitrate: +value.bitrate });
      let store = this.state.store;
      await window.app.manageStoredConfig({ action: 'set', key: 'LiveSettings.buffer', value: +value.buffer });
      await window.app.manageStoredConfig({ action: 'set', key: 'LiveSettings.streamKey', value: value.key as string });
      await window.app.manageStoredConfig({ action: 'set', key: 'LiveSettings.bitrate', value: +value.bitrate });
      store!.LiveSettings!.bitrate = +value.bitrate;
      store!.LiveSettings!.streamKey = value.key;
      store!.LiveSettings!.buffer = value.buffer;
      await this.setState({ store });
    } catch (error) {

    }
  }

  changeActiveScene = async (name: SceneName): Promise<void> => {
    try {
      await obsWs.call('SetCurrentProgramScene', { sceneName: name });
      let data = this.state.scenes;
      data!.currentScene = name.startsWith('*') ? null : name as string;
      await this.setState({ scenes: data });
    } catch (error) {

    }
  }

  changeActiveCam = async (name: string): Promise<void> => {
    try {
      // TODO: when changing cam, also change the replay source cam
      let store = this.state.store!;
      let { CamerasHardware } = store;
      let oldCam = CamerasHardware.find(item => item.active)!;
      const indexOldCam = CamerasHardware.findIndex(item => item.active)!;
      const sceneItemIdOldCam = await this.findIdFromSceneItemName(SceneName.Live, `Camera - ${oldCam.title}`);
      if(oldCam.title !== 'Field') {
        oldCam.active = false;
        CamerasHardware[indexOldCam] = oldCam;
      }

      let newCam = CamerasHardware.find(item => item.title === name)!;
      const indexNewCam = CamerasHardware.findIndex(item => item.title === name)!;
      const sceneItemIdNewCam = await this.findIdFromSceneItemName(SceneName.Live, `Camera - ${newCam.title}`);
      newCam.active = true;
      CamerasHardware[indexNewCam] = newCam;
      
      store.CamerasHardware = CamerasHardware;

      await obsWs.call('SetSceneItemEnabled', { sceneItemId: sceneItemIdNewCam, sceneItemEnabled: true, sceneName: SceneName.Live });
      if(oldCam.title !== 'Field') {
        await obsWs.call('SetSceneItemEnabled', { sceneItemId: sceneItemIdOldCam, sceneItemEnabled: false, sceneName: SceneName.Live });
      }
      await this.setState({ store });
    } catch (error) {

    }
  }

  addToStatArray = (item: number, originalDatas: Datum[]): Datum[] => {
    let clonnedStats = [...originalDatas];
    if (clonnedStats.length >= 25) {
      clonnedStats.shift();
      clonnedStats.push({ x: new Date(), y: item });
    } else {
      clonnedStats.push({ x: new Date(), y: item });
    }
    return clonnedStats;
  }

  updateLiveStatus = async (): Promise<void> => {
    try {
      if(this.state.live) {
        await obsWs.call('StopStream');
      } else {
        await obsWs.call('StartStream');
      }
      await this.setState({ live: !this.state.live });
    } catch (error) {
      console.log(error)
    }
  }

  updateTextProps = async ({ props, value, homeTeam = false, bg = false, withAnimation = false }: { props: keyof Team; value: string | number | FileUp | Timeout; homeTeam?: boolean; bg?: boolean; withAnimation?: boolean;  }): Promise<void> => {
    try {
      let store = this.state.store!;
      switch (props) {
        case 'city':
          homeTeam ? store.GameStatut.HomeTeam.city = value as string : store.GameStatut.AwayTeam.city = value as string;
          const sourceCityText = homeTeam ? 'Home City Text' : 'Away City Text'
          await obsWs.call('SetInputSettings', { inputName: sourceCityText, inputSettings: { text: value as string } });
          await window.app.manageStoredConfig({ action: 'set', key: homeTeam ? 'GameStatut.HomeTeam.city' : 'GameStatut.AwayTeam.city', value: value as string });
          break;
        case 'color':
          homeTeam ? store.GameStatut.HomeTeam.color = value as string : store.GameStatut.AwayTeam.color = value as string;
          await window.app.manageStoredConfig({ action: 'set', key: homeTeam ? 'GameStatut.HomeTeam.color' : 'GameStatut.AwayTeam.color', value: value as string });
          // homeTeam ? await obsWs.send('SetTextGDIPlusProperties', { source: 'Home Name Text', text: value as string }) : await obsWs.send('SetTextGDIPlusProperties', { source: 'Away Name Text', text: value as string });
          break;
        case 'logo':
          if(bg) {
            const base64Img: string = await this.state.Utilitites!.getBase64((value as FileUp));
            store.BackgroundImage = base64Img;
            let arrayPath = (value as FileUp).pathElectron.split('\\');
            const obsPath = '../../../../' + arrayPath.slice(Math.max(arrayPath.length - 2, 1)).join('/');
            await obsWs.call('SetInputSettings', { inputName: 'Background', inputSettings: { file: obsPath } });
          } else {
            const base64Img: string = await this.state.Utilitites!.getBase64((value as FileUp));
            homeTeam ? store.GameStatut.HomeTeam.logo = base64Img : store.GameStatut.AwayTeam.logo = base64Img;
            let arrayPath = (value as FileUp).pathElectron.split('\\');
            const obsPath = '../../../../' + arrayPath.slice(Math.max(arrayPath.length - 2, 1)).join('/');
            const sourceCityText = homeTeam ? 'Home Logo' : 'Away Logo'
            await obsWs.call('SetInputSettings', { inputName: sourceCityText, inputSettings: { file: obsPath } });
          }
          break;
        case 'name':
          homeTeam ? store.GameStatut.HomeTeam.name = value as string : store.GameStatut.AwayTeam.name = value as string;
          const sourceNameText = homeTeam ? 'Home Name Text' : 'Away Name Text'
          await obsWs.call('SetInputSettings', { inputName: sourceNameText, inputSettings: { text: value as string } });
          await window.app.manageStoredConfig({ action: 'set', key: homeTeam ? 'GameStatut.HomeTeam.name' : 'GameStatut.AwayTeam.name', value: value as string });
          break;
        case 'score':
          homeTeam ? store.GameStatut.HomeTeam.score = Math.trunc(value as number) : store.GameStatut.AwayTeam.score = Math.trunc(value as number);
          const score: string = homeTeam ? '' + store.GameStatut.HomeTeam.score : '' +store.GameStatut.AwayTeam.score;
          const sourceScoreText = homeTeam ? 'Home Score Text' : 'Away Score Text'
          await obsWs.call('SetInputSettings', { inputName: sourceScoreText, inputSettings: { text: score.padStart(2, '0') } });
          await window.app.manageStoredConfig({ action: 'set', key: homeTeam ? 'GameStatut.HomeTeam.score' : 'GameStatut.AwayTeam.score', value: score });
          break;
        case 'timeout':
          let animate = withAnimation && (homeTeam ? store.GameStatut.HomeTeam.timeout > value : store.GameStatut.AwayTeam.timeout > value);
          homeTeam ? store.GameStatut.HomeTeam.timeout = value as Timeout : store.GameStatut.AwayTeam.timeout = value as Timeout ;          
          if(animate) {
            const timeoutItemId = await this.findIdFromSceneItemName(SceneName.Live, AnimationType.TIMEOUT);
            await obsWs.call('SetSceneItemEnabled', { sceneItemId: timeoutItemId, sceneItemEnabled: true, sceneName: SceneName.Live });
            setTimeout(async () => {
              await obsWs.call('SetSceneItemEnabled', { sceneItemId: timeoutItemId, sceneItemEnabled: false, sceneName: SceneName.Live });
            }, 4000);
          }
          await window.app.manageStoredConfig({ action: 'set', key: homeTeam ? 'GameStatut.HomeTeam.timeout' : 'GameStatut.AwayTeam.timeout', value: value as Timeout });
          break;

        default:
          break;
      }
      await this.setState({ store });
      await this.sendUpdateToScoreboardWindow();
    } catch (error) {

    }
  }

  updateGameEventProps = async ({ props, value }: { props: keyof GameEvent; value: boolean | Quarter | TeamPossession | string; }): Promise<void> => {
    try {
      let store = this.state.store!;
      switch (props) {
        case 'quarter':
          store.GameStatut.Options.quarter = value as Quarter;          
          await window.app.manageStoredConfig({ action: 'set', key: 'GameStatut.Options.quarter', value: value as Quarter });
          break;
        case 'showScoreboard':
          store.GameStatut.Options.showScoreboard = value as boolean;
          await obsWs.call('SetSceneItemEnabled', { sceneItemId: await this.findIdFromSceneItemName(SceneName.Live, 'scoreboard'), sceneItemEnabled: value as boolean, sceneName: SceneName.Live });
          await window.app.manageStoredConfig({ action: 'set', key: 'GameStatut.Options.showScoreboard', value: value as boolean });
          break;
        case 'flag':
          store.GameStatut.Options.flag = value as boolean;
          break;
        case 'possession':
          store.GameStatut.Options.possession = value as TeamPossession;
          break;
        case 'competition':
          store.GameStatut.Options.competition = value as string;
          await obsWs.call('SetInputSettings', { inputName: 'Week Text', inputSettings: { text: value as string + ' - ' + store.GameStatut.Options.journee } });
          await window.app.manageStoredConfig({ action: 'set', key: 'GameStatut.Options.competition', value: value as string });
          break;
        case 'journee':
          store.GameStatut.Options.journee = value as string;
          await obsWs.call('SetInputSettings', { inputName: 'Week Text', inputSettings: { text: store.GameStatut.Options.competition + ' - ' + value as string } });
          await window.app.manageStoredConfig({ action: 'set', key: 'GameStatut.Options.journee', value: value as string });
          break;

        default:
          break;
      }
      await this.setState({ store });
      await this.sendUpdateToScoreboardWindow();
    } catch (error) {

    }
  }
  
  setScore = async ({ isHomeTeam, scoreType, withAnimation = false }: { isHomeTeam: boolean; scoreType: ScoreType; withAnimation?: boolean; }) => {
    try {
      let scoreAdded = 0;
      switch (scoreType) {
        case ScoreType.TOUCHDOWN:
          scoreAdded = 6;
          break;
        case ScoreType.SAFETY:
        case ScoreType.EXTRAPOINT:
          scoreAdded = 2;
          break;
        case ScoreType.PAT:
          scoreAdded = 1;
          break;
        case ScoreType.FIELDGOAL:
          scoreAdded = 3;
          break;
      
        default:
          break;
      }
      let store = this.state.store!;
      const scoreToDisplay = isHomeTeam ? store.GameStatut.HomeTeam.score + scoreAdded : store.GameStatut.AwayTeam.score + scoreAdded;
      await this.updateTextProps({ props: 'score', value: scoreToDisplay, homeTeam: isHomeTeam });
      if(withAnimation) {
        const scoreItemId = await this.findIdFromSceneItemName(SceneName.ScoreBackground, scoreType as string);
        await obsWs.call('SetSceneItemEnabled', { sceneItemId: scoreItemId, sceneItemEnabled: true, sceneName: SceneName.Live });
        setTimeout(async () => {
          await obsWs.call('SetSceneItemEnabled', { sceneItemId: scoreItemId, sceneItemEnabled: false, sceneName: SceneName.Live });
        }, 5000);
      }
    } catch (error) {
      
    }
  };

  changePossession = async () => {
    try {
      let store = this.state.store!;
      let value = TeamPossession.HOME;
      if (store.GameStatut.Options.possession === TeamPossession.HOME) {
        value = TeamPossession.AWAY;
      } else if (store.GameStatut.Options.possession === TeamPossession.AWAY) {
        value = TeamPossession.HOME;
      }
      await this.updateGameEventProps({ props: 'possession', value });
    } catch (error) {
      
    }
  }

  startReplay = async () => {
    try {
      if(this.state.scenes?.currentScene !== SceneName.Replay) {
        // console.log(await obsWs.call('GetSceneItemList', { sceneName: SceneName.Replay }));
        // await obsWs.call('PressInputPropertiesButton', { inputName: 'Replay Video', propertyName: 'Load Replay' });
        await obsWs.call('TriggerHotkeyByKeySequence', { keyId: 'OBS_KEY_F10' });
        await this.changeActiveScene(SceneName.Replay);
        // setTimeout(async () => {
        //   await this.changeActiveScene(SceneName.Live);
        // }, this.state.store?.LiveSettings.buffer);
      }
    } catch (error) {
      console.log(error)
    }
  }

  
  getScreenshot = async ({ imageWidth = 450, imageHeight = 254 }: { imageWidth?: number, imageHeight?: number }): Promise<{ img?: string }> => {
    try {
      let data = await obsWs.call('GetSourceScreenshot', { sourceName: this.state.scenes?.currentScene!, imageFormat: 'jpeg', imageWidth, imageHeight });
      return { img: data.imageData };
    } catch (error) {
      return {};
    }
  }
  
  resetGame = async(): Promise<void> => {
    try {
      const defaultConfig = GetDefaultConfig();
      // score reset
      await await this.updateTextProps({ props: 'score', value: 0, homeTeam: true });
      await await this.updateTextProps({ props: 'score', value: 0, homeTeam: false });
      // scoreboard
      await this.updateGameEventProps({ props: "showScoreboard", value: defaultConfig.GameStatut.Options.showScoreboard });
      // Compet Day
      // await this.updateGameEventProps({ props: "competition", value: defaultConfig.GameStatut.Options.competition });
      // await this.updateGameEventProps({ props: "journee", value: defaultConfig.GameStatut.Options.journee });
      // home Team
      // await this.updateTextProps({ props: "city", value: defaultConfig.GameStatut.HomeTeam.city, homeTeam: true });
      // await this.updateTextProps({ props: "name", value: defaultConfig.GameStatut.HomeTeam.name, homeTeam: true });
      // await this.updateTextProps({ props: "logo", value: defaultConfig.GameStatut.HomeTeam.logo, homeTeam: true });
      // away Team
      // await this.updateTextProps({ props: "city", value: defaultConfig.GameStatut.AwayTeam.city });
      // await this.updateTextProps({ props: "name", value: defaultConfig.GameStatut.AwayTeam.name });
      // await this.updateTextProps({ props: "logo", value: defaultConfig.GameStatut.AwayTeam.logo });

      // background image
      // await this.updateTextProps({ props: "logo", value: defaultConfig.BackgroundImage!, bg: true });
      
      // set beginning scene
      await obsWs.call('SetCurrentProgramScene', { sceneName: SceneName.Starting });

      await this.setState({ store: defaultConfig });
      await this.sendUpdateToScoreboardWindow();
    } catch (error) {
      
    }
  }
  
  newGame = async({ name1, name2, city1, city2, logo1, logo2 }: { name1: string, name2: string, city1?: string, city2?: string, logo1?: string, logo2?: string }): Promise<void> => {
    try {
      // score reset
      await await this.updateTextProps({ props: 'score', value: 0, homeTeam: true });
      await await this.updateTextProps({ props: 'score', value: 0, homeTeam: false });
      // home Team
      await this.updateTextProps({ props: "name", value: name1, homeTeam: true });
      if (city1) {
        await this.updateTextProps({ props: "city", value: city1, homeTeam: true });
      }
      if (logo1) {
        await this.updateTextProps({ props: "logo", value: logo1, homeTeam: true });
      }
      // away Team
      await this.updateTextProps({ props: "name", value: name2 });      
      if (city2) {
        await this.updateTextProps({ props: "city", value: city2 });
      }
      if (logo2) {
        await this.updateTextProps({ props: "logo", value: logo2 });
      }
      
      // set beginning scene
      await obsWs.call('SetCurrentProgramScene', { sceneName: SceneName.Starting });
    } catch (error) {
      
    }
  }
  
  startStopClock = async (isTimeout: boolean = false): Promise<void> => {
    try {
      let store = this.state.store!;
      const { clock } = store.GameStatut.Options;
      if(clock.active) {
        if (clock.isOn || isTimeout) {
          clock.isOn = false;
          if(this.intervalClockId) {
            clearInterval(this.intervalClockId);
            this.intervalClockId = undefined;
          }
          await this.setState({ store });
        } else {
          clock.isOn = true;
          this.intervalClockId = window.setInterval(async () => {
            try {
              let store = this.state.store!;
              const { clock } = store.GameStatut.Options;
              if (clock.seconds > 0) {
                clock.seconds -= 1;
                  // this.setState(({ seconds }) => ({
                  //     seconds: seconds - 1
                  // }))
              }
              else {
                if (clock.minutes === 0) {
                  clock.isOn = false;
                  if(this.intervalClockId) {
                    clearInterval(this.intervalClockId);
                    this.intervalClockId = undefined;
                  }
                } else {
                  clock.minutes -= 1;
                  clock.seconds = 59;
                }
              }
              await this.setState({ store });
              await this.sendUpdateToScoreboardWindow();
            } catch (error) {
              
            }
          }, 1000); 
          await this.setState({ store });
        }
      }
    } catch (error) {
      
    }
  }

  resetClock = async (): Promise<void> => {
    try {      
      const defaultConfig = GetDefaultConfig();
      let store = this.state.store!;
      if(this.intervalClockId) {
        clearInterval(this.intervalClockId);
        this.intervalClockId = undefined;
      }
      store.GameStatut.Options.clock = {
        ...store.GameStatut.Options.clock,
        ...{
          minutes: defaultConfig.GameStatut.Options.clock.minutes,
          seconds: defaultConfig.GameStatut.Options.clock.seconds,
          isOn: false,
        }
      };
      await this.setState({ store });
      await this.sendUpdateToScoreboardWindow();
    } catch (error) {
      
    }    
  }

  toggleClock = async (): Promise<void> => {
    try {
      let store = this.state.store!;
      store.GameStatut.Options.clock.active = !store.GameStatut.Options.clock.active;
      if (store.GameStatut.Options.clock.isOn) {
        store.GameStatut.Options.clock.isOn = false; 
        if(this.intervalClockId) {
          clearInterval(this.intervalClockId);
          this.intervalClockId = undefined;
        }
      }
      await this.setState({ store });
      await this.sendUpdateToScoreboardWindow();
    } catch (error) {
      
    }
  }

  setGameClock = async ({ minutes, seconds }: { minutes: number, seconds: number }): Promise<void> => {
    try {
      let store = this.state.store!;
      store.GameStatut.Options.clock = {
        ...store.GameStatut.Options.clock,
        ...{
          minutes,
          seconds,
        }
      };
      await this.setState({ store });
      await this.sendUpdateToScoreboardWindow();
    } catch (error) {
      
    }
  }

  togglePlayerHighlight = async (show: boolean, uuid: string): Promise<void> => {
    try {      
      const store = this.state.store!;
      const player: Player | undefined = store.Players.find(p => p.uuid === uuid);
      if(player) {
        await obsWs.call('SetInputSettings', { inputName: 'player_name', inputSettings: { text: `#${player.num} ${player.lastname.toUpperCase()} ${Utilities.capitalize(player.firstname)}` } });
        await obsWs.call('SetInputSettings', { inputName: 'player_details', inputSettings: { text: `${player.position}     ${player.lastname.toUpperCase()}     ${Utilities.capitalize(player.firstname)}` } });
        await obsWs.call('SetInputSettings', { inputName: 'player_media', inputSettings: { file: player.media } });
        // setTimeout(async () => {
        //   await obsWs.send('SetSceneItemProperties', { item: { name: 'Player Highlight' }, visible: false, 'scene-name': SceneName.Live, bounds: {}, crop: {}, position: {}, scale: {} });
        // }, 5000);
      }
      await obsWs.call('SetSceneItemEnabled', { sceneItemId: await this.findIdFromSceneItemName(SceneName.Live, 'Player Highlight'), sceneItemEnabled: show, sceneName: SceneName.Live });
    } catch (error) {
      
    }
  }

  toggleSponsor = async ({show, uuid, previousScene, sponsorDisplayType}: {show: boolean, uuid: string, previousScene: SceneName, sponsorDisplayType?: SponsorDisplayType}): Promise<void> => {
    try {
      await this.resetSponosorScene();
      if(show) {
        const store = this.state.store!;
        const sponsor: Sponsor | undefined = store.Sponsors.find(p => p.uuid === uuid);
        let sourceName;
        switch (sponsor?.mediaType!) {
          case MediaType.Video:
            sourceName = 'sponsor_video';
            await obsWs.call('SetInputSettings', { inputName: sourceName, inputSettings: { local_file: sponsor?.media } });
            break;
          case MediaType.Image:
          default:
            sourceName = 'sponsor_image';
            await obsWs.call('SetInputSettings', { inputName: sourceName, inputSettings: { file: sponsor?.media } });
            break;
        }
        await obsWs.call('SetSceneItemEnabled', { sceneItemId: await this.findIdFromSceneItemName("* Sponsor media", sourceName), sceneItemEnabled: true, sceneName: "* Sponsor media" });
        await obsWs.call('SetSceneItemEnabled', { sceneItemId: await this.findIdFromSceneItemName(SceneName.Sponsors, sponsorDisplayType + '_sponsor'), sceneItemEnabled: true, sceneName: SceneName.Sponsors });
        let id: number;
        if(sponsorDisplayType) {
          switch (previousScene) {
            case SceneName.Ending:
              id = sponsorDisplayType === SponsorDisplayType.Small ? SponsorDisplayTypeSceneIdSmall.Ending : SponsorDisplayTypeSceneIdBig.Ending;
              break;
            case SceneName.Halftime:
              id = sponsorDisplayType === SponsorDisplayType.Small ? SponsorDisplayTypeSceneIdSmall.Halftime : SponsorDisplayTypeSceneIdBig.Halftime;
              break;
            case SceneName.Starting:
              id = sponsorDisplayType === SponsorDisplayType.Small ? SponsorDisplayTypeSceneIdSmall.Starting : SponsorDisplayTypeSceneIdBig.Starting;
              break;
          
            case SceneName.Live:
            default:
              id = sponsorDisplayType === SponsorDisplayType.Small  ? SponsorDisplayTypeSceneIdSmall.Live : SponsorDisplayTypeSceneIdBig.Live;
              break;
          }
          await obsWs.call('SetSceneItemEnabled', { sceneItemId: id, sceneItemEnabled: true, sceneName: SceneName.Sponsors });
        }
        await this.changeActiveScene(SceneName.Sponsors);
      } else {
        await this.changeActiveScene(previousScene);
      }
    } catch (error) {
      
    }
  }

  resetSponosorScene = async (): Promise<void> => {
    try {
      await obsWs.call('SetInputSettings', { inputName: 'sponsor_video', inputSettings: { local_file: "" } });
      await obsWs.call('SetInputSettings', { inputName: 'sponsor_image', inputSettings: { file: "" } });
      await obsWs.call('SetSceneItemEnabled', { sceneItemId: await this.findIdFromSceneItemName("* Sponsor media", 'sponsor_video'), sceneItemEnabled: false, sceneName: "* Sponsor media" });
      await obsWs.call('SetSceneItemEnabled', { sceneItemId: await this.findIdFromSceneItemName("* Sponsor media", 'sponsor_image'), sceneItemEnabled: false, sceneName: "* Sponsor media" });
      Object.values(SponsorDisplayType).forEach(async element => {
        await obsWs.call('SetSceneItemEnabled', { sceneItemId:await  this.findIdFromSceneItemName(SceneName.Sponsors, element + '_sponsor'), sceneItemEnabled: false, sceneName: SceneName.Sponsors });
        if(element === SponsorDisplayType.Small) {
          Object.values(SponsorDisplayTypeSceneIdSmall).forEach(async id => {
            if (isNaN(Number(id))) {
              return;
            }
            await obsWs.call('SetSceneItemEnabled', { sceneItemId: id as number, sceneItemEnabled: false, sceneName: SceneName.Sponsors });
          });
        }
        if(element === SponsorDisplayType.Big) {
          Object.values(SponsorDisplayTypeSceneIdBig).forEach(async id => {
            if (isNaN(Number(id))) {
              return;
            }
            await obsWs.call('SetSceneItemEnabled', { sceneItemId: id as number, sceneItemEnabled: false, sceneName: SceneName.Sponsors });
          });
        }
      });
    } catch (error) {
      
    }
  }

  sendUpdateToScoreboardWindow = async (): Promise<void> => {
    try {      
      const store = this.state.store!;
      let GameStatut: IGameStatut = {...store.GameStatut};
      GameStatut.AwayTeam.logo = this.state.Utilitites!.getImageFullPath(GameStatut.AwayTeam.logo);
      GameStatut.HomeTeam.logo = this.state.Utilitites!.getImageFullPath(GameStatut.HomeTeam.logo);
      window.app.sendToScoreboard({ body: { GameStatut: store.GameStatut, LiveSettings: store.LiveSettings }});
    } catch (error) {
      
    }
  }

  updateSponsorsList = async (sponsors: Sponsor[]): Promise<void> => {
    try {
      let store = this.state.store!;
      store.Sponsors = sponsors;
      await this.setState({ store });
    } catch (error) {
      
    }
  }

  updatePlayersList = async (players: Player[]): Promise<void> => {
    try {
      let store = this.state.store!;
      store.Players = players;
      await this.setState({ store });
    } catch (error) {
      
    }
  }

  addCamera = async (camera: CameraHardware): Promise<void> => {
    try {
      const cameraSettings = {
        last_video_device_id: camera.deviceid,
        video_device_id: camera.deviceid,
      }
      await obsWs.call('CreateInput', { sceneName: SceneName.Live, inputName: 'Camera - ' + camera.title, inputKind: 'dshow_input', inputSettings: cameraSettings, sceneItemEnabled: camera.active });
      let store = this.state.store!;
      store.CamerasHardware.push(camera);
      await this.setState({ store });
      await this.reorderLiveScene();
    } catch (error) {
      
    }
  }

  editCamera = async (camera: CameraHardware): Promise<void> => {
    try {
      let store = this.state.store!;
      // const camIndex = store.CamerasHardware.findIndex((cam) => cam.deviceId === camera.deviceId);
      // this.state.scenes?.scenes.
      // await obsWs.send('DeleteSceneItem', { scene: SceneName.Live, item: { name: '', id: '' } });
      const cameraSettings = (camera.title === 'Field') ?
      {
        last_video_device_id: camera.deviceid,
        source: 'Camera - ' + camera.title,
        video_device_id: camera.deviceid,
      } :
      {
        last_video_device_id: camera.deviceid,
        video_device_id: camera.deviceid,
      }; 
      await obsWs.call('SetInputSettings', { inputName: 'Camera - ' + camera.title, inputSettings: cameraSettings });
      const camIndex = store.CamerasHardware.findIndex((cam) => cam.uuid === camera.uuid);
      store.CamerasHardware[camIndex] = camera;
      await this.setState({ store });
    } catch (error) {
      
    }
  }

  removeCamera = async (camera: CameraHardware): Promise<void> => {
    try {
      let store = this.state.store!;
      const { sceneItemId } = await obsWs.call('GetSceneItemId', { sceneName: SceneName.Live, sourceName: 'Camera - ' + camera.title });
      await obsWs.call('RemoveSceneItem', { sceneName: SceneName.Live , sceneItemId });
      const camIndex = store.CamerasHardware.findIndex((item) => item.uuid === camera.uuid);
      store.CamerasHardware.splice(camIndex, 1);
      await this.setState({ store });
      await this.reorderLiveScene();
    } catch (error) {
      console.log(error)
    }
  }

  getAvailableCameras = async (): Promise<OBSInputProps[]> => {
    try {
      const itemsIn = await (await obsWs.call('GetInputPropertiesListPropertyItems', {inputName: 'Camera - Field', propertyName: 'video_device_id'})).propertyItems as OBSInputProps[]
      return itemsIn;
    } catch (error) {
      throw error;
    }
  }

  reorderLiveScene = async (): Promise<void> => {
    let index = 0;
    // soundboard
    let sceneItem = await obsWs.call('GetSceneItemId', { sceneName: SceneName.Live, sourceName: SceneName.Soundboard });    
    await obsWs.call('SetSceneItemIndex', { sceneName: SceneName.Live , sceneItemId: sceneItem.sceneItemId, sceneItemIndex: index }); 
    index++;
    // Cameras
    if(this.state.store?.CamerasHardware) {
      for (const camera of this.state.store?.CamerasHardware) {
        sceneItem = await obsWs.call('GetSceneItemId', { sceneName: SceneName.Live, sourceName: 'Camera - ' + camera.title });
        await obsWs.call('SetSceneItemIndex', { sceneName: SceneName.Live , sceneItemId: sceneItem.sceneItemId, sceneItemIndex: index });   
        index++;
      }
    }
    // player Highlight
    sceneItem = await obsWs.call('GetSceneItemId', { sceneName: SceneName.Live, sourceName: 'Player Highlight' });
    await obsWs.call('SetSceneItemIndex', { sceneName: SceneName.Live , sceneItemId: sceneItem.sceneItemId, sceneItemIndex: index });   
    index++;
    // Animations
    sceneItem = await obsWs.call('GetSceneItemId', { sceneName: SceneName.Live, sourceName: 'Animations' });
    await obsWs.call('SetSceneItemIndex', { sceneName: SceneName.Live , sceneItemId: sceneItem.sceneItemId, sceneItemIndex: index });   
    index++;
    // scoreboard
    sceneItem = await obsWs.call('GetSceneItemId', { sceneName: SceneName.Live, sourceName: 'scoreboard' });
    await obsWs.call('SetSceneItemIndex', { sceneName: SceneName.Live , sceneItemId: sceneItem.sceneItemId, sceneItemIndex: index });
  }

  addAudio = async (audio: AudioHardware): Promise<void> => {
    try {
      const audioSettings = {
        active: true,
        device_id: audio.deviceid,
      }
      await obsWs.call('CreateInput', { sceneName: SceneName.Soundboard, inputName: audio.title, inputKind: audio.type, inputSettings: audioSettings });
      let store = this.state.store!;
      store.AudioHardware.push(audio);
      await this.setState({ store });
    } catch (error) {
      
    }
  }

  editAudio = async (audio: AudioHardware): Promise<void> => {
    try {
      let store = this.state.store!;    
      const cameraSettings = {
        device_id: audio.deviceid,
      }
      await obsWs.call('SetInputSettings', { inputName: audio.title, inputSettings: cameraSettings });
      const audioIndex = store.AudioHardware.findIndex((item) => item.uuid === audio.uuid);
      store.AudioHardware[audioIndex] = audio;
      await this.setState({ store });
    } catch (error) {
      
    }
  }

  removeAudio = async (audio: AudioHardware): Promise<void> => {
    try {
      let store = this.state.store!;
      const { sceneItemId } = await obsWs.call('GetSceneItemId', { sceneName: SceneName.Soundboard, sourceName: audio.title });
      await obsWs.call('RemoveSceneItem', { sceneName: SceneName.Soundboard , sceneItemId });
      const audioIndex = store.AudioHardware.findIndex((item) => item.uuid === audio.uuid);
      store.AudioHardware.splice(audioIndex, 1);
      await this.setState({ store });
    } catch (error) {
      console.log(error)
    }
  }

  getAvailableAudios = async (): Promise<{ type: AudioType, devices: OBSInputProps[] }[]> => {
    try {
      const { sceneItemId: sceneItemIdIn } = await obsWs.call('CreateInput', { sceneName: SceneName.Soundboard, inputName: 'tempInput', inputKind: AudioType.Input, sceneItemEnabled: false });
      const itemsIn = await (await obsWs.call('GetInputPropertiesListPropertyItems', {inputName: 'tempInput', propertyName: 'device_id'})).propertyItems as OBSInputProps[];
      await obsWs.call('RemoveSceneItem', { sceneName: SceneName.Soundboard , sceneItemId: sceneItemIdIn });

      const { sceneItemId: sceneItemIdOut } = await obsWs.call('CreateInput', { sceneName: SceneName.Soundboard, inputName: 'tempOutput', inputKind: AudioType.Output, sceneItemEnabled: false });
      const itemOut = await (await obsWs.call('GetInputPropertiesListPropertyItems', {inputName: 'tempOutput', propertyName: 'device_id'})).propertyItems as OBSInputProps[];
      await obsWs.call('RemoveSceneItem', { sceneName: SceneName.Soundboard , sceneItemId: sceneItemIdOut });
      return [{ type: AudioType.Input, devices: itemsIn }, { type: AudioType.Output, devices: itemOut }];

    } catch (error) {
      throw error;
    }
  }
  
  updateTextsSettings = async (values: TextsSettings): Promise<void> => {
    // titles
    let store = this.state.store!;
    store.TextsSettings = values;
    await this.setState({ store });
    let font = await (await obsWs.call('GetInputSettings', { inputName: 'Coming Soon Text' })).inputSettings.font as any;
    font.face = values.font;
    await obsWs.call('SetInputSettings', { inputName: 'Coming Soon Text', inputSettings: { color: this.state.Utilitites!.HEXToVBColor(values.journeyColor), font } });
    font = await (await obsWs.call('GetInputSettings', { inputName: 'Week Text' })).inputSettings.font as any;
    font.face = values.font;
    await obsWs.call('SetInputSettings', { inputName: 'Week Text', inputSettings: { color: this.state.Utilitites!.HEXToVBColor(values.journeyColor), font } });
    font = await (await obsWs.call('GetInputSettings', { inputName: 'Halftime Text' })).inputSettings.font as any;
    font.face = values.font;
    await obsWs.call('SetInputSettings', { inputName: 'Halftime Text', inputSettings: { color: this.state.Utilitites!.HEXToVBColor(values.journeyColor), font } });
    font = await (await obsWs.call('GetInputSettings', { inputName: 'Ending Text' })).inputSettings.font as any;
    font.face = values.font;
    await obsWs.call('SetInputSettings', { inputName: 'Ending Text', inputSettings: { color: this.state.Utilitites!.HEXToVBColor(values.journeyColor), font } });
    font = await (await obsWs.call('GetInputSettings', { inputName: 'Replay Text' })).inputSettings.font as any;
    font.face = values.font;
    await obsWs.call('SetInputSettings', { inputName: 'Replay Text', inputSettings: { font } });

    // home team
    font = await (await obsWs.call('GetInputSettings', { inputName: 'Home Name Text' })).inputSettings.font as any;
    font.face = values.font;
    await obsWs.call('SetInputSettings', { inputName: 'Home Name Text', inputSettings: { color: this.state.Utilitites!.HEXToVBColor(values.homeTeamColor), font } });
    font = await (await obsWs.call('GetInputSettings', { inputName: 'Home City Text' })).inputSettings.font as any;
    font.face = values.font;
    await obsWs.call('SetInputSettings', { inputName: 'Home City Text', inputSettings: { color: this.state.Utilitites!.HEXToVBColor(values.homeTeamColor), font } });

    // away team
    font = await (await obsWs.call('GetInputSettings', { inputName: 'Away Name Text' })).inputSettings.font as any;
    font.face = values.font;
    await obsWs.call('SetInputSettings', { inputName: 'Away Name Text', inputSettings: { color: this.state.Utilitites!.HEXToVBColor(values.awayTeamColor), font } });
    font = await (await obsWs.call('GetInputSettings', { inputName: 'Away City Text' })).inputSettings.font as any;
    font.face = values.font;
    await obsWs.call('SetInputSettings', { inputName: 'Away City Text', inputSettings: { color: this.state.Utilitites!.HEXToVBColor(values.awayTeamColor), font } });

    // score
    font = await (await obsWs.call('GetInputSettings', { inputName: 'Score Separator Text' })).inputSettings.font as any;
    font.face = values.font;
    await obsWs.call('SetInputSettings', { inputName: 'Score Separator Text', inputSettings: { color: this.state.Utilitites!.HEXToVBColor(values.scoreColor), font } });
    font = await (await obsWs.call('GetInputSettings', { inputName: 'Away Score Text' })).inputSettings.font as any;
    font.face = values.font;
    await obsWs.call('SetInputSettings', { inputName: 'Away Score Text', inputSettings: { color: this.state.Utilitites!.HEXToVBColor(values.scoreColor), font } });
    font = await (await obsWs.call('GetInputSettings', { inputName: 'Home Score Text' })).inputSettings.font as any;
    font.face = values.font;
    await obsWs.call('SetInputSettings', { inputName: 'Home Score Text', inputSettings: { color: this.state.Utilitites!.HEXToVBColor(values.scoreColor), font } });
  }

  disconnectObs = (): void => {    
    if (this.intervalCoreStatsId) {
      clearInterval(this.intervalCoreStatsId);
      // await this.setState({ timeout: undefined, preview: undefined });
    }
    obsWs.disconnect();
    obsWs.removeListener('ConnectionClosed', () => { });
  }

  goLive = async (): Promise<void> => {
    await this.setState({ live: !this.state.live });
  }

  getAudioSources = async (): Promise<any[]> => {
    let audioSources = await obsWs.call('GetSceneItemList', {sceneName: SceneName.Soundboard});
    // console.log(await obsWs.call('GetSceneItemList', {sceneName: SceneName.Live}))
    // console.log(await obsWs.call('GetInputList', {inputKind: 'wasapi_output_capture'}))
    // console.log(audioSources);
    return audioSources.sceneItems.filter((source: any) => source && source.inputKind === 'audio');
  }

  startListenerVolumeter = (listenerFunc: (args_0: { inputs: any; }) => void): void => {
    obsWs.addListener("InputVolumeMeters", listenerFunc);
  }

  stopListenerVolumeter = (): void => {
    obsWs.removeAllListeners("InputVolumeMeters");
  }

  startListenerMutedState = (listenerFunc: (args_0: { inputName: string; inputMuted: boolean; }) => void): void => {
    obsWs.addListener("InputMuteStateChanged", listenerFunc);
  }

  stopListenerMutedState = (): void => {
    obsWs.removeAllListeners("InputMuteStateChanged");
  } 

  startListenerVolumeChanged = (listenerFunc: (args_0: { inputName: string; inputVolumeMul: number; inputVolumeDb: number; }) => void): void => {
    obsWs.addListener("InputVolumeChanged", listenerFunc);
  }

  stopListenerVolumeChanged = (): void => {
    obsWs.removeAllListeners("InputVolumeChanged");
  }

  getVolumeFromInput = async (inputName: string): Promise<number> => {
    try {
      const vol = await obsWs.call('GetInputVolume', { inputName });
      return vol.inputVolumeDb;
    } catch (error) {
      console.log(error);
      throw error;      
    }      
  }

  getMuteStateFromInput = async (inputName: string): Promise<boolean> => {
    try {
      const vol = await obsWs.call('GetInputMute', { inputName });
      return vol.inputMuted;
    } catch (error) {
      console.log(error);
      throw error;      
    }      
  } 

  toggleMute = async (inputName: string): Promise<void> => {
    try {
      await obsWs.call('ToggleInputMute', { inputName });
    } catch (error) {
      console.log(error);
      throw error;      
    }
  }

  
  changeVolume = async (inputVolumeDb: number, inputName: string): Promise<void> => {    
    try {
      await obsWs.call('SetInputVolume', { inputName, inputVolumeDb });
    } catch (error) {
      console.log(error);
      throw error;      
    }
  } 

  
  updateScoreboardSettings = async (values: ScoreboardSettings): Promise<void> => {
    let store = this.state.store!;
    store.ScoreboardSettings = values;
    await this.setState({ store });
    const sceneItemId = await this.findIdFromSceneItemName(SceneName.Live, 'scoreboard');
    switch (values.style) {
      case ScoreboardSettingsStyle.STYLE2:
        await obsWs.call('SetSceneItemTransform', { 
          sceneItemId, 
          sceneName: SceneName.Live,
          sceneItemTransform: {
            positionX: (1920 - 1000) / 2,
            positionY: 1080 - 150,
          },
        });
        break;
    
      case ScoreboardSettingsStyle.STYLE1:
      default:
        await obsWs.call('SetSceneItemTransform', { 
          sceneItemId, 
          sceneName: SceneName.Live, 
          sceneItemTransform: {
            positionX: (1920 - 1000),
            positionY: 0,
          },
        });
        break;
    }
  }

  render() {
    return this.props.children(this.state);
  }
}

export { ObsRemote };
export type { ObsRemoteState };

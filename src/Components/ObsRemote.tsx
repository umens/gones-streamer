import { Component } from "react";
import OBSWebSocket from 'obs-websocket-js';
import { notification } from "antd";
// import { SceneName, GameStatut, Timeout, Team, GameEvent, TeamPossession, Quarter } from "../Models";
import { StoreType, SceneName, GameStatut as IGameStatut, LiveSettings as ILiveSettings, Timeout, Team, GameEvent, TeamPossession, Quarter, FileUp, ScoreType, StreamingService, StreamingSport, GetDefaultConfig, AnimationType, Sponsor, Player, SponsorDisplayType, MediaType, SponsorDisplayTypeSceneIdSmall, SponsorDisplayTypeSceneIdBig, StreamingStats, CameraHardware, OBSVideoInput } from "../Models";
import { Utilities } from "../Utils";
import moment from "moment";

const obsWs = new OBSWebSocket();

type ObsRemoteProps = {
  children: any;
};
type ObsRemoteState = {
  live: boolean;
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
  getAvailableCameras: () => Promise<OBSVideoInput[]>;
};

class ObsRemote extends Component<ObsRemoteProps, ObsRemoteState> {

  intervalClockId?: NodeJS.Timeout;
  intervalStatsId?: NodeJS.Timeout;

  constructor(props: Readonly<ObsRemoteProps>) {
    super(props);
    this.state = {
      live: false,
      connectingObs: false,
      connected2Obs: false,
      firstDatasLoaded: false,
      scenes: null,
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

  handleStatsDatas = async () => {
    try {
      const stats = await obsWs.call('GetStats');
      const statsStream = await obsWs.call('GetStreamStatus');
      let oldDroppedFrame = 0;
      let cpuUsage: number[] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
      let memoryUsage: number[] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
      if(this.state.streamingStats !== undefined) {
        oldDroppedFrame = this.state.streamingStats.droppedFrame;
        cpuUsage = this.state.streamingStats.cpuUsage;
        memoryUsage = this.state.streamingStats.memoryUsage;
      }
      cpuUsage = this.addToStatArray(stats.cpuUsage, cpuUsage);
      memoryUsage = this.addToStatArray(stats.memoryUsage, memoryUsage);
      await this.setState({
        streamingStats: {
          oldDroppedFrame,
          droppedFrame: statsStream.outputSkippedFrames,
          // droppedFrame: (100 * data["num-dropped-frames"]) / data["num-total-frames"],
          totalStreamTime: moment().startOf('day').milliseconds(statsStream.outputDuration).format('HH:mm:ss'),
          cpuUsage,
          bytesPerSec: statsStream.outputBytes * 10,
          memoryUsage,
        }
      });
    } catch (error) {
      
    }
  }
  
  startStats = async (): Promise<void> => {
    this.intervalStatsId = setTimeout(this.handleStatsDatas, 1000);
  }
  
  stopStats = (): void => {
    if (this.intervalStatsId) {
      clearTimeout(this.intervalStatsId);
      // await this.setState({ timeout: undefined, preview: undefined });
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
      await obsWs.connect('ws://127.0.0.1:4444', 'IxqGV59RRNzMyQNo');
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
      const scenesDataState = scenesData.scenes.filter(item => {
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
      const defaultConfig = GetDefaultConfig();
      let logoH = await (await obsWs.call('GetInputSettings', { inputName: 'Home Logo' })).inputSettings;
      const HomeTeam: Team = {
        name: await (await obsWs.call('GetInputSettings', { inputName: 'Home Name Text' })).inputSettings.text + '',
        city: await (await obsWs.call('GetInputSettings', { inputName: 'Home City Text' })).inputSettings.text + '',
        score: +await (await obsWs.call('GetInputSettings', { inputName: 'Home Score Text' })).inputSettings.text!,
        logo: await this.state.Utilitites!.getBase64FromFilePath(logoH.file as string),
        color: "#133155",
        timeout: Timeout.THREE
      };
      let logoA = await (await obsWs.call('GetInputSettings', { inputName: 'Away Logo' })).inputSettings;
      const AwayTeam: Team = {
        name: await (await obsWs.call('GetInputSettings', { inputName: 'Away Name Text' })).inputSettings.text + '',
        city: await (await obsWs.call('GetInputSettings', { inputName: 'Away City Text' })).inputSettings.text + '',
        score: +await (await obsWs.call('GetInputSettings', { inputName: 'Away Score Text' })).inputSettings.text!,
        logo: await this.state.Utilitites!.getBase64FromFilePath(logoA.file as string),
        color: "#612323",
        timeout: Timeout.THREE
      };
      const competWeek = (await (await obsWs.call('GetInputSettings', { inputName: 'Week Text' })).inputSettings.text! + '').split(' - ');
      let Options: GameEvent = { 
        ...defaultConfig.GameStatut.Options, 
        ...{ 
          competition: competWeek[0],
          journee: competWeek[1]
        }
      };
      let GameStatut: IGameStatut = {
        HomeTeam,
        AwayTeam,
        Options,
      };
      const buffer = await (await obsWs.call('GetInputSettings', { inputName: 'Replay Video' })).inputSettings;
      const bitrate = await window.app.manageObsSettings({ setter: false });
      // const bitrate = +await (await obsWs.call('GetProfileParameter', { parameterCategory: 'Output', parameterName: 'VBitrate' })).parameterValue;
      let LiveSettings: ILiveSettings = {
        bitrate,
        buffer: buffer.duration as number,
        streamKey: await (await obsWs.call('GetStreamServiceSettings')).streamServiceSettings.key + '',
        sport: StreamingSport.Football,
        streamingService: StreamingService.Youtube,
      };
      const bgImg = await (await obsWs.call('GetInputSettings', { inputName: 'Background' })).inputSettings;
      const bgImg64 = await this.state.Utilitites!.getBase64FromFilePath(bgImg.file as string);
      // TODO: wait for GetSceneItemList to be release to list all cams
      /**
       * Same for DeleteSceneItem (Available) & DuplicateSceneItem (Available) to implemente adding and removing cams
       * configuring them with SetSceneItemProperties (Available) and navigator.mediaDevices.enumerateDevices()
       * use GetSourceSettings to check video input of the cam
       */
      // let cameras = await obsWs.send('GetSceneItemList');

      
      const Sponsors = await window.app.manageSponsors({ action: 'get' });
      const Players = await window.app.managePlayers({ action: 'get' });

      let store: StoreType = {
        GameStatut,
        LiveSettings,
        BackgroundImage: bgImg64,
        CamerasHardware: defaultConfig.CamerasHardware,
        Sponsors,
        Players,
      };
      await this.setState({ store, firstDatasLoaded: true });
      await this.sendUpdateToScoreboardWindow();
    } catch (error) {

    }
  }

  updateSettings = async (value: any): Promise<void> => {
    try {
      await obsWs.call('SetInputSettings', { inputName: 'Replay Video', inputSettings: { duration: +value.buffer * 1000 } });
      await obsWs.call('SetStreamServiceSettings', { streamServiceType: 'rtmp_common', streamServiceSettings: { key: value.key } });
      // await obsWs.call('SetProfileParameter', { parameterCategory: 'Output', parameterName: 'VBitrate', parameterValue: value.bitrate });
      await window.app.manageObsSettings({ setter: true, bitrate: +value.bitrate });
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
      oldCam.active = false;
      CamerasHardware[indexOldCam] = oldCam;

      let newCam = CamerasHardware.find(item => item.title === name)!;
      const indexNewCam = CamerasHardware.findIndex(item => item.title === name)!;
      const sceneItemIdNewCam = await this.findIdFromSceneItemName(SceneName.Live, `Camera - ${newCam.title}`);
      newCam.active = true;
      CamerasHardware[indexNewCam] = newCam;
      
      store.CamerasHardware = CamerasHardware;

      await obsWs.call('SetSceneItemEnabled', { sceneItemId: sceneItemIdNewCam, sceneItemEnabled: true, sceneName: SceneName.Live });
      await obsWs.call('SetSceneItemEnabled', { sceneItemId: sceneItemIdOldCam, sceneItemEnabled: false, sceneName: SceneName.Live });
      await this.setState({ store });
    } catch (error) {

    }
  }

  addToStatArray = (item: number, originalDatas: number[]): number[] => {
    let clonnedStats = [...originalDatas];
    if (clonnedStats.length >= 25) {
      clonnedStats.shift();
      clonnedStats.push(item);
    } else {
      clonnedStats.push(item);
    }
    return clonnedStats;
  }

  updateLiveStatus = async (): Promise<void> => {
    try {
      const streamingStatus = await (await obsWs.call('ToggleStream')).outputActive;
      await this.setState({ live: streamingStatus });
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
          break;
        case 'color':
          homeTeam ? store.GameStatut.HomeTeam.color = value as string : store.GameStatut.AwayTeam.color = value as string;
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
          break;
        case 'score':
          homeTeam ? store.GameStatut.HomeTeam.score = Math.trunc(value as number) : store.GameStatut.AwayTeam.score = Math.trunc(value as number);
          const score: string = homeTeam ? '' + store.GameStatut.HomeTeam.score : '' +store.GameStatut.AwayTeam.score;
          const sourceScoreText = homeTeam ? 'Home Score Text' : 'Away Score Text'
          await obsWs.call('SetInputSettings', { inputName: sourceScoreText, inputSettings: { text: score.padStart(2, '0') } });
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
          break;
        case 'showScoreboard':
          store.GameStatut.Options.showScoreboard = value as boolean;
          await obsWs.call('SetSceneItemEnabled', { sceneItemId: await this.findIdFromSceneItemName(SceneName.Live, 'scoreboard'), sceneItemEnabled: value as boolean, sceneName: SceneName.Live });
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
          break;
        case 'journee':
          store.GameStatut.Options.journee = value as string;
          await obsWs.call('SetInputSettings', { inputName: 'Week Text', inputSettings: { text: store.GameStatut.Options.competition + ' - ' + value as string } });
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

  /**
   * @deprecated Waiting for obs-websocket to handle button click in plugin settings - https://github.com/Palakis/obs-websocket/issues/456
   * temporary Fix : handling keydown event to save buffer then switch to Replay Scene
   *
   */
  startReplay = async () => {
    try {
      if(this.state.scenes?.currentScene !== SceneName.Replay) {
        await obsWs.call('SaveReplayBuffer');
        await this.changeActiveScene(SceneName.Replay);
        setTimeout(async () => {
          await this.changeActiveScene(SceneName.Live);
        }, this.state.store?.LiveSettings.buffer);
      }
    } catch (error) {
      
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
      await this.updateGameEventProps({ props: "competition", value: defaultConfig.GameStatut.Options.competition });
      await this.updateGameEventProps({ props: "journee", value: defaultConfig.GameStatut.Options.journee });
      // home Team
      await this.updateTextProps({ props: "city", value: defaultConfig.GameStatut.HomeTeam.city, homeTeam: true });
      await this.updateTextProps({ props: "name", value: defaultConfig.GameStatut.HomeTeam.name, homeTeam: true });
      await this.updateTextProps({ props: "logo", value: defaultConfig.GameStatut.HomeTeam.logo, homeTeam: true });
      // away Team
      await this.updateTextProps({ props: "city", value: defaultConfig.GameStatut.AwayTeam.city });
      await this.updateTextProps({ props: "name", value: defaultConfig.GameStatut.AwayTeam.name });
      await this.updateTextProps({ props: "logo", value: defaultConfig.GameStatut.AwayTeam.logo });

      // background image
      await this.updateTextProps({ props: "logo", value: defaultConfig.BackgroundImage!, bg: true });
      
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
          this.intervalClockId = setInterval(async () => {
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
        active: true,
        deactivate_when_not_showing: false,
        directory: "../../../../appDatas",
        duration: await (await obsWs.call('GetInputSettings', { inputName: 'Replay Video' })).inputSettings.duration,
        end_action: 0,
        file_format: "%CCYY-%MM-%DD %hh.%mm.%ss",
        last_video_device_id: camera.deviceid?.split('|')[0],
        load_switch_scene: SceneName.Replay,
        next_scene: SceneName.Live,
        sound_trigger: false,
        source: 'Camera - ' + camera.title,
        use_custom_audio_device: false,
        video_device_id: camera.deviceid?.split('|')[0],
        visibility_action: 0
      }
      const { sceneItemId } = await obsWs.call('CreateInput', { sceneName: SceneName.Live, inputName: 'Camera - ' + camera.title, inputKind: 'dshow_input_replay', inputSettings: cameraSettings, sceneItemEnabled: false });
      await obsWs.call('SetSceneItemIndex', { sceneName: SceneName.Live, sceneItemId, sceneItemIndex: 4 });
      let store = this.state.store!;
      store.CamerasHardware.push(camera);
      await this.setState({ store });
    } catch (error) {
      
    }
  }

  editCamera = async (camera: CameraHardware): Promise<void> => {
    try {
      let store = this.state.store!;
      // const camIndex = store.CamerasHardware.findIndex((cam) => cam.deviceId === camera.deviceId);
      // this.state.scenes?.scenes.
      // await obsWs.send('DeleteSceneItem', { scene: SceneName.Live, item: { name: '', id: '' } });      
      const cameraSettings = {
        last_video_device_id: camera.deviceid?.split('|')[0],
        source: 'Camera - ' + camera.title,
        video_device_id: camera.deviceid?.split('|')[0],
      }
      await obsWs.call('SetInputSettings', { inputName: 'Camera - ' + camera.title, inputSettings: cameraSettings });
      const camIndex = store.CamerasHardware.findIndex((cam) => cam.deviceid === camera.deviceid);
      store.CamerasHardware[camIndex] = camera;
      await this.setState({ store });
    } catch (error) {
      
    }
  }

  removeCamera = async (camera: CameraHardware): Promise<void> => {
    try {
      let store = this.state.store!;
      await obsWs.call('RemoveInput', { inputName: 'Camera - ' + camera.title });
      const camIndex = store.CamerasHardware.findIndex((cam) => cam.deviceid === camera.deviceid);
      store.CamerasHardware.splice(camIndex, 1);
      await this.setState({ store });
    } catch (error) {
      console.log(error)
    }
  }

  getAvailableCameras = async (): Promise<OBSVideoInput[]> => {
    try {
      return await (await obsWs.call('GetInputPropertiesListPropertyItems', {inputName: 'Camera - Field', propertyName: 'video_device_id'})).propertyItems as OBSVideoInput[];
    } catch (error) {
      throw error;
    }
  }

  disconnectObs = (): void => {
    obsWs.disconnect();
    obsWs.removeListener('ConnectionClosed', () => { });
  }

  goLive = async (): Promise<void> => {
    await this.setState({ live: !this.state.live });
  }

  render() {
    return this.props.children(this.state);
  }
}

export { ObsRemote };
export type { ObsRemoteState };

import { Component } from 'react';
import { message } from 'antd';
// const { getCurrentWindow } = require('@electron/remote');
import moment from 'moment';

// import { SceneName, GameStatut, Timeout, Team, GameEvent, TeamPossession, Quarter } from "../Models";
import { StoreType, SceneName, GameStatut as IGameStatut, LiveSettings as ILiveSettings, Timeout, Team, GameEvent, TeamPossession, Quarter, FileUp, ScoreType, StreamingService, StreamingSport, GetDefaultConfig, AnimationType, Sponsor, Player, SponsorDisplayType, MediaType, SponsorDisplayTypeSceneIdSmall, SponsorDisplayTypeSceneIdBig, PathsType, StreamingStats } from '../Models';
import { Utilities } from '../Utils';

type ObsRemoteProps = {
  children: any;
};
type ObsRemoteState = {
  live: boolean;
  firstDatasLoaded: boolean;
  scenes: {
    'current-scene': SceneName;
    scenes: SceneName[];
  };
  store: StoreType | null;
  sponsorDisplayType?: SponsorDisplayType;
  Utilitites?: Utilities;
  streamingStats?: StreamingStats;
  
  // goLive: () => Promise<void>;
  changeActiveScene: (name: SceneName) => Promise<void>;
  // changeActiveCam: (name: string) => Promise<void>;
  // updateLiveStatus: () => Promise<void>;
  updateTextProps: ({ props, value, homeTeam, bg, withAnimation  }: { props: keyof Team; value: string | number | FileUp | Timeout; homeTeam?: boolean; bg?: boolean; withAnimation?: boolean;  }) => Promise<void>;
  // updateSettings: (value: any) => Promise<void>;
  setScore: ({ isHomeTeam, scoreType, withAnimation }: { isHomeTeam: boolean; scoreType: ScoreType; withAnimation?: boolean; }) => Promise<void>;
  changePossession: () => Promise<void>;
  updateGameEventProps: ({ props, value }: { props: keyof GameEvent; value: boolean | Quarter | TeamPossession | string; }) => Promise<void>;
  // startReplay: () => Promise<void>;
  // getScreenshot: () => Promise<{ img?: string }>;
  resetGame: () => Promise<void>;
  newGame: ({ name1, name2, city1, city2, logo1, logo2 }: { name1: string, name2: string, city1?: string, city2?: string, logo1?: string, logo2?: string }) => Promise<void>;
  startStopClock: (isTimeout?: boolean) => Promise<void>;
  resetClock: () => Promise<void>;
  toggleClock: () => Promise<void>;
  // setGameClock: ({ minutes, seconds }: { minutes: number; seconds: number; }) => Promise<void>;
  // togglePlayerHighlight: (show: boolean, uuid: string) => Promise<void>;
  // toggleSponsor: ({show, uuid, previousScene, sponsorDisplayType}: {show: boolean, uuid: string, previousScene: SceneName, sponsorDisplayType?: SponsorDisplayType}) => Promise<void>;
  // // resetSponosorScene: () => Promise<void>;
  updateSponsorsList: (sponsors: Sponsor[]) => Promise<void>;
  // updatePlayersList: (players: Player[]) => Promise<void>;
  onPerformanceStatistics: (data: any) => Promise<void>;
  setupPreview: () => Promise<void>;
};

class ObsRemote extends Component<ObsRemoteProps, ObsRemoteState> {

  intervalClockId?: number;
  intervalStatsId?: number;

  constructor(props: Readonly<ObsRemoteProps>) {
    super(props);
    this.state = {
      live: false,
      firstDatasLoaded: false,
      store: null,
      scenes: {
        'current-scene': SceneName.Starting,
        scenes: [
          SceneName.Starting,
          SceneName.Live,
          SceneName.Halftime,
          SceneName.Ending,
          SceneName.Sponsors,
          SceneName.Replay,
        ],
      },
      streamingStats: {
        oldDroppedFrame: 0,
        droppedFrame: 0,
        // droppedFrame: (100 * data["num-dropped-frames"]) / data["num-total-frames"],
        totalStreamTime: moment().startOf('day').seconds(0).format('HH:mm:ss'),
        cpuUsage: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        bytesPerSec: 0,
        memoryUsage: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      },

      // goLive: this.goLive.bind(this),
      changeActiveScene: this.changeActiveScene.bind(this),
      // changeActiveCam: this.changeActiveCam.bind(this),
      // updateLiveStatus: this.updateLiveStatus.bind(this),
      updateTextProps: this.updateTextProps.bind(this),
      // updateSettings: this.updateSettings.bind(this),
      setScore: this.setScore.bind(this),
      changePossession: this.changePossession.bind(this),
      updateGameEventProps: this.updateGameEventProps.bind(this),
      // startReplay: this.startReplay.bind(this),
      // getScreenshot: this.getScreenshot.bind(this),
      resetGame: this.resetGame.bind(this),
      newGame: this.newGame.bind(this),
      startStopClock: this.startStopClock.bind(this),
      resetClock: this.resetClock.bind(this),
      toggleClock: this.toggleClock.bind(this),
      // setGameClock: this.setGameClock.bind(this),
      // togglePlayerHighlight: this.togglePlayerHighlight.bind(this),
      // toggleSponsor: this.toggleSponsor.bind(this),
      updateSponsorsList: this.updateSponsorsList.bind(this),
      // updatePlayersList: this.updatePlayersList.bind(this),
      // resetSponosorScene: this.resetSponosorScene.bind(this),
      onPerformanceStatistics: this.onPerformanceStatistics.bind(this),
      setupPreview: this.setupPreview.bind(this),
    };

    // obsWs.on('ConnectionClosed', async () => {
    //   try {
    //     await this.setState({ connected2Obs: false });
    //   } catch (error) {
        
    //   }
    // });

    // obsWs.on('SwitchScenes', async (data) => {
    //   try {
    //     if(Object.values(SceneName).includes(data['scene-name'] as SceneName)) {
    //       await this.changeActiveScene(data['scene-name'] as SceneName);
    //     }
    //   } catch (error) {
        
    //   }
    // });

    // obsWs.on('StreamStopped', async () => {
    //   try {
    //     obsWs.removeAllListeners('StreamStatus');
    //     await this.setState({ streamingStats: undefined, live: false });
    //   } catch (error) {
        
    //   }
    // });

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
    //       cpuUsage = this.addToStatArray(data['cpu-usage'], cpuUsage);
    //       memoryUsage = this.addToStatArray(data['memory-usage'], memoryUsage);
    //       await this.setState({
    //         streamingStats: {
    //           oldDroppedFrame,
    //           droppedFrame: data['strain'],
    //           // droppedFrame: (100 * data["num-dropped-frames"]) / data["num-total-frames"],
    //           totalStreamTime: moment().startOf('day').seconds(data['total-stream-time']).format('HH:mm:ss'),
    //           cpuUsage,
    //           bytesPerSec: data['bytes-per-sec'] * 10,
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

  componentDidMount = async (): Promise<void> => {
    try {
      setTimeout(async () => {
        await this.startApp();
      }, 5000);
    } catch (error) {
      console.log(error);
    }
  };

  onPerformanceStatistics = async (data: any): Promise<void> => {
    try {
      let oldDroppedFrame = 0;
      // let cpuUsage: number[] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
      // let memoryUsage: number[] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
      if(this.state.streamingStats !== undefined) {
        oldDroppedFrame = this.state.streamingStats.droppedFrame;
        // cpuUsage = this.state.streamingStats.cpuUsage;
        // memoryUsage = this.state.streamingStats.memoryUsage;
      }
      // cpuUsage = ;
      // memoryUsage = this.addToStatArray(data.detail.memoryUsage, this.state.streamingStats!.memoryUsage);
      await this.setState({
        streamingStats: {
          oldDroppedFrame,
          droppedFrame: data.detail.numberDroppedFrames,
          // droppedFrame: (100 * data["num-dropped-frames"]) / data["num-total-frames"],
          totalStreamTime: moment().startOf('day').seconds(0).format('HH:mm:ss'),
          cpuUsage: this.addToStatArray(data.detail.CPU, this.state.streamingStats!.cpuUsage),
          bytesPerSec: data.detail.streamingDataOutput * 10,
          memoryUsage: this.addToStatArray(data.detail.memoryUsage, this.state.streamingStats!.memoryUsage),
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  startApp = async() => {
    try {
      // await this.setState({ loadingSettings: true });
      // message.loading({ content: 'Loading settings...', key: 'loadingSettings' });
      await window.obs.startStats();
      window.addEventListener('performanceStatisticsReact', this.onPerformanceStatistics);
      // await this.setState({ firstDatasLoaded: true });
      // const stats: any = await window.obs.performanceStatistics(this.onPerformanceStatistics);

      // await this.connectObs();
      
    //   await this.getScenes();
      await this.initGameStatut();
      
      await this.setupPreview();
      window.obs.listenResize();
    //   const streamStatus = await obsWs.send('GetStreamingStatus');
    //   if(streamStatus.streaming) {
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
    //       cpuUsage = this.addToStatArray(data['cpu-usage'], cpuUsage);
    //       memoryUsage = this.addToStatArray(data['memory-usage'], memoryUsage);
    //       await this.setState({
    //         streamingStats: {
    //           oldDroppedFrame,
    //           droppedFrame: data['strain'],
    //           // droppedFrame: (100 * data["num-dropped-frames"]) / data["num-total-frames"],
    //           totalStreamTime: moment().startOf('day').seconds(data['total-stream-time']).format('HH:mm:ss'),
    //           cpuUsage,
    //           bytesPerSec: data['bytes-per-sec'] * 10,
    //           memoryUsage,
    //         }
    //       });
    //     });
    //   }
    //   if(this.state.timeoutConnection) {
    //     await this.setState({ timeoutConnection: undefined });
    //   }
    } catch (error) {
      console.log(error);
      throw error;
      // const timeout = window.setTimeout(async() => {
      //   await this.startApp();
      // }, 5000);
      // await this.setState({ timeoutConnection: timeout });      
    }
  };

  componentWillUnmount = async (): Promise<void> => {
    try {
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

  // connectObs = async (): Promise<void> => {
  //   try {
  //     await this.setState({ connectingObs: true });
  //     await obsWs.connect({ address: 'localhost:4444' });
  //     notification['success']({
  //       message: 'Connecté à OBS',
  //       // description: '',
  //       placement: 'bottomRight',
  //     });
  //     await this.setState({ connectingObs: false, connected2Obs: true });
  //   } catch (error) {
  //     notification['error']({
  //       message: 'Connection à OBS impossible, Retrying...',
  //       description: `${error.description}`,
  //       placement: 'bottomRight',
  //     });
  //     await this.setState({ connectingObs: false });
  //     throw error;      
  //   }
  // }

  // getScenes = async (): Promise<void> => {
  //   try {
  //     const scenesData = await obsWs.send('GetSceneList');
  //     scenesData.scenes = scenesData.scenes.filter(item => {
  //       return !item.name.startsWith('*');
  //     })
  //     await this.setState({ scenes: scenesData });
  //   } catch (error) {

  //   }
  // }

  initGameStatut = async (): Promise<void> => {
    try {
      // const appPaths = await ipc.send<PathsType>('paths-data');
      // const utilitites = Utilities.getInstance(appPaths);
      // const defaultConfig = GetDefaultConfig();
      // const logoH = await (await obsWs.send('GetSourceSettings', { sourceName: 'Home Logo' })).sourceSettings as any;
      // const HomeTeam: Team = {
      //   name: await (await obsWs.send('GetTextGDIPlusProperties', { source: 'Home Name Text' })).text,
      //   city: await (await obsWs.send('GetTextGDIPlusProperties', { source: 'Home City Text' })).text,
      //   score: +await (await obsWs.send('GetTextGDIPlusProperties', { source: 'Home Score Text' })).text,
      //   logo: logoH.file,
      //   color: '#133155',
      //   timeout: Timeout.THREE
      // };
      // const logoA = await (await obsWs.send('GetSourceSettings', { sourceName: 'Away Logo' })).sourceSettings as any;
      // const AwayTeam: Team = {
      //   name: await (await obsWs.send('GetTextGDIPlusProperties', { source: 'Away Name Text' })).text,
      //   city: await (await obsWs.send('GetTextGDIPlusProperties', { source: 'Away City Text' })).text,
      //   score: +await (await obsWs.send('GetTextGDIPlusProperties', { source: 'Away Score Text' })).text,
      //   logo: logoA.file,
      //   color: '#612323',
      //   timeout: Timeout.THREE
      // };
      // const competWeek = await (await obsWs.send('GetTextGDIPlusProperties', { source: 'Week Text' })).text.split(' - ');
      // const Options: GameEvent = { 
      //   ...defaultConfig.GameStatut.Options, 
      //   ...{ 
      //     competition: competWeek[0],
      //     journee: competWeek[1]
      //   }
      // };
      // const GameStatut: IGameStatut = {
      //   HomeTeam,
      //   AwayTeam,
      //   Options,
      // };
      // const buffer = await (await obsWs.send('GetSourceSettings', { sourceName: 'Replay Video' })).sourceSettings as any;
      // const bitrate = +await ipc.send<string>('obs-settings', { params: { getter: true }});
      // const LiveSettings: ILiveSettings = {
      //   bitrate,
      //   buffer: buffer.duration,
      //   streamKey: await (await obsWs.send('GetStreamSettings')).settings.key,
      //   sport: StreamingSport.Football,
      //   streamingService: StreamingService.Youtube,
      // };
      // const bgImg = await (await obsWs.send('GetSourceSettings', { sourceName: 'Background' })).sourceSettings as any;
      // TODO: wait for GetSceneItemList to be release to list all cams
      /**
       * Same for DeleteSceneItem (Available) & DuplicateSceneItem (Available) to implemente adding and removing cams
       * configuring them with SetSceneItemProperties (Available) and navigator.mediaDevices.enumerateDevices()
       * use GetSourceSettings to check video input of the cam
       */
      // let cameras = await obsWs.send('GetSceneItemList');

      // const Sponsors = await ipc.send<Sponsor[]>('sponsors-data', { params: { action: 'get' }}) || [];
      // const Players = await ipc.send<Player[]>('players-data', { params: { action: 'get' }}) || [];

      // const store: StoreType = {
      //   GameStatut,
      //   LiveSettings,
      //   BackgroundImage: bgImg.file,
      //   CamerasHardware: defaultConfig.CamerasHardware,
      //   Sponsors,
      //   Players,
      // };
      const config: StoreType = await window.app.getConfig();
      await this.setState({ store: config, firstDatasLoaded: true });
      message.success({ content: 'Settings loaded !', duration: 2, key: 'loadingSettings' });
      await this.sendUpdateToScoreboardWindow();
    } catch (error) {

    }
  }

  // updateSettings = async (value: any): Promise<void> => {
  //   try {
  //     await obsWs.send('SetSourceSettings', { sourceName: 'Replay Video', sourceSettings: { duration: +value.buffer * 1000 } });
  //     await obsWs.send('SetStreamSettings', { type: 'rtmp_common', settings: { key: value.key }, save: true});
  //     await ipc.send<void>('obs-settings', { params: { setter: true, bitrate: +value.bitrate }});
  //   } catch (error) {

  //   }
  // }

  changeActiveScene = async (name: SceneName): Promise<void> => {
    try {
      // await obsWs.send('SetCurrentScene', { 'scene-name': name });
      // const data = this.state.scenes;
      // data!['current-scene'] = name.startsWith('*') ? null : name as string;
      // await this.setState({ scenes: data });
      const data = this.state.scenes;
      data['current-scene'] = name;
      await this.setActiveScene(name);
      await this.setState({ scenes: data });
    } catch (error) {
      console.error(error);
    }
  }

  // changeActiveCam = async (name: string): Promise<void> => {
  //   try {
  //     // TODO: when changing cam, also change the replay source cam
  //     let oldCam: string = '';
  //     const indexLive = this.state.scenes?.scenes.findIndex(scene => scene.name === SceneName.Live)!;
  //     this.state.scenes?.scenes[indexLive].sources.forEach(item => {
  //       if (item.name.startsWith('cam')) {
  //         if (item.render) {
  //           item.render = false;
  //           oldCam = item.name;
  //         }
  //         if (item.name === name) {
  //           item.render = true;
  //         }
  //       }
  //     });
  //     await obsWs.send('SetSceneItemProperties', { item: { name }, visible: true, 'scene-name': SceneName.Live, bounds: {}, crop: {}, position: {}, scale: {} });
  //     await obsWs.send('SetSceneItemProperties', { item: { name: oldCam }, visible: false, 'scene-name': SceneName.Live, bounds: {}, crop: {}, position: {}, scale: {} });
  //     await this.setState({ scenes: this.state.scenes });
  //   } catch (error) {

  //   }
  // }

  addToStatArray = (item: number, originalDatas: number[]): number[] => {
    // const clonnedStats = [...originalDatas];
    // if (clonnedStats.length >= 25) {
    //   clonnedStats.shift();
    //   clonnedStats.push(item);
    // } else {
    //   clonnedStats.push(item);
    // }
    
    // return clonnedStats;
    if (originalDatas.length >= 25) {
      originalDatas.shift();
      originalDatas.push(item);
    } else {
      originalDatas.push(item);
    }
    return originalDatas;
  };

  // updateLiveStatus = async (): Promise<void> => {
  //   try {
  //     if(this.state.live) {
  //       await obsWs.send('StopStreaming');  
  //     } else {
  //       await obsWs.send('StartStreaming', {});
  //     }
  //     await this.setState({ live: !this.state.live });
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  getBase64 = (img: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = () => {
        resolve(reader.result! as string);
      };
  
      reader.onerror = reject;
  
      reader.readAsDataURL(img);
    });
  }

  updateTextProps = async ({ props, value, homeTeam = false, bg = false, withAnimation = false }: { props: keyof Team; value: string | number | FileUp | Timeout; homeTeam?: boolean; bg?: boolean; withAnimation?: boolean;  }): Promise<void> => {
    try {
      const store = this.state.store!;
      switch (props) {
        case 'city':
          homeTeam ? store.GameStatut.HomeTeam.city = value as string : store.GameStatut.AwayTeam.city = value as string;
          homeTeam ? await this.changeSourceText({ source: 'home_city_text', text: value as string, scene: SceneName.Background}) : await this.changeSourceText({ source: 'away_name_text', text: value as string, scene: SceneName.Background});
          break;
        case 'color':
          homeTeam ? store.GameStatut.HomeTeam.color = value as string : store.GameStatut.AwayTeam.color = value as string;
          break;
        case 'logo':
          if(bg) {
            // const base64Img: string = await this.getBase64((value as FileUp).file);
            store.BackgroundImage = (value as FileUp).pathElectron;
          } else {
            // const base64Img: string = await this.getBase64((value as FileUp).file);
            homeTeam ? store.GameStatut.HomeTeam.logo = (value as FileUp).pathElectron : store.GameStatut.AwayTeam.logo = (value as FileUp).pathElectron;
          }
          break;
        case 'name':
          homeTeam ? store.GameStatut.HomeTeam.name = value as string : store.GameStatut.AwayTeam.name = value as string;
          homeTeam ? await this.changeSourceText({ source: 'home_name_text', text: value as string, scene: SceneName.Background}) : await this.changeSourceText({ source: 'away_name_text', text: value as string, scene: SceneName.Background});
          break;
        case 'score':
          homeTeam ? store.GameStatut.HomeTeam.score = Math.trunc(value as number) : store.GameStatut.AwayTeam.score = Math.trunc(value as number);
          const score: string = homeTeam ? '' + store.GameStatut.HomeTeam.score : '' +store.GameStatut.AwayTeam.score;
          homeTeam ? await this.changeSourceText({ source: 'home-score-text', text: score.padStart(2, '0'), scene: SceneName.ScoreBackground}) : await this.changeSourceText({ source: 'away-score-text', text: score.padStart(2, '0'), scene: SceneName.ScoreBackground});
          break;
        case 'timeout':
          const animate = withAnimation && (homeTeam ? store.GameStatut.HomeTeam.timeout > value : store.GameStatut.AwayTeam.timeout > value);
          homeTeam ? store.GameStatut.HomeTeam.timeout = value as Timeout : store.GameStatut.AwayTeam.timeout = value as Timeout ;          
          if(animate) {            
            await this.changeSourceVisibility({ source: AnimationType.TIMEOUT, visible: true, scene: SceneName.Live});
            setTimeout(async () => {
              await this.changeSourceVisibility({ source: AnimationType.TIMEOUT, visible: false, scene: SceneName.Live});
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
      const store = this.state.store!;
      switch (props) {
        case 'quarter':
          store.GameStatut.Options.quarter = value as Quarter;
          break;
        case 'showScoreboard':
          store.GameStatut.Options.showScoreboard = value as boolean;
          await this.changeSourceVisibility({ source: 'scoreboard', visible: value as boolean, scene: SceneName.Live});
          // await obsWs.send('SetSceneItemProperties', { item: { name: 'scoreboard' }, visible: value as boolean, 'scene-name': SceneName.Live, bounds: {}, crop: {}, position: {}, scale: {} });
          break;
        case 'flag':
          store.GameStatut.Options.flag = value as boolean;
          break;
        case 'possession':
          store.GameStatut.Options.possession = value as TeamPossession;
          break;
        case 'competition':
          store.GameStatut.Options.competition = value as string;
          await this.changeSourceText({ source: 'week-text', text: value as string + ' - ' + store.GameStatut.Options.journee, scene: SceneName.Starting });
          break;
        case 'journee':
          store.GameStatut.Options.journee = value as string;
          await this.changeSourceText({ source: 'week-text', text: store.GameStatut.Options.competition + ' - ' + value, scene: SceneName.Starting });
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
      const store = this.state.store!;
      const scoreToDisplay = isHomeTeam ? store.GameStatut.HomeTeam.score + scoreAdded : store.GameStatut.AwayTeam.score + scoreAdded;
      await this.updateTextProps({ props: 'score', value: scoreToDisplay, homeTeam: isHomeTeam });
      if(withAnimation) {
        await this.changeSourceVisibility({ source: scoreType, visible: true, scene: SceneName.Live});
        setTimeout(async () => {
          await this.changeSourceVisibility({ source: scoreType, visible: false, scene: SceneName.Live});
        }, 5000);
      }
    } catch (error) {
      
    }
  };

  changePossession = async () => {
    try {
      const store = this.state.store!;
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

  // /**
  //  * @deprecated Waiting for obs-websocket to handle button click in plugin settings - https://github.com/Palakis/obs-websocket/issues/456
  //  * temporary Fix : handling keydown event to save buffer then switch to Replay Scene
  //  *
  //  */
  // startReplay = async () => {
  //   try {
  //     if(this.state.scenes?.['current-scene'] !== SceneName.Replay) {
  //       await obsWs.send('SaveReplayBuffer');
  //       await this.changeActiveScene(SceneName.Replay);
  //       setTimeout(async () => {
  //         await this.changeActiveScene(SceneName.Live);
  //       }, this.state.store?.LiveSettings.buffer);
  //     }
  //   } catch (error) {
      
  //   }
  // }

  
  // getScreenshot = async (): Promise<{ img?: string }> => {
  //   try {
  //     const data = await obsWs.send('TakeSourceScreenshot', { sourceName: this.state.scenes?.['current-scene']!, embedPictureFormat: 'jpeg', width: 450, height: 254 });
  //     return data;
  //   } catch (error) {
  //     return {};
  //   }
  // }
  
  resetGame = async(): Promise<void> => {
    try {
      // const defaultConfig = GetDefaultConfig();
      // score reset
      await await this.updateTextProps({ props: 'score', value: 0, homeTeam: true });
      await await this.updateTextProps({ props: 'score', value: 0, homeTeam: false });
      // scoreboard
      if(!this.state.store?.GameStatut.Options.showScoreboard) {
        await this.updateGameEventProps({ props: 'showScoreboard', value: true });
      }
      // Compet Day
      // await this.updateGameEventProps({ props: 'competition', value: defaultConfig.GameStatut.Options.competition });
      // await this.updateGameEventProps({ props: 'journee', value: defaultConfig.GameStatut.Options.journee });
      // // home Team
      // await this.updateTextProps({ props: 'city', value: defaultConfig.GameStatut.HomeTeam.city, homeTeam: true });
      // await this.updateTextProps({ props: 'name', value: defaultConfig.GameStatut.HomeTeam.name, homeTeam: true });
      // await this.updateTextProps({ props: 'logo', value: defaultConfig.GameStatut.HomeTeam.logo, homeTeam: true });
      // away Team
      // await this.updateTextProps({ props: 'city', value: 'Away Team City' });
      // await this.updateTextProps({ props: 'name', value: 'Away Team Name' });
      // await this.updateTextProps({ props: 'logo', value: defaultConfig.GameStatut.AwayTeam.logo });

      // background image
      // await this.updateTextProps({ props: 'logo', value: defaultConfig.BackgroundImage!, bg: true });
      
      // set beginning scene
      await this.changeActiveScene(SceneName.Starting);

      // await this.setState({ store: defaultConfig });
      // await this.sendUpdateToScoreboardWindow();
    } catch (error) {
      
    }
  }
  
  newGame = async({ name1, name2, city1, city2, logo1, logo2 }: { name1: string, name2: string, city1?: string, city2?: string, logo1?: string, logo2?: string }): Promise<void> => {
    try {
      // score reset
      await await this.updateTextProps({ props: 'score', value: 0, homeTeam: true });
      await await this.updateTextProps({ props: 'score', value: 0, homeTeam: false });
      // home Team
      await this.updateTextProps({ props: 'name', value: name1, homeTeam: true });
      if (city1) {
        await this.updateTextProps({ props: 'city', value: city1, homeTeam: true });
      }
      if (logo1) {
        await this.updateTextProps({ props: 'logo', value: logo1, homeTeam: true });
      }
      // away Team
      await this.updateTextProps({ props: 'name', value: name2 });      
      if (city2) {
        await this.updateTextProps({ props: 'city', value: city2 });
      }
      if (logo2) {
        await this.updateTextProps({ props: 'logo', value: logo2 });
      }
      
      // set beginning scene
      await this.changeActiveScene(SceneName.Starting);
    } catch (error) {
      
    }
  }
  
  startStopClock = async (isTimeout: boolean = false): Promise<void> => {
    try {
      const store = this.state.store!;
      const { clock } = store.GameStatut.Options;
      if(clock.active) {
        if (clock.isOn || isTimeout) {
          clock.isOn = false;
          if(this.intervalClockId) {
            window.clearInterval(this.intervalClockId);
            this.intervalClockId = undefined;
          }
          await this.setState({ store });
        } else {
          clock.isOn = true;
          this.intervalClockId = window.setInterval(async () => {
            try {
              const store = this.state.store!;
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
                    window.clearInterval(this.intervalClockId);
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
      const store = this.state.store!;
      if(this.intervalClockId) {
        clearInterval(this.intervalClockId);
        this.intervalClockId = undefined;
      }
      store.GameStatut.Options.clock = {
        ...store.GameStatut.Options.clock,
        ...{
          minutes: 12,
          seconds: 0,
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
      const store = this.state.store!;
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

  // setGameClock = async ({ minutes, seconds }: { minutes: number, seconds: number }): Promise<void> => {
  //   try {
  //     const store = this.state.store!;
  //     store.GameStatut.Options.clock = {
  //       ...store.GameStatut.Options.clock,
  //       ...{
  //         minutes,
  //         seconds,
  //       }
  //     };
  //     await this.setState({ store });
  //     await this.sendUpdateToScoreboardWindow();
  //   } catch (error) {
      
  //   }
  // }

  // togglePlayerHighlight = async (show: boolean, uuid: string): Promise<void> => {
  //   try {      
  //     const store = this.state.store!;
  //     const player: Player | undefined = store.Players.find(p => p.uuid === uuid);
  //     if(player) {
  //       await obsWs.send('SetTextGDIPlusProperties', { source: 'player_name', text: `#${player.num} ${player.lastname.toUpperCase()} ${Utilities.capitalize(player.firstname)}` });
  //       await obsWs.send('SetTextGDIPlusProperties', { source: 'player_details', text: `${player.position}     ${player.lastname.toUpperCase()}     ${Utilities.capitalize(player.firstname)}` });
  //       await obsWs.send('SetSourceSettings', { sourceName: 'player_media', sourceSettings: { file: player.media } });
  //       // setTimeout(async () => {
  //       //   await obsWs.send('SetSceneItemProperties', { item: { name: 'Player Highlight' }, visible: false, 'scene-name': SceneName.Live, bounds: {}, crop: {}, position: {}, scale: {} });
  //       // }, 5000);
  //     }
  //     await obsWs.send('SetSceneItemProperties', { item: { name: 'Player Highlight' }, visible: show, 'scene-name': SceneName.Live, bounds: {}, crop: {}, position: {}, scale: {} });
  //   } catch (error) {
      
  //   }
  // }

  // toggleSponsor = async ({show, uuid, previousScene, sponsorDisplayType}: {show: boolean, uuid: string, previousScene: SceneName, sponsorDisplayType?: SponsorDisplayType}): Promise<void> => {
  //   try {
  //     await this.resetSponosorScene();
  //     if(show) {
  //       const store = this.state.store!;
  //       const sponsor: Sponsor | undefined = store.Sponsors.find(p => p.uuid === uuid);
  //       let sourceName;
  //       switch (sponsor?.mediaType!) {
  //         case MediaType.Video:
  //           sourceName = 'sponsor_video';
  //           await obsWs.send('SetSourceSettings', { sourceName, sourceSettings: { local_file: sponsor?.media } });
  //           break;
  //         case MediaType.Image:
  //         default:
  //           sourceName = 'sponsor_image';
  //           await obsWs.send('SetSourceSettings', { sourceName, sourceSettings: { file: sponsor?.media } });
  //           break;
  //       }
  //       await obsWs.send('SetSceneItemProperties', { item: { name: sourceName }, visible: true, 'scene-name': '* Sponsor media', bounds: {}, crop: {}, position: {}, scale: {} });
  //       await obsWs.send('SetSceneItemProperties', { item: { name: sponsorDisplayType + '_sponsor' }, visible: true, 'scene-name': SceneName.Sponsors, bounds: {}, crop: {}, position: {}, scale: {} });
  //       let id: number;
  //       if(sponsorDisplayType) {
  //         switch (previousScene) {
  //           case SceneName.Ending:
  //             id = sponsorDisplayType === SponsorDisplayType.Small ? SponsorDisplayTypeSceneIdSmall.Ending : SponsorDisplayTypeSceneIdBig.Ending;
  //             break;
  //           case SceneName.Halftime:
  //             id = sponsorDisplayType === SponsorDisplayType.Small ? SponsorDisplayTypeSceneIdSmall.Halftime : SponsorDisplayTypeSceneIdBig.Halftime;
  //             break;
  //           case SceneName.Starting:
  //             id = sponsorDisplayType === SponsorDisplayType.Small ? SponsorDisplayTypeSceneIdSmall.Starting : SponsorDisplayTypeSceneIdBig.Starting;
  //             break;
          
  //           case SceneName.Live:
  //           default:
  //             id = sponsorDisplayType === SponsorDisplayType.Small  ? SponsorDisplayTypeSceneIdSmall.Live : SponsorDisplayTypeSceneIdBig.Live;
  //             break;
  //         }
  //         await obsWs.send('SetSceneItemProperties', { item: { id }, visible: true, 'scene-name': SceneName.Sponsors, bounds: {}, crop: {}, position: {}, scale: {} });
  //       }
  //       await this.changeActiveScene(SceneName.Sponsors);
  //     } else {
  //       await this.changeActiveScene(previousScene);
  //     }
  //   } catch (error) {
      
  //   }
  // }

  // resetSponosorScene = async (): Promise<void> => {
  //   try {
  //     await obsWs.send('SetSourceSettings', { sourceName: 'sponsor_video', sourceSettings: { local_file: '' } });
  //     await obsWs.send('SetSourceSettings', { sourceName: 'sponsor_image', sourceSettings: { file: '' } });
  //     await obsWs.send('SetSceneItemProperties', { item: { name: 'sponsor_video' }, visible: false, 'scene-name': '* Sponsor media', bounds: {}, crop: {}, position: {}, scale: {} });
  //     await obsWs.send('SetSceneItemProperties', { item: { name: 'sponsor_image' }, visible: false, 'scene-name': '* Sponsor media', bounds: {}, crop: {}, position: {}, scale: {} });
  //     Object.values(SponsorDisplayType).forEach(async element => {
  //       await obsWs.send('SetSceneItemProperties', { item: { name: element + '_sponsor' }, visible: false, 'scene-name': SceneName.Sponsors, bounds: {}, crop: {}, position: {}, scale: {} });
  //       if(element === SponsorDisplayType.Small) {
  //         Object.values(SponsorDisplayTypeSceneIdSmall).forEach(async id => {
  //           if (isNaN(Number(id))) {
  //             return;
  //           }
  //           await obsWs.send('SetSceneItemProperties', { item: { id: id as number }, visible: false, 'scene-name': SceneName.Sponsors, bounds: {}, crop: {}, position: {}, scale: {} });
  //         });
  //       }
  //       if(element === SponsorDisplayType.Big) {
  //         Object.values(SponsorDisplayTypeSceneIdBig).forEach(async id => {
  //           if (isNaN(Number(id))) {
  //             return;
  //           }
  //           await obsWs.send('SetSceneItemProperties', { item: { id: id as number }, visible: false, 'scene-name': SceneName.Sponsors, bounds: {}, crop: {}, position: {}, scale: {} });
  //         });
  //       }
  //     });
  //   } catch (error) {
      
  //   }
  // }

  sendUpdateToScoreboardWindow = async (): Promise<void> => {
    try {      
      const store = this.state.store!;
      const GameStatut: IGameStatut = {...store.GameStatut};
      // GameStatut.AwayTeam.logo = this.state.Utilitites!.getImageFullPath(GameStatut.AwayTeam.logo);
      // GameStatut.HomeTeam.logo = this.state.Utilitites!.getImageFullPath(GameStatut.HomeTeam.logo);
      await window.app.saveToStore({ store: store });
      await window.app.sendToScoreboard({
        body: {
          GameStatut,
          LiveSettings: store.LiveSettings,
        }
      });
    } catch (error) {
      
    }
  }

  updateSponsorsList = async (sponsors: Sponsor[]): Promise<void> => {
    try {
      const store = this.state.store!;
      store.Sponsors = sponsors;
      await this.setState({ store });
    } catch (error) {
      
    }
  }

  // updatePlayersList = async (players: Player[]): Promise<void> => {
  //   try {
  //     const store = this.state.store!;
  //     store.Players = players;
  //     await this.setState({ store });
  //   } catch (error) {
      
  //   }
  // }
  

  // disconnectObs = (): void => {
  //   obsWs.disconnect();
  //   obsWs.removeListener('ConnectionClosed', () => { });
  // }

  // goLive = async (): Promise<void> => {
  //   await this.setState({ live: !this.state.live });
  // }  

  private changeSourceVisibility = async (data: { source: string, visible: boolean, scene: SceneName}): Promise<void> => {
    try {
      await await window.obs.changeSourceVisibility(data);
    } catch (error) {
      console.error(error);
    }
  }
  
  private setActiveScene = async (scene: SceneName): Promise<void> => {
    try {
      await window.obs.setActiveScene(scene);
    } catch (error) {
      console.error(error);
    }
  }
  
  private changeSourceText = async (data: { source: string, text: string, scene: SceneName}): Promise<void> => {
    try {
      await window.obs.changeSourceText(data);
    } catch (error) {
      console.error(error);
    }
  }

  setupPreview = async (): Promise<void> => {
    try {
      const previewContainer = document.getElementById('previewObs');
      if(previewContainer != null) {
        const { width, height, x, y } = previewContainer.getBoundingClientRect();
        const result = await window.obs.setupPreview({ width, height, x, y: y+24 });
        previewContainer.setAttribute('style', `height: ${result.height}px`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return this.props.children(this.state);
  }
}

export { ObsRemote };
export type { ObsRemoteState };

import { Component } from "react";
import OBSWebSocket from 'obs-websocket-js';
import { notification } from "antd";
// import { SceneName, GameStatut, Timeout, Team, GameEvent, TeamPossession, Quarter } from "../Models";
import { StoreType, SceneName, GameStatut as IGameStatut, LiveSettings as ILiveSettings, Timeout, Team, GameEvent, TeamPossession, Quarter, FileUp, ScoreType } from "../Models";
import { IpcService } from "../utils/IpcService";

const ipc = new IpcService();

const obsWs = new OBSWebSocket();

type ObsRemoteProps = {
  children: any;
};
type ObsRemoteState = {
  live: boolean;
  connectingObs: boolean;
  connected2Obs: boolean;
  scenes: {
    messageId: string;
    status: "ok";
    "current-scene": string | null;
    scenes: OBSWebSocket.Scene[];
  } | null;
  store: StoreType | null;

  reconnectObs: () => Promise<void>;
  goLive: () => Promise<void>;
  changeActiveScene: (name: SceneName) => Promise<void>;
  changeActiveCam: (name: string) => Promise<void>;
  updateLiveStatus: () => Promise<void>;
  updateTextProps: ({ props, value, homeTeam, bg }: { props: keyof Team & string | string; value: string | number | FileUp | Timeout; homeTeam?: boolean; bg?: boolean; }) => Promise<void>;
  updateSettings: (value: any) => Promise<void>;
  setScore: ({ isHomeTeam, scoreType, withAnimation }: { isHomeTeam: boolean; scoreType: ScoreType; withAnimation?: boolean; }) => Promise<void>;
  changePossession: () => Promise<void>;
  updateGameEventProps: ({ props, value }: { props: keyof GameEvent; value: boolean | Quarter | TeamPossession; }) => Promise<void>;
  startReplay: () => Promise<void>;
  getScreenshot: () => Promise<{ img?: string }>;
};

class ObsRemote extends Component<ObsRemoteProps, ObsRemoteState> {

  constructor(props: Readonly<ObsRemoteProps>) {
    super(props);
    this.state = {
      live: false,
      connectingObs: false,
      connected2Obs: false,
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
    };

    obsWs.on('ConnectionClosed', async () => {
      try {
        await this.setState({ connected2Obs: false });
      } catch (error) {
        
      }
    });
    

    obsWs.on('SwitchScenes', async (data) => {
      try {
        if(Object.values(SceneName).includes(data["scene-name"] as SceneName)) {
          await this.changeActiveScene(data["scene-name"] as SceneName);
        }
      } catch (error) {
        
      }
    });
  }

  componentDidMount = async (): Promise<void> => {
    try {
      await this.connectObs();
      await this.getScenes();
      await this.initGameStatut();
    } catch (error) {

    }
  }

  componentWillUnmount = async (): Promise<void> => {
    try {
      await this.disconnectObs();
    } catch (error) {

    }
  }

  workOnEvent(event: any): void {
    // tslint:disable-next-line: no-console
    console.debug(event);
    switch (event['update-type']) {
      case 'SwitchScenes':
        // if (event['scene-name'] === AvailableScenes.LIVE && this.replayPlaying) {
        //   this.replayPlaying = false;
        // }
        // if (event['scene-name'] === AvailableScenes.REPLAY && !this.replayPlaying) {
        //   this.replayPlaying = true;
        // }
        // if (this.scenes.find(scene => scene.name === event['scene-name']) !== undefined) {
        //   this.scenes.find(scene => scene.active).active = false;
        //   this.scenes.find(scene => scene.name === event['scene-name']).active = true;
        // }
        // // tslint:disable-next-line: no-string-literal
        // // this.scenes.find(scene => scene.name === event['scene-name']).sources = event['sources'];
        // // this.activeScene = event['scene-name'];
        break;
      case 'ScenesChanged':
      case 'SceneCollectionChanged':
      case 'SceneCollectionListChanged':
      case 'SwitchTransition':
      case 'TransitionListChanged':
      case 'TransitionDurationChanged':
      case 'ProfileChanged':
      case 'ProfileListChanged':
        break;
      case 'SceneItemVisibilityChanged':
        // tslint:disable-next-line: max-line-length
        // this.scenes.find(scene => scene.active).sources.find(source => source.name === event['item-name']).render = event['item-visible'];
        break;
      case 'StreamStatus':
        // const streamStatus = new StreamStatus(event);
        // // console.log(streamStatus);
        // // const newData = [];
        // this.streamTime = event['stream-timecode'];
        // this.liveUpdateChartData.push({
        //   value: [
        //     new Date().toISOString(),
        //     Math.round(streamStatus.cpuUsage),
        //   ],
        // });

        // this.framesChartData[0].value = streamStatus.numDroppedFrames;
        // this.framesChartData[1].value = streamStatus.numTotalFrames - streamStatus.numDroppedFrames;
        // if (this.liveUpdateChartData.length > 50) {
        //   this.liveUpdateChartData.shift();
        // }
        // // newData.push({ value: [new Date(), event['cpu-usage']] });
        // this.liveUpdateChartData = [...this.liveUpdateChartData];
        // this.framesChartData = [...this.framesChartData];
        // this.isStreaming = streamStatus.streaming;
        // // tslint:disable-next-line: no-string-literal
        // // this.isStreaming = event['streaming'];
        // // // tslint:disable-next-line: no-string-literal
        // // this.isRecording = event['recording'];
        // // this.streamLength = event['total-stream-time'];

        // // // tslint:disable-next-line: no-string-literal
        // // this.fps = event['fps'];
        // // this.droppedFrames = event['num-dropped-frames'];
        // // this.totalFrames = event['num-total-frames'];
        // // // tslint:disable-next-line: no-string-literal
        // // this.droppedFramesPercent = event['strain'];
        // // this.transmittionSpeed = event['kbits-per-sec'];
        // // this.transmittionSpeedB = event['bytes-per-sec'];
        // // {
        // //   bytes - per - sec: 63972
        // //   fps: 30.000000300000007
        // //   kbits - per - sec: 499
        // //   num - dropped - frames: 1165
        // //   num - total - frames: 1473
        // //   preview - only: false
        // //   recording: false
        // //   strain: 1
        // //   stream - timecode: "00:00:50.014"
        // //   streaming: true
        // //   total - stream - time: 50
        // //   update - type: "StreamStatus"
        // // }
        break;

      case 'TransitionBegin':
        break;
      case 'StudioModeSwitched':
      case 'StreamStarting':
      case 'StreamStopping':
      case 'ReplayStarting':
      case 'ReplayStarted':
      case 'ReplayStopping':
      case 'ReplayStopped':
        // tslint:disable-next-line:no-console
        // console.debug(event);
        break;

      case 'StreamStarted':
        // this.isStreaming = true;

        // // start replay buffer
        // // this.obsWebsocket.StartReplayBuffer().catch((err: Error) => { console.error(err); });
        break;

      case 'StreamStopped':
        // this.isStreaming = false;
        // // reset charts datas
        // this.liveUpdateChartData = [];
        // this.framesChartData[0].value = 0;
        // this.framesChartData[1].value = 0;
        // this.framesChartData = [...this.framesChartData];
        // // stop replay buffer
        // // this.obsWebsocket.StopReplayBuffer().catch((err: Error) => { console.error(err); });
        // this.obsWebsocket.setCurrentScene(AvailableScenes.STARTING).catch((err: Error) => { console.error(err); });
        break;

      default:
        // tslint:disable-next-line:no-console
        // console.debug(event);
        break;
    }
  }

  connectObs = async (): Promise<void> => {
    try {
      await this.setState({ connectingObs: true });
      await obsWs.connect({ address: 'localhost:4444' });
      notification['success']({
        message: 'Connecté à OBS',
        // description: '',
        placement: 'bottomRight',
      });
      await this.setState({ connectingObs: false, connected2Obs: true });
    } catch (error) {
      notification['error']({
        message: 'Connection à OBS impossible',
        description: `${error.description}`,
        placement: 'bottomRight',
      });
      await this.setState({ connectingObs: false });
    }
  }

  getScenes = async (): Promise<void> => {
    try {
      let scenesData = await obsWs.send('GetSceneList');
      scenesData.scenes = scenesData.scenes.filter(item => {
        return !item.name.startsWith('*');
      })
      await this.setState({ scenes: scenesData });
    } catch (error) {

    }
  }

  initGameStatut = async (): Promise<void> => {
    try {
      let logoH = await (await obsWs.send('GetSourceSettings', { sourceName: 'Home Logo' })).sourceSettings as any;
      const HomeTeam: Team = {
        name: await (await obsWs.send('GetTextGDIPlusProperties', { source: 'Home Name Text' })).text,
        city: await (await obsWs.send('GetTextGDIPlusProperties', { source: 'Home City Text' })).text,
        score: +await (await obsWs.send('GetTextGDIPlusProperties', { source: 'Home Score Text' })).text,
        logo: logoH.file,
        color: "#133155",
        timeout: Timeout.THREE
      }
      let logoA = await (await obsWs.send('GetSourceSettings', { sourceName: 'Away Logo' })).sourceSettings as any;
      const AwayTeam: Team = {
        name: await (await obsWs.send('GetTextGDIPlusProperties', { source: 'Away Name Text' })).text,
        city: await (await obsWs.send('GetTextGDIPlusProperties', { source: 'Away City Text' })).text,
        score: +await (await obsWs.send('GetTextGDIPlusProperties', { source: 'Away Score Text' })).text,
        logo: logoA.file,
        color: "#612323",
        timeout: Timeout.THREE
      }
      let Options: GameEvent = {
        flag: false,
        possession: TeamPossession.HOME,
        quarter: Quarter.Q1,
        showScoreboard: true
      }
      let GameStatut: IGameStatut = {
        HomeTeam,
        AwayTeam,
        Options,
      }
      const buffer = await (await obsWs.send('GetSourceSettings', { sourceName: 'Replay Video' })).sourceSettings as any;
      const bitrate = +await ipc.send<string>('obs-settings', { params: { getter: true }});
      let LiveSettings: ILiveSettings = {
        bitrate,
        buffer: buffer.duration,
        streamKey: await (await obsWs.send('GetStreamSettings')).settings.key,
      }
      let bgImg = await (await obsWs.send('GetSourceSettings', { sourceName: 'Background' })).sourceSettings as any;
      let store: StoreType = {
        GameStatut,
        LiveSettings,
        BackgroundImage: bgImg.file

      };
      await this.setState({ store });
    } catch (error) {

    }
  }

  updateSettings = async (value: any): Promise<void> => {
    try {
      await obsWs.send('SetSourceSettings', { sourceName: 'Replay Video', sourceSettings: { duration: +value.buffer * 1000 } });
      await obsWs.send('SetStreamSettings', { type: 'rtmp_common', settings: { key: value.key }, save: true});
      await ipc.send<void>('obs-settings', { params: { setter: true, bitrate: +value.bitrate }});
    } catch (error) {

    }
  }

  changeActiveScene = async (name: SceneName): Promise<void> => {
    try {
      await obsWs.send('SetCurrentScene', { "scene-name": name });
      let data = this.state.scenes;
      data!["current-scene"] = name.startsWith('*') ? null : name as string;
      await this.setState({ scenes: data });
    } catch (error) {

    }
  }

  changeActiveCam = async (name: string): Promise<void> => {
    try {
      let oldCam: string = '';
      const indexLive = this.state.scenes?.scenes.findIndex(scene => scene.name === SceneName.Live)!;
      this.state.scenes?.scenes[indexLive].sources.forEach(item => {
        if (item.name.startsWith('cam')) {
          if (item.render) {
            item.render = false;
            oldCam = item.name;
          }
          if (item.name === name) {
            item.render = true;
          }
        }
      });
      await obsWs.send('SetSceneItemProperties', { item: name, visible: true, 'scene-name': SceneName.Live } as any);
      await obsWs.send('SetSceneItemProperties', { item: oldCam, visible: false, 'scene-name': SceneName.Live } as any);
      await this.setState({ scenes: this.state.scenes });
    } catch (error) {

    }
  }

  updateLiveStatus = async (): Promise<void> => {
    try {
      if (this.state.live) {
        await obsWs.send('StopStreaming');
      } else {
        await obsWs.send('StartStreaming', {});
      }
      await this.setState({ live: !this.state.live });
    } catch (error) {

    }
  }

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

  updateTextProps = async ({ props, value, homeTeam = false, bg = false }: { props: keyof Team & string | string; value: string | number | FileUp | Timeout; homeTeam?: boolean; bg?: boolean; }): Promise<void> => {
    try {
      let store = this.state.store!;
      switch (props) {
        case 'city':
          homeTeam ? store.GameStatut.HomeTeam.city = value as string : store.GameStatut.AwayTeam.city = value as string;
          homeTeam ? await obsWs.send('SetTextGDIPlusProperties', { source: 'Home City Text', text: value as string }) : await obsWs.send('SetTextGDIPlusProperties', { source: 'Away City Text', text: value as string });
          break;
        case 'color':
          homeTeam ? store.GameStatut.HomeTeam.color = value as string : store.GameStatut.AwayTeam.color = value as string;
          // homeTeam ? await obsWs.send('SetTextGDIPlusProperties', { source: 'Home Name Text', text: value as string }) : await obsWs.send('SetTextGDIPlusProperties', { source: 'Away Name Text', text: value as string });
          break;
        case 'logo':
          if(bg) {
            const base64Img: string = await this.getBase64((value as FileUp).file);
            store.BackgroundImage = base64Img;
            await obsWs.send('SetSourceSettings', { sourceName: 'Background', sourceSettings: { file: (value as FileUp).pathElectron } });
          } else {
            const base64Img: string = await this.getBase64((value as FileUp).file);
            homeTeam ? store.GameStatut.HomeTeam.logo = base64Img : store.GameStatut.AwayTeam.logo = base64Img;
            homeTeam ? await obsWs.send('SetSourceSettings', { sourceName: 'Home Logo', sourceSettings: { file: (value as FileUp).pathElectron } }) : await obsWs.send('SetSourceSettings', { sourceName: 'Away Logo', sourceSettings: { file: (value as FileUp).pathElectron } });
          }
          break;
        case 'name':
          homeTeam ? store.GameStatut.HomeTeam.name = value as string : store.GameStatut.AwayTeam.name = value as string;
          homeTeam ? await obsWs.send('SetTextGDIPlusProperties', { source: 'Home Name Text', text: value as string }) : await obsWs.send('SetTextGDIPlusProperties', { source: 'Away Name Text', text: value as string });
          break;
        case 'score':
          homeTeam ? store.GameStatut.HomeTeam.score = Math.trunc(value as number) : store.GameStatut.AwayTeam.score = Math.trunc(value as number);
          const score: string = homeTeam ? '' + store.GameStatut.HomeTeam.score : '' +store.GameStatut.AwayTeam.score;
          homeTeam ? await obsWs.send('SetTextGDIPlusProperties', { source: 'Home Score Text', text: score.padStart(2, '0') }) : await obsWs.send('SetTextGDIPlusProperties', { source: 'Away Score Text', text: score.padStart(2, '0') });
          break;
        case 'timeout':
          homeTeam ? store.GameStatut.HomeTeam.timeout = value as Timeout : store.GameStatut.AwayTeam.timeout = value as Timeout ;
          // homeTeam ? await obsWs.send('SetTextGDIPlusProperties', { source: 'Home Name Text', text: value }) : await obsWs.send('SetTextGDIPlusProperties', { source: 'Away Name Text', text: value });
          break;

        default:
          break;
      }
      await this.setState({ store });
    } catch (error) {

    }
  }

  updateGameEventProps = async ({ props, value }: { props: keyof GameEvent; value: boolean | Quarter | TeamPossession; }): Promise<void> => {
    try {
      let store = this.state.store!;
      switch (props) {
        case 'quarter':
          store.GameStatut.Options.quarter = value as Quarter;
          break;
        case 'showScoreboard':
          store.GameStatut.Options.showScoreboard = value as boolean;
          await obsWs.send('SetSceneItemProperties', { item: 'scoreboard', visible: value as boolean, 'scene-name': SceneName.Live } as any);
          break;
        case 'flag':
          store.GameStatut.Options.flag = value as boolean;
          break;
        case 'possession':
          store.GameStatut.Options.possession = value as TeamPossession;
          break;

        default:
          break;
      }
      await this.setState({ store });
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
        await obsWs.send('SetSceneItemProperties', { item: scoreType, visible: true, 'scene-name': SceneName.Live } as any);
        setTimeout(async () => {
          await obsWs.send('SetSceneItemProperties', { item: scoreType, visible: false, 'scene-name': SceneName.Live } as any);
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
      if(this.state.scenes?.["current-scene"] !== SceneName.Replay) {
        await obsWs.send('SaveReplayBuffer');
        await this.changeActiveScene(SceneName.Replay);
        setTimeout(async () => {
          await this.changeActiveScene(SceneName.Live);
        }, this.state.store?.LiveSettings.buffer);
      }
    } catch (error) {
      
    }
  }

  
  getScreenshot = async (): Promise<{ img?: string }> => {
    try {
      let data = await obsWs.send('TakeSourceScreenshot', { sourceName: this.state.scenes?.["current-scene"]!, embedPictureFormat: 'jpeg', width: 450, height: 254 });
      return data;
    } catch (error) {
      return {};
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

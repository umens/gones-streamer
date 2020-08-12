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
    "current-scene": string;
    scenes: OBSWebSocket.Scene[];
  } | null;
  store: StoreType | null;

  reconnectObs: () => Promise<void>;
  goLive: () => Promise<void>;
  changeActiveScene: (name: SceneName) => Promise<void>;
  changeActiveCam: (name: string) => Promise<void>;
  updateLiveStatus: () => Promise<void>;
  updateTextProps: ({ props, value, homeTeam, bg }: { props: keyof Team & string; value: string | number | FileUp | Timeout; homeTeam?: boolean; bg?: boolean; }) => Promise<void>;
  updateSettings: (value: any) => Promise<void>;
  setScore: (isHomeTeam: boolean, scoreType: ScoreType) => Promise<void>;
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
    };

    obsWs.on('ConnectionClosed', async () => {
      await this.setState({ connected2Obs: false });
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
        quarter: Quarter.ONE,
        showScoreboard: false
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
      await obsWs.send('SetSourceSettings', { sourceName: 'Replay Video', sourceSettings: { duration: +value.buffer } });
      await obsWs.send('SetStreamSettings', { type: 'rtmp_common', settings: { key: value.key }, save: true});
      await ipc.send<void>('obs-settings', { params: { setter: true, bitrate: +value.bitrate }});
    } catch (error) {

    }
  }

  changeActiveScene = async (name: SceneName): Promise<void> => {
    try {
      await obsWs.send('SetCurrentScene', { "scene-name": name });
      let data = this.state.scenes;
      data!["current-scene"] = name as string;
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

  updateTextProps = async ({ props, value, homeTeam = false, bg = false }: { props: keyof Team & string; value: string | number | FileUp | Timeout; homeTeam?: boolean; bg?: boolean; }): Promise<void> => {
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

  
  setScore = (isHomeTeam: boolean, scoreType: ScoreType) => {
    try {
      let store = this.state.store;
      if()
      store?.
    } catch (error) {
      
    }
  };

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

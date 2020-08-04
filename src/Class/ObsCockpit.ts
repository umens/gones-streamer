import { notification } from 'antd';
import OBSWebSocket from 'obs-websocket-js';
const obsWs = new OBSWebSocket();

class ObsCockpit {
  
  live: boolean = false;

  // connexion
  obsWs: OBSWebSocket;
  connectingObs: boolean;
  connected2Obs: boolean;

  constructor(setState: any) {
    this.obsWs = obsWs;
    this.live = false;
    this.connectingObs = false;
    this.connected2Obs = false;

    // Event Websocket
    this.obsWs.on('ConnectionClosed', () => {
      console.log('closed')
      this.connected2Obs = false;
    });
  }

  connectObs = async () => {
    try {
      this.connectingObs = true;
      await this.obsWs.connect({ address: 'localhost:4444' });
      notification['success']({
        message: 'Connecté à OBS',
        // description: '',
        placement: 'bottomRight',
      });
      this.connectingObs = false;
      this.connected2Obs = true;
    } catch (error) {
      notification['error']({
        message: 'Connection à OBS impossible',
        description: `${error.description}`,
        placement: 'bottomRight',
      });
      this.connectingObs = false;
    }
  }

  disconnectObs = () => {
    this.obsWs.disconnect();
    this.obsWs.removeListener('ConnectionClosed', () => {});
  }

  changeLive = () => {
    this.live = !this.live;
  }

};

export { ObsCockpit };
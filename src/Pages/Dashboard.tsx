import React from "react";
import { Button, notification, message } from 'antd';
import { IpcService } from "../utils/IpcService";
import OBSWebSocket from 'obs-websocket-js';
import { StoreType } from "../../shared";

const ipc: IpcService = new IpcService();
const obsWs = new OBSWebSocket();

type DashboardProps = {
  // using `interface` is also ok
  message: string;
};
type DashboardState = {
  connected2Obs: boolean;
  loading: boolean;

  StoredConfig: StoreType | null;
  loadingSettings: boolean;
};
class Dashboard extends React.Component<DashboardProps, DashboardState> {

  constructor(props: Readonly<DashboardProps>) {
    super(props);
    this.state = {
      connected2Obs: false,
      loading: false,
      loadingSettings: false,
      StoredConfig: null,
    };
  }

  componentDidMount = async () => {
    try {
      await this.getStoredConfig();
      await this.connectToObs();
    } catch (error) {

    }
  }

  componentWillUnmount = () => {
    obsWs.removeListener('ConnectionClosed', () => {});
  }

  getStoredConfig = async () => {
    try {
      await this.setState({ loadingSettings: true });
      message.loading({ content: 'Loading settings...', key: 'loadingSettings' });
      let data = await ipc.send<{ StoredConfig: StoreType }>('stored-config');
      setTimeout(async () => {
        await this.setState({ StoredConfig: data.StoredConfig, loadingSettings: false });
        console.log(this.state.StoredConfig);
        console.log(data)
        message.success({ content: 'Settings loaded !', duration: 2, key: 'loadingSettings' });
      }, 5500);
    } catch (error) {
      // notification['error']({
      //   message: 'Connection à OBS via Websocket impossible',
      //   description: `${error.error}\n\n${error.description}\n\nRetrying in 10s...`,
      //   placement: 'bottomRight',
      // });
      throw error;
    }
  }

  connectToObs = async () => {
    try {
      obsWs.on('ConnectionClosed', async () => {
        await this.setState({ connected2Obs: false });
      });
      await obsWs.connect({ address: 'localhost:4444' });
      notification['success']({
        message: 'Succès',
        description: 'Connecté à OBS',
        placement: 'bottomRight',
      });
      await this.setState({ connected2Obs: true });
    } catch (error) {
      notification['error']({
        message: 'Connection à OBS impossible',
        description: `${error.description}`,
        placement: 'bottomRight',
      });
    }
  }

  // handleClick = async (event: SyntheticEvent) => {
  //   try {
  //     await this.setState({ loading: true });
  //     const t = await ipc.send<{ kernel: string }>('system-info');
  //     await this.setState({ text: t.kernel, loading: false });
  //   } catch (error) {
  //     notification['error']({
  //       message: 'Connection à OBS via Websocket impossible',
  //       description: `${error.error}\n\n${error.description}\n\nRetrying in 10s...`,
  //       placement: 'bottomRight',
  //     });
  //   }
  // }

  render() {
    return (
      <div>
        {/* <Button type="primary" loading={this.state.loading} onClick={this.handleClick}>Button</Button> */}
        <p>
        { this.state.StoredConfig?.LiveSettings.bitrate || 'test' }
        </p>
      </div>
    );
  }
};

export { Dashboard };

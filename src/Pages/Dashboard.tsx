import React from "react";
import { Button, notification } from 'antd';
import { IpcService } from "../utils/IpcService";
import OBSWebSocket from 'obs-websocket-js';

const ipc: IpcService = new IpcService();
const obsWs = new OBSWebSocket();

type DashboardProps = {
  // using `interface` is also ok
  message: string;
};
type DashboardState = {
  retry: number; // like this
  text: string; // like this
};
class Dashboard extends React.Component<DashboardProps, DashboardState> {
  
  constructor(props: Readonly<DashboardProps>) {
    super(props);
    this.state = {
      // optional second annotation for better type inference
      retry: 2,
      text: '',
    };
  }

  connectToObs = async () => {
    try {
      await obsWs.connect({ address: 'localhost:4444' });
      notification['success']({
        message: 'Succès',
        description: 'Connecté à OBS via Websocket',
        placement: 'bottomRight',
      });    
    } catch (error) {
      notification['error']({
        message: 'Connection à OBS via Websocket impossible',
        description: `${error.error}\n\n${error.description}\n\nRetrying in 10s...`,
        placement: 'bottomRight',
      });  
      // throw error;
    }
  }

  componentWillMount = async () => {
    obsWs.on('ConnectionClosed', () => {
      if (this.state.retry > 0) {
        setTimeout(async () => {
          await this.setState({ retry: this.state.retry - 1 });
          await this.connectToObs();
        }, 10*1000);
      }
    });
    try {
      await this.connectToObs();
    } catch (error) {
    }
  }

  handleClick = async (e: any) => {
    e.preventDefault();
    const t = await ipc.send<{ kernel: string }>('system-info');
    await this.setState({ text: t.kernel });
  }

  render() {
    return (
      <div>
        {this.state.retry} <Button type="primary" onClick={this.handleClick}>Button</Button>
        <p>
        {this.state.text}
        </p>
      </div>
    );
  }
};

export { Dashboard };

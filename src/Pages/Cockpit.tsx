import React, { SyntheticEvent } from "react";
import { notification, message, Affix, Avatar, Button, Row, Col, Card } from 'antd';
import { IpcService } from "../utils/IpcService";
import { StoreType } from "../../shared";
import { ApiFilled, WifiOutlined, LoadingOutlined } from '@ant-design/icons';
import { ObsCockpit } from "../Class";
import { Scenes } from "../Components";

const ipc: IpcService = new IpcService();

type CockpitProps = {
  // using `interface` is also ok
  message: string;
};
type CockpitState = {
  connectingObs: boolean;
  connected2Obs: boolean;
  loading: boolean;

  StoredConfig: StoreType | null;
  loadingSettings: boolean;
  ObsCockpit: ObsCockpit;
};
class Cockpit extends React.Component<CockpitProps, CockpitState> {


  constructor(props: Readonly<CockpitProps>) {
    super(props);
    this.state = {
      connectingObs: false,
      connected2Obs: false,
      loading: false,
      loadingSettings: false,
      StoredConfig: null,
      ObsCockpit: new ObsCockpit(this.setState),
    };
  }

  componentDidMount = async () => {
    try {
      await this.getStoredConfig();
      await this.state.ObsCockpit.connectObs();
      await this.setState({ ObsCockpit: this.state.ObsCockpit })
    } catch (error) {

    }
  }

  componentWillUnmount = () => {
    // obsWs.removeListener('ConnectionClosed', () => {});
  }

  getStoredConfig = async () => {
    try {
      await this.setState({ loadingSettings: true });
      message.loading({ content: 'Loading settings...', key: 'loadingSettings' });
      let data = await ipc.send<{ StoredConfig: StoreType }>('stored-config');      
      await this.setState({ StoredConfig: data.StoredConfig, loadingSettings: false });
      message.success({ content: 'Settings loaded !', duration: 2, key: 'loadingSettings' });
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
      this.state.ObsCockpit.changeLive();
      // obsWs.on('ConnectionClosed', async () => {
      //   await this.setState({ connected2Obs: false });
      // });
      await this.setState({ connectingObs: true });
      // await obsWs.connect({ address: 'localhost:4444' });
      notification['success']({
        message: 'Connecté à OBS',
        // description: '',
        placement: 'bottomRight',
      });
      await this.setState({ connected2Obs: true, connectingObs: false });
    } catch (error) {
      notification['error']({
        message: 'Connection à OBS impossible',
        description: `${error.description}`,
        placement: 'bottomRight',
      });
      await this.setState({ connectingObs: false });
    }
  }

  handleClick = async (event: SyntheticEvent) => {
      try {
        await this.connectToObs();
      } catch (error) {
      }
    }

  render() {
    let obsState;

    if(this.state.ObsCockpit.connectingObs) {
      obsState = <Avatar size="large" style={{ color: '#1890ff' }} icon={<LoadingOutlined />} />;
    } else {
      if (this.state.ObsCockpit.connected2Obs) {
        obsState = <Avatar size="large" style={{ color: '#52c41a' }} icon={<WifiOutlined />} />;
      } else {
        obsState = <Button type="text" shape="circle" size="large" style={{ color: '#ff4d4f', backgroundColor: '#ffffff4d' }} icon={<ApiFilled />} onClick={this.handleClick}/>;
      }
    }

    return (
      <div>
        {/* <Button type="primary" loading={this.state.loading} onClick={this.handleClick}>Button</Button> */}
        {/* <p>
        { this.state.StoredConfig?.LiveSettings.bitrate || 'test' }
        </p> */}
        <Row gutter={16}>
          <Col span={8}>
            <Card title="Card title" loading={this.state.loadingSettings}>
              Card content
            </Card>
          </Col>
          <Col span={8}>
            <Scenes ObsCockpit={this.state.ObsCockpit} />
            {/* <Card title="Card title" loading={this.state.loadingSettings}bordered={false}>
              Card content
            </Card> */}
          </Col>
          <Col span={8}>
            <Card title="Card title" loading={this.state.loadingSettings} bordered={false}>
              Card content
            </Card>
          </Col>
        </Row>
        <Affix style={{position:'fixed',bottom:25,right:25}}>
          {obsState}
        </Affix>
      </div>
    );
  }
};

export { Cockpit };

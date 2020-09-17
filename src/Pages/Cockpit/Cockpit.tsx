import React from "react";
import { message, Button, Row, Col, Card, PageHeader, Tag, Statistic, Menu, Dropdown, Popconfirm } from 'antd';
import { IpcService } from "../../utils/IpcService";
import { StoreType } from "../../Models";
import { DownOutlined, ArrowUpOutlined, ArrowDownOutlined, SyncOutlined } from '@ant-design/icons';
import { Scenes, IObsRemote, Team, ScoreTable, GameControl } from "../../Components";
import './Cockpit.css';

const ipc: IpcService = new IpcService();

type CockpitProps = {
  ObsRemote: IObsRemote;
};
type CockpitState = {
  loading: boolean;

  StoredConfig: StoreType | null;
  loadingSettings: boolean;
  loadingLiveStatus: boolean;
};
class Cockpit extends React.Component<CockpitProps, CockpitState> {

  constructor(props: Readonly<CockpitProps>) {
    super(props);
    this.state = {
      loading: false,
      loadingSettings: false,
      StoredConfig: null,
      loadingLiveStatus: false,
    };
  }

  componentDidMount = async () => {
    try {
      await this.getStoredConfig();
    } catch (error) {

    }
  }

  getStoredConfig = async () => {
    try {
      await this.setState({ loadingSettings: true });
      message.loading({ content: 'Loading settings...', key: 'loadingSettings' });
      let data = await ipc.send<{ StoredConfig: StoreType }>('stored-config');
      // setTimeout(async () => {
        await this.setState({ StoredConfig: data.StoredConfig, loadingSettings: false });
        message.success({ content: 'Settings loaded !', duration: 2, key: 'loadingSettings' });
      // }, 2000);
    } catch (error) {
      // notification['error']({
      //   message: 'Connection à OBS via Websocket impossible',
      //   description: `${error.error}\n\n${error.description}\n\nRetrying in 10s...`,
      //   placement: 'bottomRight',
      // });
      // throw error;
    }
  }

  changeLiveStatus = async () => {
    try {
      if(!this.state.loadingLiveStatus) {
        this.setState({ loadingLiveStatus: true });
        await this.props.ObsRemote.updateLiveStatus();
        this.setState({ loadingLiveStatus: false });
      }
    } catch (error) {
      
    }
  }

  handleMenuClick = (e: any) => {
    console.log('click', e);
  }

  render() {

    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="new">Start New Game</Menu.Item>
        <Menu.Item key="reset">Reset Game</Menu.Item>
      </Menu>
    );

    return (
      <>
        <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
          <Col span={24}>
            <PageHeader
              className="site-page-header"
              tags={this.props.ObsRemote.live ? 
                <Popconfirm
                  title="Voulez vous vraiment arrêter le live"
                  onConfirm={this.changeLiveStatus}
                  okText="Oui"
                  cancelText="Non"
                  placement="right"
                >
                  <Tag icon={(this.state.loadingLiveStatus) ? <SyncOutlined spin /> : null } color="processing">Running</Tag>
                </Popconfirm>
                : <Popconfirm
                  title="Voulez vous vraiment démarrer le live"
                  onConfirm={this.changeLiveStatus}
                  okText="Oui"
                  cancelText="Non"
                  placement="right"
                >
                  <Tag icon={(this.state.loadingLiveStatus) ? <SyncOutlined spin /> : null } color="default">Not running</Tag>
                </Popconfirm> 
              }
              title="Stream is"
              extra={[
                <Dropdown key="menu" overlay={menu}>
                  <Button>
                    Actions <DownOutlined />
                  </Button>
                </Dropdown>,
              ]}
            >
              <Row>
                <Statistic title="Length" value="00:00m" />
                <Statistic
                  title="Dropped Frame"
                  prefix={ true ? <ArrowUpOutlined /> : <ArrowDownOutlined /> }
                  // suffix="img"
                  suffix="%"
                  value="0.32"
                  valueStyle={ true ? { color: '#cf1322' } : { color: '#3f8600' } }
                  style={{
                    margin: '0 32px',
                  }}
                />
              </Row>
            </PageHeader>
          </Col>
        </Row>
        <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
          <Col span={8}>
            <Card title="Card title" loading={this.state.loadingSettings}>
              Card content
            </Card>
          </Col>
          <Col span={8}>
            <Card style={{ color: '#000000', background: `linear-gradient(150deg, #ffffff 40%, ${this.props.ObsRemote.store?.GameStatut?.HomeTeam.color} 80%)`}} loading={this.state.loadingSettings}>
              <Team key="homeTeam" ObsRemote={this.props.ObsRemote} isHomeTeam={true} />
            </Card>
          </Col> 
          <Col span={8}>
            <Card style={{ color: '#000000', background: `linear-gradient(150deg, #ffffff 40%, ${this.props.ObsRemote.store?.GameStatut?.AwayTeam.color} 80%)`}} loading={this.state.loadingSettings}>
              <Team key="awayTeam" ObsRemote={this.props.ObsRemote} isHomeTeam={false} />
            </Card>
          </Col>
        </Row>
        <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
          <Col span={8}>
            <Scenes ObsRemote={this.props.ObsRemote} />
          </Col>
          <Col span={16}>
            <Card loading={this.state.loadingSettings}>
              <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                <Col span={24}>                  
                  {/* <Scoreboard ObsRemote={this.props.ObsRemote} /> */}
                </Col>
              </Row>
              <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                <Col span={24}>                  
                  <GameControl ObsRemote={this.props.ObsRemote} />
                </Col>
              </Row>
              <Row gutter={[16, 0]}>
                <Col span={12}>
                  <ScoreTable key="homeTeamtable" ObsRemote={this.props.ObsRemote} isHomeTeam={true} />
                </Col>
                <Col span={12}>
                  <ScoreTable key="awayTeamtable" ObsRemote={this.props.ObsRemote} isHomeTeam={false} />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        {/* <Affix style={{position:'fixed',bottom:25,right:25}}>
          {obsState}
        </Affix> */}
      </>
    );
  }
};

export { Cockpit };

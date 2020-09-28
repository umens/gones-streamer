import React, { createRef } from "react";
import { message, Button, Row, Col, Card, PageHeader, Tag, Statistic, Menu, Dropdown, Popconfirm, Descriptions, Input } from 'antd';
import { IpcService } from "../../utils/IpcService";
import { StoreType } from "../../Models";
import { DownOutlined, ArrowUpOutlined, ArrowDownOutlined, SyncOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { Scenes, IObsRemote, GameControl, Preview, Editable, ScoreboardEditable } from "../../Components";
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
  displayPreview: boolean;
  TabKey: string;
};
class Cockpit extends React.Component<CockpitProps, CockpitState> {

  constructor(props: Readonly<CockpitProps>) {
    super(props);
    this.state = {
      loading: false,
      loadingSettings: false,
      StoredConfig: null,
      loadingLiveStatus: false,
      displayPreview: false,
      TabKey: 'GameControl',
    };
  }

  componentDidMount = async () => {
    try {
      await this.getStoredConfig();
      // setTimeout(async () => {
      //   await this.setState({ displayPreview: true });
      // }, 500);
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

  togglePreview = async (e: any) => {
    try {
      await this.setState({ displayPreview: !this.state.displayPreview });
    } catch (error) {

    }
  }

  changeText = async (prop: string, value: string) => {
    try {
      await this.props.ObsRemote.updateTextProps({ props: prop, value });
    } catch (error) {
    }
  }

  render() {

    const tabList = [
      {
        key: 'GameControl',
        tab: 'Game Control',
      },
      {
        key: 'PlayerControl',
        tab: 'Players',
      },
      {
        key: 'SponsorControl',
        tab: 'Sponsors',
      },
    ];
    const contentList: { [key: string]: JSX.Element } = {
      'GameControl': <GameControl ObsRemote={this.props.ObsRemote} />,
      'PlayerControl': <p>Coming soon</p>,
      'SponsorControl': <p>Coming soon</p>,
    };

    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="new">Start New Game</Menu.Item>
        <Menu.Item key="reset">Reset Game</Menu.Item>
      </Menu>
    );
    const inputNameRef = createRef<Input>();

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
                <Col span={8} style={{ display: "flex" }}>
                <Statistic title="Length" value="00:00m" />
                  <Statistic
                    title="Dropped Frame"
                    prefix={ true ? <ArrowUpOutlined /> : <ArrowDownOutlined /> }
                    suffix="%"
                    value="0.32"
                    valueStyle={ true ? { color: '#cf1322' } : { color: '#3f8600' } }
                    style={{
                      margin: '0 32px',
                    }}
                  />
                </Col>
                <Col span={8}>
                  <Descriptions size="small" column={1}>
                    <Descriptions.Item label="Compétition">
                    <Editable
                      text='D2'
                      placeholder='Compétition'
                      childref={inputNameRef}
                      type="input"
                    >
                      <Input ref={inputNameRef} type="text" name="competition" placeholder='Compétition' value='D2' onChange={(e) => this.changeText('competition', e.target.value)}/>
                    </Editable>
                    </Descriptions.Item>
                    <Descriptions.Item label="Journée">Week 3</Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
            </PageHeader>
          </Col>
        </Row>
        <Row gutter={[16, 0]}>
          <Col span={8}>
            <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
              <Col span={24}>
                <Card title="Preview" loading={this.state.loadingSettings} extra={this.state.displayPreview ? <Button size='small' onClick={this.togglePreview} icon={<EyeInvisibleOutlined />}>Hide</Button> : <Button size='small' onClick={this.togglePreview} icon={<EyeOutlined />}>Show</Button> }>
                  <Preview ObsRemote={this.props.ObsRemote} display={this.state.displayPreview} />
                </Card>
              </Col>
            </Row>
            <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
              <Col span={24}>
                <Scenes ObsRemote={this.props.ObsRemote} />
              </Col>
            </Row>
          </Col>
          <Col span={16}>
            <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
              <Col span={24}>
                <Card
                  bordered={false}
                  loading={this.state.loadingSettings}
                >
                  <ScoreboardEditable ObsRemote={this.props.ObsRemote} />
                </Card>
              </Col>
            </Row>
            <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
              <Col span={24}>
                <Card
                  loading={this.state.loadingSettings}
                  tabList={tabList}
                  activeTabKey={this.state.TabKey}
                  onTabChange={key => {
                    this.setState({ 'TabKey' : key });
                  }}
                >
                  { contentList[this.state.TabKey] }
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </>
    );
  }
};

export { Cockpit };

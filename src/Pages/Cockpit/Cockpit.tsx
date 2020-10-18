import React, { createRef } from "react";
import { message, Button, Row, Col, Card, PageHeader, Tag, Statistic, Menu, Dropdown, Popconfirm, Descriptions, Input, Modal, Form } from 'antd';
import { IpcService } from "../../Utils/IpcService";
import { GameEvent, SceneName, StoreType } from "../../Models";
import { DownOutlined, ArrowUpOutlined, ArrowDownOutlined, SyncOutlined, EyeInvisibleOutlined, EyeOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Scenes, IObsRemote, GameControl, Preview, Editable, ScoreboardEditable, SponsorControl, PlayerControl } from "../../Components";
// import ReactDropzone from "react-dropzone";
import './Cockpit.css';
import { FormInstance } from "antd/lib/form";

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
  newGameModalVisible: boolean;
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
      newGameModalVisible: false,
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
      // }, 1500);
    } catch (error) {

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

  handleMenuClick = async (e: any) => {
    let _this = this;
    switch (e.key) {
      case 'reset':
        Modal.confirm({
          title: 'Etes vous sûr ?',
          icon: <ExclamationCircleOutlined />,
          content: 'En cliquant sur OK, toutes les données du match seront remise à zéro',
          async onOk() {
            await _this.props.ObsRemote.resetGame();
          },
          onCancel() {},
        });
        break;
      case 'new':
        await this.setState({ newGameModalVisible: true });
        break;
    
      default:
        break;
    }
  }

  togglePreview = async (e: any) => {
    try {
      await this.setState({ displayPreview: !this.state.displayPreview });
    } catch (error) {

    }
  }

  changeText = async (prop: keyof GameEvent, value: string) => {
    try {
      await this.props.ObsRemote.updateGameEventProps({ props: prop, value });
    } catch (error) {
    }
  }

  onCreate = async (values: any) => {
    try {
      console.log('Received values of form: ', values);
      this.props.ObsRemote.newGame(values);
      await this.setState({ newGameModalVisible: false });
    } catch (error) {
      
    }
  };

  render() {

    const tabList = [
      {
        key: 'GameControl',
        tab: 'Game Control',
      },
      {
        key: 'PlayerControl',
        tab: 'Players',
        disabled: this.props.ObsRemote.scenes?.["current-scene"] !== SceneName.Live,
      },
      {
        key: 'SponsorControl',
        tab: 'Sponsors',
      },
    ];
    const contentList: { [key: string]: JSX.Element } = {
      'GameControl': <GameControl ObsRemote={this.props.ObsRemote} />,
      'PlayerControl': <PlayerControl ObsRemote={this.props.ObsRemote} />,
      'SponsorControl': <SponsorControl ObsRemote={this.props.ObsRemote} />,
    };

    const formRef = React.createRef<FormInstance>();

    const menu = (
      <Menu onClick={async(e) => await this.handleMenuClick(e)}>
        <Menu.Item key="new">Start New Game</Menu.Item>
        <Menu.Item key="reset">Reset Game</Menu.Item>
      </Menu>
    );
    const inputCompetRef = createRef<Input>();
    const inputWeekRef = createRef<Input>();

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
                        text={this.props.ObsRemote.store?.GameStatut.Options.competition}
                        placeholder='Compétition'
                        childRef={inputCompetRef}
                        type="input"
                      >
                        <Input size="small" ref={inputCompetRef} type="text" name="competition" placeholder='Compétition' value={this.props.ObsRemote.store?.GameStatut.Options.competition} onChange={(e) => this.changeText('competition', e.target.value)}/>
                      </Editable>
                    </Descriptions.Item>
                    <Descriptions.Item label="Journée">
                    <Editable
                        text={this.props.ObsRemote.store?.GameStatut.Options.journee}
                        placeholder='Journée'
                        childRef={inputWeekRef}
                        type="input"
                      >
                        <Input size="small" ref={inputWeekRef} type="text" name="journee" placeholder='Journée' value={this.props.ObsRemote.store?.GameStatut.Options.journee} onChange={(e) => this.changeText('journee', e.target.value)}/>
                      </Editable>
                    </Descriptions.Item>
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
                <Card title="Preview" loading={!this.props.ObsRemote.connected2Obs && !this.props.ObsRemote.firstDatasLoaded} extra={this.state.displayPreview ? <Button size='small' onClick={this.togglePreview} icon={<EyeInvisibleOutlined />}>Hide</Button> : <Button size='small' onClick={this.togglePreview} icon={<EyeOutlined />}>Show</Button> }>
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
                  loading={!this.props.ObsRemote.connected2Obs && !this.props.ObsRemote.firstDatasLoaded}
                >
                  <ScoreboardEditable ObsRemote={this.props.ObsRemote} />
                </Card>
              </Col>
            </Row>
            <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
              <Col span={24}>
                <Card
                  loading={!this.props.ObsRemote.connected2Obs && !this.props.ObsRemote.firstDatasLoaded}
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

        <Modal
          visible={this.state.newGameModalVisible}
          title="Nouveau match"
          okText="Enregistrer"
          cancelText="Annuler"
          onCancel={() => /*this.setState({ imgAwayLogo: undefined, imgHomeLogo: undefined, newGameModalVisible: false })*/this.setState({ newGameModalVisible: false })}
          onOk={() => {
            formRef.current!
              .validateFields()
              .then(async values => {
                try {
                  formRef.current!.resetFields();
                  await this.onCreate(values);
                } catch (error) {
                  console.log(error);
                }
              })
              .catch(info => {
                console.log('Validate Failed:', info);
              });
          }}
        >
          <Form
            // form={form}
            ref={formRef} 
            layout="horizontal"
            name="form_in_modal"
            initialValues={{ modifier: 'public' }}
          >
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <h3>Equipe 1</h3>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={11}>
                <Form.Item
                  style={{ marginBottom: 0 }}
                  name="name1"
                  label="Nom"
                  rules={[{ required: true, message: 'Le nom est obligatoire' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={11} offset={2}>                
                <Form.Item
                  style={{ marginBottom: 0 }}
                  name="city1"
                  label="Ville"
                  rules={[{ required: true, message: 'La ville est obligatoire' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <div className="separator">Contre</div>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <h3>Equipe 2</h3>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={11}>
              <Form.Item
                  style={{ marginBottom: 0 }}
                  name="name2"
                  label="Nom"
                  rules={[{ required: true, message: 'Le nom est obligatoire' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={11} offset={2}>                
                <Form.Item
                  style={{ marginBottom: 0 }}
                  name="city2"
                  label="Ville"
                  rules={[{ required: true, message: 'La ville est obligatoire' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </>
    );
  }
};

export { Cockpit };

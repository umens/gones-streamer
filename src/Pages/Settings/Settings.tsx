import React from "react";
import { CameraControl, IObsRemote, PlayerControl, SponsorControl, AudioControl, BackgroundTextControl } from "../../Components";
import { Row, Col, message, Form, Input, Button, Select, Card, Divider } from "antd";
import ReactDropzone from "react-dropzone";
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { FormInstance } from "antd/lib/form";
import { AutoUpdaterData, AutoUpdaterEvent, FileUp, StreamingService, StreamingSport, UpdateChannel } from "../../Models";

type SettingsProps = {  
  ObsRemote: IObsRemote;
};
type SettingsState = {
  loadingFile: boolean;
  sendingForm: boolean;
  key: string;
  loadingCams: boolean[];
  checkingUpdate: boolean;
  updaterMessage: string;
};
class Settings extends React.Component<SettingsProps, SettingsState> {
  
  formRef = React.createRef<FormInstance>();
  
  constructor(props: Readonly<SettingsProps>) {
    super(props);
    this.state = {
      loadingFile: false,
      sendingForm: false,
      key: 'background',
      loadingCams: [],
      checkingUpdate: false,
      updaterMessage: 'Check Update',
    };
  }

  componentDidMount = async () => {    
    window.addEventListener('autoUpdaterEvent', this.onData);
    // let devices = await navigator.mediaDevices.enumerateDevices();
    // console.log(devices.filter(({ kind }) => kind === "videoinput"));
  }

  onData = async (data: any) => {
    try {
      const detail: {eventType: AutoUpdaterEvent, data: AutoUpdaterData} = data.detail;
      // let key: string;
      // let args: ArgsProps;
      switch (detail.eventType) {
        case AutoUpdaterEvent.CHECKING:
          await this.setState({ updaterMessage: detail.data.message! });          
          break;
        case AutoUpdaterEvent.NOUPDATE:
          await this.setState({ checkingUpdate: false, updaterMessage: detail.data.message! });
          break;
        case AutoUpdaterEvent.AVAILABLE:
          await this.setState({ updaterMessage: detail.data.message! });
          window.app.handleUpdater(AutoUpdaterEvent.DOWNLOADRESQUESTED);
          break;
      
        case AutoUpdaterEvent.DOWNLOADING:
          await this.setState({ updaterMessage: detail.data.message! });
          break;
        case AutoUpdaterEvent.DOWNLOADED:
          await this.setState({ checkingUpdate: false, updaterMessage: detail.data.message! });
          window.app.handleUpdater(AutoUpdaterEvent.QUITANDINSTALL);
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
    }
  };

  uploadElectronFile = async () => {
    try {
      const fileData = await window.app.selectElectronFile(true);
      if(fileData) {
        await this.onChangeHandler([fileData], [], null);
      }
    } catch (error) {
    }
  }    

  beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  onChangeHandler = async (acceptedFiles: FileUp[], fileRejections: any[], event: any): Promise<void> => {
    try {
      if(this.beforeUpload(acceptedFiles[0].file)) {
        await this.setState({ loadingFile: true });
        const data = await window.app.setFile({ file: acceptedFiles[0]?.pathElectron, isBg: true });
        await this.props.ObsRemote.updateTextProps({ props: 'logo', value: { file: acceptedFiles[0].file, pathElectron: data.split('#').shift()! }, bg: true});
        await this.setState({ loadingFile: false });
      }
    } catch (error) {
      
    }
  };

  onFinish = async (values: any) => {
    try {
      await this.setState({ sendingForm: true });
      await this.props.ObsRemote.updateSettings(values);
      await this.setState({ sendingForm: false });      
      message.success({ content: 'Settings updated !', key: 'settingsupdated' });
    } catch (error) {
      await this.setState({ sendingForm: false });
    }
  };

  activateCam = async (index: number) => {
    this.setState(({ loadingCams }) => {
      const newLoadings = [...loadingCams];
      newLoadings[index] = true;

      return {
        loadingCams: newLoadings,
      };
    });
    setTimeout(() => {
      this.setState(({ loadingCams }) => {
        const newLoadings = [...loadingCams];
        newLoadings[index] = false;

        return {
          loadingCams: newLoadings,
        };
      });
    }, 6000);
  }

  render() {
    
    const uploadButton = (
      <div>
        {this.state.loadingFile ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    
    const tabList = [
      {
        key: 'background',
        tab: 'Image d\'arrière plan',
      },
      {
        key: 'colorsText',
        tab: 'Paramètres des textes de présentation',
      },
      {
        key: 'cameras',
        tab: 'Cameras',
      },
      {
        key: 'audio',
        tab: 'Audio',
      },
      {
        key: 'playersAdmin',
        tab: 'Players',
      },
      {
        key: 'sponsorsAdmin',
        tab: 'Sponsors',
      },
    ];

    const contentList: { [key: string]: JSX.Element } = 
    {
      background: <ReactDropzone noDrag={true} /*onDrop={this.onChangeHandler}*/>
        {({getRootProps, getInputProps}: any) => (
          <section className="container">
            <span className="avatar-uploader ant-upload-picture-card-wrapper">
              <div {...getRootProps({className: 'dropzone ant-upload ant-upload-select ant-upload-select-picture-card', onClick: async (e: Event) => { e.stopPropagation(); await this.uploadElectronFile(); }, style: { width: '100%', height: 'auto' }})}>
                <input {...getInputProps({ multiple: false })} />
                <span tabIndex={0} className="ant-upload" role="button">
                  <div>
                    {this.props.ObsRemote.store?.BackgroundImage ? <img src={this.props.ObsRemote.Utilitites?.getImageFullPath(this.props.ObsRemote.store?.BackgroundImage)} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                  </div>
                </span>
              </div>
            </span>
          </section>
        )}
      </ReactDropzone>,
      colorsText: <BackgroundTextControl ObsRemote={this.props.ObsRemote} />,
      cameras: <CameraControl ObsRemote={this.props.ObsRemote} editable={true} />,
      audio: <AudioControl ObsRemote={this.props.ObsRemote} editable={true} />,
      playersAdmin: <PlayerControl ObsRemote={this.props.ObsRemote} editable={true} />,
      sponsorsAdmin: <SponsorControl ObsRemote={this.props.ObsRemote} editable={true} />,
    };

    return (
      <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
        <Col span={8}>
          <Card title="Paramètres">
            <Form
              layout='vertical'
              ref={this.formRef}
              name="control-ref"
              onFinish={this.onFinish}
              initialValues={{
                key: this.props.ObsRemote.store?.LiveSettings?.streamKey,
                service: this.props.ObsRemote.store?.LiveSettings?.streamingService,
                sport: this.props.ObsRemote.store?.LiveSettings?.sport,
                buffer: (this.props.ObsRemote.store?.LiveSettings?.buffer || 0) / 1000,
                bitrate: this.props.ObsRemote.store?.LiveSettings?.bitrate,
                updateChannel:  this.props.ObsRemote.store?.UpdateChannel || UpdateChannel.STABLE
              }}
            >
              <Divider orientation="left">App</Divider>
              <Form.Item label="Sport" name="sport">
                <Select defaultValue={this.props.ObsRemote.store?.LiveSettings?.sport} style={{ width: '100%' }}>
                  <Select.Option value={StreamingSport.Football}>Football Americain</Select.Option>
                  <Select.Option value={StreamingSport.Soccer} disabled>Football</Select.Option>
                  <Select.Option value={StreamingSport.Basketball} disabled>Basketball</Select.Option>
                  <Select.Option value={StreamingSport.Handball} disabled>Handball</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="Update Channel" name="updateChannel">
                <Select defaultValue={this.props.ObsRemote.store?.UpdateChannel || UpdateChannel.STABLE} style={{ width: '100%' }}>
                  <Select.Option value={UpdateChannel.STABLE}>Stable</Select.Option>
                  <Select.Option value={UpdateChannel.BETA}>Bêta</Select.Option>
                </Select>
                <br/>
                <br/>
                <div>
                  <Button loading={this.state.checkingUpdate} onClick={() => { this.setState({ checkingUpdate: true }); window.app.handleUpdater(AutoUpdaterEvent.CHECKRESQUESTED) }}>{ this.state.updaterMessage }</Button> 
                  {/* { this.state.updaterMessage } */}
                </div>
              </Form.Item>
              <Divider orientation="left">Stream</Divider>
              <Form.Item label="Service de streaming" name="service">
                <Select style={{ width: '100%' }}>
                  <Select.Option value={StreamingService.Youtube}>Youtube</Select.Option>
                  <Select.Option value={StreamingService.Facebook} disabled>Facebook</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="key" label="Clé">
                <Input.Password placeholder="Clé de stream"/>
              </Form.Item>
              <Form.Item name="bitrate" label="Bitrate">
                <Input type="number" min={0} max={20000} step={500} addonAfter='Kbps' placeholder="Bitrate en Kbps" />
              </Form.Item>
              <Form.Item name="buffer" label="Buffer (durée des ralentis)">
                <Input type="number" min={0} max={50} step={1} addonAfter='secondes' placeholder="Durée en secondes" />
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button loading={this.state.sendingForm} type="primary" htmlType="submit">
                  Envoyer
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={16}>
          <Card
            tabList={tabList}
            activeTabKey={this.state.key}
            onTabChange={ newKey => { this.setState({ key: newKey }); }}
          >
            { contentList[this.state.key] }
          </Card>
        </Col>
      </Row>
    );
  }
};

export { Settings };

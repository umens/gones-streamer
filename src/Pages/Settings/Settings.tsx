import React from "react";
import { IObsRemote } from "../../Components";
import { Row, Col, message, Form, Input, Button, Select, Card, List } from "antd";
import ReactDropzone from "react-dropzone";
import { IpcService } from "../../utils/IpcService";
import { LoadingOutlined, PlusOutlined, PoweroffOutlined } from '@ant-design/icons';
import { FormInstance } from "antd/lib/form";
import { StreamingService, StreamingSport } from "../../Models";

const ipc = new IpcService();

type SettingsProps = {  
  ObsRemote: IObsRemote;
};
type SettingsState = {
  loadingFile: boolean;
  sendingForm: boolean;
  key: string;
  loadingCams: boolean[];
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
    };
  }

  componentDidMount = async () => {    
    // let devices = await navigator.mediaDevices.enumerateDevices();
    // console.log(devices.filter(({ kind }) => kind === "videoinput"));
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

  onChangeHandler = async (acceptedFiles: File[], fileRejections: any[], event: any): Promise<void> => {
    try {
      if(this.beforeUpload(acceptedFiles[0])) {
        await this.setState({ loadingFile: true });
        const data = await ipc.send<string>('file-upload', { params: { file: acceptedFiles[0]?.path, isBg: true }});
        await this.props.ObsRemote.updateTextProps({ props: 'logo', value: { file: acceptedFiles[0], pathElectron: data.split('#').shift()! }, bg: true});
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

    // const data = this.props.ObsRemote.store?.CamerasHardware.map(async (cam, index) => {
    //   // cam.img = await (await this.props.ObsRemote.getScreenshot()).img;
    //   return cam;
    // });
    const data = this.props.ObsRemote.store?.CamerasHardware;
    
    const tabList = [
      {
        key: 'background',
        tab: 'Image d\'arrière plan',
      },
      {
        key: 'cameras',
        tab: 'Cameras',
      },
    ];

    const contentList: { [key: string]: JSX.Element } = {
      background: <ReactDropzone onDrop={this.onChangeHandler}>
      {({getRootProps, getInputProps}: any) => (
        <section className="container">
          <span className="avatar-uploader ant-upload-picture-card-wrapper">
            <div {...getRootProps({className: 'dropzone ant-upload ant-upload-select ant-upload-select-picture-card', style: { width: '100%', height: 'auto' }})}>
              <input {...getInputProps({ multiple: false })} />
              <span tabIndex={0} className="ant-upload" role="button">
                <div>
                  {this.props.ObsRemote.store?.BackgroundImage ? <img src={this.props.ObsRemote.store?.BackgroundImage} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </div>
              </span>
            </div>
          </span>
        </section>
      )}
    </ReactDropzone>,
      cameras: <List
      grid={{
        gutter: 16,        
        xs: 1,
        sm: 2,
        md: 2,
        lg: 2,
        xl: 2,
        xxl: 2
      }}
      dataSource={data}
      renderItem={(item, index) => (
        <List.Item>
          <Card title={item.title}>
            { item.active ?
              <p>à venir</p>
              :
              <Button
                type="primary"
                icon={<PoweroffOutlined />}
                loading={this.state.loadingCams[index]}
                onClick={() => this.activateCam(index)}
              >
                Activate Camera {index + 1}
              </Button>
            }          
          </Card>
        </List.Item>
      )}
    />,
    };

    return (
      <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
        <Col span={10}>
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
              }}
            >
              <Form.Item label="Sport" name="sport">
                <Select style={{ width: '100%' }}>
                  <Select.Option value={StreamingSport.Football}>Football Americain</Select.Option>
                  <Select.Option value={StreamingSport.Soccer} disabled>Football</Select.Option>
                  <Select.Option value={StreamingSport.Basketball} disabled>Basketball</Select.Option>
                  <Select.Option value={StreamingSport.Handball} disabled>Handball</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="Service de streaming" name="service">
                <Select style={{ width: '100%' }}>
                  <Select.Option value={StreamingService.Youtube}>Youtube</Select.Option>
                  <Select.Option value={StreamingService.Facebook} disabled>Facebook</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="key" label="Clé">
                <Input placeholder="Clé de stream"/>
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
        <Col span={14}>
          <Card
            tabList={tabList}
            activeTabKey={this.state.key}
            onTabChange={ newKey => { this.setState({key: newKey}); }}
          >
            { contentList[this.state.key] }
          </Card>
        </Col>
      </Row>
    );
  }
};

export { Settings };

import React from "react";
import { IObsRemote } from "../../Components";
import { Row, Col, message, Form, Input, Button, Select, Card } from "antd";
import ReactDropzone from "react-dropzone";
import { IpcService } from "../../utils/IpcService";
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { FormInstance } from "antd/lib/form";

const ipc = new IpcService();

type SettingsProps = {  
  ObsRemote: IObsRemote;
};
type SettingsState = {
  loadingFile: boolean;
  sendingForm: boolean;
};
class Settings extends React.Component<SettingsProps, SettingsState> {
  
  formRef = React.createRef<FormInstance>();
  
  constructor(props: Readonly<SettingsProps>) {
    super(props);
    this.state = {
      loadingFile: false,
      sendingForm: false,
    };
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

  render() {
    
    const uploadButton = (
      <div>
        {this.state.loadingFile ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">Upload</div>
      </div>
    );

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
                service: 'youtube',
                buffer: (this.props.ObsRemote.store?.LiveSettings?.buffer || 0) / 1000,
                bitrate: this.props.ObsRemote.store?.LiveSettings?.bitrate,
              }}
            >
              <Form.Item label="Service de streaming" name="service">
                <Select style={{ width: '100%' }}>
                  <Select.Option value="youtube">Youtube</Select.Option>
                  <Select.Option value="facebook" disabled>Facebook</Select.Option>
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
          <Card title="Image d'arrière plan">
            <ReactDropzone onDrop={this.onChangeHandler}>
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
            </ReactDropzone>
          </Card>
        </Col>
      </Row>
    );
  }
};

export { Settings };

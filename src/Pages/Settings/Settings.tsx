import React from "react";
import { IObsRemote } from "../../Components";
import { Row, Col, message, Form, Input, Button } from "antd";
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
};
class Settings extends React.Component<SettingsProps, SettingsState> {
  
  formRef = React.createRef<FormInstance>();
  
  constructor(props: Readonly<SettingsProps>) {
    super(props);
    this.state = {
      loadingFile: false,
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

  onFinish = (values: any) => {
    console.log(values);
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
          <Form
            layout='vertical'
            ref={this.formRef}
            name="control-ref" onFinish={this.onFinish}
          >
            {/* <Form.Item label="Form Layout" name="layout">
              <Radio.Group value={formLayout}>
                <Radio.Button value="horizontal">Horizontal</Radio.Button>
                <Radio.Button value="vertical">Vertical</Radio.Button>
                <Radio.Button value="inline">Inline</Radio.Button>
              </Radio.Group>
            </Form.Item> */}
            <Form.Item label="Clé">
              <Input placeholder="Clé de stream" defaultValue={this.props.ObsRemote.store?.LiveSettings?.streamKey}/>
            </Form.Item>
            <Form.Item label="Bitrate">
              <Input type="number" min={0} max={20000} step={500} addonAfter='Kbps' defaultValue={this.props.ObsRemote.store?.LiveSettings?.bitrate} placeholder="Bitrate en Kbps" />
            </Form.Item>
            <Form.Item label="Buffer (durée des ralentis)">
              <Input type="number"  min={0} max={50000} step={500} addonAfter='ms' placeholder="Durée en ms" defaultValue={this.props.ObsRemote.store?.LiveSettings?.buffer} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={14}>
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
        </Col>
      </Row>
    );
  }
};

export { Settings };

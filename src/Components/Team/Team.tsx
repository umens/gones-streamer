import React, { createRef, SyntheticEvent } from "react";
import { IObsRemote, Editable } from "../";
import { Input, Avatar, InputNumber, Modal, Row, Col, Space, message, Button } from "antd";
import { LoadingOutlined, PlusOutlined, BgColorsOutlined } from '@ant-design/icons';
import classNames from "classnames";
import './Team.css';
import ReactDropzone from "react-dropzone";
import { IpcService } from "../../utils/IpcService";
import { ChromePicker } from 'react-color';
import { Timeout, Team as TeamModel } from "../../Models";

const ipc = new IpcService();

type TeamProps = {
  ObsRemote: IObsRemote;
  isHomeTeam: boolean;
};
type TeamState = {
  visibleModal: boolean;
  confirmLoading: boolean;
  updatedScore: number;
  loadingFile: boolean;
  displayColorPicker: boolean;
};
class Team extends React.Component<TeamProps, TeamState> {

  constructor(props: Readonly<TeamProps>) {
    super(props);
    this.state = {
      visibleModal: false,
      confirmLoading: false,
      updatedScore: 0,
      loadingFile: false,
      displayColorPicker: false,
    };
  }

  changeText = async (prop: keyof TeamModel & string, value: string) => {
    try {
      await this.props.ObsRemote.updateTextProps({ props: prop, value, homeTeam: this.props.isHomeTeam });
    } catch (error) {
    }
  }

  showModal = () => {
    this.setState({
      visibleModal: true,
    });
  };

  handleOk = async () => {
    try {      
      await this.setState({ confirmLoading: true });
      await this.props.ObsRemote.updateTextProps({ props: 'score', value: this.state.updatedScore, homeTeam: this.props.isHomeTeam});
      await this.setState({ visibleModal: false, confirmLoading: false });
    } catch (error) {
      await this.setState({ visibleModal: false, confirmLoading: false });
    }
  };
  
  handleCancel = () => {
    this.setState({ visibleModal: false });
  };
  
  onChange = (value: any) => {
    this.setState({ updatedScore: +value });
  };

  handleTimeout = (timeout: Timeout, team: TeamModel) => async (event: SyntheticEvent) => {
    try {
      let value: Timeout;
      if (timeout <= team.timeout) {
        value = timeout - 1;
      } else {
        value = timeout;
      }
      await this.props.ObsRemote.updateTextProps({ props: 'timeout', value, homeTeam: this.props.isHomeTeam});
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

  onChangeHandler = async (acceptedFiles: File[], fileRejections: any[], event: any): Promise<void> => {
    try {
      if(this.beforeUpload(acceptedFiles[0])) {
        await this.setState({ loadingFile: true });
        const data = await ipc.send<string>('file-upload', { params: { file: acceptedFiles[0]?.path, isHomeTeam: this.props.isHomeTeam }});
        await this.props.ObsRemote.updateTextProps({ props: 'logo', value: { file: acceptedFiles[0], pathElectron: data.split('#').shift()! }, homeTeam: this.props.isHomeTeam});
        await this.setState({ loadingFile: false });
      }
    } catch (error) {
      
    }
  };

  handleClickColorPickerBtn = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleCloseColorpicker = () => {
    this.setState({ displayColorPicker: false })
  };

  handleChangeColorpicker = async (color: any) => {
    try {
      await this.props.ObsRemote.updateTextProps({ props: 'color', value: color.hex, homeTeam: this.props.isHomeTeam});
    } catch (error) {
      
    }
  };
  
  render() {
    let team = (this.props.isHomeTeam) ? this.props.ObsRemote.store?.GameStatut?.HomeTeam : this.props.ObsRemote.store?.GameStatut?.AwayTeam;
    const inputNameRef = createRef<Input>();
    const inputCityRef = createRef<Input>();

    const uploadButton = (
      <div>
        {this.state.loadingFile ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <Row gutter={[0, 0]}>
        <Col span={6}>
          <div className="scoreDisplay" style={{ textAlign: 'center' }}>
            <div onClick={(e) => this.showModal()}>
            <Avatar style={{ color: '#000000', border: '1px solid #d6d6d6', fontSize: '3rem', fontWeight: 600 }} shape="square" size={104}>{('' + team?.score).padStart(2, '0')}</Avatar>
            </div>
            <div className="timeout-container">
                { [1, 2, 3].map((timeout: Timeout) => {
                  return <div key={`timeout${timeout}`} onClick={this.handleTimeout(timeout, team!)} className={classNames({
                    timeout: true,
                    'bg-warning': timeout <= team?.timeout!,
                    'bg-transparent': timeout > team?.timeout!,
                    border: timeout > team?.timeout!,
                    'border-warning': timeout > team?.timeout!
                  })}></div>
                })}
              </div>
          </div>
        </Col>
        <Col span={12}>
          <Space direction="vertical">
            <Editable
              text={team?.name}
              placeholder={this.props.isHomeTeam ? 'Home Team Name' : 'Away Team Name'}
              childRef={inputNameRef}
              type="input"
            >
              <Input style={{ color: '#000000' }} ref={inputNameRef} type="text" name="name" placeholder={this.props.isHomeTeam ? 'Home Team Name' : 'Away Team Name'} value={team?.name} onChange={(e) => this.changeText('name', e.target.value)}/>
            </Editable>
            <Editable
              text={team?.city}
              placeholder={this.props.isHomeTeam ? 'Home Team City' : 'Away Team City'}
              childRef={inputCityRef}
              type="input"
            >
              <Input style={{ color: '#000000' }} ref={inputCityRef} type="text" name="city" placeholder={this.props.isHomeTeam ? 'Home Team City' : 'Away Team City'} value={team?.city} onChange={(e) => this.changeText('city', e.target.value)}/>
            </Editable>
            

            <div>          
              <Button style={{ color: '#165996' }} type="text" onClick={ this.handleClickColorPickerBtn } icon={<BgColorsOutlined />} size='large' />
              { this.state.displayColorPicker ? <div style={{ position: 'absolute', zIndex: 99 }}>
                <div style={{ position: 'fixed', top: '0px', bottom: '0px', left: '0px', right: '0px', }} onClick={ this.handleCloseColorpicker }/>
                <ChromePicker key={ this.props.isHomeTeam ? 'colorHome': 'colorAway' } color={ team?.color } onChange={ this.handleChangeColorpicker } />
              </div> : null }
            </div>
          </Space>
        </Col>
        <Col span={6}>
          <ReactDropzone onDrop={this.onChangeHandler}>
            {({getRootProps, getInputProps}: any) => (
              <section className="container">
                <span className="avatar-uploader ant-upload-picture-card-wrapper">
                  <div {...getRootProps({className: 'dropzone ant-upload ant-upload-select ant-upload-select-picture-card'})}>
                    <input {...getInputProps({ multiple: false })} />
                    <span tabIndex={0} className="ant-upload" role="button">
                      <div>
                        {team?.logo ? <img src={team.logo} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                      </div>
                    </span>
                  </div>
                </span>
              </section>
            )}
          </ReactDropzone>
        </Col>

        <Modal
          title={this.props.isHomeTeam ? 'Home Team Score' : 'Away Team Score'}
          visible={this.state.visibleModal}
          onOk={this.handleOk}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
        >
          <InputNumber style={{ width: '100%' }} min={0} step={1} defaultValue={team?.score} onChange={this.onChange} />
        </Modal>
      </Row>
    );
  }
};

export { Team };

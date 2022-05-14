import React, { ChangeEvent, Component, SyntheticEvent } from "react";
import { BaseTeamScoreboardEditableProps, BaseTeamScoreboardEditableState } from "../../..";
import { Input, InputNumber, Modal, Form, message } from "antd";
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import classNames from "classnames";
import './TeamScoreboardEditableStyle2.css';
import ReactDropzone from "react-dropzone";
import { ChromePicker } from 'react-color';
import { Timeout, Team as TeamModel, FileUp, TeamPossession } from "../../../../../Models";
import { Utilities } from "../../../../../Utils";

class TeamScoreboardEditableStyle2 extends Component<BaseTeamScoreboardEditableProps, BaseTeamScoreboardEditableState> {

  constructor(props: Readonly<BaseTeamScoreboardEditableProps>) {
    super(props);
    this.state = {
      visibleModal: false,
      visibleModalTeam: false,
      confirmLoading: false,
      confirmLoadingTeam: false,
      updatedScore: 0,
      updatedName: 'Name',
      updatedCity: 'City',
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

  showModalTeam = () => {
    this.setState({
      visibleModalTeam: true,
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

  handleOkTeam = async () => {
    try {
      await this.setState({ confirmLoadingTeam: true });
      await this.props.ObsRemote.updateTextProps({ props: 'name', value: this.state.updatedName, homeTeam: this.props.isHomeTeam});
      await this.props.ObsRemote.updateTextProps({ props: 'city', value: this.state.updatedCity, homeTeam: this.props.isHomeTeam});
      await this.setState({ visibleModalTeam: false, confirmLoadingTeam: false });
    } catch (error) {
      await this.setState({ visibleModalTeam: false, confirmLoadingTeam: false });
    }
  };

  handleCancel = () => {
    this.setState({ visibleModal: false });
  };

  handleCancelTeam = () => {
    this.setState({ visibleModalTeam: false });
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

  beforeUpload = (file: File): boolean => {
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

  uploadElectronFile = async () => {
    try {
      const fileData = await window.app.selectElectronFile(true);
      if(fileData) {
        await this.onChangeHandler([fileData], [], null);
      }
    } catch (error) {
      
    }
  }

  onChangeHandler = async (acceptedFiles: FileUp[], fileRejections: any[], event: any): Promise<void> => {
    try {
      if(this.beforeUpload(acceptedFiles[0].file)) {
        await this.setState({ loadingFile: true });
        const data = await window.app.setFile({ file: acceptedFiles[0]?.pathElectron, isHomeTeam: this.props.isHomeTeam });
        await this.props.ObsRemote.updateTextProps({ props: 'logo', value: { file: acceptedFiles[0].file, pathElectron: data.split('#').shift()! }, homeTeam: this.props.isHomeTeam});
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

    const uploadButton = (
      <div>
        {this.state.loadingFile ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <div id='teamScoreboardEditStyle2' style={{ position: 'relative' }}>
        { this.state.displayColorPicker ?
          <div style={{ position: 'absolute', zIndex: 99, top: 25, left: 325 }}>
            <div style={{ position: 'fixed', top: '0px', bottom: '0px', left: '0px', right: '0px', }} onClick={ this.handleCloseColorpicker }/>
            <ChromePicker key={ this.props.isHomeTeam ? 'colorHome': 'colorAway' } color={ team?.color } onChange={ this.handleChangeColorpicker } />
          </div>
          :
          null
        }
        <Modal
          title={this.props.isHomeTeam ? 'Home Team Score' : 'Away Team Score'}
          visible={this.state.visibleModal}
          onOk={this.handleOk}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
        >
          <InputNumber style={{ width: '100%' }} min={0} step={1} defaultValue={team?.score} onChange={this.onChange} />
        </Modal>
        <Modal
          title={this.props.isHomeTeam ? 'Home Team Details' : 'Away Team Details'}
          visible={this.state.visibleModalTeam}
          onOk={this.handleOkTeam}
          confirmLoading={this.state.confirmLoadingTeam}
          onCancel={this.handleCancelTeam}
        >
          <Form layout='vertical'>
            <Form.Item label="Name">
              <Input placeholder="Name" style={{ width: '100%' }} defaultValue={team?.name} onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({ updatedName: e.target.value })} />
            </Form.Item>
            <Form.Item label="City">
              <Input placeholder="City" style={{ width: '100%' }} defaultValue={team?.city} onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({ updatedCity: e.target.value })} />
            </Form.Item>
          </Form>
        </Modal>

        <div className="teamblock-scoreboard" style={(this.props.isHomeTeam) ? { width: 225, background: team?.color } : { width: 225, background: team?.color }} >          
          <div className="teamblock-scoreboard-overflow">
            <div className="teamcolor-scoreboard" onClick={ this.handleClickColorPickerBtn }></div>
            <ReactDropzone noDrag={true} >
              {({getRootProps, getInputProps}: any) => (
                <section className="container teamlogo-scoreboard">
                  <span className="avatar-uploader ant-upload-picture-card-wrapper">
                    <div {...getRootProps({className: 'dropzone ant-upload ant-upload-select ant-upload-select-picture-card', onClick: async () => { await this.uploadElectronFile; }, style: { width: 50, height: 50, backgroundColor: 'transparent', border: 0 }})}>
                      <input {...getInputProps({ multiple: false })} />
                      <span tabIndex={0} style={{ padding: 0 }} className="ant-upload" role="button">
                        <div>
                          {team?.logo ? <img style={{ backgroundColor: 'transparent', border: 0 }} className='img-thumbnail' alt='home team logo' src={ this.props.ObsRemote.Utilitites?.getImageFullPath(team.logo) } /> : uploadButton}
                        </div>
                      </span>
                    </div>
                  </span>
                </section>
              )}
            </ReactDropzone>
            <div onClick={this.showModalTeam} className="teamname-scoreboard" style={{ fontWeight: 700, color: this.props.ObsRemote.Utilitites?.pickTextColorBasedOnBgColorAdvanced('#FFFFFF', '#000000', team?.color) }}>
              { team?.name.substring(0,5).normalize("NFD").replace(/\p{Diacritic}/gu, "") || 'Name'.substring(0,5).normalize("NFD").replace(/\p{Diacritic}/gu, "") }
            </div>
            <div onClick={this.showModal} className="teamscore-scoreboard" style={{ fontWeight: 700, color: this.props.ObsRemote.Utilitites?.pickTextColorBasedOnBgColorAdvanced('#FFFFFF', '#000000', team?.color) }}>
              { Utilities.zeroPad(team?.score!) }
            </div>
            <div className="teamtimeoutblock-scoreboard">
              { [1, 2, 3].map((timeout: Timeout) => {
                return <div key={`timeout${timeout}`} onClick={this.handleTimeout(timeout, team!)} className={classNames({
                  'teamtimeout-scoreboard': true,
                  'bg-transparent': timeout > team?.timeout!,
                  border: timeout > team?.timeout!,
                  'border-warning': timeout > team?.timeout!
                })} style={{ 
                  backgroundColor: timeout > team?.timeout! ? 'transparent' : this.props.ObsRemote.Utilitites?.pickTextColorBasedOnBgColorAdvanced('#FFFFFF', '#000000', team?.color),
                  borderColor: timeout > team?.timeout! ? this.props.ObsRemote.Utilitites?.pickTextColorBasedOnBgColorAdvanced('#FFFFFF', '#000000', team?.color) : '',
                }}></div>
              })}
            </div>
          </div>
          { this.props.ObsRemote.store?.GameStatut.Options.possession === (this.props.isHomeTeam ? TeamPossession.HOME : TeamPossession.AWAY) && <div className="teampossession-scoreboard bg-warning"></div> }
        </div>
      </div>
    );
  }
};

export { TeamScoreboardEditableStyle2 };

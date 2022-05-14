import React from "react";
import { Row, Col, List, Button, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { AudioForm, IObsRemote } from "../";
import { AudioHardware, AudioType } from '../../Models';
import { v4 as uuidv4 } from 'uuid';
import { Utilities } from "../../Utils";

type AudioControlProps = typeof AudioControl.defaultProps & {
  ObsRemote: IObsRemote;
};
type AudioControlState = {
  visibleModal: boolean;
  initialValuesForm?: AudioHardware;
  loadingForm: boolean;
  deleteLoading: {[key: string]: boolean};
};
class AudioControl extends React.Component<AudioControlProps, AudioControlState> {

  static defaultProps = {
    editable: false,
  };

  constructor(props: Readonly<AudioControlProps>) {
    super(props);
    this.state = {
      visibleModal: false,
      loadingForm: false,
      deleteLoading: {},
    };
  }
  
  createAudio = async (values: AudioHardware): Promise<void> => {
    try {
      await this.setState({ loadingForm: true });
      values.title = values.title.charAt(0).toUpperCase() + values.title.slice(1).toLowerCase();
      if(!values.uuid) {
        // add action
        values.uuid = uuidv4();
        await window.app.manageAudio({ action: 'add', audio: values });
        await this.props.ObsRemote.addAudio(values);
      }
      else {
        //edit action
        await window.app.manageAudio({ action: 'edit', audio: values });
        await this.props.ObsRemote.editAudio(values);
      }
      await this.setState({ visibleModal: false, initialValuesForm: undefined, loadingForm: false });
      this.forceUpdate()
    } catch (error) {
      
    }
  }
  
  editAudio = async (id: string): Promise<void> => {
    try {
      let audio: AudioHardware = this.props.ObsRemote.store!.AudioHardware.find(p => p.uuid === id)!;
      await this.setState({ initialValuesForm: audio });
      await this.setState({ visibleModal: true });
    } catch (error) {
      
    }
  }
  
  deleteAudio = async (id: string): Promise<void> => {
    try {
      let audio: AudioHardware = this.props.ObsRemote.store!.AudioHardware.find(p => p.uuid === id)!;
      await this.setState(({ deleteLoading }) => {
        const newLoadings = {...deleteLoading};
        newLoadings[id] = true;
  
        return {
          deleteLoading: newLoadings,
        };
      });
      await window.app.manageAudio({ action: 'delete', id });
      await this.props.ObsRemote.removeAudio(audio);
      await this.setState(({ deleteLoading }) => {
        const newLoadings = {...deleteLoading};
        newLoadings[id] = false;
  
        return {
          deleteLoading: newLoadings,
          visibleModal: false
        };
      });
    } catch (error) {
      
    }
  }
  
  render() {
    return (
      <>
        <Row gutter={[16, 0]}>
          <Col span={24}>
            <List
              dataSource={this.props.ObsRemote.store?.AudioHardware ?  [ ...this.props.ObsRemote.store?.AudioHardware, {title: "add", deviceid: '', type: AudioType.Input, uuid: '' }] : [{title: "add", deviceid: '', type: AudioType.Input, uuid: '' }]}
              renderItem={(item: AudioHardware) => (
                <>
                  { item.title === 'add' && <List.Item>
                    <Button
                      block
                      icon={<PlusOutlined />} 
                      // style={{ height: 213 }}
                      onClick={async () => {
                        await this.setState({ visibleModal: true });
                      }}
                    >
                      Nouveau périphérique audio
                    </Button>
                    { this.state.visibleModal && 
                      <AudioForm
                        ObsRemote={this.props.ObsRemote}
                        inUseAudios={this.props.ObsRemote.store?.AudioHardware.map(item => item.deviceid) || []}
                        loadingForm={this.state.loadingForm}
                        initialValues={this.state.initialValuesForm}
                        visible={this.state.visibleModal}
                        onCreate={this.createAudio}
                        onCancel={async () => {
                          await this.setState({ visibleModal: false, initialValuesForm: undefined });
                        }}
                      />
                    }
                    </List.Item> 
                  }
                  { item.title !== 'add' && 
                    <List.Item
                      actions={
                        [
                          <Tooltip title="Editer">
                            <Button 
                              type="text" 
                              onClick={async (e) => { await this.editAudio(item.uuid!)}}
                              icon={<EditOutlined />} 
                            />
                          </Tooltip>,
                          <Tooltip title="Supprimer">
                            <Button 
                              type="text" 
                              loading={this.state.deleteLoading[item.uuid!]}
                              onClick={async (e) => { await this.deleteAudio(item.uuid!)}}
                              icon={<DeleteOutlined />} 
                            />
                          </Tooltip>,
                        ]
                      }
                    >
                      {Utilities.capitalize(item.title.toLowerCase())}
                    </List.Item> 
                  }
                </>
              )}
            />
          </Col>
        </Row>
      </>
    );
  }
};

export { AudioControl };

import React from "react";
import { Row, Col, List, Card, Button, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import Webcam from "react-webcam";
import FilterResults from 'react-filter-search';
import { CameraForm, IObsRemote } from "../";
import { CameraHardware, OBSInputProps } from '../../Models';
import { Utilities } from "../../Utils";
import { v4 as uuidv4 } from 'uuid';

type CameraControlProps = typeof CameraControl.defaultProps & {
  ObsRemote: IObsRemote;
};
type CameraControlState = {
  visibleModal: boolean;
  initialValuesForm?: CameraHardware;
  loadingForm: boolean;
  deleteLoading: {[key: string]: boolean};
  webcams: MediaDeviceInfo[];
  availableCameras: OBSInputProps[];
};
class CameraControl extends React.Component<CameraControlProps, CameraControlState> {

  static defaultProps = {
    editable: false,

  };

  constructor(props: Readonly<CameraControlProps>) {
    super(props);
    this.state = {
      visibleModal: false,
      loadingForm: false,
      deleteLoading: {},
      webcams: [],
      availableCameras: [],
    };
  }

  componentDidMount = async () => {
    const availableCameras = await this.props.ObsRemote.getAvailableCameras();
    let webcams = await (await navigator.mediaDevices.enumerateDevices()).filter(device => device.kind === 'videoinput');
    await this.setState({ webcams, availableCameras });
  }
  
  createCamera = async (values: CameraHardware): Promise<void> => {
    try {
      await this.setState({ loadingForm: true });
      values.title = values.title.charAt(0).toUpperCase() + values.title.slice(1).toLowerCase();
      if(!values.uuid) {
        // add action
        values.uuid = uuidv4();
        await window.app.manageCamera({ action: 'add', camera: values });
        await this.props.ObsRemote.addCamera(values);
      }
      else {
        //edit action
        await window.app.manageCamera({ action: 'edit', camera: values });
        await this.props.ObsRemote.editCamera(values);
      }
      await this.setState({ visibleModal: false, initialValuesForm: undefined, loadingForm: false });
      this.forceUpdate()
    } catch (error) {
      
    }
  }
  
  editCamera = async (id: string): Promise<void> => {
    try {
      let camera: CameraHardware = this.props.ObsRemote.store!.CamerasHardware.find(p => p.uuid === id)!;
      await this.setState({ initialValuesForm: camera });
      await this.setState({ visibleModal: true });
    } catch (error) {
      
    }
  }
  
  deleteCamera = async (id: string): Promise<void> => {
    try {
      let camera: CameraHardware = this.props.ObsRemote.store!.CamerasHardware.find(p => p.uuid === id)!;
      await this.setState(({ deleteLoading }) => {
        const newLoadings = {...deleteLoading};
        newLoadings[id] = true;
  
        return {
          deleteLoading: newLoadings,
        };
      });
      await window.app.manageCamera({ action: 'delete', id });
      await this.props.ObsRemote.removeCamera(camera);
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

  getWebcamId = (id: string): string => {
    if(this.state.availableCameras.length > 0 && this.state.webcams.length > 0) {
      const webcam = this.state.availableCameras.find(item => item.itemValue === id)
      if(webcam) {
        const name = this.state.availableCameras.find(item => item.itemValue === id)!.itemName;
        return this.state.webcams.find(item => item['label'].includes(name))?.deviceId!;
      }
      else {
        return '';
      }
    }
    return '';
  }
  
  render() {
    return (
      <>
        <Row gutter={[16, 0]}>
          <Col span={24}>
            <FilterResults
              value=''
              data={this.props.ObsRemote.store?.CamerasHardware ? this.props.ObsRemote.store?.CamerasHardware : []}
              renderResults={(results: CameraHardware[]) => {
                if(this.props.editable) {
                  results.push({title: "add", active: false, deviceid: '' });
                }
                return (
                  <List
                    grid={{
                      gutter: 16,
                      xs: 4,
                      sm: 4,
                      md: 4,
                      lg: 4,
                      xl: 4,
                      xxl: 4,
                    }}
                    style={{ marginTop: 16 }}
                    itemLayout="horizontal"
                    dataSource={results}
                    renderItem={(item: CameraHardware, index: number) => {
                      if(this.props.editable && results.length - 1 === index) {
                        return (
                          <Card bordered={false}>
                            <Row align="middle" justify="center" style={{ height: 213 }}>
                              <Col>
                                <Button
                                  block
                                  icon={<PlusOutlined />} 
                                  // style={{ height: 213 }}
                                  onClick={async () => {
                                    await this.setState({ visibleModal: true });
                                  }}
                                >
                                  Nouvelle caméra
                                </Button>
                              </Col>
                            </Row>
                            { this.state.visibleModal && 
                              <CameraForm
                                ObsRemote={this.props.ObsRemote}
                                inUseCameras={results.slice(0, -1).map(item => item.deviceid) || []}
                                availableCameras={this.state.availableCameras}
                                webcams={this.state.webcams}
                                loadingForm={this.state.loadingForm}
                                initialValues={this.state.initialValuesForm}
                                visible={this.state.visibleModal}
                                onCreate={this.createCamera}
                                onCancel={async () => {
                                  await this.setState({ visibleModal: false, initialValuesForm: undefined });
                                }}
                              />
                            }
                          </Card>
                        )
                      } else {
                        return (
                          <Card
                            cover={                        
                              <Webcam audio={false} width={392.16} height={221} videoConstraints={{ deviceId: this.getWebcamId(item.deviceid), width: { min: 392.16 }, height: { max: 221 } }} />
                            }
                            actions={
                              this.props.editable ?
                                item.title === 'Field' ?
                                  [
                                    <Tooltip title="Editer">
                                      <Button 
                                        type="text" 
                                        onClick={async (e) => { await this.editCamera(item.uuid!)}}
                                        icon={<EditOutlined />} 
                                      />
                                    </Tooltip>,
                                  ] :
                                  [
                                    <Tooltip title="Editer">
                                      <Button 
                                        type="text" 
                                        onClick={async (e) => { await this.editCamera(item.uuid!)}}
                                        icon={<EditOutlined />} 
                                      />
                                    </Tooltip>,
                                    <Tooltip title="Supprimer">
                                      <Button 
                                        type="text" 
                                        loading={this.state.deleteLoading[item.uuid!]}
                                        onClick={async (e) => { await this.deleteCamera(item.uuid!!)}}
                                        icon={<DeleteOutlined />} 
                                      />
                                    </Tooltip>,
                                  ]
                                :
                                []
                            }
                          >
                            <Card.Meta
                              title={Utilities.capitalize(item.title.toLowerCase())}
                            />
                          </Card>
                        )
                      }
                    }}
                  />
                )
              }}
            />  
          </Col>
        </Row>
      </>
    );
  }
};

export { CameraControl };

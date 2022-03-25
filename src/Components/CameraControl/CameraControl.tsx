import React from "react";
import { Row, Col, List, Card, Button, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import Webcam from "react-webcam";
import FilterResults from 'react-filter-search';
import { CameraForm, IObsRemote } from "../";
import { CameraHardware } from '../../Models';
import { Utilities } from "../../Utils";

type CameraControlProps = typeof CameraControl.defaultProps & {
  ObsRemote: IObsRemote;
};
type CameraControlState = {
  // visibleModal: boolean;
  visibleModal: boolean;
  initialValuesForm?: CameraHardware;
  loadingForm: boolean;
  deleteLoading: boolean[];
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
      deleteLoading: [],
    };
  }
  
  createCamera = async (values: CameraHardware): Promise<void> => {
    try {
      await this.setState({ loadingForm: true });
      values.title = values.title.charAt(0).toUpperCase() + values.title.slice(1).toLowerCase();
      console.log(values)
      if(this.props.ObsRemote.store?.CamerasHardware.some(({ deviceid }) => deviceid === values.deviceid)) {    
        console.log('edit')    
        await window.app.manageCamera({ action: 'edit', camera: values });
        await this.props.ObsRemote.editCamera(values);
      } else {
        console.log('add')    
        await window.app.manageCamera({ action: 'add', camera: values });
        await this.props.ObsRemote.addCamera(values);
      }
      await this.setState({ visibleModal: false, initialValuesForm: undefined, loadingForm: false });
      this.forceUpdate()
    } catch (error) {
      
    }
  }
  
  editCamera = async (deviceId: MediaDeviceInfo["deviceId"]): Promise<void> => {
    try {
      let camera: CameraHardware = {...this.props.ObsRemote.store!.CamerasHardware.find(p => p.deviceid === deviceId)!};
      // camera.media = undefined;
      await this.setState({ initialValuesForm: camera });
      await this.setState({ visibleModal: true });
    } catch (error) {
      
    }
  }
  
  deleteCamera = async (deviceId: MediaDeviceInfo["deviceId"], id: number): Promise<void> => {
    try {
      await this.setState(({ deleteLoading }) => {
        const newLoadings = [...deleteLoading];
        newLoadings[id] = true;
  
        return {
          deleteLoading: newLoadings,
        };
      });
      await window.app.manageCamera({ action: 'delete', id: deviceId });
      const oldCam = { deviceId, title: 'remove', active: false };
      await this.props.ObsRemote.removeCamera(oldCam);
      await this.setState(({ deleteLoading }) => {
        const newLoadings = [...deleteLoading];
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
            <FilterResults
              value=''
              data={this.props.ObsRemote.store?.CamerasHardware ? this.props.ObsRemote.store?.CamerasHardware : []}
              renderResults={(results: CameraHardware[]) => {
                if(this.props.editable) {
                  results.push({title: "add", active: false });
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
                            <CameraForm
                              ObsRemote={this.props.ObsRemote}
                              inUseCameras={results.slice(0, -1).map(item => item.deviceid!)}
                              loadingForm={this.state.loadingForm}
                              initialValues={this.state.initialValuesForm}
                              visible={this.state.visibleModal}
                              onCreate={this.createCamera}
                              onCancel={async () => {
                                await this.setState({ visibleModal: false, initialValuesForm: undefined });
                              }}
                            />
                          </Card>
                        )
                      } else {
                        return (
                          <Card
                            cover={                        
                              <Webcam audio={false} width={392.16} height={221} videoConstraints={{ deviceId: item.deviceid!.split(':')[1], width: { min: 392.16 }, height: { max: 221 } }} />
                            }
                            actions={
                              this.props.editable ?
                                [
                                  <Tooltip title="Editer">
                                    <Button 
                                      type="text" 
                                      onClick={async (e) => { await this.editCamera(item.deviceid!)}}
                                      icon={<EditOutlined />} 
                                    />
                                  </Tooltip>,
                                  <Tooltip title="Supprimer">
                                    <Button 
                                      type="text" 
                                      loading={this.state.deleteLoading[index]}
                                      onClick={async (e) => { await this.deleteCamera(item.deviceid!, index)}}
                                      icon={<DeleteOutlined />} 
                                    />
                                  </Tooltip>,
                                ] :
                                []
                                // this.state.showingSponsor !== null ?
                                //   this.state.showingSponsor !== item.uuid ?
                                //     [
                                //       <Tooltip title="Show small sponsor">
                                //         <Button 
                                //           type="text" 
                                //           onClick={async (e) => { await this.showSponsor(item.uuid!, SponsorDisplayType.Small)}} 
                                //           disabled={true} 
                                //           icon={<EyeOutlined />} 
                                //         />
                                //       </Tooltip>,
                                //       <Tooltip title="Show big sponsor">
                                //         <Button 
                                //           type="text" 
                                //           onClick={async (e) => { await this.showSponsor(item.uuid!, SponsorDisplayType.Big)}} 
                                //           disabled={true} 
                                //           icon={<EyeOutlined />} 
                                //         />
                                //       </Tooltip>,
                                //       <Tooltip title="Show fullscreen sponsor">
                                //         <Button 
                                //           type="text" 
                                //           onClick={async (e) => { await this.showSponsor(item.uuid!, SponsorDisplayType.Fullscreen)}} 
                                //           disabled={true} 
                                //           icon={<EyeOutlined />} 
                                //         />
                                //       </Tooltip>
                                //     ] 
                                //     :
                                //     [
                                //       <Tooltip title="Hide sponsor">
                                //         <Button 
                                //           type="text" 
                                //           onClick={async (e) => { await this.hideSponsor(item.uuid!)}}
                                //           icon={<EyeInvisibleOutlined />} 
                                //         />
                                //       </Tooltip>
                                //     ]
                                // :
                                // [
                                //   <Tooltip title="Show small sponsor">
                                //     <Button type="text" onClick={(e) => this.showSponsor(item.uuid!, SponsorDisplayType.Small)} disabled={false} icon={<EyeOutlined />} />
                                //   </Tooltip>,
                                //   <Tooltip title="Show big sponsor">
                                //     <Button type="text" onClick={(e) => this.showSponsor(item.uuid!, SponsorDisplayType.Big)} disabled={false} icon={<EyeOutlined />} />
                                //   </Tooltip>,
                                //   <Tooltip title="Show fullscreen sponsor">
                                //     <Button type="text" onClick={(e) => this.showSponsor(item.uuid!, SponsorDisplayType.Fullscreen)} disabled={false} icon={<EyeOutlined />} />
                                //   </Tooltip>,
                                // ]
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

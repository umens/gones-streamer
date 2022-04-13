 import React, { SyntheticEvent } from "react";
import { AudioVuMeters, IObsRemote } from "..";
import { List, Tag, Row, Col } from "antd";
import { SyncOutlined, VideoCameraFilled } from '@ant-design/icons';
import { SceneName } from "../../Models";
import './Scenes.css';

type ScenesProps = {
  ObsRemote: IObsRemote;
};
type ScenesState = {
};
class Scenes extends React.Component<ScenesProps, ScenesState> {

  constructor(props: Readonly<ScenesProps>) {
    super(props);
    this.state = {
    };
  }

  componentDidMount = async () => {
    try {
    } catch (error) {

    }
  }

  changeScene = (name: SceneName) => async (event: SyntheticEvent) => {
    try {
      await this.props.ObsRemote.changeActiveScene(name);
    } catch (error) {
      
    }
  }

  changeActiveCam = (name: string) => async (event: SyntheticEvent) => {
    try {
      await this.props.ObsRemote.changeActiveCam(name);
    } catch (error) {
      
    }
  }
  
  render() {
    if(this.props.ObsRemote.scenes?.currentScene === SceneName.Live) {
      return (
        <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
          <Col span={12}>
            <List
              bordered
              loading={!this.props.ObsRemote.connected2Obs && !this.props.ObsRemote.firstDatasLoaded} 
              dataSource={this.props.ObsRemote.scenes?.scenes}
              renderItem={item => {
                let extra: any = '';
                let content = (item.sceneName === this.props.ObsRemote.scenes?.currentScene) ? <span style={{ color: '#177ddc' }}><SyncOutlined spin /> {item.sceneName}</span> : item.sceneName;
                if(item.sceneName === this.props.ObsRemote.scenes?.currentScene && item.sceneName === SceneName.Live && this.props.ObsRemote.store?.CamerasHardware) {
                  // let data = this.props.ObsRemote.scenes!.scenes.filter(item => {
                  //   return item.name === SceneName.Live
                  // });
                  let cams = this.props.ObsRemote.store?.CamerasHardware;
                  // cams = cams.sort(function(a, b) {
                  //   var textA = a.name.toUpperCase();
                  //   var textB = b.name.toUpperCase();
                  //   return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                  // });
                  extra = <div>{cams.map(item => {
                    return (item.active) ? <Tag key={item.title} icon={<VideoCameraFilled />} color="processing">{item.title}</Tag> : <Tag onClick={this.changeActiveCam(item.title)} key={item.title} color="default">{item.title.replace('Camera - ', '')}</Tag>;
                  })}</div>;
                }
    
                let itemNode;
                if (![SceneName.Replay, SceneName.Sponsors].includes(item.sceneName as SceneName)) {
                  itemNode = <List.Item key={item.sceneName} extra={extra} className="sceneItem" onClick={this.changeScene(item.sceneName as SceneName)}>{content}</List.Item>;
                } 
                else {
                  itemNode = <List.Item key={item.sceneName} extra={extra} style={{ color: '#6b6b6b' }}>{content}</List.Item>;
                }
    
                return itemNode;
              }}
            />
          </Col>
          <Col span={12}>
            <AudioVuMeters ObsRemote={this.props.ObsRemote}/>
          </Col>
        </Row>
      );
    } else {
      return (
        <>
          <List
            bordered
            loading={!this.props.ObsRemote.connected2Obs && !this.props.ObsRemote.firstDatasLoaded} 
            dataSource={this.props.ObsRemote.scenes?.scenes}
            renderItem={item => {
              let content = (item.sceneName === this.props.ObsRemote.scenes?.currentScene) ? <span style={{ color: '#177ddc' }}><SyncOutlined spin /> {item.sceneName}</span> : item.sceneName;
  
              let itemNode;
              if (![SceneName.Replay, SceneName.Sponsors].includes(item.sceneName as SceneName)) {
                itemNode = <List.Item key={item.sceneName} className="sceneItem" onClick={this.changeScene(item.sceneName as SceneName)}>{content}</List.Item>;
              } 
              else {
                itemNode = <List.Item key={item.sceneName} style={{ color: '#6b6b6b' }}>{content}</List.Item>;
              }
  
              return itemNode;
            }}
          />
        </>
      );
    }
  }
};

export { Scenes };

import React, { SyntheticEvent } from "react";
import { IObsRemote } from "..";
import { List, Tag } from "antd";
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

  changeActiveCam = (name: SceneName) => async (event: SyntheticEvent) => {
    try {
      // await this.props.ObsRemote.changeActiveCam(name);
    } catch (error) {
      
    }
  }
  
  render() {
    return (
      <>
        <List
          bordered
          loading={!this.props.ObsRemote.firstDatasLoaded} 
          dataSource={this.props.ObsRemote.scenes?.scenes}
          renderItem={item => {
            let extra: any = '';
            let content = (item === this.props.ObsRemote.scenes?.["current-scene"]) ? <span style={{ color: '#177ddc' }}><SyncOutlined spin /> {item}</span> : item;
            if(item === this.props.ObsRemote.scenes?.["current-scene"] && item === SceneName.Live) {
              // let data = this.props.ObsRemote.scenes.scenes.filter(item => {
              //   return item === SceneName.Live
              // });
              // let cams = (data[0]).sources.filter(item => {
              //   return item.name.startsWith('Camera');
              // });
              // cams = cams.sort(function(a, b) {
              //   var textA = a.name.toUpperCase();
              //   var textB = b.name.toUpperCase();
              //   return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
              // });
              // extra = <div>{cams.map(item => {
              //   return (item.render) ? <Tag key={item.name} icon={<VideoCameraFilled />} color="processing">{item.name}</Tag> : <Tag onClick={this.changeActiveCam(item.name as SceneName)} key={item.name} color="default">{item.name}</Tag>;
              // })}</div>;
            }

            let itemNode;
            if (![SceneName.Replay, SceneName.Sponsors].includes(item as SceneName)) {
              itemNode = <List.Item key={item} extra={extra} className="sceneItem" onClick={this.changeScene(item as SceneName)}>{content}</List.Item>;
            } 
            else {
              itemNode = <List.Item key={item} extra={extra} style={{ color: '#6b6b6b' }}>{content}</List.Item>;
            }

            return itemNode;
          }}
        />
      </>
    );
  }
};

export { Scenes };

import React, { SyntheticEvent } from "react";
import { IObsRemote } from "..";
import { List, Tag } from "antd";
import { SyncOutlined, VideoCameraFilled } from '@ant-design/icons';
import { SceneName } from "../../Models";

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
      await this.props.ObsRemote.changeActiveCam(name);
    } catch (error) {
      
    }
  }
  
  render() {
    return (
      <>
        <List
          bordered
          dataSource={this.props.ObsRemote.scenes?.scenes}
          renderItem={item => {
            let extra: any = '';
            let content = (item.name === this.props.ObsRemote.scenes?.["current-scene"]) ? <span style={{ color: '#177ddc' }}><SyncOutlined spin /> {item.name}</span> : item.name;
            if(item.name === this.props.ObsRemote.scenes?.["current-scene"] && item.name === SceneName.Live) {
              let data = this.props.ObsRemote.scenes.scenes.filter(item => {
                return item.name === SceneName.Live
              });
              let cams = (data[0]).sources.filter(item => {
                return item.name.startsWith('cam');
              });
              cams = cams.sort(function(a, b) {
                var textA = a.name.toUpperCase();
                var textB = b.name.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
              });
              extra = <div>{cams.map(item => {
                return (item.render) ? <Tag key={item.name} icon={<VideoCameraFilled />} color="processing">{item.name}</Tag> : <Tag onClick={this.changeActiveCam(item.name as SceneName)} key={item.name} color="default">{item.name}</Tag>;
              })}</div>;
            }

            return (
              <List.Item key={item.name} extra={extra} onClick={this.changeScene(item.name as SceneName)}>
                {content}
              </List.Item>
            )
          }}
        />
      </>
    );
  }
};

export { Scenes };

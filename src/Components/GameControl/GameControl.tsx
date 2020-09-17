import React from "react";
import { IObsRemote } from "../";
import { Button, Row, Col, Radio } from "antd";
import { EyeOutlined, EyeInvisibleOutlined, FlagOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import './GameControl.css';
import { Quarter, SceneName } from "../../Models";

type GameControlProps = {
  ObsRemote: IObsRemote;
};
type GameControlState = {
};
class GameControl extends React.Component<GameControlProps, GameControlState> {

  constructor(props: Readonly<GameControlProps>) {
    super(props);
    this.state = {
    };
  }

  componentDidMount(){
    document.addEventListener("keydown", async (e) => await this.startReplay(e), false);
  }
  componentWillUnmount(){
    document.removeEventListener("keydown", async (e) => await this.startReplay(e), false);
  }

  changeQuarter = async (e: any) => {
    try {
      await this.props.ObsRemote.updateGameEventProps({ props: 'quarter' , value: e.target.value as Quarter });
    } catch (error) {
      
    }
  };

  toggleScoreboardVisibility = async (e: any) => {
    try {
      await this.props.ObsRemote.updateGameEventProps({ props: 'showScoreboard', value: !this.props.ObsRemote.store?.GameStatut.Options.showScoreboard});
    } catch (error) {
      
    }
  };

  toggleFlagVisibility = async (e: any) => {
    try {
      await this.props.ObsRemote.updateGameEventProps({ props: 'flag', value: !this.props.ObsRemote.store?.GameStatut.Options.flag});
    } catch (error) {
      
    }
  };

  // TODO: Ask for confirmation with popup
  startReplay = async (e: any) => {
    try {
      if(e.code === "F10") {
        if(this.props.ObsRemote.scenes?.["current-scene"] !== SceneName.Replay) {
          await this.props.ObsRemote.changeActiveScene(SceneName.Replay);
        }
      }
    } catch (error) {
      
    }
  };
  
  render() {
    // const menu = (
    //   <Menu>
    //     <Menu.Item onClick={this.handleMenuClick(ScoreType.PAT)}>PAT</Menu.Item>
    //     <Menu.Item onClick={this.handleMenuClick(ScoreType.EXTRAPOINT)}>2 points</Menu.Item>
    //   </Menu>
    // );

    const flagButton = this.props.ObsRemote.store?.GameStatut.Options.flag ? <Button style={{ backgroundColor: '#ffe066', color: '#000000', borderColor: '#fab005', }} onClick={this.toggleFlagVisibility} type="primary" block><FlagOutlined /> Flag</Button> : <Button onClick={this.toggleFlagVisibility} block><FlagOutlined /> Flag</Button>;
    const replayButton = this.props.ObsRemote.scenes?.["current-scene"] === SceneName.Replay ? <Button onClick={async () => await this.props.ObsRemote.changeActiveScene(SceneName.Live)} type="primary" block><PauseCircleOutlined /> Stop Replay</Button> : <Button disabled onClick={this.startReplay} block><PlayCircleOutlined /> Start Replay</Button>;
    const scoreboardButton = this.props.ObsRemote.store?.GameStatut.Options.showScoreboard ? <Button onClick={this.toggleScoreboardVisibility} type="primary" block><EyeOutlined /> Scoreboard</Button> : <Button onClick={this.toggleScoreboardVisibility} block><EyeInvisibleOutlined /> Scoreboard</Button>;

    const options = [
      { label: 'Q1', value: Quarter.ONE },
      { label: 'Q2', value: Quarter.TWO },
      { label: 'Q3', value: Quarter.THREE },
      { label: 'Q4', value: Quarter.FOUR },
      { label: 'Overtime', value: Quarter.OT },
    ];

    return (
      <>        
        <Row gutter={[16, 0]}>
          <Col span={8}>
            <Radio.Group
              options={options}
              onChange={this.changeQuarter}
              value={this.props.ObsRemote.store?.GameStatut.Options.quarter}
              defaultValue={Quarter.ONE}
              optionType="button"
              buttonStyle="solid"
            />
          </Col>
          <Col span={6}>
              {scoreboardButton}
          </Col>
          <Col span={5}>
              {replayButton}
          </Col>
          <Col span={5}>
            {flagButton}
          </Col>
        </Row>
      </>
    );
  }
};

export { GameControl };

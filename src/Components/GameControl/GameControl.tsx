import React from "react";
import { IObsRemote, ScoreTable } from "../";
import { Button, Row, Col, Radio, Popconfirm } from "antd";
import { EyeOutlined, EyeInvisibleOutlined, FlagOutlined, PlayCircleOutlined, PauseCircleOutlined, PauseOutlined, CaretRightOutlined, SyncOutlined } from '@ant-design/icons';
import './GameControl.css';
import { Quarter, SceneName } from "../../Models";

type GameControlProps = {
  ObsRemote: IObsRemote;
};
type GameControlState = {
  loadingsclock: boolean[];
};
class GameControl extends React.Component<GameControlProps, GameControlState> {

  constructor(props: Readonly<GameControlProps>) {
    super(props);
    this.state = {
      loadingsclock: [],
    };
  }

  shouldComponentUpdate = (nextProps: Readonly<GameControlProps>, nextState: Readonly<GameControlState>, nextContext: any): boolean => {
    if(nextProps.ObsRemote.coreStats !== this.props.ObsRemote.coreStats || nextProps.ObsRemote.streamingStats !== this.props.ObsRemote.streamingStats) {
      return false;
    }
    return true;
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
  
  startReplay = (e: any) => {
    try {
      this.props.ObsRemote.startReplay();
    } catch (error) {
      
    }
  };
  
  startStopClock = async (e: any) => {
    try {
      await this.setState(({ loadingsclock }) => {
        const newLoadings = [...loadingsclock];
        newLoadings[0] = true;
  
        return {
          loadingsclock: newLoadings,
        };
      });
      await this.props.ObsRemote.startStopClock();
      await this.setState(({ loadingsclock }) => {
        const newLoadings = [...loadingsclock];
        newLoadings[0] = false;
  
        return {
          loadingsclock: newLoadings,
        };
      });
    } catch (error) {
      
    }
  };
  
  toggleClock = async (e: any) => {
    try {
      await this.setState(({ loadingsclock }) => {
        const newLoadings = [...loadingsclock];
        newLoadings[1] = true;
  
        return {
          loadingsclock: newLoadings,
        };
      });
      await this.props.ObsRemote.toggleClock();
      await this.setState(({ loadingsclock }) => {
        const newLoadings = [...loadingsclock];
        newLoadings[1] = false;
  
        return {
          loadingsclock: newLoadings,
        };
      });
    } catch (error) {
      
    }
  };
  
  resetClock = async (e: any) => {
    try {
      await this.setState(({ loadingsclock }) => {
        const newLoadings = [...loadingsclock];
        newLoadings[2] = true;
  
        return {
          loadingsclock: newLoadings,
        };
      });
      await this.props.ObsRemote.resetClock();
      await this.setState(({ loadingsclock }) => {
        const newLoadings = [...loadingsclock];
        newLoadings[2] = false;
  
        return {
          loadingsclock: newLoadings,
        };
      });
    } catch (error) {
      
    }
  };

  replayButton = () => {
    switch (this.props.ObsRemote.scenes?.currentScene) {
      case SceneName.Replay:
        return  <Button onClick={async () => await this.props.ObsRemote.changeActiveScene(SceneName.Live)} type="primary" block>
                  <PauseCircleOutlined /> Stop Replay
                </Button>;
        
      case SceneName.Live:
        return  <Popconfirm
                  placement="bottomRight"
                  title='Do you Want to start the replay?'
                  onConfirm={this.startReplay}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button block>
                    <PlayCircleOutlined /> Start Replay
                  </Button>
                </Popconfirm>
    
      default:
        return  <Button block disabled>
                  <PlayCircleOutlined /> Start Replay
                </Button>
    }
  }

  
  render() {

    const flagButton = this.props.ObsRemote.store?.GameStatut.Options.flag ? <Button style={{ backgroundColor: '#ffe066', color: '#000000', borderColor: '#fab005', }} onClick={this.toggleFlagVisibility} type="primary" block><FlagOutlined /> Flag</Button> : <Button onClick={this.toggleFlagVisibility} block><FlagOutlined /> Flag</Button>;
    const replayButton = this.replayButton();
    const scoreboardButton = this.props.ObsRemote.store?.GameStatut.Options.showScoreboard ? <Button onClick={this.toggleScoreboardVisibility} type="primary" block><EyeOutlined /> Scoreboard</Button> : <Button onClick={this.toggleScoreboardVisibility} block><EyeInvisibleOutlined /> Scoreboard</Button>;

    const options = [
      { label: 'Q1', value: Quarter.Q1 },
      { label: 'Q2', value: Quarter.Q2 },
      { label: 'Q3', value: Quarter.Q3 },
      { label: 'Q4', value: Quarter.Q4 },
      { label: 'OT', value: Quarter.OT },
    ];

    return (
      <>        
        <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
          <Col span={8}>
            <Button
              block
              icon={this.props.ObsRemote.store?.GameStatut.Options.clock.active ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              loading={this.state.loadingsclock[0]}
              onClick={this.toggleClock}
            >{this.props.ObsRemote.store?.GameStatut.Options.clock.active ? 'Disable Clock' : 'Enable Clock'}</Button>
          </Col>
          <Col span={8}>
            { this.props.ObsRemote.store?.GameStatut.Options.clock.active && 
              <Button
                block
                icon={this.props.ObsRemote.store?.GameStatut.Options.clock.isOn ? <PauseOutlined /> : <CaretRightOutlined />}
                loading={this.state.loadingsclock[1]}
                onClick={this.startStopClock}
              >
                {this.props.ObsRemote.store?.GameStatut.Options.clock.isOn ? 'Stop Clock' : 'Start Clock'}
              </Button>
            }
          </Col>
          <Col span={8}>
            { this.props.ObsRemote.store?.GameStatut.Options.clock.active && 
            <Button
              block
              icon={<SyncOutlined />}
              loading={this.state.loadingsclock[2]}
              onClick={this.resetClock}
            >
              Reset Clock
            </Button>
          }
          </Col>
        </Row>
        <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
          <Col span={8}>
            <Radio.Group
              options={options}
              onChange={this.changeQuarter}
              value={this.props.ObsRemote.store?.GameStatut.Options.quarter}
              defaultValue={Quarter.Q1}
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
        <Row gutter={[16, 0]}>
          <Col span={12}>
            <ScoreTable key="homeTeamtable" ObsRemote={this.props.ObsRemote} isHomeTeam={true} />
          </Col>
          <Col span={12}>
            <ScoreTable key="awayTeamtable" ObsRemote={this.props.ObsRemote} isHomeTeam={false} />
          </Col>
        </Row>
      </>
    );
  }
};

export { GameControl };

import React from "react";
import { Row, Col } from "antd";
import { GameStatut, LiveSettings, Quarter, TeamPossession } from "../../Models";
import './Scoreboard.css';
import { IpcService } from "../../Utils/IpcService";
import { GameClock } from "..";

const ipc = new IpcService();

type ScoreboardProps = {
};
type ScoreboardState = {
  GameStatut?: GameStatut;
  LiveSettings?: LiveSettings;
  ipcrenderer?: Electron.IpcRenderer;
};
class Scoreboard extends React.Component<ScoreboardProps, ScoreboardState> {

  constructor(props: Readonly<ScoreboardProps>) {
    super(props);
    this.state = {      
    };
  }

  componentDidMount = async () => {
    try {
      let ipcrenderer = await ipc.receiveUpdate('scoreboard-update', { responseChannel: 'scoreboard-update' });
      await this.setState({ ipcrenderer })
      this.state.ipcrenderer?.on('scoreboard-update', this.onData);
    } catch (error) {
    }
  }

  componentWillUnmount = async () => {
    try {
      if (this.state.ipcrenderer) {
        this.state.ipcrenderer.removeListener('scoreboard-update', this.onData);
        await this.setState({ ipcrenderer: undefined });
      }
    } catch (error) {
      console.log(error);
    }
  }

  onData = async (event: any, response: any) => {
    await this.setState({
      GameStatut: response.GameStatut,
      LiveSettings: response.LiveSettings,
    })
  };
  
  render() {
    const homeTeam = this.state.GameStatut?.HomeTeam;
    const awayTeam = this.state.GameStatut?.AwayTeam;

    return (
      <div style={{ width: '100%', height: '100vh', backgroundColor: 'green', paddingTop: 25 }}>
        <Row gutter={[0, 0]}>
          <Col span={24}>
            <div className="scoreAndTime" style={{ display: 'flex', flexDirection: 'row', justifyContent: "center" }}>

              <div className="teamblock-scoreboard" style={{ width: '360px', background: homeTeam?.color }} >
                <img className='img-thumbnail teamlogo-scoreboard noselect' alt='home team logo' src={ homeTeam?.logo } />
                <div className="teamname-scoreboard noselect" style={{ fontWeight: 700 }}>
                  { homeTeam?.name }
                </div>
                <div className="teamscore-scoreboard noselect" style={{ fontWeight: 700 }}>
                  { homeTeam?.score.toLocaleString('fr-FR', { minimumIntegerDigits:2, useGrouping: false }) }
                </div>
                <div className="teamtimeoutblock-scoreboard noselect">
                  { homeTeam?.timeout && homeTeam?.timeout >= 1 && <div className="teamtimeout-scoreboard bg-warning"></div> }
                  { homeTeam?.timeout && homeTeam?.timeout >= 2 && <div className="teamtimeout-scoreboard bg-warning"></div> }
                  { homeTeam?.timeout && homeTeam?.timeout >= 3 && <div className="teamtimeout-scoreboard bg-warning"></div> }
                </div>
                { this.state.GameStatut?.Options.possession === TeamPossession.HOME && <div className="teampossession-scoreboard bg-warning noselect"></div> }
              </div>

              <div className="teamblock-scoreboard" style={{ marginLeft: '5px', width: '360px', background: awayTeam?.color }} >
                <img className='img-thumbnail teamlogo-scoreboard noselect' alt='home team logo' src={ awayTeam?.logo } />
                <div className="teamname-scoreboard noselect" style={{ fontWeight: 700 }}>
                  { awayTeam?.name }
                </div>
                <div className="teamscore-scoreboard noselect" style={{ fontWeight: 700 }}>
                  { awayTeam?.score.toLocaleString('fr-FR', { minimumIntegerDigits:2, useGrouping: false }) }
                </div>
                <div className="teamtimeoutblock-scoreboard noselect">
                  { awayTeam?.timeout && awayTeam?.timeout >= 1 && <div className="teamtimeout-scoreboard bg-warning"></div> }
                  { awayTeam?.timeout && awayTeam?.timeout >= 2 && <div className="teamtimeout-scoreboard bg-warning"></div> }
                  { awayTeam?.timeout && awayTeam?.timeout >= 3 && <div className="teamtimeout-scoreboard bg-warning"></div> }
                </div>
                { this.state.GameStatut?.Options.possession === TeamPossession.AWAY && <div className="teampossession-scoreboard bg-warning noselect"></div> }
              </div>

              <div className="teamblock-scoreboard" style={{ marginLeft: '5px', width: this.state.GameStatut?.Options.clock.active ? 180 : 145, background: '#333333', position: 'relative', overflow: "hidden" }}>
                <div className="quarter-scoreboard" style={{ textAlign: "center", fontWeight: 700, color: 'white'}}>
                  <p className='noselect' style={{ transform: 'skewX(25deg)', margin: 0 }}>
                    { this.state.GameStatut?.Options.clock.active && <GameClock clock={this.state.GameStatut?.Options.clock}></GameClock> }
                    <span className='noselect'>{ this.state.GameStatut?.Options.quarter === Quarter.OT ? 'OT' : 'Q' + this.state.GameStatut?.Options.quarter }</span>
                  </p>
                </div>
                <div className="quarter-scoreboard bg-warning noselect" style={{ 
                  textAlign: "center", 
                  fontWeight: 700, 
                  color: "black", 
                  position: "absolute", 
                  top: 0, 
                  right: this.state.GameStatut?.Options.flag ? 0 : this.state.GameStatut?.Options.clock.active ? 180 : 145, 
                  width: this.state.GameStatut?.Options.clock.active ? 180 : 145, 
                  transition: "all ease 0.8s" 
                }}>
                  <p className='noselect' style={{ transform: 'skewX(25deg)', margin: 0 }}>FLAG</p>
                </div>
              </div>

            </div>
          </Col>
        </Row>
      </div>
    );
  }
};

export { Scoreboard };

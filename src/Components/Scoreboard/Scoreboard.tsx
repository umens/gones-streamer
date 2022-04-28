import React from "react";
import { Row, Col } from "antd";
import { GameStatut, LiveSettings, Quarter, TeamPossession } from "../../Models";
import './Scoreboard.css';
import { GameClock } from "..";

type ScoreboardProps = {
};
type ScoreboardState = {
  GameStatut?: GameStatut;
  LiveSettings?: LiveSettings;
};
class Scoreboard extends React.Component<ScoreboardProps, ScoreboardState> {

  constructor(props: Readonly<ScoreboardProps>) {
    super(props);
    this.state = {      
    };
  }

  componentDidMount = () => {
    window.addEventListener('scoreboardUpdateReact', this.onData);
  }

  componentWillUnmount = async () => {
    window.removeEventListener('scoreboardUpdateReact', this.onData);
  }

  onData = async (data: any) => {
    await this.setState({
      GameStatut: data.detail.GameStatut,
      LiveSettings: data.detail.LiveSettings,
    })
  };

  pickTextColorBasedOnBgColorAdvanced = (bgColor: string = '#FFFFFF', lightColor: string, darkColor: string): string => {
    var color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
    var r = parseInt(color.substring(0, 2), 16); // hexToR
    var g = parseInt(color.substring(2, 4), 16); // hexToG
    var b = parseInt(color.substring(4, 6), 16); // hexToB
    var uicolors = [r / 255, g / 255, b / 255];
    var c = uicolors.map((col) => {
      if (col <= 0.03928) {
        return col / 12.92;
      }
      return Math.pow((col + 0.055) / 1.055, 2.4);
    });
    var L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
    return (L > 0.179) ? darkColor : lightColor;
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
                <div className="teamname-scoreboard noselect" style={{ fontWeight: 700, color: this.pickTextColorBasedOnBgColorAdvanced(homeTeam?.color, '#FFFFFF', '#000000') }}>
                  { homeTeam?.name }
                </div>
                <div className="teamscore-scoreboard noselect" style={{ fontWeight: 700, color: this.pickTextColorBasedOnBgColorAdvanced(homeTeam?.color, '#FFFFFF', '#000000') }}>
                  { homeTeam?.score.toLocaleString('fr-FR', { minimumIntegerDigits:2, useGrouping: false }) }
                </div>
                <div className="teamtimeoutblock-scoreboard noselect">
                  { homeTeam?.timeout! >= 1 && <div className="teamtimeout-scoreboard bg-warning"></div> }
                  { homeTeam?.timeout! >= 2 && <div className="teamtimeout-scoreboard bg-warning"></div> }
                  { homeTeam?.timeout! >= 3 && <div className="teamtimeout-scoreboard bg-warning"></div> }
                </div>
                { this.state.GameStatut?.Options.possession === TeamPossession.HOME && <div className="teampossession-scoreboard bg-warning noselect"></div> }
              </div>

              <div className="teamblock-scoreboard" style={{ marginLeft: '5px', width: '360px', background: awayTeam?.color }} >
                <img className='img-thumbnail teamlogo-scoreboard noselect' alt='home team logo' src={ awayTeam?.logo } />
                <div className="teamname-scoreboard noselect" style={{ fontWeight: 700, color: this.pickTextColorBasedOnBgColorAdvanced(awayTeam?.color, '#FFFFFF', '#000000') }}>
                  { awayTeam?.name }
                </div>
                <div className="teamscore-scoreboard noselect" style={{ fontWeight: 700, color: this.pickTextColorBasedOnBgColorAdvanced(awayTeam?.color, '#FFFFFF', '#000000') }}>
                  { awayTeam?.score.toLocaleString('fr-FR', { minimumIntegerDigits:2, useGrouping: false }) }
                </div>
                <div className="teamtimeoutblock-scoreboard noselect">
                  { awayTeam?.timeout! >= 1 && <div className="teamtimeout-scoreboard bg-warning"></div> }
                  { awayTeam?.timeout! >= 2 && <div className="teamtimeout-scoreboard bg-warning"></div> }
                  { awayTeam?.timeout! >= 3 && <div className="teamtimeout-scoreboard bg-warning"></div> }
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

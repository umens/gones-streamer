import React, { Component } from "react";
import { Row, Col } from "antd";
import { Quarter, TeamPossession } from "../../../../Models";
import './ScoreboardStyle2.css';
import { GameClock } from "../../..";
import { BaseScoreboardPropsHOC } from "../..";
import { Utilities } from "../../../../Utils";

class ScoreboardStyle2 extends Component<BaseScoreboardPropsHOC, {}> {  

  constructor(props: Readonly<BaseScoreboardPropsHOC>) {
    super(props);
    this.state = {   
    };
  }
  
  render() {
    const homeTeam = this.props.GameStatut?.HomeTeam;
    const awayTeam = this.props.GameStatut?.AwayTeam;

    return (
      <div id="scoreboardStyle2" style={{ width: '100%', height: 100, backgroundColor: 'green', paddingTop: 25 }}>
        <Row gutter={[0, 0]}>
          <Col span={24}>
            <div className="scoreAndTime" style={{ display: 'flex', flexDirection: 'row', justifyContent: "center" }}>

              <div className="teamblock-scoreboard" style={{ width: 225, position: 'relative', background: homeTeam?.color }} >
                <div className="teamblock-scoreboard-overflow">
                  <img className='img-thumbnail teamlogo-scoreboard noselect' alt='home team logo' src={ homeTeam?.logo } />
                  <div className="teamname-scoreboard noselect" style={{ fontWeight: 700, color: this.props.pickTextColorBasedOnBgColorAdvanced('#FFFFFF', '#000000', homeTeam?.color) }}>
                    { homeTeam?.name.substring(0, 5).normalize("NFD").replace(/\p{Diacritic}/gu, "") }
                  </div>
                  <div className="teamscore-scoreboard noselect" style={{ fontWeight: 700, background: homeTeam?.color, color: this.props.pickTextColorBasedOnBgColorAdvanced('#FFFFFF', '#000000', homeTeam?.color) }}>
                    { Utilities.zeroPad(homeTeam?.score || 0) }
                  </div>
                  <div className="teamtimeoutblock-scoreboard noselect">
                    { homeTeam?.timeout! >= 1 && <div className="teamtimeout-scoreboard" style={{ backgroundColor: this.props.pickTextColorBasedOnBgColorAdvanced('#FFFFFF', '#000000', homeTeam?.color) }}></div> }
                    { homeTeam?.timeout! >= 2 && <div className="teamtimeout-scoreboard" style={{ backgroundColor: this.props.pickTextColorBasedOnBgColorAdvanced('#FFFFFF', '#000000', homeTeam?.color) }}></div> }
                    { homeTeam?.timeout! >= 3 && <div className="teamtimeout-scoreboard" style={{ backgroundColor: this.props.pickTextColorBasedOnBgColorAdvanced('#FFFFFF', '#000000', homeTeam?.color) }}></div> }
                  </div>
                </div>
                { this.props.GameStatut?.Options.possession === TeamPossession.HOME && <div className="teampossession-scoreboard bg-warning noselect"></div> }
              </div>

              <div className="teamblock-scoreboard" style={{ width: 225, position: 'relative', background: awayTeam?.color }} >
                <div className="teamblock-scoreboard-overflow">
                  <img className='img-thumbnail teamlogo-scoreboard noselect' alt='home team logo' src={ awayTeam?.logo } />
                  <div className="teamname-scoreboard noselect" style={{ fontWeight: 700, color: this.props.pickTextColorBasedOnBgColorAdvanced('#FFFFFF', '#000000', awayTeam?.color) }}>
                    { awayTeam?.name.substring(0,5).normalize("NFD").replace(/\p{Diacritic}/gu, "") }
                  </div>
                  <div className="teamscore-scoreboard noselect" style={{ fontWeight: 700, background: awayTeam?.color, color: this.props.pickTextColorBasedOnBgColorAdvanced('#FFFFFF', '#000000', awayTeam?.color) }}>
                    { Utilities.zeroPad(awayTeam?.score || 0) }
                  </div>
                  <div className="teamtimeoutblock-scoreboard noselect">
                    { awayTeam?.timeout! >= 1 && <div className="teamtimeout-scoreboard" style={{ backgroundColor: this.props.pickTextColorBasedOnBgColorAdvanced('#FFFFFF', '#000000', awayTeam?.color) }}></div> }
                    { awayTeam?.timeout! >= 2 && <div className="teamtimeout-scoreboard" style={{ backgroundColor: this.props.pickTextColorBasedOnBgColorAdvanced('#FFFFFF', '#000000', awayTeam?.color) }}></div> }
                    { awayTeam?.timeout! >= 3 && <div className="teamtimeout-scoreboard" style={{ backgroundColor: this.props.pickTextColorBasedOnBgColorAdvanced('#FFFFFF', '#000000', awayTeam?.color) }}></div> }
                  </div>
                </div>
                { this.props.GameStatut?.Options.possession === TeamPossession.AWAY && <div className="teampossession-scoreboard bg-warning noselect"></div> }
              </div>

              <div className="teamblock-scoreboard" style={{ width: this.props.GameStatut?.Options.clock.active ? 225 : 145, background: '#333333', position: 'relative', overflow: "hidden", boxShadow: "none" }}>
                <div className="quarter-scoreboard" style={{ textAlign: "center", fontWeight: 700, color: 'white'}}>
                  <div className='noselect' style={{ float: 'left', paddingLeft: this.props.GameStatut?.Options.clock.active ? 10 : 0, width: this.props.GameStatut?.Options.clock.active ? '' : 145 }}>
                    <span className='noselect'>{ this.props.GameStatut?.Options.quarter === Quarter.OT ? 'OT' : 'Q' + this.props.GameStatut?.Options.quarter }</span>
                  </div>
                  <div className='noselect'>
                    { this.props.GameStatut?.Options.clock.active && <GameClock clock={this.props.GameStatut?.Options.clock}></GameClock> }
                  </div>
                </div>
                <div className="quarter-scoreboard bg-warning noselect" style={{ 
                  textAlign: "center", 
                  fontWeight: 700, 
                  color: "black", 
                  position: "absolute", 
                  top: 0, 
                  right: this.props.GameStatut?.Options.flag ? 0 : this.props.GameStatut?.Options.clock.active ? 225 : 145, 
                  width: this.props.GameStatut?.Options.clock.active ? 225 : 145, 
                  transition: "all ease 0.8s" 
                }}>
                  <p className='noselect' style={{ margin: 0 }}>FLAG</p>
                </div>
              </div>

            </div>
          </Col>
        </Row>
      </div>
    );
  }
};

export { ScoreboardStyle2 };

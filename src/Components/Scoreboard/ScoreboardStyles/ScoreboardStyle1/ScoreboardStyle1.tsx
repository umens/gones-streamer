import React, { Component } from "react";
import { Row, Col } from "antd";
import { Quarter, TeamPossession } from "../../../../Models";
import './ScoreboardStyle1.css';
import { GameClock } from "../../..";
import { BaseScoreboardPropsHOC } from "../..";
import { Utilities } from "../../../../Utils";

class ScoreboardStyle1 extends Component<BaseScoreboardPropsHOC, {}> {

  constructor(props: Readonly<BaseScoreboardPropsHOC>) {
    super(props);
    this.state = {   
    };
  }
  
  render() {
    const homeTeam = this.props.GameStatut?.HomeTeam;
    const awayTeam = this.props.GameStatut?.AwayTeam;

    return (
      <div id="scoreboardStyle1" style={{ width: '100%', height: 100, backgroundColor: 'green', paddingTop: 25 }}>
        <Row gutter={[0, 0]}>
          <Col span={24}>
            <div className="scoreAndTime" style={{ display: 'flex', flexDirection: 'row', justifyContent: "center" }}>

              <div className="teamblock-scoreboard" style={{ width: '360px', background: homeTeam?.color }} >
                <img className='img-thumbnail teamlogo-scoreboard noselect' alt='home team logo' src={ homeTeam?.logo } />
                <div className="teamname-scoreboard noselect" style={{ fontWeight: 700, color: this.props.pickTextColorBasedOnBgColorAdvanced('#FFFFFF', '#000000', homeTeam?.color) }}>
                  { homeTeam?.name }
                </div>
                <div className="teamscore-scoreboard noselect" style={{ fontWeight: 700, color: this.props.pickTextColorBasedOnBgColorAdvanced('#FFFFFF', '#000000', homeTeam?.color) }}>
                  { Utilities.zeroPad(homeTeam?.score!) }
                </div>
                <div className="teamtimeoutblock-scoreboard noselect">
                  { homeTeam?.timeout! >= 1 && <div className="teamtimeout-scoreboard bg-warning"></div> }
                  { homeTeam?.timeout! >= 2 && <div className="teamtimeout-scoreboard bg-warning"></div> }
                  { homeTeam?.timeout! >= 3 && <div className="teamtimeout-scoreboard bg-warning"></div> }
                </div>
                { this.props.GameStatut?.Options.possession === TeamPossession.HOME && <div className="teampossession-scoreboard bg-warning noselect"></div> }
              </div>

              <div className="teamblock-scoreboard" style={{ marginLeft: '5px', width: '360px', background: awayTeam?.color }} >
                <img className='img-thumbnail teamlogo-scoreboard noselect' alt='home team logo' src={ awayTeam?.logo } />
                <div className="teamname-scoreboard noselect" style={{ fontWeight: 700, color: this.props.pickTextColorBasedOnBgColorAdvanced('#FFFFFF', '#000000', awayTeam?.color) }}>
                  { awayTeam?.name }
                </div>
                <div className="teamscore-scoreboard noselect" style={{ fontWeight: 700, color: this.props.pickTextColorBasedOnBgColorAdvanced('#FFFFFF', '#000000', awayTeam?.color) }}>
                  { Utilities.zeroPad(awayTeam?.score!) }
                </div>
                <div className="teamtimeoutblock-scoreboard noselect">
                  { awayTeam?.timeout! >= 1 && <div className="teamtimeout-scoreboard bg-warning"></div> }
                  { awayTeam?.timeout! >= 2 && <div className="teamtimeout-scoreboard bg-warning"></div> }
                  { awayTeam?.timeout! >= 3 && <div className="teamtimeout-scoreboard bg-warning"></div> }
                </div>
                { this.props.GameStatut?.Options.possession === TeamPossession.AWAY && <div className="teampossession-scoreboard bg-warning noselect"></div> }
              </div>

              <div className="teamblock-scoreboard" style={{ marginLeft: '5px', width: this.props.GameStatut?.Options.clock.active ? 180 : 145, background: '#333333', position: 'relative', overflow: "hidden" }}>
                <div className="quarter-scoreboard" style={{ textAlign: "center", fontWeight: 700, color: 'white'}}>
                  <p className='noselect' style={{ transform: 'skewX(25deg)', margin: 0 }}>
                    { this.props.GameStatut?.Options.clock.active && <GameClock clock={this.props.GameStatut?.Options.clock}></GameClock> }
                    <span className='noselect'>{ this.props.GameStatut?.Options.quarter === Quarter.OT ? 'OT' : 'Q' + this.props.GameStatut?.Options.quarter }</span>
                  </p>
                </div>
                <div className="quarter-scoreboard bg-warning noselect" style={{ 
                  textAlign: "center", 
                  fontWeight: 700, 
                  color: "black", 
                  position: "absolute", 
                  top: 0, 
                  right: this.props.GameStatut?.Options.flag ? 0 : this.props.GameStatut?.Options.clock.active ? 180 : 145, 
                  width: this.props.GameStatut?.Options.clock.active ? 180 : 145, 
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

export { ScoreboardStyle1 };

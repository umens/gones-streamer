import React from "react";
import { Col, Row } from "antd";
import { BaseScoreboardEditable, BaseScoreboardEditableProps, TeamScoreboardEditableStyle2 } from "../..";
import { GameClockEditable } from "../../..";
import { Quarter } from "../../../../Models";
import './ScoreboardEditableStyle2.css';


class ScoreboardEditableStyle2 extends BaseScoreboardEditable {

  constructor(props: Readonly<BaseScoreboardEditableProps>) {
    super(props);
    this.state = {
    };
  }

  render() {

    return (
      <Row gutter={[0, 0]}>
        <Col span={24}>
          <div id="scoreboardEditStyle2" className="scoreAndTime" style={{ display: 'flex', flexDirection: 'row', justifyContent: "center" }}>

            <TeamScoreboardEditableStyle2 ObsRemote={this.props.ObsRemote} isHomeTeam={true} />

            <TeamScoreboardEditableStyle2 ObsRemote={this.props.ObsRemote} isHomeTeam={false} />

            <div className="teamblock-scoreboard" style={{ width: this.props.ObsRemote.store?.GameStatut.Options.clock.active ? 225 : 145, background: '#333333', position: 'relative', overflow: "hidden", boxShadow: "none" }}>
              <div className="quarter-scoreboard" style={{ textAlign: "center", fontWeight: 700, color: 'white'}}>
                <div className='' style={{ float: 'left', paddingLeft: this.props.ObsRemote.store?.GameStatut.Options.clock.active ? 10 : 0, width: this.props.ObsRemote.store?.GameStatut.Options.clock.active ? '' : 145 }}>
                  <span className=''>{ this.props.ObsRemote.store?.GameStatut.Options.quarter === Quarter.OT ? 'OT' : 'Q' + this.props.ObsRemote.store?.GameStatut.Options.quarter }</span>
                </div>
                <div className=''>
                { this.props.ObsRemote.store?.GameStatut.Options.clock.active && <GameClockEditable ObsRemote={this.props.ObsRemote}></GameClockEditable> }
                </div>
              </div>
              <div className="quarter-scoreboard bg-warning" style={{ 
                textAlign: "center", 
                fontWeight: 700, 
                color: "black", 
                position: "absolute", 
                top: 0, 
                right: this.props.ObsRemote.store?.GameStatut.Options.flag ? 0 : this.props.ObsRemote.store?.GameStatut.Options.clock.active ? 250 : 145, 
                width: this.props.ObsRemote.store?.GameStatut.Options.clock.active ? 225 : 145, 
                transition: "all ease 0.8s" 
              }}>
                <p className='' style={{ margin: 0 }}>FLAG</p>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    );
  }
};

export { ScoreboardEditableStyle2 };
import React from "react";
import { GameClockEditable, IObsRemote } from "../";
import { Row, Col } from "antd";
import { Quarter } from "../../Models";
import './ScoreboardEditable.css';
import { TeamScorboardEditable } from "../TeamScorboardEditable/TeamScorboardEditable";

type ScoreboardEditableProps = {
  ObsRemote: IObsRemote;
};
type ScoreboardEditableState = {
};
class ScoreboardEditable extends React.Component<ScoreboardEditableProps, ScoreboardEditableState> {

  constructor(props: Readonly<ScoreboardEditableProps>) {
    super(props);
    this.state = {
    };
  }

  render() {

    return (
      <Row gutter={[0, 0]}>
        <Col span={24}>
          <div className="scoreAndTime" style={{ display: 'flex', flexDirection: 'row', justifyContent: "center" }}>

            <TeamScorboardEditable ObsRemote={this.props.ObsRemote} isHomeTeam={true} />

            <TeamScorboardEditable ObsRemote={this.props.ObsRemote} isHomeTeam={false} />

            <div className="teamblock-scoreboard" style={{ marginLeft: '5px', width: this.props.ObsRemote.store?.GameStatut.Options.clock.active ? 180 : 145, background: '#333333', position: 'relative', overflow: "hidden" }}>
              <div className="quarter-scoreboard" style={{ textAlign: "center", fontWeight: 700, color: 'white'}}>
                <p style={{ transform: 'skewX(25deg)', margin: 0 }}>
                  { this.props.ObsRemote.store?.GameStatut.Options.clock.active && <GameClockEditable ObsRemote={this.props.ObsRemote}></GameClockEditable> }
                  <span>{ this.props.ObsRemote.store?.GameStatut.Options.quarter === Quarter.OT ? 'OT' : 'Q' + this.props.ObsRemote.store?.GameStatut.Options.quarter }</span>
                </p>
              </div>
              <div className="quarter-scoreboard bg-warning" style={{ 
                textAlign: "center", 
                fontWeight: 700, 
                color: "black", 
                position: "absolute", 
                top: 0, 
                right: this.props.ObsRemote.store?.GameStatut.Options.flag ? 0 : this.props.ObsRemote.store?.GameStatut.Options.clock.active ? 180 : 145, 
                width: this.props.ObsRemote.store?.GameStatut.Options.clock.active ? 180 : 145, 
                transition: "all ease 0.8s" 
              }}>
                <p style={{ transform: 'skewX(25deg)', margin: 0 }}>FLAG</p>
              </div>
            </div>

          </div>
        </Col>
      </Row>
    );
  }
};

export { ScoreboardEditable };

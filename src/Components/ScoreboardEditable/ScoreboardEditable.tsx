import React from "react";
import { IObsRemote } from "../";
import { Row, Col } from "antd";
import { Quarter, TeamPossession } from "../../Models";
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

  // componentDidMount = async () => {
  //   try {
  //     if(this.props.display) {
  //       await this.getScreenshot();
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // componentWillUnmount = async () => {
  //   try {
  //     if (this.state.timeout) {
  //       clearTimeout(this.state.timeout);
  //       await this.setState({ timeout: undefined, preview: undefined });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // componentDidUpdate = async (prevProps: PreviewProps) => {
  //   try {
  //     if (this.props.display && !prevProps.display) {
  //       await this.getScreenshot();
  //     }
  //     else if (!this.props.display && prevProps.display) {
  //       if (this.state.timeout) {
  //         clearTimeout(this.state.timeout);
  //         await this.setState({ timeout: undefined, preview: undefined });
  //       }
  //     }
  //   } catch (error) {
      
  //   }
  // }
  
  render() {

    // const homeTeam = this.props.ObsRemote.store?.GameStatut.HomeTeam;
    // const awayTeam = this.props.ObsRemote.store?.GameStatut.AwayTeam;

    return (
      <Row gutter={[0, 0]}>
        <Col span={24}>
          <div className="scoreAndTime" style={{ display: 'flex', flexDirection: 'row', justifyContent: "center" }}>

            <TeamScorboardEditable ObsRemote={this.props.ObsRemote} isHomeTeam={true} />

            <TeamScorboardEditable ObsRemote={this.props.ObsRemote} isHomeTeam={false} />

            {/* <div className="teamblock-scoreboard" style={{ marginLeft: '5px', width: '360px', background: awayTeam?.color }} >
              <img className='img-thumbnail teamlogo-scoreboard' alt='home team logo' src={ awayTeam?.logo } />
              <div className="teamname-scoreboard" style={{ fontWeight: 700 }}>
                { awayTeam?.name }
              </div>
              <div className="teamscore-scoreboard" style={{ fontWeight: 700 }}>
                { awayTeam?.score.toLocaleString('fr-FR', { minimumIntegerDigits:2, useGrouping: false }) }
              </div>
              <div className="teamtimeoutblock-scoreboard">
                { awayTeam?.timeout && awayTeam?.timeout >= 1 && <div className="teamtimeout-scoreboard bg-warning"></div> }
                { awayTeam?.timeout && awayTeam?.timeout >= 2 && <div className="teamtimeout-scoreboard bg-warning"></div> }
                { awayTeam?.timeout && awayTeam?.timeout >= 3 && <div className="teamtimeout-scoreboard bg-warning"></div> }
              </div>
              { this.props.ObsRemote.store?.GameStatut.Options.possession === TeamPossession.AWAY && <div className="teampossession-scoreboard bg-warning"></div> }
            </div> */}

            <div className="teamblock-scoreboard" style={{ marginLeft: '5px', width: '145px', background: '#333333', position: 'relative', overflow: "hidden" }}>
              <div className="quarter-scoreboard" style={{ textAlign: "center", fontWeight: 700, color: 'white'}}>
                <p style={{ transform: 'skewX(25deg)', margin: 0 }}>{ this.props.ObsRemote.store?.GameStatut.Options.quarter === Quarter.OT ? 'OT' : 'Q' + this.props.ObsRemote.store?.GameStatut.Options.quarter }</p>
              </div>
              <div className="quarter-scoreboard bg-warning" style={{ textAlign: "center", fontWeight: 700, color: "black", position: "absolute", top: 0, right: this.props.ObsRemote.store?.GameStatut.Options.flag ? 0 : 145, width: 145, transition: "all ease 0.8s" }}>
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

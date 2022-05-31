import React from "react";
import './Scoreboard.css';
import { ScoreboardSettingsStyle } from "../../Models/Models";
import { ScoreboardStyle2, withScoreboardStyle } from "./";
import { ScoreboardStyle1 } from "./ScoreboardStyles/ScoreboardStyle1/ScoreboardStyle1";
import { IObsRemote } from "..";

type ScoreboardProps = {
  ObsRemote: IObsRemote;
  style?: ScoreboardSettingsStyle
  // GameStatut?: GameStatut;
  // LiveSettings?: LiveSettings;
};
type ScoreboardState = {
  // GameStatut?: GameStatut;
  // LiveSettings?: LiveSettings;
};
class Scoreboard extends React.Component<ScoreboardProps, ScoreboardState> {

  constructor(props: Readonly<ScoreboardProps>) {
    super(props);
    this.state = {   
      // GameStatut: this.props.GameStatut,
      // LiveSettings: this.props.LiveSettings,
    };
  }

  shouldComponentUpdate = (nextProps: Readonly<ScoreboardProps>, nextState: Readonly<ScoreboardState>, nextContext: any): boolean => {
    if(nextProps.ObsRemote.coreStats !== this.props.ObsRemote.coreStats || nextProps.ObsRemote.streamingStats !== this.props.ObsRemote.streamingStats) {
      return false;
    }
    return true;
  }

  render() {
    let ScoreboardStyle;
    switch (this.props.style || this.props.ObsRemote?.store?.ScoreboardSettings.style) {
      case ScoreboardSettingsStyle.STYLE2:
        ScoreboardStyle = withScoreboardStyle(props => <ScoreboardStyle2 { ...props } />);
        break;
    
      case ScoreboardSettingsStyle.STYLE1:
      default:
        ScoreboardStyle = withScoreboardStyle(props => <ScoreboardStyle1 { ...props } />);
        break;
    }
    return <ScoreboardStyle ObsRemote={this.props.ObsRemote}/>;
  }
};

export { Scoreboard };

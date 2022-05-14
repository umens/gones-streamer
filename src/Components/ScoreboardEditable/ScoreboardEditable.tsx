import React from "react";
import { ScoreboardEditableStyle1, ScoreboardEditableStyle2 } from './';
import { IObsRemote } from "../";
import './ScoreboardEditable.css';
import { ScoreboardSettingsStyle } from "../../Models/Models";

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

  shouldComponentUpdate = (nextProps: Readonly<ScoreboardEditableProps>, nextState: Readonly<ScoreboardEditableState>, nextContext: any): boolean => {
    if(nextProps.ObsRemote.coreStats !== this.props.ObsRemote.coreStats || nextProps.ObsRemote.streamingStats !== this.props.ObsRemote.streamingStats) {
      return false;
    }
    return true;
  }

  render() {
    switch (this.props.ObsRemote.store?.ScoreboardSettings.style || ScoreboardSettingsStyle.STYLE1) {
      case ScoreboardSettingsStyle.STYLE2:
        return <ScoreboardEditableStyle2 ObsRemote={this.props.ObsRemote}/>;
    
      case ScoreboardSettingsStyle.STYLE1:
      default:
        return <ScoreboardEditableStyle1 ObsRemote={this.props.ObsRemote}/>;
    }
  }
};

export { ScoreboardEditable };
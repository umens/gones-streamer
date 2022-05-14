import React from "react";
import { IObsRemote } from "../../..";
// import { Row, Col } from "antd";
// import { Quarter } from "../../../../Models";
import './BaseScoreboardEditable.css';
// import { TeamScorboardEditable } from "../BaseTeamScorboardEditable/TeamScorboardEditable";
// import { ScoreboardSettingsStyle } from "../../../../Models/Models";

type BaseScoreboardEditableProps = {
  ObsRemote: IObsRemote;
};
type BaseScoreboardEditableState = {
};
class BaseScoreboardEditable extends React.Component<BaseScoreboardEditableProps, BaseScoreboardEditableState> {

  constructor(props: Readonly<BaseScoreboardEditableProps>) {
    
    super(props);
    this.state = {
    };
  }

  render(): React.ReactNode {
    return <></>;
  }

};

// function BaseScoreboardEditable(WrappedComponent: ComponentType<BaseScoreboardEditableProps>) {
//   // ...and returns another component...
//   return class Component extends React.Component<BaseScoreboardEditableProps, BaseScoreboardEditableState> {
//     constructor(props: Readonly<BaseScoreboardEditableProps>) {
//       super(props);
//       this.state = {
//       };
//     }

//     render() {
//       // ... and renders the wrapped component with the fresh data!
//       // Notice that we pass through any additional props
//       return <WrappedComponent {...this.props } />;
//     }
//   };
// }

export { BaseScoreboardEditable };
export type { BaseScoreboardEditableProps, BaseScoreboardEditableState };
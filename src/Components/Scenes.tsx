import React from "react";
import { ObsCockpit } from "../Class";

type ScenesProps = {
  ObsCockpit: ObsCockpit;
};
type ScenesState = {
};
class Scenes extends React.Component<ScenesProps, ScenesState> {
  state: ScenesState = {
  };
  render() {
    console.log(this.props.ObsCockpit)
    return (
      <div>
        {"" + this.props.ObsCockpit.live}
      </div>
    );
  }
};

export { Scenes };

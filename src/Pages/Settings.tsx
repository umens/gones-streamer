import React from "react";

type SettingsProps = {
  // using `interface` is also ok
  message: string;
};
type SettingsState = {
  count: number; // like this
};
class Settings extends React.Component<SettingsProps, SettingsState> {
  state: SettingsState = {
    // optional second annotation for better type inference
    count: 1,
  };
  render() {
    return (
      <div>
        {this.props.message} {this.state.count}
      </div>
    );
  }
};

export { Settings };

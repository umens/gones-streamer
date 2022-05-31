import React, { ComponentType } from "react";
import { IObsRemote } from "../../..";
import { GameStatut, LiveSettings } from "../../../../Models";
import './BaseScoreboard.css';

type BaseScoreboardProps = {
  ObsRemote: IObsRemote;
  // GameStatut?: GameStatut;
  // LiveSettings?: LiveSettings;
};
type BaseScoreboardPropsHOC = {
  // ObsRemote: IObsRemote;
  GameStatut?: GameStatut;
  LiveSettings?: LiveSettings;
  pickTextColorBasedOnBgColorAdvanced: (lightColor: string, darkColor: string, bgColor?: string) => string;
}
type BaseScoreboardState = {
  GameStatut?: GameStatut;
  LiveSettings?: LiveSettings;
};

const withScoreboardStyle = (WrappedComponent: ComponentType<BaseScoreboardPropsHOC>) => {
  return class BaseScoreboard extends React.Component<BaseScoreboardProps, BaseScoreboardState> {

    constructor(props: Readonly<BaseScoreboardProps>) {
      super(props);
      this.state = {      
        GameStatut: this.props.ObsRemote?.store?.GameStatut,
        LiveSettings: this.props.ObsRemote?.store?.LiveSettings,
      };
      // this.pickTextColorBasedOnBgColorAdvanced = this.pickTextColorBasedOnBgColorAdvanced.bind(this);
    }

    shouldComponentUpdate = (nextProps: Readonly<BaseScoreboardProps>, nextState: Readonly<BaseScoreboardState>, nextContext: any): boolean => {
      if(nextProps.ObsRemote.coreStats !== this.props.ObsRemote.coreStats || nextProps.ObsRemote.streamingStats !== this.props.ObsRemote.streamingStats) {
        return false;
      }
      return true;
    }
  
    componentDidMount = () => {
      window.addEventListener('scoreboardUpdateReact', this.onData);
    }
  
    componentWillUnmount = async () => {
      window.removeEventListener('scoreboardUpdateReact', this.onData);
    }
  
    onData = async (data: any) => {
      await this.setState({
        GameStatut: data.detail.GameStatut,
        LiveSettings: data.detail.LiveSettings,
      })
    };
  
    pickTextColorBasedOnBgColorAdvanced = (lightColor: string, darkColor: string, bgColor: string = '#FFFFFF'): string => {
      var color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
      var r = parseInt(color.substring(0, 2), 16); // hexToR
      var g = parseInt(color.substring(2, 4), 16); // hexToG
      var b = parseInt(color.substring(4, 6), 16); // hexToB
      var uicolors = [r / 255, g / 255, b / 255];
      var c = uicolors.map((col) => {
        if (col <= 0.03928) {
          return col / 12.92;
        }
        return Math.pow((col + 0.055) / 1.055, 2.4);
      });
      var L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
      return (L > 0.179) ? darkColor : lightColor;
    };
  
    render(): React.ReactNode {
      return <WrappedComponent      
        GameStatut={this.state.GameStatut}
        LiveSettings={this.state.LiveSettings}
        pickTextColorBasedOnBgColorAdvanced={this.pickTextColorBasedOnBgColorAdvanced}
      />
    }
  
  };
}

export { withScoreboardStyle };
export type { BaseScoreboardProps, BaseScoreboardState, BaseScoreboardPropsHOC };

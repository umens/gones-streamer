import React, { Component } from "react";
import { GameClock as Clock } from '../../Models';

type GameClockProps = {  
  clock: Clock;
};
type GameClockState = {
};
class GameClock extends Component<GameClockProps, GameClockState> {

  constructor(props: Readonly<GameClockProps>) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { minutes, seconds } = this.props.clock!;

    return(
      <span style={{ marginRight: 20, width: 80, display: "inline-block" }}>{minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span>
    )
  }
}

export { GameClock };
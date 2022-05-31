import React, { Component } from "react";
import { Image } from 'antd';

type VideoPreviewProps = {
  images: string[];
  interval: number;
};
type VideoPreviewState = {
  currentImage: number;
  // timeout?: NodeJS.Timeout;
};
class VideoPreview extends Component<VideoPreviewProps, VideoPreviewState> {

  timeout?: NodeJS.Timer;
  static defaultProps = {
    interval: 450,
  };

  constructor(props: Readonly<VideoPreviewProps>) {
    super(props);
    this.state = {
      currentImage: 0,
    };
  }

  componentDidMount = () => {
  }

  componentWillUnmount = async () => {
    if(this.timeout) {
      clearInterval(this.timeout);
      this.timeout = undefined;
    }
  }

  startRotation = () => {
    if (this.timeout) {
      clearInterval(this.timeout);
      this.timeout = undefined;
    }
    this.timeout = setInterval(() => {
      const nextImage = (this.state.currentImage + 1 > this.props.images.length - 1) ? 0 : this.state.currentImage + 1;
      this.setState({ currentImage: nextImage });
    }, this.props.interval);
  }

  stopRotation = () => {
    if(this.timeout) {
      clearInterval(this.timeout);
      this.timeout = undefined;
      this.setState({ currentImage: 0 });
    }
  }

  render() {

    return(
      this.props.images.length > 1 ?
      <div id="rotatingImg" onMouseEnter={this.startRotation} onMouseLeave={this.stopRotation}>
        <Image style={{ margin: "auto", display: "block" }} preview={false} height={139} width={246} src={this.props.images[this.state.currentImage]} />
        {/* <img src={this.props.images[this.state.currentImage]} /> */}
      </div>
      :
      <Image style={{ margin: "auto", display: "block" }} preview={false} height={139} width={246} src={this.props.images[this.state.currentImage]} />
    )
  }
}

export { VideoPreview };
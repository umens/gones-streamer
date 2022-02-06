import React from "react";
import { IObsRemote } from "../";
import { Row, Col } from "antd";

type PreviewProps = {
  ObsRemote: IObsRemote;
};
type PreviewState = {
};
class Preview extends React.Component<PreviewProps, PreviewState> {

  private previewContainer: HTMLElement | null = null;

  constructor(props: Readonly<PreviewProps>) {
    super(props);
    this.state = {
    };
  }

  componentDidMount = async () => {
    try {
      this.props.ObsRemote.setupPreview();
    } catch (error) {
      console.log(error);
    }
  }

  componentWillUnmount = async () => {
    try {
    //   window.obs.removePreview();
    } catch (error) {
      console.log(error);
    }
  };
  
  render() {
    return (
      <Row gutter={[0, 0]}>
        <Col span={24}>
          <div id="previewObs">Initializing...</div>
        </Col>
      </Row>
    );
  }
};

export { Preview };

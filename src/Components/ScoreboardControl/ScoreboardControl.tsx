import React from "react";
import { Row, Col, Button, Form, Select, FormInstance, message } from "antd";
import { IObsRemote, Scoreboard } from "../";
import { Utilities } from "../../Utils";
import { ScoreboardSettings, ScoreboardSettingsPosition, ScoreboardSettingsStyle } from "../../Models/Models";
import './ScoreboardControl.css';

type ScoreboardControlProps = {
  ObsRemote: IObsRemote;
};
type ScoreboardControlState = {
  sendingForm: boolean;
  stylePreview: ScoreboardSettingsStyle;
};
class ScoreboardControl extends React.Component<ScoreboardControlProps, ScoreboardControlState> {
  
  formRef = React.createRef<FormInstance>();

  constructor(props: Readonly<ScoreboardControlProps>) {
    super(props);
    this.state = {
      sendingForm: false,
      stylePreview: this.props.ObsRemote.store?.ScoreboardSettings?.style || ScoreboardSettingsStyle.STYLE1,
    }
  }

  onFinish = async (values: ScoreboardSettings) => {
    try {
      values.style = this.state.stylePreview;
      await this.setState({ sendingForm: true });
      await this.props.ObsRemote.updateScoreboardSettings(values);
      await window.app.manageStoredConfig({ action: 'set', key: 'ScoreboardSettings', value: values });
      await this.setState({ sendingForm: false });
      message.success({ content: 'Scoreboard settings updated !', key: 'scoreboardupdated' });
    } catch (error) {
      console.log(error)
      await this.setState({ sendingForm: false });
    }
  };

  onChange = async (value: ScoreboardSettingsStyle) => {
    await this.setState({stylePreview: value});

  }
  
  render() {
    return (
      <>
        <Row gutter={[16, 0]}>
          <Col span={24}>
          <Form
              layout='vertical'
              ref={this.formRef}
              name="control-ref"
              onFinish={this.onFinish}
              initialValues={{
                position: this.props.ObsRemote.store?.ScoreboardSettings?.position,
                style: this.props.ObsRemote.store?.ScoreboardSettings?.style,
              }}
            >
            <Form.Item label="Position" name="position">                
              <Select defaultValue={this.props.ObsRemote.store?.ScoreboardSettings?.position} style={{ width: '100%' }}>
                { (Object.keys(ScoreboardSettingsPosition) as (keyof typeof ScoreboardSettingsPosition)[]).map((key, index) => (
                    <Select.Option key={`scoreboard-position-${index}`} value={ScoreboardSettingsPosition[key]} disabled={ScoreboardSettingsPosition[key] !== ScoreboardSettingsPosition.TR}>{Utilities.capitalize(ScoreboardSettingsPosition[key].toLowerCase())}</Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
              <Form.Item label="Style" name="style">                
                <Select onChange={this.onChange} defaultValue={this.props.ObsRemote.store?.ScoreboardSettings?.style} style={{ width: '100%' }}>
                  { (Object.keys(ScoreboardSettingsStyle) as (keyof typeof ScoreboardSettingsStyle)[]).map((key, index) => (
                      <Select.Option key={`scoreboard-style-${index}`} value={ScoreboardSettingsStyle[key]}>{Utilities.capitalize(ScoreboardSettingsStyle[key].toLowerCase())}</Select.Option>
                    ))
                  }
                </Select>
                <div id='scoreboardControlDisplay' style={ { marginTop: 15 } }>
                  <Scoreboard ObsRemote={this.props.ObsRemote} style={this.state.stylePreview} />
                </div>
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button loading={this.state.sendingForm} type="primary" htmlType="submit">
                  Envoyer
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </>
    );
  }
};

export { ScoreboardControl };

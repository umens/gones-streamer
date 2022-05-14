import React from "react";
import { ColorPicker, IObsRemote } from "../";
import { Row, Col, Skeleton, Form, Select, Button, FormInstance, message } from "antd";
import { TextsSettings } from "../../Models";

const { Option } = Select;

type BackgroundTextControlProps = {
  ObsRemote: IObsRemote;
};
type BackgroundTextControlState = {
  policesAvailable: string[];
  loadingFonts: boolean;
  sendingForm: boolean;
  initialValues?: TextsSettings;
};
class BackgroundTextControl extends React.Component<BackgroundTextControlProps, BackgroundTextControlState> {

  formRef = React.createRef<FormInstance>();

  constructor(props: Readonly<BackgroundTextControlProps>) {
    super(props);
    this.state = {
      policesAvailable: [],
      loadingFonts: true,
      sendingForm: false,
      initialValues: undefined,
    };
  }

  componentDidMount = async () => {
    try {
      const policesAvailable = await window.app.getFonts();
      await this.setState({ initialValues: this.props.ObsRemote.store?.TextsSettings, policesAvailable, loadingFonts: false });
    } catch (error) {
      console.log(error);
    }
  }

  componentDidUpdate = async (prevProps: BackgroundTextControlProps) => {
    try {
      
    } catch (error) {
      
    }
  }

  onFinish = async (values: TextsSettings) => {
    try {
      await this.setState({ sendingForm: true });
      await this.props.ObsRemote.updateTextsSettings(values);
      await window.app.manageStoredConfig({ action: 'set', key: 'TextsSettings', value: values });
      await this.setState({ sendingForm: false });      
      message.success({ content: 'Texts updated !', key: 'textsupdated' });
    } catch (error) {
      await this.setState({ sendingForm: false });
    }
  };
  
  render() {
    return (
      <Row gutter={[0, 0]}>
        <Col span={24}>
          <Skeleton loading={this.state.loadingFonts && !this.state.initialValues} active>
            <Form
              layout='vertical'
              ref={this.formRef}
              name="control-ref"
              onFinish={this.onFinish}
              initialValues={this.state.initialValues}
            >
              <Form.Item label="Font" name="font">
                <Select 
                  style={{ width: '100%' }}
                  showSearch 
                  placeholder="Select a font"
                  optionFilterProp="children"
                  filterOption={(input: any, option: any) =>
                    option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  filterSort={(optionA: any, optionB: any) =>
                    optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                  }
                >
                  { this.state.policesAvailable.map((item, key) => (
                    <Option style={{ fontFamily: item }} key={`font-${key}`} value={item}>{ item }</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="homeTeamColor" label="Home Team Text Color">
                <ColorPicker />
              </Form.Item>
              <Form.Item name="awayTeamColor" label="Away Team Text Color">
                <ColorPicker />
              </Form.Item>
              <Form.Item name="scoreColor" label="Score Text Color">
                <ColorPicker />
              </Form.Item>
              <Form.Item name="journeyColor" label="Titles Text Color">
                <ColorPicker />
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button loading={this.state.sendingForm} type="primary" htmlType="submit">
                  Envoyer
                </Button>
              </Form.Item>
            </Form>
          </Skeleton>          
        </Col>
      </Row>
    );
  }
};

export { BackgroundTextControl };

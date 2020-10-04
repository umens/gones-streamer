import { Modal, Form, InputNumber } from "antd";
import { FormInstance } from "antd/lib/form";
import React, { Component } from "react";
import { IObsRemote } from "..";

type GameClockEditableProps = {  
  ObsRemote: IObsRemote;
};
type GameClockEditableState = {
  visibleModal: boolean;
};
class GameClockEditable extends Component<GameClockEditableProps, GameClockEditableState> {

  constructor(props: Readonly<GameClockEditableProps>) {
    super(props);
    this.state = {
      visibleModal: false,
    };
  }

  onCreate = async (values: any) => {
    try {
      this.props.ObsRemote.setGameClock(values);
      await this.setState({ visibleModal: false });
    } catch (error) {
      
    }
  };

  render() {
    const { minutes, seconds } = this.props.ObsRemote.store?.GameStatut.Options.clock!;
    let formRef = React.createRef<FormInstance>();

    return(
      <>
        <Modal
          visible={this.state.visibleModal}
          title="Set Clock"
          okText="Ok"
          cancelText="Cancel"
          onCancel={() => this.setState({ visibleModal: false })}
          onOk={() => {
            formRef.current!
              .validateFields()
              .then(async values => {
                try {
                  formRef.current!.resetFields();
                  await this.onCreate(values);
                } catch (error) {
                  console.log(error);
                }
              })
              .catch(info => {
                console.log('Validate Failed:', info);
              });
          }}
        >
          <Form
            ref={formRef}
            layout="vertical"
            name="form_in_modal_clock"
            initialValues={{ modifier: 'public' }}
          >
            <Form.Item
              name="minutes"
              label="Minutes"
              initialValue={minutes}
              rules={[{ required: true, message: 'Please input the minutes!' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                step={1} 
              />
            </Form.Item>            
            <Form.Item
              name="seconds"
              label="Seconds"
              initialValue={seconds}
              rules={[{ required: true, message: 'Please input the seconds!' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                step={1} 
              />
            </Form.Item>
          </Form>
        </Modal>

        <span onClick={() => this.setState({ visibleModal: true })} style={{ marginRight: 20, width: 80, display: "inline-block" }}>{minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span>
      </>
    )
  }
}

export { GameClockEditable };
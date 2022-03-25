import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Checkbox } from 'antd';
import { CameraHardware, OBSVideoInput } from '../../Models';
import Webcam from 'react-webcam';
import { IObsRemote } from '..';
const { Option } = Select;

type CameraFormValues = CameraHardware;

type CameraFormProps = {
  loadingForm: boolean;
  initialValues?: CameraHardware;
  visible: boolean;
  onCreate: (values: CameraHardware) => void;
  onCancel: () => void;
  inUseCameras: MediaDeviceInfo['deviceId'][];
  ObsRemote: IObsRemote;
}

const CameraForm: React.FC<CameraFormProps> = ({
  loadingForm,
  initialValues,
  visible,
  onCreate,
  onCancel,
  inUseCameras,
  ObsRemote,
}) => {
  
  let [form] = Form.useForm<CameraFormValues>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [deviceId, setDeviceId] = useState({});
  const [devices, setDevices] = useState<OBSVideoInput[]>([]);
  const [displayCam, setDisplayCam] = useState('');

  const handleDevices = useCallback(
    (mediaDevices: OBSVideoInput[]) =>
      setDevices(mediaDevices.filter(({ itemValue }) => !inUseCameras.includes(itemValue) )),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setDevices]
  );

  useEffect(
    () => {
      async function fetchAvailableCam() {
        // You can await here
        const obsCams = await ObsRemote.getAvailableCameras();
        const webcams = await (await navigator.mediaDevices.enumerateDevices()).filter(device => device.kind === 'videoinput');
        let devices: OBSVideoInput[] = [];
        obsCams.forEach(obscam => {
          let webcam = webcams.find(webc => webc.label === obscam.itemName);
          if(webcam) {
            obscam.itemValue += '|' + webcam.deviceId ;
          }
          devices.push(obscam);
        });
        return devices;
      }
      fetchAvailableCam().then(handleDevices);
      // navigator.mediaDevices.enumerateDevices().then(handleDevices);
    },
    [handleDevices, ObsRemote]
  );

  const handleChange = (value: MediaDeviceInfo['deviceId']) => {
    value === undefined ? setDisplayCam('') : setDisplayCam(value);
  };

  return (
    <Modal
      visible={visible}
      title="Ajouter une nouvelle caméra"
      okText="Ajouter"
      cancelText="Annuler"
      destroyOnClose={true}
      confirmLoading={loadingForm}
      onCancel={() => { form.resetFields(); onCancel(); }}
      // okButtonProps={{
      //   disabled : file.length === 0
      // }}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            // console.log(values)
            form.resetFields();
            onCreate(values as CameraHardware);
          })
          .catch(info => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        preserve={false}
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={initialValues}
      >
        <Form.Item
          key='titleKey'
          name="title"
          label="Nom camera"
          rules={[{ required: true, message: 'Please fill in the name of camera!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          key='deviceidKey'
          name="deviceid"
          label="Camera"
          valuePropName="deviceid"
          rules={[{ required: true, message: 'Please select a camera!' }]}
        >
          <Select 
            onChange={handleChange}
            placeholder="Selectionnez une caméra"
          >
            {devices.map((device: OBSVideoInput, key: number) => (
              <Option key={key + 1} value={device.itemValue}>{ device.itemName || `Device ${key + 1}` }</Option>
            ))}
          </Select>
        </Form.Item>        
        <Form.Item 
          key='activeKey'
          name="active" 
          hidden={true}
        >
          <Checkbox
            checked={false}
          >
          </Checkbox>
        </Form.Item>
        { displayCam !== '' && <Webcam audio={false} width={472} height={266} videoConstraints={{ deviceId: displayCam.split('|')[1], width: { min: 472 }, height: { max: 266 } }} /> }
      </Form>
    </Modal>
  );
};

export { CameraForm };
export type { CameraFormValues }
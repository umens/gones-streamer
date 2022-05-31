import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Checkbox } from 'antd';
import { CameraHardware, OBSInputProps } from '../../Models';
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
  webcams: MediaDeviceInfo[];
  availableCameras: OBSInputProps[];
}

const CameraForm: React.FC<CameraFormProps> = ({
  loadingForm,
  initialValues,
  visible,
  onCreate,
  onCancel,
  inUseCameras,
  ObsRemote,
  webcams,
  availableCameras,
}) => {
  
  let [form] = Form.useForm<CameraFormValues>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [deviceId, setDeviceId] = useState({});
  const [devices, setDevices] = useState<OBSInputProps[]>([]);
  const [displayCam, setDisplayCam] = useState('');

  const handleDevices = useCallback(
    (mediaDevices: OBSInputProps[]) => {
      if(!initialValues || !initialValues!.uuid) {
        setDevices(mediaDevices.filter(({ itemValue }) => !inUseCameras.includes(itemValue) ))
      }
      else {
        setDevices(mediaDevices);
      }
    },
    [setDevices, initialValues, inUseCameras]
  );

  const getWebcamId = (id: string): string => {
    const name = devices.find(item => item.itemValue === id)!.itemName
    const arr = webcams.filter(device => device.kind === 'videoinput');
    return arr.find(item => item['label'].includes(name))?.deviceId!;
  }

  useEffect(
    () => {
      handleDevices(availableCameras);
    },
    [availableCameras, handleDevices]
  );

  const mustActivate = (): boolean => {
    if(ObsRemote.store?.CamerasHardware.length === 0) {
      return true;
    }
    else {
      const arr = ObsRemote.store?.CamerasHardware.filter(val => val.active);
      return arr ? arr.length === 0 : true;
    }
  }

  const handleChange = (value: MediaDeviceInfo['deviceId']) => {
    value === undefined ? setDisplayCam('') : setDisplayCam(getWebcamId(value));
    form.setFieldsValue({active: mustActivate()});
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
          key='uuidKey'
          name="uuid"
          hidden
        >
          <Input />
        </Form.Item>

        <Form.Item
          key='titleKey'
          name="title"
          label="Nom caméra"
          rules={[{ required: true, message: 'Please fill in the name of camera!' }]}
        >
          <Input disabled={initialValues?.title === 'Field'} />
        </Form.Item>

        <Form.Item
          key='deviceidKey'
          name="deviceid"
          label="Camera"
          valuePropName="deviceid"
          rules={[{ required: true, message: 'Please select a camera!' }]}
        >
          <Select
            defaultValue={initialValues?.deviceid}
            onChange={handleChange}
            placeholder="Selectionnez une caméra"
          >
            {devices.map((device: OBSInputProps, key: number) => (
              <Option key={key + 1} value={device.itemValue}>{ device.itemName || `Device ${key + 1}` }</Option>
            ))}
          </Select>
        </Form.Item>        
        <Form.Item 
          key='activeKey'
          name="active" 
          hidden
        >
          <Checkbox
            checked={false}
          >
          </Checkbox>
        </Form.Item>
        { displayCam !== '' && <Webcam audio={false} width={472} height={266} videoConstraints={{ deviceId: displayCam, width: { min: 472 }, height: { max: 266 } }} /> }
      </Form>
    </Modal>
  );
};

export { CameraForm };
export type { CameraFormValues }
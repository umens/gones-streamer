import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { AudioHardware, AudioType, OBSInputProps } from '../../Models';
import { IObsRemote } from '..';
const { Option, OptGroup } = Select;

type AudioFormValues = AudioHardware;

type AudioFormProps = {
  loadingForm: boolean;
  initialValues?: AudioHardware;
  visible: boolean;
  onCreate: (values: AudioHardware) => void;
  onCancel: () => void;
  inUseAudios: MediaDeviceInfo['deviceId'][];
  ObsRemote: IObsRemote;
}

const AudioForm: React.FC<AudioFormProps> = ({
  loadingForm,
  initialValues,
  visible,
  onCreate,
  onCancel,
  inUseAudios,
  ObsRemote,
}) => {
  
  let [form] = Form.useForm<AudioFormValues>();
  const [devices, setDevices] = useState<{ type: AudioType, devices: OBSInputProps[] }[]>([]);

  const handleDevices = useCallback(
    (mediaDevices: { type: AudioType, devices: OBSInputProps[] }[]) => {
      if(!initialValues || !initialValues!.uuid) {
        mediaDevices.forEach((group) => {
          group.devices = group.devices.filter(({ itemValue }) => !inUseAudios.includes(itemValue) )
        });
      }
      setDevices(mediaDevices);
    },
    [setDevices, initialValues, inUseAudios]
  );

  useEffect(
    () => {
      async function fetchAvailableAudio() {
        return await ObsRemote.getAvailableAudios();
      }
      fetchAvailableAudio().then(handleDevices);
    },
    [handleDevices, ObsRemote]
  );

  const handleChange = (value: MediaDeviceInfo['deviceId']) => {
    devices.every(group => {
      if(group.devices.findIndex(item => item.itemValue === value) !== -1){        
        form.setFieldsValue({ type: group.type });
        return false;
      }
      return true;
    });
  };

  return (
    <Modal
      visible={visible}
      title="Ajouter une nouvelle entrée/sortie audio"
      okText="Ajouter"
      cancelText="Annuler"
      destroyOnClose={true}
      confirmLoading={loadingForm}
      onCancel={() => { form.resetFields(); onCancel(); }}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            // console.log(values)
            form.resetFields();
            onCreate(values as AudioHardware);
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
          label="Nom périphérique Audio"
          rules={[{ required: true, message: 'Please fill in the name of the audio device!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          key='deviceidKey'
          name="deviceid"
          label="Audio"
          valuePropName="deviceid"
          rules={[{ required: true, message: 'Please select an audio device!' }]}
        >
          <Select 
            defaultValue={initialValues?.deviceid}
            onChange={handleChange}
            placeholder="Selectionnez une entrée/sortie audio"
          >
            {devices.map((group: { type: string, devices: OBSInputProps[] }, key: number) => (
              <OptGroup label={group.type} key={`optgrp-${key + 1}`}>
                {group.devices.map((device: OBSInputProps, key2: number) => (
                  <Option key={`opt-${key + 1}-${key2 + 1}`} data={{ 'type': group.type }} value={device.itemValue}>{ device.itemName || `Device ${key + 1}${key2 + 1}` }</Option>
                ))}
              </OptGroup>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          key='typeKey'
          name="type"
          hidden
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export { AudioForm };
export type { AudioFormValues }
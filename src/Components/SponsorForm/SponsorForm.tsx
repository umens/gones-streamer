import React, { useState } from 'react';
import { Modal, Form, Input, Upload, Button, Radio } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { MediaType, Sponsor } from '../../Models/Models';
import { RcFile, UploadProps } from 'antd/lib/upload';

type SponsorFormValues = Sponsor & {
  media: RcFile;
}

type SponsorFormProps = {
  initialValues?: Sponsor;
  visible: boolean;
  onCreate: (values: Sponsor) => void;
  onCancel: () => void;
}

const getExtension = (filename: string): string => {
  var parts = filename.split('.');
  return parts[parts.length - 1];
}

const SponsorForm: React.FC<SponsorFormProps> = ({
  initialValues,
  visible,
  onCreate,
  onCancel,
}) => {
  
  const [form] = Form.useForm<SponsorFormValues>();
  const [file, setFile] = useState<RcFile[]>([]);  

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    // showUploadList: {
    //     showDownloadIcon: false,
    // },
    onRemove: file => {
      setFile([]);
    },
    beforeUpload: file => {
      const ext = getExtension(file.path).toLowerCase();
      switch (ext) {
        case 'jpg':
        case 'jpeg':
        case 'gif':
        case 'bmp':
        case 'png':
          //etc
          form.setFieldsValue({ mediaType: MediaType.Image });
          break;
        case 'm4v':
        case 'avi':
        case 'mpg':
        case 'mp4':
        case 'mkv':
        case 'mov':
          //etc
          form.setFieldsValue({ mediaType: MediaType.Video });
          break;
      }
      setFile([file]);
      return false;
    },
    fileList: file
  }

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList && e.fileList[e.fileList.length - 1];
  };

  return (
    <Modal
      visible={visible}
      title="Ajouter un nouveau sponsor"
      okText="Ajouter"
      cancelText="Annuler"
      destroyOnClose={true}
      // afterClose={() => { setFile([]); form.resetFields(); }}
      onCancel={() => { setFile([]); form.resetFields(); onCancel(); }}
      // okButtonProps={{
      //   disabled : file.length === 0
      // }}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            // console.log(values)
            form.resetFields();
            values['media'] = values['media'].originFileObj.path;
            onCreate(values as Sponsor);
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
          key='labelKey'
          name="label"
          label="Nom sponsor"
          rules={[{ required: true, message: 'Please fill in the name of sponsor!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          key='mediaKey'
          name="media"
          label="Media"
          valuePropName="media"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: 'Please add the media file of sponsor!' }]}
        >
          <Upload {...uploadProps} >
            <Button icon={<UploadOutlined />}>
              {file && file[0] && file[0].name ? file[0].name : 'Select File'}
            </Button>
          </Upload>
        </Form.Item>
        <Form.Item 
          key='mediaTypeKey'
          name="mediaType" 
          hidden={true}
          rules={[{ required: true }]}
        >
          <Radio.Group>
            <Radio value={MediaType.Video}>Video</Radio>
            <Radio value={MediaType.Image}>Image</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item 
          key='uuidKey'
          name="uuid" 
          hidden={true}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export { SponsorForm };
export type { SponsorFormValues }
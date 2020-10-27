import React from 'react';
import { Modal, Form, Input, Radio } from 'antd';

type SponsorFormValues = {
  title: string;
  description: string;
  modifier: string;
}

type SponsorFormProps = {
  visible: boolean;
  onCreate: (values: SponsorFormValues) => void;
  onCancel: () => void;
}

const SponsorForm: React.FC<SponsorFormProps> = ({
  visible,
  onCreate,
  onCancel,
}) => {
  const [form] = Form.useForm();
  return (
    <Modal
      visible={visible}
      title="Ajouter un nouveau sponsor"
      okText="Ajouter"
      cancelText="Annuler"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            console.log(values)
            form.resetFields();
            // onCreate(values);
          })
          .catch(info => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{ modifier: 'public' }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please input the title of collection!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input type="textarea" />
        </Form.Item>
        <Form.Item name="modifier" className="collection-create-form_last-form-item">
          <Radio.Group>
            <Radio value="public">Public</Radio>
            <Radio value="private">Private</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export { SponsorForm };
export type { SponsorFormValues }
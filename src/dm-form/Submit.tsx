import React from 'react';
import { Form, Button } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { ButtonType } from 'antd/es/button';

interface anyThing {
  name: string;
  type?: ButtonType;
  [name: string]: any;
}

interface FormProps {}

export default function Submit(props: anyThing & FormProps) {
  if (props.form === undefined) {
    throw Error('此组件需要放在DmForm中');
  }
  const {
    form: { getFieldsError }
  } = (props as any) as FormComponentProps;

  function hasErrors(fieldsError: Record<string, string[] | undefined>) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  return (
    // <Form.Item key={props.name}>
    <Button
      type={props.type || 'primary'}
      htmlType="submit"
      disabled={hasErrors(getFieldsError())}
    >
      Log in
    </Button>
    // </Form.Item>
  );
}

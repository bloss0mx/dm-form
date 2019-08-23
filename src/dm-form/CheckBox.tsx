import React from 'react';
import { Form, Checkbox as CheckboxAntd } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { FormItemProps } from './formChildrenDealer';

interface anyThing {
  name: string;
  label?: string;
  message?: string;
  rules?: Array<Object>;
  extra?: React.ReactElement | string;
  [name: string]: any;
}

export default function Checkbox(props: anyThing & FormItemProps) {
  if (props.form === undefined) {
    throw Error('此组件需要放在DmForm中');
  }
  const {
    form: { getFieldDecorator, getFieldError }
  } = (props as any) as FormComponentProps;
  const { name, rules, label, extra } = props;

  return (
    // <Form.Item
    //   key={name}
    //   validateStatus={getFieldError(name) ? 'error' : ''}
    //   help={getFieldError(name) || ''}
    // >
    //   {
    getFieldDecorator(name, {
      rules
    })(<CheckboxAntd>{label}</CheckboxAntd>) as React.ReactElement
    //   }
    //   {extra}
    // </Form.Item>
  );
}

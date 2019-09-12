import React from 'react';
import { Form, Icon, InputNumber as InputNumberAntd } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { FormItemProps } from './formChildrenDealer';

interface anyThing {
  name: string;
  label?: string;
  message?: string;
  placeholder?: string;
  children?: any;
  // type?: 'email';
  rules?: Array<Object>;
  style?: React.CSSProperties;
  [name: string]: any;
}

export default function InputNumber(props: anyThing & FormItemProps) {
  if (props.form === undefined) {
    throw Error('此组件需要放在DmForm中');
  }
  const {
    form: { getFieldDecorator, getFieldError }
  } = (props as any) as FormComponentProps;
  const {
    name,
    placeholder,
    children,
    rules,
    type,
    label,
    extra,
    disabled
  } = props;

  return (
    <Form.Item
      label={label}
      validateStatus={getFieldError(name) ? 'error' : ''}
      help={getFieldError(name) || ''}
      style={props.style}
    >
      {getFieldDecorator(name, {
        rules: rules
      })(
        children !== undefined ? (
          children
        ) : (
          <InputNumberAntd
            placeholder={placeholder || ''}
            disabled={disabled}
          />
        )
      )}
      {extra}
    </Form.Item>
  );
}

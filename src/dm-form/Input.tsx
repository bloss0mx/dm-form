import React from 'react';
import { Form, Icon, Input as InputAntd } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { FormItemProps } from './formChildrenDealer';

const TYPE_DATA = {
  email: {
    prefix: <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />,
    message: '请输入用户名',
    type: 'text',
    rules: [
      {
        pattern: /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/,
        message: '请输入正确的电子邮箱地址'
      }
    ]
  }
};

interface anyThing {
  name: string;
  label?: string;
  message?: string;
  placeholder?: string;
  children?: any;
  type?: 'email';
  rules?: Array<Object>;
  style?: React.CSSProperties;
  [name: string]: any;
}

export default function Input(props: anyThing & FormItemProps) {
  if (props.form === undefined) {
    throw Error('此组件需要放在DmForm中');
  }
  const {
    form: { getFieldDecorator, getFieldError, getFieldValue }
  } = (props as any) as FormComponentProps;
  const { name, placeholder, children, rules, type, label, onChange } = props;

  return (
    <Form.Item
      label={label}
      validateStatus={getFieldError(name) ? 'error' : ''}
      help={getFieldError(name) || ''}
      style={props.style}
    >
      {getFieldDecorator(name, {
        rules: (type && TYPE_DATA[type].rules) || rules
      })(
        children !== undefined ? (
          children
        ) : (
          <InputAntd
            onChange={e => {
              e.preventDefault();
              e.stopPropagation();
              setImmediate(() => {
                onChange && onChange(name, getFieldValue(name));
              });
            }}
            type="text"
            placeholder={placeholder || ''}
          />
        )
      )}
    </Form.Item>
  );
}

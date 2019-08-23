import React from 'react';
import { Form, Icon, Input } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { FormItemProps } from './formChildrenDealer';

const TYPE_DATA = {
  username: {
    prefix: <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />,
    message: '请输入用户名',
    label: '用户名',
    type: 'text'
  },
  password: {
    prefix: <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />,
    message: '请输入密码',
    label: '密码',
    type: 'password'
  }
};

interface anyThing {
  name: string;
  message?: string;
  placeholder?: string;
  children?: any;
  type: 'username' | 'password';
  label?: string;
  rules?: Array<Object>;
  [name: string]: any;
}

export default function Login(props: anyThing & FormItemProps) {
  if (props.form === undefined) {
    throw Error('此组件需要放在DmForm中');
  }
  const {
    form: { getFieldDecorator, getFieldError, isFieldTouched }
  } = (props as any) as FormComponentProps;
  const { name, placeholder, children, rules, type, label, message } = props;

  return (
    // <Form.Item
    //   label={label ? label : type && TYPE_DATA[type] && TYPE_DATA[type].label}
    //   validateStatus={
    //     isFieldTouched(name) && getFieldError(name) ? 'error' : ''
    //   }
    //   help={(isFieldTouched(name) && getFieldError(name)) || ''}
    // >
    //   {
    getFieldDecorator(name, {
      rules: [
        { required: true, message: message || TYPE_DATA[type].message },
        ...((rules && rules) || [])
      ]
    })(
      children !== undefined ? (
        children
      ) : (
        <Input
          type={TYPE_DATA[type].type}
          prefix={TYPE_DATA[type].prefix}
          placeholder={placeholder || ''}
        />
      )
    ) as React.ReactElement
    //   }
    // </Form.Item>
  );
}

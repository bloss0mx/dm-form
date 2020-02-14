import React from 'react';
import { Form, Button } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { ButtonType } from 'antd/es/button';
import { FormItemProps } from './formChildrenDealer';
import Base, { props } from './Base';

interface anyThing extends FormItemProps {
  name: string;
  type?: ButtonType;
  text?: string;
  [name: string]: any;
}

interface FormProps {}

export function Submit(props: anyThing & FormProps) {
  if (props.form === undefined) {
    throw Error('此组件需要放在DmForm中');
  }
  const {
    form: { getFieldsError },
  } = (props as any) as FormComponentProps;
  const { name, rules, label, extra, children, style, text } = props;

  function hasErrors(fieldsError: Record<string, string[] | undefined>) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  return (
    <Form.Item key={props.name} style={style}>
      <Button
        type={props.type || 'primary'}
        htmlType="submit"
        disabled={hasErrors(getFieldsError())}
      >
        {text ? text : 'Log in'}
      </Button>
    </Form.Item>
  );
}

export default function Input(props: props & anyThing) {
  const {
    form: { getFieldError, getFieldsError },
  } = (props as any) as FormComponentProps;
  const { type, rules, placeholder, text } = props;
  function hasErrors(fieldsError: Record<string, string[] | undefined>) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }
  const _props = {
    ...props,
    // validateStatus: (getFieldError(props.name) ? 'error' : undefined) as any,
    help: getFieldError(props.name) || '',
    type: type || 'primary',
    style: props.style,
    children: text || 'Log In',
    TargetComponent: Button,
    htmlType: 'submit',
    disabled: hasErrors(getFieldsError()),
  };
  return <Base {..._props} />;
}

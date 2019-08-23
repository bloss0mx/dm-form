import React from 'react';
import { Form } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { FormItemProps, componentFormBind } from './formChildrenDealer';

interface anyThing {
  name: string;
  label?: string;
  message?: string;
  rules?: Array<Object>;
  style?: React.CSSProperties;
  component: React.ReactElement;
  // component: (
  //   props: FormComponentProps
  // ) => React.ReactElement;
  [name: string]: any;
}

export default function Input(props: anyThing & FormItemProps) {
  if (props.form === undefined) {
    throw Error('此组件需要放在DmForm中');
  }
  const {
    form: { getFieldDecorator, getFieldError }
  } = (props as any) as FormComponentProps;
  const { name, rules, label, style, component } = props;

  // const _c = React.cloneElement(component, {
  //   prefix: React.cloneElement(component.props.prefix, {
  //     form: props.form
  //   })
  // });

  return (
    <Form.Item
      label={label}
      validateStatus={getFieldError(name) ? 'error' : ''}
      help={getFieldError(name) || ''}
      style={style}
    >
      {getFieldDecorator(name, {
        rules: rules
      })(componentFormBind(component, props.form))}
    </Form.Item>
  );
}

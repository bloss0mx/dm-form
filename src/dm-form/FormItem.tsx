import React from 'react';
import { Form } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { content, FormProps, value } from './formChildrenDealer';

interface anyThing {
  style?: React.CSSProperties;
  [name: string]: any;
}

export default function FormItem<T, P>(
  props: FormProps<T> &
    FormComponentProps &
    React.PropsWithChildren<P> &
    anyThing
) {
  return <Form.Item style={props.style}>{content({ ...props })}</Form.Item>;
}

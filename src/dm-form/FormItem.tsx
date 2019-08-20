import React from 'react';
import { Form } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { content, FormProps } from './formChildrenDealer';

interface anyThing {
  label: string;
  style?: React.CSSProperties;
  [name: string]: any;
}

export default function FormItem<T, P>(
  props: FormProps<T> &
    // FormComponentProps &
    React.PropsWithChildren<P> &
    anyThing
) {
  return (
    <Form.Item label={props.label} style={props.style}>
      {content({
        ...(props as FormProps<T> &
          FormComponentProps &
          React.PropsWithChildren<P> &
          anyThing)
      })}
    </Form.Item>
  );
}

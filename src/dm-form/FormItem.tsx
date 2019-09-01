import React from "react";
import { Form } from "antd";
import { FormComponentProps } from "antd/es/form";
import { FormProps as FormPropsAntd } from "antd/es/form/Form";
import { content, FormProps } from "./formChildrenDealer";

interface anyThing extends FormPropsAntd {
  label: string;
  style?: React.CSSProperties;
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

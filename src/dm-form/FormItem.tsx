import React from "react";
import { Form } from "antd";
import { FormComponentProps } from "antd/es/form";
import { content, FormProps } from "./formChildrenDealer";

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
  const { children, form, ...other } = props;
  // const childrenProps = (children as any).props;
  console.warn("222a", children, other);
  return (
    <Form.Item {...other}>
      {
        content({
          ...({ form, children } as FormProps<T> &
            FormComponentProps &
            React.PropsWithChildren<P> &
            anyThing)
        }) as React.ReactElement
        // React.cloneElement(children as React.ReactElement, {
        //   ...other,
        //   ...childrenProps
        // })
      }
    </Form.Item>
  );
}

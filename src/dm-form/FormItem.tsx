import React from "react";
import { Form } from "antd";
import { FormComponentProps } from "antd/es/form";
import { FormProps as FormPropsAntd } from "antd/es/form/Form";
import { content, FormProps } from "./formChildrenDealer";
import { T } from "antd/lib/upload/utils";

interface anyThing extends FormPropsAntd {
  label: string;
  style?: React.CSSProperties;
}

export default class FormItem<T, P> extends React.PureComponent<
  FormProps<T> &
    // FormComponentProps &
    React.PropsWithChildren<P> &
    anyThing
> {
  constructor(
    props: FormProps<T> &
      // FormComponentProps &
      React.PropsWithChildren<P> &
      anyThing
  ) {
    super(props);
  }

  render() {
    return (
      <Form.Item label={this.props.label} style={this.props.style}>
        {content({
          ...(this.props as FormProps<T> &
            FormComponentProps &
            React.PropsWithChildren<P> &
            anyThing)
        })}
      </Form.Item>
    );
  }
}

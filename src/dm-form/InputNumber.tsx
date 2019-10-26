import React from "react";
import { Form, Icon, InputNumber as InputNumberAntd } from "antd";
import { FormComponentProps } from "antd/es/form";
import { FormItemProps } from "./formChildrenDealer";

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

export default class InputNumber extends React.Component<
  anyThing & FormItemProps
> {
  constructor(props: anyThing & FormItemProps) {
    super(props);
  }
  render() {
    if (this.props.form === undefined) {
      throw Error("此组件需要放在DmForm中");
    }
    const {
      form: { getFieldDecorator, getFieldError }
    } = (this.props as any) as FormComponentProps;
    const { name, placeholder, children, rules, type, label } = this.props;

    return (
      <Form.Item
        label={label}
        validateStatus={getFieldError(name) ? "error" : ""}
        help={getFieldError(name) || ""}
        style={this.props.style}
      >
        {getFieldDecorator(name, {
          rules: rules
        })(
          children !== undefined ? (
            children
          ) : (
            <InputNumberAntd placeholder={placeholder || ""} />
          )
        )}
      </Form.Item>
    );
  }
}

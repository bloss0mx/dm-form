import React from "react";
import { Form, Checkbox as CheckboxAntd } from "antd";
import { FormComponentProps } from "antd/es/form";
import { FormItemProps } from "./formChildrenDealer";

type CheckBoxOption = {
  name: any;
  value: string;
};

interface anyThing extends FormItemProps {
  name: string;
  label?: string;
  message?: string;
  rules?: Array<Object>;
  // extra?: React.ReactElement | string;
  options: Array<CheckBoxOption>;
  [name: string]: any;
}

export default class Checkbox extends React.PureComponent<
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
    const { name, rules, label, extra } = this.props;

    return (
      <Form.Item
        key={name}
        validateStatus={getFieldError(name) ? "error" : ""}
        help={getFieldError(name) || ""}
      >
        {getFieldDecorator(name, {
          rules
        })(<CheckboxAntd>{label}</CheckboxAntd>)}
        {extra}
      </Form.Item>
    );
  }
}

import React from "react";
import { Form, Button } from "antd";
import { FormComponentProps } from "antd/es/form";
import { ButtonType } from "antd/es/button";
import { anyThing } from './Base';

// interface anyThing extends FormItemProps {
//   name: string;
//   type?: ButtonType;
//   text?: string;
//   [name: string]: any;
// }

interface FormProps {}

export default class Submit extends React.Component<anyThing & FormProps> {
  constructor(props: anyThing & FormProps) {
    super(props);
  }
  render() {
    if (this.props.form === undefined) {
      throw Error("此组件需要放在DmForm中");
    }
    const {
      form: { getFieldsError }
    } = (this.props as any) as FormComponentProps;

    function hasErrors(fieldsError: Record<string, string[] | undefined>) {
      return Object.keys(fieldsError).some(field => fieldsError[field]);
    }

    return (
      <Form.Item key={this.props.name}>
        <Button
          type={this.props.type || "primary"}
          htmlType="submit"
          disabled={hasErrors(getFieldsError())}
        >
          Log in
        </Button>
      </Form.Item>
    );
  }
}

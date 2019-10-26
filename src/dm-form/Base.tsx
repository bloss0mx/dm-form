import React from "react";
import { Form, Icon, Input as InputAntd } from "antd";
import { FormComponentProps } from "antd/es/form";
import { FormItemProps } from "antd/es/form/FormItem";

// // antd的formitem定义
// interface FormItemProps {
//   prefixCls?: string;
//   className?: string;
//   id?: string;
//   htmlFor?: string;
//   label?: React.ReactNode;
//   labelAlign?: FormLabelAlign;
//   labelCol?: ColProps;
//   wrapperCol?: ColProps;
//   help?: React.ReactNode;
//   extra?: React.ReactNode;
//   validateStatus?: (typeof ValidateStatuses)[number];
//   hasFeedback?: boolean;
//   required?: boolean;
//   style?: React.CSSProperties;
//   colon?: boolean;
// }

/**
 * 属于formitem的传给item，其他传给被包裹的组件。
 * 到底需不需要多余的值呢？
 */
export interface anyThing extends FormItemProps {
  name: string;
  [name: string]: any;
}

class Base extends React.Component<anyThing> {
  constructor(props: anyThing) {
    super(props);
  }

  render() {
    if (this.props.form === undefined) {
      throw Error("此组件需要放在DmForm中");
    }
    const {
      form: { getFieldDecorator, getFieldError }
    } = (this.props as any) as FormComponentProps;
    const { name, placeholder, children, rules, type } = this.props;
    const {
      prefixCls,
      className,
      id,
      htmlFor,
      label,
      labelAlign,
      labelCol,
      wrapperCol,
      help,
      extra,
      validateStatus,
      hasFeedback,
      required,
      style,
      colon
    } = this.props;

    return (
      <Form.Item
        {...{
          prefixCls,
          className,
          id,
          htmlFor,
          label,
          labelAlign,
          labelCol,
          wrapperCol,
          help: getFieldError(name) || "",
          extra,
          validateStatus: getFieldError(name) ? "error" : "",
          hasFeedback,
          required,
          style,
          colon
        }}
      >
        {getFieldDecorator(name, {
          rules: rules
        })(
          children !== undefined ? (
            children
          ) : (
            <InputAntd type="text" placeholder={placeholder || ""} />
          )
        )}
      </Form.Item>
    );
  }
}

export default Base;

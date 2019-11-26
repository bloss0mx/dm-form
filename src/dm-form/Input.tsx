import React, { Component, useMemo, useEffect } from 'react';
import { Form, Icon, Input as InputAntd } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { FormItemProps } from './formChildrenDealer';
import Base, { anyThing, props } from './Base';

const TYPE_DATA = {
  email: {
    prefix: <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />,
    message: '请输入用户名',
    type: 'text',
    rules: [
      {
        pattern: /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/,
        message: '请输入正确的电子邮箱地址',
      },
    ],
  },
};

// interface anyThing {
//   name: string;
//   label?: string;
//   message?: string;
//   placeholder?: string;
//   children?: any;
//   type?: "email";
//   rules?: Array<Object>;
//   style?: React.CSSProperties;
//   [name: string]: any;
// }

// export default function Input(props: anyThing & FormItemProps) {
//   if (props.form === undefined) {
//     throw Error("此组件需要放在DmForm中");
//   }
//   const {
//     form: { getFieldDecorator, getFieldError }
//   } = (props as any) as FormComponentProps;
//   const { name, placeholder, children, rules, type, label } = props;

//   return (
//     <Form.Item
//       label={label}
//       validateStatus={getFieldError(name) ? "error" : ""}
//       help={getFieldError(name) || ""}
//       style={props.style}
//     >
//       {getFieldDecorator(name, {
//         rules: (type && TYPE_DATA[type].rules) || rules
//       })(
//         children !== undefined ? (
//           children
//         ) : (
//           <InputAntd type="text" placeholder={placeholder || ""} />
//         )
//       )}
//     </Form.Item>
//   );
// }

interface input {
  placeholder?: string;
  type?: 'email';
}

export default function Input(props: props & input) {
  const {
    form: { getFieldError },
  } = (props as any) as FormComponentProps;
  const { type, rules, placeholder } = props;
  const _props = {
    ...props,
    validateStatus: (getFieldError(props.name) ? 'error' : undefined) as any,
    help: getFieldError(props.name) || '',
    style: props.style,
    rules: (type && TYPE_DATA[type].rules) || rules,
    placeholder,
    TargetComponent: InputAntd,
  };
  return <Base {..._props} />;
}

// export default class Input extends Component<props & input> {
//   constructor(props: props & input) {
//     super(props);
//   }

//   // shouldComponentUpdate(nextProps: props & input) {
//   //   console.log(this.props);
//   //   if (
//   //     nextProps.form.getFieldValue(nextProps.name) !==
//   //     this.props.form.getFieldValue(this.props.name)
//   //   )
//   //     return true;
//   //   return false;
//   // }

//   render() {
//     const {
//       form: { getFieldError }
//     } = (this.props as any) as FormComponentProps;
//     const { type, rules, placeholder } = this.props;
//     const _props = {
//       ...this.props,
//       validateStatus: (getFieldError(this.props.name)
//         ? "error"
//         : undefined) as any,
//       help: getFieldError(this.props.name) || "",
//       style: this.props.style,
//       rules: (type && TYPE_DATA[type].rules) || rules,
//       placeholder,
//       TargetComponent: InputAntd
//     };
//     return <Base {..._props} />;
//   }
// }

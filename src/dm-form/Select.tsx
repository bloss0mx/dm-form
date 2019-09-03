import React from 'react';
import { Form, Checkbox as CheckboxAntd, Select as SelectAntd } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { FormItemProps } from './formChildrenDealer';

interface anyThing {
  name: string;
  label?: string;
  rules?: Array<Object>;
  children: any;
  style?: React.CSSProperties;
  [name: string]: any;
}

// export default function Checkbox(props: anyThing & FormItemProps) {
//   if (props.form === undefined) {
//     throw Error('此组件需要放在DmForm中');
//   }
//   const {
//     form: { getFieldDecorator, getFieldError },
//   } = (props as any) as FormComponentProps;
//   const { name, rules, label, extra, children, style } = props;

//   return (
//     <Form.Item
//       label={label}
//       validateStatus={getFieldError(name) ? 'error' : ''}
//       help={getFieldError(name) || ''}
//       style={style}
//     >
//       {
//         getFieldDecorator(name, {
//           rules,
//         })(<SelectAntd>{children}</SelectAntd>) as any
//       }
//       {extra}
//     </Form.Item>
//   );
// }

// // export const Option = SelectAntd.Option;

export default class Checkbox extends React.Component<
  anyThing & FormItemProps
> {
  static Option = SelectAntd.Option;
  constructor(props) {
    super(props);
    if (props.form === undefined) {
      throw Error('此组件需要放在DmForm中');
    }
  }
  render() {
    const {
      form: { getFieldDecorator, getFieldError },
    } = (this.props as any) as FormComponentProps;
    const { name, rules, label, extra, children, style } = this.props;

    return (
      <Form.Item
        label={label}
        validateStatus={getFieldError(name) ? 'error' : ''}
        help={getFieldError(name) || ''}
        style={style}
      >
        {
          getFieldDecorator(name, {
            rules,
          })(<SelectAntd>{children}</SelectAntd>) as any
        }
        {extra}
      </Form.Item>
    );
  }
}

export const Option = SelectAntd.Option;

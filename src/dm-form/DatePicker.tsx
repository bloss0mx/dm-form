import React, { useMemo } from 'react';
import { Form, DatePicker as DatePickerAntd } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { FormItemProps } from './formChildrenDealer';
import Base, { anyThing, props } from './Base';

const TYPE_DATA = {
  DatePicker: {
    format: 'YYYY-MM-DD',
    rules: [],
  },
  MonthPicker: {
    format: 'YYYY-MM-DD',
    rules: [],
  },
  WeekPicker: {
    format: 'YYYY-MM-DD',
    rules: [],
  },
  RangePicker: {
    format: 'YYYY-MM-DD',
    rules: [],
  },
};

// interface anyThing extends FormItemProps {
//   name: string;
//   label?: string;
//   message?: string;
//   placeholder?: string;
//   children?: any;
//   type?: "DatePicker" | "MonthPicker" | "WeekPicker" | "RangePicker";
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
//   const {
//     name,
//     placeholder,
//     children,
//     rules,
//     type = "DatePicker",
//     label,
//     extra
//   } = props;

//   const DatePicker = (DatePickerAntd as any)[type];

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
//           <DatePicker placeholder={placeholder || ""} />
//         )
//       )}
//       {extra}
//     </Form.Item>
//   );
// }

interface datePicker {
  placeholder?: string;
  type?: 'DatePicker' | 'MonthPicker' | 'WeekPicker' | 'RangePicker';
}

export default function DatePicker(props: props & datePicker) {
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
    TargetComponent:
      type !== undefined ? (DatePickerAntd as any)[type] : DatePickerAntd,
  };
  return <Base {..._props} />;
}

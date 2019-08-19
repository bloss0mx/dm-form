import React from 'react';
import {
  Form,
  Icon,
  Input as InputAntd,
  DatePicker as DatePickerAntd
} from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { FormItemProps } from './formChildrenDealer';

const TYPE_DATA = {
  DatePicker: {
    format: 'YYYY-MM-DD',
    rules: []
  },
  MonthPicker: {
    format: 'YYYY-MM-DD',
    rules: []
  },
  WeekPicker: {
    format: 'YYYY-MM-DD',
    rules: []
  },
  RangePicker: {
    format: 'YYYY-MM-DD',
    rules: []
  }
};

interface anyThing {
  name: string;
  label?: string;
  message?: string;
  placeholder?: string;
  children?: any;
  type?: 'DatePicker' | 'MonthPicker' | 'WeekPicker' | 'RangePicker';
  rules?: Array<Object>;
  style?: React.CSSProperties;
  [name: string]: any;
}

export default function Input(props: anyThing & FormItemProps) {
  if (props.form === undefined) {
    throw Error('此组件需要放在DmForm中');
  }
  const {
    form: { getFieldDecorator, getFieldError, getFieldValue }
  } = (props as any) as FormComponentProps;
  const {
    name,
    placeholder,
    children,
    rules,
    type = 'DatePicker',
    label
  } = props;

  const DatePicker = (DatePickerAntd as any)[type];

  return (
    <Form.Item
      label={label}
      validateStatus={getFieldError(name) ? 'error' : ''}
      help={getFieldError(name) || ''}
      style={props.style}
    >
      {getFieldDecorator(name, {
        rules: (type && TYPE_DATA[type].rules) || rules
      })(
        children !== undefined ? (
          children
        ) : (
          <DatePicker placeholder={placeholder || ''} />
        )
      )}
    </Form.Item>
  );
}

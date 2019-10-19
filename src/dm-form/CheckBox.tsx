import React from 'react';
import { Form, Checkbox as CheckboxAntd } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { FormItemProps } from './formChildrenDealer';

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

export default function Checkbox(props: anyThing & FormItemProps) {
  if (props.form === undefined) {
    throw Error('此组件需要放在DmForm中');
  }
  const {
    form: { getFieldDecorator, getFieldError },
  } = (props as any) as FormComponentProps;
  const { name, rules, label, extra, style, options } = props;

  // return (
  //   <Form.Item
  //     key={name}
  //     validateStatus={getFieldError(name) ? 'error' : ''}
  //     help={getFieldError(name) || ''}
  //     style={style}
  //   >
  //     {getFieldDecorator(name, {
  //       rules,
  //     })(<CheckboxAntd>{label}</CheckboxAntd>)}
  //     {extra}
  //   </Form.Item>
  // );
  return (
    <Form.Item
      key={name}
      validateStatus={getFieldError(name) ? 'error' : ''}
      help={getFieldError(name) || ''}
      style={style}
    >
      {getFieldDecorator(name, {
        rules,
      })(
        <CheckboxAntd.Group>
          {options.map(item => (
            <CheckboxAntd key={item.value} value={item.value}>
              {item.name}
            </CheckboxAntd>
          ))}
        </CheckboxAntd.Group>
      )}
      {extra}
    </Form.Item>
  );
}

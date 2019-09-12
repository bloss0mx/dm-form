import React from 'react';
import { Form, Checkbox as CheckboxAntd, Radio as RadioAntd } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { RadioGroupProps } from 'antd/es/radio';
import { FormItemProps } from './formChildrenDealer';

type RadioOption = {
  name: any;
  value: string;
};

interface anyThing {
  name: string;
  label?: string;
  rules?: Array<Object>;
  options: Array<RadioOption>;
  style?: React.CSSProperties;
  [name: string]: any;
}

export default function Radio(props: anyThing & FormItemProps) {
  if (props.form === undefined) {
    throw Error('此组件需要放在DmForm中');
  }
  const {
    form: { getFieldDecorator, getFieldError }
  } = (props as any) as FormComponentProps;
  const {
    name,
    rules,
    label,
    extra,
    children,
    style,
    options,
    disabled
  } = props;

  return (
    <Form.Item
      label={label}
      validateStatus={getFieldError(name) ? 'error' : ''}
      help={getFieldError(name) || ''}
      style={style}
    >
      {
        getFieldDecorator(name, {
          rules
        })(
          <RadioAntd.Group disabled={disabled}>
            {options.map(item => (
              <RadioAntd key={item.value} value={item.value}>
                {item.name}
              </RadioAntd>
            ))}
          </RadioAntd.Group>
        ) as React.ReactElement
      }
      {/* //   {extra} */}
    </Form.Item>
  );
}

import React, { useEffect } from 'react';
import { Form } from 'antd';
import { FormComponentProps, FormCreateOption } from 'antd/es/form';
import { content } from './formChildrenDealer';
import { FormProps, value } from './formChildrenDealer';

interface FormOnly<T> {
  onSubmit: (values: T) => value;
}

/**
 * 表单工厂
 * @param InitialForm 初始化表单
 * @param actions 事件
 */
export default function DmFormFactory<T>(
  // InitialForm?: T,
  actions?: FormProps<T> & FormOnly<T>
  // FormCreateOption?: FormCreateOption<any>
) {
  function DmForm<P>(
    props: FormProps<T> & FormComponentProps & React.PropsWithChildren<P>
  ) {
    const {
      form: { setFieldsValue, validateFields },
    } = props;

    // useEffect(() => {
    //   setFieldsValue(InitialForm || {});
    // }, [setFieldsValue]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      validateFields((err: string, values: T) => {
        if (!err) {
          if (actions) actions.onSubmit(values);
        }
      });
    }

    return (
      <Form
        labelCol={{
          xs: { span: 24 },
          sm: { span: 6 },
        }}
        wrapperCol={{
          xs: { span: 24 },
          sm: { span: 18 },
        }}
        onSubmit={handleSubmit}
      >
        {content({ ...{ form: props.form, children: props.children } })}
      </Form>
    );
  }

  return Form.create({
    name: 'global_state',
    onFieldsChange(props: any, changedFields: any) {
      (props as any).onChange(changedFields);
    },
    mapPropsToFields(props: any) {
      const t: any = {};
      for (const i in props) {
        if (props.hasOwnProperty(i) && i !== 'children') {
          t[i] = Form.createFormField({ ...props[i] });
        }
      }
      return t;
    },
    onValuesChange(_: any, values: any) {
      // console.log(values);
    },
  })(DmForm);
}

type Name<T> = { [P in keyof T]: P }[keyof T];
type FieldToState2<T> = {
  [P in Name<T>]: T[P] extends Array<any>
    ? Array<FieldToState2<T[P]>>
    : {
        value: T[P];
      };
};
type fieldIniter = <T>(field: T) => FieldToState2<T>;

export const fieldIniter: fieldIniter = state => {
  let _state;
  if ((state as any).constructor === Array) {
    _state = [] as any;
  } else {
    _state = {} as any;
  }
  for (const name in state) {
    if ((state[name] as any).constructor === Array) {
      _state[name] = fieldIniter(state[name]);
    } else if ((state as Object).hasOwnProperty(name)) {
      if ((state[name] as any).constructor !== Array) {
        _state[name] = { value: state[name] };
      }
    }
  }
  return _state;
};

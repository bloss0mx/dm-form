import React, { useEffect } from 'react';
import { Form } from 'antd';
import { FormComponentProps } from 'antd/es/form';
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
  InitialForm?: T,
  actions?: FormProps<T> & FormOnly<T>
) {
  function DmForm<P>(
    props: FormProps<T> & FormComponentProps & React.PropsWithChildren<P>
  ) {
    const {
      form: { setFieldsValue, validateFields, getFieldsValue }
    } = props;

    useEffect(() => {
      setFieldsValue(InitialForm || {});
    }, [setFieldsValue]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      validateFields((err: string, values: T) => {
        if (!err) {
          if (actions) actions.onSubmit(values);
        }
      });
    }

    function onChange(name: string, value: any) {
      if (actions && actions.onChange) {
        setImmediate(() => {
          if (typeof actions.onChange === 'function') {
            const allValues = getFieldsValue();
            actions.onChange(name, value, allValues as T);
          }
        });
      }
    }

    return (
      <Form
        labelCol={{
          xs: { span: 24 },
          sm: { span: 8 }
        }}
        wrapperCol={{
          xs: { span: 24 },
          sm: { span: 16 }
        }}
        onSubmit={handleSubmit}
      >
        {content({ ...props, onChange })}
      </Form>
    );
  }

  return Form.create()(DmForm);
}

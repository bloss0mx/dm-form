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
  InitialForm?: T,
  actions?: FormProps<T> & FormOnly<T>,
  FormCreateOption?: FormCreateOption<any>
) {
  function DmForm<P>(
    props: FormProps<T> & FormComponentProps & React.PropsWithChildren<P>
  ) {
    const {
      form: { setFieldsValue, validateFields }
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

    return (
      <Form
        labelCol={{
          xs: { span: 24 },
          sm: { span: 4 }
        }}
        wrapperCol={{
          xs: { span: 24 },
          sm: { span: 20 }
        }}
        onSubmit={handleSubmit}
      >
        {content({ ...{ form: props.form, children: props.children } })}
      </Form>
    );
  }

  return Form.create(FormCreateOption)(DmForm);
}

import React, { useMemo } from "react";
import { Form, Icon, Input as InputAntd } from "antd";
import { FormComponentProps } from "antd/es/form";
import { FormItemProps } from "./formChildrenDealer";
import { GetFieldDecoratorOptions } from "antd/es/form/Form";

type Base = (props: anyThing & FormItemProps & React.Component) => any;

export interface anyThing {
  name: string;
  form?: any;
}

interface base {
  TargetComponent: any;
}

export type props = anyThing & FormItemProps & GetFieldDecoratorOptions;

export default function Base(props: props & base) {
  if (props.form === undefined) {
    throw Error("此组件需要放在DmForm中");
  }
  const {
    form: { getFieldDecorator }
  } = (props as any) as FormComponentProps;
  const { name, TargetComponent } = props;
  const { _formItem, _getFieldDecorator, _form, _other } = useMemo(
    () => splitProps(props),
    [props]
  );
  return (
    <Form.Item {..._formItem} {..._form}>
      {getFieldDecorator(name, _getFieldDecorator)(<TargetComponent {..._other} />)}
    </Form.Item>
  );
}

function splitProps(
  props: anyThing & FormItemProps & GetFieldDecoratorOptions
) {
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
    colon,
    valuePropName,
    initialValue,
    trigger,
    getValueFromEvent,
    getValueProps,
    validateTrigger,
    rules,
    exclusive,
    normalize,
    validateFirst,
    preserve,
    form,
    ...other
  } = props;
  const _formItem: FormItemProps = {
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
  };
  const _getFieldDecorator: GetFieldDecoratorOptions = {
    valuePropName,
    initialValue,
    trigger,
    getValueFromEvent,
    getValueProps,
    validateTrigger,
    rules,
    exclusive,
    normalize,
    validateFirst,
    preserve
  };
  return {
    _form: deleteUndefined(form),
    _formItem: deleteUndefined(_formItem),
    _getFieldDecorator: deleteUndefined(_getFieldDecorator),
    _other: deleteUndefined(other)
  };
}

function deleteUndefined<T>(obj: T): T {
  const newObj = {} as any;
  const keys = Object.keys(obj);
  keys.forEach(item => {
    if ((obj as any)[item] !== undefined) {
      newObj[item] = (obj as any)[item];
    }
  });
  return newObj;
}

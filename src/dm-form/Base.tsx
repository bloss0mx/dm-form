import React, { useMemo } from 'react';
import { Form, Icon, Input as InputAntd } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { FormItemProps } from './formChildrenDealer';
import { GetFieldDecoratorOptions } from 'antd/es/form/Form';
import { start, pause, end } from './tools';

type Base = (props: anyThing & FormItemProps & React.Component) => any;

export interface anyThing {
  name: string;
  form?: any;
  forceStop?: boolean;
  forceRender?: boolean;
}

interface base {
  TargetComponent: any;
  formData?: any;
}

export type props = anyThing & FormItemProps & GetFieldDecoratorOptions;

// export function Base(props: props & base) {
//   if (props.form === undefined) {
//     throw Error('此组件需要放在DmForm中');
//   }
//   const {
//     form: { getFieldDecorator },
//   } = (props as any) as FormComponentProps;
//   const { TargetComponent, ...other } = props;
//   const { name } = props;
//   const { _formItem, _getFieldDecorator, _form, _other } = useMemo(
//     () => splitProps(other),
//     [props]
//   );
//   return (
//     <Form.Item {..._formItem} {..._form}>
//       {getFieldDecorator(
//         name,
//         _getFieldDecorator
//       )(<TargetComponent {..._other} />)}
//     </Form.Item>
//   );
// }

export default class BBase extends React.Component<
  props & base,
  { val: any; err: any; touched: any }
> {
  constructor(props: props & base) {
    super(props);
    this.state = { val: undefined, err: undefined, touched: undefined };
  }

  shouldComponentUpdate(nextProps: props & base) {
    const labelShould = 'should';
    start(labelShould);
    if (nextProps.forceRender === true) return true;
    const {
      form: { getFieldError, isFieldTouched },
      name,
      formData,
    } = nextProps;
    const { val, err, touched } = this.state;
    start('get val');
    const _val = formData && formData[name] && formData[name]['value'];
    pause('get val');
    start('get error');
    const _err = getFieldError(name);
    pause('get error');
    start('get touched');
    const _touched = isFieldTouched(name);
    pause('get touched');
    if (val !== _val || err !== _err || touched !== _touched) {
      this.setState({ val: _val, err: _err, touched: _touched });
      pause(labelShould);
      return true;
    }
    if (nextProps.forceStop === true) {
      pause(labelShould);
      return false;
    }
    if (this.props !== nextProps) {
      var { form, ...left } = this.props;
      var { form, ...right } = this.props;
      start('compare');
      const compared = compare(left, right);
      pause('compare');
      if (compared) {
        // console.log('refreash');
        pause(labelShould);
        return true;
      }
    }
    pause(labelShould);
    return false;
  }

  render() {
    if (this.props.form === undefined) throw Error('此组件需要放在DmForm中');
    const {
      form: { getFieldDecorator },
    } = (this.props as any) as FormComponentProps;
    const { TargetComponent, formData, ...other } = this.props;
    const { name } = this.props;
    const { _formItem, _getFieldDecorator, _form, _other } = splitProps(
      other as any
    );

    return (
      <Form.Item {..._formItem} {..._form}>
        {getFieldDecorator(
          name as never,
          _getFieldDecorator
        )(<TargetComponent {..._other} />)}
      </Form.Item>
    );
  }
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
    colon,
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
    preserve,
  };
  return {
    _form: deleteUndefined(form),
    _formItem: deleteUndefined(_formItem),
    _getFieldDecorator: deleteUndefined(_getFieldDecorator),
    _other: deleteUndefined(other),
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

function compare(left: any, right: any) {
  if (typeof left === typeof right) {
    if (left === undefined || left === null) return false;
  } else return true;
  if (left.constructor !== right.constructor) return true;
  if (left.constructor !== Array && left.constructor !== Object) {
    if (left !== right) {
      console.log(left, right);
      return true;
    }
    return false;
  }
  const lKey = Object.keys(left);
  const rKey = Object.keys(right);
  if (lKey.length !== rKey.length) return true;
  const setTest = new Set([...lKey, ...rKey]);
  if (setTest.size !== lKey.length || setTest.size !== rKey.length) return true;
  for (let i = 0; i < lKey.length; i++) {
    if (compare(left[lKey[i]], right[rKey[i]])) {
      console.log(left[lKey[i]], right[rKey[i]], i);
      return true;
    }
  }
  return false;
}

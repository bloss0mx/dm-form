import React, { isValidElement, PropsWithChildren } from 'react';
import { FormComponentProps } from 'antd/es/form';
import { FormItemProps } from 'antd/es/form/FormItem';
import { Form, Icon, Input as InputAntd } from 'antd';
import Input from './Input';

export type value = any;
export interface FormProps<T> {}
export type FormItemProps = FormItemProps;

function injectProps<T>(
  _children: React.ReactElement,
  formComponentProps: FormComponentProps,
  key: number
): React.ReactElement {
  const { children } = _children.props;

  return React.cloneElement(
    _children,
    {
      key,
      form: formComponentProps.form
    },
    children ? content({ form: formComponentProps.form, children }) : undefined
  );
}

export function content<T, P>(
  props: FormProps<T> & FormComponentProps & React.PropsWithChildren<P> | any
): React.ReactElement | React.ReactNodeArray | undefined {
  const { children, form, ...other } = props;

  // form组件函数
  if (typeof children === 'function') {
    return (
      <Form.Item {...propsDealer({ ...other, form })}>
        {funcCompDealer(
          other,
          children as (props: FormComponentProps) => React.ReactElement,
          0
        )}
      </Form.Item>
    );
  }
  // 数组
  else if (children && children.constructor === Array) {
    // 此处有点问题，暂时先断言成dmform组件
    return (children as Array<
      ((p: FormComponentProps) => React.ReactElement) | React.ReactElement
    >).map((item, index) => {
      const { children, ..._props } = props as (FormComponentProps &
        React.PropsWithChildren<P>);
      // form组件函数
      if (typeof item === 'function') {
        return (
          <Form.Item {...propsDealer({ ...(_props as any), form })}>
            {funcCompDealer(
              _props,
              item as (props: FormComponentProps) => React.ReactElement,
              index
            )}
          </Form.Item>
        );
      }
      // React.ReactNode子节点
      else {
        // 原生节点
        if (isDOMElement(item)) {
          return injectProps(item, props, index);
        }
        // 有效子节点
        else if (React.isValidElement(item)) {
          return (
            <Form.Item {...propsDealer({ ...(item as any).props, form })}>
              {injectProps(item, props, index)}
            </Form.Item>
          );
        }
        // 其他类型
        else {
          return item;
        }
      }
    });
  } else if (isDOMElement(children)) {
    return injectProps(children, props, 0);
  }
  // 单个有效子节点
  else if (React.isValidElement(children)) {
    return (
      <Form.Item {...propsDealer({ ...props.children.props, form })}>
        {injectProps(children, props, 0)}
      </Form.Item>
    );
  }
  // 其他类型
  else {
    if (children === undefined) return;
    else if (typeof children === 'string') return children as any;
    throw new Error(`Unknow type of children! ${children}`);
  }
}

function propsDealer<P>(
  props: FormComponentProps & React.PropsWithChildren<P> & { name: string }
) {
  const {
    name,
    form: { getFieldError, isFieldTouched },
    children
  } = props;
  return {
    name,
    ...props,
    validateStatus: isFieldTouched(name) && getFieldError(name) ? 'error' : '',
    help: (isFieldTouched(name) && getFieldError(name)) || ''
  };
}

/**
 * @param {Object} element (P)react element
 * @return {Boolean} whether it's a DOM element
 */
function isDOMElement(element: any) {
  return typeof element.type === 'string';
}

function funcCompDealer(
  formProps: FormComponentProps,
  selfDefinedComponent: (props: FormComponentProps) => React.ReactElement,
  key: number
): React.ReactElement {
  return React.cloneElement(selfDefinedComponent({ ...formProps }), { key });
}

export function componentFormBind(
  component: React.ReactElement,
  form: FormComponentProps
) {
  const { props } = component;
  const keys = Object.keys(props);
  const newProps = {} as any;

  for (const key of keys) {
    if (React.isValidElement(props[key])) {
      newProps[key] = componentFormBind(props[key], form);
    } else if (typeof props[key] === 'function') {
      funcCompDealer(
        form,
        props[key] as (props: FormComponentProps) => React.ReactElement,
        0
      );
    }
  }

  newProps.form = form;
  return React.cloneElement(component, newProps);
}

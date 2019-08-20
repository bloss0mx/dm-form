import React from 'react';
import { FormComponentProps } from 'antd/es/form';

export type value = any;
export interface FormProps<T> {}
export interface FormItemProps {}

function injectProps<T>(
  children: React.ReactElement,
  formComponentProps: FormComponentProps,
  key: number
): React.ReactElement {
  const _children = children.props.children;
  return React.cloneElement(
    children,
    {
      key,
      form: formComponentProps.form
    },
    _children
      ? content({ form: formComponentProps.form, children: _children })
      : undefined
  );
}

export function content<T, P>(
  props: FormProps<T> & FormComponentProps & React.PropsWithChildren<P>
): React.ReactElement | React.ReactNodeArray | undefined {
  const { children } = props;
  if (children && children.constructor === Array) {
    // 此处有点问题，暂时先断言成dmform组件
    return (children as Array<
      ((p: FormComponentProps) => React.ReactElement) | React.ReactElement
    >).map((item, index) => {
      if (typeof item === 'function') {
        const { children, ..._props } = props as (FormComponentProps &
          React.PropsWithChildren<P>);
        return funcCompDealer(
          _props,
          item as (props: FormComponentProps) => React.ReactElement,
          index
        );
      } else {
        if (React.isValidElement(item)) {
          return injectProps(item, props, index);
        } else {
          return item;
        }
      }
    });
  } else if (React.isValidElement(children)) {
    return injectProps(children, props, 0);
  } else {
    if (children === undefined) return;
    else if (typeof children === 'string') return children as any;
    throw new Error(`Unknow type of children! ${children}`);
  }
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

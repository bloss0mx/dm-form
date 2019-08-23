import React, { isValidElement } from 'react';
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
  const { children, ...other } = props;
  // console.log(Object.keys(other));
  // for (const x of Object.keys(other)) {
  //   if (isValidElement((other as any)[x])) {
  //     console.log('>>>', (other as any)[x], x);
  //   }
  // }
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

export function componentFormBind(
  component: React.ReactElement,
  form: FormComponentProps
) {
  console.log(component);
  const keys = Object.keys(component.props);
  const newProps = {} as any;

  for (const key of keys) {
    console.log(key, React.isValidElement(component.props[key]));
    if (React.isValidElement(component.props[key])) {
      newProps[key] = componentFormBind(component.props[key], form);
    } else if (typeof component.props[key] === 'function') {
      funcCompDealer(
        form,
        component.props[key] as (
          props: FormComponentProps
        ) => React.ReactElement,
        0
      );
    }
  }

  newProps.form = form;
  return React.cloneElement(component, newProps);
}

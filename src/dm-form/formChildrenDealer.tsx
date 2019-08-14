import React from 'react';
import { FormComponentProps } from 'antd/es/form';

export type value = any;
export type onChange<T> = (name: string, value: value, values: T) => value;
export interface FormProps<T> {
  onChange?: onChange<T>;
}
export interface FormItemProps {
  onChange?: (name: string, value: any) => any;
}

function injectProps<T>(
  children: React.ReactElement,
  form: FormComponentProps,
  onChange?: onChange<T>
) {
  let _children = (children as React.ReactElement).props.children;
  return React.cloneElement(
    children,
    {
      form: form.form,
      onChange
    },
    _children
      ? content({ onChange, form: form.form, children: _children })
      : undefined
  );
}

export function content<T, P>(
  props: FormProps<T> & FormComponentProps & React.PropsWithChildren<P>
): React.ReactElement | React.ReactNodeArray {
  const { onChange, children } = props;

  if (children && children.constructor === Array) {
    // 此处有点问题，暂时先断言成dmform组件
    return (children as Array<(p: FormComponentProps) => React.ReactNode>).map(
      (item, index) => {
        if (typeof item === 'function') {
          throw new Error('NOT support function form component now!');
        } else {
          return injectProps(item, props, onChange);
        }
      }
    );
  } else if (React.isValidElement(children)) {
    const { onChange } = props;
    return injectProps(children, props, onChange);
  } else {
    throw new Error('Unknow type of childen! ');
  }
}

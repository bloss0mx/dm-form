import React, { isValidElement, PropsWithChildren } from "react";
import { FormComponentProps } from "antd/es/form";
import { FormItemProps } from "antd/es/form/FormItem";
import { Form, Icon, Input as InputAntd } from "antd";
import Input from "./Input";

import Login from "./Login";
// import Input from "./Input";
import DmForm, { fieldIniter } from "./DmForm";
import CheckBox from "./CheckBox";
import FormItem from "./FormItem";
import DatePicker from "./DatePicker";
import Submit from "./Submit";
import Select, { Option } from "./Select";
import Radio from "./Radio";
import AutoBind from "./AutoBind";

const isDmForm = (test: any) => {
  const found = [
    Input,
    DmForm,
    fieldIniter,
    Login,
    Submit,
    CheckBox,
    FormItem,
    DatePicker,
    Select,
    Option,
    Radio,
    AutoBind
  ].find(item => item === test);

  return !!found;
};

export type value = any;
export interface FormProps<T> {}
export type FormItemProps = FormItemProps;

function injectProps<T>(
  _children: React.ReactElement,
  formComponentProps: FormComponentProps,
  key: number
): React.ReactElement {
  const { children } = _children.props;
  // console.log("222a", _children, children);
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
  // console.error("222a", children);
  if (
    (children && children.type === Form) ||
    (children && children.type === Form.Item)
  ) {
    // console.error("222a", "error");
    return children;
  } else if (children && children.type === FormItem) {
    // console.error("hey!", children);
    return injectProps(children, { form: props.form }, 0);
  }
  // form组件函数
  else if (typeof children === "function") {
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
      if (
        ((item as any).type && (item as any).type === Form) ||
        ((item as any).type && (item as any).type === Form.Item)
      ) {
        // console.error("222a", "error");
        return item;
      } else if ((item as any).type && (item as any).type === FormItem) {
        // console.error("hey!");
        return injectProps(item as any, { form: props.form }, index);
      } else if (typeof item === "function") {
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
          // console.warn(item);
          return injectProps(item, { form: props.form }, index);
        }
        // 有效子节点
        else if (React.isValidElement(item)) {
          return (
            <Form.Item {...propsDealer({ ...(item as any).props, form })}>
              {injectProps(item, { form: props.form }, index)}
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
    // console.warn(children);
    return injectProps(children, { form: props.form }, 0);
  }
  // 单个有效子节点
  else if (React.isValidElement(children)) {
    // if ((children.props as any).label === 'test')
    // console.warn("isvalid", children, props);
    // console.warn(children);
    return (
      <Form.Item {...propsDealer({ ...props.children.props, form })}>
        {injectProps(children, { form: props.form }, 0)}
      </Form.Item>
    );
  }
  // 其他类型
  else {
    if (children === undefined) return;
    else if (typeof children === "string") return children as any;
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
  // console.log(props);
  return {
    name,
    ...props,
    validateStatus: isFieldTouched(name) && getFieldError(name) ? "error" : "",
    help: (isFieldTouched(name) && getFieldError(name)) || ""
  };
}

/**
 * @param {Object} element (P)react element
 * @return {Boolean} whether it's a DOM element
 */
function isDOMElement(element: any) {
  return element && typeof element.type === "string";
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
    } else if (typeof props[key] === "function") {
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

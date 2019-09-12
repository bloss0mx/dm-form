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
      form: { setFieldsValue, validateFields }
    } = props;

    // useEffect(() => {
    //   setFieldsValue(InitialForm || {});
    // }, [setFieldsValue]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      validateFields((err: string, values: T) => {
        if (!err) {
          if (actions) actions.onSubmit(field2Obj(values, {}, false));
        }
      });
    }

    return (
      <Form
        labelCol={{
          xs: { span: 24 },
          sm: { span: 6 }
        }}
        wrapperCol={{
          xs: { span: 24 },
          sm: { span: 18 }
        }}
        onSubmit={handleSubmit}
      >
        {content({ ...{ form: props.form, children: props.children } })}
      </Form>
    );
  }

  // return Form.create({
  //   name: 'global_state',
  //   onFieldsChange(props: any, changedFields: any) {
  //     console.log('>>>', changedFields);
  //     (props as any).onChange(changedFields);
  //   },
  //   mapPropsToFields(props: any) {
  //     const t: any = {};
  //     for (const i in props) {
  //       if (props.hasOwnProperty(i) && i !== 'children') {
  //         t[i] = Form.createFormField({ ...props[i] });
  //       }
  //     }
  //     return t;
  //   },
  //   onValuesChange(_: any, values: any) {
  //     // console.log(values);
  //   }
  // })(DmForm);

  return Form.create({
    name: 'global_state',
    onFieldsChange(props: any, changedFields: any) {
      // console.log('>>>', changedFields);
      (props as any).onChange(changedFields);
    },
    mapPropsToFields(props: any) {
      const t: any = {};
      for (const i in props) {
        if (props.hasOwnProperty(i) && i !== 'children') {
          t[i] = Form.createFormField({ ...props[i] });
        }
      }
      // console.log(t);
      return t;
    },
    // mapPropsToFields(props: any) {
    //   console.log('p', props);
    //   const field = xx(props);
    //   console.log('f', field);
    //   return field;
    // },
    onValuesChange(_: any, values: any) {
      // console.log(values);
    }
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

/**
 * 考虑原生支持，但是目前还做不到
 * @param x
 */
const xx = (x: any) => {
  if (x === undefined || x === null) return { value: x };
  if (x.constructor === Array) {
    const answer = [] as Array<any>;
    Object.keys(x).forEach((i: any) => {
      answer[i] = xx(x[i]);
    });
    return answer;
  } else if (x.constructor === Object) {
    const answer = {} as any;
    Object.keys(x).forEach(i => {
      answer[i] = xx(x[i]);
    });
    return answer;
  } else {
    return Form.createFormField({ ...x });
  }
};

/**
 * 在state中初始化field
 * @param state
 */
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

let count = 0;
export const genHash = () => count++;

/**
 * 对象转换为field
 * @param obj
 * @param preName
 */
export function obj2Field(obj: any, preName = '') {
  let data = {} as any;
  if (obj.constructor === Array) {
    const preFix = preName === '' ? '' : preName + '_';
    for (const v in obj) {
      if (obj.hasOwnProperty(v)) {
        data = { ...data, ...obj2Field(obj[v], preFix + genHash()) };
      }
    }
  } else if (obj.constructor === Object) {
    const preFix = preName === '' ? '' : preName + '$';
    for (const v in obj) {
      if (obj.hasOwnProperty(v)) {
        data = { ...data, ...obj2Field(obj[v], preFix + v) };
      }
    }
  } else {
    data[preName] = { value: obj };
  }
  return data;
}

/**
 * 按层获取path信息
 * @param name
 */
function nameDealer(name = '') {
  const curr = name.match(/^[^_\$]+/);
  const rmedCurr = name.replace(/^[^_\$]+/, '');
  const symbol = rmedCurr.match(/^[_\$]/);
  const nextLevelName = rmedCurr.replace(/^[_\$]/, '');
  return {
    name,
    curr: (curr && curr[0]) || '',
    symbol: symbol && symbol[0],
    nextLevelName
  };
}

/**
 * field转换为对象
 * @param field
 * @param container
 * @param getValue
 */
export function field2Obj(
  field: any,
  container = {},
  getValue: boolean = true
) {
  let obj: any; // 本层容器
  const keys = Object.keys(field).sort((a, b) => a.localeCompare(b));
  if (container.constructor === Array) {
    obj = [];
  } else if (container.constructor === Object) {
    obj = {};
  }
  let nextField = {} as any; // 下层容器

  keys.forEach((v, index) => {
    const { curr, symbol, nextLevelName } = nameDealer(v);
    const nextCurr = nameDealer(keys[index + 1] || '').curr;
    if (symbol) {
      // 有后继 深入
      nextField[nextLevelName] = field[v];
      if (curr !== nextCurr || index === keys.length - 1) {
        // 本层不同
        if (symbol === '$') {
          // 对象
          if (obj.constructor === Array)
            obj.push(field2Obj(nextField, {}, getValue));
          else if (obj.constructor === Object) {
            if (obj[curr] === undefined) obj[curr] = {};
            obj[curr] = { ...obj[curr], ...field2Obj(nextField, {}, getValue) };
          }
        } else if (symbol === '_') {
          // 数组
          if (obj.constructor === Array)
            obj.push(field2Obj(nextField, [], getValue));
          else if (obj.constructor === Object) {
            if (obj[curr] === undefined) obj[curr] = [];
            obj[curr] = [...obj[curr], ...field2Obj(nextField, [], getValue)];
          }
        }
        nextField = {};
      }
    } else {
      // 无后继 直接赋值
      if (getValue) {
        if (obj.constructor === Array) obj.push(field[v].value);
        else if (obj.constructor === Object) obj[curr] = field[v].value;
      } else {
        if (obj.constructor === Array) obj.push(field[v]);
        else if (obj.constructor === Object) obj[curr] = field[v];
      }
    }
  });
  return obj;
}

// export function list(list: any, prefix: string) {
//   const keys1 = Object.keys(list)
//     .sort((a, b) => a.localeCompare(b))
//     .filter(item => item.match(new RegExp('^' + prefix)));

//   return ([
//     {
//       curr: undefined,
//       answer: [],
//     },
//     ...keys1,
//   ] as any).reduce((sum: any, item: any) => {
//     const newSum = { ...sum };
//     if (
//       item.replace(/^[^$_]+[$_]/, '').match(/^[^$_]/)[0] !== newSum.curr ||
//       newSum.curr === undefined
//     ) {
//       newSum.curr = item.replace(/^[^$_]+[$_]/, '').match(/^[^$_]/)[0];
//       newSum.answer = [...sum.answer, []];
//     }
//     newSum.answer[newSum.answer.length - 1] = [
//       ...newSum.answer[newSum.answer.length - 1],
//       item,
//     ];
//     return newSum;
//   }).answer;
// }

/**
 * 分解数组
 * @param list
 * @param prefix
 */
export function list(list: any, prefix: string) {
  const keys1 = Object.keys(list)
    .sort((a, b) => a.localeCompare(b))
    .filter(item => item.match(new RegExp('^' + prefix)));

  return ([{ curr: undefined, answer: [] }, ...keys1] as any).reduce(
    (sum: any, item: any) => {
      const newSum = { ...sum };
      const matched1st = item.replace(new RegExp('^' + prefix + '[$_]'), '');
      const matched2nd = matched1st.replace(/^[^$_]+/, '').match(/^[$]/);
      if (
        (matched1st && matched1st.match(/^[^$_]/)[0] !== newSum.curr) ||
        newSum.curr === undefined
      ) {
        newSum.curr = item
          .replace(new RegExp('^' + prefix + '[$_]'), '')
          .match(/^[^$_]/)[0];
        if (matched2nd) newSum.answer = [...sum.answer, []];
      }

      if (matched2nd) {
        newSum.answer[newSum.answer.length - 1] = [
          ...newSum.answer[newSum.answer.length - 1],
          item
        ];
      } else newSum.answer = [...sum.answer, item];
      return newSum;
    }
  ).answer;
}

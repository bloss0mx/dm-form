import React, { useEffect, useState, useMemo, ReactText } from 'react';
import { Form } from 'antd';
import { FormComponentProps, FormCreateOption } from 'antd/es/form';
import { content } from './formChildrenDealer';
import { FormProps, value } from './formChildrenDealer';

interface FormOnly<T> {
  onSubmit: (values: T) => value;
}

export const ARRAY_SEPARATOR = '[';
export const OBJECT_SEPARATOR = '{';
export const INDEX_NAME = '__idx__';

function Init<T>(actions?: FormProps<T> & FormOnly<T>) {
  class DmForm<P> extends React.PureComponent<
    FormProps<T> & FormComponentProps & React.PropsWithChildren<P>
  > {
    constructor(
      props: FormProps<T> & FormComponentProps & React.PropsWithChildren<P>
    ) {
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      const {
        form: { validateFields },
      } = this.props;
      e.preventDefault();
      validateFields((err: string, values: T) => {
        if (!err) {
          if (actions) actions.onSubmit(_field2Obj(values, 'onSubmit'));
        }
      });
    }

    render() {
      const { form, children } = this.props;
      return (
        <Form
          labelCol={{
            xs: { span: 24 },
            sm: { span: 6 },
          }}
          wrapperCol={{
            xs: { span: 24 },
            sm: { span: 18 },
          }}
          onSubmit={this.handleSubmit}
        >
          {content({ ...{ form, children } })}
        </Form>
      );
    }
  }
  return DmForm;
}

export function beforeUseForm<T>(onSubmit?: Function) {
  // let _setFiled: Function = () => {};
  // let _onSubmit: Function = () => {};
  return Form.create({
    name: 'global_state',
    onFieldsChange(props: any, changedFields: any) {
      (props as any).onChange(changedFields);
    },
    mapPropsToFields(props: any) {
      // console.time('mapPropsToFields');
      const t: any = {};
      for (const i in props) {
        if (props.hasOwnProperty(i) && i !== 'children') {
          t[i] = Form.createFormField({ ...props[i] });
        }
      }
      // console.timeEnd('mapPropsToFields');
      return t;
    },
    onValuesChange(_: any, values: any) {},
  })(Init({ onSubmit } as any));
  // function(initialState: T, onSubmit: Function) {
  //   const [field, setfield] = useState(initialState);
  //   _onSubmit = onSubmit;
  //   _setFiled = setfield;
  //   return field;
  // }
}

/**
 * 初始化form的state，返回值同useState
 * @param arg 默认值
 */
export const useFormState = (arg?: any) => {
  return useState(useMemo(() => obj2Field(arg), []));
};

/**
 * 初始化onsubmit事件，返回form组件
 * @param onSubmit onsubmit事件
 */
export const useFormComponent = (onSubmit?: Function) => {
  return useMemo(() => beforeUseForm(onSubmit), []);
};

/**
 * 一步使用owlForm
 * @param initState 默认值
 * @param onSubmit onsubmit事件
 */
export function useOneStep(initState?: any, onSubmit?: Function) {
  // console.time('useOneStep1');
  const [formData, setFormData] = useFormState(initState || {});
  // console.timeEnd('useOneStep1');

  // console.time('useOneStep2');
  const MyForm = useFormComponent(onSubmit);
  // console.timeEnd('useOneStep2');

  // console.time('useOneStep3');
  const handleFormChange = (changedFields: any) => {
    setFormData({ ...formData, ...changedFields });
  };

  const fieldName = field2Obj(formData, false);

  const sortForm = (fieldName: any, l: number, r: number) => {
    setFormData(formSort(fieldName, l, r, formData));
  };
  // console.timeEnd('useOneStep3');
  return {
    formData,
    setFormData,
    MyForm,
    handleFormChange,
    fieldName,
    sortForm,
  };
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
  return Form.create({
    name: 'global_state',
    onFieldsChange(props: any, changedFields: any) {
      (props as any).onChange(changedFields);
    },
    mapPropsToFields(props: any) {
      const t: any = {};
      for (const i in props) {
        if (props.hasOwnProperty(i) && i !== 'children') {
          t[i] = Form.createFormField({ ...props[i] });
        }
      }
      return t;
    },
    onValuesChange(_: any, values: any) {},
  })(Init(actions));
}

type Name<T> = { [P in keyof T]: P }[keyof T];
type FieldToState2<T> = {
  [P in Name<T>]: T[P] extends Array<any>
    ? Array<FieldToState2<T[P]>>
    : {
        value: T[P];
      }
};
type fieldIniter = <T>(field: T) => FieldToState2<T>;

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
export function genHash() {
  return count++;
}

/**
 * 对象转换为field
 * @param obj
 * @param preName
 */
export function obj2Field(obj: any, preName = '', index?: ReactText) {
  let data = {} as any;
  if (obj.constructor === Array) {
    const preFix = preName === '' ? '' : preName + ARRAY_SEPARATOR;
    for (const v in obj) {
      if (obj.hasOwnProperty(v)) {
        // console.log(v);
        data = { ...data, ...obj2Field(obj[v], preFix + v, v) };
      }
    }
  } else if (obj.constructor === Object) {
    const preFix = preName === '' ? '' : preName + OBJECT_SEPARATOR;
    for (const v in obj) {
      if (obj.hasOwnProperty(v)) {
        data = { ...data, ...obj2Field(obj[v], preFix + v, v) };
      }
    }
  } else {
    data[preName] = { value: obj, index };
  }
  return data;
}

/**
 * 按层获取path信息
 * @param name
 */
function nameDealer(name = '') {
  const currReg = new RegExp(`^[^\\${ARRAY_SEPARATOR}\\${OBJECT_SEPARATOR}]+`);
  const symbolReg = new RegExp(`^[\\${ARRAY_SEPARATOR}\\${OBJECT_SEPARATOR}]`);
  const curr = name.match(currReg);
  const rmedCurr = name.replace(currReg, '');
  const symbol = rmedCurr.match(symbolReg);
  const nextLevelName = rmedCurr.replace(symbolReg, '');
  return {
    name,
    curr: (curr && curr[0]) || '',
    symbol: symbol && symbol[0],
    nextLevelName,
  };
}

/**
 * field转换为对象
 * @param field 传入filed对象
 * @param getValue 为true将filed转换为js对象，为false时输出以js对象的方式输出field中的名字，onSubmit专门输出onsbumit回调的内容
 * @param container 新容器
 * @param currName 当前名字
 */
function _field2Obj(
  field: any,
  getValue: boolean | 'onSubmit',
  container = {},
  currName = ''
) {
  let obj: any; // 本层容器
  let keys = Object.keys(field);
  // const keys = Object.keys(field).sort((a, b) => a.localeCompare(b));

  // console.log(field, currName);

  if (container.constructor === Array) {
    obj = [];
    // 以下部分是field寄存index信息的操作，考虑废弃
    // const list = [] as Array<any>;
    // keys.forEach((item, index) => {
    //   console.log(item);
    //   list.push({ ...field[item], name: item, _index: index });
    // });
    // console.log(list);
    // const _list = list.sort((a: { index: string }, b: { index: string }) => {
    //   return parseInt(a.index) - parseInt(b.index);
    // });
    // keys = _list.map(item => item.name);
  } else if (container.constructor === Object) {
    obj = {};
  }
  if (!getValue)
    Object.defineProperty(obj, INDEX_NAME, {
      enumerable: false,
      configurable: false,
      writable: true,
      value: currName,
    });
  let nextField = {} as any; // 下层容器

  // console.log(keys);

  keys.forEach((v, index) => {
    const { curr, symbol, nextLevelName } = nameDealer(v);
    const nextCurr = nameDealer(keys[index + 1] || '').curr;
    if (symbol && symbol !== 'value') {
      // 有后继 深入
      nextField[nextLevelName] = field[v];
      if (curr !== nextCurr || index === keys.length - 1) {
        // 本层不同
        if (symbol === OBJECT_SEPARATOR) {
          // 对象
          if (obj.constructor === Array) {
            const target = _field2Obj(
              nextField,
              getValue,
              {},
              currName + curr + symbol
            );
            if (!getValue)
              Object.defineProperty(target, INDEX_NAME, {
                enumerable: false,
                configurable: false,
                writable: true,
                value: currName + curr,
              });
            obj.push(target);
          } else if (obj.constructor === Object) {
            if (obj[curr] === undefined) obj[curr] = {};
            const target = _field2Obj(
              nextField,
              getValue,
              {},
              currName + curr + symbol
            );
            if (!getValue)
              Object.defineProperty(target, INDEX_NAME, {
                enumerable: false,
                configurable: false,
                writable: true,
                value: currName + curr,
              });
            obj[curr] = {
              ...obj[curr],
              ...target,
            };
          }
        } else if (symbol === ARRAY_SEPARATOR) {
          // 数组
          if (obj.constructor === Array)
            obj.push(
              _field2Obj(nextField, getValue, [], currName + curr + symbol)
            );
          else if (obj.constructor === Object) {
            if (obj[curr] === undefined) obj[curr] = [];
            obj[curr] = [
              ...obj[curr],
              ..._field2Obj(nextField, getValue, [], currName + curr + symbol),
            ];
          }
        }
        nextField = {};
      }
    } else {
      // 无后继 直接赋值
      if (getValue === true) {
        if (obj.constructor === Array && field[v]) obj.push(field[v].value);
        else if (obj.constructor === Object && field[v])
          obj[curr] = field[v].value;
      } else if (getValue === 'onSubmit') {
        if (obj.constructor === Array && field[v]) obj.push(field[v]);
        else if (obj.constructor === Object && field[v]) obj[curr] = field[v];
      } else {
        if (obj.constructor === Array) obj.push(currName + curr);
        else if (obj.constructor === Object) obj[curr] = currName + curr;
      }
    }
  });
  // console.log(field, obj);
  return obj;
}

/**
 * field转换为对象
 * @param field 传入filed对象
 * @param getValue 为true将filed转换为js对象，为false时输出以js对象的方式输出field中的名字
 */
export function field2Obj(field: any, getValue: boolean = true) {
  return _field2Obj(field, getValue);
}

const symbolHeadReg = new RegExp(
  `^[^\\${OBJECT_SEPARATOR}\\${ARRAY_SEPARATOR}]+`
);
const objectHead = new RegExp(`^[\\${OBJECT_SEPARATOR}]`);

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
      const matched1st = item.replace(
        new RegExp(
          '^' + prefix + `[\\${OBJECT_SEPARATOR}\\${ARRAY_SEPARATOR}]`
        ),
        ''
      );
      const matched2nd = matched1st
        .replace(symbolHeadReg, '')
        .match(objectHead);
      if (
        (matched1st && matched1st.match(symbolHeadReg)[0] !== newSum.curr) ||
        newSum.curr === undefined
      ) {
        newSum.curr = item
          .replace(
            new RegExp(
              '^' + prefix + `[\\${OBJECT_SEPARATOR}\\${ARRAY_SEPARATOR}]`
            ),
            ''
          )
          .match(symbolHeadReg)[0];
        if (matched2nd) newSum.answer = [...sum.answer, []];
      }

      if (matched2nd) {
        newSum.answer[newSum.answer.length - 1] = [
          ...newSum.answer[newSum.answer.length - 1],
          item,
        ];
      } else newSum.answer = [...sum.answer, item];
      return newSum;
    }
  ).answer;
}

const matchSeparator = new RegExp(
  '[^\\' + ARRAY_SEPARATOR + '\\' + OBJECT_SEPARATOR + ']+$'
);

/**
 * form排序
 * @param l 之前的位置
 * @param r 之后的位置
 * @param formData formData
 */
export function formSort(basePath: any, l: number, r: number, formData: any) {
  let _formData = { ...formData };
  for (let i = l < r ? l : l - 1; ; ) {
    if (
      basePath[i][INDEX_NAME] === undefined ||
      basePath[i + 1][INDEX_NAME] === undefined
    ) {
      const tmp = _formData[basePath[i]];
      _formData[basePath[i]] = _formData[basePath[i + 1]];
      _formData[basePath[i + 1]] = tmp;
    } else {
      const leftPrefix = basePath[i][INDEX_NAME];
      const rightPrefix = basePath[i + 1][INDEX_NAME];
      const leftIndex = leftPrefix.match(matchSeparator);
      const rightIndex = rightPrefix.match(matchSeparator);
      const prefix = rightPrefix.replace(matchSeparator, '');
      _formData = exchangeData(prefix, leftIndex[0], rightIndex[0], _formData);
    }
    if (l < r) i++;
    else i--;
    if (l < r && i >= r) break;
    else if (l > r && i < r) break;
  }

  return _formData;
}

function splitName(whole: string, pre: string, index: string) {
  return [pre, index, whole.replace(pre + index, '')];
}

/**
 * 交换data，有副作用的操作
 * @param leftPrefix
 * @param leftIndex
 * @param rightIndex
 * @param _formData
 */
function exchangeData(
  leftPrefix: string,
  leftIndex: string,
  rightIndex: string,
  formData: any
) {
  const _formData = { ...formData };
  const prefix = new RegExp(
    '^' +
      leftPrefix.replace(
        new RegExp(`[\\${OBJECT_SEPARATOR}\\${ARRAY_SEPARATOR}]`, 'g'),
        (item: string) => '\\' + item
      ) +
      leftIndex
  );
  Object.keys(formData).forEach(item => {
    if (item.match(prefix)) {
      console.log(prefix);
      const [pre, mid, end] = splitName(item, leftPrefix, leftIndex);
      const tmp = _formData[pre + (leftIndex + '') + end];
      _formData[pre + (leftIndex + '') + end] =
        _formData[pre + (rightIndex + '') + end];
      _formData[pre + (rightIndex + '') + end] = tmp;
    }
  });
  return _formData;
}

function genNames(dataPath: string) {
  const reg = /\]\[|\]\.|[\[\]\.]/g;
  return { names: dataPath.split(reg), types: dataPath.match(reg) };
}
function genPath(dataPath: string) {
  const { names, types } = genNames(dataPath);
  let path = '';
  if (types) {
    names.forEach((item, index) => {
      path += item +=
        (types[index] &&
          (types[index].match(/\[$/) ? ARRAY_SEPARATOR : OBJECT_SEPARATOR)) ||
        '';
    });
  }
  return path;
}

export function setFormItem(dataPath: string, data: any, formData: any) {
  let path = genPath(dataPath);
  if (data.constructor === Object || data.constructor === Array) {
    let separator = OBJECT_SEPARATOR;
    if (data.constructor === Array) {
      separator = ARRAY_SEPARATOR;
    }
    const target = {} as any;
    Object.keys(data).forEach(item => {
      target[path + separator + item] = { value: data[item] };
    });
    return target;
  } else {
    const target = {} as any;
    target[path] = { value: data };
  }
}

export function rmFormItem(dataPath: string, fieldName: any, formData: any) {
  let _formData = { ...formData };
  const path = genPath(dataPath);
  const newData = {} as any;
  const pathRegExp = path.replace(
    new RegExp(`[\\${OBJECT_SEPARATOR}\\${ARRAY_SEPARATOR}]`, 'g'),
    item => '\\' + item
  );
  const { names } = genNames(dataPath);
  const _names = names;
  _names.splice(names.length - 1, 1);
  const target = [fieldName, ..._names].reduce((sum, index) => {
    console.log(sum, index);
    return sum[index];
  });
  const lastOneIndex = target.length - 1;

  console.log(target);

  const separator = path.match(
    new RegExp(`[\\${OBJECT_SEPARATOR}\\${ARRAY_SEPARATOR}]`, 'g')
  );
  if (separator && separator[0] === ARRAY_SEPARATOR) {
    const found = path.match(/\d$/);
    if (found) {
      const targetIndex = (found[0] as any) - 0;
      console.log(path, targetIndex, lastOneIndex, formData);
      _formData = formSort(path, targetIndex, lastOneIndex, formData);
      console.log(_formData);
    }
  }

  Object.keys(_formData).forEach(item => {
    if (!item.match(new RegExp('^' + pathRegExp))) {
      newData[item] = _formData[item];
    }
  });
  console.log(newData);
  return newData;
}

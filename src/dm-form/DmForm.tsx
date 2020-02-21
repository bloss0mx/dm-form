import React, { useEffect, useState, useMemo, ReactText } from 'react';
import { Form } from 'antd';
import { FormComponentProps, FormCreateOption } from 'antd/es/form';
import { content } from './formChildrenDealer';
import { FormProps, value } from './formChildrenDealer';
import { start, pause, end } from './tools';
import {
  obj2Field,
  field2Obj,
  _field2Obj,
  formSort,
  insertToForm,
  rmFormItem,
  setFormItem,
  setField,
} from './formDataCreator';
import { toIndexed, toStore, changeStore } from './indexedDataStructure';

interface FormOnly<T> {
  onSubmit: (values: T) => value;
}

function Init<T>(actions?: FormProps<T> & FormOnly<T>) {
  class DmForm<P> extends React.PureComponent<
    FormProps<T> &
      FormComponentProps &
      React.PropsWithChildren<P> & { formData: any }
  > {
    constructor(
      props: FormProps<T> &
        FormComponentProps &
        React.PropsWithChildren<P> & { formData: any }
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
      const { form, children, formData } = this.props;
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
          {(() => {
            start('content');
            const answer = content({ ...{ form, children, formData } });
            pause('content');
            return answer;
          })()}
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
  start('use one step');
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

  const insertToArray = (fieldName: any, index: number, data: any) => {
    setFormData(insertToForm(fieldName, index, data, formData));
  };

  const removeItem = (dataPath: any) => {
    setFormData(rmFormItem(dataPath, fieldName, formData));
  };

  const setItem = (dataPath: any, data: any) => {
    setFormItem(dataPath, data, formData);
  };

  pause('use one step');

  // console.timeEnd('useOneStep3');
  return {
    formData,
    setFormData,
    MyForm,
    handleFormChange,
    fieldName,
    sortForm,
    insertToArray,
    removeItem,
    setItem,
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
      };
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

/////////////////////////////////////////

const makeAObj = (max: number, target = {} as any, next: Function) => {
  return () => {
    let _target = [] as any;
    if (target.constructor === Object) _target = {};
    for (let i = 0; i < max; i++) {
      _target[i] = next();
    }
    return _target;
  };
};

// 125580 4323 / 1000
const testParam1 = [1000, 1, 1];
// 7344 1180 / 1000  6551942 834448 / 1000000
const testParam2 = [10, 10, 10];
// 120788 973 / 1000
const testParam3 = [1, 1, 1000];

const currParam = testParam2;

const testData2 = {
  ...makeAObj(
    currParam[0],
    {},
    makeAObj(
      currParam[1],
      {},
      makeAObj(currParam[2], {}, () => {
        return Math.floor(Math.random() * 128);
      })
    )
  )(),
};

const testData = [
  ...(() => {
    const target: any = [];
    for (let i = 0; i < 1000; i++) {
      const tmp: any = {};
      for (let j = 0; j < Math.floor(Math.random() * 0) + 5; j++) {
        tmp[Math.floor(Math.random() * 128).toString()] = Math.floor(
          Math.random() * 128
        );
      }
      target.push(tmp);
    }
    return target;
  })(),
];

const currTestCase = testData2;
const LEN = 1000;

console.time('stringIndexed');
const formData = obj2Field(currTestCase);
for (let i = 0; i < LEN; i++) {
  setField(formData, o => o);
}
console.timeEnd('stringIndexed');

console.time('indexed');
const [index, store] = toIndexed(currTestCase);
for (let i = 0; i < LEN; i++) {
  changeStore(index, store, o => o);
}
console.timeEnd('indexed');

console.log(index, store, currTestCase);

/////////////////////////////////////////

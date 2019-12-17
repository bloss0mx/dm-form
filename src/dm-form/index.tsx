import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Form as FormAntd, Input as InputAntd } from 'antd';
import Form, { FormComponentProps } from 'antd/lib/form';
import moment, { Moment } from 'moment';
import { useDrag, useDrop } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import Login from './Login';
import Input from './Input';
import InputNumber from './InputNumber';
import DmForm, {
  fieldIniter,
  field2Obj,
  obj2Field,
  list,
  beforeUseForm,
  useFormState,
  useFormComponent,
  useOneStep,
} from './DmForm';
import Submit from './Submit';
import CheckBox from './CheckBox';
import FormItem from './FormItem';
import DatePicker from './DatePicker';
import AutoBind from './AutoBind';
import Select from './Select';
import Radio from './Radio';
import TimePicker from './TimePicker';
import NoReRender from './NoReRender';

export {
  Login,
  Input,
  InputNumber,
  DmForm,
  Submit,
  CheckBox,
  FormItem,
  DatePicker,
  // AutoBind,
  Select,
  Radio,
  TimePicker,
  NoReRender,
  //
  fieldIniter,
  field2Obj,
  obj2Field,
};

const validator = (rule: object, value: string, callback: Function) => {
  if (value.match(/\s/g)) callback('空字符无效');
  if (value.length < 6) callback('密码长度不能小于6个字符');
  const d = value.match(/\d/g);
  const ll = value.match(/[a-z]/g);
  const gl = value.match(/[A-Z]/g);
  const clear = value.replace(/[\d\sa-zA-Z]/g, '');
  if (d && ll && gl && clear.length) {
    callback();
  } else callback('密码需要包含大写字母、小写字母、数字、符号');
};

///////////////////////////////////////////////////////////

type state = {
  time: Moment;
  fields: {
    username: {
      value: string;
    };
    password: {
      value: string;
    };
    ayeaye: {
      value: string;
    };
    nyeney: {
      value: string;
    };
    ayeayehao: {
      value: string;
    };
    test: {
      value: string;
    };
    tedst: {
      value: string;
    };
    qewr: {
      value: boolean;
    };
    email: {
      value: string;
    };
    date: { value: [Moment, Moment] };
    emaild: {
      value: string;
    };
    uu: {
      value: string;
    };
    select: {
      value: string;
    };
    vihcle: {
      value: string;
    };
    auto: {
      value: string;
    };
  };
};

export default class HorizontalLoginForm extends React.Component<any, state> {
  protected Form: any;

  constructor(props: any) {
    super(props);
    this.state = ({
      time: moment(),
      fields: obj2Field({
        userInfo: [
          {
            name: 'qwer',
            pwd: 'asdf',
          },
          {
            name: 'zxcv',
            pwd: '1234',
          },
        ],
        errorTest: [1, 2, 3, 4],
        code: ['asdf', 'qwer', 'zxcv'],
        username: 'niubiguai',
        password: '123456',
        ayeaye: '12',
        nyeney: '23',
        ayeayehao: 'asdf',
        test: 'qwer',
        tedst: 'zxcv',
        qewr: true,
        email: 'rewq',
        date: [moment().startOf('day'), moment().endOf('day')] as [
          Moment,
          Moment
        ],
        emaild: 'niubi@163.com',
        uu: 'niubi',
        select: 'aye',
        vihcle: '',
        auto: 'yo',
      }),
    } as any) as state;
    // console.log(this.state);
    this.Form = DmForm(
      // {
      //   // ...that.state.fields.username
      // },
      {
        onSubmit(values: any) {
          console.log(values);
        },
      }
      // {
      //   name: "global_state",
      //   onFieldsChange(props: any, changedFields: any) {
      //     (props as any).onChange(changedFields);
      //   },
      //   mapPropsToFields(props: any) {
      //     const t: any = {};
      //     for (const i in props) {
      //       if (props.hasOwnProperty(i) && i !== "children") {
      //         t[i] = FormAntd.createFormField({ ...props[i] });
      //       }
      //     }
      //     return t;
      //   },
      //   onValuesChange(_: any, values: any) {
      //     // console.log(values);
      //   }
      // }
    );
  }

  handleSubmit(values: any) {
    // console.log(values);
  }

  handleFormChange = (changedFields: any) => {
    this.setState((state: any) => ({
      fields: { ...state.fields, ...changedFields },
    }));
  };

  render() {
    const { time, fields } = this.state;

    // console.time('field2Obj');
    const fieldName = field2Obj(this.state.fields, false);
    // console.timeEnd('field2Obj');
    // console.log(fieldName, this.state.fields);

    return (
      <div style={{ width: '500px' }}>
        {time.format('YYYY-MM-DD HH:mm:ss')}
        <this.Form {...fields} onChange={this.handleFormChange}>
          <div>
            {fieldName.userInfo.map((item: any, index: number) => {
              const prefix = item;
              return (
                <div
                  style={{
                    border: "1px solid red",
                    marginBottom: "8px",
                    padding: "8px"
                  }}
                >
                  <Input label="name" name={item.name} key={"$name"} />
                  <Input label="pwd" name={item.pwd} key={"$pwd"} />
                </div>
              );
            })}
          </div>
          {fieldName.errorTest.map((item: any, index: number) => {
            // console.log(item);
            return (
              <div
                key={index + 'k'}
                style={{
                  border: '1px solid red',
                  marginBottom: '8px',
                  padding: '8px'
                }}
              >
                <Input name={item} label={item} key={item} />
              </div>
            );
          })}
          <Input name="username" label="牛逼" />
          <div>
            <div>
              <Login
                name="password"
                type="password"
                rules={[
                  {
                    // validator
                  }
                ]}
              />
            </div>
          </div>
          <FormItem
            label="test"
            style={{
              textAlign: "left"
              // marginBottom: 0
            }}
          >
            <div
              style={{
                border: "1px solid #ddd",
                padding: "16px",
                borderRadius: "4px",
                backgroundColor: "#fafafa"
              }}
            >
              <FormItem
                label="test"
                style={{
                  textAlign: "left",
                  marginBottom: 0
                }}
              >
                <Input
                  name="ayeaye"
                  style={{
                    display: "inline-block",
                    width: "100px",
                    marginBottom: 0
                  }}
                />
                &nbsp;-&nbsp;
                <Input
                  name="nyeney"
                  style={{
                    display: "inline-block",
                    width: "100px",
                    marginBottom: 0
                  }}
                />
                <Input
                  name="ayeayehao"
                  label="hao"
                  style={{ marginBottom: 0 }}
                />
              </FormItem>
            </div>
          </FormItem>
          <h2>hey</h2>
          {({ form: { getFieldDecorator } }: FormComponentProps) => (
            <FormAntd.Item label={"自定义组件"}>
              {getFieldDecorator("uu", {
                rules: [{ required: true, message: "Username is required!" }]
              })(<InputAntd />)}
            </FormAntd.Item>
          )}
          <Login name="test" type="username" />
          <Login name="tedst" type="username" />
          <DatePicker name="date" type="RangePicker" label="日期" />
          <Input name="emaild" type="email" label="牛逼" />
          <Radio
            label="坐骑"
            name="vihcle"
            options={[
              { name: "灰机", value: "airplane" },
              { name: "火箭", value: "rocket" }
            ]}
          />{" "}
          {this.state.fields.vihcle.value === "rocket" && (
            <Login name="tedst" type="username" />
          )}
          <Submit name="submit" />
        </this.Form>
        <FormHook />
        <OneStepForm />
      </div>
    );
  }
}

function FormHook() {
  const [formData, setFormData] = useFormState({
    text: '我是默认值',
    yo: '我也是',
  });

  const MyForm = useFormComponent(console.log);

  const handleFormChange = (changedFields: any) => {
    setFormData({ ...formData, ...changedFields });
  };

  useEffect(() => {
    console.log(field2Obj(formData));
  }, [formData]);

  return (
    <MyForm onChange={handleFormChange} {...formData}>
      <Input name="text" label="text" />
      <Input name="yo" label="yo" />
      <Submit name="submit" />
    </MyForm>
  );
}

const ItemTypes = {
  CARD: 'card',
};

let dragBeginIndex: any;

function resort<T extends any>(
  before: number,
  after: number,
  array: Array<T>
): Array<T> {
  const _array = [...array];
  const tmp = _array.splice(before, 1);
  _array.splice(after, 0, tmp[0]);
  return _array;
}

function setDragBeginIndex(index: number) {
  dragBeginIndex = index;
}

/**
 * OneStepForm
 */
function OneStepForm() {
  const { formData, setFormData, MyForm, handleFormChange } = useOneStep({
    text: '我是默认值',
    yo: '我也是',
    list: ' '
      .repeat(30)
      .split('')
      .map((_, index) => `${index}`)
      .sort((a: string, b: string) => parseInt(a) - parseInt(b))
      .map(item => item + 'xxx'),
    a: [{ b: 'str' }],
  });
  const fieldName = field2Obj(formData, false);
  // const list = fieldName.list.sort((a: string, b: string) => {
  //   return (
  //     parseInt(a.replace(/[^\d]/g, '')) - parseInt(b.replace(/[^\d]/g, ''))
  //   );
  // });
  const list = fieldName.list;

  const afterSort = (before: number, after: number) => {
    const _formData = { ...formData };
    const l = fieldName.list[before];
    const r = fieldName.list[after];
    const tmp = _formData[l].index;
    _formData[l].index = _formData[r].index;
    _formData[r].index = tmp;
    console.log(fieldName, l, r, _formData[l], _formData[r]);
    setFormData(_formData);
  };

  // console.log(fieldName);

  return (
    <MyForm onChange={handleFormChange} {...formData}>
      <Input name="text" label="text" />
      <DndProvider backend={HTML5Backend}>
        {list.map((item: string, index: number) => (
          <Card item={item} index={index} key={item} afterSort={afterSort} />
        ))}
      </DndProvider>
      <Input name="yo" label="yo" />
      <Submit name="submit" />
    </MyForm>
  );
}

function Card(props: { item: any; index: any; afterSort: any }) {
  const { item, index, afterSort, ...other } = props;

  const [{ isDragging }, drag, ConnectDragPreview] = useDrag({
    item: { type: ItemTypes.CARD },
    begin: () => {
      setDragBeginIndex(index);
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop: () => {
      if (
        dragBeginIndex !== undefined &&
        index !== undefined &&
        dragBeginIndex !== index
      ) {
        afterSort(dragBeginIndex, index);
      }
    },
    collect: mon => ({
      isOver: !!mon.isOver(),
      canDrop: !!mon.canDrop(),
    }),
  });

  return ConnectDragPreview(
    <div ref={drop} style={{ position: 'relative' }}>
      <span
        ref={drag}
        style={{
          display: 'inline-block',
          position: 'absolute',
          zIndex: 99,
          left: '20px',
          top: '8px',
        }}
      >
        三
      </span>
      <Input key={item} name={item} label={'密码' + item} {...other} />
    </div>
  );
}

import React from 'react';
import {
  Form as FormAntd,
  Input as InputAntd,
  Select as SelectAntd
} from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import moment, { Moment } from 'moment';

import Login from './Login';
import Input from './Input';
import DmForm, { fieldIniter } from './DmForm';
import Submit from './Submit';
import CheckBox from './CheckBox';
import FormItem from './FormItem';
import DatePicker from './DatePicker';
import Select, { Option } from './Select';
import Radio from './Radio';
import AutoBind from './AutoBind';

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
type s = ['username', 'password'];
type Name<T> = { [P in keyof T]: T[P] }[keyof T];
type ss = {
  field: { [T in keyof ['username', 'password']]: ['username', 'password'][T] };
};
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

export default class HorizontalLoginForm extends React.Component<{}, state> {
  Form: any;

  constructor(props: any) {
    super(props);
    this.state = {
      time: moment(),
      fields: fieldIniter({
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
        auto: 'yo'
      })
    };

    this.Form = DmForm(
      {
        // ...that.state.fields.username
      },
      {
        onSubmit(values: any) {
          console.table(values);
        }
      },
      {
        name: 'global_state',
        onFieldsChange(props: any, changedFields: any) {
          (props as any).onChange(changedFields);
        },
        mapPropsToFields(props: any) {
          const t: any = {};
          for (const i in props) {
            if (props.hasOwnProperty(i) && i !== 'children') {
              t[i] = FormAntd.createFormField({ ...props[i] });
            }
          }
          return t;
        },
        onValuesChange(_: any, values: any) {
          // console.log(values);
        }
      }
    );
  }

  handleSubmit(values: any) {
    console.log(values);
  }

  handleFormChange = (changedFields: any) => {
    this.setState((state: any) => ({
      fields: { ...state.fields, ...changedFields }
    }));
  };

  render() {
    const { time, fields } = this.state;
    return (
      <div style={{ width: '500px' }}>
        {time.format('YYYY-MM-DD HH:mm:ss')}
        <this.Form {...fields} onChange={this.handleFormChange}>
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
              textAlign: 'left'
              // marginBottom: 0
            }}
          >
            <div
              style={{
                border: '1px solid #ddd',
                padding: '16px',
                borderRadius: '4px',
                backgroundColor: '#fafafa'
              }}
            >
              <FormItem
                label="test"
                style={{
                  textAlign: 'left',
                  marginBottom: 0
                }}
              >
                <Input
                  name="ayeaye"
                  style={{
                    display: 'inline-block',
                    width: '100px',
                    marginBottom: 0
                  }}
                />
                &nbsp;-&nbsp;
                <Input
                  name="nyeney"
                  style={{
                    display: 'inline-block',
                    width: '100px',
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
            <FormAntd.Item label={'自定义组件'}>
              {getFieldDecorator('uu', {
                rules: [{ required: true, message: 'Username is required!' }]
              })(<InputAntd />)}
            </FormAntd.Item>
          )}
          <Login name="test" type="username" />
          <Login name="tedst" type="username" />
          <DatePicker name="date" type="RangePicker" label="日期" />
          <CheckBox name="qewr" extra={<span>&nbsp;&nbsp;保存密码？</span>} />
          <Input name="emaild" type="email" label="牛逼yo" />
          <Select name="select" label="选择器">
            <Option value="aye">aye</Option>
            <Option value="nye">nye</Option>
          </Select>
          <Radio
            label="坐骑"
            name="vihcle"
            options={[
              { name: '灰机', value: 'airplane' },
              { name: '火箭', value: 'rocket' }
            ]}
          />
          {this.state.fields.select.value === 'aye' && (
            <Login name="tedst" type="username" />
          )}
          <AutoBind
            name="auto"
            label="auto"
            rules={[{ required: true, message: '需要输入这个' }]}
            component={
              <Input
                name="youi"
                addonBefore={
                  <Select
                    name="youiiiiii"
                    style={{
                      width: '35px',
                      lineHeight: '32px',
                      height: '32px',
                      marginBottom: 0,
                      margin: '-1px',
                      transform: 'translateY(-5px)'
                    }}
                  >
                    <Option value="aye">aye</Option>
                    <Option value="nye">nye</Option>
                  </Select>
                }
              />
            }
            // component={({
            //   form: { getFieldDecorator }
            // }: FormComponentProps) => (
            //   <FormAntd.Item label={'自定义组件'}>
            //     {getFieldDecorator('uu', {
            //       rules: [{ required: true, message: 'Username is required!' }]
            //     })(<InputAntd />)}
            //   </FormAntd.Item>
            // )}
          />
          <Submit name="submit" />
        </this.Form>
      </div>
    );
  }
}

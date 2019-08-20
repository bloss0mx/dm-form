import React from 'react';
import { Form as FormAntd, Input as InputAntd } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import moment, { Moment } from 'moment';

import Login from './Login';
import Input from './Input';
import DmForm from './DmForm';
import Submit from './Submit';
import CheckBox from './CheckBox';
import FormItem from './FormItem';
import DatePicker from './DatePicker';

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
      value: string;
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
  };
};

export default class HorizontalLoginForm extends React.Component<any, state> {
  protected Form: any;

  constructor(props: any) {
    super(props);
    this.state = {
      time: moment(),
      fields: {
        username: {
          value: 'niubiguai'
        },
        password: {
          value: '123456'
        },
        ayeaye: {
          value: '12'
        },
        nyeney: {
          value: '23'
        },
        ayeayehao: {
          value: 'asdf'
        },
        test: {
          value: 'qwer'
        },
        tedst: {
          value: 'zxcv'
        },
        qewr: {
          value: 'fdsa'
        },
        email: {
          value: 'rewq'
        },
        date: { value: [moment().startOf('day'), moment().endOf('day')] },
        emaild: {
          value: 'niubi@163.com'
        },
        uu: {
          value: 'niubi'
        }
      }
    } as state;

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
          <Input name="emaild" type="email" label="牛逼" />
          <Submit name="submit" />
        </this.Form>
      </div>
    );
  }
}

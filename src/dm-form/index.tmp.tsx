import React from 'react';
import {
  Icon,
  Button,
  Layout,
  message,
  Form as FormAntd,
  // DatePicker,
  Input as InputAntd
} from 'antd';
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
      username: string;
      password: string;
      ayeaye: string;
      nyeney: string;
      ayeayehao: string;
      test: string;
      tedst: string;
      qewr: string;
      email: string;
      date: [Moment, Moment];
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
          username: 'xliu',
          password: 'aaaaaa',
          ayeaye: 'aaa',
          nyeney: 'bbb',
          ayeayehao: 'ccc',
          test: 'asdfwerq',
          tedst: 'qwer',
          qewr: 'zsdfasdf',
          email: 'hlossem@154.com',
          date: [moment().startOf('day'), moment().endOf('day')]
        }
      }
    } as state;

    this.Form = DmForm(
      ...(() => {
        const that = this;
        return [
          {
            ...that.state.fields.username
          },
          {
            onSubmit(values: any) {
              console.table(values);
            }
          },
          {
            name: 'username',
            mapPropsToFields(props: any) {
              console.log({
                username: FormAntd.createFormField({
                  ...props.username
                  // username: props.username.username,
                  // password: props.username.password,
                  // ayeaye: props.username.ayeaye,
                  // nyeney: props.username.nyeney,
                  // ayeayehao: props.username.ayeayehao,
                  // test: props.username.test,
                  // tedst: props.username.tedst,
                  // qewr: props.username.qewr,
                  // email: props.username.email
                })
              });
              return {
                username: FormAntd.createFormField({
                  ...props.username
                  // username: props.username.username,
                  // password: props.username.password,
                  // ayeaye: props.username.ayeaye,
                  // nyeney: props.username.nyeney,
                  // ayeayehao: props.username.ayeayehao,
                  // test: props.username.test,
                  // tedst: props.username.tedst,
                  // qewr: props.username.qewr,
                  // email: props.username.email
                })
              };
            }
          }
        ];
      })()
    );
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState(state => {
        state.fields.username.nyeney = 'bbbbbbbb';
        return state;
      });
    }, 5000);

    setInterval(() => {
      this.setState({
        time: moment()
      });
    }, 1000);
  }

  handleSubmit(values: any) {
    console.log(values);
  }

  render() {
    const { time, fields } = this.state;
    return (
      <div style={{ width: '500px' }}>
        {time.format('YYYY-MM-DD HH:mm:ss')}
        <this.Form {...fields}>
          <Login name="username" type="username" />
          <Login
            name="password"
            type="password"
            rules={[
              {
                // validator
              }
            ]}
          />
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
          <Login name="test" type="username" />
          <Login name="tedst" type="username" />
          <DatePicker name="date" type="RangePicker" label="日期" />
          <CheckBox name="qewr" extra={<span>&nbsp;&nbsp;保存密码？</span>} />
          <Input name="emaild" type="email" label="牛逼" />
          <Submit name="submit" />
        </this.Form>
        <Demo />
      </div>
    );
  }
}

const CustomizedForm = FormAntd.create({
  name: 'global_state',
  onFieldsChange(props, changedFields) {
    (props as any).onChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      username: FormAntd.createFormField({
        ...(props as any).username,
        value: (props as any).username.value
      })
    };
  },
  onValuesChange(_, values) {
    console.log(values);
  }
})(props => {
  const { getFieldDecorator } = (props as any).form;
  return (
    <FormAntd layout="inline">
      <FormAntd.Item label="Username">
        {getFieldDecorator('username', {
          rules: [{ required: true, message: 'Username is required!' }]
        })(<InputAntd />)}
      </FormAntd.Item>
    </FormAntd>
  );
});

class Demo extends React.Component<any, any> {
  state: any = {
    fields: {
      username: {
        value: 'benjycui'
      }
    }
  };

  handleFormChange = (changedFields: any) => {
    this.setState((state: any) => ({
      fields: { ...state.fields, ...changedFields }
    }));
  };

  render() {
    const { fields } = this.state;
    return (
      <div>
        <CustomizedForm {...fields} onChange={this.handleFormChange} />
        <pre className="language-bash">{JSON.stringify(fields, null, 2)}</pre>
      </div>
    );
  }
}

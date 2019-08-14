import React from 'react';
import {
  Icon,
  Button,
  Layout,
  message,
  Form,
  DatePicker,
  Input as InputAntd
} from 'antd';
import Login from './Login';
import DmForm from './DmForm';
import Submit from './Submit';
import Input from './Input';
import CheckBox from './CheckBox';
import FormItem from './FormItem';
import { FormComponentProps } from 'antd/lib/form';

///////////////////////////////////////////////////////////

export default class HorizontalLoginForm extends React.Component<{}> {
  componentDidMount() {}

  handleSubmit(values: any) {
    console.log(values);
  }

  render() {
    const Form = DmForm(
      {
        username: 'blossom',
        password: '123456',
        email: 'hlossem@154.com'
      },
      {
        onSubmit(state) {
          console.log('submit', state);
        },
        onChange(name, value, values) {
          console.log(name, value, values);
        }
      }
    );

    return (
      <div style={{ width: '300px' }}>
        <Form>
          <Login name="username" type="username" />
          <Login
            name="password"
            type="password"
            rules={[
              {
                validator: (
                  rule: object,
                  value: string,
                  callback: Function
                ) => {
                  if (value.match(/\s/g)) callback('空字符无效');
                  if (value.length < 6) callback('密码长度不能小于6个字符');
                  const d = value.match(/\d/g);
                  const ll = value.match(/[a-z]/g);
                  const gl = value.match(/[A-Z]/g);
                  const clear = value.replace(/[\d\sa-zA-Z]/g, '');
                  if (d && ll && gl && clear.length) {
                    callback();
                  } else callback('密码需要包含大写字母、小写字母、数字、符号');
                }
              }
            ]}
          />
          <div>
            <div>
              <Login name="test" type="username" />
              <Login name="tedst" type="username" />
              <CheckBox
                name="qewr"
                extra={<span>&nbsp;&nbsp;保存密码？</span>}
              />
            </div>
          </div>
          <Input name="email" type="email" label="牛逼" />
          <Submit name="submit" />
        </Form>
      </div>
    );
  }
}

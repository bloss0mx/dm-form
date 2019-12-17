# Owl Form

Owl Form 表单组件

## 目标

在使用 Antd 表单时，进行 form 双向绑定是件颇为麻烦的事。需要写大量重复的代码、配置。为了解放我的生产力，我打算做一个组件，只进行简单的配置，让它自己进行双向绑定。并提供一些常用的配置，尽量做到一行代码解决问题。

1. 自动双向绑定
1. 简化配置和参数
1. 提供一些常用的配置
1. 保持足够的自由度

## 目前的做法

为了写一个简单的登陆界面，需要写大量的代码，大量的配置。而且很多代码是重复的。

下面是 antd 官方例子：

```jsx
import { Form, Icon, Input, Button, Checkbox } from 'antd';

class NormalLoginForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }]
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true
          })(<Checkbox>Remember me</Checkbox>)}
          <a className="login-form-forgot" href="">
            Forgot password
          </a>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
          Or <a href="">register now!</a>
        </Form.Item>
      </Form>
    );
  }
}
```

## 理想的情况

在 hook 里面只需要简单的 use OwlForm 的`useOneStep`就能实现相同的效果。

```jsx
import React, { useEffect } from 'react';
import DmForm, { field2Obj, useOneStep } from 'owlForm';
import { Submit, Login } from 'owlForm';

function OneStepForm() {
  const { formData, MyForm, handleFormChange } = useOneStep(
    {
      text: '我是默认值',
      yo: '我也是'
    },
    console.log
  );

  return (
    <MyForm onChange={handleFormChange} {...formData}>
      <Login name="name" label="用户名" type="username" />
      <Login name="pwd" label="密码" type="username" />
      <Submit name="submit" />
    </MyForm>
  );
}
```

## 优点

1. 代码简短
1. 常用的情况可以抽成组件，一次编码各处使用
1.

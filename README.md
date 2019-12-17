# 🦉 Owl Form

基于 antd Form 组件的增强组件。

Owl-Form 谐音 our form，代表，这就是我们想要的 form 组件。同时也代表作者是个像猫头鹰一样昼伏夜出的生物。

## 目标

在使用 Antd 表单时，进行 form 双向绑定是件颇为麻烦的事。需要写大量重复的代码、配置。为了解放我的生产力，我打算做一个组件，只进行简单的配置，让它自己进行双向绑定。并提供一些常用的配置，尽量做到一行代码解决问题。

1. 自动双向绑定
1. 简化配置和参数
1. 提供一些常用的配置
1. 保持足够的自由度
1. 支持一定程度的扩展

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
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
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
            initialValue: true,
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
      yo: '我也是',
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

1. 代码简短，尽可能的自由，且符合直觉
1. 常用的情况可以抽成组件，一次编码各处使用
1. 支持 react-dnd
1. 性能与 antd 自带的 form 组件相当

## 通过 hook 使用

使用`useOneStep`来初始化 Form

```javascript
const {
  formData,
  setFormData,
  MyForm,
  handleFormChange,
  fieldName,
} = useOneStep(
  {
    defaultVal: '我是默认值',
    defaultText: '我也是',
  },
  function(formData) {
    console.log(formData);
  }
);
```

`useOneStep`接受两个参数，第一个是初始值对象，第二个是`onSubmit`回调。

- 初始值对象：可以是基本类型变量，也可以是 object 或 array。
- onSubmit 回调：调用时，返回处理好的值，类型和初始化对象相同。

`useOneStep`返回 5 个变量：`formData`、`setFormData`、`MyForm`、`handleFormChange`、`fieldName`

- `formData`：当前处理中的值，**_需要作为参数放入 MyForm 组件_**。一般不建议直接使用，由于 owl-form 内部会把对象扁平化，所以可能也不利于直接使用。
- `setFormData`：直接操纵值，和 formData 一样，不建议直接使用，如果需要使用，我会在文档中明确标识。
- `MyForm`：组件本体，**_需要放入 render 中以显示_**。通常只需要写`<MyForm onChange={handleFormChange} {...formData} ></MyForm>`，就可以了。
- `handleFormChange`：处理表单变化函数。**_需要作为参数放入 MyForm 组件_**。
- `fieldName`：表单结构对象。由于表单在 owl-form 中被处理成不太好理解的格式，所以在处理复杂表单时，建议直接使用 fieldName，来展开数组或对象。

## TODO

1. 严格处理各种类型问题
1. 单元测试

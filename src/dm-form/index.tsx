import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Form as FormAntd, Input as InputAntd, Row, Col } from 'antd';
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
  formSort,
  setFormItem,
  rmFormItem,
} from './DmForm';
import Base from './Base';
import Submit from './Submit';
import CheckBox from './CheckBox';
import FormItem from './FormItem';
import DatePicker from './DatePicker';
import AutoBind from './AutoBind';
import Select from './Select';
import Radio from './Radio';
import TimePicker from './TimePicker';
import NoReRender from './NoReRender';
import Button from 'antd/es/button';

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

// console.log(Input instanceof Base);

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

export default class HorizontalLoginForm extends React.Component<any, any> {
  render() {
    return (
      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '8px' }}>
        <OneStepForm />
      </div>
    );
  }
}

const ItemTypes = {
  CARD: 'card',
};

let dragBeginIndex: any;

function setDragBeginIndex(index: number) {
  dragBeginIndex = index;
}

const randomPwd = () => Math.floor(Math.random() * 10e15).toString(36);

/**
 * OneStepForm
 */
function OneStepForm() {
  const {
    formData,
    setFormData,
    MyForm,
    handleFormChange,
    fieldName,
    sortForm,
  } = useOneStep(
    {
      captcha: '我是自定义组件',
      captcha2: '我是内嵌布局',
      text: 'something000@123.com',
      yo: '我也是',
      list: ' '
        .repeat(3)
        .split('')
        .map((_, index) => `${12 - index}`)
        // .sort((a: string, b: string) => parseInt(a) - parseInt(b))
        .map(item => 'lPhone ' + item + ''),
      a: [{ b: 'str' }],
      listWithObj: ' '
        .repeat(3)
        .split('')
        .map((_, index) => ({
          name: 'Wawei P' + (3 - index) * 10,
          password: randomPwd() + randomPwd(),
        })),
    },
    console.log
  );

  const list = fieldName.list || [];
  const listWithObj = fieldName.listWithObj || [];

  const afterSort = (before: number, after: number) => {
    sortForm(list, before, after);
  };

  const afterSort2 = (before: number, after: number) => {
    sortForm(listWithObj, before, after);
  };

  // console.log(fieldName);

  const addField = () => {
    const len = (fieldName.listWithObj && fieldName.listWithObj.length) || 0;
    const newData = setFormItem(
      `listWithObj[${len + 1}`,
      {
        name: '双倍快乐' + len + 1,
        password: 'cola',
      },
      formData
    );
    console.log(newData);
    setFormData({
      ...formData,
      ...newData,
    });
  };

  const rmField = () => {
    const len = (fieldName.listWithObj && fieldName.listWithObj.length) || 0;
    const newData = rmFormItem(`listWithObj[${0}`, fieldName, formData);
    setFormData(newData);
  };

  console.log(fieldName);

  return (
    <MyForm onChange={handleFormChange} {...formData}>
      <Input name="text" label="text" type="email" extra={'加个extra会怎样'} />
      <h3>以下红框部分是可以拖动的</h3>
      <DndProvider backend={HTML5Backend}>
        {list.map((item: string, index: number) => (
          <Card item={item} index={index} key={item} afterSort={afterSort} />
        ))}
      </DndProvider>
      <h2>双倍快乐</h2>
      <DndProvider backend={HTML5Backend}>
        {listWithObj.map((item: string, index: number) => (
          <DoubleCard
            item={item}
            index={index}
            key={index}
            afterSort={afterSort2}
          />
        ))}
      </DndProvider>
      <Input name="yo" label="yo" />
      {({ form: { getFieldDecorator } }: FormComponentProps) => (
        <FormAntd.Item label={'自定义组件'}>
          <Row gutter={8}>
            <Col span={14}>
              {getFieldDecorator('captcha', {
                rules: [
                  {
                    required: true,
                    message: 'Please input the captcha you got!',
                  },
                ],
              })(<InputAntd />)}
            </Col>
            <Col span={10}>
              <Button>Get captcha</Button>
            </Col>
          </Row>
        </FormAntd.Item>
      )}
      <FormItem label="内嵌布局">
        <Row gutter={8}>
          <Col span={14}>
            <Input
              name="captcha2"
              rules={[
                {
                  required: true,
                  message: 'Please input the captcha you got!',
                },
              ]}
            />
          </Col>
          <Col span={10}>
            <Button>Get captcha</Button>
          </Col>
        </Row>
      </FormItem>
      <Button onClick={addField}>add</Button>
      &nbsp;&nbsp;
      <Button onClick={rmField}>rm</Button>
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
    <div
      ref={drop}
      style={{
        position: 'relative',
        border: '1px solid red',
        marginBottom: '8px',
        padding: '8px',
      }}
    >
      <span
        ref={drag}
        style={{
          display: 'inline-block',
          position: 'absolute',
          zIndex: 99,
          left: '0px',
          top: '0px',
        }}
      >
        三
      </span>
      <Input key={item} name={item} label={index + 1 + '等奖'} {...other} />
    </div>
  );
}

function DoubleCard(props: { item: any; index: any; afterSort: any }) {
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

  // console.log(item);

  return ConnectDragPreview(
    <div
      ref={drop}
      style={{
        position: 'relative',
        border: '1px solid red',
        marginBottom: '8px',
        padding: '8px',
      }}
    >
      <span
        ref={drag}
        style={{
          display: 'inline-block',
          position: 'absolute',
          zIndex: 99,
          left: '0px',
          top: '0px',
        }}
      >
        三
      </span>
      <Input
        key={item.name}
        name={item.name}
        label={index + 1 + '等奖'}
        {...other}
      />
      <Input
        key={item.password}
        name={item.password}
        label={'密码'}
        {...other}
      />
    </div>
  );
}

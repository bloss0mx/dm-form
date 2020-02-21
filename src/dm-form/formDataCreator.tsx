import React, { useEffect, useState, useMemo, ReactText } from 'react';
import { start, pause, end } from './tools';
import { toIndexed, changeStore, toStore } from './indexedDataStructure';

export const ARRAY_SEPARATOR = '[';
export const OBJECT_SEPARATOR = '{';
export const INDEX_NAME = '__idx__';

/**
 * 对象转换为field
 * @param obj
 * @param preName
 */
export function obj2Field(obj: any, preName = '', index?: ReactText) {
  let data = {} as any;
  if (obj === undefined || obj === null) {
    data[preName] = { value: obj, index };
    return data;
  }
  if (obj.constructor === Array) {
    const preFix = preName === '' ? '' : preName + ARRAY_SEPARATOR;
    if (Object.keys(obj).length === 0) {
      data[preName + ARRAY_SEPARATOR] = obj;
    }
    for (const v in obj) {
      if (obj.hasOwnProperty(v)) {
        data = { ...data, ...obj2Field(obj[v], preFix + v, v) };
      }
    }
  } else if (obj.constructor === Object) {
    const preFix = preName === '' ? '' : preName + OBJECT_SEPARATOR;
    if (Object.keys(obj).length === 0) {
      data[preName + OBJECT_SEPARATOR] = obj;
    }
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
    nextLevelName: nextLevelName !== '' ? nextLevelName : undefined,
  };
}

/**
 * field转换为对象
 * @param field 传入filed对象
 * @param getValue 为true将filed转换为js对象，
 *        为false时输出以js对象的方式输出field中的名字，
 *        onSubmit专门输出onsbumit回调的内容
 * @param container 新容器
 * @param currName 当前名字
 */
export function _field2Obj(
  field: any,
  getValue: boolean | 'onSubmit',
  container = {},
  currName = ''
) {
  let obj: any; // 本层容器
  let keys = Object.keys(field);

  if (container.constructor === Array) {
    obj = [];
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

  keys.forEach((v, index) => {
    const { curr, symbol, nextLevelName } = nameDealer(v);
    const nextCurr = nameDealer(keys[index + 1] || '').curr;

    if (
      nextLevelName === undefined &&
      (symbol === ARRAY_SEPARATOR || symbol === OBJECT_SEPARATOR)
    ) {
      let target: any;
      if (symbol === ARRAY_SEPARATOR) {
        target = [];
      } else if (symbol === OBJECT_SEPARATOR) target = {};
      Object.defineProperty(target, INDEX_NAME, {
        enumerable: false,
        configurable: false,
        writable: true,
        value: currName + curr + symbol,
      });
      obj[curr] = target;
    } else if (symbol && symbol !== 'value' && nextLevelName !== undefined) {
      // 有后继 深入
      nextField[nextLevelName] = field[v];
      if (curr !== nextCurr || index === keys.length - 1) {
        // 本层不同
        if (symbol === OBJECT_SEPARATOR) {
          // 对象
          const target = _field2Obj(
            nextField,
            getValue,
            {},
            currName + curr + symbol
          );
          if (!getValue) {
            Object.defineProperty(target, INDEX_NAME, {
              enumerable: false,
              configurable: false,
              writable: true,
              value: currName + curr,
            });
          }
          if (obj.constructor === Array) {
            obj[curr] = target;
          } else if (obj.constructor === Object) {
            if (obj[curr] === undefined) obj[curr] = {};
            obj[curr] = {
              ...obj[curr],
              ...target,
            };
          }
        } else if (symbol === ARRAY_SEPARATOR) {
          // 数组
          const target = _field2Obj(
            nextField,
            getValue,
            [],
            currName + curr + symbol
          );
          if (obj.constructor === Array) {
            Object.defineProperty(target, INDEX_NAME, {
              enumerable: false,
              configurable: false,
              writable: true,
              value: currName + curr,
            });
            obj[curr] = target;
          } else if (obj.constructor === Object) {
            if (obj[curr] === undefined) obj[curr] = [];
            const _target = [...obj[curr], ...target];
            Object.defineProperty(_target, INDEX_NAME, {
              enumerable: false,
              configurable: false,
              writable: true,
              value: currName + curr,
            });
            obj[curr] = _target;
          }
        }
        nextField = {};
      }
    } else {
      // 无后继 直接赋值
      if (getValue === true) {
        if (obj.constructor === Array && field[v]) obj[v] = field[v].value;
        else if (obj.constructor === Object && field[v])
          obj[curr] = field[v].value;
      } else if (getValue === 'onSubmit') {
        if (obj.constructor === Array && field[v]) obj[v] = field[v];
        else if (obj.constructor === Object && field[v]) obj[curr] = field[v];
      } else {
        if (obj.constructor === Array) obj[curr] = currName + curr;
        else if (obj.constructor === Object) obj[curr] = currName + curr;
      }
    }
  });

  return obj;
}

/**
 * field转换为对象
 * @param field 传入filed对象
 * @param getValue 为true将filed转换为js对象，为false时输出以js对象的方式输出field中的名字
 */
export function field2Obj(field: any, getValue: boolean = true) {
  start('field2Obj');
  const answer = _field2Obj(field, getValue);

  pause('field2Obj');
  return answer;
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

const matchLastIndex = (prefix: string) => {
  const foundIndex1 = prefix.match(matchSeparator);
  if (foundIndex1) return foundIndex1[0];
  const foundIndex2 = prefix
    .replace(
      new RegExp('[\\' + ARRAY_SEPARATOR + '\\' + OBJECT_SEPARATOR + ']+$'),
      ''
    )
    .match(matchSeparator);
  if (foundIndex2) return foundIndex2[0];
  throw Error(prefix + ' is not contained a right prefix info');
};

type formObj = any;
export function setField(
  formData: any,
  method: (formData: formObj) => formObj
) {
  const obj = obj2Field(method(field2Obj(formData)));
  return obj;
}

/**
 * form排序
 * @param l 之前的位置
 * @param r 之后的位置
 * @param formData formData
 */
export function formSort(basePath: any, l: number, r: number, formData: any) {
  return setField(formData, obj => {
    const path = basePath[INDEX_NAME].split(
      new RegExp('[' + ARRAY_SEPARATOR + '|' + OBJECT_SEPARATOR + ']', 'g')
    );
    const target = [obj, ...path].reduce((sum, cur) => sum[cur]);
    const tmp = target.splice(l, 1);
    target.splice(r, 0, tmp[0]);
    return obj;
  });
}
export function _formSort(basePath: any, l: number, r: number, formData: any) {
  let _formData = { ...formData };
  // console.log(formData, _formData);
  for (let i = l < r ? l : l - 1; ; ) {
    if (
      basePath[i][INDEX_NAME] === undefined &&
      basePath[i + 1][INDEX_NAME] === undefined
    ) {
      const leftIndex = (basePath[i] && basePath[i][INDEX_NAME]) || basePath[i];
      const rightIndex =
        (basePath[i + 1] && basePath[i + 1][INDEX_NAME]) || basePath[i + 1];

      const tmp = _formData[leftIndex];
      _formData[leftIndex] = _formData[rightIndex];
      _formData[rightIndex] = tmp;
    } else {
      const leftPrefix = basePath[i][INDEX_NAME];
      const rightPrefix = basePath[i + 1][INDEX_NAME];
      // const leftIndex = leftPrefix.match(matchSeparator);
      // const rightIndex = rightPrefix.match(matchSeparator);
      const leftIndex = matchLastIndex(leftPrefix);
      const rightIndex = matchLastIndex(rightPrefix);
      const prefix = rightPrefix.replace(matchSeparator, '');
      console.log(leftPrefix, rightPrefix, prefix);
      console.log(i, basePath[i], prefix, leftIndex, rightIndex);
      return;
      _formData = exchangeData(prefix, leftIndex, rightIndex, _formData);
    }
    if (l < r) i++;
    else i--;
    if (l < r && i >= r) break;
    else if (l > r && i < r) break;
  }

  return _formData;
}

function splitName(whole: string, pre: string) {
  const index = whole
    .replace(pre, '')
    .replace(
      new RegExp('[\\${OBJECT_SEPARATOR}\\${ARRAY_SEPARATOR}][\\S]*$'),
      ''
    );
  return [pre, index, whole.replace(pre + index, '')];
}

/**
 * 交换data，交换过程有副作用的操作，输出没有
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
  console.log(leftPrefix, leftIndex, rightIndex, prefix);
  Object.keys(formData).forEach(item => {
    if (item.match(prefix)) {
      const [pre, mid, end] = splitName(item, leftPrefix);
      console.log('>>>', pre, mid, end);
      const tmp = _formData[pre + (leftIndex + '') + end];
      _formData[pre + (leftIndex + '') + end] =
        _formData[pre + (rightIndex + '') + end];
      _formData[pre + (rightIndex + '') + end] = tmp;
    }
  });
  return _formData;
}

/**
 * 截断path
 * @param dataPath
 */
function genNames(dataPath: string) {
  const reg = /\]\[|\]\.|[\[\]\.]/g;
  return { names: dataPath.split(reg), types: dataPath.match(reg) || [] };
}

/**
 * 截断path
 * @param dataPath
 */
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

/**
 * 设置form条目的值
 * @param dataPath
 * @param data
 * @param formData
 */
export function setFormItem(basePath: any, data: any, formData: any) {
  console.log(basePath);
  const path = basePath[INDEX_NAME].split(
    new RegExp('[' + ARRAY_SEPARATOR + '|' + OBJECT_SEPARATOR + ']', 'g')
  );
  const last = path.splice(path.length - 1, 1)[0];
  const obj = field2Obj(formData);
  const target = [obj, ...path].reduce((sum, cur) => sum[cur]);
  target[last] = data;
  return obj2Field(obj);
}
export function _setFormItem(dataPath: any, data: any, formData: any) {
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

/**
 * 删除指定item
 * @param dataPath
 * @param fieldName
 * @param formData
 */
export function rmFormItem(dataPath: any, fieldName: any, formData: any) {
  dataPath = dataPath[INDEX_NAME] ? dataPath[INDEX_NAME] : dataPath;
  let _formData = { ...formData };
  const { names, types } = genNames(dataPath);

  if (types[types.length - 1] === ARRAY_SEPARATOR) {
    const lastName = dataPath.replace(
      new RegExp(`\\${ARRAY_SEPARATOR}\\d$`),
      ''
    );
    const [...nameWithoutLastOne] = names;
    nameWithoutLastOne.pop();
    const target = [fieldName, ...nameWithoutLastOne].reduce(
      (pre, cur) => pre[cur]
    );
    if (
      target.length > 1 &&
      (names[names.length - 1] as any) - 0 !== target.length - 1
    ) {
      _formData = formSort(
        target,
        (names[names.length - 1] as any) - 0,
        target.length - 1,
        _formData
      );
      dataPath = lastName + types[types.length - 1] + (target.length - 1);
    }
  }

  const path = genPath(dataPath);
  const newData = {} as any;
  const pathRegExp = path.replace(
    new RegExp(`[\\${OBJECT_SEPARATOR}\\${ARRAY_SEPARATOR}]`, 'g'),
    item => '\\' + item
  );

  const reg = new RegExp(
    `^${pathRegExp}$|^${pathRegExp}[\\${OBJECT_SEPARATOR}\\${ARRAY_SEPARATOR}]`
  );
  Object.keys(_formData).forEach(item => {
    // if (!item.match(new RegExp('^' + pathRegExp + '$'))) {
    if (!item.match(reg)) {
      newData[item] = _formData[item];
    }
  });
  return newData;
}

/**
 * 插入数据到数组中
 * @param dataPath
 * @param index
 * @param data
 * @param formData
 */
export function insertToForm(
  dataPath: any,
  index: number,
  data: any,
  formData: any
) {
  if (index < 0) throw 'The parameter `index` can NOT less than 0!';

  const maxLen = dataPath.length;
  index = maxLen < index ? maxLen : index;
  const _dataPath = dataPath[INDEX_NAME] + ARRAY_SEPARATOR + maxLen;

  const _formData = { ...formData, ...setFormItem(_dataPath, data, formData) };
  if (maxLen === index) return _formData;
  const fieldName = field2Obj(_formData, false);
  const targetPath = [
    fieldName,
    ...dataPath[INDEX_NAME].split(
      new RegExp(`\\${ARRAY_SEPARATOR}|\\${OBJECT_SEPARATOR}`, 'g')
    ),
  ].reduce((pre, curr) => pre[curr]);
  return formSort(targetPath, maxLen, index, _formData);
}

// const testWithEmptyObject = {//   j: [[undefined, { a: '' }, {}, 3]],
// };
// const formData = obj2Field(testWithEmptyObject);

// const testData = {
//   a: [
//     0,
//     '70',
//     null,
//     undefined,
//     { a: '' },
//     {},
//     3,
//     () => {},
//     1,
//     '2',
//     {},
//     undefined,
//     null,
//     0,
//     NaN,
//     0,
//     null,
//     undefined,
//     {},
//     '2',
//     1,
//     [],
//     [[[]]],
//     [],
//     {},
//     [],
//     [],
//     undefined,
//     [[]],
//     null,
//   ],
// };

// const testData = {
//   a: [
//     0,
//     '70',
//     null,
//     // undefined,
//     // { a: '' },
//     // {},
//     3,
//     () => {},
//     1,
//     '2',
//     // {},
//     undefined,
//     null,
//     0,
//     NaN,
//     0,
//     null,
//     undefined,
//     // {},
//     '2',
//     1,
//     // [],
//     // [[[]]],
//     // [],
//     // {},
//     // [],
//     // [],
//     undefined,
//     // [[]],
//     // null,
//   ],
// };

// const testData = {
//   a: [
//     undefined,
//     { a: '' },
//     {},
//     { d: [] },
//     {},
//     [],
//     [[[]]],
//     [],
//     {},
//     [{}],
//     [],
//     [[]],
//     null,
//   ],
// };

// console.log(testData);
// const path = field2Obj(formData, false);
// const afterSort = formSort(path.a, path.a.length - 1, 0, formData);
// const backToObject = field2Obj(afterSort);

// const _answer = [...testData.a];
// const middle = _answer.splice(0, _answer.length - 1);
// const answer = { a: [..._answer, ...middle] };

// console.log( backToObject, answer);

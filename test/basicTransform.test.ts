import {
  obj2Field,
  field2Obj,
  _field2Obj,
  formSort,
  insertToForm,
  rmFormItem,
  setFormItem,
  setField,
} from '../src/dm-form/formDataCreator';

import {
  toIndexed,
  toStore,
  changeStore,
} from '../src/dm-form/indexedDataStructure';

function compare(left: any, right: any) {
  if (typeof left === typeof right) {
    if (left === undefined || left === null) return false;
  } else return true;
  if (left.constructor !== right.constructor) return true;
  if (left.constructor !== Array && left.constructor !== Object) {
    if (left !== right) {
      console.log(left, right);
      return true;
    }
    return false;
  }
  const lKey = Object.keys(left);
  const rKey = Object.keys(right);
  if (lKey.length !== rKey.length) return true;
  const setTest = new Set([...lKey, ...rKey]);
  if (setTest.size !== lKey.length || setTest.size !== rKey.length) return true;
  for (let i = 0; i < lKey.length; i++) {
    if (compare(left[lKey[i]], right[rKey[i]])) {
      console.log(left[lKey[i]], right[rKey[i]], i);
      return true;
    }
  }
  return false;
}

const testData = {
  a: 'a',
  b: 1,
  c: /hey/,
  d: undefined,
  e: null,
  f: NaN,
  g: 0,
  h: [],
  i: {},
  j: [
    1,
    2,
    'yo',
    null,
    undefined,
    {},
    NaN,
    0,
    [0, '70', null, undefined, { a: '' }, {}, 3, compare],
    [],
    {},
    [[{}]],
    [[[{}]]],
    [new Date()],
    new Date(),
  ],
  k: {
    l: 1,
    m: '2',
    n: /asdf/,
    o: undefined,
    p: null,
    q: NaN,
    r: 0,
    s: {},
    t: {
      u: undefined,
    },
    v: [],
    w: [1, '2', {}, undefined, null, 0, NaN, 0, null, undefined, {}, '2', 1],
    x: compare,
    y: [[[]]],
    z: { s: [[], {}, []], d: [[]], e: [[], undefined, [[]], null] },
  },
};

test('object to form to object complicated', () => {
  const formData = obj2Field(testData);
  const backToObject = field2Obj(formData);
  expect(backToObject).toMatchObject(testData);
});

test('objetct to form to object complicated with indexed data structure', () => {
  let [index, store] = toIndexed(testData);
  store = toStore(index, store);
  expect(store).toMatchObject(testData);
});

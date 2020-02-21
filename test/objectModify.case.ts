const compare = () => {};

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

/**
 * 简单排序
 * @param testData
 */
export const deleteProperty = () => [
  'simple sort',
  () => {
    const answer = { ...testData };
    delete answer.a;
    return answer;
  },
];

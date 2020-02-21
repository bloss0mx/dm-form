import testFrame from './testFrame';

import * as sortTestCase from './sortArray.case';

const testData = {
  a: [
    0,
    '70',
    null,
    undefined,
    { a: '' },
    {},
    3,
    () => {},
    1,
    '2',
    {},
    undefined,
    null,
    0,
    NaN,
    0,
    null,
    undefined,
    {},
    '2',
    1,
    [],
    [[[]]],
    [],
    {},
    [],
    [],
    undefined,
    [[]],
    null,
  ],
};

testFrame(sortTestCase as any, testData);

// test('object to form to object complicated', () => {
//   stringIndexedTest(testData, simplySort);
// });

// test('object to form to object complicated', () => {
//   IndexedTest(testData, simplySort);
// });

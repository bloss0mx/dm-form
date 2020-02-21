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

const testFrame_StringIndexedData = (
  testData: any,
  testMethod: (testData: any) => any
) => {
  const formData = obj2Field(testData);
  const afterModify = setField(formData, testMethod);
  const backToObject = field2Obj(afterModify);
  return [backToObject, testMethod(testData)];
};

const testFrame_IndexedDataStructure = (
  testData: any,
  testMethod: (testData: any) => any
) => {
  const [index, store] = toIndexed(testData);
  const [_index, _store] = changeStore(index, store, testMethod);
  const backToObject = toStore(_index, _store);
  return [backToObject, testMethod(testData)];
};

const stringIndexedTest = (
  testMethod: (testData: any) => any,
  testData?: any
) => {
  const [backToObject, answer] = testFrame_StringIndexedData(
    testData,
    testMethod
  );
  expect(backToObject).toMatchObject(answer);
};

const IndexedTest = (testMethod: (testData: any) => any, testData?: any) => {
  const [backToObject, answer] = testFrame_IndexedDataStructure(
    testData,
    testMethod
  );
  expect(backToObject).toMatchObject(answer);
};

interface testCase {
  [name: string]: () => [string, (testData: any) => any];
}

export default (testCase: testCase, testData?: any) => {
  Object.keys(testCase).map(item => {
    const [info, method] = testCase[item]();

    test('[string indexed]: ' + info, () => {
      stringIndexedTest(method, testData);
    });
    test('[indexed data]: ' + info, () => {
      IndexedTest(method, testData);
    });
  });
};

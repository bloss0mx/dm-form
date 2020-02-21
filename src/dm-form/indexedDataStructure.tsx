export const ARRAY_SEPARATOR = '[';
export const OBJECT_SEPARATOR = '{';
export const INDEX_NAME = '__idx__';

let __index__ = 0;
function indexGenerator() {
  return __index__++;
}

export function _toIndexed(obj: any, store: any, answer: any = {}) {
  if (obj === undefined || obj === null) return obj;
  const keys = Object.keys(obj);

  for (const i of keys) {
    let target = {};
    const indexName = indexGenerator();
    if (obj[i] === undefined || obj[i] === null) {
    } else if (obj[i].constructor === Object) {
      target = _toIndexed(obj[i], store, {});
    } else if (obj[i].constructor === Array) {
      target = _toIndexed(obj[i], store, []);
    }
    store[indexName] = obj[i];

    Object.defineProperty(target, INDEX_NAME, {
      enumerable: false,
      configurable: false,
      writable: true,
      value: indexName,
    });

    answer[i] = target;
  }
  return answer;
}

export function toStore(index: any, store: any, answer: any = {}) {
  if (index === undefined || index === null) return index;

  const keys = Object.keys(index);
  for (const i of keys) {
    if (index[i].constructor === Object && Object.keys(index[i]).length !== 0) {
      answer[i] = toStore(index[i], store, {});
    } else if (
      index[i].constructor === Array &&
      Object.keys(index[i]).length !== 0
    ) {
      answer[i] = toStore(index[i], store, []);
    } else {
      answer[i] = store[index[i][INDEX_NAME]];
    }
  }
  return answer;
}

type formObj = any;
export function changeStore(
  _index: any,
  formData: any,
  method: (formData: formObj) => formObj
) {
  return toIndexed(method(toStore(_index, formData)));
}

export function toIndexed(obj: any): [any, any] {
  const store = {};
  const index = _toIndexed(obj, store);
  return [index, store];
}

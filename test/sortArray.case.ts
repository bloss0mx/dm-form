/**
 * 简单排序
 * @param testData
 */
export const simplySort = () => [
  'simple sort',
  (testData: any) => {
    const _answer = [...testData.a];
    const middle = _answer.splice(0, _answer.length - 1);
    const answer = { a: [..._answer, ...middle] };
    return answer;
  },
];

export const simplySortBack = () => [
  'simple sort back',
  (testData: any) => {
    const _answer = [...testData.a];
    const middle = _answer.splice(_answer.length - 1, 0);
    const answer = { a: [...middle, ..._answer] };
    return answer;
  },
];

let count = 0;
function genHash() {
	return count++;
}

/**
 * 对象转换为field
 * @param obj
 * @param preName
 */
function obj2Field(obj, preName = '') {
	let data = {};
	if (obj.constructor === Array) {
		const preFix = preName === '' ? '' : preName + '_';
		for (const v in obj) {
			if (obj.hasOwnProperty(v)) {
				data = { ...data, ...obj2Field(obj[v], preFix + genHash()) };
			}
		}
	} else if (obj.constructor === Object) {
		const preFix = preName === '' ? '' : preName + '$';
		for (const v in obj) {
			if (obj.hasOwnProperty(v)) {
				data = { ...data, ...obj2Field(obj[v], preFix + v) };
			}
		}
	} else {
		data[preName] = { value: obj };
	}
	return data;
}

/**
 * 按层获取path信息
 * @param name
 */
function nameDealer(name = '') {
	const curr = name.match(/^[^_\$]+/);
	const rmedCurr = name.replace(/^[^_\$]+/, '');
	const symbol = rmedCurr.match(/^[_\$]/);
	const nextLevelName = rmedCurr.replace(/^[_\$]/, '');
	return {
		name,
		curr: (curr && curr[0]) || '',
		symbol: symbol && symbol[0],
		nextLevelName,
	};
}

/**
 * 分解数组
 * @param list
 * @param prefix
 */
function list(list, prefix) {
	const keys1 = Object.keys(list)
		.sort((a, b) => a.localeCompare(b))
		.filter(item => item.match(new RegExp('^' + prefix)));

	return ([{ curr: undefined, answer: [] }, ...keys1] ).reduce(
		(sum, item) => {
			const newSum = { ...sum };
			const matched1st = item.replace(new RegExp('^' + prefix + '[$_]'), '');
			const matched2nd = matched1st.replace(/^[^$_]+/, '').match(/^[$]/);
			if (
				(matched1st && matched1st.match(/^[^$_]+/)[0] !== newSum.curr) ||
				newSum.curr === undefined
			) {
				newSum.curr = item
					.replace(new RegExp('^' + prefix + '[$_]'), '')
					.match(/^[^$_]+/)[0];
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


/**
 * field转换为对象
 * @param field
 * @param container
 * @param getValue
 */
function field2Obj(
  field,
  getValue = true,
  container = {},
  currName = ''
) {
  let obj; // 本层容器
  const keys = Object.keys(field).sort((a, b) => a.localeCompare(b));
  if (container.constructor === Array) {
    obj = [];
  } else if (container.constructor === Object) {
    obj = {};
  }
  let nextField = {}; // 下层容器

  keys.forEach((v, index) => {
    const { curr, symbol, nextLevelName } = nameDealer(v);
    const nextCurr = nameDealer(keys[index + 1] || '').curr;
    if (symbol) {
      // 有后继 深入
      nextField[nextLevelName] = field[v];
      if (curr !== nextCurr || index === keys.length - 1) {
        // 本层不同
        if (symbol === '$') {
          // 对象
          if (obj.constructor === Array)
            obj.push(
              field2Obj(nextField, getValue, {}, currName + curr + symbol)
            );
          else if (obj.constructor === Object) {
            if (obj[curr] === undefined) obj[curr] = {};
            obj[curr] = {
              ...obj[curr],
              ...field2Obj(nextField, getValue, {}, currName + curr + symbol)
            };
          }
        } else if (symbol === '_') {
          // 数组
          if (obj.constructor === Array)
            obj.push(
              field2Obj(nextField, getValue, [], currName + curr + symbol)
            );
          else if (obj.constructor === Object) {
            if (obj[curr] === undefined) obj[curr] = [];
            obj[curr] = [
              ...obj[curr],
              ...field2Obj(nextField, getValue, [], currName + curr + symbol)
            ];
          }
        }
        nextField = {};
      }
    } else {
      // 无后继 直接赋值
      if (getValue) {
        if (obj.constructor === Array) obj.push(field[v].value);
        else if (obj.constructor === Object) obj[curr] = field[v].value;
      } else {
        if (obj.constructor === Array) obj.push(currName + curr);
        else if (obj.constructor === Object) obj[curr] = currName + curr;
      }
    }
  });
  return obj;
}

const field = obj2Field({
	userInfo: [
		{
			name: 'qwer',
			pwd: 'asdf'
		},
		{
			name: 'zxcv',
			pwd: '1234'
		}
	],
	errorTest: [1, 2, 3, 4],
	code: ['asdf', 'qwer', 'zxcv'],
	username: "niubiguai",
	password: "123456",
	ayeaye: "12",
	nyeney: "23",
	ayeayehao: "asdf",
	test: "qwer",
	tedst: "zxcv",
	qewr: true,
	email: "rewq",
	emaild: "niubi@163.com",
	uu: "niubi",
	select: "aye",
	vihcle: "",
	auto: "yo"
});
console.log(field);
const nameTree = field2Obj(field, 0);
console.log(nameTree);
console.log(nameTree.userInfo[0].name);
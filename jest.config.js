module.exports = {
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(test/.*(\\.|/)(test))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};

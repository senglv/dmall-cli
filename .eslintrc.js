module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends:
  [
    'standard',
    // 'plugin:prettier/recommended',
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'array-bracket-spacing': [
      2,
      'never',
    ], // 是否允许非空数组里面有多余的空格
    'no-var': 0,
    'comma-spacing': 0, // 逗号前后的空格
    quotes: [
      1,
      'single',
    ], // 引号类型 `` "" ''
    complexity: [
      0,
      11,
    ], // 循环复杂度
    // 换行风格unix(\n)
    'linebreak-style': [
      'error',
      'unix',
    ],
    // 允许大括号内使用空格
    'object-curly-spacing': [
      'error',
      'always',
    ],
    // 要求使用 const 声明那些声明后不再被修改的变量
    'prefer-const': [
      'error',
      {
        destructuring: 'all',
      },
    ],
    // 使用模板字面量而非字符串连接
    'prefer-template': 'error',
    'no-delete-var': 0,// 不能对var声明的变量使用delete操作符
    'prefer-reflect': 'error',
    // *号后面使用空格
    'generator-star-spacing': [
      'error',
      'after',
    ],
    // 最大长度120
    'max-len': [
      'warn',
      {
        code: 160,
      },
    ],
    // 要求使用分号代替 ASI
    // 自动分号插入的机制(Automatic Semicolon Insertion)，简称 ASI，这是一个辅助性的功能
    semi: [
      'error',
      'always',
    ],
    // 当最后一个元素或属性与闭括号 ] 或 } 在 不同的行时，要求使用拖尾逗号；当在 同一行时，禁止使用拖尾逗号
    'comma-dangle': [
      'error',
      'always-multiline',
    ],
    // ()前后有空格
    'space-before-function-paren': [
      'error',
      {
        asyncArrow: 'always',
        anonymous: 'never',
        named: 'never',
      },
    ],
  },
};

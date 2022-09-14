module.exports = {
  '*': {
    alias: '',
    description: 'command not found',
    examples: [],
  },
  upload: {
    alias: 'u',
    description: 'upload miniprogram',
    examples: [
      'dmall upload',
    ],
  },
  changeEnv: {
    alias: 'ce',
    description: 'change env',
    examples: [
      'dmall ce',
    ],
  },
  asyncComponents: {
    alias: 'ac:dev',
    argument: 'development',
    description: 'async components, 参数 dev 或 prod指明环境',
    examples: [
      'dmall ac:dev dev',
    ],
  },
};

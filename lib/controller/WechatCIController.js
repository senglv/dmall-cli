/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 *
 * Created by Hallmader on 2021/12/5
 */
const inquirer = require('inquirer');

class WeChatCIController {
  constructor(config) {
    this.config = config;
  }

  // 选择体验版/预览版
  async getProjectMode() {
    const modeAnswer = await inquirer.prompt({
      name: 'mode',
      message: '请选择体验版还是预览版。',
      type: 'list',
      choices: [
        '体验版',
        '预览版',
      ],
    });
    return modeAnswer;
  }

  // 选择环境
  async getProjectEnv() {
    const envAnswer = await inquirer.prompt({
      name: 'env',
      message: '请选择小程序环境。',
      type: 'list',
      choices: [
        'online',
        'test',
        'uat',
      ],
    });
    return envAnswer;
  }

  // 请输入版本号
  async getProjectVersion() {
    const versionAnswer = await inquirer.prompt({
      name: 'version',
      message: '请输入小程序版本号。',
      type: 'input',
    });
    return versionAnswer;
  }

  // 请输入版本描述
  async getProjectDesc() {
    const descAnswer = await inquirer.prompt({
      name: 'desc',
      message: '请输入小程序版本描述',
      type: 'input',
    });

    return descAnswer;
  }
}

module.exports = WeChatCIController;

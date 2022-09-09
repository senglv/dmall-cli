/**
 * @Desc:
 * @Usage:
 * @Notify:
 * @depend:
 *
 *
 * Created by K.L.Qiang on 2022/6/30
 */
const log = console.log;
const inquirer = require('inquirer');
const figlet = require('figlet');
const chalk = require('chalk');
const { questions } = require('../constant.json');

const AutoExtBuildController = require('../controller/AutoExtBuildController');

const SourceCodeController = require('../controller/SourceCodeController');

const { loading ,getEvt } = require('../utils/index');
const autoExtBuildController = new AutoExtBuildController();
const sourceCodeController = new SourceCodeController();

module.exports = async () => {
  log(chalk.green('欢迎使用Dmall OS高级版商家小程序开发工具。'));

  // 选择小程序端
  const platformAnswer = await inquirer.prompt(questions.platform);
  console.log(platformAnswer);
  const platformValue = platformAnswer.platform;
  // 选择域名环境
  const domainAnswer = await inquirer.prompt(questions.domain);
  let domain = 'dmall.com';
  if (domainAnswer.domain.includes('dmall-os.cn')) domain = 'dmall-os.cn'; // eslint-disable-line
  // 选择环境
  const envAnswer = await inquirer.prompt(questions.env);
  const envValue = envAnswer[questions.env.name];
  // 通过租户ID选择商家
  const vendorAnswer = await inquirer.prompt(questions.uniqueCode);
  const uniqueCode = vendorAnswer[questions.uniqueCode.name];

  // 获取erp配置的ext.JSON数据
  let fullBuildParams;

  if (uniqueCode === 'dmmp') {
    fullBuildParams = sourceCodeController.getDMMPExtJson(envValue);
  } else if (uniqueCode === 'wum-pt') {
    fullBuildParams = sourceCodeController.getWumPtExtJson(envValue);
  } else {
    const getyUniqueCodeParams = {
      uniqueCode: `${uniqueCode}_${platformValue === '微信' ? 'wx' : 'alipay'}`,
      evt: getEvt(envValue),
      domain: domainAnswer.domain.includes('os.cn') ? 'os' : 'dmall',
    };
    const getAppletConfigByUniqueCode = async (params) => {
      return autoExtBuildController.getAppletConfigByUniqueCode(params);
    };
    fullBuildParams = await loading(getAppletConfigByUniqueCode,'通过unicode 获取applet...')(getyUniqueCodeParams);
  }
  // 更新开发源码部分
  await sourceCodeController.injectDevEnvConfig(fullBuildParams, envValue);

  log(chalk.green(`本地开发环境已切换至${domainAnswer.domain.includes('os.cn') ? '非物美系' : '物美系'}${envValue}环境，即将使用${fullBuildParams.venderName || fullBuildParams.vendorName}商家${platformValue}小程序配置信息。`));
  log(chalk.green('开发环境自动剔除所有插件配置，如果需要请手动添加。'));
  log(chalk.green(figlet.textSync('happy coding～', { horizontalLayout: 'full' })));
};

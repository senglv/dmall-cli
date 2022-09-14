const clear = require('clear');
const log = console.log;
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
let exec = require('child_process').exec;
const ci = require('miniprogram-ci');
const { promisify } = require('util');
const { minidev, useDefaults } = require('minidev');
exec = promisify(exec);
const {
  removePluginsConfig, downloadImageToLocal,
} = require('../../template.build.plus');
const { config, questions, templateList } = require('../constant');
const { checkNodeVersion,loading ,getEvt } = require('../utils/index');
checkNodeVersion();

const FeiShuRobot = require('../controller/FeiShuRobotController');
const AutoExtBuildController = require('../controller/AutoExtBuildController');
const autoExtBuildController = new AutoExtBuildController();

const SourceCodeController = require('../controller/SourceCodeController');
const sourceCodeController = new SourceCodeController();
module.exports = async () => {
  clear();
  log(chalk.green('欢迎使用Dmall OS专业版商家小程序上传工具。'));
  // 选择小程序端
  const platformAnswer = await inquirer.prompt(questions.platform);
  const platformValue = platformAnswer.platform;
  global.platformValue = platformValue === '微信' ? 'mp-weixin' : 'mp-alipay';
  // 选择域名环境
  const domainAnswer = await inquirer.prompt(questions.domain);

  let domain = 'dmall.com';
  if (domainAnswer.domain.includes('dmall-os.cn')) domain = 'dmall-os.cn';
  // 选择模板
  let templateValue = '微信主小程序';
  if (platformValue === '支付宝') {
    templateValue = '支付宝主小程序';
  }
  // const templateAnswer = await inquirer.prompt(questions.template);
  // const templateValue = templateAnswer[questions.template.name];
  // 选择环境
  const envAnswer = await inquirer.prompt(questions.env);
  const envValue = envAnswer[questions.env.name];
  // 获取模板配置
  const projectConfig = config[envValue];
  // 通过租户ID选择商家
  const vendorAnswer = await inquirer.prompt(questions.uniqueCode);
  const uniqueCode = vendorAnswer[questions.uniqueCode.name];

  let needPlugins = false;
  // 是否需要使用直播插件
  if (platformValue === '微信') {
    const needPluginsAnswer = await inquirer.prompt(questions.plugins);
    needPlugins = needPluginsAnswer.plugins;
  }

  // 获取erp配置的ext.JSON数据
  const getAppletConfigByUniqueCode = async (params) => {
    return autoExtBuildController.getAppletConfigByUniqueCode(params);
  };
  const getyUniqueCodeParams = {
    uniqueCode: `${uniqueCode}_${platformValue === '微信' ? 'wx' : 'alipay'}`,
    evt: getEvt(envValue),
    domain: domainAnswer.domain.includes('os.cn') ? 'os' : 'dmall',
  };
  const fullBuildParams = await loading(getAppletConfigByUniqueCode,'通过unicode 获取applet...')(getyUniqueCodeParams);

  // console.log('fullBuildParams',fullBuildParams);
  // 如果没获取到，说明你还没配置好
  if (!fullBuildParams) {
    log(
      chalk.red(
        `错误！未获取到唯一编码为${uniqueCode}的商家小程序配置，请确认是否输入错误，或者该小程序尚未在erp创建！`,
      ),
    );
    process.exit(1);
  }
  await sourceCodeController.injectDevEnvConfig(fullBuildParams, envValue);

  const extJson = JSON.parse(fullBuildParams.buildParamJson || '{}');
  const { tenantId } = fullBuildParams;
  const venderName = fullBuildParams.venderName || fullBuildParams.vendorName;
  log(chalk.yellow(`您已选择商家为${venderName}，该商家租户ID为${tenantId}。本地源码配置已更新。`));

  const ensureAnswer = await inquirer.prompt({
    name: 'ensure',
    type: 'confirm',
    message: `您即将上传的模板为${templateValue}模板，环境为${envValue}，域名环境为${domainAnswer.domain}。\n即将开始打包编译，是否确定？`,
  });

  const ensureValue = ensureAnswer.ensure;

  if (ensureValue) {
    const { stdout: installStdout, stderr: installStderr } = await loading(exec,'开始更新Npm依赖...')('npm cache clean --force && npm install');
    if (installStderr) { console.log(installStderr); }
    if (installStdout) {
      log(chalk.green('更新完成。'));
      const { stdout: buildStdout, stderr: buildStderr } = await loading(exec,'开始编译Build包...')(`npm run build${platformValue === '支付宝' ? 'my' : ''}:${domain.includes('os.cn') ? 'os' : 'dmall'}`);
      if (buildStderr) { console.log(buildStderr); }
      if (buildStdout) {
        log(chalk.green(`${platformValue}小程序编译成功。`));
        log(chalk.green('即将处理插件，写入icon配置...'));
        const injectResult = await loading(downloadImageToLocal,'tabbar写入...')(extJson.tabBar);

        if (!injectResult) {
          log(chalk.red('tabbar写入失败...'));
        }
        const pluginConfigResult = await loading(removePluginsConfig,'预处理...')(envValue, needPlugins);
        if (pluginConfigResult) {
          log(chalk.green('预处理工作完成。即将执行上传工作...'));
        }

        // try
        try {
          log(chalk.green('正在上传...'));
          if (platformValue === '微信') {
            try {
              const project = new ci.Project(projectConfig);
              const uploadResult = await ci.upload({
                project,
                version: templateList[templateValue],
                desc: `商家名称：${venderName}，租户Id${tenantId}，域名环境${domainAnswer.domain}，${templateList[templateValue]}模板`,
                setting: {
                  minifyJS: true,
                  minifyWXML: true,
                  minifyWXSS: true,
                  minify: true,
                  autoPrefixWXSS: true,
                },
                robot: Math.ceil(Math.random() * 30),
                onProgressUpdate() {
                },
              });
              console.log(uploadResult);
              log(chalk.green('模板上传成功！请前往erp服务商平台构建体验版，或关注部门群的机器人消息卡片'));
              log(chalk.green('上线/提测顺利~'));

              const feiShuRobot = new FeiShuRobot();
              await feiShuRobot.sendCardToGroup({
                vendorName: venderName,
                dmTenantId: tenantId,
                templateName: templateList[templateValue],
                env: envValue,
                platform: platformValue,
                domainName: domainAnswer.domain,
                uniqueCode,
              });
            } catch (e) {
              console.log(e);
            }
          } else if (platformValue === '支付宝') {
            useDefaults({
              config: {
                defaults: {
                  'alipay.authentication.privateKey': 'MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDPslTjYXBxaqdQhJToQDVp6N1/gfbxj2zec8h92eQMxEOhu4dJo0YbT5bEtFt+v1UoGZoMZJVqxRIs2VLHd9dEcS3QgT94mX1lNsVv7uuKRzkxh4zLbYIib9OLJApVWEszSRwLYYk2FPpw/LVHD9q7gXta4/sHa/OQz0KFAVX9ay0VgRfkf21jFptgS9f77icP0iQaVHVLwJcPO6K3N6MQhjDB49DxyVhp8ytazRmGXBk59uVx95KLEOpuJR/djpUW6Tnx9hssPCniuRgjsgYQ4VbHM0u307qX2Qw81S4UW3mjQctHDXbOTLztIL2zCZvbtKkOhyshXUkhObNwFZVzAgMBAAECggEBAMv/iqUzJXAgo2nQbzmXJ195G2WLz3L/vpzX+Eq0YuuvMgZ+3KiVN9zHVXyq8VsSrp+OVeJqQN/35JwscMP+j29oAunSqPbZO3LYUyBX+P1+a0ycqMt+Kd2NHKiDo6qj6GjdHDCJgm2eOUYU0DCV/+8/hFuHpR5rB3ZqPBnLcBxRDZhVxevpEdcbQMYYBL2bXcrBjge6U24DUOxuIXmubFC8fAUfHNY+peMMp7mV5+wSLTual5dX4Zuc7tu0qsJrcudqepjvCAbTweR5O1FhGd27Ev4pS8FN5Iuqb9dWryxoxV0impZZ2ZKHxJeM85XevubyZRf4losVgHvEIRwD6lECgYEA6gjDPMcw5SnXo5xG2hUib2oFptiW0fZ9MIpzIlahNDzeoslrlpZWfwcjBPrbqtCjk0ricXuslFhPjKhYieYV1ctmF/YPd0NyR70mm8desQWPy+bA/AP8Pe35lP69yB6u3V34CnwlsG1+X9IGeRDTpnZxDmD/DvYz3Gqeuin2mU0CgYEA4zC+d6SPlMAgNcsw3OLLYrzwiq2WfeBSBCcCVeM/p5T/XzHQR3GytBc/bnP/I6HJopG5bCbIYFQ3Oh7GUPIDrsdsHymjVF6m7jpeE93GhG5RhAgIUwx7kio/L7aFZG+kMCLc/bFU20mpnJbuuzNtCX0W0qw0Yk70Z6hPP33Lib8CgYEAqOb+EKUpcppKGLg2ojnSiloYDhwObSXZn+irw0KGQS8U9qMrVJjXgAHkkjmBw7uj8i9/UauSF9XMQ5VToOI/K/cJjY12B/rTRVcLwC2Y92UuLFgzOy6dIwzWrWNUEFOkm/qvgtGqWbQMGpd3OHSea2rbmScDrQae0xrXxz91y5kCgYBmnWCaJ5DWjgS+Z11Vl3ZnzZEUAh3EEyrYR0pNwsvAhJLny1cYvekKYKm82NW3oV6yeAF5MPc2UzNyo+3NJ9K0Acz7MlJcTDg3x9MwQ+5jaHSXHw2rfSrfNQe/JECRwb82IrkQOSVrupTKbn27vhmUvJQvaaprcOABZcsNkWL6fwKBgQDKr7LNnyTnYdXFFL3QJnM6MslsCc7wiZlN8/6jXATWNAfjh2tvjyq9oBKt7cLIrw0F0Fhl395h/9FkQ11+uSbma4FrRo1h2SUC7RebgTBTB4/w5FzrAzI4f3Qo5iyCu1ZGXNUZOe5WLigX/gaQykjOgnfK3yWMTsXdt7kq9Gpa8w==',
                  'alipay.authentication.toolId': '72fc8eecfb184140806b11d619b89713',
                },
              },
            });
            const appConfig = {
              test: '2021003129698277',
              uat: '',
              online: '2021003129663368',
            };
            try {
              await minidev.upload({
                appId: appConfig[envValue],
                project: path.join(process.cwd(), '/dist/build/mp-alipay-template'),
              }, {
                onLog: (data) => {
                  // 输出日志
                  console.log(data);
                },
              });
              log(chalk.green('模板上传成功！请前往erp服务商平台构建体验版，或关注部门群的机器人消息卡片'));
              log(chalk.green('上线/提测顺利~'));

              const feiShuRobot = new FeiShuRobot();
              await feiShuRobot.sendCardToGroup({
                vendorName: venderName,
                dmTenantId: tenantId,
                templateName: templateList[templateValue],
                env: envValue,
                platform: platformValue,
                domainName: domainAnswer.domain,
                uniqueCode,
              });
            } catch (e) {
              console.log(e);
            }
          }
        } catch (e) {
          console.log(e);
        }
      }
    }
  }
};

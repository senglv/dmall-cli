/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 *
 * Created by Hallmader on 2022/1/19
 */
const axios = require('axios');
const execSync = require('child_process').execSync;

class FeiShuRobotController {
  constructor() {
    this.state = {
      webHookRobotPath: 'https://open.feishu.cn/open-apis/bot/v2/hook/81f788b1-637e-4a86-8cdb-6d58cfa37a42',
    };
  }

  getTemplate(params) {
    const {
      vendorName,
      dmTenantId,
      templateName,
      env,
      domainName,
      platform,
      uniqueCode,
    } = params;
    const { name, branch } = this.getGitUserMessage();
    return {
      msg_type: 'interactive',
      card: {
        config: {
          wide_screen_mode: true,
          enable_forward: true,
        },
        header: {
          template: 'purple',
          title: {
            content: '(　ﾟ∀ﾟ) ﾉ 有新的小程序版本了！',
            tag: 'plain_text',
          },
        },
        elements: [{
          content: `**${templateName}构建的${platform}商家小程序已上传至草稿箱。**  \n商家名称：${vendorName} 租户ID：${dmTenantId}。  \n环境为${env}，域名环境为${domainName}  `,
          tag: 'markdown',
        },
        {
          content: `本次构建工作由**${name}**操作，分支为${branch}。 \n如有功能问题，请尽快联系操作人员。  \n如无问题，请前往服务商后台操作构建体验版。`,
          tag: 'markdown',
        },
        {
          content: '对操作不熟悉或有问题？请查阅操作手册 [查看详情>>](https://duodian.feishu.cn/docs/doccnBtj8EXkvsTQ37lMc99BJZd)',
          tag: 'markdown',
        },
        {
          content: '需要配置或更新白名单？来这里复制接口与webview白名单列表 ~ [查看详情>>](https://teststatic.dmall.com/kayak-project/kreator/html/whiteList.html)',
          tag: 'markdown',
        },
        {
          content: `如果感觉配置不方便，也可以使用配置小助手哦 ~ [点我试试>>](https://teststatic.${domainName.includes('os.cn') ? 'dmall-os.cn' : 'dmall.com'}/kayak-project/jimoui/html/ext.html#jimoui/view/ext/ext:uniqueCode=${uniqueCode}_wx&evt=${env})`,
          tag: 'markdown',
        },
        {
          actions: [{
            tag: 'button',
            text: {
              content: '前往服务商后台',
              tag: 'lark_md',
            },
            url: 'http://erp.dmall.com/partner#index/conveniencecabinx/smallprogramConfig',
            type: 'primary',
          }, {
            tag: 'button',
            text: {
              content: '前往Aladdin系统',
              tag: 'lark_md',
            },
            url: 'https://aladdin.dmall.com/#index/aladdin_h5/configManage',
            type: 'primary',

          }, {
            tag: 'button',
            text: {
              content: '前往开放平台',
              tag: 'lark_md',
            },
            url: 'https://open.weixin.qq.com/',
            type: 'default',
            value: {},
          }],
          tag: 'action',
        }],
      },
    };
  }

  getGitUserMessage() {
    return {
      name: execSync('git config --global user.name').toString().trim(),
      email: execSync('git config --global user.email').toString().trim(),
      branch: execSync('git branch --show-current').toString().trim(),
    };
  }

  async sendCardToGroup(params = {}) {
    try {
      await axios.post(this.state.webHookRobotPath, this.getTemplate(params));
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = FeiShuRobotController;

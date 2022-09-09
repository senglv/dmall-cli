/**
 * @Desc:
 * @Usage:
 * @Notify:
 * @depend:
 *
 *
 * Created by K.L.Qiang on 2022/6/30
 */
const path = require('path');
const fs = require('fs-extra');

// const CONSTANT = {

//     SOURCE_TABBAR_FILES_PATH: path.resolve(__dirname, '../../src/services/ext/_venderExt.json'),
//     BUILD_PROJECT_CONFIG_PATH: path.resolve(__dirname, '../../dist/dev/mp-weixin/project.config.json'),
//     SOURCE_TEMPLATE_JSON: path.resolve(__dirname, '../../src/pages.json'),
//     DEV_TEMPLATE_JSON: path.resolve(__dirname, '../../dist/dev/mp-weixin/app.json'),
//   };
const CONSTANT = {

  SOURCE_TABBAR_FILES_PATH: path.join(process.cwd(), '/src/services/ext/_venderExt.json'),
  BUILD_PROJECT_CONFIG_PATH: path.join(process.cwd(), '/dist/dev/mp-weixin/project.config.json'),
  SOURCE_TEMPLATE_JSON: path.join(process.cwd(), '/src/pages.json'),
  DEV_TEMPLATE_JSON: path.join(process.cwd(), '/dist/dev/mp-weixin/app.json'),
};

class SourceCodeController {
  constructor() {// eslint-disable-line
  }

  _changeEnvValue(envValue) {
    switch (envValue) {
      case 'test':
        return 'https://test';
      case 'uat':
        return 'https://dev';
      case 'online':
      default:
        return 'https://';
    }
  }

  getWumPtExtJson(envValue) {
    return {
      evt: envValue,
      tenantId: '14',
      authorizerAppid: 'wx33ae6c8a013dd900',
      venderName: '物美社区购',
      appletUniqueCode: 'wum-pt_wx',
      buildParamJson: JSON.stringify({
        trackProject: 'wumei_pt_mini',
        scene: 'group',
        platform: '16',
        mainColor: '#005BAB',
        secondColor: '#EB413D',
        iconColor: '#005BAB',
        graColor: '#0094D5',
        shortLinkPlatform: 'mpwumei',
        showPayCode: 'false',
        payPlatform: 'WechatCGMiniProgram',
        appletType: '3',
        uniqueCode: 'wum-pt_wx',
        shareContext: '逛超市 来物美',
        shareImgUrl: 'https://img.dmallcdn.com/dshop/202107/de1f4188-7599-4b3c-9d14-d71715ac351c',
        applyShareImgUrl: 'https://img.dmallcdn.com//dshop/202001/4436f934-7266-4008-af78-c0e456ba209e',
        venderLogoUrl: 'https://img.dmallcdn.com/dshop/202107/0bd00b23-00f6-4e31-bb05-f4f1b036dc7d',
        venderName: '物美社区购',
        goodSharePromotionImg: 'https://img.dmallcdn.com/dshop/202103/041fddfa-db69-40ea-bed7-d85acf5c2b98',
        goodShareImg: 'https://img.dmallcdn.com/dshop/202103/c44618c8-6e69-48db-af59-56aa21a00984',
        cartTitle: '物美社区购',
        categoryTitle: '物美社区购',
        programName: '物美社区购',
        sloganUrl: 'https://img.dmallcdn.com/dshop/202107/2d1152ef-a438-491a-9ae7-90af2010fc7c',
        cartSloganUrl: 'https://img.dmallcdn.com/dshop/202107/2d1152ef-a438-491a-9ae7-90af2010fc7c',
        mineSloganLogo: 'https://img.dmallcdn.com/dshop/202107/e1b609da-d583-4b69-8280-bb8b10c795e8',
        orderContactCustomer: '4006231616',
        cmsO2O: '44',
        cmsGlobalSelection: '45',
        allCategoryImg: 'https://img.dmallcdn.com/dshop/202203/f2539f61-a8f9-4b56-8b35-317ff92c11c4',
        tabBar: {
          selectedColor: '#005BAB',
          selectedIconPath: ['https://img.dmallcdn.com/dshop/202107/8645b311-7497-4fa3-a58e-ea01e079ab94', 'https://img.dmallcdn.com/dshop/202107/7d2a67d2-a850-4dfc-bad7-661e42cf546b', 'https://img.dmallcdn.com/dshop/202107/f4de5b88-fb60-4caa-8480-37643e6eec49', 'https://img.dmallcdn.com/dshop/202107/630b4410-d2f0-4047-8211-23c19c01e179'],
        },
        keyMap: { ec: 'act.dmall.com/dac/card_bag/?tabType=2&{param}#/binddingCard' },
        userAgreement: [{
          title: '用户协议',
          link: 'https://a.dmall.com/act/ti0gNSeChUFl.html?nopos=0&tpc=a_487001',
        }, { title: '隐私协议', link: 'https://a.dmall.com/act/2EuSmLCXtcTN.html?nopos=0&tpc=a_487041' }],
        needSubscribe: true,
        subBusiness: [{
          attrs: {
            mainColor: '#005BAB',
            secondColor: '#EB413D',
            iconColor: '#005BAB',
            graColor: '#0094D5',
          },
          scene: 'o2o',
          platform: '9',
        }],
        realPlatformList: ['static.dmall.com/kayak-project/invoiceCenter_v2/', 'static.dmall.com/kayak-project/afterSaleH5/'],
      }),

    };
  }

  getDMMPExtJson(envValue) {
    return {
      evt: envValue,
      tenantId: '1',
      authorizerAppid: 'wx688e0bc628edd02e',
      venderName: '多点',
      appletUniqueCode: 'dmmp_wx',
      buildParamJson: JSON.stringify({
        trackProject: '主小程序',
        mainColor: '#FF680A', // 主题色主色调/渐变色 结束
        secondColor: '#FF680A', // 主题色次色调
        iconColor: '#FF680A', // 按钮D3
        graColor: '#FF8A00', // 渐变色 起始
        showPayCode: 'true', // 是否展示会员码
        payPlatform: 'WechatMiniProgram', // , // 支付端平台枚举"GQProgram"
        appletType: '1', // 会员端小程序枚举
        uniqueCode: 'dmmp_wx',
        shareContext: '逛超市 用多点', // 通用分享文案
        shareImgUrl: 'https://img.dmallcdn.com/dshop/202101/db174084-860d-479f-8950-504d95a6c87f', // 通用分享图
        venderLogoUrl: 'https://img.dmallcdn.com/dshop/202106/a902448e-865e-43ea-a85a-c179ac2579f2', // 商家LOGO
        venderName: '多点', // 商家名称
        goodSharePromotionImg: '', // 商品促销标签
        goodShareImg: '', // 商品分享图片
        platform: '9', // 小程序平台枚举
        scene: 'o2o',
        cartTitle: '多点', // 购物车页面面板标题
        cartSecondTitle: '', // 购物车页面面板副标题
        programName: '多点小程序', // 小程序名称
        sloganUrl: 'https://img.dmallcdn.com/dshop/202008/8a2ca4da-016d-4e34-ac6a-f329bbac53d2', // 首页、购物车页面底部Slogan图片url
        cartSloganUrl: 'https://img.dmallcdn.com/dshop/202008/8a2ca4da-016d-4e34-ac6a-f329bbac53d2', // 购物车页面底部Slogan图片
        mineSloganLogo: 'https://img.dmallcdn.com/dshop/202004/f944cff5-095d-4a7d-8ea7-2c05a83030be', // 我的页面底部Slogan图片Url
        tabBar: { // 底部TabBar配置项
          selectedColor: '#FF680A', // tabbar选中项文字颜色
          selectedIconPath: [ // tabbar选中icon图片链接，从左到右，依此为首页、分类、购物车、我的
            'https://img.dmallcdn.com/dshop/202106/9190d23d-57f3-4e21-8bc6-78df50f5a985',
            'https://img.dmallcdn.com/dshop/202106/992a95ff-79aa-4094-bfcc-e8296052554f',
            'https://img.dmallcdn.com/dshop/202106/ada809b9-93fc-446c-9130-db3b571710e2',
            'https://img.dmallcdn.com/dshop/202106/532269d2-6250-49f0-be7c-15a704fe96c8',
          ],
        },
        keyMap: {
          ec: 'act.dmall.com/dac/card_bag/?tabType=2&{param}#/binddingCard',
        },
        needSubscribe: true, // 是否需要订阅功能
        userAgreement: [
          {
            title: '多点用户协议',
            link: 'https://a.dmall.com/act/6kDsYVAJNGw.html?nopos=0&tpc=a_12166',
          },
          {
            title: '多点隐私政策',
            link: 'https://a.dmall.com/act/bjMyIrLkOTplwt3n.html?nopos=0&tpc=a_12167',
          },
        ],
        hideShareMenu: false, // 是否关闭分享菜单
      }),
    };
  }

  async injectDevEnvConfig(buildParams, envValue) {
    try {
      await this.writeSourceExtFile(buildParams, envValue);
      await this.projectConfigFile(buildParams);
      if (!buildParams.appletUniqueCode.includes('dmmp')) {
        await this.devModePluginsInJson();
      }
    } catch (e) {
      console.log(e);
    }
  }

  async projectConfigFile(buildParams) {
    const isExist = await fs.exists(CONSTANT.BUILD_PROJECT_CONFIG_PATH);

    if (!isExist) return;
    const projectConfigFile = await fs.readJson(CONSTANT.BUILD_PROJECT_CONFIG_PATH);
    projectConfigFile.appid = buildParams.authorizerAppid;
    try {
      await fs.writeJson(CONSTANT.BUILD_PROJECT_CONFIG_PATH, projectConfigFile);
    } catch (e) {
      console.log('project.config写入失败');
      console.log(e);
    }
  }

  async devModePluginsInJson() {
    const pageJson = await fs.readJson(CONSTANT.SOURCE_TEMPLATE_JSON);
    const appJson = await fs.readJson(CONSTANT.DEV_TEMPLATE_JSON);

    const pageSubPackages = pageJson.subPackages || [];
    const appSubPackages = appJson.subPackages || [];

    pageJson.subPackages = pageSubPackages.map((subPackage) => {
      if (subPackage.plugins) {
        // delete subPackage.plugins;
        Reflect.deleteProperty(subPackage, 'plugins');
      }
      return subPackage;
    });
    appJson.subPackages = appSubPackages.map((subPackage) => {
      if (subPackage.plugins) {
        // delete subPackage.plugins;
        Reflect.deleteProperty(subPackage, 'plugins');
      }
      return subPackage;
    });

    // delete pageJson.plugins;
    // delete appJson.plugins;
    Reflect.deleteProperty(pageJson, 'plugins');
    Reflect.deleteProperty(appJson, 'plugins');

    await fs.writeJson(CONSTANT.SOURCE_TEMPLATE_JSON, pageJson);
    await fs.writeJson(CONSTANT.DEV_TEMPLATE_JSON, appJson);
  }

  async writeSourceExtFile(buildParams, envValue) {
    try {
      console.log('写入路径',CONSTANT.SOURCE_TABBAR_FILES_PATH);
      await fs.writeJson(CONSTANT.SOURCE_TABBAR_FILES_PATH, {
        evt: envValue,
        tenantId: `${buildParams.tenantId}`,
        appId: buildParams.authorizerAppid,
        commonConfig: buildParams.buildParamJson,
      });
    } catch (e) {
      console.log('写入失败。');
      console.log(e);
    }
  }
}

module.exports = SourceCodeController;

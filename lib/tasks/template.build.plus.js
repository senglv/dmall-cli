/**
 * @Desc：由于服务商后台目前没对接小程序插件服务，所以现在带有小程序插件的直播页会导致上传失败
 * 暂时的无奈之举，只能先把plugins部分剔除，等以后服务商后台对接了再去掉这个脚本
 * @Usage:
 * @Notify：
 * @Depend：
 *
 *
 * Created by Hallmader on 2021/6/23
 */

// const program = new Command();
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const https = require('https');

const getConstant = (platform = global.platformValue || 'mp-weixin') => ({
  TARGET_TEMPLATE_DIR_PATH: path.join(process.cwd(), `/dist/build/${platform}-template`),
  TARGET_BUILD_DIR_PATH: path.join(process.cwd(), `/dist/build/${platform}`),
  TARGET_TEMPLATE_JSON: path.join(process.cwd(), `/dist/build/${platform}-template/app.json`),
  SOURCE_TABBAR_FILES_PATH: path.join(process.cwd(), '/src/static/images/tabbar'),
  SOURCE_TABBAR_PAGE_CONFIG: path.join(process.cwd(), '/src/pages.json'),

  TARGET_JSON: path.join(process.cwd(), `/dist/build/${platform}/app.json`),
  TARGET_TABBAR_FILES_PATH: path.join(process.cwd(), `/dist/build/${platform}/static/images/tabbar`),

  TABBAR_LIST: [
    'https://img.dmallcdn.com/dshop/202206/9c563312-17e6-4f9d-bac2-e560f3bbd44a',
    'https://img.dmallcdn.com/dshop/202206/2820ce48-28eb-4488-90b2-eeafee9a664d',
    'https://img.dmallcdn.com/dshop/202206/1b0b89e3-ceb0-4019-a6a5-2480f46f6772',
    'https://img.dmallcdn.com/dshop/202206/5d4b088c-e385-4e91-af3e-8a270dbc302a',
  ],
});

const delay = (timer = 300) => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, timer);
});

const removePluginComponents = async function() {
  const CONSTANT = getConstant();
  const sourcePagesConfig = await fs.readJson(CONSTANT.SOURCE_TABBAR_PAGE_CONFIG);
  const mainPackage = sourcePagesConfig.pages;
  const subpackages = sourcePagesConfig.subPackages;

  const removePluginPage = [];
  mainPackage.forEach((page) => {
    if (page.style) {
      if (page.style['mp-weixin']) {
        removePluginPage.push({
          subpackage: '',
          path: page.path,
          usingComponents: page.style['mp-weixin'].usingComponents,
        });
      }
    }
  });

  subpackages.forEach((subPackage) => {
    subPackage.pages.forEach((page) => {
      if (page.style) {
        if (page.style['mp-weixin']) {
          removePluginPage.push({
            subpackage: subPackage.root,
            path: page.path,
            usingComponents: page.style['mp-weixin'].usingComponents,
          });
        }
      }
    });
  });

  removePluginPage.map(async (page) => {
    const targetPath = `${CONSTANT.TARGET_BUILD_DIR_PATH}/${page.subpackage}/${page.path}.json`;
    const targetPageJson = await fs.readJson(targetPath);

    for (const i in targetPageJson.usingComponents) {
      if (targetPageJson.usingComponents[i].includes('plugin://')) {
        delete targetPageJson.usingComponents[i];// eslint-disable-line
      }
    }
    await fs.writeJson(targetPath, targetPageJson);
  });
};

// 修改tabbar选中的selectColor

const changeTabBarSelectColor = async (tabbar, appJson) => {// eslint-disable-line
  const { color = '#666666', selectedColor = '#ff680a' } = tabbar;
  const tabBar = appJson.tabBar || {};
  tabBar.color = color;
  tabBar.selectedColor = selectedColor;
  console.log(chalk.green(`TabBar 颜色替换完成。${chalk.hex(color)('默认色')}-${chalk.hex(selectedColor)('选中色')}，请确认颜色正确。`));
};

const removePluginsConfig = async (env = 'online', needPlugins) => {
  const CONSTANT = getConstant();
  await removePluginComponents();
  await fs.emptyDir(CONSTANT.TARGET_TEMPLATE_DIR_PATH);
  await fs.copy(CONSTANT.TARGET_BUILD_DIR_PATH, CONSTANT.TARGET_TEMPLATE_DIR_PATH);
  await delay(100);
  const appJson = await fs.readJson(CONSTANT.TARGET_TEMPLATE_JSON);
  const subPackages = appJson.subPackages || [];
  appJson.subPackages = subPackages.map((subPackage) => {
    // 如果选择了不需要插件，即使是生产环境也全部剔除
    if (needPlugins) {
      if (env === 'online') {
        if (subPackage.plugins) {
          // 生产环境，当前云直播插件暂时不可用
          // 删除，其余保留
          if (subPackage.plugins.liveRoomPlugin) {
            delete subPackage.plugins.liveRoomPlugin;// eslint-disable-line
          }
        }
      } else {
        // 其余环境，全部剔除
        delete subPackage.plugins;// eslint-disable-line
      }
    } else {
      // 其余环境，全部剔除
      delete subPackage.plugins;// eslint-disable-line
    }

    return subPackage;
  });
  delete appJson.plugins;// eslint-disable-line

  /* 挪走插件只是为了提审用，开发环节，你不一定也需要这样 */
  await fs.writeJson(CONSTANT.TARGET_TEMPLATE_JSON, appJson);
};

// 将src/static下的tabBar根据商家名称 copy至dist
// 目标为dist/mp-build-template/static/images，配置时完全不管，config文件里是写死的
const copyTabBarIconFiles = async (vendorName = '') => {
  const CONSTANT = getConstant();
  const sourcePath = `${CONSTANT.SOURCE_TABBAR_FILES_PATH}/${vendorName}/`;
  const destPath = `${CONSTANT.TARGET_TABBAR_FILES_PATH}/`;
  const tabBarSourceFiles = await fs.pathExists(sourcePath);
  if (tabBarSourceFiles) {
    // 路径存在，清空目标路径
    await fs.emptyDir(destPath);
    // 准备拷贝图标文件
    await fs.copy(sourcePath, destPath);

    console.log(chalk.green(`商家${vendorName} TabBar Icon文件已拷贝完成。`));
  } else {
    // 源目录不存在，提醒创建目录再行操作，或检查目录名称
    console.log(chalk.red(`${sourcePath}不存在！请检测TabBar目录是否准备完成！`));
  }

  return tabBarSourceFiles;
};

const injectTabBarToJson = async (extConfig) => {
  const CONSTANT = getConstant();
  const targetPath = `${CONSTANT.TARGET_BUILD_DIR_PATH}/app.json`;
  try {
    const appJson = await fs.readJson(targetPath);

    const tabBarList = appJson.tabBar.list;
    appJson.tabBar.list = tabBarList.map((item, index) => {
      item.iconPath = (extConfig.tabBar.iconPath && extConfig.tabBar.iconPath.length > 0) ? extConfig.tabBar.iconPath[index] : CONSTANT.TABBAR_LIST[index];
      item.selectedIconPath = extConfig.tabBar.selectedIconPath[index];

      return item;
    });

    appJson.tabBar.color = extConfig.tabBar.color || '#666666';
    appJson.tabBar.selectedColor = extConfig.tabBar.selectedColor;

    await fs.writeJson(targetPath, appJson);

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const copyBuildPathToTemplatePath = async () => {
  const CONSTANT = getConstant();
  await fs.emptyDir(CONSTANT.TARGET_TEMPLATE_DIR_PATH);
  await fs.copy(CONSTANT.TARGET_BUILD_DIR_PATH, CONSTANT.TARGET_TEMPLATE_DIR_PATH);
  await delay(100);

  // 仅保留当前能用的插件
  const appJson = await fs.readJson(CONSTANT.TARGET_TEMPLATE_JSON);
  const subPackages = appJson.subPackages || [];
  appJson.subPackages = subPackages.map((subPackage) => {
    console.log(subPackage.plugins);
    if (subPackage.plugins) {
      // 当前云直播插件暂时不可用
      // 删除，其余保留
      if (subPackage.plugins.liveRoomPlugin) {
        delete subPackage.plugins.liveRoomPlugin;// eslint-disable-line
      }
      // delete subPackage.plugins;
    }
    return subPackage;
  });

  /* 挪走插件只是为了提审用，开发环节，你不一定也需要这样 */
  await fs.writeJson(CONSTANT.TARGET_TEMPLATE_JSON, appJson);
};

const downloadImageToLocal = async (tabBar) => {
  const CONSTANT = getConstant();
  const appJson = await fs.readJson(CONSTANT.TARGET_JSON);
  const { selectedColor = '#ff680a' } = tabBar;
  appJson.tabBar.selectedColor = selectedColor;
  await fs.writeJson(CONSTANT.TARGET_JSON, appJson);
  console.log(`TabBar 颜色替换完成，选中色为${chalk.hex(selectedColor)(selectedColor)}`);

  const saveImgToLocal = (file) => new Promise((resolve) => {
    https.get(file, (res) => {
      let data = '';
      res.setEncoding('binary');
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data);
      });
    });
  });

  // 选中态图片下载
  const selectedResponse = await Promise.all(tabBar.selectedIconPath.map((file) => saveImgToLocal(file)));
  const selectedTaskList = selectedResponse.map(async (imgFile, index) => {
    const imgName = ['homeActive.png', 'categoryActive.png', 'cartActive.png', 'mineActive.png'];
    try {
      await fs.writeFile(`${CONSTANT.TARGET_TABBAR_FILES_PATH}/${imgName[index]}`, imgFile, 'binary');
      return true;
    } catch (err) {
      console.log(`${imgName[index]}文件写入文件错误`, err);
      return false;
    }
  });

  const selectedTaskResult = await Promise.all(selectedTaskList);

  if (selectedTaskResult.find((item) => item === false)) {
    return false;
  }

  // 常规图标下载
  const normalList = tabBar.iconPath && tabBar.iconPath.length > 0 ? tabBar.iconPath : CONSTANT.TABBAR_LIST;
  const normalResponse = await Promise.all(normalList.map((file) => saveImgToLocal(file)));
  const normalTaskList = normalResponse.map(async (imgFile, index) => {
    const imgName = ['home.png', 'category.png', 'cart.png', 'mine.png'];
    try {
      await fs.writeFile(`${CONSTANT.TARGET_TABBAR_FILES_PATH}/${imgName[index]}`, imgFile, 'binary');
      return true;
    } catch (err) {
      console.log(`${imgName[index]}文件写入文件错误`, err);
      return false;
    }
  });

  const normalTaskResult = await Promise.all(normalTaskList);

  if (normalTaskResult.find((item) => item === false)) {
    return false;
  }

  console.log('TabBar Icon文件已拷贝完成。');
  return true;
};

module.exports = {
  removePluginsConfig,
  copyTabBarIconFiles,
  injectTabBarToJson,
  copyBuildPathToTemplatePath,
  downloadImageToLocal,
};

/**
 * @Desc:
 * @Usage:
 * @Notify:
 * @depend:
 *
 *
 * Created by K.L.Qiang on 2022/5/10
 */
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

const CONSTANT = {
  PROJECT_CONFIG_JSON: path.join(process.cwd(), '/src/pages.config.json'),
  DEV_BUNDLE_DEST: path.join(process.cwd(),'/dist/dev/mp-weixin'),
  BUILD_BUNDLE_DEST: path.join(process.cwd(),'/dist/build/mp-weixin'),
  DEV_BUNDLE_DEST_JSON: path.join(process.cwd(),'/dist/dev/mp-weixin/app.json'),

  BUILD_BUNDLE_DEST_JSON: path.join(process.cwd(),'/dist/build/mp-weixin/app.json'),

};

module.exports = async (params) => {
  console.log('121params',params);
  const DEST = process.env.NODE_ENV === params.includes('pro') ? CONSTANT.BUILD_BUNDLE_DEST : CONSTANT.DEV_BUNDLE_DEST;
  const getDirFileList = async (pathList) => await Promise.all(pathList.map(async (item) => {
    const targetStat = await fs.stat(item);
    if (targetStat.isDirectory()) {
      const _pageName = await fs.readdir(item);
      const _pathList = _pageName.map((_page) => `${item}/${_page}`);
      return (await getDirFileList(_pathList)).flat(1);
    }

    return item;
  }));

  const checkComponentIsAsync = (component, configMap, filePath) => {
    const componentRootPath = configMap[component].split('/')[1];
    const pageRootPath = filePath.replace(DEST, '').split('/')[1];
    if (componentRootPath) {
    // 组件来自npm包或者插件则忽略
      if ((componentRootPath.includes('pages') || componentRootPath.includes('package')) && componentRootPath !== pageRootPath) {
      // console.log(component, componentRootPath, pageRootPath);
      //  分包引主包的情况忽略
        if (componentRootPath.includes('page') && pageRootPath.includes('package')) {
          return false;
        }
        return true;
      }
      return false;
    }
    return false;
  };

  const getAsyncComponentList = async (fileList) => await Promise.all(fileList.map(async (file) => {
    const fileJson = await fs.readJson(file);

    if (fileJson.usingComponents && Object.keys(fileJson.usingComponents).length > 0) {
      const asyncComponents = Object.keys(fileJson.usingComponents).filter((component) => checkComponentIsAsync(component, fileJson.usingComponents, file));

      return asyncComponents.length > 0 ? file : false;
    }
    return false;
  }));

  console.log(chalk.yellow('正在注入异步分包组件...'));
  const rootDir = await fs.readdir(DEST);
  const packagePath = rootDir.filter((dir) => dir.includes('package') || dir === 'pages').map((dir) => `${DEST}/${dir}`);
  const pagesPathList = (await getDirFileList(packagePath)).flat(1);
  const jsonFileList = pagesPathList.filter((page) => page.includes('json'));
  const asyncComponentCheckResult = await getAsyncComponentList(jsonFileList);
  const asyncComponentList = asyncComponentCheckResult.filter((item) => item);
  // console.log(asyncComponentList);

  const fileContentList = await Promise.all(asyncComponentList.map(async (pagePath) => {
    const fileJson = await fs.readJson(pagePath);
    // console.log(`${pagePath}:`);
    if (!fileJson.componentPlaceholder) fileJson.componentPlaceholder = {};
    for (const componentKey in fileJson.usingComponents) {
      const componentRootPath = fileJson.usingComponents[componentKey].split('/')[1];
      const pageRootPath = pagePath.replace(DEST, '').split('/')[1];
      if (componentRootPath) {
        // 组件来自npm包或者插件则忽略
        if ((componentRootPath.includes('pages') || componentRootPath.includes('package')) && componentRootPath !== pageRootPath) {
          // console.log(component, componentRootPath, pageRootPath);
          //  分包引主包的情况忽略
          if (!(componentRootPath.includes('page') && pageRootPath.includes('package'))) {
            fileJson.componentPlaceholder[componentKey] = 'view';
          }
        }
      }
    }

    return {
      pagePath,
      fileJson,
    };
  }));

  fileContentList.forEach(async (fileContent) => {
    const { pagePath, fileJson } = fileContent;

    await fs.writeJson(pagePath, fileJson);
  });
  console.log(chalk.green('处理完成。'));
};

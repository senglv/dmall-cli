/**
 * @Desc:
 * @Usage:
 * @Notify:
 * @depend:
 *
 *
 * Created by K.L.Qiang on 2022/6/23
 */
const axios = require('axios');

class AutoExtBuildController {
  constructor() {
    this.state = {
      apiList: {
        getExtJsonByUniqueCode: {
          os: 'gwmini.dmall-os.cn/mini/serviceproviders/getBuildParamConfigByUniqueCode',
          dmall: 'gwmini.dmall.com/mini/serviceproviders/getBuildParamConfigByUniqueCode',
        },
        getAppletConfigByUniqueCode: {
          os: 'gwmini.dmall-os.cn/mini/serviceproviders/appletConfig',
          dmall: 'gwmini.dmall.com/mini/serviceproviders/appletConfig',
        },
      },
    };
  }

  async getExtJsonByUniqueCode(params) {
    try {
      const response = await axios({
        method: 'post',
        headers: {
          uniqueCode: params.uniqueCode || '',
        },
        url: params.evt + this.state.apiList.getExtJsonByUniqueCode[params.domain] || '',

      });
      const res = response.data;

      return res.data;
    } catch (e) {
      console.log(e);
    }
  }

  async getAppletConfigByUniqueCode(params) {
    console.log(params);
    try {
      const response = await axios({
        method: 'post',
        headers: {
          uniqueCode: params.uniqueCode || '',
        },
        url: params.evt + this.state.apiList.getAppletConfigByUniqueCode[params.domain] || '',

      });
      const res = response.data;
      return res.data;
    } catch (e) {
      console.log(e);
    }
  }

  async mergeFullExtJson(params) {
    try {
      const appletConfig = await this.getAppletConfigByUniqueCode(params);
      // const extConfig = await this.getExtJsonByUniqueCode(params);

      console.log(appletConfig);
      console.log(appletConfig.buildParamJson);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = AutoExtBuildController;

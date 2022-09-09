/**
 * @Desc:
 * @Usage:
 * @Notify:
 * @depend:
 *
 *
 * Created by K.L.Qiang on 2022/6/10
 */
const axios = require('axios');

class GetExtConfigJson {
  getBuildParams(params) {
    const { uniqueCode, EVT, platform } = params;
    return new Promise((resolve) => {
      axios({
        method: 'get',
        headers: {
          uniqueCode: uniqueCode || '',
        },
        url: `${EVT}gwmini.dmall-os.cn/mini/serviceproviders/getBuildParamConfigByUniqueCode` || '',
        data: {
          platform: platform || 1,
        },
      }).then((response) => {
        const res = response.data;
        if (res.code === '0000') {
          const data = res.data;
          resolve(data);
          console.log(data);
        } else {
          console.log(response.data);
        }
      }).catch((err) => {
        console.log(err);
      });
    });
  }
}

const getExtConfig = new GetExtConfigJson();
getExtConfig.getBuildParams({
  uniqueCode: 'mk_wx',
  EVT: 'https://test',
});

/* eslint-disable no-cond-assign */
import axios from 'axios';
import RouterBase from '../core/router-base';
import drawIcon from '~/utils/drawIcon';

const getDetail = async (stockId) => {
  const { data: text } = await axios({
    method: 'get',
    url: `https://www.cnyes.com/twstock/ps_pv_time/${stockId}.htm`,
  });

  const tags = ['<div class="scroll">', '</div><!-- scroll:end -->'];

  const startPos = text.indexOf(tags[0]);
  const endPos = text.indexOf(tags[1]);

  const x = text.substr(startPos + tags[0].length, endPos - startPos - tags[0].length);


  let totalText = '';
  const columns = [
    '時間',
    '買價',
    '賣價',
    '成交價',
    '漲跌',
    '單量',
    '總量',
  ];

  const result = [];

  const trRegex = /<\s*tr[^>]*>(.*?)<\s*\/\s*tr>/g;
  let trArr;
  while ((trArr = trRegex.exec(x)) !== null) {
    const newRecord = [];
    const tdRegex = /<\s*td[^>]*>(.*?)<\s*\/\s*td>/g;
    let tdArr;
    let i = 0;
    while ((tdArr = tdRegex.exec(trArr[1])) !== null) {
      newRecord.push(tdArr[1]);
      totalText = `${totalText}${columns[i++]}:${tdArr[1]}, `;
      // console.log(`Found ${tdArr[0]}. Next starts at ${tdRegex.lastIndex}.`);
    }
    result.push(newRecord);
    totalText = `${totalText}\n`;
    // console.log(`Found ${trArr[0]}. Next starts at ${trRegex.lastIndex}.`);
  }
  return result;
};


const getTick = async (stockId) => {
  const { data: json } = await axios({
    method: 'get',
    url: `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_${stockId}.tw&json=1&delay=0&_=${new Date().getTime()}`,
  });

  return json;
};
export default class MainRouter extends RouterBase {
  setupRoutes({ router }) {
    // Get state.
    router.get('/api', (ctx, next) => ctx.body = 'test');

    router.get('/api/stock/trade-details/:stockId', (ctx, next) => getDetail(ctx.params.stockId).then(result => ctx.body = result));

    router.get('/api/stock/tick/:stockId', (ctx, next) => getTick(ctx.params.stockId).then(result => ctx.body = result));

    router.get('/api/icon-test/:seed', (ctx, next) => ctx.body = `
        <html>
          <body>
            <img src="data:png;base64,${
  drawIcon(ctx.params.seed || '').toString('base64')
}" style="border-radius: 50%;" />
          </body>
        </html>
      `);
  }
}

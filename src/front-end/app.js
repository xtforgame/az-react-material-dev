/* eslint-disable no-param-reassign */

import moment from 'moment';
import theme from './dark-unica';
import {
  getTradDetails,
  getTickInfo,
} from './api';

theme(Highcharts);

const cachedArray = [];

const createStockChart = ({
  title: t, year, month, date,
}, startPrice, priceData, volumnData) => {
  const title = t || 'Unknown';
  // priceData.sort((a, b) => a[0] - b[0]);
  // volumnData.sort((a, b) => a[0] - b[0]);
  const yMin = Math.ceil(startPrice * 9.0) / 10.0;
  const yMax = Math.floor(startPrice * 11.0) / 10.0;
  const xMin = new Date(year, month, date, 8, 55).getTime();
  const xMax = new Date(year, month, date, 13, 35).getTime();
  const extraData = [];
  const extraMin = volumnData.length ? volumnData[volumnData.length - 1][0] : xMin;
  {
    let time = extraMin + 1000;
    while (time < xMax) {
      extraData.push([time, 0]);
      time += 5000;
    }
    extraData.push([xMax, 0]);
  }
  Highcharts.stockChart('container', {
    chart: {
      animation: false,
      // type: 'area',
      events: {
        load() {
          // set up the updating of the chart each second
          // setInterval(() => {
          //   let x1 = (new Date()).getTime(), // current time
          //     y1 = randomPrice();
          //   this.series[0].addPoint([x1, y1], true, false);

          //   let x2 = (new Date()).getTime(), // current time
          //     y2 = randomVolume();
          //   this.series[1].addPoint([x2, y2], true, false);
          // }, 1000);

          // setInterval(() => {
          //   this.series[1].update({
          //     data: [],
          //   }, true);
          // }, 1000);
        },
      },
    },

    xAxis: {
      min: xMin,
      max: xMax,
      // breaks: [{ // Nights
      //   from: new Date(2011, 9, 6, 16),
      //   to: new Date(2011, 9, 7, 8),
      //   repeat: 24 * 36e5,
      // }, { // Weekends
      //   from: new Date(2011, 9, 7, 16),
      //   to: new Date(2011, 9, 10, 8),
      //   repeat: 7 * 24 * 36e5,
      // }],
    },

    yAxis: [
      {
        min: yMin,
        max: yMax,
        plotLines: [
          {
            color: 'red',
            dashStyle: 'longdashdot',
            value: yMax,
            width: 1,
          },
          {
            color: 'gray',
            dashStyle: 'longdashdot',
            value: startPrice,
            width: 1,
          },
          {
            color: 'green',
            dashStyle: 'longdashdot',
            value: yMin,
            width: 1,
          },
        ],
        labels: {
          align: 'left',
          formatter: function formatter() {
            // console.log('this.value :', this.value);
            return this.value;
          },
        },
        height: '80%',
        resize: {
          enabled: true,
        },
      },
      {
        labels: {
          align: 'left',
        },
        top: '80%',
        height: '20%',
        offset: 0,
      },
    ],

    time: {
      useUTC: false,
    },

    rangeSelector: {
      buttons: [{
        count: 5,
        type: 'minute',
        text: '5M',
      }, {
        count: 30,
        type: 'minute',
        text: '30M',
      }, {
        count: 1,
        type: 'hour',
        text: '1H',
      }, {
        count: 2,
        type: 'hour',
        text: '2H',
      }, {
        type: 'all',
        text: 'All',
      }],
      inputEnabled: false,
      selected: 4,
    },

    title: {
      text: `${title}: ${year}/${month + 1}/${date}`,
    },

    exporting: {
      enabled: false,
    },

    series: [{
      // type: 'area',
      name: 'Price',
      dataGrouping: {
        forced: true,
        units: [['second', [1]]],
      },
      // pointFormatter: function formatter() {
      //   console.log('this :', this);
      //   return `The value for <b>${this.x}</b> is <b>${this.y}</b>`;
      // },
      data: priceData,
      threshold: startPrice,
      lineWidth: 1,
      zones: [{
        value: startPrice,
        color: 'green',
      },
      // {
      //   value: startPrice + 1,
      //   color: 'blue',
      // },
      {
        color: 'red',
      }],
    }, {
      type: 'column',
      id: 'aapl-volume',
      name: 'AAPL Volume',
      dataGrouping: {
        forced: true,
        units: [['second', [1]]],
      },
      data: [...volumnData, ...extraData],
      yAxis: 1,
    }],

    plotOptions: {
      // line: {
      //     animation: false,
      // },
      series: {
        animation: false,
        states: {
          hover: {
            lineWidth: 1,
          },
        },
      },
    },

    navigator: {
      baseSeries: 1,
      series: {
        type: 'areaspline',
        fillOpacity: 0.05,
        dataGrouping: {
          smoothed: true,
        },
        lineWidth: 1,
        marker: {
          enabled: false,
        },
      },
    },
  });
};

// const stockId = '8028';
const stockId = '3338';
// const stockId = '3008';

Promise.all([
  getTickInfo(stockId),
  getTradDetails(stockId),
])
.then(([tick, tradDetails]) => {
  console.log('tick :', tick);
  const year = moment().year();
  const month = moment().month();
  const date = moment().date();
  tradDetails = tradDetails.map(tradDetail => tradDetail.map((cell, i) => {
    if (i === 0) {
      const hms = cell.split(':').map(s => parseInt(s));
      if (hms[0] === 1) {
        hms[0] += 12;
      }
      return new Date(year, month, date, ...hms).getTime();
    }
    return parseFloat(cell);
  }));
  createStockChart(
    {
      year, month, date, title: `${tick.msgArray[0].n}(${tick.msgArray[0].c})`
    },
    tradDetails[0][3] - tradDetails[0][4],
    tradDetails.map(tradDetail => [tradDetail[0], tradDetail[3]]),
    tradDetails.map(tradDetail => [tradDetail[0], tradDetail[5]]),
  );
});

import theme from './dark-unica';

theme(Highcharts);

const startPrice = 76.0;

const randomPrice = () => Math.round(Math.random() * 20.0) + startPrice - 10.0;
const randomVolume = () => Math.round(Math.random() * 100) + 2;

Highcharts.stockChart('container', {
  chart: {
    animation: false,
    // type: 'area',
    events: {
      load() {
        // set up the updating of the chart each second
        setInterval(() => {
          let x1 = (new Date()).getTime(), // current time
            y1 = randomPrice();
          this.series[0].addPoint([x1, y1], true, false);

          let x2 = (new Date()).getTime(), // current time
            y2 = randomVolume();
          this.series[1].addPoint([x2, y2], true, true);
        }, 1000);
      },
    },
  },

  xAxis: {
    breaks: [{ // Nights
      from: Date(2011, 9, 6, 16),
      to: Date(2011, 9, 7, 8),
      repeat: 24 * 36e5,
    }, { // Weekends
      from: Date(2011, 9, 7, 16),
      to: Date(2011, 9, 10, 8),
      repeat: 7 * 24 * 36e5,
    }],
  },

  yAxis: [{
    labels: {
      align: 'left',
    },
    height: '80%',
    resize: {
      enabled: true,
    },
  }, {
    labels: {
      align: 'left',
    },
    top: '80%',
    height: '20%',
    offset: 0,
  }],

  time: {
    useUTC: false,
  },

  rangeSelector: {
    buttons: [{
      count: 1,
      type: 'minute',
      text: '1M',
    }, {
      count: 5,
      type: 'minute',
      text: '5M',
    }, {
      type: 'all',
      text: 'All',
    }],
    inputEnabled: false,
    selected: 0,
  },

  title: {
    text: 'Live random data',
  },

  exporting: {
    enabled: false,
  },

  series: [{
    type: 'area',
    name: 'Random data',
    dataGrouping: {
      forced: true,
      units: [['second', [1]]],
    },
    data: (function () {
      // generate an array of random data
      let data = [],
        time = (new Date()).getTime(),
        i;

      for (i = -999; i <= 0; i += 1) {
        data.push([
          time + i * 1000,
          randomPrice(),
        ]);
      }
      return data;
    }()),
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
    data: (function () {
      // generate an array of random data
      let data = [],
        time = (new Date()).getTime(),
        i;

      for (i = -999; i <= 0; i += 1) {
        data.push([
          time + i * 1000,
          randomVolume(),
        ]);
      }
      return data;
    }()),
    yAxis: 1,
  }],

  plotOptions: {
    // line: {
    //     animation: false,
    // },
    series: {
      animation: false,
    },
  },

  navigator: {
    baseSeries: 1,
  },
});

/* eslint-disable no-param-reassign */
// const preRender = (rs, {
//   $dirtyMap,
//   $inputChanged,
// }) => {
//   const username = rs.linker.getValue('username');
//   if (rs.prevRenderSession && !$inputChanged) {
//     return (rs.calculated = rs.calculated || rs.prevRenderSession.calculated);
//   }

//   // console.log('rs.calculated');

//   return (rs.calculated = {
//     ...rs.calculated,
//     usernameX: username && `${rs.linker.getValue('username')}pp`,
//   });
// };

const preRender = [
  ['rs', 'envs'],
  `
    var $dirtyMap = envs.$dirtyMap;
    var $inputChanged = envs.$inputChanged;

    var username = rs.linker.getValue('username');
    if (rs.prevRenderSession && !$inputChanged) {
      return (rs.calculated = rs.calculated || rs.prevRenderSession.calculated);
    }

    // console.log('rs.calculated');

    rs.calculated = Object.assign({}, rs.calculated);
    rs.calculated.usernameX = username && (rs.linker.getValue('username') + 'pp');

    return rs.calculated;
  `,
];

// const globalValidator = ({ linker, validate }) => {
//   if (!validate()) {
//     return false;
//   }
//   Object.values(linker.getFields()).forEach(f => f.setError(new Error('XXXX')));
//   return false;
// };

const globalValidator = [
  ['envs'],
  `
    var linker = envs.linker;
    var validate = envs.validate;
    if (!validate()) {
      return false;
    }
    var fields = linker.getFields();
    Object.keys(fields)
    .map(function (k) {
      return fields[k];
    })
    .forEach(function (f) {
      f.setError(new Error('XXXX'));
    });
    return false;
  `,
];

export default {
  namespace: 'form1',
  preRender,
  globalValidator,
  fileds: [
    {
      name: 'username',
      presets: [
        'text',
        ['translateProp', 'label', 'username'],
        ['translateProp', 'placeholder', 'usernameEmptyError', {
          emailAddress: '$t(emailAddress)',
          phoneNumber: '$t(phoneNumber)',
        }],
      ],
    },
    {
      name: 'usernameX',
      presets: ['autoCalculableText'],
      extraProps: {
        label: '可編輯輸入',
      },
      defaultValue: '',
    },
    {
      name: 'password',
      presets: ['password', ['translateProp', 'label', 'password']],
    },
    {
      name: 'date',
      presets: ['date'],
      extraProps: {
        label: '選擇日期',
      },
    },
    {
      name: 'dateRange',
      presets: ['dateRange'],
      extraProps: {
        label: '選擇日期範圍',
      },
    },
    {
      name: 'time',
      presets: ['time'],
      extraProps: {
        label: '選擇時間',
      },
    },
    {
      name: 'timeRange',
      presets: ['timeRange'],
      extraProps: {
        label: '選擇時間範圍',
      },
    },
    {
      name: 'dateTime',
      presets: ['dateTime'],
      extraProps: {
        label: '選擇日期時間',
      },
    },
    {
      name: 'dateTimeRange',
      presets: ['dateTimeRange'],
      extraProps: {
        label: '選擇日期時間範圍',
      },
      extraOptions: { space: 'none' },
    },
    {
      name: 'rememberMe',
      presets: ['checkbox', ['translateProp', 'label', 'rememberMe']],
      defaultValue: false,
    },
    {
      name: 'submit',
      presets: ['submit', ['translateProp', 'children', 'login']],
    },
  ],
};

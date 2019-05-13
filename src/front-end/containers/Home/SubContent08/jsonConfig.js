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
      type: 'text',
      presets: [
        ['translateProp', 'label', 'username'],
        ['translateProp', 'placeholder', 'usernameEmptyError', {
          emailAddress: '$t(emailAddress)',
          phoneNumber: '$t(phoneNumber)',
        }],
      ],
    },
    {
      name: 'usernameX',
      type: 'text',
      presets: ['autoCalculable'],
      extraProps: {
        label: '可編輯輸入',
      },
      defaultValue: '',
    },
    {
      name: 'password',
      type: 'password',
      presets: [['translateProp', 'label', 'password']],
    },
    {
      name: 'colorInlinePicker',
      type: 'colorInlinePicker',
      extraProps: {
        label: '選擇顏色',
      },
    },
    {
      name: 'date',
      type: 'date',
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
      type: 'time',
      extraProps: {
        label: '選擇時間',
      },
    },
    {
      name: 'timeRange',
      type: 'timeRange',
      extraProps: {
        label: '選擇時間範圍',
      },
    },
    {
      name: 'dateTime',
      type: 'dateTime',
      extraProps: {
        label: '選擇日期時間',
      },
    },
    {
      name: 'dateTimeRange',
      type: 'dateTimeRange',
      extraProps: {
        label: '選擇日期時間範圍',
      },
      extraOptions: { space: 'none' },
    },
    {
      name: 'rememberMe',
      type: 'checkbox',
      presets: [['translateProp', 'label', 'rememberMe']],
      defaultValue: false,
    },
    {
      name: 'submit',
      type: 'submit',
      presets: [['translateProp', 'children', 'builtin-components:submit']],
    },
  ],
};

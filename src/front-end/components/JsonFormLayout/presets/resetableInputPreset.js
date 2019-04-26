/* eslint-disable react/prop-types, react/forbid-prop-types */
import React from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Clear from '@material-ui/icons/Clear';

export default cfg => ({
  ...cfg,
  extraChildLinks: [
    {
      name: `~calc-${cfg.name}`,
      converter: { fromView: ([v]) => v },
      mwRender: [
        ({
          link: { linker }, value, handleChange, props,
        }) => {
          const p = {
            acOptions: {
              ...props.acOptions,
              onAutoCalcChanged: handleChange,
            },
          };
          if (!value) {
            const endAdornment = (
              <InputAdornment position="end">
                <IconButton
                  tabIndex="-1"
                  onClick={() => {
                    linker.changeValue(cfg.name, props.calculatedValue);
                  }}
                  onMouseDown={(event) => {
                    event.preventDefault();
                  }}
                >
                  <Clear />
                </IconButton>
              </InputAdornment>
            );
            p.InputProps = { endAdornment };
          }

          return p;
        },
      ],
    },
  ],
});

/* eslint-disable react/prop-types, react/forbid-prop-types */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import { TwitterPicker } from 'react-color';

// https://codepen.io/davidhalford/pen/ywEva

function getCorrectTextColor(_h) {
  let hex = _h;
  if (!hex) {
    return '#000000';
  }

  hex = cutHex(hex);
  if (hex.length === 3) {
    const c1 = hex.substr(0, 1);
    const c2 = hex.substr(1, 1);
    const c3 = hex.substr(2, 1);
    hex = `${c1}${c1}${c2}${c2}${c3}${c3}`;
  }

  const threshold = 130; /* about half of 256. Lower threshold equals more dark text on dark background  */

  const hRed = hexToR(hex);
  const hGreen = hexToG(hex);
  const hBlue = hexToB(hex);

  function hexToR(h) { return parseInt(h.substr(0, 2), 16); }
  function hexToG(h) { return parseInt(h.substr(2, 2), 16); }
  function hexToB(h) { return parseInt(h.substr(4, 2), 16); }
  function cutHex(h) { return (h.charAt(0) === '#') ? h.substr(1, 7) : h; }

  const cBrightness = ((hRed * 299) + (hGreen * 587) + (hBlue * 114)) / 1000;
  if (cBrightness > threshold) { return '#000000'; } else { return '#ffffff'; }
}

const Content = ({ inputRef, colorProps, ...props }) => (
  <div {...props}>
    <div
      style={{
        height: 48,
        marginTop: 6,
        marginBottom: 6,
        color: getCorrectTextColor(colorProps.color),
        background: colorProps.color,
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {colorProps.color && `${colorProps.color.toUpperCase()}`}
    </div>
    <TwitterPicker
      width="100%"
      triangle="hide"
      styles={{
        'hide-triangle': {
          card: {
            boxShadow: 'unset',
          },
          body: {
            padding: 0,
          },
        },
      }}
      {...colorProps}
    />
  </div>
);

export default ({ colorProps, ...props }) => (
  <TextField
    variant="outlined"
    {...props}
    value=" "
    InputProps={{
      inputComponent: Content,
      inputProps: {
        colorProps: {
          ...colorProps,
          color: props.value,
          onChangeComplete: props.onChange,
        },
      },
    }}
    onChange={(e) => {
      if (e.stopPropagation && e.preventDefault) {
        e.stopPropagation();
        e.preventDefault();
      } else {
        const { onChange } = props;
        if (onChange) {
          onChange(e);
        }
      }
    }}
    onClick={(e) => {
      e.stopPropagation();
      e.preventDefault();
      const { onClick } = props;
      if (onClick) {
        onClick(e);
      }
    }}
  />
);

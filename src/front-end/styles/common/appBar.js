import { fade } from '@material-ui/core/styles/colorManipulator';

export default theme => ({
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  appBarPlaceholder: {
    height: 56,
    [theme.breakpoints.up('sm')]: {
      height: 64,
    },
  },
  toolbar: {
    // minHeight: 48,
    // height: 48,
  },
  appBarChip: {
    color: theme.palette.common.white,
    margin: theme.spacing(1),
    background: fade(theme.palette.common.white, 0.15),
    '&:hover, &:focus': {
      background: fade(theme.palette.common.white, 0.15),
    },
    '&:active': {
      background: fade(theme.palette.common.white, 0.15),
    },
  },
});

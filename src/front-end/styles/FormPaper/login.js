export default theme => ({
  textContainer: {
    cursor: 'text',
    wordWrap: 'break-word',
  },
  forgotPasswordContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  loginBtn: {
    marginTop: 6,
    marginBottom: 6,
    float: 'right',
  },
  link: {
    cursor: 'pointer',
    color: theme.palette.secondary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
    '&:focus': {
      outline: 'none',
    },
  },
  paper: {
    margin: 0,
    width: '100%',
    paddingRight: 0,
    paddingLeft: 0,
    height: 550,
    [theme.breakpoints.up('sm')]: {
      width: 500,
      margin: 80,
    },
  },
});

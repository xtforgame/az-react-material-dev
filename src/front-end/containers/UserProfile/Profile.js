/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import bgImg from './StockSnap_3FOSIEZDTW.jpg';
import classNames from 'classnames';
import Avatar from '@material-ui/core/Avatar';
import Centered from '~/components/Layout/Centered';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import grey from '@material-ui/core/colors/grey';
import SuccessButton from '~/components/Buttons/SuccessButton';
import {
  readFile,
} from '~/utils/imageHelpers';

import {
  FormTextField,
} from '~/components/FormInputs';

import {
  makeMyUserSelector,
} from '~/containers/App/selectors';

import modelMap from '~/containers/App/modelMap';

const {
  patchUser,
} = modelMap.waitableActions;

const styles = theme => ({
  mainContainer: {
    width: '100%',
  },
  // media: {
  //   height: 0,
  //   paddingTop: '56.25%', // 16:9
  // },
  card: {
    width: 300,
    [theme.breakpoints.up('sm')]: {
      width: 345,
    },
  },
  media: {
    position: 'relative',
    height: 150,
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
  },
  avatar: {
    // margin: 10,
    color: '#fff',
    backgroundColor: grey[500],
  },
  absolute: {
    position: 'absolute',
  },
  bigAvatar: {
    width: 96,
    height: 96,
  },

  space0: {
    height: 100,
  },

  space1: {
    height: '50%',
  },

  space2: {
    height: 55,
  },

  space3: {
    height: 20,
  },

  avatarContainer: {
    position: 'relative',
    height: '100%',
  },

  editButton: {
    margin: 'auto',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 8,
  },

  editPhoto: {
    color: theme.palette.common.white,
    margin: 'auto',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },

  input: {
    display: 'none',
  },

  avatarImage: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    objectFit: 'cover',
  },
});

class Profile extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      editing: false,
    };
  }

  startEditing = () => {
    const {
      user = {},
    } = this.props;
    this.setState({
      editing: true,
      name: user.name,
      bio: user.data && user.data.bio,
      email: user.data && user.data.email,
    });
  };

  cancelEditing = () => {
    this.setState({
      editing: false,
      name: undefined,
      email: undefined,
      bio: undefined,
      thumbnail: undefined,
    });
  };

  submit = () => {
    const {
      patchUser,
      user = {},
    } = this.props;

    let p = Promise.resolve();

    if (user.id != null) {
      const patchData = {};
      if (this.state.name) {
        patchData.name = this.state.name;
      }
      if (this.state.email) {
        patchData.data = {
          ...user.data,
          ...patchData.data,
          email: this.state.email,
        };
      }
      if (this.state.bio) {
        patchData.data = {
          ...user.data,
          ...patchData.data,
          bio: this.state.bio,
        };
      }
      if (this.state.thumbnail) {
        patchData.picture = this.state.thumbnail;
      }
      p = patchUser(user.id, patchData);
    }
    p.then(() => {
      this.setState({
        editing: false,
        name: undefined,
        email: undefined,
        bio: undefined,
        thumbnail: undefined,
      });
    })
    .catch((e) => {
      console.error('Failed to update user info :', e);
    });
  }

  renderDetailView() {
    const {
      user = {},
    } = this.props;

    const bio = user.data && user.data.bio;
    const email = user.data && user.data.email;

    return (
      <CardContent>
        <Centered>
          <Typography gutterBottom variant="h5" component="h2">
            {user.name}
          </Typography>
        </Centered>
        <List>
          <ListItem>
            <ListItemText
              primary="Email"
              secondary={email}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              disableTypography
              primary={(
                <Typography
                  variant="subtitle1"
                >
                Bio
                </Typography>
              )}
              secondary={(
                <Typography
                  variant="body1"
                  component="p"
                  color="textSecondary"
                >
                  {bio}
                </Typography>
              )}
            />
          </ListItem>
        </List>
      </CardContent>
    );
  }

  renderEditView() {
    const {
      classes,
      user = {},
    } = this.props;

    const bio = user.data && user.data.bio;
    const email = user.data && user.data.email;

    return (
      <CardContent>
        <FormTextField
          id="name"
          label="Name"
          onKeyPress={() => {}}
          value={(this.state.editing ? this.state.name : user.name) || ''}
          onChange={(e) => {
            this.setState({
              name: e.target.value,
            });
          }}
          fullWidth
        />
        <div className={classes.space3} />
        <FormTextField
          id="email"
          label="Email"
          onKeyPress={() => {}}
          value={(this.state.editing ? this.state.email : email) || ''}
          onChange={(e) => {
            this.setState({
              email: e.target.value,
            });
          }}
          fullWidth
        />
        <div className={classes.space3} />
        <React.Fragment>
          <FormTextField
            id="bio"
            label="Bio"
            onKeyPress={() => {}}
            value={(this.state.editing ? this.state.bio : bio) || ''}
            onChange={(e) => {
              this.setState({
                bio: e.target.value,
              });
            }}
            multiline
            fullWidth
            rows={1}
            rowsMax={10}
          />
          <div className={classes.space3} />
        </React.Fragment>
      </CardContent>
    );
  }

  render() {
    const {
      classes,
      user = {},
    } = this.props;

    return (
      <Centered className={classes.mainContainer}>
        <Card className={classes.card}>
          <CardMedia
            className={classes.media}
            image={bgImg}
            title=""
          >
            <div className={classes.space1} />
            <Centered
              className={classes.avatarContainer}
            >
              <Avatar
                alt="Adelle Charles"
                {...{/* src: bgImg */}}
                className={classNames(classes.avatar, classes.bigAvatar)}
              >
                {this.state.editing && (
                  <input
                    accept="image/*"
                    className={classes.input}
                    id="icon-button-file"
                    type="file"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        readFile(e.target.files[0], {
                          thumbnailInfo: {
                            maxWidth: 512,
                            maxHeight: 512,
                          },
                        })
                        .then((imgInfo) => {
                          this.setState(imgInfo);
                          // console.log('imgInfo :', imgInfo);
                        });
                      }
                    }}
                  />
                )}
                {user.picture && (
                  <img alt="me" src={(this.state.editing && this.state.thumbnail) || user.picture} className={classes.avatarImage} />
                )
                }
                {!user.picture && (
                  <Typography variant="h4">
                    {(user.name || '').substr(0, 2)}
                  </Typography>
                )
                }
                {this.state.editing
                  && (
                    <React.Fragment>
                      <div
                        className={classNames(classes.absolute, classes.bigAvatar)}
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.35)' }}
                      />
                      <label htmlFor="icon-button-file">
                        <IconButton component="span" className={classNames(classes.editPhoto)}>
                          <PhotoCamera />
                        </IconButton>
                      </label>
                    </React.Fragment>
                  )}
              </Avatar>
              <Button
                variant="fab"
                color={this.state.editing ? 'default' : 'secondary'}
                aria-label={this.state.editing ? 'cancel' : 'edit'}
                className={classes.editButton}
                onClick={this.state.editing ? this.cancelEditing : this.startEditing}
              >
                {this.state.editing ? (<CloseIcon />) : (<EditIcon />)}
              </Button>
            </Centered>
          </CardMedia>
          <div className={classes.space2} />
          {this.state.editing
            ? this.renderEditView()
            : this.renderDetailView()
          }
          {this.state.editing
            && (
              <CardActions>
                <SuccessButton
                  size="small"
                  variant="contained"
                  fullWidth
                  color="primary"
                  onClick={this.submit}
                >
                Save
                </SuccessButton>
              </CardActions>
            )}
        </Card>
      </Centered>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  user: makeMyUserSelector(),
});

export default compose(
  connect(mapStateToProps, {
    patchUser,
  }),
  withStyles(styles),
)(Profile);

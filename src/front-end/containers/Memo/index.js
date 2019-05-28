import React from 'react';
import classNames from 'classnames';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import RestoreIcon from '@material-ui/icons/Restore';
import ScheduleIcon from '@material-ui/icons/Schedule';
import AddIcon from '@material-ui/icons/Add';
import UpIcon from '@material-ui/icons/KeyboardArrowUp';
import green from '@material-ui/core/colors/green';
import createCommonStyles from '~/styles/common';
import { push } from 'react-router-redux';
import {
  withRouter,
} from 'react-router-dom';

import modelMap from '~/containers/App/modelMap';
import FilterBar from './FilterBar';
import NewMemoDialog from './tabs/Memos/NewMemoDialog';

import MobileTabsFrame from '~/containers/MobileTabsFrame';

const {
  getMemos,
} = modelMap.waitableActions;

const styles = theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  fabGreen: {
    color: theme.palette.common.white,
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        backgroundColor: green[500],
      },
    },
  },
  ...createCommonStyles(theme, ['flex', 'mobile']),
});

class Memo extends React.PureComponent {
  state = {
    dialogOpen: false,
  };

  componentDidMount() {
    this.props.getMemos();
  }

  handleTabChange = (_, value) => {
    // console.log('value :', value);
    this.props.push(value);
  };

  closeDialog = () => {
    this.setState({
      dialogOpen: false,
    });
  }

  render() {
    const {
      routeView,
      classes,
      location,
      match,
    } = this.props;

    const tabs = [
      {
        name: 'memos',
        nav: {
          label: 'Memos',
          icon: <RestoreIcon />,
        },
        fab: {
          color: 'primary',
          className: classes.fab,
          fabIcon: <AddIcon />,
        },
      },
      {
        name: 'schedules',
        nav: {
          label: 'Schedules',
          icon: <ScheduleIcon />,
        },
        fab: {
          color: 'inherit',
          className: classNames(classes.fab, classes.fabGreen),
          fabIcon: <UpIcon />,
        },
      },
    ];

    tabs.filter(tab => tab.fab).forEach((tab) => {
      const { fab } = tab;
      tab.fab = ( // eslint-disable-line no-param-reassign
        <Fab
          className={fab.className}
          color={fab.color}
          onClick={() => {
            this.setState({
              dialogOpen: true,
            });
          }}
        >
          {fab.fabIcon}
        </Fab>
      );
    });

    return (
      <MobileTabsFrame
        beforeRouteView={location.pathname === `${match.url}/memos` && (
          <FilterBar
            position="relative"
          />
        )}
        routeView={routeView}
        parentUrl={match.url}
        pathname={location.pathname}
        handleTabChange={this.handleTabChange}
        tabs={tabs}
      >
        {this.state.dialogOpen && (
          <NewMemoDialog
            open={this.state.dialogOpen}
            onClose={this.closeDialog}
          />
        )}
      </MobileTabsFrame>
    );
  }
}

export default compose(
  connect(null, { getMemos, push }),
  withRouter,
  withStyles(styles),
)(Memo);

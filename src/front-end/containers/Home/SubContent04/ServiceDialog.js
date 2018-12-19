import React from 'react';
import { compose } from 'recompose';
import { FormTextField, FormSpace } from '~/components/FormInputs';
import ConfirmDialog from '~/components/Dialogs/ConfirmDialog';
import { withStyles } from '@material-ui/core/styles';
import DialogContent from '@material-ui/core/DialogContent';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Panel01 from './Panel01';
import DetailedExpansionPanel from './DetailedExpansionPanel';

const styles = theme => ({
  space: {
    height: 20,
  },
  dialogContent1: {
    flex: 'none',
    overflowY: 'visible',
  },
  dialogContent2: {
    padding: 0,
  },
});

class ServiceDialog extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      editingText: this.props.value || '',
      expanded: false,
    };
  }

  handleEnterForTextField = (event) => {
    if (event.key === 'Enter') {
      this.handleClose(true);
      event.preventDefault();
    }
  };

  handleClose = (_result) => {
    let result = _result;
    if (result === true) {
      result = this.state.editingText;
    }
    if (this.props.onClose) {
      this.props.onClose(result);
    }
  }

  handlePanelExpanded = (panel, nextPanel) => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : (nextPanel || false),
    });
  };

  render() {
    const {
      name,
      label,
      onClose,
      classes,
      ...rest
    } = this.props;
    const { expanded } = this.state;
    const isCreating = typeof name !== 'string';
    return (
      <ConfirmDialog
        {...rest}
        title={isCreating ? 'New Service' : 'Update Service'}
        onClose={this.handleClose}
      >
        {isCreating
          ? (
            <DialogContent className={classes.dialogContent1}>
              <FormSpace variant="content2" />
              <FormTextField
                id="service-name"
                label="Service Name"
                onKeyPress={this.handleEnterForTextField}
                value={this.state.editingText}
                onChange={e => this.setState({ editingText: e.target.value })}
                autoFocus
                margin="dense"
                fullWidth
              />
            </DialogContent>
          )
          : (
            <React.Fragment>
              <FormSpace variant="content2" />
              <List>
                <ListItem>
                  <ListItemText
                    primary="Service Name"
                    secondary={name}
                  />
                </ListItem>
              </List>
            </React.Fragment>
          )}
        <div className={classes.space} />
        <DialogContent className={classes.dialogContent2}>
          <Panel01
            expanded={expanded === 'panel1'}
            onChange={this.handlePanelExpanded('panel1')}
            onDone={this.handlePanelExpanded('panel1', 'panel2')}
          />
          <DetailedExpansionPanel
            expanded={expanded === 'panel2'}
            title="web"
            onChange={this.handlePanelExpanded('panel2')}
            onDone={this.handlePanelExpanded('panel2', 'panel3')}
          />
          <DetailedExpansionPanel
            expanded={expanded === 'panel3'}
            title="postgres"
            onChange={this.handlePanelExpanded('panel3')}
            onDone={this.handlePanelExpanded('panel3', 'panel4')}
          />
          <DetailedExpansionPanel
            expanded={expanded === 'panel4'}
            title="nginx"
            onChange={this.handlePanelExpanded('panel4')}
            onDone={this.handlePanelExpanded('panel4', 'panel5')}
          />
          <DetailedExpansionPanel
            expanded={expanded === 'panel5'}
            title="nginx"
            onChange={this.handlePanelExpanded('panel5')}
            onDone={this.handlePanelExpanded('panel5')}
          />
        </DialogContent>
      </ConfirmDialog>
    );
  }
}

export default compose(
  withStyles(styles),
)(ServiceDialog);

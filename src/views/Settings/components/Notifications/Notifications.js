import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Grid,
  Divider,
  Button,
  TextField
} from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import firebase from '../../../../firebase/firebase';

const styles = (theme) => ({
  root: {},
  item: {
    display: 'flex',
    flexDirection: 'column'
  },
  switch: {
    display: 'flex',
    marginTop: 15,
  },
  switchText: {
    marginTop: 10,
  }
});

class Notifications extends Component {

  constructor(props) {
    super();
    let user = firebase.getCurrentUser();
    let name = user.displayName;
    let email = user.email;
    this.state = { name: name, email: email, loading: true, displayResets: false, resetTime: null, upperThreshold: null, lowerThreshold: null, changesPending: false };
    this.handleToggleSwitch = this.handleToggleSwitch.bind(this);
    this.handleResetDateChange = this.handleResetDateChange.bind(this);
    this.handleUpperThresholdChange = this.handleUpperThresholdChange.bind(this);
    this.handleLowerThresholdChange = this.handleLowerThresholdChange.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
  }

  async componentDidMount() {
    let displayResets = await firebase.getDisplayResetValues();
    let resetTime = await firebase.getResetTime();
    let upperThreshold = await firebase.getUpperThreshold();
    let lowerThreshold = await firebase.getLowerThreshold();
    this.setState({ displayResets: displayResets, resetTime: resetTime, upperThreshold: upperThreshold, lowerThreshold: lowerThreshold, loading: false, upperThresholdOutOfBounds: false, lowerThresholdOutOfBounds: false });
  }

  handleToggleSwitch(event) {
    this.setState({ displayResets: event.target.checked });
    firebase.setDisplayResetValues(event.target.checked);
  }

  handleResetDateChange(date) {
    var dateObject = new Date(date);
    this.setState({resetTime: dateObject});
    firebase.setResetTime(dateObject);
  }

  handleUpperThresholdChange(event) {
    this.setState({ changesPending: true, upperThreshold: event.target.value });
  }

  handleLowerThresholdChange(event) {
    this.setState({ changesPending: true, lowerThreshold: event.target.value });
  }

  saveChanges(event) {
    let upperThreshold = +this.state.upperThreshold;
    let lowerThreshold = +this.state.lowerThreshold;
    if (upperThreshold < 0 || upperThreshold > 100) {
      this.setState({ upperThresholdOutOfBounds: true });
      return;
    }
    if (lowerThreshold < 0 || lowerThreshold > 100) {
      this.setState({ lowerThresholdOutOfBounds: true });
      return;
    }
    firebase.setUpperThreshold(+this.state.upperThreshold);
    firebase.setLowerThreshold(+this.state.lowerThreshold);
    this.setState({ upperThresholdOutOfBounds: false, lowerThresholdOutOfBounds: false });
  }

  render() {
    const { classes } = this.props;
    const helperText = "Must be a percentage between 0 and 100";

    return (
      <Card>
        <CardHeader
            title="Profile"
            subheader="Edit account details"
          />
          <Divider />
          <CardContent>
            <Grid>
            <Grid><TextField label="Casino/Account Name" variant="outlined" value={this.state.name}></TextField></Grid>
            <Grid><TextField label="Account Email" variant="outlined" style={{ marginTop: '1rem', marginBottom: '1rem' }} value={this.state.email}></TextField></Grid>
            <hr/>
            <Grid className={classes.switch}><Switch checked={this.state.displayResets} disabled={this.state.loading} onChange={this.handleToggleSwitch} inputProps={{ 'aria-label': 'primary checkbox' }}/><Typography className={classes.switchText}>Include reset values in report downloads</Typography></Grid>
            <Grid>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardTimePicker
                  margin="normal"
                  id="time-picker"
                  label="Daily Change Reset Time"
                  value={this.state.resetTime}
                  onChange={this.handleResetDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change time',
                  }}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <br/>
            <hr/>
            <br/>
            <Typography variant="h6">Exception Thresholds</Typography>
            <Typography>These values dictate the percentage increase and decrease that a machine's progressive needs to change by to be marked as an exception. Values are inclusive.</Typography>
            <Grid><TextField error={this.state.upperThresholdOutOfBounds} helperText={this.state.upperThresholdOutOfBounds && helperText} InputLabelProps={{ shrink: true }} label="Percent Over" variant="outlined" style={{ marginTop: '1rem' }} value={this.state.upperThreshold || ""} onChange={this.handleUpperThresholdChange} type="number" disabled={this.state.loading}></TextField></Grid>
            <Grid><TextField error={this.state.lowerThresholdOutOfBounds} helperText={this.state.lowerThresholdOutOfBounds && helperText} InputLabelProps={{ shrink: true }} label="Percent Under" variant="outlined" style={{ marginTop: '1rem' }} value={this.state.lowerThreshold || ""} onChange={this.handleLowerThresholdChange} type="number" disabled={this.state.loading}></TextField></Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions>
            <Button
              color="primary"
              variant="outlined"
              disabled={!this.state.changesPending}
              onClick={this.saveChanges}
            >
              Save
            </Button>
          </CardActions>
        {/*<form>
          <CardHeader
            subheader="Manage the notifications"
            title="Notifications"
          />
          <Divider />
          <CardContent>
            <Grid
              container
              spacing={6}
              wrap="wrap"
            >
              <Grid
                className={classes.item}
                item
                md={4}
                sm={6}
                xs={12}
              >
                <Typography
                  gutterBottom
                  variant="h6"
                >
                  Notifications
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      defaultChecked //
                    />
                  }
                  label="Email"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      defaultChecked //
                    />
                  }
                  label="Push Notifications"
                />
                <FormControlLabel
                  control={<Checkbox color="primary" />}
                  label="Text Messages"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      defaultChecked //
                    />
                  }
                  label="Phone calls"
                />
              </Grid>
              <Grid
                className={classes.item}
                item
                md={4}
                sm={6}
                xs={12}
              >
                <Typography
                  gutterBottom
                  variant="h6"
                >
                  Messages
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      defaultChecked //
                    />
                  }
                  label="Email"
                />
                <FormControlLabel
                  control={<Checkbox color="primary" />}
                  label="Push Notifications"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      defaultChecked //
                    />
                  }
                  label="Phone calls"
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions>
            <Button
              color="primary"
              variant="outlined"
            >
              Save
            </Button>
          </CardActions>
                </form>*/}
      </Card>
    );
  }
};

Notifications.propTypes = {
  className: PropTypes.string
};

export default withStyles(styles)(Notifications);

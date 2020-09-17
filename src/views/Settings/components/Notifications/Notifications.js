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
  TextField
} from '@material-ui/core';
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
    this.state = { name: name, email: email, loading: true, displayResets: false };
    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    let displayResets = await firebase.getDisplayResetValues();
    this.setState({ displayResets: displayResets, loading: false });
  }

  handleChange(event) {
    this.setState({ displayResets: event.target.checked });
    firebase.setDisplayResetValues(event.target.checked);
  }

  render() {
    const { classes } = this.props;

    return (
      <Card
      >
        <CardHeader
            title="Profile"
            subheader="Edit account details"
          />
          <Divider />
          <CardContent>
            <Grid>
            <Grid><TextField label="Casino/Account Name" variant="outlined" value={this.state.name}></TextField></Grid>
            <Grid><TextField label="Account Email" variant="outlined" style={{ marginTop: '1rem' }} value={this.state.email}></TextField></Grid>
            <Grid className={classes.switch}><Switch checked={this.state.displayResets} disabled={this.state.loading} onChange={this.handleChange} inputProps={{ 'aria-label': 'primary checkbox' }}/><Typography className={classes.switchText}>Include reset values in report downloads</Typography></Grid>
            </Grid>
          </CardContent>
          <CardActions>
            {/*<Button
              color="primary"
              variant="outlined"
            >
              Save
            </Button>*/}
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

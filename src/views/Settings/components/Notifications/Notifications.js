import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Grid,
  Divider,
  //FormControlLabel,
  //Checkbox,
  //Typography,
  //Button,
  TextField
} from '@material-ui/core';
import firebase from '../../../../firebase/firebase';

const useStyles = makeStyles(() => ({
  root: {},
  item: {
    display: 'flex',
    flexDirection: 'column'
  }
}));

const Notifications = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  let user = firebase.getCurrentUser();
  let name = user.displayName;
  let email = user.email;

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
          title="Profile"
          subheader="Edit account details"
        />
        <Divider />
        <CardContent>
          <Grid>
          <Grid><TextField label="Casino/Account Name" variant="outlined" value={name}></TextField></Grid>
          <Grid><TextField label="Account Email" variant="outlined" style={{ marginTop: '1rem' }} value={email}></TextField></Grid>
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
};

Notifications.propTypes = {
  className: PropTypes.string
};

export default Notifications;

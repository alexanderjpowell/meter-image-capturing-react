import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import firebase from '../../firebase/firebase';
import { Notifications, Password } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Settings = (props) => {
  const classes = useStyles();

  if (!firebase.getCurrentUser()) {
    props.history.replace('/signin');
    return null;
  }

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={4}>
        <Grid
          item
          xs={12}
          //md={7}
          lg={7}
          xl={7}
          >
          <Notifications />
        </Grid>
        <Grid
          item
          xs={12}
          //md={5}
          lg={5}
          xl={5}
          >
          <Password />
        </Grid>
      </Grid>
    </div>
  );
};

export default Settings;
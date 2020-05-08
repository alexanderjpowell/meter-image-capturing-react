import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import firebase from '../../firebase/firebase';
import { UsersToolbar, UsersTable } from './components';
import mockData from './data';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const UserList = (props) => {
  const classes = useStyles();

  const [users] = useState(mockData);

  if (!firebase.getCurrentUser()) {
    props.history.replace('/signin');
    return null;
  }

  return (
    <div className={classes.root}>
      <UsersToolbar />
      <div className={classes.content}>
        <UsersTable users={users} />
      </div>
    </div>
  );
};

export default UserList;

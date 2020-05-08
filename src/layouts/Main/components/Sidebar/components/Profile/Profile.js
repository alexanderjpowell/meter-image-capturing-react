import React from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Avatar, Typography } from '@material-ui/core';
import firebase from '../../../../../../firebase/firebase';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content'
  },
  avatar: {
    width: 60,
    height: 60
  },
  name: {
    marginTop: theme.spacing(1)
  }
}));

const Profile = props => {
  const { className, ...rest } = props;

  const classes = useStyles();
  let history = useHistory();

  if (!firebase.getCurrentUser()) {
    history.replace('/signin');
    return null;
  }

  let firebaseUser = firebase.getCurrentUser();
  let name = firebaseUser.displayName;
  let photo = firebaseUser.photoURL;
  //alert(photo);

  if (!name) {
    name = 'Not Set';
  }

  if (!photo) {
    photo = 'https://cdn.audleytravel.com/3078/2198/79/1021591-thai-beach.jpg';
  }

  const user = {
    name: name, 
    avatar: photo,
    bio: ''
  };
  /*const user = {
    name: 'Shen Zhi',
    avatar: '/images/avatars/avatar_11.png',
    bio: 'Brain Director'
  };*/

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Avatar
        alt="Person"
        className={classes.avatar}
        component={RouterLink}
        src={user.avatar}
        to="/settings"
      />
      <Typography
        className={classes.name}
        variant="h4"
      >
        {user.name}
      </Typography>
      <Typography variant="body2">{user.bio}</Typography>
    </div>
  );
};

Profile.propTypes = {
  className: PropTypes.string
};

export default Profile;

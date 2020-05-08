import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Badge, Hidden, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import Typography from '@material-ui/core/Typography';
import InputIcon from '@material-ui/icons/Input';
import firebase from '../../../../firebase/firebase';

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none'
  },
  flexGrow: {
    flexGrow: 1
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  },
  title: {
    color: 'inherit',
    marginLeft: theme.spacing(2),
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
}));

//const Topbar = props => {
function Topbar(props) {
  const { className, onSidebarOpen, ...rest } = props;

  const classes = useStyles();
  let history = useHistory();

  const [notifications] = useState([]);

  async function handleSignOut() {
    try {
      await firebase.logout();
      history.replace('/signin');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Toolbar>
        {/*<RouterLink to="/">*/}
          <img
            alt="Logo"
            //src="/images/logos/logo--white.svg"
            //src="/images/logos/logo.svg" height="50px" width="50px"
            src="/images/logos/logo-transparent1.png" height="50px" width="50px"
            //src="/images/logos/logo.jpg" height="50px" width="50px"
          />
          
        {/*</RouterLink>*/}
        <Typography className={classes.title} variant="h4" noWrap>
            Meter Image Capturing
          </Typography>
        <div className={classes.flexGrow} />
        <Hidden mdDown>
          <IconButton color="inherit">
            <Badge
              badgeContent={notifications.length}
              color="primary"
              variant="dot"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            className={classes.signOutButton}
            color="inherit"
            onClick={handleSignOut}
          >
            <InputIcon />
          </IconButton>
        </Hidden>
        <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={onSidebarOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func
};

export default Topbar;

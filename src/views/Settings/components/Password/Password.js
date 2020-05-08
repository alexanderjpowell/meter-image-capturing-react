import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button,
  TextField
} from '@material-ui/core';
import firebase from '../../../../firebase/firebase';

const useStyles = makeStyles(() => ({
  root: {}
}));

//const Password = props => {
function Password(props) {
  const { className, ...rest } = props;

  const classes = useStyles();

  const [values, setValues] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    currentPasswordError: false,
    newPasswordError: false,
    confirmNewPasswordError: false,
    currentPasswordHelperText: '',
    newPasswordHelperText: '',
    confirmNewPasswordHelperText: ''
  });

  /*const handleChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };*/

  const currentPasswordOnChange = (event) => {
    setValues({ ...values, currentPassword: event.target.value });
  }

  const newPasswordOnChange = (event) => {
    setValues({ ...values, newPassword: event.target.value });
  }

  const confirmNewPasswordOnChange = (event) => {
    setValues({ ...values, confirmNewPassword: event.target.value });
  };

  const handlePasswordChange = (event) => {
    // Check if any fields are empty
    if (!values.currentPassword) {
      setValues({ ...values, currentPasswordError: true });
      return;
    }
    if (!values.newPassword) {
      setValues({ ...values, newPasswordError: true });
      return;
    }
    if (!values.confirmNewPassword) {
      setValues({ ...values, confirmNewPasswordError: true });
      return;
    }
    // Check if new passwords match
    if (values.newPassword !== values.confirmNewPassword) {
      setValues({ ...values, confirmNewPasswordError: true, confirmNewPasswordHelperText: 'Passwords don\'t match' });
      return;
    } else { // Revert to normal
      setValues({ ...values, confirmNewPasswordError: false, confirmNewPasswordHelperText: '' });
    }
    // Make the api call
    firebase.changePassword(values.currentPassword, values.newPassword);
  };

  //let user = firebase.getCurrentUser();
  //let name = user.displayName;
  //let email = user.email;

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <form>
        <CardHeader
          subheader="Update password"
          title="Password"
        />
        <Divider />
        <CardContent>
          <TextField
            fullWidth
            label="Current Password"
            name="current password"
            onChange={currentPasswordOnChange}
            type="password"
            value={values.currentPassword}
            variant="outlined"
            error={values.currentPasswordError}
            helperText={values.currentPasswordHelperText}
          />
          <TextField
            fullWidth
            label="New Password"
            name="new password"
            onChange={newPasswordOnChange}
            style={{ marginTop: '1rem' }}
            type="password"
            value={values.newPassword}
            variant="outlined"
            error={values.newPasswordError}
            helperText={values.newPasswordHelperText}
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            name="confirm new password"
            onChange={confirmNewPasswordOnChange}
            style={{ marginTop: '1rem' }}
            type="password"
            value={values.confirmNewPassword}
            variant="outlined"
            error={values.confirmNewPasswordError}
            helperText={values.confirmNewPasswordHelperText}
          />
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            color="primary"
            variant="outlined"
            onClick={handlePasswordChange}
          >
            Update
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

Password.propTypes = {
  className: PropTypes.string
};

export default Password;
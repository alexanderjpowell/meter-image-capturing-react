import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { withRouter } from 'react-router';
import firebase from '../../firebase/firebase';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
      type: "light",
  },
});

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://capturemeters.com/">
        Meter Image Capturing
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function SignIn(props) {
  const classes = useStyles();

  const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

  if (firebase.getCurrentUser()) {
		props.history.replace('/dashboard');
		return null;
	}

  async function login() {
    try {
      await firebase.login(email, password);
      props.history.replace('/dashboard');
    } catch(error) {
      alert(error.message);
    }
  }

  const smallBreakpoint = 12;
  const largeBreakpoint = 6;

  return (
    <ThemeProvider theme={theme}>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Grid item xs={smallBreakpoint} sm={smallBreakpoint} md={smallBreakpoint} lg={largeBreakpoint} xl={largeBreakpoint}>
            <div align="center"><img src='/images/logos/logo-transparent1.png' width="100" height="100" alt="MiC Logo"/></div>
        </Grid>
        <Typography component="h1" variant="h5">
          Meter Image Capturing
        </Typography>
        {/*onSubmit={handleLogin}*/}
        <form onSubmit={e => e.preventDefault() && false} className={classes.form} noValidate>
          <TextField
            value={email}
            variant="outlined"
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={e => setEmail(e.target.value)}
          />
          <TextField
            value={password}
            variant="outlined"
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={e => setPassword(e.target.value)}
          />
          {/*<FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />*/}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={login}
            className={classes.submit}
          >
            Sign In
          </Button>
          
          {/*<Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>*/}
        </form>
        <a align="center" href='https://play.google.com/store/apps/details?id=com.slotmachine.ocr.mic&hl=en&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'><img alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png' height="80"/></a>
      </div>
      <Box mt={2}>
        <Copyright />
      </Box>
    </Container>
    </ThemeProvider>
  );
};

export default withRouter(SignIn);
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Avatar,
  LinearProgress,
  Button
} from '@material-ui/core';
import InsertChartIcon from '@material-ui/icons/InsertChartOutlined';
import GetAppIcon from '@material-ui/icons/GetApp';
import DeleteIcon from '@material-ui/icons/Delete';
import firebase from '../../../firebase/firebase';

const styles = (theme) => ({
  root: {
    height: '100%'
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    fontWeight: 700,
    fontSize: 14,
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32
  },
  progress: {
    marginTop: theme.spacing(3)
  },
  fileDetails: {
    padding: theme.spacing(3)
  }
});

class ToDoListProgress extends Component {
  constructor(props) {
    super(props);
    this.state = { processedRowCount: 0, totalRowCount: 0, uploadDate: '' };
  }

  async componentDidMount() {
    let data = await firebase.getUploadFileData();
    this.setState({ processedRowCount: data[1] - data[0], totalRowCount: data[1], uploadDate: data[2].toDate().toDateString() });
  }

render() {
  const { classes } = this.props;
  return (
    <Card>
      <CardContent>
        <Grid
          container
          justify="space-between">
          <Grid item>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
              variant="body2">TO DO LIST PROGRESS</Typography>
            <Typography variant="h3">{this.state.processedRowCount/this.state.totalRowCount * 100}%</Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <InsertChartIcon className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
        <LinearProgress
          className={classes.progress}
          value={this.state.processedRowCount/this.state.totalRowCount * 100}
          variant="determinate"/>
          <div className={classes.fileDetails}>
          <Grid
          container
          justify="flex-start"
          alignItems="flex-start">
          <Grid item>
            <Typography>
              File Size: 25kb
            </Typography>
            </Grid>
            </Grid>
            <Grid
          container
          justify="flex-start"
          alignItems="flex-start">
            <Grid item>
            <Typography>
              Uploaded on: {this.state.uploadDate}
            </Typography>
          </Grid>
          </Grid>
          <Grid
          container
          justify="flex-start"
          alignItems="flex-start">
            <Grid item>
            <Typography>
              {this.state.processedRowCount} / {this.state.totalRowCount} machines processed
            </Typography>
          </Grid>
          </Grid>
          </div>
          <Grid
          container
          justify="space-evenly"
          alignItems="flex-start">
            <Grid item><Button variant="contained" color="primary" component="label" startIcon={<GetAppIcon />}>Download</Button></Grid>
            <Grid item><Button variant="contained" color="primary" component="label" startIcon={<DeleteIcon />}>Delete</Button></Grid>
          </Grid>
      </CardContent>
    </Card>
  );
}
};

ToDoListProgress.propTypes = {
  className: PropTypes.string
};

export default withStyles(styles)(ToDoListProgress);

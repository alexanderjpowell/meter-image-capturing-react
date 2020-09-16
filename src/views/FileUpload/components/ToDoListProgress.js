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
import empty from '../../Images/empty-search.svg';
import InsertChartIcon from '@material-ui/icons/InsertChartOutlined';
import GetAppIcon from '@material-ui/icons/GetApp';
//import DeleteIcon from '@material-ui/icons/Delete';
import Skeleton from '@material-ui/lab/Skeleton';
import firebase from '../../../firebase/firebase';
import FileSaver from 'file-saver';

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
    this.unsubscribe = null;
    this.state = { processedRowCount: null, totalRowCount: null, uploadDate: null, toDoUrl: null, uploadFileSize: null };
    this.downloadFile = this.downloadFile.bind(this);
  }

  async componentDidMount() {
    let data = await firebase.getUploadFileData();
    let url = await firebase.getToDoFileURL();
    let fileSize = await firebase.getUploadFileSize();
    this.setState({ processedRowCount: data[1] - data[0], totalRowCount: data[1], uploadDate: data[2], toDoUrl: url, uploadFileSize: fileSize });

    const that = this;
    let d0, d1, d2;
    this.unsubscribe = firebase.setToDoListener().onSnapshot(function(doc) {
      if (doc.data() !== undefined) {
        console.log("Current data: ", doc.data());
        d0 = doc.data().uploadArray.length;
        d1 = doc.data().rowCount;
        d2 = doc.data().timestamp.toDate().toDateString();
        that.setState({processedRowCount: d1 - d0, totalRowCount: d1, uploadDate: d2});
      } else {
        that.setState({toDoUrl: -1});
      }
    });
  }

  componentWillUnmount() {
    try{
      this.unsubscribe();
    } catch(e) {
      console.log(e);
    }
  }

  downloadFile() {
    FileSaver.saveAs(this.state.toDoUrl, 'to-do.csv');
  }

render() {
  const { classes } = this.props;
  let loading = this.state.processedRowCount === null && this.state.totalRowCount === null && this.state.uploadDate === null && this.state.toDoUrl === null && this.state.uploadFileSize === null;
  if (this.state.toDoUrl === -1 || this.state.totalRowCount === undefined) {
    return (<Card className={classes.emptyState}>
      <img className={classes.paddingItem} src={empty} alt="Empty" width="50%" height="50%" />
      <Typography className={classes.description}>You haven't added any to do lists. Upload a file to get started:</Typography>
      <Typography className={classes.description}>Note: In some circumstances it may take several minutes for the file to be processed after being uploaded.</Typography>
  </Card>);
  }
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
            <Typography variant="h3">
              {loading ? <Skeleton variant="text" /> : Math.round(this.state.processedRowCount/this.state.totalRowCount * 100) + '%'}
            </Typography>
          </Grid>
          <Grid item>
            {loading ? <Skeleton variant="circle" width={40} height={40} /> : <Avatar className={classes.avatar}><InsertChartIcon className={classes.icon}/></Avatar>}
          </Grid>
        </Grid>
        {loading ? <Skeleton variant="text" height={10} /> : <LinearProgress
          className={classes.progress}
          value={Math.round(this.state.processedRowCount/this.state.totalRowCount * 100)}
          variant="determinate"/>}
          <div className={classes.fileDetails}>
          <Grid
          container
          justify="flex-start"
          alignItems="flex-start">
          <Grid item>
            <Typography>
              {loading ? <Skeleton variant="text" width={120}/> : 'File Size: ' + (this.state.uploadFileSize / 1000).toFixed(2) + ' kB'}
            </Typography>
            </Grid>
            </Grid>
            <Grid
          container
          justify="flex-start"
          alignItems="flex-start">
            <Grid item>
            <Typography>
              {loading ? <Skeleton variant="text" width={100}/> : 'Uploaded on: ' + this.state.uploadDate}
            </Typography>
          </Grid>
          </Grid>
          <Grid
          container
          justify="flex-start"
          alignItems="flex-start">
            <Grid item>
            <Typography>
              {loading ? <Skeleton variant="text" width={120}/> : this.state.processedRowCount + ' / ' + this.state.totalRowCount + ' machines processed'}
            </Typography>
          </Grid>
          </Grid>
          </div>
          <Grid
          container
          justify="space-evenly"
          alignItems="flex-start">
            <Grid item>
              { loading ? <Skeleton variant="rect" width={120} height={35}/> :
              <Button variant="contained"
                      color="primary" 
                      component="label" 
                      startIcon={<GetAppIcon />}
                      onClick={this.downloadFile}>Download</Button> }
            </Grid>
            {/*<Grid item>
              { loading ? <Skeleton variant="rect" width={120} height={35}/> :
              <Button variant="contained" color="primary" component="label" startIcon={<DeleteIcon />}>Delete</Button>}
            </Grid>*/}
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

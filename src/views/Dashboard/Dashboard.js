import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import {
  //Budget,
  //TotalUsers,
  //TasksProgress,
  //TotalProfit,
  //LatestSales,
  //UsersByDevice,
  //LatestProducts,
  //LatestOrders,
  MaterialTableDemo,
  DetailedExpansionPanel
} from './components';
import firebase from '../../firebase/firebase';

import { DataGrid } from 'tubular-react';
import { createColumn } from "tubular-common";

const styles = theme => ({
  root: {
    padding: theme.spacing(2)
  },
});

class Dashboard extends Component {

  constructor(props) {
    super(props);
    if (!firebase.getCurrentUser()) {
      props.history.replace('/signin');
    }
    this.handleOnDateRangeSearchClick = this.handleOnDateRangeSearchClick.bind(this);
    this.handleOnDateClick = this.handleOnDateClick.bind(this);
    this.state = { startDate: new Date(), endDate: new Date(), latestScansRange: '' };
  }

  handleOnDateRangeSearchClick(startDate, endDate) {
    this.setState({ startDate: startDate, endDate: endDate });
  }

  // code is element of { hour, day, week } 
  handleOnDateClick(code) {
    this.setState({ latestScansRange: code });
  }

  render() {
    const { classes } = this.props;
    const startDate = this.state.startDate;
    const endDate = this.state.endDate;
    const latestScansRange = this.state.latestScansRange;
  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={2}
      >
        <Grid
          item
          lg={12}
          md={12}
          xl={9}
          xs={12}
        >
          <DetailedExpansionPanel
            startDate={startDate}
            endDate={endDate}
            onDateRangeSearchClick={this.handleOnDateRangeSearchClick}
            onDateClick={this.handleOnDateClick} />
        </Grid>
        <Grid
          item
          lg={12}
          md={12}
          xl={12}
          xs={12}
        >
          <MaterialTableDemo
            startDate={startDate}
            endDate={endDate}
          latestScansRange={latestScansRange} />
        </Grid>
      </Grid>
    </div>
  );
      }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);
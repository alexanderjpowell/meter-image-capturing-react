import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MaterialTable from 'material-table';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import InputAdornment from '@material-ui/core/InputAdornment';
import firebase from '../../../../firebase/firebase';

class MaterialTableDemo extends Component {

  constructor(props) {
    //alert('constructor');
    super(props);
    if (!firebase.getCurrentUser()) {
      props.history.replace('/signin');
    }
    //alert(firebase.getCurrentUser().email);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      columns: [
        { title: 'Machine ID', field: 'machineId', width: 150 },
        { title: 'P1', field: 'progressive1', width: 80 },
        { title: 'P2', field: 'progressive2', width: 80 },
        { title: 'P3', field: 'progressive3', width: 80 },
        { title: 'P4', field: 'progressive4', width: 80 },
        { title: 'P5', field: 'progressive5', width: 80 },
        { title: 'P6', field: 'progressive6', width: 80 },
        { title: 'P7', field: 'progressive7', width: 80 },
        { title: 'P8', field: 'progressive8', width: 80 },
        { title: 'P9', field: 'progressive9', width: 80 },
        { title: 'P10', field: 'progressive10', width: 80 },
        { title: 'Timestamp', field: 'timestamp', editable: 'false', width: 150 },
        { title: 'User', field: 'userName', editable: 'false', width: 80 },
        { title: 'Location', field: 'location', width: 100 },
      ],
      data: [],
      //emptyDataSourceMessage: 'No Results',
      open: false,
    };
  }

  /*async componentDidUpdate(prevProps) {
    alert("componentDidUpdate");
    // Custom Date Range
    if ((this.props.startDate !== prevProps.startDate) || (this.props.endDate !== prevProps.endDate)) {
      alert('1');
      //alert(this.props.startDate + ' : ' + this.props.endDate);
      let scans = await firebase.queryCustomDateRange(this.props.startDate, this.props.endDate);
      let rowData = [];
      for (let i = 0; i < scans.length; i++) {
        let docId = scans[i].id;
        let machineId = scans[i].get('machine_id');
        let progressive1 = scans[i].get('progressive1');
        let progressive2 = scans[i].get('progressive2');
        let progressive3 = scans[i].get('progressive3');
        let progressive4 = scans[i].get('progressive4');
        let progressive5 = scans[i].get('progressive5');
        let progressive6 = scans[i].get('progressive6');
        let location = scans[i].get('location');
        let timestamp = scans[i].get('timestamp').toDate().toDateString();
        let user = scans[i].get('userName');
        let notes = scans[i].get('notes');
        let row = { docId: docId, machineId: machineId, progressive1: progressive1, progressive2: progressive2, progressive3: progressive3, progressive4: progressive4, progressive5: progressive5, progressive6: progressive6, timestamp: timestamp, user: user, notes: notes };
        rowData.push(row);
      }
      this.setState({ data: rowData });
    }
    if (this.props.latestScansRange !== prevProps.latestScansRange) {
      
      //alert(this.props.latestScansRange);
      if (this.props.latestScansRange === 'hour') {
        alert('2');
        let scans = await firebase.queryLastHourScans();
        let rowData = [];
        for (let i = 0; i < scans.length; i++) {
          let docId = scans[i].id;
          let machineId = scans[i].get('machine_id');
          let progressive1 = scans[i].get('progressive1');
          let progressive2 = scans[i].get('progressive2');
          let progressive3 = scans[i].get('progressive3');
          let progressive4 = scans[i].get('progressive4');
          let progressive5 = scans[i].get('progressive5');
          let progressive6 = scans[i].get('progressive6');
          let timestamp = scans[i].get('timestamp').toDate().toDateString();
          let user = scans[i].get('userName');
          let notes = scans[i].get('notes');
          let row = { docId: docId, machineId: machineId, progressive1: progressive1, progressive2: progressive2, progressive3: progressive3, progressive4: progressive4, progressive5: progressive5, progressive6: progressive6, timestamp: timestamp, user: user, notes: notes };
          rowData.push(row);
        }
        this.setState({ data: rowData });
      } else if (this.props.latestScansRange === 'day') {
        alert('3');
        let scans = await firebase.queryLastDayScans();
        let rowData = [];
        for (let i = 0; i < scans.length; i++) {
          let docId = scans[i].id;
          let machineId = scans[i].get('machine_id');
          let progressive1 = scans[i].get('progressive1');
          let progressive2 = scans[i].get('progressive2');
          let progressive3 = scans[i].get('progressive3');
          let progressive4 = scans[i].get('progressive4');
          let progressive5 = scans[i].get('progressive5');
          let progressive6 = scans[i].get('progressive6');
          let timestamp = scans[i].get('timestamp').toDate().toDateString();
          let user = scans[i].get('userName');
          let notes = scans[i].get('notes');
          let row = { docId: docId, machineId: machineId, progressive1: progressive1, progressive2: progressive2, progressive3: progressive3, progressive4: progressive4, progressive5: progressive5, progressive6: progressive6, timestamp: timestamp, user: user, notes: notes };
          rowData.push(row);
        }
        this.setState({ data: rowData });
      } else if (this.props.latestScansRange === 'week') {
        alert('4');
        let scans = await firebase.queryLastWeekScans();
        let rowData = [];
        for (let i = 0; i < scans.length; i++) {
          let docId = scans[i].id;
          let machineId = scans[i].get('machine_id');
          let progressive1 = scans[i].get('progressive1');
          let progressive2 = scans[i].get('progressive2');
          let progressive3 = scans[i].get('progressive3');
          let progressive4 = scans[i].get('progressive4');
          let progressive5 = scans[i].get('progressive5');
          let progressive6 = scans[i].get('progressive6');
          let timestamp = scans[i].get('timestamp').toDate().toDateString();
          let user = scans[i].get('userName');
          let notes = scans[i].get('notes');
          let row = { docId: docId, machineId: machineId, progressive1: progressive1, progressive2: progressive2, progressive3: progressive3, progressive4: progressive4, progressive5: progressive5, progressive6: progressive6, timestamp: timestamp, user: user, notes: notes };
          rowData.push(row);
        }
        this.setState({ data: rowData });
      }
    }
  }*/

  // On mount, fetch most recent scans regardless of date
  async componentDidMount() {
    //alert('componentDidMount');
    let scans = await firebase.queryMostRecentScans();
    let rowData = [];
    for (let i = 0; i < scans.length; i++) {
      let docId = scans[i].id;
      let machineId = scans[i].get('machine_id');
      let progressive1 = scans[i].get('progressive1');
      let progressive2 = scans[i].get('progressive2');
      let progressive3 = scans[i].get('progressive3');
      let progressive4 = scans[i].get('progressive4');
      let progressive5 = scans[i].get('progressive5');
      let progressive6 = scans[i].get('progressive6');
      let location = scans[i].get('location');
      let timestamp = scans[i].get('timestamp').toDate().toDateString();
      let userName = scans[i].get('userName');
      let notes = scans[i].get('notes');
      let row = { docId: docId, machineId: machineId, progressive1: progressive1, progressive2: progressive2, progressive3: progressive3, progressive4: progressive4, progressive5: progressive5, progressive6: progressive6, location: location, timestamp: timestamp, userName: userName, notes: notes };
      rowData.push(row);
    }
    this.setState({ data: rowData });
  }

  handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ open: false });
  }

  render() {
    //alert('render');
    const open = this.state.open;
    return (
    <div>
    <MaterialTable
      title="Latest Scans"
      columns={this.state.columns}
      data={this.state.data}
      /*detailPanel={rowData => {
        const progressives = [rowData.progressive1, 
          rowData.progressive2, 
          rowData.progressive3, 
          rowData.progressive4, 
          rowData.progressive5, 
          rowData.progressive6, "", "", "", ""];
        return (
          <div>
            {progressives.map((value, index) => {
              let label = "P " + (index + 1);
              return <TextField id="outlined-basic" 
                label={label} 
                defaultValue={value}
                size="small" 
                variant="outlined" 
                style = {{width: 100}} 
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}/>
            })}
          </div>
        )
      }}*/
      options={{
        //fixedColumns: {
          //left: 1,
          //right: 3
        //},
        padding: "dense",
        actionsColumnIndex: -1,
        search: false,
        exportAllData: true,
        exportButton: true,
        //selection: true,
        pageSize: 10,
        pageSizeOptions: [],
        rowStyle: {
          fontSize: 14,
          fontFamily: 'Roboto',
        },
        //detailPanelType: 'single'
      }}
      localization={{
        body: {
          emptyDataSourceMessage: 'No Results'
        }
      }}
      /*actions={[
        {
          tooltip: 'Delete all selected rows',
          icon: 'delete',
          onClick: (evt, data) => {
            alert('You want to delete ' + data.length + ' rows');
            //console.log(data[0].docId);
            for (let i = 0; i < data.length; i++) {
              firebase.deleteScan(data[0].docId);
            }
          }
        },
        //{
          //tooltip: 'Refresh Data',
          //icon: 'refresh',
          //isFreeAction: true
          //onClick: (evt, data) => alert('You want to delete ' + data.length + ' rows')
        //}
      ]}*/
      editable={{
        /*onRowAdd: (newData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              setState((prevState) => {
                const data = [...prevState.data];
                data.push(newData);
                return { ...prevState, data };
              });
            }, 600);
          }),*/
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve) => {
            firebase.updateScan(oldData, newData);
            setTimeout(() => {
              resolve();
              if (oldData) {
                this.setState((prevState) => {
                  const data = [...prevState.data];
                  data[data.indexOf(oldData)] = newData;
                  return { ...prevState, data };
                });
              }
            }, 600);
          }),
        onRowDelete: (oldData) =>
          new Promise((resolve, reject) => {
            firebase.deleteScan(oldData.docId);
            this.setState({ open: true });
            setTimeout(() => {
              resolve();
              this.setState((prevState) => {
                const data = [...prevState.data];
                data.splice(data.indexOf(oldData), 1);
                return { ...prevState, data };
              });
            }, 600);
          }),
      }}
    />
    <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={3000}
        onClose={this.handleClose}
        message="Row deleted"
        action={
          <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={this.handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
      </div>
    );
  }
}

export default withRouter(MaterialTableDemo);
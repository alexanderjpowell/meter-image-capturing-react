import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';
//import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MaterialTable from 'material-table';
import Skeleton from '@material-ui/lab/Skeleton';
import Chip from '@material-ui/core/Chip';
//import TextField from '@material-ui/core/TextField';
//import MenuItem from '@material-ui/core/MenuItem';
//import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
//import InputAdornment from '@material-ui/core/InputAdornment';
import firebase from '../../../../firebase/firebase';

class MaterialTableDemo extends Component {

  constructor(props) {
    super();
    if (!firebase.getCurrentUser()) {
      props.history.replace('/signin');
      //return null;
    }
    
    this.state = {
      columns: [
        { title: 'Machine ID', field: 'machineId', width: 150 },
        { field: 'progressive_index', render: rowData => {
                return <Chip variant="outlined" label={'Progressive ' + rowData.progressive_index}/>
            } 
        },
        { title: 'Progressive', field: 'progressive', width: 80 },
        { title: 'Base', field: 'base', width: 80 },
        { title: 'Timestamp', field: 'timestamp', editable: 'false', width: 150 },
        { title: 'User', field: 'userName', editable: 'false', width: 80 },
        { title: 'Notes', field: 'notes' },
        { title: 'Location', field: 'location', width: 100 },
      ],
      data: [],
      open: false,
      initialLoad: true,
    };

    this.handleClose = this.handleClose.bind(this);
  }

  async componentDidUpdate(prevProps) {
    // Custom Date Range
    if ((this.props.startDate !== prevProps.startDate) || (this.props.endDate !== prevProps.endDate)) {
      let scans = await firebase.queryCustomDateRange(this.props.startDate, this.props.endDate);
      let rowData = this.formatScanData(scans);
      this.setState({ data: rowData });
    }
    if (this.props.latestScansRange !== prevProps.latestScansRange) {
      if (this.props.latestScansRange === 'hour') {
        let scans = await firebase.queryLastHourScans();
        let rowData = this.formatScanData(scans);
        this.setState({ data: rowData });
      } else if (this.props.latestScansRange === 'day') {
        let scans = await firebase.queryLastDayScans();
        let rowData = this.formatScanData(scans);
        this.setState({ data: rowData });
      } else if (this.props.latestScansRange === 'week') {
        let scans = await firebase.queryLastWeekScans();
        let rowData = this.formatScanData(scans);
        this.setState({ data: rowData });
      }
    }
  }

  // On mount, fetch most recent scans regardless of date
  async componentDidMount() {
    let scans = await firebase.queryMostRecentScans();
    let rowData = this.formatScanData(scans);
    this.setState({ data: rowData, initialLoad: false });
  }

  handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ open: false });
  }

  createExportFileName() {
    var date = new Date();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getYear() + 1900;
    return month + "-" + day + "-" + year;
  }

  formatScanData(scans) {
    let rowData = [];
    for (let i = 0; i < scans.length; i++) {
      let docId = scans[i].id;
      let machineId = scans[i].get('machine_id');
      let location = scans[i].get('location');
      let timestamp = scans[i].get('timestamp').toDate().toLocaleString();
      let userName = scans[i].get('userName');
      let notes = scans[i].get('notes');
      let progressive1 = scans[i].get('progressive1') == null ? "" : scans[i].get('progressive1');
      let progressive2 = scans[i].get('progressive2') == null ? "" : scans[i].get('progressive2');
      let progressive3 = scans[i].get('progressive3') == null ? "" : scans[i].get('progressive3');
      let progressive4 = scans[i].get('progressive4') == null ? "" : scans[i].get('progressive4');
      let progressive5 = scans[i].get('progressive5') == null ? "" : scans[i].get('progressive5');
      let progressive6 = scans[i].get('progressive6') == null ? "" : scans[i].get('progressive6');
      let progressive7 = scans[i].get('progressive7') == null ? "" : scans[i].get('progressive7');
      let progressive8 = scans[i].get('progressive8') == null ? "" : scans[i].get('progressive8');
      let progressive9 = scans[i].get('progressive9') == null ? "" : scans[i].get('progressive9');
      let progressive10 = scans[i].get('progressive10') == null ? "" : scans[i].get('progressive10');
      let base1 = scans[i].get('reset1') == null ? "" : scans[i].get('reset1');
      let base2 = scans[i].get('reset2') == null ? "" : scans[i].get('reset2');
      let base3 = scans[i].get('reset3') == null ? "" : scans[i].get('reset3');
      let base4 = scans[i].get('reset4') == null ? "" : scans[i].get('reset4');
      let base5 = scans[i].get('reset5') == null ? "" : scans[i].get('reset5');
      let base6 = scans[i].get('reset6') == null ? "" : scans[i].get('reset6');
      let base7 = scans[i].get('reset7') == null ? "" : scans[i].get('reset7');
      let base8 = scans[i].get('reset8') == null ? "" : scans[i].get('reset8');
      let base9 = scans[i].get('reset9') == null ? "" : scans[i].get('reset9');
      let base10 = scans[i].get('reset10') == null ? "" : scans[i].get('reset10');
      if (progressive1 !== "") {
        let row = { docId: docId, machineId: machineId, progressive_index: 1, progressive: progressive1, base: base1, location: location, timestamp: timestamp, userName: userName, notes: notes };
        rowData.push(row);
      }
      if (progressive2 !== "") {
        let row = { docId: docId, machineId: machineId, progressive_index: 2, progressive: progressive2, base: base2, location: location, timestamp: timestamp, userName: userName, notes: notes };
        rowData.push(row);
      }
      if (progressive3 !== "") {
        let row = { docId: docId, machineId: machineId, progressive_index: 3, progressive: progressive3, base: base3, location: location, timestamp: timestamp, userName: userName, notes: notes };
        rowData.push(row);
      }
      if (progressive4 !== "") {
        let row = { docId: docId, machineId: machineId, progressive_index: 4, progressive: progressive4, base: base4, location: location, timestamp: timestamp, userName: userName, notes: notes };
        rowData.push(row);
      }
      if (progressive5 !== "") {
        let row = { docId: docId, machineId: machineId, progressive_index: 5, progressive: progressive5, base: base5, location: location, timestamp: timestamp, userName: userName, notes: notes };
        rowData.push(row);
      }
      if (progressive6 !== "") {
        let row = { docId: docId, machineId: machineId, progressive_index: 6, progressive: progressive6, base: base6, location: location, timestamp: timestamp, userName: userName, notes: notes };
        rowData.push(row);
      }
      if (progressive7 !== "") {
        let row = { docId: docId, machineId: machineId, progressive_index: 7, progressive: progressive7, base: base7, location: location, timestamp: timestamp, userName: userName, notes: notes };
        rowData.push(row);
      }
      if (progressive8 !== "") {
        let row = { docId: docId, machineId: machineId, progressive_index: 8, progressive: progressive8, base: base8, location: location, timestamp: timestamp, userName: userName, notes: notes };
        rowData.push(row);
      }
      if (progressive9 !== "") {
        let row = { docId: docId, machineId: machineId, progressive_index: 9, progressive: progressive9, base: base9, location: location, timestamp: timestamp, userName: userName, notes: notes };
        rowData.push(row);
      }
      if (progressive10 !== "") {
        let row = { docId: docId, machineId: machineId, progressive_index: 10, progressive: progressive10, base: base10, location: location, timestamp: timestamp, userName: userName, notes: notes };
        rowData.push(row);
      }
    }
    return rowData;
  }

  render() {
    return (this.state.initialLoad ? <Skeleton variant="rect"/> :
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
        exportFileName: this.createExportFileName(),
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
        open={this.state.open}
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
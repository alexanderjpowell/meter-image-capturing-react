import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MaterialTable from 'material-table';
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
        { title: 'ID', field: 'machineId' },
        { title: 'P1', field: 'progressive1' },
        { title: 'P2', field: 'progressive2' },
        { title: 'P3', field: 'progressive3' },
        { title: 'P4', field: 'progressive4' },
        { title: 'P5', field: 'progressive5' },
        { title: 'P6', field: 'progressive6' },
        { title: 'Timestamp', field: 'timestamp' },
        { title: 'User', field: 'user' },
      ],
      data: [],
      //emptyDataSourceMessage: 'No Results',
      open: false,
    };
  }

  async componentDidUpdate(prevProps) {
    if ((this.props.startDate !== prevProps.startDate) || (this.props.endDate !== prevProps.endDate)) {
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
  }

  // On mount, fetch 50 most recent scans regardless of date
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
      let timestamp = scans[i].get('timestamp').toDate().toDateString();
      let user = scans[i].get('userName');
      let notes = scans[i].get('notes');
      let row = { docId: docId, machineId: machineId, progressive1: progressive1, progressive2: progressive2, progressive3: progressive3, progressive4: progressive4, progressive5: progressive5, progressive6: progressive6, timestamp: timestamp, user: user, notes: notes };
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
      detailPanel={rowData => {
        return (
          <div>
            {rowData.notes}
          </div>
        )
      }}
      options={{
        actionsColumnIndex: -1,
        search: false,
        exportAllData: true,
        exportButton: true,
        selection: true,
        pageSize: 10,
        pageSizeOptions: [],
        detailPanelType: 'single'
      }}
      localization={{
        body: {
          emptyDataSourceMessage: 'No Results'
        }
      }}
      actions={[
        {
          tooltip: 'Delete all selected rows',
          icon: 'delete',
          onClick: (evt, data) => alert('You want to delete ' + data.length + ' rows')
        },
        /*{
          tooltip: 'Refresh Data',
          icon: 'refresh',
          isFreeAction: true
          //onClick: (evt, data) => alert('You want to delete ' + data.length + ' rows')
        }*/
      ]}
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
          new Promise((resolve) => {
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
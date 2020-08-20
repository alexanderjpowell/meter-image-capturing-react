import React, { Component } from 'react';
import MaterialTable from 'material-table';
import { withRouter } from 'react-router-dom';
import firebase from '../../../../firebase/firebase'

//export default function UsersTable() {
class UsersTable extends Component {

  constructor(props) {
    super(props);
    if (!firebase.getCurrentUser()) {
      props.history.replace('/signin');
    }
    this.state = {
      columns: [
        { title: 'Name', field: 'name' },
        { title: 'Pin Code', field: 'pinCode' },
      ],
      data: []
    };
  }

  async componentDidMount() {
    let usernames = await firebase.queryAllUserNames();
    let rowData = [];
    for (let i = 0; i < usernames.length; i++) {
      let displayName = usernames[i].get('displayName');
      //let pinCode = usernames[i].get('pinCode');
      let row = { name: displayName, pinCode: '****' };
      rowData.push(row);
    }
    this.setState({ data: rowData });
  }

  render() {

  return (
    <MaterialTable
      title="Editable Example"
      columns={this.state.columns}
      data={this.state.data}
      options={{
        rowStyle: {
          fontSize: 14,
          fontFamily: 'Roboto',
        }
      }}
      editable={{
        onRowAdd: (newData) =>
          new Promise((resolve) => {
            
            firebase.addUserName(newData.name, newData.pinCode);
            newData['pinCode'] = '****';
            setTimeout(() => {
              resolve();
              this.setState((prevState) => {
                const data = [...prevState.data];
                data.push(newData);
                return { ...prevState, data };
              });
            }, 600);
          }),
        /*onRowUpdate: (newData, oldData) =>
          new Promise((resolve) => {
            firebase.updateUserName(oldData.name, newData.name, newData.pinCode);
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
          }),*/
        onRowDelete: (oldData) =>
          new Promise((resolve) => {
            firebase.deleteUserName(oldData.name);
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
  );
    }
}

export default withRouter(UsersTable);
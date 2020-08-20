import React, { Component } from 'react';
//import ReactDOM from 'react-dom'
import firebase from '../../../firebase/firebase';
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

const styles = (theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
});

class FileUploadButton extends Component {

    constructor(props) {
        super(props);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.state = { open: false };
    }

    async onChangeHandler(event) {
        this.setState({open: true});
        const that = this;
        firebase.uploadFile(event.target.files[0]).then(function(result){
            result.ref.getDownloadURL().then(function(downloadURL) {
                //console.log(downloadURL);
                that.setState({open: false});
            });
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Button variant="contained" color="primary" component="label" startIcon={<CloudUploadIcon />}>
                    Upload<input type="file" name="file" onChange={this.onChangeHandler} style={{ display: "none" }}/>
                </Button>
                <Backdrop className={classes.backdrop} open={this.state.open}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>
        );
    }
}

export default withStyles(styles)(FileUploadButton);
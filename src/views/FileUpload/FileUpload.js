import React, { Component } from 'react';
//import ReactDOM from 'react-dom'
import firebase from '../../firebase/firebase';
import empty from '../Images/empty-search.svg';
import { FileUploadButton, ToDoListProgress } from './components';
import { Grid, Card, CardContent, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
    root: {
        width: '100%',
        fontFamily: 'Roboto',
        padding: theme.spacing(4)
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        //padding: theme.spacing(6)
    },
    instructionsTitle: {
        fontSize: 24,
    },
    instructions: {
        fontSize: 18,
    },
    paddingItem: {
        padding: theme.spacing(2),
    },
    description: {
        fontSize: 18,
    },
    descriptionSmall: {
        fontSize: 15,
    }
});

class FileUpload extends Component {

    constructor(props) {
        super(props);
        this.state = { fileUrl: null };
    }

    componentDidMount() {
        const that = this;
        console.log('componentDidMount');
        firebase.getToDoFileURL().then(function(url) {
            console.log(url);
            that.setState({ fileUrl: url });
        });
    }

    render() {
        const { classes } = this.props;
        let display;
        if (this.state.fileUrl === null) {
            display = <Grid item
                        align="center"
                        xs={12}
                        lg={5}
                        xl={5}>
                            <Card className={classes.emptyState}>
                                <img className={classes.paddingItem} src={empty} alt="Empty" width="50%" height="50%" />
                                <Typography className={classes.description}>You haven't added any to do lists. Upload a file to get started:</Typography>
                            </Card>
                        </Grid>
        } else {
            display = <Grid item
                        align="center"
                        xs={12}
                        lg={5}
                        xl={5}>
                            <ToDoListProgress />
                        </Grid>;
        }
        return (
            <div className={classes.root}>
                <Grid container
                spacing={4}
                justify="center">
                    
                    <Grid item
                    xs={12}
                    lg={7}
                    xl={7}>
                        <Card >
                            <CardContent>
                                <Typography className={classes.instructionsTitle}>CSV Upload Instructions</Typography><br/>
                                <Typography className={classes.instructions}>MiC supports CSV file uploads for easier management of progressive scans. To get started create a .csv file with the following column headers:</Typography>
                            <ul>
                                <li>location</li>
                                <li>machine_id</li>
                                <li>description</li>
                                <li>progressive_count</li>
                                <li>user</li>
                                <li>p_1, p_2, p_3, p_4, p_5, p_6, p_7, p_8, p_9, p_10</li>
                            </ul>
                            <div className={classes.paddingItem}><FileUploadButton /></div>
                            </CardContent>
                        </Card>
                    </Grid>
                    {display}
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(FileUpload);
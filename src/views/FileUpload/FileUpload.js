import React, { Component } from 'react';
//import ReactDOM from 'react-dom'
import firebase from '../../firebase/firebase';
//import empty from '../Images/empty-search.svg';
import { FileUploadButton, ToDoListProgress } from './components';
import { Grid, Card, CardContent, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
//import ListItemText from '@material-ui/core/ListItemText';
import Link from '@material-ui/core/Link';

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
        //let display;
        if (this.state.fileUrl === null) {
            /*display = <Grid item
                        align="center"
                        xs={12}
                        lg={5}
                        xl={5}>
                            <Card className={classes.emptyState}>
                                <img className={classes.paddingItem} src={empty} alt="Empty" width="50%" height="50%" />
                                <Typography className={classes.description}>You haven't added any to do lists. Upload a file to get started:</Typography>
                            </Card>
                        </Grid>;*/
        } else {
            /*display = <Grid item
                        align="center"
                        xs={12}
                        lg={5}
                        xl={5}>
                            <ToDoListProgress />
                        </Grid>;*/
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
                                <List dense="true">
                                    <ListItem>location</ListItem>
                                    <ListItem>machine_id - no two rows in your .csv should include the same machine_id</ListItem>
                                    <ListItem>description</ListItem>
                                    <ListItem>progressive_count (optional, between 1 and 10)</ListItem>
                                    <ListItem>user (optional)</ListItem>
                                    <ListItem>p_1, p_2, p_3, p_4, p_5, p_6, p_7, p_8, p_9, p_10 (optional)</ListItem>
                                    <ListItem>r_1, r_2, r_3, r_4, r_5, r_6, r_7, r_8, r_9, r_10 (optional)</ListItem>
                                </List>
                                <Typography className={classes.instructions}>You can view sample files <Link href="https://raw.githubusercontent.com/alexanderjpowell/meter-image-capturing-react/master/example_upload_files/sample_number.csv" target="_blank" rel="noreferrer">here</Link>, <Link href="https://raw.githubusercontent.com/alexanderjpowell/meter-image-capturing-react/master/example_upload_files/sample_descriptions.csv" target="_blank" rel="noreferrer">here</Link>, <Link href="https://raw.githubusercontent.com/alexanderjpowell/meter-image-capturing-react/master/example_upload_files/sample_descriptions_with_users.csv" target="_blank" rel="noreferrer">here</Link> and <Link href="https://raw.githubusercontent.com/alexanderjpowell/meter-image-capturing-react/master/example_upload_files/sample_descriptions_10_progressives.csv" target="_blank" rel="noreferrer">here</Link>.</Typography>
                                <div className={classes.paddingItem}><FileUploadButton /></div>
                            </CardContent>
                        </Card>
                    </Grid>
                    {/*{display}*/}
                    <Grid item
                        align="center"
                        xs={12}
                        lg={5}
                        xl={5}>
                            <ToDoListProgress />
                        </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(FileUpload);
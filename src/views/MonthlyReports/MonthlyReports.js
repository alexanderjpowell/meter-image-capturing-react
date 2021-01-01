import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Container, Grid, Card, CardContent, Typography, Link } from '@material-ui/core';
import firebase from '../../firebase/firebase';

const styles = (theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(3)
    }
});

class MonthlyReports extends Component {

    constructor(props) {
        super();
        if (!firebase.getCurrentUser()) {
            props.history.replace('/signin');
        }
        this.state = { reportFileNames: [], reportUrls: [] };
    }

    async componentDidMount() {
        var reportUrls = await firebase.getMonthlyReports();
        var names = reportUrls.map((item => item.name));
        var urls = await Promise.all(reportUrls.map((item => item.getDownloadURL())));
        this.setState({ reportFileNames: names, reportUrls: urls });
    }

    render() {
        const { classes } = this.props;
        return (
            <Container className={classes.root} maxWidth={false}>
                <Grid
                    item
                    xl={12}
                    lg={12}
                    sm={12}
                    xs={12}>
                    <Card style={{ height: '100%' }}>
                        <CardContent>
                            <Typography color="textSecondary" variant="h3">Monthly Reports</Typography>
                            <br/>
                            <hr/>
                            <br/>
                            {this.state.reportFileNames.map((url, index) =>
                                <Typography color="textPrimary" variant="h4" key={index}>
                                    <Link href={this.state.reportUrls[index]}>
                                        {url}
                                    </Link>
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Container>
        )
    }
}

export default withStyles(styles)(MonthlyReports);
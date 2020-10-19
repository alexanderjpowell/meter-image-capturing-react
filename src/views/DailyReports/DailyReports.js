import 'date-fns';
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Container, Grid, Card, CardContent, Typography } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MaterialTable from 'material-table';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Tooltip from '@material-ui/core/Tooltip';
import firebase from '../../firebase/firebase';

const styles = (theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(3)
    },
    datepicker: {
        display: 'inline-flex',
    },
    questionicon: {
        justifyContent: "flex-end"
    },
    statsGrids: {
        height: "100%"
    }
});

class DailyReports extends Component {

    constructor(props) {
        super();
        if (!firebase.getCurrentUser()) {
            props.history.replace('/signin');
            //return null;
        }
        this.state = { data: [], overflowCount: 0, totalChange: 0, totalScans: 0, queryDate: new Date(), loading: true };
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleDateChange(new Date()); // Initially query from current date
    }

    async handleDateChange(date) {
        var dateObject = new Date(date);
        var resetTime = await firebase.getResetTime();
        console.log(resetTime);
        let year = dateObject.getFullYear();
        let month = dateObject.getMonth();
        let day = dateObject.getDate();
        let hours = resetTime.getHours();
        let minutes = resetTime.getMinutes();
        let data = await firebase.getDocsOnDate(year, month, day, hours, minutes);
        let sum = 0;
        let overflowcount = 0;
        data.forEach(function(item) {
            sum += item.change;
            if (item.change >= item.base * item.increment) {
                overflowcount++;
            }
        });
        this.setState({ data: data, overflowCount: overflowcount, totalChange: sum, totalScans: data.length, queryDate: dateObject, loading: false });
    }

    // Returns date string in MM/DD/YYYY format
    convertDateToString(date) {
        return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    }

    calculatePreviousDate(date) {
        let prevDate = new Date(date);
        prevDate.setDate(prevDate.getDate() - 1);
        return prevDate;
    }

    render() {
        const { classes } = this.props;
        const tooltipMessage = 'Please set the progressive reset time in the settings tab.  Querying a specific date will fetch all records in a 24 hour window starting at the reset time on the date in question. ';

        var percentOver = this.state.overflowCount / this.state.totalScans;
        if (isNaN(percentOver)) {
            percentOver = 0;
        }
        return (
            <Container className={classes.root} maxWidth={false}>
                <Grid
                    container
                    spacing={3}
                >
                    
                    <Grid
                        item
                        lg={3}
                        sm={6}
                        xl={3}
                        xs={12}
                    >
                        <Card style={{ height: '100%' }}>
                            <CardContent>
                                <Grid 
                                    container
                                    direction="row"
                                    justify="space-between"
                                    alignItems="flex-start"
                                    spacing={3}
                                    >
                                    <Grid item>
                                        <Typography color="textSecondary" gutterBottom variant="h6">REPORT DATE</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Tooltip title={tooltipMessage}>
                                            <HelpOutlineIcon/>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                            margin="normal"
                                            id="date-picker-dialog"
                                            //label="Date picker dialog"
                                            format="MM/dd/yyyy"
                                            value={this.state.queryDate}
                                            onChange={this.handleDateChange}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid
                        item
                        lg={3}
                        sm={6}
                        xl={3}
                        xs={12}
                    >
                        <Card style={{ height: '100%' }}>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom variant="h6">PERCENT OVER</Typography>
                                <Typography color="textPrimary" variant="h3">{this.state.loading ? '-' : percentOver + '%'}</Typography>
                                <Typography color="textSecondary" variant="caption">{this.state.loading ? '' : this.state.overflowCount + ' / ' + this.state.totalScans + ' scans over quota'}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid
                        item
                        lg={3}
                        sm={6}
                        xl={3}
                        xs={12}
                    >
                        <Card style={{ height: '100%' }}>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom variant="h6">TOTAL SCANS</Typography>
                                    <Typography color="textPrimary" variant="h3">{this.state.loading ? '-' : this.state.totalScans}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid
                        item
                        lg={3}
                        sm={6}
                        xl={3}
                        xs={12}
                    >
                        <Card style={{ height: '100%' }}>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom variant="h6">TOTAL CHANGE</Typography>
                                <Typography color="textPrimary" variant="h3">{this.state.loading ? '-' : this.state.totalChange}</Typography>
                                <Typography color="textSecondary" variant="caption">{this.state.loading ? '' : 'Compared to the previous day'}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid
                        item
                        lg={12}
                        sm={12}
                        xl={12}
                        xs={12}
                    >
                        <Card>
                            <MaterialTable
                                //title="Demo Title"
                                columns={[
                                    { title: 'Location', field: 'location' },
                                    { title: 'Asset #', field: 'machine_id' },
                                    { title: 'Description', field: 'prog_name' },
                                    { title: 'Base', field: 'base', type: 'numeric' },
                                    { title: 'Increment', field: 'increment', type: 'numeric' },
                                    { title: this.convertDateToString(this.calculatePreviousDate(this.state.queryDate)), field: 'prev_day_val', type: 'numeric' },
                                    { title: this.convertDateToString(this.state.queryDate), field: 'cur_day_val', type: 'numeric' },
                                    { title: 'Change', field: 'change', type: 'numeric' }
                                ]}
                                data={this.state.data}
                                /*data={[
                                    { location: 'EC0701-0704', machine_id: '1234', prog_name: 'Major', base: 10000 , increment: 0.5, prev_day_val: 12942.00, cur_day_val: 13004.00 , change: 62 },
                                    { location: 'EC0701-0704', machine_id: '1234', prog_name: 'Minor', base: 800 , increment: 0.1, prev_day_val: 1095.00, cur_day_val: 883.00 , change: -212 },
                                    { location: 'EC1003', machine_id: '1235', prog_name: 'Grand', base: 8800 , increment: 0.75, prev_day_val: 8817.00, cur_day_val: 8818.00 , change: 1 },
                                    { location: 'EC1003', machine_id: '1235', prog_name: 'Mini', base: 880 , increment: 0.25, prev_day_val: 1061.00, cur_day_val: 1068.00 , change: 7 },
                                ]}*/
                                options={{
                                    pageSize: 10,
                                    toolbar: false,
                                    search: false,
                                    rowStyle: {
                                        fontSize: 14,
                                        fontFamily: 'Roboto',
                                    },
                                }}
                            />
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        );
    }
}

export default withStyles(styles)(DailyReports);
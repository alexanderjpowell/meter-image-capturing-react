import 'date-fns';
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Container, Grid, Card, CardContent, Typography, Switch } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MaterialTable from 'material-table';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
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
        }
        this.state = { allData: [], filteredData: [], presentableData: [], underflowCount: 0, totalChange: 0, totalScans: 0, queryDate: new Date(), loading: true, displayExceptionsOnly: false };
        this.handleDateChange = this.handleDateChange.bind(this);
        this.filterAllorExceptionScans = this.filterAllorExceptionScans.bind(this);
        this.handleDateChange(new Date()); // Initially query from current date
    }

    async handleDateChange(date) {
        var dateObject = new Date(date);
        var resetTime = await firebase.getResetTime();
        let year = dateObject.getFullYear();
        let month = dateObject.getMonth();
        let day = dateObject.getDate();
        let hours = resetTime.getHours();
        let minutes = resetTime.getMinutes();
        let allData = await firebase.getDocsOnDate(year, month, day, hours, minutes);
        let sum = 0;
        let underflowcount = 0;

        let filteredData = [];
        allData.forEach(function(item) {
            sum += item.change;
            if (item.exception) {
                filteredData.push(item);
                underflowcount++;
            }
        });

        if (this.state.displayExceptionsOnly) {
            this.setState({ allData: allData, filteredData: filteredData, presentableData: filteredData, underflowCount: underflowcount, totalChange: sum, totalScans: allData.length, queryDate: dateObject, loading: false });
        } else {
            this.setState({ allData: allData, filteredData: filteredData, presentableData: allData, underflowCount: underflowcount, totalChange: sum, totalScans: allData.length, queryDate: dateObject, loading: false });
        }
    }

    filterAllorExceptionScans(event) {
        let checked = event.target.checked;
        if (checked) { // Show only exceptions
            this.setState({ presentableData: this.state.filteredData, displayExceptionsOnly: checked });
        } else {
            this.setState({ presentableData: this.state.allData, displayExceptionsOnly: checked });
        }
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

        var percentUnder = (this.state.underflowCount / this.state.totalScans) * 100;
        if (isNaN(percentUnder)) {
            percentUnder = 0;
        }
        return (
            <Container className={classes.root} maxWidth={false}>
                <Grid
                    container
                    spacing={3}
                >
                    <Grid
                        item
                        xl={3}
                        lg={3}
                        sm={12}
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
                        xl={2}
                        lg={2}
                        sm={12}
                        xs={12}
                    >
                        <Card style={{ height: '100%' }}>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom variant="h6">PERCENT UNDER</Typography>
                                <Typography color="textPrimary" variant="h3">{this.state.loading ? '-' : percentUnder + '%'}</Typography>
                                <Typography color="textSecondary" variant="caption">{this.state.loading ? '' : this.state.underflowCount + ' / ' + this.state.totalScans + ' scans under quota'}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid
                        item
                        xl={2}
                        lg={2}
                        sm={12}
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
                        xl={2}
                        lg={2}
                        sm={12}
                        xs={12}
                    >
                        <Card style={{ height: '100%' }}>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom variant="h6">TOTAL CHANGE</Typography>
                                <Typography color="textPrimary" variant="h3">{this.state.loading ? '-' : firebase.round(this.state.totalChange)}</Typography>
                                <Typography color="textSecondary" variant="caption">{this.state.loading ? '' : 'Compared to the previous day'}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid
                        item
                        xl={3}
                        lg={3}
                        sm={12}
                        xs={12}
                    >
                        <Card style={{ height: '100%' }}>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom variant="h6">FILTER RESULTS</Typography>
                                <Switch checked={this.state.displayExceptionsOnly} onChange={this.filterAllorExceptionScans} label="Chip 1" color="secondary" style={{marginRight: 5}}/>
                                <Typography>Only display results over and under the metrics provided in settings</Typography>
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
                                title="Daily Change"
                                columns={[
                                    { title: 'Location', field: 'location' },
                                    { title: 'Machine ID', field: 'machine_id' },
                                    //{ title: 'Description', field: 'prog_name' },
                                    { title: 'Base', field: 'base', type: 'numeric' },
                                    { title: 'Increment %', field: 'increment', type: 'numeric' },
                                    { title: this.convertDateToString(this.calculatePreviousDate(this.state.queryDate)), field: 'prev_day_val' },
                                    { title: this.convertDateToString(this.state.queryDate), field: 'cur_day_val' },
                                    { title: 'Change', field: 'change', type: 'numeric', render: rowData => {
                                            if (rowData.change >= 0) {
                                                return <Chip icon={<ArrowUpwardIcon/>} variant="outlined" color="secondary" label={rowData.change + '%'} />;
                                            } else {
                                                return <Chip icon={<ArrowDownwardIcon/>} variant="outlined" color="primary" label={rowData.change + '%'} />;
                                            }
                                        }
                                    }
                                ]}
                                data={this.state.presentableData}
                                /*data={[
                                    { location: 'EC0701-0704', machine_id: '1234', prog_name: 'Major', base: 10000 , increment: 0.5, prev_day_val: 12942.00, cur_day_val: 13004.00 , change: 62, hidden: true },
                                    { location: 'EC0701-0704', machine_id: '1234', prog_name: 'Minor', base: 800 , increment: 0.1, prev_day_val: 1095.00, cur_day_val: 883.00 , change: -212 },
                                    { location: 'EC1003', machine_id: '1235', prog_name: 'Grand', base: 8800 , increment: 0.75, prev_day_val: 8817.00, cur_day_val: 8818.00 , change: 1 },
                                    { location: 'EC1003', machine_id: '1235', prog_name: 'Mini', base: 880 , increment: 0.25, prev_day_val: 1061.00, cur_day_val: 1068.00 , change: 7 },
                                ]}*/
                                options={{
                                    exportButton: true,
                                    pageSize: 10,
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
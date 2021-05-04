import 'date-fns';
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Container, Grid, Card, CardContent, Typography, Box, Switch } from '@material-ui/core';
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
    },
    textArea: {
        marginTop: '10px',
    },
    textAreaBottom: {
        marginBottom: '10px',
    }
});

class DailyReports extends Component {

    constructor(props) {
        super();
        if (!firebase.getCurrentUser()) {
            props.history.replace('/signin');
        }
        this.state = { allData: [], filteredData: [], presentableData: [], underflowCount: 0, totalChange: 0, totalScans: 0, prevDaySum: 0, curDaySum: 0, queryDate: new Date(), loading: true, displayExceptionsOnly: false };
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
        //let changeAbsolute = 0;
        let underflowcount = 0;
        let filteredData = [];
        let prevDaySum = 0;
        let curDaySum = 0;
        allData.forEach(function(item) {
            //changeAbsolute += item.dollar_change;
            let p = Number(item.prev_day_val);
            let c = Number(item.cur_day_val);
            if (!isNaN(p)) {
                prevDaySum += p;
            }
            if (!isNaN(c)) {
                curDaySum += c;
            }
            if (item.exception) {
                filteredData.push(item);
                underflowcount++;
            }
        });

        if (this.state.displayExceptionsOnly) {
            this.setState({ allData: allData, filteredData: filteredData, presentableData: filteredData, underflowCount: underflowcount, totalChange: curDaySum - prevDaySum, totalScans: allData.length, prevDaySum: prevDaySum, curDaySum: curDaySum, queryDate: dateObject, loading: false });
        } else {
            this.setState({ allData: allData, filteredData: filteredData, presentableData: allData, underflowCount: underflowcount, totalChange: curDaySum - prevDaySum, totalScans: allData.length, prevDaySum: prevDaySum, curDaySum: curDaySum, queryDate: dateObject, loading: false });
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
                                <Grid container>
                                
                                <Switch checked={this.state.displayExceptionsOnly} onChange={this.filterAllorExceptionScans} label="Chip 1" color="secondary" style={{marginRight: 5}}/>
                                <Typography>Only display results over and under the metrics provided in settings</Typography>
                                </Grid>
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
                                <Typography color="textSecondary" gutterBottom variant="h6">EXCEPTION PERCENTAGE</Typography>
                                <Typography color="textPrimary" variant="h3">{this.state.loading ? '-' : firebase.round(percentUnder) + '%'}</Typography>
                                <Typography color="textSecondary" variant="caption">{this.state.loading ? '' : this.state.underflowCount + ' / ' + this.state.totalScans + ' scans fall outside the range set for exceptions'}</Typography>
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
                                <Typography color="textSecondary" gutterBottom variant="h6">PROGRESSIVE LIABILITY</Typography>
                                <Typography color="textPrimary" variant="h3">{this.state.loading ? '-' : '$' + firebase.formatNumberString(firebase.round(this.state.prevDaySum))}</Typography>
                                <Typography color="textSecondary" variant="caption">
                                    <Box>Total Progressive Liability for</Box>
                                    <Box fontWeight="fontWeightBold">{this.convertDateToString(this.calculatePreviousDate(this.state.queryDate))}</Box>
                                </Typography>
                                <hr className={classes.textArea}/>
                                <Typography className={classes.textArea} color="textPrimary" variant="h3">{this.state.loading ? '-' : '$' + firebase.formatNumberString(firebase.round(this.state.curDaySum))}</Typography>
                                <Typography color="textSecondary" variant="caption">
                                    <Box>Total Progressive Liability for</Box>
                                    <Box fontWeight="fontWeightBold">{this.convertDateToString(this.state.queryDate)}</Box>
                                </Typography>
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
                                <Typography color="textSecondary" gutterBottom variant="h6">DAILY CHANGE IN SCANNED PROGRESSIVE LIABILITY</Typography>
                                <Typography color="textPrimary" variant="h3">{this.state.loading ? '-' : '$' + firebase.formatNumberString(firebase.round(this.state.totalChange))}</Typography>
                                <Typography color="textSecondary" variant="caption">{this.state.loading ? '' : 'Compared to the previous day'}</Typography>
                                <hr className={classes.textArea}/>
                                <Typography className={classes.textArea} color="textPrimary" variant="h3">{this.state.loading ? '-' : this.state.totalScans}</Typography>
                                <Typography color="textSecondary" variant="caption">Total scans</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/*<Grid
                        item
                        xl={2}
                        lg={2}
                        sm={12}
                        xs={12}
                    >
                        <Card style={{ height: '100%' }}>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom variant="h6">FILTER RESULTS FOR EXCEPTIONS</Typography>
                                <Switch checked={this.state.displayExceptionsOnly} onChange={this.filterAllorExceptionScans} label="Chip 1" color="secondary" style={{marginRight: 5}}/>
                                <Typography>Only display results over and under the metrics provided in settings</Typography>
                            </CardContent>
                        </Card>
                    </Grid>*/}
                    
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
                                    { title: 'Location', field: 'location', editable: 'never' },
                                    { title: 'Machine ID', field: 'machine_id', editable: 'never' },
                                    { title: 'Progressive Index', field: 'progressive_index', editable: 'never', render: rowData => {
                                            return <Chip variant="outlined" label={'Progressive ' + rowData.progressive_index}/>
                                        }
                                    },
                                    { title: 'Notes', field: 'notes', editable: 'never', render: rowData => {
                                            if (rowData.notes === null) {
                                                return "-";
                                            } else if (rowData.notes.length >= 25) {
                                                return rowData.notes.substring(0, 20) + '...';
                                            } else {
                                                return rowData.notes;
                                            }
                                        }
                                    },
                                    { title: 'Base', field: 'base', editable: 'never' },
                                    { title: 'Increment %', field: 'increment', type: 'numeric', editable: 'never' },
                                    { title: this.convertDateToString(this.calculatePreviousDate(this.state.queryDate)), field: 'prev_day_val', type: 'numeric', editable: 'never' },
                                    { title: this.convertDateToString(this.state.queryDate), field: 'cur_day_val', type: 'numeric', editable: 'onUpdate' },
                                    { title: 'Change ($)', field: 'dollar_change', type: 'numeric', editable: 'never', defaultSort: 'asc', render: rowData => {
                                            if (rowData.dollar_change >= 0) {
                                                return <Chip icon={<ArrowUpwardIcon/>} variant="outlined" color="secondary" label={'$' + rowData.dollar_change} />;
                                            } else {
                                                return <Chip icon={<ArrowDownwardIcon/>} variant="outlined" color="primary" label={'$' + rowData.dollar_change} />;
                                            }
                                        }
                                    },
                                    { title: 'Change (%)', field: 'percent_change', type: 'numeric', editable: 'never', render: rowData => {
                                            if (rowData.percent_change >= 0) {
                                                return <Chip icon={<ArrowUpwardIcon/>} color="secondary" label={rowData.percent_change + '%'} />;
                                            } else {
                                                return <Chip icon={<ArrowDownwardIcon/>} color="primary" label={rowData.percent_change + '%'} />;
                                            }
                                        }
                                    }
                                ]}
                                data={this.state.presentableData}
                                options={{
                                    actionsColumnIndex: -1,
                                    exportAllData: true,
                                    exportButton: true,
                                    pageSize: 10,
                                    pageSizeOptions: [],
                                    search: false,
                                    sorting: true,
                                    rowStyle: {
                                        fontSize: 14,
                                        fontFamily: 'Roboto',
                                    },
                                }}
                                editable={{
                                    onRowUpdate: (newData, oldData) =>
                                        new Promise((resolve) => {
                                            firebase.updateScanFromDailyChange(oldData, newData);
                                            console.log(newData);
                                            setTimeout(() => {
                                                resolve();
                                                if (oldData) {
                                                    const dataUpdate = [...this.state.presentableData];
                                                    const index = oldData.tableData.id;
                                                    dataUpdate[index] = newData;
                                                    this.setState({ presentableData: dataUpdate });
                                                }
                                            }, 600);
                                        }),
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
import 'date-fns';
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Container, Grid, Card, CardContent, Typography } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MaterialTable from 'material-table'

const styles = (theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(3)
    }
});

class DailyReports extends Component {

    constructor() {
        super();
        this.handleDateChange = this.handleDateChange.bind(this);
    }

    handleDateChange() {

    }

    render() {
        const { classes } = this.props;
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
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom variant="h6">REPORT DATE</Typography>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        margin="normal"
                                        id="date-picker-dialog"
                                        //label="Date picker dialog"
                                        format="MM/dd/yyyy"
                                        //value={selectedDate}
                                        onChange={this.handleDateChange}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </MuiPickersUtilsProvider>
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
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom variant="h6">PERCENT OVER</Typography>
                                <Typography color="textPrimary" variant="h3">7%</Typography>
                                <Typography color="textSecondary" variant="caption">7 / 100 scans over quota</Typography>
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
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom variant="h6">TOTAL SCANS</Typography>
                                <Typography color="textPrimary" variant="h3">123</Typography>
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
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom variant="h6">TOTAL CHANGE</Typography>
                                <Typography color="textPrimary" variant="h3">+ $23,773.00 </Typography>
                                <Typography color="textSecondary" variant="caption">Compared to the previous day</Typography>
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
                                    { title: 'Prog Name', field: 'prog_name' },
                                    { title: 'Base', field: 'base', type: 'numeric' },
                                    { title: 'Increment', field: 'increment', type: 'numeric' },
                                    { title: '9/26/2020', field: 'prev_day_val', type: 'numeric' },
                                    { title: '9/27/2020', field: 'cur_day_val', type: 'numeric' },
                                    { title: 'Change', field: 'change', type: 'numeric' }
                                ]}
                                data={[
                                    { location: 'EC0701-0704', machine_id: '1234', prog_name: 'Major', base: 10000 , increment: 0.5, prev_day_val: 12942.00, cur_day_val: 13004.00 , change: 62 },
                                    { location: 'EC0701-0704', machine_id: '1234', prog_name: 'Minor', base: 800 , increment: 0.1, prev_day_val: 1095.00, cur_day_val: 883.00 , change: -212 },
                                    { location: 'EC1003', machine_id: '1235', prog_name: 'Grand', base: 8800 , increment: 0.75, prev_day_val: 8817.00, cur_day_val: 8818.00 , change: 1 },
                                    { location: 'EC1003', machine_id: '1235', prog_name: 'Mini', base: 880 , increment: 0.25, prev_day_val: 1061.00, cur_day_val: 1068.00 , change: 7 },
                                ]}
                                options={{
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
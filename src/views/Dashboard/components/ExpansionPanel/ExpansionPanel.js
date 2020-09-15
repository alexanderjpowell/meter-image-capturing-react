import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Chip from '@material-ui/core/Chip';
import TuneIcon from '@material-ui/icons/Tune';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { MuiThemeProvider, Button, Grid } from "@material-ui/core";
import DateFnsUtils from '@date-io/date-fns';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
//import Divider from '@material-ui/core/Divider';

const themeText = createMuiTheme({
    typography: {
        fontSize: 14,
    },
});

const styles = theme => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    icon: {
        marginRight: theme.spacing(2),
        verticalAlign: 'bottom',
        height: 20,
        width: 20,
    },
    details: {
        alignItems: 'center',
    },
    chip: {
        margin: 2
    },
    column: {
        flexBasis: '33.33%',
    },
    helper: {
        borderLeft: `2px solid ${theme.palette.divider}`,
        padding: theme.spacing(1, 2),
    },
    link: {
        color: theme.palette.primary.main,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
    formControl: {
        marginTop: theme.spacing(1),
        minWidth: 120,
    },
    timePickers: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(2),
    },
});

class DetailedExpansionPanel extends Component {

    constructor(props) {
        super(props);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.handleDateRangeSearch = this.handleDateRangeSearch.bind(this);
        this.handleDateClick = this.handleDateClick.bind(this);
        this.state = { localStartDate: new Date(), localEndDate: new Date() };
    }

    handleStartDateChange(event) {
        this.setState({ localStartDate: event });
    }

    handleEndDateChange(event) {
        this.setState({ localEndDate: event });
    }

    handleDateRangeSearch() {
        this.props.onDateRangeSearchClick(this.state.localStartDate, this.state.localEndDate);
    }

    handleDateClick(code) {
        this.props.onDateClick(code);
    }

    render() {
        const { classes } = this.props;
        const localStartDate = this.state.localStartDate;
        const localEndDate = this.state.localEndDate;
    return (
        <div className={classes.root}>
            <ExpansionPanel>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1c-content"
                    id="panel1c-header">
                    <div className={classes.icon}><TuneIcon/></div>
                    <div className={classes.column}>
                        <Typography className={classes.heading}>Filter Results</Typography>
                    </div>
                    
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Grid container>
                        <Grid item lg={3} sm={6} md={6}>
                            <div className={classes.column}>
                                <Typography>Submission Date:</Typography>
                                <div>
                                    <Chip id="hour" label="Last hour" className={classes.chip} onClick={() => this.handleDateClick('hour')} />
                                </div>
                                <div>
                                    <Chip id="day" label="Today" className={classes.chip} onClick={() => this.handleDateClick('day')} />
                                </div>
                                <div>
                                    <Chip id="week" label="This week" className={classes.chip} onClick={() => this.handleDateClick('week')} />
                                </div>
                            </div>
                        </Grid>
                        <Grid item lg={3} sm={6} md={6}>
                            <div className={classes.column}>
                                <Typography>Sort By:</Typography>
                                <div>
                                    <Tooltip title="Feature coming soon"><Chip label="Timestamp" className={classes.chip}/></Tooltip>
                                </div>
                                <div>
                                    <Tooltip title="Feature coming soon"><Chip label="Machine ID" className={classes.chip}/></Tooltip>
                                </div>
                            </div>
                        </Grid>
                        <Grid item lg={3} sm={12} md={12}>
                            <div className={classes.column}>
                                <Typography>By User:</Typography>
                                <Tooltip title="Feature coming soon">
                                <FormControl variant="outlined" disabled='true' className={classes.formControl}>
                                    <InputLabel id="demo-simple-select-outlined-label">User</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        //value={age}
                                        //onChange={handleChange}
                                        label="Age">
                                        <MenuItem value=""><em>Show all</em></MenuItem>
                                        <MenuItem value={10}>Alex</MenuItem>
                                        <MenuItem value={20}>Alexander</MenuItem>
                                        <MenuItem value={30}>Joe</MenuItem>
                                        <MenuItem value={40}>Patrick</MenuItem>
                                    </Select>
                                </FormControl>
                                </Tooltip>
                            </div>
                        </Grid>
                        <Grid item lg={3} sm={12}>
                            <div className={classes.column}>
                                <Typography>
                                    Select a custom date range:
                                    <br />
                                    <ThemeProvider theme={themeText}>
                                    <div className={classes.timePickers}>
                                        <MuiThemeProvider >
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <DateTimePicker
                                                    label="From:"
                                                    inputVariant="outlined"
                                                    onChange={this.handleStartDateChange}
                                                    value={localStartDate}
                                                    />
                                            </MuiPickersUtilsProvider>
                                        </MuiThemeProvider>
                                    </div>
                                    <div className={classes.timePickers}>
                                        <MuiThemeProvider >
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <DateTimePicker
                                                    label="To:"
                                                    inputVariant="outlined"
                                                    onChange={this.handleEndDateChange}
                                                    value={localEndDate}
                                                    />
                                            </MuiPickersUtilsProvider>
                                        </MuiThemeProvider>
                                    </div>
                                    </ThemeProvider>
                                    <Button onClick={this.handleDateRangeSearch}>Search</Button>
                                </Typography>
                            </div>
                        </Grid>
                        {/*<div className={classes.column}>
                        </div>*/}
                        {/*<Grid item lg={2.4}>
                        <div className={classes.column}>
                            <Typography>Admin Mode</Typography>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel id="demo-simple-select-outlined-label">Casino</InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    //value={age}
                                    //onChange={handleChange}
                                    label="Age">
                                    <MenuItem value=""><em>Show all</em></MenuItem>
                                    <MenuItem value={10}>Bellagio</MenuItem>
                                    <MenuItem value={20}>Caesar's Palace</MenuItem>
                                    <MenuItem value={30}>Wynn</MenuItem>
                                    <MenuItem value={40}>Mandalay Bay</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        </Grid>*/}
                    </Grid>
                </ExpansionPanelDetails>
                {/*<Divider />
                <ExpansionPanelActions>
                    <Button size="small">Cancel</Button>
                    <Button size="small" color="primary">Search</Button>
                </ExpansionPanelActions>*/}
            </ExpansionPanel>
        </div>
    );
    }
}

DetailedExpansionPanel.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DetailedExpansionPanel);
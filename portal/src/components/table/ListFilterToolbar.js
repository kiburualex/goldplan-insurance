import { useState } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import searchFill from '@iconify/icons-eva/search-fill';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
import closeCircleFill from '@iconify/icons-eva/close-circle-fill';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs  as AdapterDateFns} from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// material
import { styled } from '@mui/material/styles';
import {
  Button,
  Stack,
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  CircularProgress
} from '@mui/material';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Api from '../../common/Api';
import {BASE_URL} from '../../common/Props';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3)
}));

// ----------------------------------------------------------------------

export default function ListFilterToolbar({ numSelected, selected, search, dateFrom, dateTo, handleSearchChange, handleDateFromChange, handleDateToChange, onFilter, onClear, targetLabel, filterLoading, scheduleMode }) {
    const deleteLink = `/${targetLabel}/ids`;
    const label = `${numSelected} item(s)`;
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const isSheduleMode = (scheduleMode != null || scheduleMode);

    const openModal = () => {
        setOpenDeleteModal(true);
    };

    const deleteAndCloseModal = () => {
        setLoading(true);
        const json = { "ids": selected };
        const url = `${BASE_URL}${deleteLink}`;
        Api.request("PUT", url, json, false)
            .then((response) =>{
                const json = response.data;
                const { message } = json
                if(message){
                    onFilter();
                    setOpenDeleteModal(false);
                    setLoading(false);
                    toast.success(message);
                }else{
                    setOpenDeleteModal(false);
                    setLoading(false);
                    alert(message);
                }
            }).catch((error)=>{
                console.log(error);
                setOpenDeleteModal(false);
                setLoading(false);
                alert(error);
            });        
    };

    const closeModal = () => {
        setOpenDeleteModal(false);
        setLoading(false);
    };

    const keyPress = (e) => {
        if(e.keyCode === 13){
           console.log('value', e.target.value);
           // put the login here
           handleSearchChange(e);
           onFilter(e);
        }
    }

    const handleLocalDateFromChange = (value) =>{
        const newDate = new Date(value);
        handleDateFromChange(newDate);
    }

    const handleLocalDateToChange = (value) => {
        const newDate = new Date(value);
        handleDateToChange(newDate);
    }

    return (
        <RootStyle
            sx={{
                ...(numSelected > 0 && {
                color: 'primary.main',
                bgcolor: 'primary.lighter'
                })
            }}
            >
            {numSelected > 0 ? (
                <Typography component="div" variant="subtitle1">
                {numSelected} selected
                </Typography>
            ) : (
                <Grid container spacing={2} direction="row" mb={2} mt={1}>
                    <Grid item xs={12} md={2} lg={2}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Stack direction="row" alignItems="center" justifyContent="center">
                                <MobileDatePicker
                                    label="Date From"
                                    inputFormat="DD/MM/YYYY"
                                    clearable
                                    value={dateFrom}
                                    onChange={handleLocalDateFromChange}
                                    maxDate={isSheduleMode ? null : new Date()}
                                    minDate={isSheduleMode ? new Date() : null}
                                    renderInput={(params) => <TextField sx={{width: '80%'}} variant="standard" {...params} />}
                                />
                            </Stack>
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} md={2} lg={2}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Stack direction="row" alignItems="center" justifyContent="center">
                                <MobileDatePicker
                                    label="Date To"
                                    inputFormat="DD/MM/YYYY"
                                    clearable
                                    value={dateTo}
                                    onChange={handleLocalDateToChange}
                                    maxDate={isSheduleMode ? null : new Date()}
                                    minDate={isSheduleMode ? new Date() : null}
                                    renderInput={(params) => <TextField sx={{width: '80%'}} variant="standard" {...params} />}
                                />
                            </Stack>
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} md={3} lg={3}>
                        <Stack direction="row" alignItems="center" justifyContent="center">
                            <TextField 
                                label="Search" 
                                value={search} 
                                onChange={handleSearchChange} 
                                onKeyDown={keyPress}
                                placeholder="search..." 
                                color="primary" 
                                variant="standard"
                                sx={{width: '80%'}}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={5} lg={5}>
                        <Stack direction="row" alignItems="center" justifyContent="center">
                            <Button
                                sx={{mr: 4}}
                                variant="contained"
                                color="inherit"
                                size="large"
                                startIcon={!filterLoading && <Icon icon={searchFill} />}
                                onClick={onFilter}
                                endIcon={filterLoading && <CircularProgress color="inherit" size={16} />}
                            >
                                { filterLoading ? "Search.." : "Filter"}
                            </Button>

                            <Button
                                variant="contained"
                                color="inherit"
                                size="large"
                                startIcon={<Icon icon={closeCircleFill} />}
                                onClick={onClear}
                                disabled={filterLoading}
                            >
                                Clear
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton onClick={openModal}>
                        <Icon icon={trash2Fill} />
                    </IconButton>
                </Tooltip>
            ) : null}

            <Dialog
                open={openDeleteModal}
                onClose={closeModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title"> 
                    Confirm Delete
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {`Do you want to permanently delete ${label}?`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{justifyContent: 'space-around', mb:2}}>
                    <Button onClick={closeModal} variant="contained" color="error">No</Button>
                    <Button 
                        onClick={deleteAndCloseModal} 
                        variant="contained"
                        autoFocus
                        disabled={loading}
                        endIcon={loading && <CircularProgress color="inherit" size={16} />}
                        > 
                        { loading ? "Deleting..." : "Yes"} 
                    </Button>
                </DialogActions>
            </Dialog>

        </RootStyle>
    );
}
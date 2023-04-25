
import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import BlockUi from 'react-block-ui';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import IconButton from '@mui/material/IconButton';
import { format } from 'date-fns';
// material
import {
    Container,
    Alert,
    Card,
    Table,
    Stack,
    Button,
    Checkbox,
    TableRow,
    TableBody,
    TableCell,
    Typography,
    TableContainer,
    Collapse,
    Zoom
} from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import { ListFilterToolbar, ListHead, ListMoreMenu, TableFooterPagination } from '../../components/table';
import ExportButton from '../../components/ExportButton';
import { BASE_URL } from '../../common/Props';
import Api from '../../common/Api';
import Helpers from '../../common/Helpers';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'name', label: 'Name', alignRight: false },
    { id: 'email', label: 'Email', alignRight: false },
    { id: 'phoneNumber', label: 'Phone Number', alignRight: false },
    { id: 'paybill', label: 'Paybill', alignRight: false },
    { id: 'timeCreated', label: 'Time Created', alignRight: false },
    { id: '' }
];

// ----------------------------------------------------------------------

function Row(props) {
    const { row, isItemSelected, handleClick, onFilter, expandable } = props;
    const [open, setOpen] = React.useState(false);
    const timeCreated = format(new Date(row.timeCreated), 'dd-MM-yyyy hh:mm a');

    return (
        <>
            <TableRow
                hover
                key={row.id}
                tabIndex={-1}
                role="checkbox"
                selected={isItemSelected}
                aria-checked={isItemSelected}
            >
                <TableCell padding="checkbox" size="small">
                    <Checkbox
                        checked={isItemSelected}
                        onChange={(event) => handleClick(event, row.id)}
                    />
                </TableCell>

                {
                    expandable && (
                        <TableCell size="small">
                            <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={() => setOpen(!open)}
                            >
                                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                        </TableCell>
                    )
                }

                <TableCell align="left" size="small">{row.name}</TableCell>
                <TableCell align="left" size="small">{row.email}</TableCell>
                <TableCell align="left" size="small">{row.phoneNumber}</TableCell>
                <TableCell align="left" size="small">{row.paybill}</TableCell>
                <TableCell align="left" size="small">{timeCreated}</TableCell>

                <TableCell align="right" size="small">
                    <ListMoreMenu id={row.id} onFilter={onFilter} targetLabel="insurances"/>
                </TableCell>
            </TableRow>

            {/*  collapse data */}

            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2}}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4} mt={2}>
                                    <Typography variant="subtitle1">
                                        Name
                                    </Typography>
                                    <Typography sx={{fontSize: 15}}>
                                        {row.name}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={4} mt={2}>
                                    <Typography variant="subtitle1">
                                        Email
                                    </Typography>
                                    <Typography sx={{fontSize: 15}}>
                                        {row.email}
                                    </Typography>
                                </Grid>
                               
                                <Grid item xs={12} md={4} mt={2}>
                                    <Typography variant="subtitle1">
                                        Phone Number
                                    </Typography>
                                    <Typography sx={{fontSize: 15}}>
                                        {row.phoneNumber}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={4} mt={2}>
                                    <Typography variant="subtitle1">
                                        Paybill
                                    </Typography>
                                    <Typography sx={{fontSize: 15}}>
                                        {row.paybill}
                                    </Typography>
                                </Grid>
                                
                            </Grid>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>

        </>
    )

}
export default function Users() {
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [search, setSearch] = useState('');
    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(null);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("Error!!");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [blocking, setBlocking] = useState(false);
    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [expandable, setExpandable] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setExpandable(false);
        fetchData();
    }, []);

    const fetchData = async (url=`${BASE_URL}/insurances`) =>{
        setBlocking(true);
        setLoading(true);
        setShowErrorAlert(false);
        await Api.get(url).then((response) =>{
            const json = response.data;
            const { pageProfile, data } = json;
            if(data.length > 0){
                setBlocking(false);
                setLoading(false);
                setData(data);
                setPageNumber(pageProfile.pageNumber + 1);
                setPageSize(pageProfile.pageSize);
                setTotalElements(pageProfile.totalElements);
                setTotalPages(pageProfile.totalPages);
            }else{
                setBlocking(false);
                setLoading(false);
                setData([]);
                setPageNumber(0);
                setPageSize(10);
                setTotalElements(0);
                setTotalPages(0);
            }       
        })
        .catch((error) =>{
            const resp = Api.getErrorMessage(error);
            if(resp === "token_expired"){
                localStorage.removeItem("token");
                navigate("/login")
            }else{
                setBlocking(false);
                setLoading(false);
                setData([]);
                setPageNumber(0);
                setPageSize(10);
                setTotalElements(0);
                setTotalPages(0);
                setShowErrorAlert(true);
                setErrorMessage(resp);
            }
        })
    }

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleDateFromChange = (value) => {
        setDateFrom(value);
    };

    const handleDateToChange = (value) => {
        setDateTo(value);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = data.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPageNumber(newPage);
        let params = `pageNumber=${newPage-1}&pageSize=${pageSize}&search=${search}`;
        if(dateFrom && dateTo){
            const startDate = format(dateFrom, 'yyyy-MM-dd');
            params = `${params}&startDate=${startDate}`;

            if(dateTo){
                const endDate = format(dateTo, 'yyyy-MM-dd');
                params = `${params}&endDate=${endDate}`;
            }
        }
        fetchData(`${BASE_URL}/insurances?${params}`);
    };

    const handleChangeRowsPerPage = (event) => {
        const pagesz = parseInt(event.target.value, 10);
        setPageSize(pagesz);
        let params = `pageNumber=0&pageSize=${pagesz}&search=${search}`;
        if(dateFrom && dateTo){
            const startDate = format(dateFrom, 'yyyy-MM-dd');
            params = `${params}&startDate=${startDate}`;

            if(dateTo){
                const endDate = format(dateTo, 'yyyy-MM-dd');
                params = `${params}&endDate=${endDate}`;
            }
        }
        fetchData(`${BASE_URL}/insurances?${params}`);
    };

    const onClear = () => {
        setDateFrom(null);
        setDateTo(null);
        setSearch("");
    }

    const onFilter = () => {
        setSelected([]);
        let params = `search=${search}`;
        if(dateFrom && dateTo){
            const startDate = format(dateFrom, 'yyyy-MM-dd');
            params = `${params}&startDate=${startDate}`;

            if(dateTo){
                const endDate = format(dateTo, 'yyyy-MM-dd');
                params = `${params}&endDate=${endDate}`;
            }
        }

        params = `${params}&pageSize=${pageSize}`;
        fetchData(`${BASE_URL}/insurances?${params}`);
    };

    const onMultipleDelete = () => {
        if (selected.length > 0) {
            console.log("items =>", selected)
        }
    }

    const closeErrorAlert = () =>{
        setShowErrorAlert(!showErrorAlert)
    }

    const getExportDataUrl = () => {
        setShowErrorAlert(false);
        let params = `noPagination=1&search=${search}`;
        if(dateFrom && dateTo){
            const startDate = format(dateFrom, 'yyyy-MM-dd');
            params = `${params}&startDate=${startDate}`;

            if(dateTo){
                const endDate = format(dateTo, 'yyyy-MM-dd');
                params = `${params}&endDate=${endDate}`;
            }
        }
        let url = `${BASE_URL}/insurances?${params}`;
        if(selected.length > 0){
            url = `${BASE_URL}/insurances/ids?ids=${selected}`;
        }
        return url
    }

    const exportErrorCallBack = (message) => {
        setErrorMessage(message);
        setShowErrorAlert(true);
    }

    const mapJsonToExcelData = (jsonData) => {
        const itemsFormatted = [];
        if (jsonData.length > 0) {
            jsonData.forEach((item) => {
                itemsFormatted.push({
                    "Name": item.name,
                    "Email": item.email,
                    "Phone Number": item.phoneNumber,
                    "Paybill": item.paybill,
                    "Created On": Helpers.formatTime(item.timeCreated)
                });
            });
        }
        return itemsFormatted;
    }

    const mapJsonToPfData = (jsonData) => {
        const headers = [
            "Name", 
            "Email", 
            "Phone Number", 
            "Paybill",
            "Created On"
        ];
        const rows = [];
        if (jsonData.length > 0) {
            jsonData.forEach(item => {
                const itemData = [
                    item.name,
                    item.email,
                    item.phoneNumber,
                    item.paybill,
                    Helpers.formatTime(item.timeCreated)
                ];
                rows.push(itemData);
            });
        }
        return { headers, rows };
    }


    return (
        <Page title="Insurances">
            <Container maxWidth="xl">
                <Box sx={{ pb: 5 }} >
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
                        <Stack spacing={1}>
                            <Typography variant="h4" gutterBottom>
                                Insurances ({totalElements})
                            </Typography>
                        </Stack>
                    </Stack>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                        <Button
                            variant="contained"
                            component={RouterLink}
                            to="/insurances/new"
                            size="large"
                            startIcon={<Icon icon={plusFill} />}
                        >
                            New Insurance
                        </Button>

                        <ExportButton
                            fileName="insurances"
                            dateFrom={dateFrom}
                            dateTo={dateTo}
                            search={search}
                            exportErrorCallBack={exportErrorCallBack}
                            jsonExcelDataMapper={mapJsonToExcelData}
                            jsonPdfDataMapper={mapJsonToPfData}
                            exportDataUrl={getExportDataUrl}
                        />
                    </Stack>

                    <Card>
                        { showErrorAlert ?
                        <Zoom in={showErrorAlert} >
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="center"
                                mt={2}
                                mb={1}
                            >
                                <Alert severity="error" variant="filled" onClose={() => closeErrorAlert()}>
                                <strong>{errorMessage}</strong>
                                </Alert>
                            </Stack>
                        </Zoom> : null
                        }

                        <ListFilterToolbar
                            numSelected={selected.length}
                            selected={selected}
                            search={search}
                            dateFrom={dateFrom}
                            dateTo={dateTo}
                            handleSearchChange={handleSearchChange}
                            handleDateFromChange={handleDateFromChange}
                            handleDateToChange={handleDateToChange}
                            onFilter={onFilter}
                            onClear={onClear}
                            onMultipleDelete={onMultipleDelete}
                            targetLabel="insurances"
                            filterLoading={loading}
                        />

                        <BlockUi tag="div" blocking={blocking}>
                        <Scrollbar>
                            <TableContainer sx={{ minWidth: 800 }}>
                                <Table aria-label="collapsible table">
                                    <ListHead
                                        expandable={expandable}
                                        order={order}
                                        orderBy={orderBy}
                                        headLabel={TABLE_HEAD}
                                        rowCount={data.length}
                                        numSelected={selected.length}
                                        onRequestSort={handleRequestSort}
                                        onSelectAllClick={handleSelectAllClick}
                                    />
                                    <TableBody>

                                        {
                                        data.length > 0 && data
                                            .map((row) => (
                                                <Row key={row.id} expandable={expandable} row={row} onFilter={onFilter} targetLabel="insurances" handleClick={handleClick} isItemSelected={selected.indexOf(row.id) !== -1} />
                                            )
                                        )}
                                        {
                                        data.length === 0 && (
                                            <TableRow>
                                                <TableCell align="center" colSpan={5} sx={{ py: 3 }}>
                                                    <SearchNotFound searchQuery={search} />
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Scrollbar>

                         <TableFooterPagination 
                            pageSize={pageSize}
                            pageNumber={pageNumber}
                            totalElements={totalElements}
                            handleChangePage={handleChangePage}
                            handleChangeRowsPerPage={handleChangeRowsPerPage}
                            totalPages={totalPages}
                        />
                        </BlockUi>
                    </Card>
                </Box>
            </Container>
        </Page>
    );
}

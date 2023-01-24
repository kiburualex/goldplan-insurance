import {
    Stack,
    Typography,
    Pagination,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


export default function TableFooterPagination({ 
    pageSize, 
    pageNumber, 
    totalElements, 
    handleChangePage, 
    handleChangeRowsPerPage,
    totalPages }) {

    return (
        <>
            {/* <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={totalElements}
                rowsPerPage={pageSize}
                page={pageNumber}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            /> */}
            <Grid container spacing={2} direction="row" mb={3} mt={3}>
                <Grid item xs={12} md={3} lg={3}>
                    <Typography sx={{textAlign: "center", color: "#637381"}}> Page {pageNumber} of {totalPages}</Typography>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <Stack direction="row" alignItems="center" justifyContent="center">
                        <InputLabel id="demo-simple-select-standard-label">Rows per pages:</InputLabel>
                        <FormControl variant="standard" sx={{ minWidth: 80, marginLeft: 2 }}>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={pageSize}
                                onChange={handleChangeRowsPerPage}
                                label="Rows per page:"
                                >
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={25}>25</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                                <MenuItem value={100}>100</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <Stack direction="row" alignItems="center" justifyContent="center">
                        <Pagination 
                            color="info" 
                            count={totalPages} 
                            page={pageNumber} 
                            onChange={handleChangePage}
                            showFirstButton 
                            showLastButton
                            />
                    </Stack>
                </Grid>
            </Grid>    
        </>
    );
}
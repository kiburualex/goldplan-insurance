import * as React from 'react';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ArchiveIcon from '@mui/icons-material/Archive';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { CircularProgress } from '@mui/material';

import Box from '@mui/material/Box';
import MenuPopover from '../components/MenuPopover';




export default function ExportButton(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const open = Boolean(anchorEl);


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (option) => {
        if(option !== null){
            switch(option){
                case "excel":
                    exportToCSV();
                    break;
                case "pdf":
                    break;
                default:
                    console.log("No option selected");
            }
        }
        setAnchorEl(null);
    };

    const exportToCSV = () => {
        setLoading(true);
        const url = props.exportDataUrl();
        if(url === undefined){
            setLoading(false);
            props.exportErrorCallBack("Adjust your filters accordingly when exporting!");
            return;
        }

        const dt = `${new Date().getFullYear()}-${(parseInt(new Date().getMonth()) + 1)}-${new Date().getDate()}_${new Date().getHours()}_${new Date().getMinutes()}_${new Date().getSeconds()}`;
        const refinedFileName = `${props.fileName}_${dt}`;
        
        fetch(url, {
            method: 'GET',
            headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(res => res.json())
            .then(json => {
                console.log(json)

                const { data } = json;
                
                if(data){
                    const csvData = props.jsonExcelDataMapper(json.data);
                    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                    const fileExtension = '.xlsx';
                    const ws = XLSX.utils.json_to_sheet(csvData);
                    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
                    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                    const data = new Blob([excelBuffer], {type: fileType});
                    FileSaver.saveAs(data, refinedFileName + fileExtension);
                    setLoading(false);
                }else{
                    setLoading(false);
                    props.exportErrorCallBack(json.return_message);

                }
            }).catch(error =>{
                setLoading(false);
                props.exportErrorCallBack(error.message);
            });
        
    }
      

    return (
        <div>
            <Button
                id="demo-customized-button"
                aria-controls="demo-customized-menu"
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="contained"
                color="info"
                size="large"
                onClick={handleClick}
                endIcon={loading ? <CircularProgress color="inherit" size={16} /> : <KeyboardArrowDownIcon />}
                disabled={loading}
            >
                { loading ? "Exporting" : "Export"}
            </Button>
            
            <MenuPopover
                anchorEl={anchorEl}
                open={open}
                onClose={()=>handleClose(null)}
                sx={{ width: 150 }}
            >
                <MenuItem onClick={()=>handleClose("excel")} sx={{ typography: 'body2', py: 1, px: 2.5, margin: 1, borderRadius: '5px'  }}
                >
                    <Box component={ArchiveIcon} sx={{
                            mr: 2,
                            width: 24,
                            height: 24
                        }}
                    />
                    EXCEL
                </MenuItem>
            </MenuPopover>
        </div>
    );
}
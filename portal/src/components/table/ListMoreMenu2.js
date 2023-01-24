import { Icon } from '@iconify/react';
import { useRef, useState } from 'react'; 
import { toast } from 'react-toastify';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-fill';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import { MenuItem, IconButton, CircularProgress, Box } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Api from '../../common/Api';
import {BASE_URL} from '../../common/Props';
import MenuOptionsPopover from './MenuOptionsPopover';


// ----------------------------------------------------------------------

export default function ListMoreMenu(props) {
    const ref = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const updateLink = `/${props.targetLabel}/${props.id}`;
    const deleteLink = `/${props.targetLabel}/${props.id}`;
    const updateAppLink = props.module ? `/${props.module}/${props.targetLabel}/${props.id}` : updateLink;
    const label = props.label ? props.label : "item";
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const allowDelete = props.delete !=null ? props.delete : true;
    const allowEdit = props.edit != null ? props.edit : true;


    const openModal = () => {
        setOpenDeleteModal(true);
        setIsOpen(false);
    };

    const deleteAndCloseModal = () => {
        setLoading(true);
        const url = `${BASE_URL}${deleteLink}`;
        Api.delete(url).then((response) =>{
            const json = response.data;
            const { message } = json;
            if (message) {
                props.onFilter();
                setOpenDeleteModal(false);
                setIsOpen(false);
                setLoading(false);
                toast.success(message);
            }else{
                alert(json.return_message);
            }
            
        }).catch((error) =>{            
            setOpenDeleteModal(false);
            setIsOpen(false);
            setLoading(false);
            alert(error);
        });
        
    };

    const closeModal = () => {
        setOpenDeleteModal(false);
        setIsOpen(false);
        setLoading(false);
    };

    const handleClose = () =>{
        setIsOpen(false)
    }

  return (
    <>
        <IconButton ref={ref} onClick={() => setIsOpen(true)}>
            <Icon icon={moreVerticalFill} width={20} height={20} />
        </IconButton>

        <MenuOptionsPopover
            open={isOpen}
            onClose={() => setIsOpen(false)}
            anchorEl={ref.current}
            sx={{ width: 150 }}
        >
           {
                allowEdit && (
                    <MenuItem component={RouterLink} to={updateAppLink}  onClick={handleClose} sx={{ typography: 'body2', py: 1, px: 2.5, margin: 1, borderRadius: '5px'  }}
                    >
                        <Box component={Icon} icon={editFill} sx={{
                                mr: 2,
                                width: 24,
                                height: 24
                            }}
                        />
        
                        Edit
                    </MenuItem>
                )
            }

            {
                allowDelete && (
                    <MenuItem to='#'  onClick={openModal} sx={{ typography: 'body2', py: 1, px: 2.5, margin: 1, borderRadius: '5px', color: 'rgb(255, 72, 66)' }}
                    >
                        <Box component={Icon} icon={trash2Outline} sx={{
                                mr: 2,
                                width: 24,
                                height: 24
                            }}
                        />
        
                        Delete
                    </MenuItem>
                )
            }
        </MenuOptionsPopover>

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
            <DialogActions sx={{justifyContent: 'space-around', mb: 2}}>
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
    </>
  );
}

import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText, CircularProgress } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Api from '../../common/Api';
import {BASE_URL} from '../../common/Props';


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
                toast.success(message)
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

  return (
    <>
        <IconButton ref={ref} onClick={() => setIsOpen(true)}>
            <Icon icon={moreVerticalFill} width={20} height={20} />
        </IconButton>

        <Menu
            open={isOpen}
            anchorEl={ref.current}
            onClose={() => setIsOpen(false)}
            PaperProps={{
            sx: { width: 200, maxWidth: '100%' }
            }}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            {
                allowEdit && (
                    <MenuItem component={RouterLink} to={updateAppLink} sx={{ color: 'text.secondary' }}>
                        <ListItemIcon>
                            <Icon icon={editFill} width={24} height={24} />
                        </ListItemIcon>
                        <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
                    </MenuItem>
                )
            }
            

            {
                allowDelete && (
                    <MenuItem sx={{ color: 'text.secondary' }} to='#' onClick={openModal}>
                        <ListItemIcon>
                            <Icon icon={trash2Outline} width={24} height={24} />
                        </ListItemIcon>
                        <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
                    </MenuItem>
                )
            }
            
        </Menu>

        <Dialog
            open={openDeleteModal}
            onClose={closeModal}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title"> 
                Confirm Delete?
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {`Do you want to permanently delete ${label}?`}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{justifyContent: 'space-around'}}>
                <Button onClick={closeModal} color="info">Disagree</Button>
                <Button 
                    onClick={deleteAndCloseModal} 
                    color="error" autoFocus
                    disabled={loading}
                    endIcon={loading && <CircularProgress color="inherit" size={16} />}
                    > 
                    { loading ? "Deleting..." : "Agree"} 
                </Button>
            </DialogActions>
        </Dialog>
    </>
  );
}

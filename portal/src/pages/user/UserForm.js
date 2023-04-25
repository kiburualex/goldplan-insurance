import { sentenceCase } from 'change-case';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import BlockUi from 'react-block-ui';

import { toast } from 'react-toastify';

// material
import {
    Container,
    Alert,
    Box,
    Switch,
    Card,
    CardContent,
    CardActions,
    Grid,
    Stack,
    Button,
    Typography,
    Breadcrumbs,
    Link,
    CircularProgress,
    Zoom
} from '@mui/material';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Label from '../../components/Label';
import Page from '../../components/Page';
import Api from '../../common/Api';
import {BASE_URL} from '../../common/Props';

export default function UserForm() {
    const [isUpdateView, setIsUpdateView] = useState(false);
    const [blocking, setBlocking] = useState(false);
    const desc = !isUpdateView ? "New User" : "Update User";
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [passwordPlaceHolder, setPasswordPlaceHolder] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [image, setImage] = useState({ preview: "", raw: "" });
    const [previousImage, setPreviousImage] = useState({ preview: "", raw: "" });
    const [disableRevertUploadBtn, setDisableRevertUploadBtn] = useState(true);
    const [disableClearUploadBtn, setDisableClearUploadBtn] = useState(true);
    const [checked, setChecked] = useState(true);
    const [errors, setErrors] = useState({
        name: {
            status: '',
            message: ''
        },
        email: {
            status: '',
            message: ''
        },
        phoneNumber: {
            status: '',
            message: ''
        },
        password: {
            status: '',
            message: ''
        },
        confirmPassword: {
            status: '',
            message: ''
        },
        status: {
            status: '',
            message: ''
        }
    });
    const [loading, setLoading] = useState(false);
    const [showGlobalErrorAlert, setShowGlobalErrorAlert] = useState(false);
    const [globalErrorMessage, setGlobalErrorMessage] = useState("");
    const navigate = useNavigate();    
    const { id } = useParams();

    useEffect(() => {

        const fetchData = async () => {
            const url = `${BASE_URL}/users/${id}`;
            await Api.get(url).then((response) =>{
                const json = response.data;
                const { data } = json;
                if(data){
                    setName(data.name);
                    setEmail(data.email);
                    setPhoneNumber(data.phoneNumber);
                    setPasswordPlaceHolder(data.password);
                    if(data.avatarContent){
                        decodeArrayBuffer(data.avatarContent);
                    }
                    setChecked(data.status === "1");
                    image.preview = data.avatarContent ? `data:${data.avatarContentType};base64, ${data.avatarContent}` : '';
                    setImage(image);
                    setDisableClearUploadBtn(data.avatarContent === null);
                    errors.name.status =  "valid";
                    errors.email.status =  "valid";
                    errors.phoneNumber.status =  "valid";
                    errors.password.status =  "valid";
                    errors.confirmPassword.status =  "valid";
                    errors.status.status =  "valid";
                    setErrors(errors);
                }else{
                    setShowGlobalErrorAlert(true);
                    setGlobalErrorMessage(json.message);
                }             
            })
            .catch((err) =>{
                const resp = Api.getErrorMessage(err);
                if(resp === "token_expired"){
                    localStorage.removeItem("token");
                    navigate("/login")
                }else{
                    setGlobalErrorMessage(resp);
                    setShowGlobalErrorAlert(true);
                }
            })
        };

        setBlocking(true);
        if(id){
            setIsUpdateView(true);
            fetchData();
        }

        setBlocking(false);
        
    }, []);

    const decodeArrayBuffer = (buffer) =>{
        let mime;
        const a = new Uint8Array(buffer);
        const nb = a.length;
        if (nb < 4)
            return null;
        const b0 = a[0];
        const b1 = a[1];
        const b2 = a[2];
        const b3 = a[3];
        if (b0 === 0x89 && b1 === 0x50 && b2 === 0x4E && b3 === 0x47)
            mime = 'image/png';
        else if (b0 === 0xff && b1 === 0xd8)
            mime = 'image/jpeg';
        else if (b0 === 0x47 && b1 === 0x49 && b2 === 0x46)
            mime = 'image/gif';
        else
            return null;
        let binary = "";
        for (let i = 0; i < nb; i++)
            binary += String.fromCharCode(a[i]);
        const base64 = window.btoa(binary);
        const image = new Image();
        const srcData = `data:${mime};base64,${base64}`;
        console.log("converted src ", srcData);
        image.src = srcData;
        return image;
    }

    const handleChange = (event, name) => {
        const value = name.toLowerCase() === "status" ? event.target.checked : event.target.value;
        switch (name.toLowerCase()) {
            case "name": {
                setName(value);
                errors.name.status = (value !== "") ? "valid" : "invalid";
                errors.name.message = (value !== "") ? "" : "Please enter your name";
                break;
            }
            case "email": {
                setEmail(value)
                const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                const isValid = emailRex.test(value);
                if (isValid) {
                    errors.email.status = "valid";
                    errors.email.message = "valid";
                } else {
                    errors.email.status = "invalid";
                    errors.email.message = "Please enter a valid email";
                }
                
                break;
            }
            case "phonenumber": {
                const stringRegex = /\D/;
                if(stringRegex.test(value)){
                    errors.phoneNumber.status = "invalid";
                    errors.phoneNumber.message = "Please enter numbers only";
                }else{
                    errors.phoneNumber.status = (value.replace(/\D/, '') !== "") ? "valid" : "invalid";
                    errors.phoneNumber.message = (value.replace(/\D/, '') !== "") ? "valid" : "Please enter your phone number";
                }
                setPhoneNumber(value.replace(/\D/, ''))
                break;
            }
            case "password": {
                setPassword(value)
                errors.password.status = (value !== "") ? "valid" : "invalid";
                errors.password.message = (value !== "") ? "valid" : "Please enter your password";
                break;
            }
            case "confirmpassword": {
                setConfirmPassword(value)
                errors.confirmPassword.status = (value !== "valid") ? "valid" : "invalid";
                errors.confirmPassword.message = (value !== "") ? "" : "Please enter your confirmation password";
                break;
            }
            case "status":
                setChecked(value)
                break;
            default:
                break;
        }
        setErrors(errors);
        setShowGlobalErrorAlert(false);
    };

    const handleFileChange = e => {
        if (e.target.files.length) {
            if(image.preview === ""){
                setDisableRevertUploadBtn(true);
            }else{
                setPreviousImage({
                    preview: image.preview,
                    raw: image.raw
                })
                setDisableRevertUploadBtn(false);
            }
            setImage({
                preview: URL.createObjectURL(e.target.files[0]),
                raw: e.target.files[0]
            });
            setDisableClearUploadBtn(false);
        }
    };

    const revertChanges = () =>{
        setImage({ preview: previousImage.preview, raw: previousImage.raw });
        setPreviousImage({ preview: "", raw: "" });
        setDisableRevertUploadBtn(true);
    }

    const clearUpload = () =>{
        setImage({ preview: "", raw: "" });
        setDisableClearUploadBtn(true);
    }

    const formIsValid = () => {
        let isValid = true;
        if(errors.name.status === 'invalid' || errors.name.status === ''){
            errors.name.status = "invalid";
            errors.name.message = "Please enter your name";
            isValid = false;
        }

        if(errors.email.status === 'invalid' || errors.email.status === ''){
            errors.email.status = "invalid";
            errors.email.message = "Please enter a valid email";
            isValid = false;
        }

        if(errors.phoneNumber.status === 'invalid' || errors.phoneNumber.status === ''){
            errors.phoneNumber.status = "invalid";
            errors.phoneNumber.message = "Please enter a valid phone number (numbers only)";
            isValid = false;
        }

        if(errors.password.status === 'invalid' || errors.password.status === ''){
            errors.password.status = "invalid";
            errors.password.message = "Please select your password";
            isValid = false;
        }

        if(errors.confirmPassword.status === 'invalid' || errors.confirmPassword.status === ''){
            errors.confirmPassword.status = "invalid";
            errors.confirmPassword.message = "Please select your confirmation password";
            isValid = false;
        }
        
        if(!isValid){
            setErrors(errors);
            setGlobalErrorMessage("Empty fields detected. Kindly fill all required fields");
            setShowGlobalErrorAlert(true);
        }

        return isValid;
    }
    
    const onSubmit = (event) => {
        event.preventDefault();
        if(!formIsValid()){
            return;
        }

        const formData = new FormData();
        if(image !== null){
            if(image.raw !== ''){
                formData.append("image", image.raw);
            }
            if(image.preview !== ''){
                formData.append("preview", image.preview);
            }
        }
        
        formData.append("name", name);
        formData.append("phoneNumber", phoneNumber);
        formData.append("email", email);
        formData.append("status", checked ? "1" : "0");
        if(isUpdateView){
            if(password === ''){
                formData.append("password", passwordPlaceHolder);
            }else{
                formData.append("password", password);
            }
        }else{
            formData.append("password", password);
        }

        setShowGlobalErrorAlert(false);
        setGlobalErrorMessage("");
        setLoading(true);
        let url = `${BASE_URL}/users/`;
        let method = 'POST';
        if(isUpdateView){
            const userId = id; // get from router
            url = `${BASE_URL}/users/${userId}`;
            method = 'PUT';
        }

        Api.request(method, url, formData, true)
            .then((response) =>{
                const { data } = response;
                if(data){
                    navigate('/users');
                    toast.success(data.message);
                }else{
                    setShowGlobalErrorAlert(true);
                    setGlobalErrorMessage(data.message !== null ? data.message : "Validation Error");
                }
                setLoading(false);
            }).catch((error)=>{
                const resp = Api.getErrorMessage(error);
                if(resp === "token_expired"){
                    localStorage.removeItem("token");
                    navigate("/login")
                }else{
                    setLoading(false);
                    setGlobalErrorMessage(resp);
                    setShowGlobalErrorAlert(true);
                }
            });
    }

    return (
        <Page title="User Form">
            <Container maxWidth="xl">
                <Box sx={{ pb: 5 }} >
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                        <Stack spacing={1}>
                            <Typography variant="h4" gutterBottom>
                                {desc}
                            </Typography>
                            <Breadcrumbs
                                aria-label="breadcrumb"
                                separator={
                                    <span
                                        style={{
                                            width: '4px',
                                            height: '4px',
                                            borderRadius: '50%',
                                            backgroundColor: 'rgb(145, 158, 171)'
                                        }}
                                    />
                                }
                            >
                                <Link underline="hover" color="inherit" href="/users/list">
                                    User
                                </Link>
                                <Typography color="text.primary">{desc}</Typography>
                            </Breadcrumbs>
                        </Stack>
                    </Stack>

                    <BlockUi tag="div" blocking={blocking}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4} sx={{ boxSizing: 'border-box', margin: 0 }}>
                            <Card>
                                <CardContent>
                                    <Stack direction="row" mb={2}  justifyContent="space-between">
                                        <Typography gutterBottom variant="h5" component="div">
                                            Profile
                                        </Typography>
                                        <Label variant="ghost" color={checked ? 'success' : 'error'}>
                                            {sentenceCase(checked ? 'ACTIVE' : 'INACTIVE')}
                                        </Label>
                                    </Stack>
                                    <Stack direction="row" mb={2} spacing={16} justifyContent="center" alignItems="center">
                                        <div>
                                            <label htmlFor="upload-button">
                                                <div style={{ borderRadius: '50%', overflow: 'hidden', width: '170px', height: '170px', border: '1px dashed rgb(217, 214, 214)', display: 'flex', justifyContent: 'center' }}>
                                                    {image.preview ? (
                                                        <img src={image.preview} style={{ borderRadius: '50%', overflow: 'hidden', width: '150px', height: '150px', margin: 'auto', display: 'block', objectFit: 'cover' }} alt="dummy" />
                                                    ) : (
                                                        <div style={{ borderRadius: '50%', overflow: 'hidden', width: '150px', height: '150px', margin: 'auto', backgroundColor: 'rgb(242, 242, 242)', textAlign: 'center', display: 'inline-block' }} alt="dummy" >
                                                            <CameraAltIcon sx={{position: 'relative', top: 'calc(50% - 15px)'}} fontSize="large" />
                                                        </div>
                                                    )}
                                                </div>
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                id="upload-button"
                                                style={{ display: "none" }}
                                                onChange={handleFileChange}
                                            />
                                            <br />
                                            <Button onClick={revertChanges} variant="contained" disabled={disableRevertUploadBtn} component="span">Revert</Button>
                                            <Button onClick={clearUpload} variant="contained" disabled={disableClearUploadBtn} color="inherit" sx={{ml: 2}} component="span">clear</Button>
                                        </div>
                                    </Stack>
                                    <Typography variant="body2" mt={2} color="text.secondary">
                                        User should be active to login. Inactive users cannot login.
                                    </Typography>
                                    <FormControlLabel
                                        control={
                                            <Switch checked={checked}
                                                onChange={(event) => handleChange(event, "status")}
                                            />
                                        }
                                        label={<Typography style={{ color: checked ? "#00AB55" : "#637381", fontSize: '0.87rem', fontFamily: 'Public Sans,sans-serif', fontWeight: '400' }}>{checked ? "Active Status" : "Inactive Status"}</Typography>}
                                    />

                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={8} sx={{ boxSizing: 'border-box', margin: 0 }}>
                            <Card>
                                <CardContent>
                                {showGlobalErrorAlert ? (
                                    <Zoom in={showGlobalErrorAlert} >
                                        <Stack 
                                        direction="row" 
                                        alignItems="center" 
                                        justifyContent="center" 
                                        mt={2} 
                                        mb={1}
                                        >
                                        <Alert severity="error" variant="filled" onClose={() => setShowGlobalErrorAlert(!showGlobalErrorAlert)}>
                                            <strong>{globalErrorMessage}</strong>
                                        </Alert>
                                        </Stack>
                                    </Zoom>
                                    ): null}
                                    <Typography gutterBottom variant="h5" component="div">
                                        Details
                                    </Typography>

                                    <Grid container spacing={6}>
                                        <Grid item xs={12} md={6} mt={2}>
                                            <TextField
                                                label="Full Name"
                                                fullWidth
                                                id="outlined-size-normal"
                                                value={name}
                                                onChange={(event) => handleChange(event, "name")}
                                                helperText={(errors.name.status === "invalid") && errors.name.message}
                                                error={errors.name.status === "invalid"}
                                                variant="standard"
                                            />
                                        </Grid>
                                        
                                    </Grid>

                                    <Grid container spacing={6}>
                                        <Grid item xs={12} md={6} mt={2}>
                                            <TextField
                                                label="Phone Number"
                                                fullWidth
                                                type="text"
                                                id="outlined-size-normal"
                                                value={phoneNumber}
                                                onChange={(event) => handleChange(event, "phonenumber")}
                                                helperText={(errors.phoneNumber.status === "invalid") && errors.phoneNumber.message}
                                                error={errors.phoneNumber.status === "invalid"}
                                                variant="standard"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6} mt={2}>
                                            <TextField
                                                label="Email"
                                                type="email"
                                                fullWidth
                                                id="outlined-size-normal"
                                                value={email}
                                                onChange={(event) => handleChange(event, "email")}
                                                helperText={(errors.email.status === "invalid") && errors.email.message}
                                                error={errors.email.status === "invalid"}
                                                variant="standard"
                                            />
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={6}>
                                        <Grid item xs={12} md={6} mt={2}>
                                            <TextField
                                                label="Password"
                                                fullWidth
                                                type="password"
                                                autoComplete="current-password"
                                                id="outlined-size-normal"
                                                value={password}
                                                onChange={(event) => handleChange(event, "password")}
                                                helperText={(errors.password.status === "invalid") && errors.password.message}
                                                error={errors.password.status === "invalid"}
                                                variant="standard"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6} mt={2}>
                                            <TextField
                                                label="Confirm Password"
                                                fullWidth
                                                type="password"
                                                autoComplete="current-password"
                                                id="outlined-size-normal"
                                                value={confirmPassword}
                                                onChange={(event) => handleChange(event, "confirmpassword")}
                                                helperText={(errors.confirmPassword.status === "invalid") && errors.confirmPassword.message}
                                                error={errors.confirmPassword.status === "invalid"}
                                                variant="standard"
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                                <CardActions sx={{ alignItems: "center" }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6} my={2} sx={{ textAlign: "center" }}>
                                            <Button
                                                variant="contained"
                                                component={RouterLink}
                                                to="/users/list"
                                                size="large"
                                                color="error"
                                            >
                                                Cancel
                                            </Button>
                                        </Grid>
                                        <Grid item xs={12} md={6} my={2} sx={{ textAlign: "center" }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="large"
                                                disabled={loading}
                                                onClick={onSubmit}
                                                endIcon={loading && <CircularProgress color="inherit" size={16} />}
                                            >
                                                { loading ? "Processing" : "Save Changes"} 
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </CardActions>
                            </Card>
                        </Grid>
                    </Grid>
                    </BlockUi>
                </Box>
            </Container>
        </Page>
    );
}

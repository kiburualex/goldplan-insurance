import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import BlockUi from 'react-block-ui';

import { toast } from 'react-toastify';

// material
import {
    Container,
    Alert,
    Box,
    Card,
    CardContent,
    CardActions,
    Grid,
    Stack,
    Button,
    Typography,
    Breadcrumbs,
    CircularProgress,
    Zoom
} from '@mui/material';
import TextField from '@mui/material/TextField';
import Page from '../../components/Page';
import Api from '../../common/Api';
import {BASE_URL} from '../../common/Props';



export default function InsuranceForm() {
    const [isUpdateView, setIsUpdateView] = useState(false);
    const [blocking, setBlocking] = useState(false);
    const desc = !isUpdateView ? "New Insurance" : "Update Insurance";
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [paybill, setPaybill] = useState("");
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
        paybill: {
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
            const url = `${BASE_URL}/insurances/${id}`;
            await Api.get(url).then((response) =>{
                const json = response.data;
                const { data } = json;
                if(data){
                    setName(data.name);
                    setEmail(data.email);
                    setPhoneNumber(data.phoneNumber);
                    setPaybill(data.paybill);

                    errors.name.status =  "valid";
                    errors.email.status =  "valid";
                    errors.phoneNumber.status =  "valid";
                    errors.paybill.status =  "valid";

                    setErrors(errors);
                }else{
                    setShowGlobalErrorAlert(true);
                    setGlobalErrorMessage(json.return_message);
                }               
            })
            .catch((error) =>{
                const resp = Api.getErrorMessage(error);
                if(resp === "token_expired"){
                    localStorage.removeItem("token");
                    navigate("/login")
                }else{
                    setGlobalErrorMessage(resp);
                    setShowGlobalErrorAlert(true);
                }

            });
        };

        setBlocking(true);
        if(id){
            setIsUpdateView(true);
            fetchData();
        }
        setBlocking(false);
        
    }, [id]);

    const handleChange = (event, name) => {
        const value = name.toLowerCase() === "status" ? event.target.checked : event.target.value;
        switch (name.toLowerCase()) {
            case "name": {
                setName(value);
                errors.name.status = (value !== "") ? "valid" : "invalid";
                errors.name.message = (value !== "") ? "" : "Please enter a valid name";
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
                const stringRegex = /^(\+254|0)\d{9}$/;
                // if(value.trim().match(stringRegex)){
                if(stringRegex.test(value.trim())){
                    errors.phoneNumber.status = "valid";
                    errors.phoneNumber.message = "Please enter numbers only";
                }else{
                    errors.phoneNumber.status =  "invalid";
                    errors.phoneNumber.message = "Please enter a valid phone number (0xx | +254xx)";
                    if((value.startsWith("+254") && value.length > 13) || (value.startsWith("0") && value.length > 10)){
                        errors.phoneNumber.message = "Invalid phone Number length";
                    }
                }
                setPhoneNumber(value);
                break;
            }
            case "paybill": {
                setPaybill(value)
                errors.paybill.status = (value !== "valid") ? "valid" : "invalid";
                errors.paybill.message = (value !== "") ? "" : "Please enter a valid paybill";
                break;
            }
            default:
                break;
        }
        setErrors(errors);
        setShowGlobalErrorAlert(false);
    };

    const formIsValid = () => {
        let isValid = true;
        if(errors.name.status === 'invalid' || errors.name.status === ''){
            errors.name.status = "invalid";
            errors.name.message = "Please enter a valid name";
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

        if(errors.paybill.status === 'invalid' || errors.paybill.status === ''){
            errors.paybill.status = "invalid";
            errors.paybill.message = "Please enter a valid paybill";
            isValid = false;
        }

        console.log("errors ", errors)
        setErrors(errors);

        return isValid;
    }
    
    const onSubmit = (event) => {
        event.preventDefault();
        if(!formIsValid()){
            console.log("errors")
            setGlobalErrorMessage("Incorrect form details!")
            setShowGlobalErrorAlert(true);
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("phoneNumber", phoneNumber);
        formData.append("paybill", paybill);
        
        const json = Object.fromEntries(formData.entries());

        setShowGlobalErrorAlert(false);
        setGlobalErrorMessage("");
        setLoading(true);
        let url = `${BASE_URL}/insurances`;
        let method = 'POST';
        if(isUpdateView){
            const insuranceId = id; // get from router
            url = `${BASE_URL}/insurances/${insuranceId}`;
            method = 'PUT';
        }

        Api.request(method, url, json, false)
            .then((response) =>{
                const { data } = response;
                console.log("update data ", data)
                if(data){
                    navigate('/insurances');
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
        <Page title="Insurance Form">
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
                                <RouterLink 
                                    underline="hover" 
                                    color="inherit" 
                                    to="/insurances"
                                    style={{
                                        textDecoration: "none",
                                        lineHeight: 1.5,
                                        fontSize: "1rem",
                                        fontFamily: "Public Sans,sans-serif",
                                        fontWeight: 400,
                                        color: "#637381"
                                    }}
                                    >
                                    Insurances
                                </RouterLink>
                                <Typography color="text.primary">{desc}</Typography>
                            </Breadcrumbs>
                        </Stack>
                    </Stack>

                    <BlockUi tag="div" blocking={blocking}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={12} sx={{ boxSizing: 'border-box', margin: 0 }}>
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
                                                label="Name"
                                                fullWidth
                                                id="outlined-size-normal"
                                                value={name}
                                                onChange={(event) => handleChange(event, "name")}
                                                helperText={(errors.name.status === "invalid") && errors.name.message}
                                                error={errors.name.status === "invalid"}
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
                                                label="Phone Number"
                                                fullWidth
                                                id="outlined-size-normal"
                                                value={phoneNumber}
                                                onChange={(event) => handleChange(event, "phoneNumber")}
                                                helperText={(errors.phoneNumber.status === "invalid") && errors.phoneNumber.message}
                                                error={errors.phoneNumber.status === "invalid"}
                                                variant="standard"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6} mt={2}>
                                            <TextField
                                                label="Paybill"
                                                fullWidth
                                                id="outlined-size-normal"
                                                value={paybill}
                                                onChange={(event) => handleChange(event, "paybill")}
                                                helperText={(errors.paybill.status === "invalid") && errors.paybill.message}
                                                error={errors.paybill.status === "invalid"}
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
                                                to="/insurances"
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

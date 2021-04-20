// React-spesifikt
import { Component } from "react";
import { Redirect } from "react-router-dom";

// 3rd-party Packages
import { Button, FormControl, InputLabel, Input, FormControlLabel, Switch } from '@material-ui/core';
import axios from 'axios';
import moment from 'moment';
import IconButton from '@material-ui/core/IconButton';
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import FormData from 'form-data';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { withSnackbar } from 'notistack';

// Studentreisen-assets og komponenter
import CookieService from '../../../global/Services/CookieService';
import Loader from '../../../global/Components/Loader';
import '../CSS/Seminar.css';

class SeminarNew extends Component {
    constructor(props) {
        super(props)

        // Nytt seminar-spesifikke states, delt opp i før-visning autentisering og felt
        let datetimeNow = moment().format('YYYY-MM-DDTHH:mm:ss');
        let dateNow = moment().add(1, 'days').format('YYYY-MM-DD');
        this.state = {  loading : this.props.loading, authenticated : this.props.auth, 
                        SeminarNew_input_title : "", SeminarNew_input_startdate : datetimeNow, SeminarNew_input_enddate : dateNow, SeminarNew_input_address : "", 
                        SeminarNew_input_desc : "", SeminarNew_input_image : "", SeminarNew_input_imageprev : "", SeminarNew_switch_availability : false,
                        submitDisabled : false, submitText : "Opprett seminar", submitOpacity: "1" }
    }

    onInputChange = e => {
        if(e.target.id === "SeminarNew_input_title") {
            this.setState({
                SeminarNew_input_title : e.target.value
            })
        } else if(e.target.id === "SeminarNew_input_startdate") {
            this.setState({
                SeminarNew_input_startdate : e.target.value
            })
        } else if(e.target.id === "SeminarNew_input_enddate") {
            this.setState({
                SeminarNew_input_enddate : e.target.value
            })
        } else if(e.target.id === "SeminarNew_input_address") {
            this.setState({
                SeminarNew_input_address : e.target.value
            })
        } else if(e.target.id === "SeminarNew_input_desc") {
            this.setState({
                SeminarNew_input_desc : e.target.value
            })
        } else if(e.target.id === "SeminarNew_switch_availability") {
            this.setState({
                SeminarNew_switch_availability : !this.state.SeminarNew_switch_availability
            })
        }
    }

    onImageChange = e => {
        if(e.target.files && e.target.files[0]) {
            this.setState({
                SeminarNew_input_image: e.target.files[0].name,
                SeminarNew_input_imageprev: e.target.files[0]
            });
        } else {
            this.setState({
                SeminarNew_input_image: "",
                SeminarNew_input_imageprev: ""
            });
        }
    }
  
    // Utføres når bruker trykker på "Opprett seminar" eller trykker på Enter i ett av input-feltene
    handleSubmit = e => {
        // Stopper siden fra å laste inn på nytt
        e.preventDefault();

        if(this.state.SeminarNew_input_title.length > 0 && this.state.SeminarNew_input_title.length <= 255) {
            if(this.state.SeminarNew_input_address.length > 0 && this.state.SeminarNew_input_address.length <= 255) {
                if(this.state.SeminarNew_input_desc.length > 0 && this.state.SeminarNew_input_desc.length <= 255) {
                    if(this.state.SeminarNew_input_startdate > moment().format('YYYY-MM-DDTHH:mm:ss')) {
                        if(this.state.SeminarNew_input_startdate.length > 0 && this.state.SeminarNew_input_enddate.length > 0 && moment(this.state.SeminarNew_input_startdate).format('YYYY-MM-DD') <= this.state.SeminarNew_input_enddate) {
                            // Slår midlertidig av "Opprett seminar"-knappen og endrer teksten til "Vennligst vent"
                            this.setState({
                                submitDisabled: true,
                                submitText: "Vennligst vent",
                                submitOpacity: "0.6"
                            });
                    
                            const data = new FormData();
                    
                            data.append('title', this.state.SeminarNew_input_title);
                            data.append('startdate', this.state.SeminarNew_input_startdate);
                            data.append('enddate', this.state.SeminarNew_input_enddate);
                            data.append('address', this.state.SeminarNew_input_address);
                            data.append('description', this.state.SeminarNew_input_desc);
                            data.append('availability', this.state.SeminarNew_switch_availability);
                            data.append('token', CookieService.get("authtoken"));
                            data.append('image', this.state.SeminarNew_input_imageprev);
                    
                            // Axios POST request
                            axios
                                // Henter API URL fra .env og utfører en POST request med dataen fra objektet over
                                // Axios serialiserer objektet til JSON selv
                                .post(process.env.REACT_APP_APIURL + "/seminar/submitSeminar", data)
                                // Utføres ved mottatt resultat
                                .then(res => {
                                    if(res.data.success) {
                                        // Mottok OK fra server
                                        this.setState({
                                            authenticated: true
                                        });

                                        let goto;

                                        if(this.state.SeminarNew_switch_availability) {
                                            goto = "/Seminar/Seminarkommende=" + res.data.seminarid;
                                        } else {
                                            goto = "/Seminar/";
                                        }
                    
                                        window.location.href=goto;
                                    } else {
                                        // Feil oppstod ved oppretting
                                        this.props.enqueueSnackbar("Kunne ikke opprette seminar, vennligst forsøk igjen", { 
                                            variant: 'error',
                                            autoHideDuration: 5000,
                                        });
                                        this.setState({
                                            submitDisabled: false,
                                            submitText: "Opprett seminar",
                                            submitOpacity: "1"
                                        });
                                    }
                                })
                                .catch(err => {
                                    // En feil oppstod ved oppkobling til server
                                    this.props.enqueueSnackbar("En intern feil oppstod, vennligst forsøk igjen senere", { 
                                        variant: 'error',
                                        autoHideDuration: 5000,
                                    });
                                    this.setState({
                                        submitDisabled: false,
                                        submitText: "Opprett seminar",
                                        submitOpacity: "1"
                                    });
                                })
                                // Utføres alltid uavhengig av andre resultater
                                .finally(() => {
                                    // Gjør Opprett seminar knappen tilgjengelig igjen om seminaret ikke er opprettet over
                                    if(!this.state.authenticated) {
                                        this.setState({
                                            submitDisabled: false,
                                            submitText: "Opprett seminar",
                                            submitOpacity: "1"
                                        });
                                    }
                                });
                        } else {
                            // Startdato/Sluttdato ikke fylt inn eller sluttdato er før startdato
                            this.props.enqueueSnackbar("Sluttdatoen må være samme dag som startdato eller lengre", { 
                                variant: 'error',
                                autoHideDuration: 5000,
                            });
                        }
                    } else {
                        // Startdato er bakover i tid
                        this.props.enqueueSnackbar("Startdatoen kan ikke være i fortiden", { 
                            variant: 'error',
                            autoHideDuration: 5000,
                        });
                    }
                } else {
                    // Beskrivelsen er ikke fylt inn eller for lang
                    this.props.enqueueSnackbar("Beskrivelsen er ikke fylt inn eller for lang", { 
                        variant: 'error',
                        autoHideDuration: 5000,
                    });
                }
            } else {
                // Adressen er ikke fylt inn eller for lang
                this.props.enqueueSnackbar("Adressen er ikke fylt inn eller for lang", { 
                    variant: 'error',
                    autoHideDuration: 5000,
                });
            }
        } else {
            // Tittelen er ikke fylt inn eller for lang
            this.props.enqueueSnackbar("Tittelen er ikke fylt inn eller for lang", { 
                variant: 'error',
                autoHideDuration: 5000,
            });
        }
    };

    render() {
        // Om vi er i loading fasen (Før mottatt data fra API) vises det et Loading ikon
        if(this.props.loading) {
            return(
                <section id="loading">
                    <Loader />
                </section>
            );
        }
        
        if(!this.props.loading && this.props.auth) {
            // Når loading fasen er komplett og bruker er innlogget, vis innholdet på nytt seminar-siden
            return (
                <>
                <main id="SeminarNew_main">
                    <Button id="SeminarNew_button_back" onClick={() => window.history.back()}>{"< Tilbake"}</Button>
                    <h1>Nytt seminar</h1>
                    <form id="SeminarNew_form" onSubmit={this.handleSubmit}>
                        <FormControl id="SeminarNew_formcontrol">
                            <InputLabel>Tittel</InputLabel>
                            <Input id="SeminarNew_input_title" required={true} value={this.state.SeminarNew_input_title} onKeyUp={this.onSubmit} onChange={this.onInputChange} autoFocus={true} />
                        </FormControl>
                        <FormControl id="SeminarNew_formcontrol">
                            <InputLabel>Startdato</InputLabel>
                            <Input id="SeminarNew_input_startdate" type="datetime-local" required={true} value={this.state.SeminarNew_input_startdate} onKeyUp={this.onSubmit} onChange={this.onInputChange} />
                        </FormControl>
                        <FormControl id="SeminarNew_formcontrol">
                            <InputLabel>Sluttdato</InputLabel>
                            <Input id="SeminarNew_input_enddate" type="date" required={true} value={this.state.SeminarNew_input_enddate} onKeyUp={this.onSubmit} onChange={this.onInputChange} />
                        </FormControl>
                        <FormControl id="SeminarNew_formcontrol">
                            <InputLabel>Adresse</InputLabel>
                            <Input id="SeminarNew_input_address" required={true} value={this.state.SeminarNew_input_address} onKeyUp={this.onSubmit} onChange={this.onInputChange} autoComplete="street-address" />
                        </FormControl>
                        <FormControl id="SeminarNew_formcontrol">
                            <InputLabel>Beskrivelse</InputLabel>
                            <Input id="SeminarNew_input_desc" required={true} value={this.state.SeminarNew_input_desc} onKeyUp={this.onSubmit} onChange={this.onInputChange} variant="filled" multiline rowsMax="10" />
                        </FormControl>
                        <FormControlLabel id="SeminarNew_formcontrol" control={
                                <Switch id="SeminarNew_switch_availability" checked={this.state.SeminarNew_switch_availability} onChange={this.onInputChange} />
                            } label="Åpent for alle"
                        />
                        {this.state.SeminarNew_input_imageprev !== "" &&
                            <>
                            <img id="SeminarNew_input_imageprev" src={URL.createObjectURL(this.state.SeminarNew_input_imageprev)}/>
                            <IconButton id="SeminarNew_iconbutton_remove" onClick={this.onImageChange} color="primary" component="span">
                                <HighlightOffIcon />{"Slett bildet"}
                            </IconButton>
                            </>
                        }
                        {this.state.SeminarNew_input_imageprev == "" &&
                            <>
                            <p id="SeminarNew_p_noimage"><i>Ikke noe bilde valgt</i></p>
                            <input
                                accept="image/png, image/jpeg"
                                id="SeminarNew_input_image"
                                onChange={this.onImageChange}
                                type="file"
                                value={this.state.SeminarNew_input_image}
                                hidden
                            />
                            <label htmlFor="SeminarNew_input_image">
                                <IconButton id="SeminarNew_iconbutton_select" color="primary" component="span">
                                    <ImageOutlinedIcon />{"Velg et bilde"}
                                </IconButton>
                            </label>
                            </>
                        }
                        <Button type="submit" disabled={this.state.submitDisabled} style={{opacity: this.state.submitOpacity}} variant="contained">{this.state.submitText}</Button>
                    </form>
                </main>
                </>
            );
        } else {
            return (
                // Bruker er ikke innlogget, går til forsiden
                <Redirect to={{pathname: "/"}} />
            );
        }
    }
}

export default withSnackbar(SeminarNew);

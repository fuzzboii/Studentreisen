// React-spesifikt
import { Component } from "react";
import { Redirect } from "react-router-dom";

// 3rd-party Packages
import { Button, FormControl, InputLabel, Input } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import axios from 'axios';
import { withSnackbar } from 'notistack';

// Studentreisen-assets og komponenter
import Loader from '../../../global/Components/Loader';
import NoAccess from '../../../global/Components/NoAccess';
import AuthService from '../../../global/Services/AuthService';
import '../CSS/Reset.css';
import usnlogo from '../../../assets/usn.png';

class Reset extends Component {
    constructor(props) {
        super(props)
        // Reset-spesifikke states, delt opp i før-visning verifisering, reset, token og alert
        this.state = {loading : true, verified : false, 
                    password : "", password2 : "", resetDisabled : false, resetText : "Oppdater passord", resetOpacity: "1",
                    token : window.location.pathname.substring(7), redirectLogin : false}
    };

    // Utføres når bruker gjør en handling i input-feltet for Passord
    onPasswordChange = e => {
        this.setState({
            password: e.target.value
        });
    };

    // Utføres når bruker gjør en handling i input-feltet for Bekreft Passord
    onPassword2Change = e => {
        this.setState({
            password2: e.target.value
        });
    };
  
    // Utføres når bruker trykker på "Oppdater passord" eller trykker på Enter i ett av input-feltene
    handleReset = e => {
        // Stopper siden fra å laste inn på nytt
        e.preventDefault();

        // Slår midlertidig av "Oppdater passord"-knappen og endrer teksten til "Vennligst vent"
        this.setState({
            resetDisabled: true,
            resetText: "Vennligst vent",
            resetOpacity: "0.6"
        });

        if(this.state.password === this.state.password2) {
            // Definerer objektet med dataen vi sender til server
            const data = {
                password: this.state.password,
                password2: this.state.password2,
                token: this.state.token
            };

            let pwByttet = false;
        
            // Axios POST request
            axios
                // Henter API URL fra .env og utfører en POST request med dataen fra objektet over
                // Axios serialiserer objektet til JSON selv
                .post(process.env.REACT_APP_APIURL + "/resetPassword", data)
                // Utføres ved mottatt resultat
                .then(res => {
                    if(res.data.status == "success") {
                        pwByttet = true;
                        // Passordet har blitt oppdatert, sender til login
                        this.props.enqueueSnackbar("Passordet har blitt oppdatert, du blir sendt til side for innlogging om få sekunder", { 
                            variant: 'success',
                            autoHideDuration: 5000,
                        });

                        setTimeout(() => {
                            this.setState({
                                redirectLogin: true
                            })
                        }, 5000);
                    } else {
                        // Feil oppstod ved endring av passord
                        this.props.enqueueSnackbar(res.data.message, { 
                            variant: 'error',
                            autoHideDuration: 5000,
                        });
                    }
                }).catch(err => {
                    // En feil oppstod ved oppkobling til server
                    this.props.enqueueSnackbar("En intern feil oppstod, vennligst forsøk igjen senere", { 
                        variant: 'error',
                        autoHideDuration: 5000,
                    });
                // Utføres alltid uavhengig av andre resultater
                }).finally( () => {
                    if(!pwByttet) {
                        // Gjør Oppdater passord knappen tilgjengelig igjen om passordet ikke ble akseptert eller lignende feil oppstod
                        this.setState({
                            resetDisabled: false,
                            resetText: "Oppdater passord",
                            resetOpacity: "1",
                        });
                    }
                });
        } else {
            this.props.enqueueSnackbar("Passordene er ikke like", { 
                variant: 'error',
                autoHideDuration: 5000,
            });
            this.setState({
                resetDisabled: false,
                resetText: "Oppdater passord",
                resetOpacity: "1"
            });
        }
    };

    // Utføres når alle komponentene er lastet inn og er det siste steget i mounting-fasen
    componentDidMount() {
        if(this.state.token !== undefined) {
            if (/^[0-9a-fA-F]+$/.test(this.state.token) && this.state.token.length == 40) {
                // Sjekk om token eksisterer i databasen
                // Om token eksisterer sjekker vi mot serveren om brukeren har en gyldig token
                AuthService.isTokenVerified(this.state.token).then(res => {
                    this.setState({
                        loading: false,
                        verified : res
                    });
                });
            } else {
                // Token ugyldig
                this.setState({
                    loading: false,
                    verified: false
                });
            }
        }
    };

    render() {
        const {loading, verified} = this.state;

        if(loading) {
            // Om vi er i loading fasen (Før mottatt data fra API) vises det et Loading ikon
            return(
                <section id="loading">
                    <Loader />
                </section>
            );
        }
        
        if(this.state.redirectLogin) {
            return <Redirect to={{pathname: "/Login"}} />;
        }
        
        if(!loading && verified) {
            // Når loading fasen er komplett og token har blitt verifisert, vis side for resetting av passord
            return (
                <main id="main_reset">
                    <section id="section_logo_reset">
                        <img src={usnlogo} alt="USN logo" />
                    </section>
                    <form id="form_reset" onSubmit={this.handleReset}>
                        <FormControl id="form_email_reset">
                            <InputLabel>Passord</InputLabel>
                            <Input className="form_input_reset" required={true} value={this.state.password} onKeyUp={this.onSubmit} onChange={this.onPasswordChange} autoComplete="current-password" variant="outlined" type="password" autoFocus={true} />
                        </FormControl>
                        <FormControl id="form_password_reset">
                            <InputLabel>Bekreft passord</InputLabel>
                            <Input className="form_input_reset" required={true} value={this.state.password2} onKeyUp={this.onSubmit} onChange={this.onPassword2Change} autoComplete="current-password" variant="outlined" type="password" />
                        </FormControl>
                        <Button type="submit" id="form_btn_reset" disabled={this.state.resetDisabled} style={{opacity: this.state.resetOpacity}} variant="contained">{this.state.resetText}</Button>
                    </form>
                </main>
            );
        } else {
            return (
                // Ugyldig eller ikke-eksisterende token 
                <NoAccess />
            );
        }
    };
}

export default withSnackbar(Reset);

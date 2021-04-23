// React-spesifikt
import { Component } from "react";
import { Redirect } from "react-router-dom";

// 3rd-party Packages
import { Button, FormControl, InputLabel, Input, Select, MenuItem } from '@material-ui/core';
import axios from 'axios';
import FormData from 'form-data';
import { withSnackbar } from 'notistack';

// Studentreisen-assets og komponenter
import CookieService from '../../../global/Services/CookieService';
import Loader from '../../../global/Components/Loader';
import '../Styles/courseStyles.css';

class CourseNew extends Component {
    constructor(props) {
        super(props)

        // Nytt Kurs-spesifikke states, delt opp i før-visning autentisering og felt
        this.state = {  loading : this.props.loading, authenticated : this.props.auth, 
                        CourseNew_input_emnekode : "", CourseNew_input_navn : "", 
                        CourseNew_input_beskrivelse : "", CourseNew_input_spraak : "", 
                        CourseNew_input_semester : "", CourseNew_input_studiepoeng : "", 
                        CourseNew_input_lenke : "", CourseNew_input_fagfelt : "", CourseNew_fagfelt : null, CourseNew_fagfelt_hentet : false, 
                        submitDisabled : false, submitText : "Opprett kurs", submitOpacity: "1" }
    }

    onInputChange = e => {
        if(e.target.id === "CourseNew_input_emnekode") {
            this.setState({
                CourseNew_input_emnekode : e.target.value
            })
        } else if(e.target.id === "CourseNew_input_navn") {
            this.setState({
                CourseNew_input_navn : e.target.value
            })
        } else if(e.target.id === "CourseNew_input_beskrivelse") {
            this.setState({
                CourseNew_input_beskrivelse : e.target.value
            })
        } else if(e.target.id === "CourseNew_input_spraak") {
            this.setState({
                CourseNew_input_spraak : e.target.value
            })
        } else if(e.target.id === "CourseNew_input_semester") {
            this.setState({
                CourseNew_input_semester : e.target.value
            })
        } else if(e.target.id === "CourseNew_input_studiepoeng") {
            this.setState({
                CourseNew_input_studiepoeng : e.target.value
            })
        } else if(e.target.id === "CourseNew_input_lenke") {
            this.setState({
                CourseNew_input_lenke : e.target.value
            })
        }
    }

    onSelectChange = e => {
        this.setState({
            CourseNew_input_fagfelt : e.target.value
        })
    }
  
    // Utføres når bruker trykker på "Opprett kurs" eller trykker på Enter i ett av input-feltene
    handleSubmit = e => {
        // Stopper siden fra å laste inn på nytt
        e.preventDefault();

        if(this.state.CourseNew_input_emnekode.length > 0 && this.state.CourseNew_input_emnekode.length <= 255) {
            if(this.state.CourseNew_input_navn.length > 0 && this.state.CourseNew_input_navn.length <= 255) {
                if(this.state.CourseNew_input_beskrivelse.length > 0 && this.state.CourseNew_input_beskrivelse.length <= 1000) {
                    if(this.state.CourseNew_input_spraak.length > 0 && this.state.CourseNew_input_spraak.length <= 255) {
                        if(this.state.CourseNew_input_semester.length > 0 && this.state.CourseNew_input_semester.length <= 4) {
                            if(this.state.CourseNew_input_studiepoeng.length > 0 && this.state.CourseNew_input_studiepoeng.length <= 4) {
                                if(this.state.CourseNew_input_lenke.length > 0 && this.state.CourseNew_input_lenke.length <= 255) {
                                    if(this.state.CourseNew_input_fagfelt !== "") {
                                        // Slår midlertidig av "Opprett kurs"-knappen og endrer teksten til "Vennligst vent"
                                        this.setState({
                                            submitDisabled: true,
                                            submitText: "Vennligst vent",
                                            submitOpacity: "0.6"
                                        });
                                
                                        const data = new FormData();

                                
                                        data.append('emnekode', this.state.CourseNew_input_emnekode);
                                        data.append('navn', this.state.CourseNew_input_navn);
                                        data.append('beskrivelse', this.state.CourseNew_input_beskrivelse);
                                        data.append('spraak', this.state.CourseNew_input_spraak);
                                        data.append('semester', this.state.CourseNew_input_semester);
                                        data.append('studiepoeng', this.state.CourseNew_input_studiepoeng);
                                        data.append('lenke', this.state.CourseNew_input_lenke);
                                        data.append('fagfeltid', this.state.CourseNew_input_fagfelt);
                                        data.append('token', CookieService.get("authtoken"));
                                
                                        // Axios POST request
                                        axios
                                            // Henter API URL fra .env og utfører en POST request med dataen fra objektet over
                                            // Axios serialiserer objektet til JSON selv
                                            .post(process.env.REACT_APP_APIURL + "/course/submitCourse", data)
                                            // Utføres ved mottatt resultat
                                            .then(res => {
                                                if(res.data.status === "success") {
                                                    // Mottok OK fra server
                                                    this.setState({
                                                        authenticated: true
                                                    });

                                                    window.location.href = "/course/emnekode=" + this.state.CourseNew_input_emnekode;
                                                } else {
                                                    // Feil oppstod ved oppretting
                                                    this.props.enqueueSnackbar(res.data.message, { 
                                                        variant: res.data.status,
                                                        autoHideDuration: 5000,
                                                    });
                                                    this.setState({
                                                        submitDisabled: false,
                                                        submitText: "Opprett kurs",
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
                                                    submitText: "Opprett kurs",
                                                    submitOpacity: "1"
                                                });
                                            })
                                            // Utføres alltid uavhengig av andre resultater
                                            .finally(() => {
                                                // Gjør Opprett kurs knappen tilgjengelig igjen om kurset ikke er opprettet over
                                                if(!this.state.authenticated) {
                                                    this.setState({
                                                        submitDisabled: false,
                                                        submitText: "Opprett kurs",
                                                        submitOpacity: "1"
                                                    });
                                                }
                                            });
                                    } else {
                                        // Fagfelt er ikke fylt inn
                                        this.props.enqueueSnackbar("Vennligst velg ett fagfelt", { 
                                            variant: 'error',
                                            autoHideDuration: 5000,
                                        });
                                    }
                                } else {
                                    // Lenke er ikke fylt inn eller for lang
                                    this.props.enqueueSnackbar("Lenken er ikke fylt inn eller for lang", { 
                                        variant: 'error',
                                        autoHideDuration: 5000,
                                    });
                                }
                            } else {
                                // Studiepoeng er ikke fylt inn eller for lang
                                this.props.enqueueSnackbar("Studiepoeng er ikke fylt inn eller for lang", { 
                                    variant: 'error',
                                    autoHideDuration: 5000,
                                });
                            }
                        } else {
                            // Semester er ikke fylt inn eller for lang
                            this.props.enqueueSnackbar("Semester er ikke fylt inn eller for lang", { 
                                variant: 'error',
                                autoHideDuration: 5000,
                            });
                        }
                    } else {
                        // Språk er ikke fylt inn eller for lang
                        this.props.enqueueSnackbar("Språk er ikke fylt inn eller for lang", { 
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
                // Navn er ikke fylt inn eller for lang
                this.props.enqueueSnackbar("Navnet er ikke fylt inn eller for lang", { 
                    variant: 'error',
                    autoHideDuration: 5000,
                });
            }
        } else {
            // Emnekoden er ikke fylt inn eller for lang
            this.props.enqueueSnackbar("Emnekode er ikke fylt inn eller for lang", { 
                variant: 'error',
                autoHideDuration: 5000,
            });
        }
    };

    componentDidMount() {
        if(CookieService.get("authtoken") !== undefined) {
            axios
                .post(process.env.REACT_APP_APIURL + "/course/getFagfelt", {token : CookieService.get("authtoken")})
                .then(res => {
                    this.setState({
                        CourseNew_fagfelt: res.data.fagfelt
                    })
                })
                .finally(res => {
                    this.setState({
                        CourseNew_fagfelt_hentet: true
                    })
                });
        } else {
            this.setState({
                CourseNew_fagfelt_hentet: true
            })
        }
    }

    render() {
        // Når alle fagfelt er hentet, vis i listen
        let fagfeltList;
        if(this.state.CourseNew_fagfelt_hentet && this.state.CourseNew_fagfelt !== null) {
            const fagfelt = this.state.CourseNew_fagfelt;
            fagfeltList = fagfelt.map((fagfelt) => {
                return (
                    <MenuItem key={fagfelt.fagfeltid} value={fagfelt.fagfeltid}>{fagfelt.beskrivelse}</MenuItem>
                )
            }, this);
        }

        // Om vi er i loading fasen (Før mottatt data fra API) vises det et Loading ikon
        if(this.props.loading || !this.state.CourseNew_fagfelt_hentet) {
            return(
                <section id="loading">
                    <Loader />
                </section>
            );
        }
        
        if(!this.props.loading && this.props.auth) {
            // Når loading fasen er komplett og bruker er innlogget, vis innholdet på nytt kurs-siden
            return (
                <>
                <main id="CourseNew_main">
                    <Button id="CourseNew_button_back" onClick={() => window.history.back()}>{"< Tilbake"}</Button>
                    <h1>Nytt kurs</h1>
                    <form id="CourseNew_form" onSubmit={this.handleSubmit}>
                        <FormControl id="CourseNew_formcontrol">
                            <InputLabel>Emnekode</InputLabel>
                            <Input id="CourseNew_input_emnekode" required={true} value={this.state.CourseNew_input_emnekode} onKeyUp={this.onSubmit} onChange={this.onInputChange} autoFocus={true} />
                        </FormControl>
                        <FormControl id="CourseNew_formcontrol">
                            <InputLabel htmlFor="CourseNew_select_fagfelt">Fagfelt</InputLabel>
                            <Select id="CourseNew_select_fagfelt" name="CourseNew_select_fagfelt" value={this.state.CourseNew_input_fagfelt} onKeyUp={this.onSubmit} onChange={this.onSelectChange}>
                                {fagfeltList}
                            </Select>
                        </FormControl>
                        <FormControl id="CourseNew_formcontrol">
                            <InputLabel>Navn</InputLabel>
                            <Input id="CourseNew_input_navn" required={true} value={this.state.CourseNew_input_navn} onKeyUp={this.onSubmit} onChange={this.onInputChange} />
                        </FormControl>
                        <FormControl id="CourseNew_formcontrol">
                            <InputLabel>Beskrivelse</InputLabel>
                            <Input id="CourseNew_input_beskrivelse" required={true} value={this.state.CourseNew_input_beskrivelse} onKeyUp={this.onSubmit} onChange={this.onInputChange} variant="filled" multiline rowsMax="10" />
                        </FormControl>
                        <FormControl id="CourseNew_formcontrol">
                            <InputLabel>Språk</InputLabel>
                            <Input id="CourseNew_input_spraak" required={true} value={this.state.CourseNew_input_spraak} onKeyUp={this.onSubmit} onChange={this.onInputChange} />
                        </FormControl>
                        <FormControl id="CourseNew_formcontrol">
                            <InputLabel>Semester</InputLabel>
                            <Input id="CourseNew_input_semester" required={true} value={this.state.CourseNew_input_semester} onKeyUp={this.onSubmit} onChange={this.onInputChange} />
                        </FormControl>
                        <FormControl id="CourseNew_formcontrol">
                            <InputLabel>Studiepoeng</InputLabel>
                            <Input id="CourseNew_input_studiepoeng" required={true} value={this.state.CourseNew_input_studiepoeng} onKeyUp={this.onSubmit} onChange={this.onInputChange} type="number" />
                        </FormControl>
                        <FormControl id="CourseNew_formcontrol">
                            <InputLabel>Lenke</InputLabel>
                            <Input id="CourseNew_input_lenke" required={true} value={this.state.CourseNew_input_lenke} onKeyUp={this.onSubmit} onChange={this.onInputChange} type="url" />
                        </FormControl>
                        <Button id="CourseNew_button_submit" type="submit" disabled={this.state.submitDisabled} style={{opacity: this.state.submitOpacity}} variant="contained">{this.state.submitText}</Button>
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

export default withSnackbar(CourseNew);

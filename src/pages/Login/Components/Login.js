// React-spesifikt
import { Component } from "react";
import { Redirect } from "react-router-dom";

// 3rd-party Packages
import { Button, FormControl, InputLabel, Input, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Checkbox, FormControlLabel } from '@material-ui/core';
import axios from 'axios';
import { withSnackbar } from 'notistack';

// Studentreisen-assets og komponenter
import Loader from '../../../global/Components/Loader';
import CookieService from '../../../global/Services/CookieService';
import '../CSS/Login.css';
import usnlogo from '../../../assets/usn.png';

class Login extends Component {
  constructor(props) {
    super(props)
    // Login-spesifikke states, delt opp i før-visning autentisering, login, alert og glemt passord
    this.state = {loading : this.props.loading, authenticated : this.props.auth, 
                  email : "", pwd : "", remember : false, loginDisabled : false, loginText : "Logg inn", loginOpacity : "1",
                  forgotEmail : "", forgotDisplay : false, forgotBtnDisabled : false,
                  tempPw : "", tempPw2 : "", tempDisplay : false, tempBtnDisabled : false, tempAuthtoken : "", tempExpdate : ""}
  }

  // Utføres når bruker gjør en handling i input-feltet for e-post
  onEmailChange = e => {
    this.setState({
      email: e.target.value
    });
  };

  // Utføres når bruker gjør en handling i input-feltet for passord
  onPasswordChange = e => {
    this.setState({
      pwd: e.target.value
    });
  };

  // Utføres når bruker gjør en handling i checkbox-feltet for "Husk meg"
  onRememberChange = e => {
    this.setState({
      remember: e.target.checked
    });
  };
  
  // Utføres når bruker trykker på "Logg inn" eller trykker på Enter i ett av input-feltene
  handleLogin = e => {
    // Stopper siden fra å laste inn på nytt
    e.preventDefault();

    // Slår midlertidig av "Logg inn"-knappen og endrer teksten til "Vennligst vent"
    this.setState({
      loginDisabled: true,
      loginText: "Vennligst vent",
      loginOpacity: "0.6"
    });

    // Definerer objektet med dataen vi sender til server
    const data = {
      email: this.state.email,
      pwd: this.state.pwd,
      remember: this.state.remember
    };

    // Axios POST request
    axios
      // Henter API URL fra .env og utfører en POST request med dataen fra objektet over
      // Axios serialiserer objektet til JSON selv
      .post(process.env.REACT_APP_APIURL + "/auth/login", data)
      // Utføres ved mottatt resultat
      .then(res => {
        if(res.data.authtoken) {
          // Mottok autentiserings-token fra server, lagrer i Cookie
          // Sjekker om bruker har satt "Husk meg"
          if(!this.state.remember) {
            let date = new Date();
            // Token utløper om 3 timer om "Husk meg" ikke er satt
            date.setTime(date.getTime() + ((60 * 3) * 60 * 1000));

            if(res.data.pwd_temp !== 1) {
              this.setState({
                authenticated: true
              });

              const options = { path: "/", expires: date };
              CookieService.set('authtoken', res.data.authtoken, options);

              window.location.href="/Overview";
            } else {
              // Bruker har et midlertidig passord, ber bruker oppdatere før vi fortsetter
              this.setState({
                tempDisplay: true,
                tempExpdate: date,
                tempAuthtoken: res.data.authtoken
              });
            }
          } else {
            let date = new Date();
            // Token utløper om 72 timer om "Husk meg" ikke er satt
            date.setTime(date.getTime() + ((60 * 72) * 60 * 1000));

            if(res.data.pwd_temp !== 1) {
              this.setState({
                authenticated: true
              });

              const options = { path: "/", expires: date };
              CookieService.set('authtoken', res.data.authtoken, options);
              
              window.location.href="/Overview";
            } else {
              // Bruker har et midlertidig passord, ber bruker oppdatere før vi fortsetter
              this.setState({
                tempDisplay: true,
                tempExpdate: date,
                tempAuthtoken: res.data.authtoken
              });
            }
          }
        } else {
          // Feil oppstod ved innlogging, viser meldingen
          this.props.enqueueSnackbar(res.data.message, { 
            variant: 'error',
            autoHideDuration: 5000,
          });
        }
      })
      .catch(err => {
        // En feil oppstod ved oppkobling til server
        this.props.enqueueSnackbar("En intern feil oppstod, vennligst forsøk igjen senere", { 
          variant: 'error',
          autoHideDuration: 5000,
        });
      })
      // Utføres alltid uavhengig av andre resultater
      .finally( () => {
        // Gjør Logg inn knappen tilgjengelig igjen om bruker ikke er autentisert over
        if(!this.state.authenticated) {
          this.setState({
            loginDisabled: false,
            loginText: "Logg inn",
            loginOpacity: "1"
          });
        }
      });
  };

  // Utføres om bruker trykker på "Tilbakestill passord" i del for Glemt passord
  handleForgot = () => {
    // Slår midlertidig av "Tilbakestill passord"-knappen
    this.setState({
      forgotBtnDisabled: true
    });

    // Sørger for at eposten er fyllt inn
    if(this.state.forgotEmail !== "") {
      // Epost validering med regex
      if (/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i.test(this.state.forgotEmail)) {
        // Axios POST request
        axios
          // Henter API URL fra .env og utfører en POST request med dataen fra objektet over
          // Axios serialiserer objektet til JSON selv
          .post(process.env.REACT_APP_APIURL + "/forgotPassword", {epost : this.state.forgotEmail})
          // Utføres ved mottatt resultat
          .then(res => {
            if(res.data.status == "success") {
              this.props.enqueueSnackbar("Om e-posten er registrert hos oss vil du motta en lenke for tilbakestilling snart", { 
                  variant: 'success',
                  autoHideDuration: 5000,
              });
            } else {
              // Feil oppstod, viser meldingen
              this.props.enqueueSnackbar(res.data.message, { 
                  variant: 'error',
                  autoHideDuration: 5000,
              });
            }
          })
          .catch(err => {
            // En feil oppstod ved oppkobling til server
            this.props.enqueueSnackbar("En intern feil oppstod, vennligst forsøk igjen senere", { 
                variant: 'error',
                autoHideDuration: 5000,
            });
          })
          // Utføres alltid uavhengig av andre resultater
          .finally( () => {
            // Gjør "Tilbakestill passord"-knappen tilgjengelig igjen
            this.setState({
              forgotBtnDisabled: false
          });
        });
      } else {
        // Ugyldig epost
        this.props.enqueueSnackbar("E-post adressen er ugyldig", { 
            variant: 'error',
            autoHideDuration: 5000,
        });
        this.setState({
          forgotBtnDisabled: false
        });
      }
    } else {
      // Ingen epost oppgitt
      this.props.enqueueSnackbar("E-post er ikke fylt inn", { 
          variant: 'error',
          autoHideDuration: 5000,
      });
      this.setState({
        forgotBtnDisabled: false
      });
    }
  };

  // Utføres når bruker gjør en handling i input-feltet for "Glemt passord"
  onForgotChange = e => {
    this.setState({
      forgotEmail: e.target.value
    });
  };

  // Utføres når bruker trykker på knappen "Glemt passord"
  handleClickForgot = () => {
    this.setState({
      forgotDisplay: true
    });
  };

  // Utføres når bruker trykker utenfor dialogen for "Glemt passord", eller når bruker trykker på knapp "Avbryt" i "Glemt passord"
  handleCloseForgot = () => {
    this.setState({
      forgotDisplay: false
    });
  };

  

  // Utføres når bruker velger å bekrefte nytt passord til en bruker med midlertidig passord (Manuelt opprettet av admin)
  handleTempChange = () => {
    // Slår midlertidig av "Oppdater passord"-knappen
    this.setState({
      tempBtnDisabled: true
    });

    // Sørger for at begge passordene er fyllt inn
    if(this.state.tempPw !== "" && this.state.tempPw2 !== "") {
      // Sjekker om passordene er like
      if(this.state.tempPw === this.state.tempPw2) {
        let canShowBtn = false;
        axios
          // Henter API URL fra .env og utfører en POST request med dataen fra objektet over
          // Axios serialiserer objektet til JSON selv
          .post(process.env.REACT_APP_APIURL + "/auth/updatePassord", {token : this.state.tempAuthtoken, pwd : this.state.tempPw, pwd2 : this.state.tempPw2})
          // Utføres ved mottatt resultat
          .then(res => {
            if(res.data.status == "success") {
              this.props.enqueueSnackbar("Passord oppdatert, du videresendes om få sekunder", { 
                  variant: 'success',
                  autoHideDuration: 5000,
              });
              
              const options = { path: "/", expires: this.state.tempExpdate };
              CookieService.set('authtoken', this.state.tempAuthtoken, options);

              setTimeout(() => {
                window.location.href="/Overview";
              }, 5000);
            } else {
              // Feil oppstod, viser meldingen
              this.props.enqueueSnackbar(res.data.message, { 
                  variant: 'error',
                  autoHideDuration: 5000,
              });
              canShowBtn = true;
            }
          })
          .catch(err => {
            // En feil oppstod ved oppkobling til server
            this.props.enqueueSnackbar("En intern feil oppstod, vennligst forsøk igjen senere", { 
                variant: 'error',
                autoHideDuration: 5000,
            });
            canShowBtn = true;
          })
          // Utføres alltid uavhengig av andre resultater
          .finally( () => {
            if(canShowBtn) {
              // Gjør "Oppdater passord"-knappen tilgjengelig igjen
              this.setState({
                tempBtnDisabled: false
              });
            }
        });
      } else {
        // Passordene er ikke like
        this.props.enqueueSnackbar("Passordene er ikke like", { 
            variant: 'error',
            autoHideDuration: 5000,
        });
        this.setState({
          tempBtnDisabled: false
        });
      }
    } else {
      // Passord ikke fylt inn
      this.props.enqueueSnackbar("Ett eller begge passord-feltene er ikke fylt inn", { 
          variant: 'error',
          autoHideDuration: 5000,
      });
      this.setState({
        tempBtnDisabled: false
      });
    }
  };

  // Utføres når bruker gjør en handling i input-feltet for nytt passord
  onTempPwChange = e => {
    this.setState({
      tempPw: e.target.value
    });
  };

  // Utføres når bruker gjør en handling i input-feltet for å bekrefte nytt passord
  onTempPw2Change = e => {
    this.setState({
      tempPw2: e.target.value
    });
  };

  // Utføres når bruker trykker utenfor dialogen for "Nytt passord", eller når bruker trykker på knapp "Avbryt" i "Nytt passord"
  handleCloseTemp = () => {
    this.setState({
      tempDisplay: false
    });
  };

  

  // Utføres når bruker trykker på knapp "Ny bruker"
  gotoRegister = () => {
    // Navigerer til /register/
    window.location.href="/Register";
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
    
    if(!this.props.loading && !this.props.auth) {
      // Når loading fasen er komplett og bruker ikke er innlogget, vis innholdet på Login-siden
      return (
        <main id="main_login">
          <section id="section_logo_login">
            <img src={usnlogo} alt="USN logo" />
          </section>
          <form id="form_login" onSubmit={this.handleLogin}>
            <FormControl id="form_email_login">
              <InputLabel>E-post</InputLabel>
              <Input type="email" className="form_input_login" required={true} value={this.state.email} onKeyUp={this.onSubmit} onChange={this.onEmailChange} autoFocus={true} autoComplete="email" variant="outlined" />
            </FormControl>
            <FormControl id="form_password_login">
              <InputLabel>Passord</InputLabel>
              <Input className="form_input_login" required={true} value={this.state.password} onKeyUp={this.onSubmit} onChange={this.onPasswordChange} autoComplete="current-password" variant="outlined" type="password" />
            </FormControl>
            <FormControlLabel id="form_huskmeg" control={<Checkbox value={this.state.remember} onChange={this.onRememberChange} color="primary" />} label="Husk meg" labelPlacement="end" />
            <Button onClick={this.handleClickForgot} id="form_glemt_login" variant="outlined">Glemt Passord</Button>
            <Button onClick={this.gotoRegister} variant="outlined">Ny bruker</Button>
            <Button type="submit" id="form_btn_login" disabled={this.state.loginDisabled} style={{opacity: this.state.loginOpacity}} variant="contained">{this.state.loginText}</Button>
          </form>
          {/* Del for glemt passord */}
          <Dialog open={this.state.forgotDisplay} onClose={this.handleCloseForgot} aria-labelledby="login_dialog_title">
            <DialogTitle id="login_dialog_title">Glemt passord</DialogTitle>
            <DialogContent>
              <DialogContentText>Skriv inn e-posten for å tilbakestille passordet ditt</DialogContentText>
              <TextField autoFocus margin="dense" value={this.state.forgotEmail} onChange={this.onForgotChange} label="E-post" type="email" fullWidth />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleCloseForgot} color="primary">Avbryt</Button>
              <Button disabled={this.state.forgotBtnDisabled} onClick={this.handleForgot} color="primary">Tilbakestill passord</Button>
            </DialogActions>
          </Dialog>
          {/* Del for oppdater passord */}
          <Dialog open={this.state.tempDisplay} onClose={this.handleCloseTemp} aria-labelledby="login_dialog_title">
            <DialogTitle id="login_dialog_title">Oppdater passord</DialogTitle>
            <DialogContent>
              <DialogContentText>Du har et midlertidig passord og må oppdatere dette før du kan fortsette</DialogContentText>
              <TextField autoFocus margin="dense" value={this.state.tempPw} onChange={this.onTempPwChange} label="Nytt passord" type="password" fullWidth />
              <TextField margin="dense" value={this.state.tempPw2} onChange={this.onTempPw2Change} label="Bekreft nytt passord" type="password" fullWidth />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleCloseForgot} color="primary">Avbryt</Button>
              <Button disabled={this.state.tempBtnDisabled} onClick={this.handleTempChange} color="primary">Oppdater passord</Button>
            </DialogActions>
          </Dialog>
        </main>
      );
    } else {
      return (
        // Brukeren er allerede innlogget, går til forsiden
        <Redirect to={{pathname: "/"}} />
      );
    }
  }
}

export default withSnackbar(Login);

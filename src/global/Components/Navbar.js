import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { Button, Avatar, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import PersonOutlinedIcon from '@material-ui/icons/PersonOutlined';
import CalendarTodayOutlinedIcon from '@material-ui/icons/CalendarTodayOutlined';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import moment from 'moment';
import axios from "axios";

import '../CSS/Navbar.css';
import favicon from '../../assets/usn.png';
import CookieService from '../Services/CookieService';
import Loader from './Loader';

function Navbar(props) {
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);
    const [loading, setLoading] = useState(false);
    // States for profilbilde
    const [profilbilde, setProfilbilde] = useState()
    const [pbLoading, setPbLoading] = useState(true);
    const [initialer, setInitialer] = useState("")
    // Props som mottas fra App, viser til om bruker er inn-/utlogget
    const [auth, setAuth] = useState(false);
    const [type, setType] = useState(null);
    // States for notifiseringer
    const [notif, setNotif] = useState(null);
    const [notifUlest, setNotifUlest] = useState(0);
    const [notifAapen, setNotifAapen] = useState(false);
 
    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    let history = useHistory()

    const token = CookieService.get("authtoken");

    // Testing på om en "LOGG UT"-knapp skal vises i navbar eller i meny
    const showButton = () => {
      if (!loading) {
        if(window.innerWidth < 1280) {
            setButton(false);
            if (auth) {
              try {
                document.getElementById("loggBtnMobil").style.visibility = "visible";
              } catch (TypeError) {}

            }
        } else {
            setButton(true);
            if (auth) {
              try {
                document.getElementById("loggBtnMobil").style.visibility = "collapse";
            } catch (TypeError) {}
            }
        }
      }
    };

    useEffect( () => {
      setAuth(props.auth);
      setType(props.type);
      setNotif(props.notif);
      setLoading(props.loading);
      getAvatar()
      if(props.notif !== undefined) {
        setNotifUlest(1);
      }
      showButton();
    }, [props]); 

    // Legger til eller fjerner padding under navbar, for å skyve innholdet under nedover. //
    const expand = () => document.getElementById("bar").style.paddingBottom = "60vh";
    const shrink = () => document.getElementById("bar").style.paddingBottom = "0vh";

    // Lytt etter resizing og juster deretter
    window.addEventListener('resize', closeMobileMenu);
    window.addEventListener('resize', shrink);
    window.addEventListener('resize', showButton);

    // Styling av Material UI-elementer
    const useStyles = makeStyles({
      navbtn: {
        color: '#fff',
        fontSize: '1.5rem',
        padding: '0.5rem 1rem',
        display: 'flex',
        height: '100%'
      },

      loggbtn: {
        color: '#fff',
        fontSize: '1.5rem',
        padding: '0.5rem 1rem',
        display: 'grid',
        minWidth: '7rem',
        transform: 'translate(45vw)',
        marginRight: '2vw'
      },

      loggbtnNoAuth: {
        color: '#fff',
        fontSize: '1.5rem',
        padding: '0.5rem 1rem',
        display: 'grid',
        minWidth: '7rem',
        transform: 'translate(24vw)',
        textDecoration: 'none',
        ['@media (min-width:370px)']: {
          transform: 'translate(28vw)'
        },
        ['@media (min-width:480px)']: {
          transform: 'translate(32vw)'
        },
        ['@media (min-width:640px)']: {
          transform: 'translate(36vw)'
        },
        ['@media (min-width:768px)']: {
          transform: 'translate(38vw)'
        },
        ['@media (min-width:1024px)']: {
          transform: 'translate(40vw)'
        },
        ['@media (min-width:1440px)']: {
          transform: 'translate(38vw)'
        },
        ['@media (min-width:2560px)']: {
          transform: 'translate(41vw)'
        }
      },

      loggbtnmobil: {
        color: '#fff',
        fontSize: '1.5rem',
        padding: '0.5rem 1rem',
        display: 'flex',
        height: '100%',
        visibility: 'collapse',
      },

      loggbtnmobilBar: {
        color: '#fff',
        fontSize: '1.5rem',
        padding: '0.5rem 1rem',
        display: 'flex',
        height: '100%',
        display: 'none',
      },

      avatar: {
        backgroundColor: '#3bafa2'
      }

    });
    const classes = useStyles();

    const loggUt = () => {
      shrink();
      closeMobileMenu();
      CookieService.remove("authtoken");
      axios.post(process.env.REACT_APP_APIURL + "/notif/getNotifs", {token : token});
      setAuth(false);
      history.push("/")
    }

    const onLink = () => {
      closeMobileMenu()
      shrink()
    }


    const notifClickOpen = () => {
      setNotifAapen(true);
      if(!props.notif) {
        setNotifUlest(0);
      }
      if(notif !== undefined && notif == null) {
        axios
          // Henter API URL fra .env og utfører en POST request med dataen fra objektet over
          // Axios serialiserer objektet til JSON selv
          .post(process.env.REACT_APP_APIURL + "/notif/getNotifs", {token : token} )
          // Utføres ved mottatt resultat
          .then(res => {
            if(res.data.notifs) {
              setNotif(res.data.notifs);
            } else if(res.data.nodata) {
              setNotif({nodata : res.data.nodata});
            }
          });
      } else {
        axios
          // Henter API URL fra .env og utfører en POST request med dataen fra objektet over
          // Axios serialiserer objektet til JSON selv
          .post(process.env.REACT_APP_APIURL + "/notif/readNotifs", {token : token, notifs : notif});
      }
    };
    
    const notifClose = () => {
      setNotifAapen(false);
    };

    const getAvatar = () => {
      if (auth && token !== undefined) {
        axios.post(process.env.REACT_APP_APIURL + "/profile/getProfilbilde", {token : token})
          .then(res => {
            setPbLoading(false);
            if (res.data.results !== undefined && res.data.results[0].plassering !== null) {
              setProfilbilde(res.data.results[0].plassering);
            } else {
              setInitialer(res.data.results[0].fnavn + res.data.results[0].enavn);
            }
          });
      }
    }

    if(loading) {
      return(
        <div className="navbarBody" >
          <nav className='navbar' id="bar" >
            <div className='navbar-container'>
              <Link tabIndex={1}
                to="/" 
                className="navbar-logo" 
                onClick={closeMobileMenu}>
                <img className="navbar-logo-png" src={favicon} alt="USN" /> 
              </Link>
            </div>
          </nav>
        </div>
      );
    }

    if (!loading) return (
        <div className="navbarBody" >
          <nav className='navbar' id="bar" >
            <div className='navbar-container'>
              {!auth && <Link tabIndex={1}
                to="/" 
                className="navbar-logo" 
                onClick={closeMobileMenu}>
                <img className="navbar-logo-png" src={favicon} alt="USN" /> 
              </Link> }
              {auth && <Link tabIndex={1}
                to="/overview"
                className="navbar-logo"
                onClick={closeMobileMenu} >
                <img className="navbar-logo-png" src={favicon} alt="USN" />
              </Link>} 
              {/* Første av en serie tester i 'navbar-container' på om bruker er innlogget */}
              {auth && 
              <div className='menu-icon' onClick={handleClick}>
                <i className={click? 'fas fa-times' : 'fas fa-bars'} 
                  onClick={click? shrink : expand}>
                </i>
              </div>
              }
              
              {auth && <div className={click ? 'nav-menu active' : 'nav-menu'}>
                {click ? 
                <Button
                  className={classes.loggbtnmobil}
                  onClick={loggUt}
                  id='loggBtnMobil'>
                  Logg ut
                </Button>
                :
                <Button
                  className={classes.loggbtnmobilBar}
                  onClick={loggUt}
                  id='loggBtnMobil'>
                  Logg ut
                </Button>
                }

                <Button 
                  className={classes.navbtn} 
                  onClick={onLink}
                  component={Link} 
                  to='/course'
                  tabIndex={2}>
                  Kurs
                </Button>

                <Button 
                  className={classes.navbtn}
                  onClick={onLink}
                  component={Link}
                  to='/seminar'
                  tabIndex={3}
                >
                Seminarer
                </Button>
    
                <Button
                  className={classes.navbtn}
                  onClick={onLink}
                  component={Link}
                  to='/CV'
                  tabIndex={4}
                >
                  CV
                </Button>

                <Button
                  className={classes.navbtn}
                  onClick={onLink}
                  component={Link}
                  to='/overview'
                  tabIndex={5}
                >
                  Oversikt
                </Button>

                {type >= 2 && 
                  <Button 
                    className={classes.navbtn}
                    onClick={onLink}
                    component={Link} 
                    to='/Tools' 
                    tabIndex={6}>
                      Verktøy
                  </Button>
                }
              </div> }

              {auth && (notif !== null && notifUlest > 0) && 
                  <NotificationImportantIcon tabIndex={7} id="notif-bell" onClick={notifClickOpen} />
              }
              {auth && (notif == null || notifUlest == 0) &&
                  <NotificationsNoneIcon tabIndex={7} id="notif-bell" onClick={notifClickOpen} onKeyUp={e => e.code === "Enter" ? notifClickOpen() : ""} />
              }

              {auth && <Link
                to='/Profile'
                className="avatarWrap">
                {pbLoading && 
                  <CircularProgress color="secondary" />
                }
                {!pbLoading && 
                  <Avatar
                    src={"/uploaded/" + profilbilde }
                    className={classes.avatar}
                  >
                    {/* Hvis det ikke eksisterer et bilde for brukeren faller avatar tilbake på initialer */}
                    {initialer}
                  </Avatar>
                }
              </Link>}
              {button && auth && <Button onClick={loggUt} className={classes.loggbtn} > LOGG UT </Button> }
              {button && !auth && <Link to='/Register' className={classes.loggbtnNoAuth} > REGISTRER </Link> }
              {!auth && <Link to='/Login' className={classes.loggbtnNoAuth} > LOGG INN </Link> }
            </div>
          </nav>
        
          <Dialog onClose={notifClose} aria-labelledby="customized-dialog-title" open={notifAapen}>
              <DialogTitle id="customized-dialog-title" onClose={notifClose}>
                {notifUlest !== 0 &&
                  <>
                    Uleste kunngjøringer
                  </>
                }
                {notifUlest == 0 &&
                  <>
                    Kunngjøringer fra de siste 7 dagene
                  </>
                }
              </DialogTitle>
              <DialogContent dividers>
                {notif && notif.nodata !== undefined &&
                  <>
                    <section>
                      <p>{notif.nodata}</p>
                    </section>
                  </>
                }
                {notif && notif.nodata == undefined &&
                  <>
                    {notif.map(kunngjoring => {
                      return(
                        <section key={kunngjoring.kid} className="notif_section">
                          <p className="notif_p_tekst">{kunngjoring.tekst}</p>
                          <section className="notif_section_sender">
                            <PersonOutlinedIcon /> 
                            <p>{kunngjoring.lagetav}</p>
                          </section>
                          <section className="notif_section_dato">
                            <CalendarTodayOutlinedIcon />
                            <p>{moment(kunngjoring.dato).format('DD-MM-YYYY HH:mm')}</p>
                          </section>
                        </section>
                      )
                    })}
                  </>
                }
                {notif == null &&
                  <>
                    <Loader />
                  </>
                }
              </DialogContent>
              <DialogActions>
                <Button autoFocus onClick={notifClose} color="primary">
                  Lukk
                </Button>
              </DialogActions>
          </Dialog>
        </div>
      );
    }


export default Navbar;
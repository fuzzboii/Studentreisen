import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Button from "@material-ui/core/Button";
import { makeStyles } from '@material-ui/core/styles';

import '../CSS/Navbar.css';
import favicon from '../../../assets/usn.png';
import CookieService from '../../../global/Services/CookieService';
import AuthService from '../../../global/Services/AuthService';

function Navbar() {
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);
    const [auth, setAuth] = useState(false);

    // Henter authtoken-cookie
    const token = CookieService.get("authtoken");

    const authorize = () => {
    if(token !== undefined) {
      // Om token eksisterer sjekker vi mot serveren om brukeren har en gyldig token
      AuthService.isAuthenticated(token).then(res => {
        if(!res.authenticated) {
          // Sletter authtoken om token eksisterer lokalt men ikke er gyldig på server
          CookieService.remove("authtoken");
        } else {
          setAuth(res.authenticated);
        }
      });
    }
  };
    
    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    // Testing på om en "LOGG UT"-knapp skal vises i navbar eller i meny
    const showButton = () => {
        if(window.innerWidth <= 960) {
            setButton(false);
            if (auth) {
              document.getElementById("loggBtnMobil").style.visibility = "visible";
            }
        } else {
            setButton(true);
            if (auth) {
              document.getElementById("loggBtnMobil").style.visibility = "collapse";
            }
        }
    };

    useEffect( () => {
      showButton();
      authorize();
    }, []); 

    // Legger til eller fjerner padding under navbar, for å skyve innholdet under nedover. //
    const expand = () => document.getElementById("bar").style.paddingBottom = "60vh";
    const shrink = () => document.getElementById("bar").style.paddingBottom = "0vh";

    // Lytt etter resizing og juster deretter
    window.addEventListener('resize', closeMobileMenu);
    window.addEventListener('resize', shrink);
    window.addEventListener('resize', showButton);

    // Håndtering av klikk på meny-knapper
    const [anchorKurs, setAnchorKurs] = React.useState(null);
    const handleClickAnchorKurs = event => {
    setAnchorKurs(event.currentTarget);
    };
    const handleCloseKurs = () => {
    setAnchorKurs(null);
    };
    const [anchorSeminarer, setAnchorSeminarer] = React.useState(null);
    const handleClickAnchorSeminarer = event => {
    setAnchorSeminarer(event.currentTarget);
    };
    const handleCloseSeminarer = () => {
    setAnchorSeminarer(null);
    };

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
        transform: 'translate(45vw)'
      },

      loggbtnNoAuth: {
        color: '#fff',
        fontSize: '1.5rem',
        padding: '0.5rem 1rem',
        display: 'grid',
        minWidth: '7rem',
        transform: 'translate(30vw)',
        textDecoration: 'none'
      },

      loggbtnmobil: {
        color: '#fff',
        fontSize: '1.5rem',
        padding: '0.5rem 1rem',
        display: 'flex',
        height: '100%',
        visibility: 'collapse'
      }
    });
    const classes = useStyles();

    return (
        <>
          <nav className='navbar' id="bar">
            <div className='navbar-container'>
              <Link 
                to="/" 
                className="navbar-logo" 
                onClick={closeMobileMenu}>
                <img className="navbar-logo-png" src={favicon} alt="USN" />
              </Link>
              {/* Første av en serie tester i 'navbar-container' på om bruker er innlogget */}
              {auth && 
              <div className='menu-icon' onClick={handleClick}>
                <i className={click? 'fas fa-times' : 'fas fa-bars'} 
                  onClick={click? shrink : expand}>
                </i>
              </div>
              }
              
              {auth && <div className={click ? 'nav-menu active' : 'nav-menu'}>
                <Button
                  className={classes.loggbtnmobil}
                  id='loggBtnMobil'>
                  Logg ut
                </Button>

                <Button 
                  className={classes.navbtn} 
                  aria-controls="simple-menu" 
                  aria-haspopup="true" 
                  onClick={handleClickAnchorKurs}>
                  Kurs
                </Button>
                <Menu
                  id="kurs-menu"
                  className={classes.menu}
                  anchorEl={anchorKurs}
                  keepMounted
                  open={Boolean(anchorKurs)}
                  onClose={handleCloseKurs}
                  getContentAnchorEl={null}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}>

                  <MenuItem onClick={handleCloseKurs}>Nyheter</MenuItem>
                  <MenuItem onClick={handleCloseKurs}>Favoritter</MenuItem>
                  <MenuItem onClick={handleCloseKurs}>Arkiv</MenuItem>

                </Menu>

                <Button 
                  className={classes.navbtn} 
                  aria-controls="simple-menu" 
                  aria-haspopup="true" 
                  onClick={handleClickAnchorSeminarer}
                >
                Seminarer
                </Button>
                <Menu
                  id="seminarer-menu"
                  anchorEl={anchorSeminarer}
                  keepMounted
                  open={Boolean(anchorSeminarer)}
                  onClose={handleCloseSeminarer}
                  getContentAnchorEl={null}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}>

                  <MenuItem onClick={handleCloseSeminarer}>Nyheter</MenuItem>
                  <MenuItem onClick={handleCloseSeminarer}>Favoritter</MenuItem>
                  <MenuItem onClick={handleCloseSeminarer}>Arkiv</MenuItem>

                </Menu>
    
                <Button
                  className={classes.navbtn}>
                  CV
                </Button>
              </div> }
              
              {auth && <Link
                to='/Profile'>
                <i className="far fa-user" />
              </Link> }
              {button && auth && <Button className={classes.loggbtn} > LOGG UT </Button> }
              {button && !auth && <Link to='/Register' className={classes.loggbtnNoAuth} > REGISTRER </Link> }
              {!auth && <Link to='/Login' className={classes.loggbtnNoAuth} > LOGG INN </Link> }
            </div>
          </nav>
        </>
      );
    }

export default Navbar;
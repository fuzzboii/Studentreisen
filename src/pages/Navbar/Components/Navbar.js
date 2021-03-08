import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/Navbar.css';
import favicon from '../../../assets/usn.png';
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Button from "@material-ui/core/Button";
import { makeStyles } from '@material-ui/core/styles';

function Navbar() {
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);
    
    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    const showButton = () => {
        if(window.innerWidth <= 960) {
            setButton(false);
        } else {
            setButton(true);
        }
    };

    useEffect( () => {
      showButton();
    }, []); 

    window.addEventListener('resize', showButton);

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

    const useStyles = makeStyles({
      navbtn: {
        color: '#fff',
        fontSize: '1.5rem',
        padding: '0.5rem 1rem',
        display: 'flex',
        height: '100%',
      },

      loggbtn: {
        color: '#fff',
        fontSize: '1rem',
        padding: '0.5rem 1rem',
        display: 'flex',
        height: '100%'
      }
    });
    
    const classes = useStyles();

    return (
        <>
          <nav className='navbar'>
            <div className='navbar-container'>
              <Link 
                to="/" 
                className="navbar-logo" 
                onClick={closeMobileMenu}>
                <img className="navbar-logo-png" src={favicon} alt="USN" />
              </Link>
              <div className='menu-icon' onClick={handleClick}>
                <i className={click? 'fas fa-times' : 'fas fa-bars'} />
              </div>
              
              <div className={click ? 'nav-menu active' : 'nav-menu'}>
                  <Button
                    className='nav-links-mobile'
                  >
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
                anchorEl={anchorKurs}
                keepMounted
                open={Boolean(anchorKurs)}
                onClose={handleCloseKurs}
                >
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
                onClose={handleCloseSeminarer}>
                <MenuItem onClick={handleCloseSeminarer}>Nyheter</MenuItem>
                <MenuItem onClick={handleCloseSeminarer}>Favoritter</MenuItem>
                <MenuItem onClick={handleCloseSeminarer}>Arkiv</MenuItem>
                </Menu>
    
                <Button
                  className={classes.navbtn}>
                  CV
                </Button>
              </div>
              
              <Link
                to="/"
                className="nav-item"
                onClick={closeMobileMenu}
              >
                <i className="far fa-user" />
              </Link>
              {button && <Button className={classes.loggbtn} >LOGG UT</Button> }
            </div> 
          </nav>
        </>
      );
    }

export default Navbar;
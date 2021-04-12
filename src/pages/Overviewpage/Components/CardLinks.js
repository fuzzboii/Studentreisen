import React from "react";
import {Link} from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import CardContent from '@material-ui/core/CardContent';
import Button from "@material-ui/core/Button";
import {makeStyles, withTheme} from '@material-ui/core/styles';

import PersonRoundedIcon from '@material-ui/icons/PersonRounded';
import FormatListBulletedRoundedIcon from '@material-ui/icons/FormatListBulletedRounded';
import EventNoteRoundedIcon from '@material-ui/icons/EventNoteRounded';
import CreateRoundedIcon from '@material-ui/icons/CreateRounded';



const CardLinks = () => {

    const useStyles = makeStyles((theme) => ({
        card: {
            display: 'flex',      
        },
        link: {
                  
        },
        icon: {
          height: 40,
          width: 40,
          color: "white",
          padding: theme.spacing(0.5),
          marginRight: theme.spacing(1.5), 
          borderRadius: "100%",   
        },
      }));

      const styleProfile = {
        background: "#00b8d4",
      }
      const styleCourse = {
        background: "#009688",
      }
      const styleSeminar = {
        background: "#8bc34a",
      }
      const styleCV = {
        background: "#ff6528",
      }

      const classes = useStyles();


    return (
            <Box className='Cardbox' boxShadow={1}>
                <Link className="links" to="/Profile" >
                    <CardContent className='Cardcont'>
                            <PersonRoundedIcon className={classes.icon} style={styleProfile}/>
                            <div>
                                <h2 className='title-linkto'>Profil</h2> 
                                <h3 className='text-linkto'>Gå til side</h3>
                            </div>
                    </CardContent>
                </Link>
                <Link className="links" to="/course" > 
                    <CardContent className='Cardcont'>            
                            <FormatListBulletedRoundedIcon className={classes.icon} style={styleCourse}/>
                            <div>
                                <h2 className='title-linkto'>Kurs</h2>
                                <h3 className='text-linkto'>Se liste</h3>
                            </div> 
                    </CardContent>
                </Link>
                <Link className="links" to="/seminar" >
                    <CardContent className='Cardcont'>
                            <EventNoteRoundedIcon className={classes.icon} style={styleSeminar}/>
                            <div>
                                <h2 className='title-linkto'>Seminar</h2>
                                <h3 className='text-linkto'>Se liste</h3>
                            </div>
                    </CardContent>
                </Link>
                <Link className="links" to="/CV" >
                    <CardContent className='Cardcont'>
                            <CreateRoundedIcon className={classes.icon} style={styleCV}/>
                            <div>
                                <h2 className='title-linkto'>CV</h2>
                                <h3 className='text-linkto'>Gå til side</h3>
                            </div>
                    </CardContent>
                </Link>
            </Box>
        
    );
};

export default CardLinks;
// React spesifikt
import { useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

// 3rd-party Packages
import axios from 'axios';

// Material UI komponenter 
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import ListAltIcon from '@material-ui/icons/ListAlt';
import DetailsIcon from '@material-ui/icons/Details';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import LanguageIcon from '@material-ui/icons/Language';
import SchoolIcon from '@material-ui/icons/School';

// Studentreisen-assets og komponenter
import '../Styles/courseStyles.css';
import { MyCardContent } from '../Styles/apistyles';
import Loader from '../../../global/Components/Loader';
import NoAccess from '../../../global/Components/NoAccess';

// Styling for Material Design komponenter
const useStyles = makeStyles((theme) => ({
    link: {
        display: 'flex',
        fontSize: '14px',
      
    },
    icon: {
      marginRight: theme.spacing(0.5),
      paddingTop: theme.spacing(0.4),
      height: 15,
      width: 15,
    },
  }));


// Komponent for spesifikk kurs
const CourseDetail = (props) => {

    useEffect(() => {
        fetchData();
    },[]);

    // Hook for å få tilgang på styling
    const classes = useStyles();

    // Henter emnekode fra URL'en og deklarerer useState til videre bruk
    let { emnekode } = useParams();
    const [courses, setCourses] = useState([]);

    // Henter kursdata
    const fetchData = async () => {           
        const res = await axios.get(process.env.REACT_APP_APIURL + "/course/");
        console.log(res.data);
        setCourses(res.data);

    };
        
    return(
        <>
        {props.loading &&
            // Om vi er i loading fasen (Før mottatt data fra API) vises det et Loading ikon
            <section id="loading">
                <Loader />
            </section>
        }
        {!props.loading && props.auth &&
                <div className="course-detail">
                {/* Mapper kursdata, det objektet som tilsvarer emnekoden skal returneres*/}
                {courses.map((course, index) => { if(emnekode === course.emnekode)           
                        return <Box key={index}className="box-detail" boxShadow={3}>
                                    <MyCardContent>
                                        <Breadcrumbs aria-label="breadcrumb" >
                                            <Link color="inherit" href="/course" className={classes.link}>
                                                <ListAltIcon className={classes.icon} />
                                                Kurs
                                            </Link>
                                            <Typography color="textPrimary" className={classes.link}>
                                                <DetailsIcon className={classes.icon}/>
                                                Detaljer
                                            </Typography>
                                        </Breadcrumbs>
                                        <div className="courseHeader">
                                            <h1 className="overskriftKurs">{course.navn}</h1>
                                            <div className="kursinfo-tekst">
                                                <p>{course.emnekode}</p>
                                                <div className="iconBox">
                                                    <LanguageIcon className="language-icon" fontSize="inherit"/>
                                                    <p className="undervisningsspråk">{course.språk}</p>
                                                </div>
                                                <div className="iconBox">
                                                    <CalendarTodayIcon className="language-icon2" fontSize="inherit"/>
                                                    <p>{course.semester}</p>
                                                </div>
                                                <div className="iconBox">
                                                    <SchoolIcon className="language-icon2" fontSize="inherit"/>
                                                    <p>{course.studiepoeng}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="courseBody">
                                            <h2>Sammendrag</h2>
                                            <p>{course.beskrivelse}</p>
                                        </div>
                                        <div className="buttonWrap">
                                            <Button className="courseButton" variant="outlined" color="primary" href={course.lenke}>Gå til kursets hjemmeside</Button>
                                        </div>
                                    </MyCardContent>
                                </Box>         
                })}
                </div>
        
        }{!props.loading && !props.auth &&
                // Ugyldig eller ikke-eksisterende token 
                <NoAccess />
        }
        </>
    );  
}

export default CourseDetail;
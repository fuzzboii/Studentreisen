// React spesifikt
import { useState, useEffect, createRef} from 'react';
import {useParams} from 'react-router-dom';
import {useHistory} from 'react-router';

// 3rd-party Packages
import axios from 'axios';

// Material UI komponenter 
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import {makeStyles} from '@material-ui/core/styles';
import ListAltIcon from '@material-ui/icons/ListAlt';
import DetailsIcon from '@material-ui/icons/Details';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SchoolIcon from '@material-ui/icons/School';
import PlaceIcon from '@material-ui/icons/Place';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';

// Studentreisen-assets og komponenter
import '../Styles/courseStyles.css';
import Loader from '../../../global/Components/Loader';
import NoAccess from '../../../global/Components/NoAccess';
import { MyCardContent, Accordion, AccordionDetails, AccordionSummary } from '../Styles/apistyles';

// Styling for Material Design komponenter
const useStyles = makeStyles((theme) => ({
    link: {
        display: 'flex',
        fontSize: '14px',
        '&:hover': {
            cursor: 'pointer',
        },
    },
    
    icon: {
      marginRight: theme.spacing(0.5),
      paddingTop: theme.spacing(0.4),
      height: 15,
      width: 15,
    },
  }));

// Komponent for spesifikk kursmodul
const ModuleDetail = (props) => {
    useEffect(() => {
        fetchData();
        fetchPost();
    },[]);

    // Hook for å få tilgang på Reacts history-funksjoner,
    // og deklarerer funksjon for å gå tilbake til forrige side
    const history = useHistory();

    const goBackHandle = () => {
        history.goBack();
    };

    // Hook for å få tilgang på styling
    const classes = useStyles();

    // En Wrapper for å gi elementene i Map'en unike referanser
    const wrapper = createRef();

    // ACCORDION: deklarerer state, og funksjon for å åpne og lukke
    const [expanded, setExpanded] = useState('');

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    // Henter modulkode fra URL'en og deklarerer useStates til videre bruk
    let { modulkode } = useParams();
    const [modules, setModules] = useState([]);
    const [courseMods, setCoursemods] = useState([])

    // Henter kursmoduldata
    const fetchData = async () => {     
        const res = await axios.get(process.env.REACT_APP_APIURL + "/course/module");
        setModules(res.data);
    };

    // Henter kursdata til spesifikk modul
    const fetchPost = async () => {
        const data = {modulkode: modulkode}; 
        const res = await axios.post(process.env.REACT_APP_APIURL + "/course/module", data);
        setCoursemods(res.data);
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
                {/* Mapper kursmoduldata, det objektet som tilsvarer modulkoden skal returneres*/}
                {modules.map(mod => { if(modulkode === mod.modulkode)           
                        return <Box key={mod.modulkode} ref={wrapper} className="box-detail" boxShadow={3}>
                                    <MyCardContent>
                                        <Breadcrumbs aria-label="breadcrumb" >
                                            <Link color="inherit" onClick={goBackHandle} className={classes.link}>
                                                <ListAltIcon className={classes.icon} />
                                                Kursmodul
                                            </Link>
                                            <Typography color="textPrimary" className={classes.link}>
                                                <DetailsIcon className={classes.icon}/>
                                                Detaljer
                                            </Typography>
                                        </Breadcrumbs>
                                        <div className="courseHeader">
                                            <h1 className="overskriftKurs2">{mod.navn}</h1>
                                            <div className="kursinfo-tekst">
                                                <p>{mod.modulkode}</p>
                                                <div className="iconBox">
                                                    <PlaceIcon className="language-icon2" fontSize="inherit"/>
                                                    <p className="undervisningsspråk">{mod.campus}</p>
                                                </div>
                                                <div className="iconBox">
                                                    <AccountBalanceIcon className="language-icon2" fontSize="inherit"/>
                                                    <p>{mod.studietype}</p>
                                                </div>
                                                <div className="iconBox">
                                                    <SchoolIcon className="language-icon2" fontSize="inherit"/>
                                                    <p>{mod.studiepoeng}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="courseBody">
                                            <h2>Sammendrag</h2>
                                            <p>{mod.beskrivelse}</p>
                                        </div>
                                        <div>
                                            {/* Del for ACCORDION, mapper kursmodul sin kursdata */}
                                                <Accordion square expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                                                    <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ExpandMoreIcon />}>
                                                        <Typography className={classes.heading}>Se kurstilhørighet</Typography>
                                                    </AccordionSummary>
                                                        <AccordionDetails >
                                                            {courseMods.map((cod, index) => {
                                                                return (
                                                                    <Link key={index} underline='none' href={`/course/emnekode=${cod.emnekode}`}> 
                                                                        <div className="accordElementWrap"><h3 className="border">{cod.navn}</h3></div>
                                                                    </Link>
                                                                );
                                                            })}
                                                            
                                                        </AccordionDetails>
                                                </Accordion>
                                        </div>
                                        <div className="buttonWrapM">
                                            <Button className="courseButton" variant="outlined" color="primary" href={mod.lenke}>Gå til modulens hjemmeside</Button>
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
};

export default ModuleDetail;
import { useState, useEffect, createRef} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';

// Material UI komponenter 
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import {makeStyles} from '@material-ui/core/styles';

import HomeIcon from '@material-ui/icons/Home';
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


const ModuleDetail = (props) => {
    useEffect(() => {
        fetchData();
        fetchPost();
    },[]);

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

    const classes = useStyles();
    const [expanded, setExpanded] = useState('');
    const wrapper = createRef();

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    let { modulkode } = useParams();
    const [modules, setModules] = useState([]);
    const [courseMods, setCoursemods] = useState([])

    const fetchData = async () => {
                    
        const res = await axios.get(process.env.REACT_APP_APIURL + "/course/module");
        console.log(res.data);
        setModules(res.data);
    };

    const fetchPost = async () => {

        const data = {modulkode: modulkode}; 
        const res = await axios.post(process.env.REACT_APP_APIURL + "/course/module", data);
        console.log(res.data);
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
                {modules.map(mod => { if(modulkode === mod.modulkode)           
                        return <Box key={mod.modulkode} ref={wrapper} className="box-detail" boxShadow={3}>
                                    <MyCardContent>
                                        <Breadcrumbs aria-label="breadcrumb" >
                                            <Link color="inherit" href="/" className={classes.link}>
                                                <HomeIcon className={classes.icon} />
                                                Oversikt
                                            </Link>
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
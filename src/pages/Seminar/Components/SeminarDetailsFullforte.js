import { useState, useEffect, useContext, Component} from 'react';
import {useLocation, useParams} from 'react-router-dom';

import axios from 'axios';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import '../CSS/Seminar.css';
import EventIcon from '@material-ui/icons/Event';
import moment from 'moment';
import 'moment/locale/nb';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';

const SeminarDetailsFullforte = () => {

    useEffect(() => {
        fetchData();
    },[]);

    let { seminarid } = useParams();
    const [seminars, setSeminars] = useState([]);

    const fetchData = async () => {
                    
        const res = await axios.get(process.env.REACT_APP_APIURL + "/seminar/getAllSeminarFullfortData");
        console.log(res.data);
        setSeminars(res.data);

    };
        return(
            <div className="SeminarDetails">
            {seminars.map(seminar => { if(seminarid == seminar.seminarid)           
                return ( 
                    <div className="SeminarDetails-Content">
                        <div className="SeminarDetails-Header">
                            <div className="SeminarDetailsHeading">
                                <div className="SeminarDetails-Navn">
                                    <h1 className="SeminarDetailsNavn">{seminar.navn}</h1>
                                </div>
                                <div className="SeminarDetails-Buttons">
                                    <Button className="SeminarDetailsButtonSlett" size="small" variant="outlined" disabled>
                                    Fullført
                                    </Button>
                                    <Button className="SeminarDetailsButtonSlett" size="small" variant="outlined" color="secondary" startIcon={<DeleteIcon />}>
                                    Slett
                                    </Button>
                                </div>
                            </div>

                            
                            <div className="SeminarDetails-Date">
                                <EventIcon className="SeminarDetails-DateIcon"/> 
                                <div className="SeminarDetails-OppstartVarighet">
                                    <p className="SeminarDetails-Oppstart">{moment.locale('nb'), moment(seminar.oppstart).format("MMM DD YYYY, hh:mm")} -</p>
                                    <p className="SeminarDetails-Varighet">{moment.locale('nb'), moment(seminar.varighet).format("MMM DD YYYY")}</p>    
                                </div>
                            </div>
                        </div>
                        <Box className="SeminarDetails-Box" boxShadow={1}>    
                            <div className="SeminarDetails-Image">
                                <img src={"/uploaded/" + seminar.plassering} alt="Seminar Image" className="SeminarDetails-img" imgstart=""  />
                            </div>
                            <div className="SeminarDetails-Information">
                                <h2 className="SeminarDetails-ArrangorHeading">Arrangør</h2>
                                    <p className="SeminarDetails-Arrangor">{seminar.arrangor}</p>
                                <h2 className="SeminarDetails-AdresseHeading">Adresse</h2>
                                    <p className="SeminarDetails-Adresse">{seminar.adresse}</p>
                                <h2 className="SeminarDetails-BeskrivelseHeading">Beskrivelse</h2>
                                    <p className="SeminarDetails-Beskrivelse">{seminar.beskrivelse}</p>
                            </div>                                  
                        </Box>   
                    </div>

                )
            })}
            </div>
        );

};

export default SeminarDetailsFullforte;
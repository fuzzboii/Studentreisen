// React spesifikt
import React, {useState, useEffect} from "react";
import {useSelector, useDispatch} from 'react-redux';
// 3rd-party Packages
import {Tabs, Tab, Typography} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
// Studentreisen-assets og komponenter
import {tabSeminar} from '../../../global/Services/Actions';
import SeminarListUpcoming from './SeminarListUpcoming';
import SeminarListExpired from './SeminarListExpired';
import CookieService from '../../../global/Services/CookieService';
import Loader from '../../../global/Components/Loader';
import NoAccess from '../../../global/Components/NoAccess';


function TabPanel(props) {
  const { children, value, index } = props;

  return (
    <div>
      {value === index && (
        <div>{children}</div>
      )}
    </div>
  );
}

const SeminarNav = (props) => {
  useEffect(()=>{
    fetchData();

  },[]);

  // State for loading mens vi venter på svar fra server
  const [loading, setLoading] = useState(true);
  // Autentiseringsstatus
  const [auth, setAuth] = useState(false);

  // Deklarerer storeHook for å hente data for position og henter den
  const dispatch = useDispatch();
  const getSeminarPosition = useSelector(state => state.seminar_tab_position);
  const [position, setPosition] = useState(getSeminarPosition);


  const [seminarsUpcoming, setSeminarsUpcoming] = useState([]);
  const [seminarsExpired, setSeminarsExpired] = useState([]);

  const [enlists, setEnlists] = useState([]);
  
  
  const fetchData = () => {
    const token = CookieService.get("authtoken");
      
      const data = {
        token: token
      } 
      
    axios.all([
      axios.get(process.env.REACT_APP_APIURL + "/seminar/getAllSeminarUpcomingData"),
      axios.get(process.env.REACT_APP_APIURL + "/seminar/getAllSeminarExpiredData"),
      axios.post(process.env.REACT_APP_APIURL + "/seminar/getEnlistedSeminars", data),

    ]).then(axios.spread((res1, res2, res3) => {
      setSeminarsUpcoming(res1.data);
      setSeminarsExpired(res2.data);
      setEnlists(res3.data);
      // Data er ferdig hentet fra server
      setLoading(false);
    }));
  };


    const [currentPageUpcoming, setCurrentPageUpcoming] = useState(1);
    const [postsPerPageUpcoming, setPostsPerPageUpcoming] = useState(6);

    const [currentPageExpired, setCurrentPageExpired] = useState(1);
    const [postsPerPageExpired, setPostsPerPageExpired] = useState(6);
    
    //Få nåværende poster
    const indexOfLastPostUpcoming = currentPageUpcoming * postsPerPageUpcoming;
    const indexOfFirstPostUpcoming = indexOfLastPostUpcoming - postsPerPageUpcoming;
    const currentPostsUpcoming = seminarsUpcoming.slice(indexOfFirstPostUpcoming, indexOfLastPostUpcoming);
    const numberOfPagesUpcoming = Math.ceil(seminarsUpcoming.length / postsPerPageUpcoming);
    const intervalUpcoming =  indexOfFirstPostUpcoming + currentPostsUpcoming.length;

    const indexOfLastPostExpired = currentPageExpired * postsPerPageExpired;
    const indexOfFirstPostExpired = indexOfLastPostExpired - postsPerPageExpired;
    const currentPostsExpired = seminarsExpired.slice(indexOfFirstPostExpired, indexOfLastPostExpired);
    const numberOfPagesExpired = Math.ceil(seminarsExpired.length / postsPerPageExpired);
    const intervalExpired =  indexOfFirstPostExpired + currentPostsExpired.length;
      
    const handleChange = (event, newValue) => {
      setPosition(newValue);
      if(newValue === 1) {
        dispatch(tabSeminar(newValue));
      };
      if(newValue === 0) {
        dispatch(tabSeminar(newValue));
      }; 
    }

    const handlePageUpcoming = (event, value) => {
      setCurrentPageUpcoming(value);
    };

    const handlePageExpired = (event, value) => {
      setCurrentPageExpired(value);
    };
  
    if (loading) {
    return (
        <section id="loading">
            <Loader />
        </section>
    )
  }

  if (!loading) {    
    return (
      <div className="Seminar-Overview">
        <div className="BorderBox">   
          <Tabs value={position} indicatorColor="primary" textColor="primary" onChange={handleChange} centered>
              <Tab className="" label="Kommende" />
              <Tab className="" label="Utgåtte" />
          </Tabs>
        </div>
        <div className="Seminar-HeadingTools">
          
          {(props.type === 2 || props.type === 4) &&
          <div className="Seminar-HeadingToolsWrapper">
            <div className="Seminar-HeadingToolsDesktop">
              <Button className="Seminar-ButtonNewDesktop" href="/seminar/ny" variant="contained" color="primary">Nytt seminar<AddIcon/></Button>
            </div>     
            <div className="Seminar-HeadingToolsMobile">
              <Button className="Seminar-ButtonNewMobile" href="/seminar/ny" variant="contained" color="primary"><AddIcon/></Button>
            </div>
                    
          </div>
          
          }
        </div>
        <TabPanel value={position} index={0}>
            <div className="Seminar-ContentOverview">
              <SeminarListUpcoming seminarsUpcoming={currentPostsUpcoming} enlists={enlists} innloggetbruker={props.brukerid} />
            </div>
              <div className="Seminar-indexPosition">
                <div className="Seminar-indexPagination">
                  <div className="Seminar-indexRes2">
                    <Typography  variant="caption" >Viser {indexOfFirstPostUpcoming + 1} - {intervalUpcoming} av {seminarsUpcoming.length} treff</Typography>
                  </div>
                  <Pagination count={numberOfPagesUpcoming} page={currentPageUpcoming} onChange={handlePageUpcoming} />
                </div>
              </div>  
        </TabPanel>

        <TabPanel value={position} index={1}>
            <div className="Seminar-ContentOverview">
              <SeminarListExpired seminarsExpired={currentPostsExpired}/>
            </div>
              <div className="Seminar-indexPosition">
                <div className="Seminar-indexPagination">
                  <div className="Seminar-indexRes2">
                    <Typography  variant="caption" >Viser {indexOfFirstPostExpired + 1} - {intervalExpired} av {seminarsExpired.length} treff</Typography>
                  </div>
                  <Pagination count={numberOfPagesExpired} page={currentPageExpired} onChange={handlePageExpired} />
                </div>
              </div>    
        </TabPanel>
      </div>
    );
  
  } else {
    return (
        // Brukeren er ikke innlogget, omdiriger
        <NoAccess />
    );
  }
};


export default SeminarNav;
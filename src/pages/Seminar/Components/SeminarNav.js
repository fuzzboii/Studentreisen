// React spesifikt
import React, {useState, useContext} from "react";
// 3rd-party Packages
import {Tabs, Tab, Typography} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
// Studentreisen-assets og komponenter
import SeminarListUpcoming from './SeminarListUpcoming';
import SeminarListExpired from './SeminarListExpired';
import { SeminarUpcomingContext } from './SeminarContext';
import { SeminarExpiredContext } from './SeminarContext';

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

const SeminarNav = () => {

    const [position, setPosition] = useState(0);

    // States for pagination
    const [seminarsUpcoming, setSeminarsUpcoming] = useContext(SeminarUpcomingContext);
    const [currentPageUpcoming, setCurrentPageUpcoming] = useState(1);
    const [postsPerPageUpcoming, setPostsPerPageUpcoming] = useState(6);

    const [seminarsExpired, setSeminarsExpired] = useContext(SeminarExpiredContext);
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
    }

    const handlePage = (event, value) => {
      setCurrentPageUpcoming(value);
      setCurrentPageExpired(value);
    };

    return (
      <div className="Seminar-Overview">  
          <Tabs value={position} indicatorColor="primary" textColor="primary" onChange={handleChange} centered>
              <Tab className="" label="Upcoming" />
              <Tab className="" label="Utgåtte" />
          </Tabs>


        <TabPanel value={position} index={0}>
            <div className="Seminar-ContentOverview">
              <SeminarListUpcoming seminarsUpcoming={currentPostsUpcoming}/>
            </div>
              <div className="Seminar-indexPosition">
                <div className="Seminar-indexPagination">
                  <div className="Seminar-indexRes2">
                    <Typography  variant="caption" >Viser {indexOfFirstPostUpcoming + 1} - {intervalUpcoming} av {seminarsUpcoming.length} treff</Typography>
                  </div>
                  <Pagination count={numberOfPagesUpcoming} page={currentPageUpcoming} onChange={handlePage} />
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
                  <Pagination count={numberOfPagesExpired} page={currentPageExpired} onChange={handlePage} />
                </div>
              </div>    
        </TabPanel>
      </div>
    );
};


export default SeminarNav;
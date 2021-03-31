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
    const [seminarsKommende, setSeminarsKommende] = useContext(SeminarUpcomingContext);
    const [currentPageKommende, setCurrentPageKommende] = useState(1);
    const [postsPerPageKommende, setPostsPerPageKommende] = useState(6);

    const [seminarsFullfort, setSeminarsFullfort] = useContext(SeminarExpiredContext);
    const [currentPageFullfort, setCurrentPageFullfort] = useState(1);
    const [postsPerPageFullfort, setPostsPerPageFullfort] = useState(6);
    
    //Få nåværende poster
    const indexOfLastPostKommende = currentPageKommende * postsPerPageKommende;
    const indexOfFirstPostKommende = indexOfLastPostKommende - postsPerPageKommende;
    const currentPostsKommende = seminarsKommende.slice(indexOfFirstPostKommende, indexOfLastPostKommende);
    const numberOfPagesKommende = Math.ceil(seminarsKommende.length / postsPerPageKommende);
    const intervalKommende =  indexOfFirstPostKommende + currentPostsKommende.length;

    const indexOfLastPostFullfort = currentPageFullfort * postsPerPageFullfort;
    const indexOfFirstPostFullfort = indexOfLastPostFullfort - postsPerPageFullfort;
    const currentPostsFullfort = seminarsFullfort.slice(indexOfFirstPostFullfort, indexOfLastPostFullfort);
    const numberOfPagesFullfort = Math.ceil(seminarsFullfort.length / postsPerPageFullfort);
    const intervalFullfort =  indexOfFirstPostFullfort + currentPostsFullfort.length;
      
    const handleChange = (event, newValue) => {
        setPosition(newValue);
    }

    const handlePage = (event, value) => {
      setCurrentPageKommende(value);
      setCurrentPageFullfort(value);
    };

    return (
      <div className="Seminar-Overview">  
          <Tabs value={position} indicatorColor="primary" textColor="primary" onChange={handleChange} centered>
              <Tab className="" label="Kommende" />
              <Tab className="" label="Utgåtte" />
          </Tabs>


        <TabPanel value={position} index={0}>
            <div className="Seminar-ContentOverview">
              <SeminarListUpcoming seminarsKommende={currentPostsKommende}/>
            </div>
              <div className="Seminar-indexPosition">
                <div className="Seminar-indexPagination">
                  <div className="Seminar-indexRes2">
                    <Typography  variant="caption" >Viser {indexOfFirstPostKommende + 1} - {intervalKommende} av {seminarsKommende.length} treff</Typography>
                  </div>
                  <Pagination count={numberOfPagesKommende} page={currentPageKommende} onChange={handlePage} />
                </div>
              </div>  
        </TabPanel>

        <TabPanel value={position} index={1}>
            <div className="Seminar-ContentOverview">
              <SeminarListExpired seminarsFullfort={currentPostsFullfort}/>
            </div>
              <div className="Seminar-indexPosition">
                <div className="Seminar-indexPagination">
                  <div className="Seminar-indexRes2">
                    <Typography  variant="caption" >Viser {indexOfFirstPostFullfort + 1} - {intervalFullfort} av {seminarsFullfort.length} treff</Typography>
                  </div>
                  <Pagination count={numberOfPagesFullfort} page={currentPageFullfort} onChange={handlePage} />
                </div>
              </div>    
        </TabPanel>
      </div>
    );
};


export default SeminarNav;
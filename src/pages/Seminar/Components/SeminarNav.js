// React spesifikt
import React, {useState} from "react";
// 3rd-party Packages
import {Tabs, Tab} from '@material-ui/core';
// Studentreisen-assets og komponenter
import SeminarListKommende from './SeminarListKommende';
import SeminarListFullforte from './SeminarListFullforte';

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
      
    const handleChange = (event, newValue) => {
        setPosition(newValue);
    }

    return (
        <div className="boxlink">     
            <Tabs value={position} indicatorColor="primary" textColor="primary" onChange={handleChange} centered>
                <Tab className="" label="Kommende" />
                <Tab className="" label="Fullførte" />
            </Tabs>   
            <TabPanel value={position} index={0}>
                <SeminarListKommende/>
            </TabPanel>
            <TabPanel value={position} index={1}>
                <SeminarListFullforte/>
            </TabPanel>   
        </div>

    );
};


export default SeminarNav;
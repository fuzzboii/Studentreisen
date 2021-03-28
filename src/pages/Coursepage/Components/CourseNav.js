import React, {useState} from "react";
import CourseList from './CourseList';
import ModuleList from './ModuleList';
import {AppBar, Tabs, Tab, Typography, Box} from '@material-ui/core';


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

const CourseNav = () => {

    const [position, setPosition] = useState(0);
      
    const handleChange = (event, newValue) => {
        setPosition(newValue);
    }

    return (
        <div>  
            <div className="BorderBox"> 
              <Tabs className="tab" value={position} indicatorColor="primary" textColor="primary" onChange={handleChange} >
                  <Tab className="tabKurs" label="Kurs" />
                  <Tab className="tabKursmodul" label="Kursmodul" />
              </Tabs>   
            </div>  
            <TabPanel value={position} index={0}>
              <div className="content-overview">
                <CourseList/>
              </div>
            </TabPanel>
            
            <TabPanel value={position} index={1}>
              <div>
                <ModuleList/>
              </div>
            </TabPanel>   
        </div>

    );
};


export default CourseNav;
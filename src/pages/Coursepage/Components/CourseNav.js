import React, {useState} from "react";
import CourseList from './CourseList';

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
        <div className="boxlink">     
            <Tabs value={position} indicatorColor="primary" textColor="primary" onChange={handleChange}>
                <Tab className="" label="Kurs" />
                <Tab className="" label="Kursmodul" />
            </Tabs>   
            <TabPanel value={position} index={0}>
                <CourseList/>
            </TabPanel>
            <TabPanel value={position} index={1}>
                Item Two
            </TabPanel>   
        </div>

    );
};


export default CourseNav;
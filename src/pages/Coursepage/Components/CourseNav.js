import React, {useState} from "react";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';

const CourseNav = () => {

    const [value, setValue] = useState(0);
      
    const handleChange = (event, newValue) => {
        setValue(newValue);
    }

    return (
        <div className="boxlink">     
            <Tabs value={value} indicatorColor="primary" textColor="primary" onChange={handleChange} aria-label="simple tabs example">
                <Tab className="Tab" label="Kurs" />
                <Tab className="Tab" label="Kursmodul" />
            </Tabs>             
        </div>

    );
};


export default CourseNav;
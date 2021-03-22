import axios from 'axios';
import React, {useState, createContext, useEffect} from 'react';

export const CourseContext = createContext();

export const CourseProvider = props => {
    useEffect(() => {
        fetchData();
    },[]);

    const [courses, setCourses] = useState([]);

    const fetchData = async () => {
            
        //const apiURL = "http://localhost:5000/api/v1/course/";
        
        const res = await axios.get(process.env.REACT_APP_APIURL + "/course/");
        console.log(res.data);
        setCourses(res.data);

    };

    return (
        <CourseContext.Provider value={[courses, setCourses]}>
            {props.children}
        </CourseContext.Provider>

    );
}
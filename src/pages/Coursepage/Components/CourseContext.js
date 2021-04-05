import axios from 'axios';
import React, {useState, createContext, useEffect} from 'react';

export const CourseContext = createContext();
export const ModuleContext = createContext();

export const CourseProvider = props => {
    useEffect(() => {
        fetchData();
    },[]);

    const [courses, setCourses] = useState([]);

    const fetchData = async () => {

        const res = await axios.get(process.env.REACT_APP_APIURL + "/course/");
        setCourses(res.data);

    };

    return (
        <CourseContext.Provider value={[courses, setCourses]}>
            {props.children}
        </CourseContext.Provider>

    );
}

export const ModuleProvider = props => {
    useEffect(() => {
        fetchData();
    },[]);

    const [modules, setModules] = useState([]);

    const fetchData = async () => {
                    
        const res = await axios.get(process.env.REACT_APP_APIURL + "/course/module");
        console.log(res.data);
        setModules(res.data);

    };

    return (
        <ModuleContext.Provider value={[modules, setModules]}>
            {props.children}
        </ModuleContext.Provider>

    );
}
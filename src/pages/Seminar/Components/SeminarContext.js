// React spesifikt
import React, {useState, createContext, useEffect} from 'react';
// 3rd-party Packages
import axios from 'axios';

// Studentreisen-assets og komponenter



export const SeminarUpcomingContext = createContext();



export const SeminarProvider = props => {
    const [seminars, setSeminars] = useState([]);

    
    useEffect(() => {
        fetchData();

    },[]);


    const fetchData = async () => {
            
        //const apiURL = "http://localhost:5000/api/v1/seminar/getAllSeminarUpcomingData";
        

        const res = await axios.get(process.env.REACT_APP_APIURL + "/seminar/getAllSeminarUpcomingData");
        console.log(res.data);
        setSeminars(res.data);

    };
  

    return (
        <SeminarUpcomingContext.Provider value={[seminars, setSeminars]}>
            {props.children}
        </SeminarUpcomingContext.Provider>

    );
}


export const SeminarExpiredContext = createContext();

export const SeminarExpiredProvider = props => {
    useEffect(() => {
        fetchData();
    },[]);

    const [seminars, setSeminars] = useState([]);

    const fetchData = async () => {
            
        //const apiURL = "http://localhost:5000/api/v1/seminar/getAllFullfortSeminarData";
        
        const res = await axios.get(process.env.REACT_APP_APIURL + "/seminar/getAllSeminarExpiredData");
        console.log(res.data);
        setSeminars(res.data);

    };

    return (
        <SeminarExpiredContext.Provider value={[seminars, setSeminars]}>
            {props.children}
        </SeminarExpiredContext.Provider>

    );
}

// React spesifikt
import React, {useState, createContext, useEffect} from 'react';
// 3rd-party Packages
import axios from 'axios';

// Studentreisen-assets og komponenter



export const SeminarKommendeContext = createContext();



export const SeminarProvider = props => {
    const [seminars, setSeminars] = useState([]);

    
    useEffect(() => {
        fetchData();

    },[]);


    const fetchData = async () => {
            
        //const apiURL = "http://localhost:5000/api/v1/seminar/getAllSeminarData";
        

        const res = await axios.get(process.env.REACT_APP_APIURL + "/seminar/getAllSeminarData");
        console.log(res.data);
        setSeminars(res.data);

    };
  

    return (
        <SeminarKommendeContext.Provider value={[seminars, setSeminars]}>
            {props.children}
        </SeminarKommendeContext.Provider>

    );
}


export const SeminarFullfortContext = createContext();

export const SeminarFullfortProvider = props => {
    useEffect(() => {
        fetchData();
    },[]);

    const [seminars, setSeminars] = useState([]);

    const fetchData = async () => {
            
        //const apiURL = "http://localhost:5000/api/v1/seminar/getAllFullfortSeminarData";
        
        const res = await axios.get(process.env.REACT_APP_APIURL + "/seminar/getAllSeminarFullfortData");
        console.log(res.data);
        setSeminars(res.data);

    };

    return (
        <SeminarFullfortContext.Provider value={[seminars, setSeminars]}>
            {props.children}
        </SeminarFullfortContext.Provider>

    );
}

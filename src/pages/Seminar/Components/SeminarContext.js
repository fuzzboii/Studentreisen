import axios from 'axios';
import React, {useState, createContext, useEffect} from 'react';

export const SeminarContext = createContext();

export const SeminarProvider = props => {
    useEffect(() => {
        fetchData();
    },[]);

    const [seminars, setSeminars] = useState([]);

    const fetchData = async () => {
            
        //const apiURL = "http://localhost:5000/api/v1/seminar/getAllSeminarData";
        
        const res = await axios.get(process.env.REACT_APP_APIURL + "/seminar/getAllSeminarData");
        console.log(res.data);
        setSeminars(res.data);

    };

    return (
        <SeminarContext.Provider value={[seminars, setSeminars]}>
            {props.children}
        </SeminarContext.Provider>

    );
}
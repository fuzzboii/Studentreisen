import axios from 'axios';
import React, {useState, createContext, useEffect} from 'react';

export const SeminarContext = createContext();



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
        <SeminarContext.Provider value={[seminars, setSeminars]}>
            {props.children}
        </SeminarContext.Provider>

    );
}


export const SeminarFullfortContext = createContext();

export const SeminarFullfortProvider = props => {
    useEffect(() => {
        fetchData();
    },[]);

    const [seminars, setSeminars] = useState([]);

    const fetchData = async () => {
            
        //const apiURL = "http://localhost:5000/api/v1/seminar/getAllSeminarData";
        
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

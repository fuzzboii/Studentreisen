import React, {useState, createContext, useEffect} from 'react';
import CookieService from '../../../global/Services/CookieService';
import axios from 'axios';


export const EnlistedContext = createContext();

export const EnlistedProvider = props => {

    useEffect(() => {
        fetchData();
    },[]);
    
    const [enlists, setEnlists] = useState([]);

    const fetchData = async () => {
        const token = CookieService.get("authtoken");
        
        const data = {
            token: token
        }
        
        const res = await axios.post(process.env.REACT_APP_APIURL + "/seminar/getEnlistedSeminars", data );
        setEnlists(res.data);
    };

    return (
        <EnlistedContext.Provider value={[enlists, setEnlists]}>
            {props.children}
        </EnlistedContext.Provider>

    );
}
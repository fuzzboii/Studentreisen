// React spesifikt
import React, {useState, createContext, useEffect} from 'react';

// Studentreisen-assets og komponenter
import CookieService from '../../../global/Services/CookieService';

// 3rd-party Packages
import axios from 'axios';


// Deklarerer en context til videre bruk i provider
export const EnlistedContext = createContext();

// Deklarerer en provider til bruk i andre komponenter
export const EnlistedProvider = props => {

    useEffect(() => {
        fetchData();
    },[]);
    
    const [enlists, setEnlists] = useState([]);

    // Henter seminardata, og populerer useStaten med dette
    const fetchData = async () => {
        const token = CookieService.get("authtoken");
        
        const data = {
            token: token
        }
        
        const res = await axios.post(process.env.REACT_APP_APIURL + "/seminar/getEnlistedSeminars", data );
        setEnlists(res.data);
    };

    // Bruker useStaten til å overføre data'en til context'en og returnerer dette ved kall 
    return (
        <EnlistedContext.Provider value={[enlists, setEnlists]}>
            {props.children}
        </EnlistedContext.Provider>

    );
}
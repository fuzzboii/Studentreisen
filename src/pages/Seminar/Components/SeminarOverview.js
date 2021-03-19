// React-spesifikt
import React from "react";

// 3rd-party Packages


// Studentreisen-assets og komponenter
import axios from "axios";
import CookieService from '../../../global/Services/CookieService';

function GetAllData() {
    const token = {
        token: CookieService.get("authtoken")
    }
    // Axios POST request
    axios
        // Henter API URL fra .env og utfører en POST request med dataen fra objektet over
        // Axios serialiserer objektet til JSON selv
        .post(process.env.REACT_APP_APIURL + "/seminar/getAllSeminarData", token)
        // Utføres ved mottatt resultat
        .then(res => {
            if(res.data.results) {
                allData = res.data.results;
                allDataFetched = true;
            }
        }).catch(err => {

        }).finally(() => {

        });
}

let allData = GetAllData();
let allDataFetched = false;






export default SeminarOverview;
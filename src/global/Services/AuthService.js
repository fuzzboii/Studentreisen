
import axios from 'axios';

class AuthService {
    async isAuthenticated(token) {
        let returnVal = {authenticated : false, usertype : 1};
        await axios
            .post(process.env.REACT_APP_APIURL + "/verify/auth", {token})
            .then(res => {
                if(res.data.authenticated === true) {
                    // Bruker er autentisert
                    returnVal = {authenticated : true, usertype : res.data.usertype};
                }
            })
            .catch(err => {
                // En feil oppstod ved oppkobling til server
                return returnVal;
            }
        );

        return returnVal;
    }

    async isTokenVerified(token) {
        let returnVal = false;
        await axios
            .post(process.env.REACT_APP_APIURL + "/verify/token", {token})
            .then(res => {
                if(res.data.verified === "true") {
                    // Bruker er autentisert
                    returnVal = true;
                }
            })
            .catch(err => {
                // En feil oppstod ved oppkobling til server
                return false;
            }
        );

        return returnVal;
    }
}

export default new AuthService();
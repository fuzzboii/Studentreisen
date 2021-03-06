
import axios from 'axios';

class AuthService {
    async isAuthenticated(token) {
        let returnVal = false;
        await axios
            .post(process.env.REACT_APP_APIURL + "/user/verifyToken", {token})
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

        // Returner alltid false ved autentisering om problemer oppstår over
        //return false;
    }
}

export default new AuthService();
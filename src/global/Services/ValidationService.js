class ValidationService {
    validateUser(user) {
        if(user.fnavn !== undefined && user.enavn !== undefined && user.niva !== undefined && user.email !== undefined) {
            if(user.niva === "1" || user.niva === "2" || user.niva === "3" || user.niva === "4") {
                if(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(user.email)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }

    }
}

export default new ValidationService();
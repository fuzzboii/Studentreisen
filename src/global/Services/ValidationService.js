class ValidationService {
    validateUser(user) {
        if(user.fnavn !== undefined && user.enavn !== undefined && user.niva !== undefined && user.email !== undefined) {
            if(user.niva === "1" || user.niva === 1 || user.niva === "2" || user.niva === 2 || user.niva === "3" || user.niva === 3 || user.niva === "4" || user.niva === 4) {
                if(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(user.email)) {
                    if(user.telefon !== undefined && user.telefon !== null && user.telefon !== "") {
                        if(/^((0047)?|(\+47)?)\d{8}$/.test(user.telefon)) {
                            return {success : true};
                        } else {
                            return {success : false, message : "Telefonnummeret er ugyldig"};
                        }
                    } else {
                        return {success : true};
                    }
                } else {
                    return {success : false, message : "E-postadressen er ugyldig"};
                }
            } else {
                return {success : false, message : "Brukertypen er ugyldig"};
            }
        } else {
            return {success : false, message : "Ett av de nødvendige feltene (Fornavn, etternavn, brukertype, e-post) er ikke oppgitt"};
        }

    }
}

export default new ValidationService();
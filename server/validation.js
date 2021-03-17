// Validering
const Joi = require('joi');
const JoiPwd = require('joi-password-complexity');

// Register validering
const registerValidation = (data) => {
    const validation_schema = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2 }).required(),
        fnavn: Joi.string().required().min(1).max(25),
        enavn: Joi.string().required().min(1).max(50),
        password: Joi.required(),
        password2: Joi.required()
    });

    // Validerer dataen i forhold til skjemaet og returnerer svaret
    return validation_schema.validate(data);
}

const passwordValidation = (data) => {
    const validation_schema = Joi.object({
        password: Joi.string().required(),
        password2: Joi.string().required()
    });

    // Validerer dataen i forhold til skjemaet
    var validation = validation_schema.validate(data);

    if(validation.error) {
        // Hvis ett av feltene ikke er tilstede eller er av feil type
        return validation;
    }

    const passComplexity = {
        min: 8,
        max: 250,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 0,
        requirementCount: 3,
    };

    // Validerer dataen i forhold til skjemaet og returnerer svaret
    return JoiPwd(passComplexity, "Password").validate(data.password);
}

// Login validering
const loginValidation = (data) => {
    const validation_schema = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2 }).required(),
        pwd: Joi.string().required(),
        remember: Joi.boolean().required()
    });

    // Validerer dataen i forhold til skjemaet og returnerer svaret
    return validation_schema.validate(data);
}

// E-post validering 
const emailValidation = (data) => {
    const validation_schema = Joi.object({
        epost: Joi.string().email({ minDomainSegments: 2 }).required()
    });

    // Validerer dataen i forhold til skjemaet og returnerer svaret
    return validation_schema.validate(data);
}

// Hex validering
const hexValidation = (data) => {
    const validation_schema = Joi.object({
        token: Joi.string().length(40).hex()
    });

    // Validerer dataen i forhold til skjemaet og returnerer svaret
    return validation_schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.passwordValidation = passwordValidation;
module.exports.loginValidation = loginValidation;
module.exports.emailValidation = emailValidation;
module.exports.hexValidation = hexValidation;
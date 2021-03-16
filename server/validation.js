// Validering
const Joi = require('joi');

// Register validation
const registerValidation = (data) => {
    const validation_schema = Joi.object({
        status: Joi.number().required(),
        fnavn: Joi.string().alphanum().required(),
        enavn: Joi.string().alphanum().required(),
        telefon: Joi.string().alphanum().required(),
        email: Joi.string().email({ minDomainSegments: 2 }).required(),
        pwd: Joi.string().required()
    });

    // Data validation before we continue creating the user
    return validation_schema.validate(data);
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

// Password validering
const pwValidation = (data) => {
    const validation_schema = Joi.object({
        password: Joi.string().required(),
        password2: Joi.string().required()
    });

    // Validerer dataen i forhold til skjemaet og returnerer svaret
    return validation_schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.emailValidation = emailValidation;
module.exports.hexValidation = hexValidation;
module.exports.pwValidation = pwValidation;
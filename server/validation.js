// Validation
const Joi = require('joi');

// Register validation
const registerValidation = (data) => {
    const validation_schema = Joi.object({
        personnr: Joi.string().alphanum().min(11).max(11).required(),
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

// Login validation
const loginValidation = (data) => {
    const validation_schema = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2 }).required(),
        pwd: Joi.string().required()
    });

    // Data validation before we allow the user to login
    return validation_schema.validate(data);
}

// Email validation 
const emailValidation = (data) => {
    const validation_schema = Joi.object({
        epost: Joi.string().email({ minDomainSegments: 2 }).required()
    });

    // Return the result of the validation
    return validation_schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.emailValidation = emailValidation;
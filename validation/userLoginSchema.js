const Joi = require('joi');

const userLoginSchema = Joi.object({

    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'برجاء إدخال الايميل صالح',
            'any.required': 'حقل الايميل إجباري'
        }),
    password: Joi.string()
        .required()
        .messages({
            'any.required': 'حقل الباسورد إجباري'
        })
});

module.exports = userLoginSchema;
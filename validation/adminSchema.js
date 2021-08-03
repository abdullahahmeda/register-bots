const Joi = require('joi');

const userLoginSchema = Joi.object({

    name: Joi.string()
        .required()
        .messages({
            'any.required': 'حقل الاسم إجباري'
        }),

    telegramId: Joi.string()
        .required()
        .pattern(/^[0-9]+$/),
        
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'الرجاء إدخال إيميل صالح',
            'any.required': 'حقل الايميل إجباري'
        }),

    password: Joi.string()
        .required()
        .messages({
            'any.required': 'حقل الباسورد إجباري'
        }),
    
    password_confirmation: Joi.ref('password')
});

module.exports = userLoginSchema;
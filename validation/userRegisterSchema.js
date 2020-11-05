const Joi = require('joi');

const userRegisterSchema = Joi.object({
    accept_tos: Joi.boolean()
        .truthy('on'),
    name: Joi.string()
        .min(3)
        .required()
        .messages({
            'string.min': 'الاسم يجب أن يكون 3 حروف على الأقل',
            'any.required': 'حقل الاسم إجباري'
        }),
    birth: Joi.date()
        .required()
        .messages({
            'any.required': 'حقل تاريخ الميلاد إجباري'
        }),

    country: Joi.string()
        .required(),

    city: Joi.string()
        .required(),

    speciality: Joi.string()    
        .required()
        .messages({
            'any.required': 'حقل التخصص إجباري'
        }),

    telegramId: Joi.string()
        .required()
        .pattern(/^[0-9]+$/),

    phone: Joi.string()
        .required()
        .pattern(/^([0-9]+){9,12}$/)
        .messages({
            'string.pattern.base': 'برجاء إدخال رقم هاتف صالح',
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'برجاء إدخال الايميل صالح',
            'any.required': 'حقل الايميل إجباري'
        })
});

module.exports = userRegisterSchema;
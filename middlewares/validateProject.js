const Joi = require('joi')

exports.validateProject = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().max(255).required(),
        description: Joi.string().required(),
    });
    const { error } = schema.validate(req.body)
    if (error) return res.status(400).json({ message: error.details[0].message })
    next()
}

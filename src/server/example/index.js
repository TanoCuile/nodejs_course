const Joi = require('joi');

class UnauthorizedError extends Error {
  constructor(message, status) {
    super(message, status);
    this.message = message;
    this.status = status;
    delete this.stack;
  }
}

function validatePostContact(req, res, next) {
  try {
    const ContactTemple = Joi.object({
      name: Joi.string().min(3).required(),
      email: Joi.string()
        .min(3)
        .email({minDomainSegments: 2, tlds: {allow: ['com', 'net', 'pw']}}) // валидация мыла
        .required(),
      subscription: Joi.string().min(3),
      password: Joi.string().min(3),
      token: Joi.string(),
    });

    const validated = ContactTemple.validate(req.body);

    if (validated.error) {
      throw new UnauthorizedError(
        `missing {'${validated.error.details[0].context.label}': ''} is required name field `,
        404
      );
    }

    next();
  } catch (error) {
    next(error);
  }
}
module.exports = {validatePostContact, UnauthorizedError};

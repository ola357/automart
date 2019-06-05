import Joi from '@hapi/joi';


class Validate {
  static userSignup(user) {
    const schema = {
      email: Joi.string().email().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      password: Joi.string().alphanum().required(),
      address: Joi.string().alphanum().required(),
      is_admin: Joi.boolean(),
    };
    return Joi.validate(user, schema);
  }

  static userSignin(user) {
    const schema = {
      email: Joi.string().email().required(),
      password: Joi.string().alphanum().required(),
    };
    return Joi.validate(user, schema);
  }
}
export default Validate;

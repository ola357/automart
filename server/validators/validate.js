import Joi from '@hapi/joi';


class Validate {
  static userSignup(user) {
    const schema = {
      email: Joi.string().email().required(),
      firstname: Joi.string().required(),
      lastname: Joi.string().required(),
      password: Joi.string().alphanum().required(),
      address: Joi.string().alphanum().required(),
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

  static createCarAd(car) {
    const schema = {
      owner: Joi.number().required(),
      state: Joi.string().required(),
      status: Joi.string().required(),
      price: Joi.number().required(),
      manufacturer: Joi.string().required(),
      model: Joi.string().required(),
      body: Joi.string().required(),
    };
    return Joi.validate(car, schema);
  }

  static createPurchaseOrder(order) {
    const schema = {
      buyer: Joi.number().required(),
      carId: Joi.number().required(),
      amount: Joi.number().required(),
      status: Joi.string().required(),
    };
    return Joi.validate(order, schema);
  }

  static updateOrderPrice(order) {
    const schema = {
      amount: Joi.number().required(),
    };
    return Joi.validate(order, schema);
  }

  static updateCarAdPrice(car) {
    const schema = {
      price: Joi.number().required(),
    };
    return Joi.validate(car, schema);
  }
}
export default Validate;

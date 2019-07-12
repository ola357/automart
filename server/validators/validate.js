// import Joi from '@hapi/joi';
import Joi from 'joi';


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
      state: Joi.string().required(),
      status: Joi.string().required(),
      price: Joi.number().required(),
      manufacturer: Joi.string().required(),
      model: Joi.string().required(),
      bodytype: Joi.string().required(),
    };
    return Joi.validate(car, schema);
  }

  static createPurchaseOrder(order) {
    const schema = {
      carid: Joi.number().integer().required(),
      amount: Joi.number().required(),
    };
    return Joi.validate(order, schema);
  }

  static updateOrderPrice(order) {
    const schema = {
      amount: Joi.number().required(),
    };
    return Joi.validate(order, schema);
  }

  static updateCarAdStatus(car) {
    const exp = /^(sold|available)$/;
    const name = "car ad's status";
    const schema = {
      status: Joi.string().regex(exp, { name }).required(),
    };
    return Joi.validate(car, schema);
  }

  static updateCarAdPrice(car) {
    const schema = {
      price: Joi.number().required(),
    };
    return Joi.validate(car, schema);
  }

  static flagCarAd(car) {
    const schema = {
      carid: Joi.number().required(),
      reason: Joi.string().required(),
      description: Joi.string().required(),
    };
    return Joi.validate(car, schema);
  }
}
export default Validate;

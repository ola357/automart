// import Joi from '@hapi/joi';
import Joi from 'joi';


class Validate {
  static userSignup(user) {
    const schema = {
      email: Joi.string(),
      first_name: Joi.string(),
      last_name: Joi.string(),
      password: Joi.string(),
      address: Joi.string(),
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
      token: Joi.string(),
      state: Joi.string().required(),
      status: Joi.string().required(),
      price: Joi.number().required(),
      manufacturer: Joi.string().required(),
      model: Joi.string().required(),
      body_type: Joi.string().required(),
    };
    return Joi.validate(car, schema);
  }

  static createPurchaseOrder(order) {
    const schema = {
      token: Joi.string(),
      car_id: Joi.number().integer().required(),
      amount: Joi.number().required(),
    };
    return Joi.validate(order, schema);
  }

  static updateOrderPrice(order) {
    const schema = {
      token: Joi.string(),
      amount: Joi.number().required(),
    };
    return Joi.validate(order, schema);
  }

  static updateCarAdStatus(car) {
    const exp = /^(sold|available)$/;
    const name = "car ad's status";
    const schema = {
      token: Joi.string(),
      status: Joi.string().regex(exp, { name }).required(),
    };
    return Joi.validate(car, schema);
  }

  static updateCarAdPrice(car) {
    const schema = {
      token: Joi.string(),
      price: Joi.number().required(),
    };
    return Joi.validate(car, schema);
  }

  static flagCarAd(car) {
    const schema = {
      token: Joi.string(),
      carid: Joi.number().required(),
      reason: Joi.string().required(),
      description: Joi.string().required(),
    };
    return Joi.validate(car, schema);
  }
}
export default Validate;

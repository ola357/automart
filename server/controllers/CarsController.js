import cars from '../models/cars';
import validate from '../validators/validate';
import Validateparams from '../validators/ValidateParams';
import Compare from '../util/Compare';
import dbConnection from '../models/dbConnection';

class CarsController {
  static async createCarAd(req, res) {
    const { error } = validate.createCarAd(req.body);
    if (error) return res.status(400).send({ status: 400, error: error.details[0].message });

    const {
      state, status, price, manufacturer, model, bodytype,
    } = req.body;
    const owner = req.user._id;
    const email = req.user._email;

    const car = await dbConnection.query(
      `INSERT INTO cars(
        owner, state, status, price, manufacturer, model, bodytype) 
         VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [owner, state, status, price, manufacturer, model, bodytype],
    );
    res.send({
      status: 200,
      data: {
        id: car.rows[0].id,
        email,
        createdon: car.rows[0].createdon,
        manufacturer: car.rows[0].manufacturer,
        model: car.rows[0].model,
        price: car.rows[0].price,
        state: car.rows[0].state,
        status: car.rows[0].status,
      },
    });
  }

  static async updateCarAdStatus(req, res) {
    /** ********************** */
    // validate request parameter
    try {
      Validateparams.evaluate(req.params.carId);
    } catch (error) {
      return res.status(404).send({
        status: 400,
        error: "Invalid request",
      });
    }

    // validate request body
    const { error } = validate.updateCarAdStatus(req.body);
    if (error) {
      return res.status(400).send({
        status: 400,
        error: error.details[0].message,
      });
    }

    const { status } = req.body;

    const car = await dbConnection.query(
      `UPDATE cars
      SET status = ($1)
      WHERE id = ($2)
      RETURNING *`,
      [status, req.params.carId],
    );

    // if car doesn't exist
    if ((car.rowCount === 0)) {
      return res.status(404).send({
        status: 404,
        error: "The car with the given ID was not found.",
      });
    }
    res.status(200).send({
      status: 200,
      data: {
        id: car.rows[0].id,
        email: req.user._email,
        createdOn: car.rows[0].createdon,
        manufacturer: car.rows[0].manufacturer,
        model: car.rows[0].model,
        price: car.rows[0].price,
        state: car.rows[0].state,
        status: car.rows[0].status,
      },
    });
  }

  static updateCarAdPrice(req, res) {
    const car = cars.find(c => c.id === parseInt(req.params.carId, 10));
    if (!car) {
      return res.status(404).send({
        status: 404,
        error: "The car with the given ID was not found.",
      });
    }

    const { error } = validate.updateCarAdPrice(req.body);
    if (error) return res.status(400).send({ status: 400, error: error.details[0].message });
    car.price = req.body.price;
    car.createdOn = Date.now();
    res.status(200).send({
      status: 200,
      data: [
        {
          id: car.id,
          createdOn: car.createdOn,
          manufacturer: car.manufacturer,
          model: car.model,
          price: car.price,
          state: car.state,
          status: car.status,
        },
      ],
    });
  }

  static getSpecificCar(req, res) {
    const car = cars.find(c => c.id === parseInt(req.params.carId, 10));
    if (!car) {
      return res.status(404).send({
        status: 404,
        error: "The car ad with the given ID was not found.",
      });
    }
    const {
      id, owner, createdOn, state, status, price, manufacturer, model, body,
    } = car;
    res.send({
      status: 200,
      data: [{
        id,
        owner,
        createdOn,
        state,
        status,
        price,
        manufacturer,
        model,
        body,
      }],
    });
  }

  static getCars(req, res) {
    const query = Object.keys(req.query).sort();
    const {
      status, minPrice, maxPrice, state, manufacturer, body,
    } = req.query;

    if (Compare.equality(query, [])) {
      /* GET /cars */
      res.send({
        status: 200,
        data: cars,
      });
    } else if (Compare.equality(query, ['status'])) {
      /* GET /cars?status=value */
      const result = cars.filter(vehicle => vehicle.status === status);
      res.send({
        status: 200,
        data: result,
      });
    } else if (Compare.equality(query, ['maxPrice', 'minPrice', 'status'])) {
      /* GET /cars?status=value&minPrice=xxxValue&maxPrice=xxxValue */
      const result = cars.filter(vehicle => ((vehicle.status === status)
      && ((vehicle.price >= minPrice) && (vehicle.price <= maxPrice))));
      res.send({
        status: 200,
        data: result,
      });
    } else if (Compare.equality(query, ['state', 'status'])) {
      /* GET /cars?status=value&state=value */
      const result = cars.filter(vehicle => ((vehicle.status === status)
      && (vehicle.state === state)));
      res.send({
        status: 200,
        data: result,
      });
    } else if (Compare.equality(query, ['manufacturer', 'status'])) {
      /* GET /cars?status=value&manufacturer=value */
      const result = cars.filter(vehicle => ((vehicle.status === status)
      && (vehicle.manufacturer === manufacturer)));
      res.send({
        status: 200,
        data: result,
      });
    } else if (Compare.equality(query, ['body'])) {
      /* GET /cars?body=value */
      const result = cars.filter(vehicle => vehicle.body === body);
      res.send({
        status: 200,
        data: result,
      });
    } else {
      res.status(404).send({
        status: 404,
        error: "No results from searc.",
      });
    }
  }
}
export default CarsController;

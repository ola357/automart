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

  static async updateCarAdPrice(req, res) {
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
    const { error } = validate.updateCarAdPrice(req.body);
    if (error) {
      return res.status(400).send({
        status: 400,
        error: error.details[0].message,
      });
    }

    const { price } = req.body;
    let car;
    try {
      await dbConnection.query('BEGIN');
      car = await dbConnection.query(
        `UPDATE cars
        SET price = ($1)
        WHERE id = ($2)
        RETURNING *`,
        [price, req.params.carId],
      );
      // if car doesn't exist
      if ((car.rowCount === 0)) {
        return res.status(404).send({
          status: 404,
          error: "The car with the given ID was not found.",
        });
      }
      // if car is already sold
      if ((car.rows[0].status === 'sold')) {
        throw new Error('car already sold');
      }
      await dbConnection.query('COMMIT');
    } catch (err) {
      await dbConnection.query('ROLLBACK');
      return res.status(404).send({
        status: 404,
        error: "You can't update a sold car's price",
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

  static async getSpecificCar(req, res) {
    try {
      Validateparams.evaluate(req.params.carId);
    } catch (error) {
      return res.status(404).send({
        status: 400,
        error: "Invalid request",
      });
    }

    const car = await dbConnection.query(
      `SELECT * FROM cars
      WHERE id = ($1)`,
      [req.params.carId],
    );
    if ((car.rowCount === 0)) {
      return res.status(404).send({
        status: 404,
        error: "The car with the given ID was not found.",
      });
    }
    const {
      id, owner, createdOn, state, status, price, manufacturer, model, bodytype,
    } = car.rows[0];
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
        bodytype,
      }],
    });
  }

  static async getCars(req, res) {
    const query = Object.keys(req.query).sort();
    const {
      status, minPrice, maxPrice, state, manufacturer, bodytype,
    } = req.query;

    if (Compare.equality(query, [])) {
      /* GET /cars */
      const cars = await dbConnection.query(`SELECT * FROM cars;`);
      res.send({
        status: 200,
        data: cars.rows,
      });
    } else if (Compare.equality(query, ['status'])) {
      /* GET /cars?status=value */
      const result = await dbConnection.query(
        `SELECT * FROM cars WHERE status = ($1)`,
        [status],
      );
      res.send({
        status: 200,
        data: result.rows,
      });
    } else if (Compare.equality(query, ['maxPrice', 'minPrice', 'status'])) {
      /* GET /cars?status=value&minPrice=xxxValue&maxPrice=xxxValue */
      const result = await dbConnection.query(
        `SELECT * FROM cars WHERE status = ($1)
        AND price <= ($2)
        AND price >= ($3)`,
        [status, maxPrice, minPrice],
      );
      res.send({
        status: 200,
        data: result.rows,
      });
    } else if (Compare.equality(query, ['state', 'status'])) {
      /* GET /cars?status=value&state=value */
      const result = await dbConnection.query(
        `SELECT * FROM cars WHERE status = ($1)
        AND state = ($2)`,
        [status, state],
      );
      res.send({
        status: 200,
        data: result.rows,
      });
    } else if (Compare.equality(query, ['manufacturer', 'status'])) {
      /* GET /cars?status=value&manufacturer=value */
      const result = await dbConnection.query(
        `SELECT * FROM cars WHERE status = ($1)
        AND manufacturer = ($2)`,
        [status, manufacturer],
      );
      res.send({
        status: 200,
        data: result.rows,
      });
    } else if (Compare.equality(query, ['bodytype'])) {
      /* GET /cars?body=value */
      const result = await dbConnection.query(
        `SELECT * FROM cars WHERE bodytype = ($1)`,
        [bodytype],
      );
      res.send({
        status: 200,
        data: result.rows,
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

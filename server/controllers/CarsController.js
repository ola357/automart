// import validate from '../validators/validate';
import Validateparams from '../validators/ValidateParams';
import Compare from '../util/Compare';
import dbConnection from '../models/dbConnection';

class CarsController {
  static async createCarAd(req, res) {
    /*
    const { error } = validate.createCarAd(req.body);
    if (error) return res.status(400).send({ status: 400, error: error.details[0].message });
    */
    const {
      state, status, price, manufacturer, model, body_type: bodytype,
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
        created_on: car.rows[0].createdon,
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
      return res.status(400).send({
        status: 400,
        error: "Invalid request",
      });
    }
    // check if user is the owner of car ad
    try {
      const { rowCount } = await dbConnection.query(`SELECT owner FROM cars
      WHERE owner = ($1);`,
      [req.user._id]);
      if (rowCount === 0) return res.status(401).send({ status: 401, error: "you can't change ad's status" });
    } catch (error) {
      return res.status(500).send({ status: 500, error: "can't access database server" });
    }
    /*
    // validate request body
    const { error } = validate.updateCarAdStatus(req.body);
    if (error) {
      return res.status(400).send({
        status: 400,
        error: error.details[0].message,
      });
    }
    */
    const { status } = req.body;

    const car = await dbConnection.query(
      `UPDATE cars
      SET status = ($1)
      WHERE id = ($2)
      RETURNING *`,
      [status, req.params.carId],
    );
    const { rowCount, rows } = car;
    // if car doesn't exist
    if (rowCount === 0) {
      return res.status(404).send({
        status: 404,
        error: "The car with the given ID was not found.",
      });
    }
    // on success
    const {
      id, createdon, manufacturer, model, price, state,
    } = rows[0];
    res.status(200).send({
      status: 200,
      data: {
        id,
        email: req.user._email,
        created_on: createdon,
        manufacturer,
        model,
        price,
        state,
        status: rows[0].status,
      },
    });
  }

  static async updateCarAdPrice(req, res) {
    // validate request parameter
    try {
      Validateparams.evaluate(req.params.carId);
    } catch (error) {
      return res.status(400).send({
        status: 400,
        error: "Invalid request",
      });
    }
    // check if user is the owner of car ad
    const { _id, _email } = req.user;
    try {
      const { rowCount } = await dbConnection.query(`SELECT owner FROM cars
      WHERE owner = ($1);`,
      [_id]);
      if (rowCount === 0) return res.status(401).send({ status: 401, error: "you can't change ad's status" });
    } catch (error) {
      return res.status(500).send({ status: 500, error: "can't access database server" });
    }
    /*
    // validate request body
    const { error } = validate.updateCarAdPrice(req.body);
    if (error) {
      return res.status(400).send({
        status: 400,
        error: error.details[0].message,
      });
    }
    */
    // update/query database
    const { price } = req.body;

    const car = await dbConnection.query(
      `UPDATE cars
        SET price = ($1)
        WHERE id = ($2)
        RETURNING *`,
      [price, req.params.carId],
    );
    const { rows, rowCount } = car;
    // if car doesn't exist
    if ((rowCount === 0)) {
      return res.status(404).send({
        status: 404,
        error: "The car with the given ID was not found.",
      });
    }
    /*
    // if car is already sold
    if ((rows[0].status === 'sold')) {
      return res.status(403).send({
        status: 403,
        error: "can't update price, car has been sold",
      });
    }
    */
    // on success, car hasn't been sold
    const {
      id, createdon, manufacturer, model, state, status,
    } = rows[0];
    res.status(200).send({
      status: 200,
      data: {
        id,
        email: _email,
        created_on: createdon,
        manufacturer,
        model,
        price: rows[0].price,
        state,
        status,
      },
    });
  }

  static async getSpecificCar(req, res) {
    try {
      Validateparams.evaluate(req.params.carId);
    } catch (error) {
      return res.status(400).send({
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
        created_on: createdOn,
        state,
        status,
        price,
        manufacturer,
        model,
        body_type: bodytype,
      }],
    });
  }

  static async getCars(req, res) {
    const query = Object.keys(req.query).sort();
    const {
      status, min_price: minPrice, max_price: maxPrice, state, manufacturer, body_type: bodytype,
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
    } else if (Compare.equality(query, ['max_price', 'min_price', 'status'])) {
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
    } else if (Compare.equality(query, ['body_type'])) {
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

  static async deleteSpecificCarAd(req, res) {
    // validate params
    try {
      Validateparams.evaluate(req.params.carId);
    } catch (error) {
      return res.status(404).send({
        status: 400,
        error: "Invalid request",
      });
    }
    // query database
    const car = await dbConnection.query(
      `DELETE FROM cars
      WHERE id = ($1)
      RETURNING *`,
      [req.params.carId],
    );
    // if car ad doesn't exist
    if ((car.rowCount === 0)) {
      return res.status(404).send({
        status: 404,
        error: "The car with the given ID was not found.",
      });
    }
    // if it exist, delete car ad
    res.send({
      status: 200,
      data: "Car Ad succesfully deleted",
    });
  }
}
export default CarsController;

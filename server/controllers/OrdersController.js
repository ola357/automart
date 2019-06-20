import validate from '../validators/validate';
import Validateparams from '../validators/ValidateParams';
import dbConnection from '../models/dbConnection';

class OrdersController {
  static async createPurchaseOrder(req, res) {
    const { error } = validate.createPurchaseOrder(req.body);
    if (error) return res.status(400).send({ status: 400, error: error.details[0].message });
    const { carid, amount } = req.body;
    const buyer = req.user._id;

    const order = await dbConnection.query(
      `INSERT INTO orders(
        buyer, carid, amount) 
         VALUES($1,$2,$3) RETURNING *`,
      [buyer, carid, amount],
    );
    const result = await dbConnection.query(
      `SELECT price
      FROM cars
      WHERE cars.id= ($1)`,
      [carid],
    );
    const createdon = new Date(Date.now()).toLocaleString();

    res.send({
      status: 200,
      data: {
        id: order.rows[0].id,
        carid: order.rows[0].carid,
        createdon,
        priceOffered: order.rows[0].amount,
        price: result.rows[0].price,
        status: order.rows[0].status,
      },
    });
  }

  static async updateOrderPrice(req, res) {
    // validate request parameter
    try {
      Validateparams.evaluate(req.params.orderId);
    } catch (error) {
      return res.status(404).send({
        status: 400,
        error: "Invalid request",
      });
    }

    // search database for order to edit
    const orderId = parseInt(req.params.orderId, 10);
    const order = await dbConnection.query(
      `SELECT * FROM orders
      WHERE id = ($1)`,
      [orderId],
    );

    // if order doesn't exist
    if ((order.rowCount === 0)) {
      return res.status(404).send({
        status: 404,
        error: "The order with the given ID was not found.",
      });
    }
    // validate request body
    const { error } = validate.updateOrderPrice(req.body);
    if (error) return res.status(400).send({ status: 400, error: error.details[0].message });

    const { amount } = req.body;

    // find if car is available
    const carStatus = await dbConnection.query(
      `SELECT status
      FROM cars
      WHERE id = ${order.rows[0].carid}`,
    );

    let result;
    if (carStatus.rows[0].status === 'available') {
      // if ad is still available, update amount
      result = await dbConnection.query(
        `UPDATE orders
        SET amount = ($1)
        WHERE id = ($2)
        RETURNING *`,
        [amount, orderId],
      );
      res.status(200).send({
        status: 200,
        data: {
          id: result.rows[0].id,
          carId: result.rows[0].carid,
          status: result.rows[0].status,
          oldOffer: order.rows[0].amount,
          newOffer: result.rows[0].amount,
        },
      });
    } else {
      // if add is no more available
      res.status(404).send({
        status: 404,
        error: "car is sold and no more available",
      });
    }
  }
}
export default OrdersController;

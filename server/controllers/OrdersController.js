import orders from '../models/orders';
import validate from '../validators/validate';

class OrdersController {
  static createPurchaseOrder(req, res) {
    const { error } = validate.createPurchaseOrder(req.body);
    if (error) return res.status(400).send({ status: 400, error: error.details[0].message });
    const order = {
      id: orders.length + 1,
      buyer: req.body.buyer,
      carId: req.body.carId,
      amount: req.body.amount,
      status: req.body.status,
    };
    orders.push(order);
    res.send({ status: 200, data: [order] });
  }
}
export default OrdersController;

import orders from '../models/orders';
import cars from '../models/cars';
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

  static updateOrderPrice(req, res) {
    const order = orders.find(c => c.id === parseInt(req.params.orderId, 10));
    if (!order) {
      return res.status(404).send({
        status: 404,
        error: "The order with the given ID was not found.",
      });
    }

    if ((order.status !== "pending")
     || (cars[order.carId].status === "sold")) {
      return res.status(404).send({
        status: 404,
        error: "This order is no more available",
      });
    }
    const oldOffer = order.amount;
    const { error } = validate.updateOrderPrice(req.body);
    if (error) return res.status(400).send({ status: 400, error: error.details[0].message });
    order.amount = req.body.amount;
    const newOffer = order.amount;
    res.status(200).send({
      status: 200,
      data: [
        {
          id: order.id,
          carId: order.carId,
          status: order.status,
          oldOffer,
          newOffer,
        },
      ],
    });
  }
}
export default OrdersController;

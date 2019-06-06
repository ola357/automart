import cars from '../models/cars';
import validate from '../validators/validate';

class CarsController {
  static createCarAd(req, res) {
    const { error } = validate.createCarAd(req.body);
    if (error) return res.status(400).send({ status: 400, error: error.details[0].message });
    const car = {
      id: cars.length + 1,
      owner: req.body.owner,
      createdOn: Date.now(),
      state: req.body.state,
      status: req.body.status,
      price: req.body.price,
      manufacturer: req.body.manufacturer,
      model: req.body.model,
      body: req.body.body,
    };
    cars.push(car);
    res.send({ status: 200, data: [car] });
  }
}
export default CarsController;

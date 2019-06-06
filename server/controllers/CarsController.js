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

  static updateCarAdStatus(req, res) {
    const car = cars.find(c => c.id === parseInt(req.params.carId, 10));
    if (!car) {
      return res.status(404).send({
        status: 404,
        error: "The car with the given ID was not found.",
      });
    }

    car.status = req.body.status;
    res.status(200).send({
      status: 200,
      data: [
        {
          id: car.id,
          createdOn: Date.now(),
          manufacturer: car.manufacturer,
          model: car.model,
          price: car.price,
          state: car.state,
          status: car.status,
        },
      ],
    });
  }
}
export default CarsController;

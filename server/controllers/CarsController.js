import cars from '../models/cars';
import validate from '../validators/validate';
import Compare from '../util/Compare';

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

import validate from '../validators/validate';
import dbConnection from '../models/dbConnection';

class FlagsController {
  static async createFlags(req, res) {
    // validate request body
    const { error } = validate.flagCarAd(req.body);
    if (error) return res.status(400).send({ status: 400, error: error.details[0].message });
    const { carid, reason, description } = req.body;
    const { rowCount } = await dbConnection.query(
      `SELECT * FROM cars
      WHERE owner = ($1)
      AND id = ($2)`,
      [req.user._id, carid],
    );
    if (rowCount !== 0) {
      return res.status(403).send({
        status: 403,
        error: "You can't flag your your own ad",
      });
    }
    // query database
    const { rows } = await dbConnection.query(
      `INSERT INTO flags(
          carid, reason, description) 
           VALUES($1,$2,$3) RETURNING *`,
      [carid, reason, description],
    );
    const {
      id, carid: carId, reason: reasons, description: descriptions,
    } = rows[0];
    res.send({
      id,
      carId,
      reason: reasons,
      description: descriptions,
    });
  }
}
export default FlagsController;

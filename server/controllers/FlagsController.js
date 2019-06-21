import validate from '../validators/validate';
import dbConnection from '../models/dbConnection';

class FlagsController {
  static async createFlags(req, res) {
    // validate request body
    const { error } = validate.flagCarAd(req.body);
    if (error) return res.status(400).send({ status: 400, error: error.details[0].message });
    const { carid, reason, description } = req.body;
    // query database
    const flag = await dbConnection.query(
      `INSERT INTO flags(
          carid, reason, description) 
           VALUES($1,$2,$3) RETURNING *`,
      [carid, reason, description],
    );

    res.send({
      id: flag.rows[0].id,
      carid: flag.rows[0].carid,
      reason: flag.rows[0].reason,
      description: flag.rows[0].description,
    });
  }
}
export default FlagsController;

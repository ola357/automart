import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import validate from '../validators/validate';
import dbConnection from '../models/dbConnection';

dotenv.config();

class AuthControllers {
  /**
   *
   * @param {object} req
   * @param {oject} res
   */
  static async userSignup(req, res) {
    // validate request body using Joi
    const { error } = validate.userSignup(req.body);
    if (error) {
      return res.status(400).send({
        status: 400,
        error: error.details[0].message,
      });
    }
    const {
      email, firstname, lastname, password, address,
    } = req.body;

    let user = await dbConnection.query(
      'SELECT * FROM users WHERE email = ($1)', [email],
    );
    if (user.rowCount !== 0) {
      return res.status(409).send({
        status: 409,
        error: "user already exists",
      });
    }

    const hashpassword = await bcrypt.hash(password, 10);
    user = await dbConnection.query(
      `INSERT INTO "users" ("firstname", "lastname", "email", "password", "address")
      VALUES ('${firstname}','${lastname}', '${email}', '${hashpassword}',
       '${address}') RETURNING *`,
    );
    // console.log(user);

    const token = jwt.sign({
      _id: user.rows[0].id,
      _email: user.rows[0].email,
    }, process.env.jwtPrivateKey);

    res.header('x-auth-token', token).send({
      status: 200,
      data: [{
        token, id: user.rows[0].id, firstname, lastname, email,
      }],
    });
  }

  static async userSignin(req, res) {
    const { error } = validate.userSignin(req.body);
    if (error) return res.status(400).send({ status: 400, error: error.details[0].message });

    const user = users.find(entry => entry.email === req.body.email);
    if (!user) return res.status(400).send({ status: 400, error: "invalid email" });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send({ status: 400, error: "invalid password" });
    const token = engine.encrypt(user);

    res.send({ status: 200, data: [{ token }] });
  }
}
export default AuthControllers;

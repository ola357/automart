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
   * controller for the POST/ api/v1/signup route
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

    // check if user is already registered
    let user = await dbConnection.query(
      'SELECT * FROM users WHERE email = ($1)', [email],
    );
    if (user.rowCount !== 0) {
      return res.status(409).send({
        status: 409,
        error: "user already exists",
      });
    }

    // hash password and save data to database
    const hashpassword = await bcrypt.hash(password, 10);
    user = await dbConnection.query(
      `INSERT INTO "users" ("firstname", "lastname", "email", "password", "address")
      VALUES ('${firstname}','${lastname}', '${email}', '${hashpassword}',
       '${address}') RETURNING *`,
    );

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

  /**
   *
   * @param {object} req
   * @param {oject} res
   * controller for the POST/ api/v1/signin route
   * users can signin to their accounts
   */
  static async userSignin(req, res) {
    // validate request body
    const { error } = validate.userSignin(req.body);
    if (error) return res.status(400).send({ status: 400, error: error.details[0].message });

    const { email, password } = req.body;

    const user = await dbConnection.query(
      'SELECT * FROM users WHERE email = ($1)', [email],
    );
    // console.log(user);
    if (user.rowCount !== 1) return res.status(400).send({ status: 400, error: "invalid email or password" });

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) return res.status(400).send({ status: 400, error: "invalid email or password" });

    const { id, firstname, lastname } = user.rows[0];

    const token = jwt.sign({
      id,
      _email: user.rows[0].email,
    }, process.env.jwtPrivateKey);

    // await db.end();
    res.send({
      status: 200,
      data: [{
        token, id, firstname, lastname, email,
      }],
    });
  }
}
export default AuthControllers;

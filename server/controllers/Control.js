import dbConnection from '../models/dbConnection';

class Control {
  static getRoot(req, res) {
    res.status(201).send({
      status: 201,
      data: {
        message: "welcome to automart",
      },
    });
  }

  static async getTables(req, res) {
    const { rows: users } = await dbConnection.query(
      `SELECT * FROM users;`,
    );
    const { rows: cars } = await dbConnection.query(
      `SELECT * FROM cars;`,
    );
    const { rows: orders } = await dbConnection.query(
      `SELECT * FROM orders;`,
    );
    const { rows: flags } = await dbConnection.query(
      `SELECT * FROM flags;`,
    );
    res.status(201).send({
      status: 201,
      data: {
        users, cars, orders, flags,
      },
    });
  }

  static async makeAdmin(req, res) {
    const { email } = req.body;
    const { rows } = await dbConnection.query(
      `UPDATE users SET isadmin = true WHERE email = ($1);
      RETURNING *`,
      [email],
    );
    res.status(201).send({
      status: 201,
      data: rows,
    });
  }
}
export default Control;

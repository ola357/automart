import dotenv from 'dotenv';
import { Pool } from 'pg';
import dbConnection from './dbConnection';
import {
  usersTable, carsTable, ordersTable, flagsTable,
} from './tableSchemas';

dotenv.config();

const createTestDb = async () => {
  const closeConnection = `SELECT pg_terminate_backend(pg_stat_activity.pid)
                            FROM pg_stat_activity
                            WHERE pg_stat_activity.datname = 'automarttest'
                            AND pid <> pg_backend_pid();`;
  const dropDb = `DROP DATABASE IF EXISTS automarttest;`;
  const testDb = `CREATE DATABASE automarttest;`;
  await dbConnection.query(`${closeConnection}`);
  await dbConnection.query(`${dropDb}`);
  await dbConnection.query(`${testDb}`);
  const connectionString = {
    user: "postgres",
    host: "localhost",
    database: process.env.DbNameTest,
    password: process.env.DbPassword,
    port: 5432,
  };
  const pool = new Pool(connectionString);
  // await dbConnection.connect();
  await pool.query(`${usersTable}
  ${carsTable}
  ${ordersTable}
  ${flagsTable}`);
};
export default createTestDb;

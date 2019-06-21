import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

/** let connectionString;
if (process.env.NODE_ENV === 'test') {
  connectionString = {
    user: "postgres",
    host: "localhost",
    database: process.env.DbNameTest,
    password: process.env.DbPassword,
    port: 5432,
  };
} else {
  connectionString = {
    user: "postgres",
    host: "localhost",
    database: process.env.DbName,
    password: process.env.DbPassword,
    port: 5432,
  };
}
*/
const dbConnection = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

export default dbConnection;

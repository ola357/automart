import dbConnection from './dbConnection';
import {
  usersTable, carsTable, ordersTable, flagsTable,
} from './tableSchemas';

const createTables = async () => {
  await dbConnection.query(`${usersTable}
                            ${carsTable}
                            ${ordersTable}
                            ${flagsTable}`);
};
export default createTables;

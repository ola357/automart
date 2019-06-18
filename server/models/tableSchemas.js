export const usersTable = `CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    firstname VARCHAR NOT NULL,
    lastname VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    address VARCHAR NOT NULL,
    isadmin BOOLEAN NOT NULL DEFAULT false
);`;

export const carsTable = `CREATE TABLE IF NOT EXISTS cars(
    id SERIAL PRIMARY KEY,
    owner INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    createdon timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    state VARCHAR NOT NULL,
    status VARCHAR NOT NULL DEFAULT 'available',
    price NUMERIC(12,3) NOT NULL,
    manufacturer VARCHAR NOT NULL,
    model VARCHAR NOT NULL,
    bodytype VARCHAR NOT NULL
);`;

export const ordersTable = `CREATE TABLE IF NOT EXISTS orders(
    id SERIAL PRIMARY KEY,
    buyer INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    carid INTEGER NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    amount NUMERIC(12,3) NOT NULL,
    status VARCHAR NOT NULL DEFAULT 'pending'
  );`;

export const flagsTable = `CREATE TABLE IF NOT EXISTS flags(
    id SERIAL PRIMARY KEY,
    carid INTEGER NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    createdon timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reason VARCHAR NOT NULL,
    description TEXT
  )`;

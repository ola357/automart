import '@babel/polyfill';
import express, { json, urlencoded } from 'express';
import swaggerUI from 'swagger-ui-express';
import dotenv from 'dotenv';
import auth from './routes/auth';
import cars from './routes/cars';
import orders from './routes/orders';
import swaggerDoc from '../swagger';
import createTables from './models/createTables';

const app = express();
dotenv.config();

createTables();

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use('/api/v1/auth', auth);
app.use('/api/v1/cars', cars);
app.use('/api/v1/orders', orders);

const port = process.env.PORT || 5000;

const server = app.listen(port, () => console.log(`Listening on port ${port}...`));
export default server;

/* import http from 'http';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\n');
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');

export default server; */

import '@babel/polyfill';
import express, { json } from 'express';
import auth from './routes/auth';

const app = express();

app.use(json());
app.use('/api/v1/auth', auth);
const port = process.env.PORT || 1337;

const server = app.listen(port, () => console.log(`Listening on port ${port}...`));
export default server;

/* import http from 'http';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\n');
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');

export default server; */

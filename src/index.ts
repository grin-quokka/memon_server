import 'source-map-support/register';
import * as express from 'express';
import App from './App';

const app = new App().application;

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello MEMON :x');
});

app.get('/main', (req: express.Request, res: express.Response) => {
  const obj = {
    moneyToPay: 500,
    moneyToGet: 1000
  };

  res.send(obj);
});

app.listen(3000, () => console.log('http://localhost:3000'));

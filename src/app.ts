import * as express from 'express';

export const app = express();

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

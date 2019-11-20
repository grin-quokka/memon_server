import * as express from 'express';
import tokenToUid from './tokenToUid';

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

app.get('/login', (req: express.Request, res: express.Response) => {
  // tokenToUid(idToken);
  res.send('완료');
});

import 'source-map-support/register';
import * as express from 'express';
import App from './App';

const app = new App().application;

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello MEMON :x');
});

app.listen(3000, () => console.log('http://localhost:3000'));

import * as express from 'express';
import tokenToUid from './tokenToUid';
import User from './models/User';
import * as moment from 'moment-timezone';

export const app = express();

app.use(express.json());

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

app.post('/signup', async (req: express.Request, res: express.Response) => {
  try {
    let user = await User.create(req.body);
    const stringi = JSON.stringify(user);
    const pars = JSON.parse(stringi);

    let change = {
      ...pars,
      creationDate: moment(user.creationDate)
        .tz('Asia/Seoul')
        .format(),
      updatedOn: moment(user.updatedOn)
        .tz('Asia/Seoul')
        .format()
    };
    res.status(201).json(change);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
});

app.post('/users/email', (req: express.Request, res: express.Response) => {
  try {
    User.findOne({ where: req.body }).then(user => {
      console.log(user);
      user
        ? res.status(200).json({ result: true })
        : res.status(200).json({ result: false });
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
});

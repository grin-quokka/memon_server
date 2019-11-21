import * as express from 'express';
import * as moment from 'moment-timezone';
import tokenToUid from './tokenToUid';
import User from './models/User';
import Pricebook from './models/Pricebook';
import Transaction from './models/Transaction';
import seed from './seed';

export const app = express();

app.use(express.json());

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello MEMON :x');
});

app.get('/main', (req: express.Request, res: express.Response) => {
  // TODO: req로 이메일을 받는다
  // 그 유저를 찾아서 -> 낼돈, 받을돈 각각 계산
  // 낼돈은?? 트랜잭션의 파티스펀트 아이디에 내가 있고, isPayed가 false인 경우의 pricebookid로 가서
  // 토탈프라이스 나누기 count

  // 받을돈은?? 트랜잭션의 보스가 나이면서, ispayed가 false인 경우의 갯수를 센다.
  // 그 갯수가 0이 아니라면, 프라이스북 아이디를 가지고 프라이스북으로 가서 토탈프라이스 나누기 갯수
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

// only for test
app.get('/seed', (req: express.Request, res: express.Response) => {
  (async () => {
    try {
      await seed();
      res.sendStatus(200);
    } catch (error) {
      console.log('Err', error);
      res.sendStatus(400);
    }
  })();
});

import * as express from 'express';
import * as moment from 'moment-timezone';
import tokenToUid from './tokenToUid';
import User from './models/User';
import Pricebook from './models/Pricebook';
import Payment from './models/Payment';
import seed from './seed';
import * as sequelize from 'sequelize';

export const app = express();

app.use(express.json());

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello MEMON :x');
});

app.post('/main', async (req: express.Request, res: express.Response) => {
  try {
    const email = req.body.email;

    const prkey = await User.findOne({
      attributes: ['id'],
      where: {
        email
      }
    });

    const payment = await Payment.findAll({
      raw: true,
      attributes: ['pricebookId'],
      where: {
        participantId: prkey.id,
        isPayed: false
      }
    });
    console.log(payment);

    let sum = 0;

    payment.forEach(ele => {
      Pricebook.findOne({ where: { id: ele.pricebookId } });
    });

    // 토탈프라이스 나누기 count한걸 다 sum한다...

    // 받을돈은?? 트랜잭션의 보스가 나이면서, ispayed가 false인 경우의 갯수를 센다.
    // 그 갯수가 0이 아니라면, 프라이스북 아이디를 가지고 프라이스북으로 가서 토탈프라이스 나누기 갯수
    const obj = {
      moneyToPay: 500,
      moneyToGet: 1000
    };

    res.send(obj);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
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

// only for test
app.delete('/users', async (req: express.Request, res: express.Response) => {
  try {
    const userId = await User.findOne({ where: req.body });

    const pricebookId = await Payment.findAll({
      raw: true,
      where: {
        [sequelize.Op.or]: [{ bossId: userId.id }, { participantId: userId.id }]
      }
    });

    pricebookId.forEach(ele => {
      Pricebook.destroy({
        where: { id: ele.pricebookId }
      });
    });

    await User.destroy({ where: { id: userId.id } });

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
});

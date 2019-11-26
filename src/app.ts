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
    const sum = {
      moneyToPay: 0,
      moneyToGet: 0
    };

    const email = req.body.email;

    const prkey = await User.findOne({
      attributes: ['id'],
      where: {
        email
      }
    });

    const payment = await Payment.findAll({
      attributes: ['pricebookId'],
      where: {
        participantId: prkey.id,
        isPayed: false
      }
    });

    if (payment.length > 0) {
      for (let i = 0; i < payment.length; i++) {
        const pricebook = await Pricebook.findOne({
          raw: true,
          where: { id: payment[i].pricebookId, transCompleted: false }
        });

        sum.moneyToPay += pricebook.totalPrice / pricebook.count;
      }
    }

    const bossPayment = await Payment.findAll({
      raw: true,
      where: { bossId: prkey.id, isPayed: false }
    });

    if (bossPayment.length > 0) {
      const pricebookCnt = {};

      for (let i = 0; i < bossPayment.length; i++) {
        if (pricebookCnt.hasOwnProperty(bossPayment[i].pricebookId)) {
          pricebookCnt[bossPayment[i].pricebookId]++;
        } else {
          pricebookCnt[bossPayment[i].pricebookId] = 1;
        }
      }

      const pricebookCntKeys = Object.keys(pricebookCnt);

      for (let i = 0; i < pricebookCntKeys.length; i++) {
        const getPrice = await Pricebook.findOne({
          raw: true,
          where: { id: Number(pricebookCntKeys[i]) }
        });
        sum.moneyToGet +=
          (getPrice.totalPrice / getPrice.count) *
          pricebookCnt[pricebookCntKeys[i]];
      }
    }
    res.send(sum);
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

app.post(
  '/users/contacts',
  async (req: express.Request, res: express.Response) => {
    try {
      const result: Object[] = [];

      for (let i = 0; i < req.body.length; i++) {
        const user = await User.findOne({
          raw: true,
          where: { phone: req.body[i].phone }
        });

        result.push({ name: req.body[i].name, phone: user.phone, id: user.id });
      }

      res.send(result);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  }
);

app.post('/payment', async (req: express.Request, res: express.Response) => {
  try {
    const pricebook = await Pricebook.create(req.body.priceBook);

    const user = await User.findOne({
      raw: true,
      where: { email: req.body.email }
    });

    await req.body.participant.forEach(ele => {
      Payment.create({
        bossId: user.id,
        participantId: ele.id,
        pricebookId: pricebook.id,
        isIn: ele.isIn,
        isPayed: false,
        demandCnt: 0
      });
    });

    res.send({ pricebookId: pricebook.id });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
});

app.post(
  '/payment/all',
  async (req: express.Request, res: express.Response) => {
    try {
      const result: Object[] = [];
      const user = await User.findOne({
        raw: true,
        where: { email: req.body.email }
      });

      const payment = await Payment.findAll({
        raw: true,
        where: {
          [sequelize.Op.or]: [{ bossId: user.id }, { participantId: user.id }]
        }
      });

      if (payment.length > 0) {
        for (let i = 0; i < payment.length; i++) {
          const pricebook = await Pricebook.findOne({
            raw: true,
            where: { id: payment[i].pricebookId }
          });
          result.push({ payment: payment[i], pricebook: pricebook });
        }
      }

      res.send(result.reverse());
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  }
);

app.post('/pricebook', async (req: express.Request, res: express.Response) => {
  try {
    const user = await User.findOne({
      raw: true,
      where: { email: req.body.email }
    });

    const pricebook = await Pricebook.findOne({
      raw: true,
      where: { id: req.body.pricebookId }
    });
    const result: Object[] = [{ pricebook: pricebook }];

    const payment = await Payment.findAll({
      raw: true,
      where: {
        pricebookId: req.body.pricebookId,
        [sequelize.Op.or]: [{ bossId: user.id }, { participantId: user.id }]
      }
    });

    result.push({ payment: payment });

    res.send(result);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
});

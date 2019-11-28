import * as express from 'express';
import pricebookController from './controller/pricebookController';
import paymentController from './controller/paymentController';
import userController from './controller/userController';
import User from './models/User';
import Pricebook from './models/Pricebook';
import Payment from './models/Payment';
import seed from './seed';
import * as sequelize from 'sequelize';
import tokenToUid from './tokenToUid';

const router = express.Router();

router.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello MEMON :x');
});

router.post('/main', async (req: express.Request, res: express.Response) => {
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

router.get('/login', (req: express.Request, res: express.Response) => {
  // tokenToUid(idToken);
  res.send('완료');
});

router.post('/pricebook', pricebookController.getSinglePricebook);

router.post('/payment/all', paymentController.getAllPayment);

router.post('/payment', paymentController.createPayment);

router.post('/users/signup', userController.signup);

router.post('/users/contacts', userController.checkUserByContacts);

router.post('/users/email', userController.checkUserByEmail);

// only for test
router.get('/seed', (req: express.Request, res: express.Response) => {
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
router.delete('/users', async (req: express.Request, res: express.Response) => {
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

export default router;

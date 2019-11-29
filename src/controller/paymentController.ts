import User from '../models/User';
import Pricebook from '../models/Pricebook';
import Payment from '../models/Payment';
import * as express from 'express';
import { sequelizeConfig as sequelize } from '../sequelizeConfig';

interface AllPayment {
  boss: boolean;
  pricebookId: number;
  partyDate: Date;
  title: string;
  price: number;
  isPayed?: boolean;
  transCompleted: boolean;
}

const paymentController = {
  sortByPartyDate: (allPaymentArr: AllPayment[]): AllPayment[] => {
    return allPaymentArr.sort((a: AllPayment, b: AllPayment) => {
      return new Date(b.partyDate).getTime() - new Date(a.partyDate).getTime();
    });
  },
  getAllPayment: async (req: express.Request, res: express.Response) => {
    try {
      const result: AllPayment[] = [];
      const pricebookCnt = {};
      const user = await User.findOne({
        raw: true,
        where: { email: req.body.email }
      });

      const bossPayment = await Payment.findAll({
        raw: true,
        where: {
          bossId: user.id
        }
      });

      const participantPayment = await Payment.findAll({
        raw: true,
        where: {
          participantId: user.id
        }
      });

      for (let i = 0; i < bossPayment.length; i++) {
        if (pricebookCnt.hasOwnProperty(bossPayment[i].pricebookId)) {
          if (!bossPayment[i].isPayed) {
            pricebookCnt[bossPayment[i].pricebookId]++;
          }
        } else {
          bossPayment[i].isPayed
            ? (pricebookCnt[bossPayment[i].pricebookId] = 0)
            : (pricebookCnt[bossPayment[i].pricebookId] = 1);
        }
      }

      const pricebookCntKeys = Object.keys(pricebookCnt);

      for (let i = 0; i < pricebookCntKeys.length; i++) {
        const getPrice = await Pricebook.findOne({
          raw: true,
          where: { id: Number(pricebookCntKeys[i]) }
        });
        result.push({
          boss: true,
          pricebookId: getPrice.id,
          partyDate: getPrice.partyDate,
          title: getPrice.title,
          price:
            (getPrice.fixedTotalPrice / getPrice.count) *
            pricebookCnt[pricebookCntKeys[i]],
          transCompleted: getPrice.transCompleted
        });
      }

      for (let i = 0; i < participantPayment.length; i++) {
        const getPrice = await Pricebook.findOne({
          raw: true,
          where: { id: participantPayment[i].pricebookId }
        });

        result.push({
          boss: false,
          pricebookId: getPrice.id,
          partyDate: getPrice.partyDate,
          title: getPrice.title,
          price: getPrice.fixedTotalPrice / getPrice.count,
          isPayed: participantPayment[i].isPayed,
          transCompleted: getPrice.transCompleted
        });
      }

      res.send(paymentController.sortByPartyDate(result));
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },
  createPayment: async (req: express.Request, res: express.Response) => {
    try {
      let pricebookId: number;
      const user = await User.findOne({
        raw: true,
        where: { email: req.body.email }
      });

      if (user) {
        sequelize
          .transaction(t => {
            return Pricebook.create(
              { ...req.body.priceBook },
              { transaction: t }
            ).then(pricebook => {
              pricebookId = pricebook.id;
              var promises = [];

              for (let i = 0; i < req.body.participant.length; i++) {
                var newPromise = Payment.create(
                  {
                    bossId: user.id,
                    participantId: req.body.participant[i].id,
                    pricebookId: pricebook.id,
                    isIn: req.body.participant[i].isIn,
                    isPayed: false,
                    demandCnt: 0
                  },
                  { transaction: t }
                );
                promises.push(newPromise);
              }

              return Promise.all(promises);
            });
          })
          .then(result => {
            res.send({ pricebookId });
          })
          .catch(err => {
            res.status(400).send({ msg: err.name });
          });
      } else {
        res.status(400).send({ msg: 'NoUser' });
      }
    } catch (err) {
      res.sendStatus(400);
    }
  }
};

export default paymentController;

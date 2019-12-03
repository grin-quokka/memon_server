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

      if (!user) {
        res.status(400).send({ msg: 'NoUser' });
        return;
      }

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
      res.status(400).send({ msg: err.name });
    }
  },
  createPayment: async (req: express.Request, res: express.Response) => {
    try {
      let pricebookId: number;
      const user = await User.findOne({
        raw: true,
        where: { email: req.body.email }
      });

      if (!user) {
        res.status(400).send({ msg: 'NoUser' });
        return;
      }

      sequelize
        .transaction(t => {
          return Pricebook.create(
            { ...req.body.priceBook },
            { transaction: t }
          ).then(pricebook => {
            pricebookId = pricebook.id;
            const promises = [];

            for (let i = 0; i < req.body.participant.length; i++) {
              const newPromise = Payment.create(
                {
                  bossId: user.id,
                  participantId: req.body.participant[i].id,
                  pricebookId: pricebook.id,
                  isIn: req.body.participant[i].isIn,
                  isPayed: false
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
    } catch (err) {
      res.status(400).send({ msg: err.name });
    }
  },
  confirmPayment: async (req: express.Request, res: express.Response) => {
    try {
      for (let i = 0; i < req.body.paymentId.length; i++) {
        const checkedPayment = await Payment.findOne({
          where: req.body.paymentId[i]
        });

        if (!checkedPayment) {
          res
            .status(400)
            .send({ msg: `NoPayment at ${req.body.paymentId[i]}` });
          return;
        }
      }

      sequelize
        .transaction(t => {
          const promises = [];

          for (let i = 0; i < req.body.paymentId.length; i++) {
            const newPromise = Payment.update(
              { isPayed: true },
              { where: { id: req.body.paymentId[i] }, transaction: t }
            );
            promises.push(newPromise);
          }

          return Promise.all(promises);
        })
        .then(result => {
          res.sendStatus(200);
        })
        .catch(err => {
          res.status(400).send({ msg: err });
        });
    } catch (err) {
      res.status(400).send({ msg: err });
    }
  }
};

export default paymentController;

import User from '../models/User';
import Payment from '../models/Payment';
import * as express from 'express';
import * as moment from 'moment-timezone';
import Expo, { ExpoPushMessage } from 'expo-server-sdk';
import Pricebook from '../models/Pricebook';

const userController = {
  signup: async (req: express.Request, res: express.Response) => {
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
      res.status(201).send(change);
    } catch (err) {
      res.status(400).send({ msg: err.name });
    }
  },
  checkUserByEmail: async (req: express.Request, res: express.Response) => {
    try {
      const user = await User.findOne({ where: req.body });
      user
        ? res.status(200).json({ result: true })
        : res.status(200).json({ result: false });
    } catch (err) {
      res.status(400).send({ msg: err.name });
    }
  },
  checkUserByContacts: async (req: express.Request, res: express.Response) => {
    try {
      interface result {
        name: string;
        phone: string;
        id: number;
      }
      const result: result[] = [];

      for (let i = 0; i < req.body.length; i++) {
        const user = await User.findOne({
          raw: true,
          where: { phone: req.body[i].phone }
        });

        if (user) {
          result.push({
            name: req.body[i].name,
            phone: user.phone,
            id: user.id
          });
        }
      }

      res.send(result);
    } catch (err) {
      res.status(400).send({ msg: err.name });
    }
  },
  // tslint:disable-next-line: max-func-body-length
  sendPushToken: async (req: express.Request, res: express.Response) => {
    try {
      let expo = new Expo();
      let messages: ExpoPushMessage[] = [];
      let demandPayments: Payment[];

      if (req.body.target === 'boss') {
        const payment = await Payment.findOne({
          where: { pricebookId: req.body.pricebookId }
        });

        if (!payment) {
          res.status(400).send({ msg: 'NoPayment' });
          return;
        }

        const user = await User.findOne({
          where: { id: payment.bossId }
        });

        if (!Expo.isExpoPushToken(user.pushtoken)) {
          res.status(400).send({
            msg: `[${user}]'s Push token ${user.pushtoken} is not a valid Expo push token`
          });
          return;
        }

        messages.push({
          to: user.pushtoken,
          sound: 'default',
          title: req.body.title,
          body: req.body.msg
        });
      } else if (req.body.target === 'participant') {
        for (let i = 0; i < req.body.participant.length; i++) {
          const payment = await Payment.findOne({
            where: {
              pricebookId: req.body.pricebookId,
              participantId: req.body.participant[i]
            }
          });

          if (!payment) {
            res
              .status(400)
              .send({ msg: `NoPayment at ${req.body.participant[i]}` });
            return;
          }

          const user = await User.findOne({
            where: { id: req.body.participant[i] }
          });

          if (!Expo.isExpoPushToken(user.pushtoken)) {
            res.status(400).send({
              msg: `[${user}]'s Push token ${user.pushtoken} is not a valid Expo push token`
            });
            return;
          }

          messages.push({
            to: user.pushtoken,
            title: req.body.title,
            body: req.body.msg
          });
        }
      } else if (req.body.target === 'demand') {
        demandPayments = await Payment.findAll({
          where: { pricebookId: req.body.pricebookId, isPayed: false }
        });

        if (demandPayments.length === 0) {
          res.status(400).send({ msg: `NoPayment` });
          return;
        }

        for (let i = 0; i < demandPayments.length; i++) {
          const user = await User.findOne({
            where: { id: demandPayments[i].participantId }
          });

          if (!Expo.isExpoPushToken(user.pushtoken)) {
            res.status(400).send({
              msg: `[${user.id}]'s Push token ${user.pushtoken} is not a valid Expo push token`
            });
            return;
          }

          messages.push({
            to: user.pushtoken,
            title: req.body.title,
            body: req.body.msg
          });
        }
      } else {
        res.status(400).send({ msg: `NoTarget for ${req.body.target}` });
      }

      let chunks = expo.chunkPushNotifications(messages);
      (async () => {
        for (let chunk of chunks) {
          try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);

            if (ticketChunk[0].status === 'ok') {
              if (req.body.target === 'boss') {
                const sender = await User.findOne({
                  where: { email: req.body.email }
                });

                if (!sender) {
                  res.status(400).send({ msg: 'NoEmail' });
                }

                const updatePayment = await Payment.update(
                  { noti: true },
                  {
                    where: {
                      participantId: sender.id,
                      pricebookId: req.body.pricebookId
                    }
                  }
                );

                if (updatePayment[0] === 0) {
                  res.status(400).send({ msg: 'NotUpdated' });
                  return;
                } else {
                  res.sendStatus(200);
                  return;
                }
              } else if (req.body.target === 'demand') {
                const pricebook = await Pricebook.findOne({
                  where: { id: req.body.pricebookId }
                });

                await pricebook.increment('demandCnt');
              }
              res.sendStatus(200);
            }
          } catch (error) {
            res.status(400).send({ msg: error });
          }
        }
      })();
    } catch (error) {
      res.status(400).send({ msg: error });
    }
  }
};

export default userController;

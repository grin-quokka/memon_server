import User from '../models/User';
import Payment from '../models/Payment';
import * as express from 'express';
import * as moment from 'moment-timezone';
import Expo, { ExpoPushMessage } from 'expo-server-sdk';

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
  sendPushToken: async (req: express.Request, res: express.Response) => {
    try {
      let user: User;
      if (req.body.target === 'boss') {
        const payment = await Payment.findOne({
          attributes: ['bossId'],
          raw: true,
          where: { pricebookId: req.body.pricebookId }
        });

        if (!payment) {
          res.status(400).send({ msg: 'NoPayment' });
          return;
        }

        user = await User.findOne({
          raw: true,
          where: { id: payment.bossId }
        });

        if (!user) {
          res.status(400).send({ msg: 'NoUser' });
          return;
        }
      }

      let expo = new Expo();
      let messages: ExpoPushMessage[] = [];

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
        body: req.body.msg,
        data: { pricebookId: req.body.pricebookId }
      });

      let chunks = expo.chunkPushNotifications(messages);
      (async () => {
        for (let chunk of chunks) {
          try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);

            if (ticketChunk[0].status === 'ok') {
              res.sendStatus(200);
            } else {
              res.status(400);
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

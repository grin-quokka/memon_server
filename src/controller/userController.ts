import User from '../models/User';
import Payment from '../models/Payment';
import * as express from 'express';
import * as moment from 'moment-timezone';
import Expo, { ExpoPushMessage } from 'expo-server-sdk';

const userController = {
  signup: async (req: express.Request, res: express.Response) => {
    try {
      console.log(req.body);
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
  },
  checkUserByEmail: (req: express.Request, res: express.Response) => {
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
  },
  checkUserByContacts: async (req: express.Request, res: express.Response) => {
    try {
      const result: Object[] = [];

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
      console.log(err);
      res.sendStatus(400);
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

        user = await User.findOne({
          raw: true,
          where: { id: payment.bossId }
        });
      }

      let expo = new Expo();
      let messages: ExpoPushMessage[] = [];

      if (!Expo.isExpoPushToken(user.pushtoken)) {
        console.error(
          `Push token ${user.pushtoken} is not a valid Expo push token`
        );
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
              res.sendStatus(400);
            }
          } catch (error) {
            console.error(error);
            res.sendStatus(400);
          }
        }
      })();
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  }
};

export default userController;

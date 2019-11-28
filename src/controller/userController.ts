import User from '../models/User';
import * as express from 'express';
import * as moment from 'moment-timezone';

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
  }
};

export default userController;

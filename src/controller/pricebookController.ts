import User from '../models/User';
import Pricebook from '../models/Pricebook';
import Payment from '../models/Payment';
import * as express from 'express';
import * as sequelize from 'sequelize';
import * as moment from 'moment-timezone';

const pricebookController = {
  getSinglePricebook: async (req: express.Request, res: express.Response) => {
    try {
      interface participant {
        id: number;
        bossId: number;
        participantId: number;
        isIn: boolean;
        isPayed: boolean;
        phone?: string;
      }
      let paymentObj: participant[] = [];
      const user = await User.findOne({
        raw: true,
        where: { email: req.body.email }
      });

      if (!user) {
        res.status(400).send({ msg: 'NoUser' });
        return;
      }

      const pricebook = await Pricebook.findOne({
        raw: true,
        where: { id: req.body.pricebookId }
      });

      if (!pricebook) {
        res.status(400).send({ msg: 'NoPricebook' });
        return;
      }

      const payment = await Payment.findAll({
        raw: true,
        attributes: ['id', 'bossId', 'participantId', 'isIn', 'isPayed'],
        where: {
          pricebookId: req.body.pricebookId,
          [sequelize.Op.or]: [{ bossId: user.id }, { participantId: user.id }]
        }
      });

      paymentObj = [...payment];

      for (let i = 0; i < paymentObj.length; i++) {
        const participant = await User.findOne({
          raw: true,
          where: { id: payment[i].participantId }
        });

        paymentObj[i].phone = participant.phone;
      }

      const result = {
        boss: req.body.boss,
        pricebook: {
          ...pricebook,
          creationDate: moment(pricebook.creationDate)
            .tz('Asia/Seoul')
            .format(),
          updatedOn: moment(pricebook.updatedOn)
            .tz('Asia/Seoul')
            .format()
        },
        paymentObj
      };

      res.send(result);
    } catch (err) {
      res.status(400).send({ msg: err.name });
    }
  },
  completePricebook: async (req: express.Request, res: express.Response) => {
    try {
      const payments = await Payment.findAll({
        raw: true,
        where: { pricebookId: req.body.pricebookId }
      });

      if (payments.length === 0) {
        res.status(400).send({ msg: 'NoPricebook' });
        return;
      }

      for (let i = 0; i < payments.length; i++) {
        if (!payments[i].isPayed) {
          res
            .status(400)
            .send({ msg: `not payed at payment ${payments[i].id}` });
          return;
        }
      }

      await Pricebook.update(
        { transCompleted: true },
        { where: { id: req.body.pricebookId } }
      );

      res.sendStatus(200);
    } catch (error) {
      res.status(400).send({ msg: error });
    }
  }
};

export default pricebookController;

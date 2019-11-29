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
        demandCnt: number;
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
        attributes: [
          'id',
          'bossId',
          'participantId',
          'isIn',
          'isPayed',
          'demandCnt'
        ],
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
  }
};

export default pricebookController;

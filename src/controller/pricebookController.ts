import User from '../models/User';
import Pricebook from '../models/Pricebook';
import Payment from '../models/Payment';
import * as express from 'express';
import * as sequelize from 'sequelize';
import * as moment from 'moment-timezone';

const pricebookController = {
  getSinglePricebook: async (req: express.Request, res: express.Response) => {
    try {
      const user = await User.findOne({
        raw: true,
        where: { email: req.body.email }
      });

      const pricebook = await Pricebook.findOne({
        raw: true,
        where: { id: req.body.pricebookId }
      });

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
        payment
      };

      res.send(result);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  }
};

export default pricebookController;

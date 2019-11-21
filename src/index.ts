import 'source-map-support/register';
import * as express from 'express';
import { app } from './app';
import { sequelizeConfig } from './sequelizeConfig';
import User from './models/User';
import Pricebook from './models/Pricebook';
import Transaction from './models/Transaction';

const seed = async () => {
  await User.bulkCreate([
    {
      email: '1@mail.com',
      phone: '123',
      avatar: 'url'
    },
    {
      email: '2@mail.com',
      phone: '1235',
      avatar: 'url'
    },
    {
      email: '3@mail.com',
      phone: '1233',
      avatar: 'url'
    }
  ]);
  await Pricebook.create({
    totalPrice: 30000,
    transCompleted: false,
    count: 3
  });
  await Transaction.bulkCreate([
    {
      bossId: 1,
      participantId: 2,
      pricebookId: 1,
      isIn: true,
      isPayed: true,
      demandCnt: 0
    },
    {
      bossId: 1,
      participantId: 3,
      pricebookId: 1,
      isIn: true,
      isPayed: false,
      demandCnt: 0
    }
  ]);
};

(async () => {
  try {
    await sequelizeConfig.sync({ force: true });
    await seed();
    await app.listen(5000, () => console.log('server is listening..'));
  } catch (error) {
    console.log('Err', error);
  }
})();

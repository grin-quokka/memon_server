import { Sequelize } from 'sequelize-typescript';

export const sequelizeConfig = new Sequelize({
  database: 'memondb',
  dialect: 'postgres',
  username: 'postgres',
  password: '1234',
  storage: ':memory:',
  models: [__dirname + '/models']
});

import { Sequelize } from 'sequelize-typescript';
require('dotenv').config();

export const sequelizeConfig = new Sequelize({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_DB,
  dialect: 'postgres',
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  models: [__dirname + '/models']
});

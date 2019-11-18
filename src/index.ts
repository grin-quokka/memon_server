import 'source-map-support/register';
import * as express from 'express';
import { app } from './app';
import { sequelizeConfig } from './sequelizeConfig';

(async () => {
  await sequelizeConfig.sync({ force: true });

  app.listen(3000, () => console.log('http://localhost:3000'));
})();

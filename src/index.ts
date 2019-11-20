import 'source-map-support/register';
import * as express from 'express';
import { app } from './app';
import { sequelizeConfig } from './sequelizeConfig';

(async () => {
  try {
    await sequelizeConfig.sync({ force: true });
    app.listen(5000, () => console.log('server is listening..'));
  } catch (error) {
    console.log('Err', error);
  }
})();

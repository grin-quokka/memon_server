"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
require('dotenv').config();
exports.sequelizeConfig = new sequelize_typescript_1.Sequelize({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_DB,
    dialect: 'postgres',
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    models: [__dirname + '/models'],
    timezone: '+09:00',
    dialectOptions: {
        useUTC: false,
        charset: 'utf8',
        dateStrings: true,
        typeCast: true
    }
});
//# sourceMappingURL=sequelizeConfig.js.map
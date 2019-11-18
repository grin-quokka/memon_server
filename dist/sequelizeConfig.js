"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
exports.sequelizeConfig = new sequelize_typescript_1.Sequelize({
    database: 'memondb',
    dialect: 'postgres',
    username: 'postgres',
    password: '1234',
    storage: ':memory:',
    models: [__dirname + '/models']
});
//# sourceMappingURL=sequelizeConfig.js.map
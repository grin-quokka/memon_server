"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const app_1 = require("./app");
const sequelizeConfig_1 = require("./sequelizeConfig");
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelizeConfig_1.sequelizeConfig.sync();
        app_1.app.listen(5000, () => console.log('server is listening..'));
    }
    catch (error) {
        console.log('Err', error);
    }
}))();
//# sourceMappingURL=index.js.map
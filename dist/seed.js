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
const User_1 = require("./models/User");
const Pricebook_1 = require("./models/Pricebook");
const Payment_1 = require("./models/Payment");
const moment_1 = require("moment");
const seed = () => __awaiter(void 0, void 0, void 0, function* () {
    yield User_1.default.bulkCreate([
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
    yield Pricebook_1.default.create({
        totalPrice: 30000,
        transCompleted: false,
        count: 3,
        partyDate: moment_1.now(),
        title: '마라샹궈'
    });
    yield Payment_1.default.bulkCreate([
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
});
exports.default = seed;
//# sourceMappingURL=seed.js.map
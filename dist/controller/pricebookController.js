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
const User_1 = require("../models/User");
const Pricebook_1 = require("../models/Pricebook");
const Payment_1 = require("../models/Payment");
const sequelize = require("sequelize");
const moment = require("moment-timezone");
const pricebookController = {
    getSinglePricebook: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let paymentObj = [];
            const user = yield User_1.default.findOne({
                raw: true,
                where: { email: req.body.email }
            });
            if (!user) {
                res.status(400).send({ msg: 'NoUser' });
                return;
            }
            const pricebook = yield Pricebook_1.default.findOne({
                raw: true,
                where: { id: req.body.pricebookId }
            });
            if (!pricebook) {
                res.status(400).send({ msg: 'NoPricebook' });
                return;
            }
            const payment = yield Payment_1.default.findAll({
                raw: true,
                attributes: ['id', 'bossId', 'participantId', 'isIn', 'isPayed'],
                where: {
                    pricebookId: req.body.pricebookId,
                    [sequelize.Op.or]: [{ bossId: user.id }, { participantId: user.id }]
                }
            });
            paymentObj = [...payment];
            for (let i = 0; i < paymentObj.length; i++) {
                const participant = yield User_1.default.findOne({
                    raw: true,
                    where: { id: payment[i].participantId }
                });
                paymentObj[i].phone = participant.phone;
            }
            const result = {
                boss: req.body.boss,
                pricebook: Object.assign(Object.assign({}, pricebook), { creationDate: moment(pricebook.creationDate)
                        .tz('Asia/Seoul')
                        .format(), updatedOn: moment(pricebook.updatedOn)
                        .tz('Asia/Seoul')
                        .format() }),
                paymentObj
            };
            res.send(result);
        }
        catch (err) {
            res.status(400).send({ msg: err.name });
        }
    }),
    completePricebook: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payments = yield Payment_1.default.findAll({
                raw: true,
                where: { pricebookId: req.body.pricebookId }
            });
            if (payments.length === 0) {
                res.status(400).send({ msg: 'NoPricebook' });
                return;
            }
            for (let i = 0; i < payments.length; i++) {
                if (!payments[i].isPayed) {
                    res
                        .status(400)
                        .send({ msg: `not payed at payment ${payments[i].id}` });
                    return;
                }
            }
            yield Pricebook_1.default.update({ transCompleted: true }, { where: { id: req.body.pricebookId } });
            res.sendStatus(200);
        }
        catch (error) {
            res.status(400).send({ msg: error });
        }
    })
};
exports.default = pricebookController;
//# sourceMappingURL=pricebookController.js.map
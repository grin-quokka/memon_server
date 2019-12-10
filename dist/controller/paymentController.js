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
const sequelizeConfig_1 = require("../sequelizeConfig");
const paymentController = {
    sortByPartyDate: (allPaymentArr) => {
        return allPaymentArr.sort((a, b) => {
            return new Date(b.partyDate).getTime() - new Date(a.partyDate).getTime();
        });
    },
    getAllPayment: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = [];
            const pricebookCnt = {};
            const user = yield User_1.default.findOne({
                raw: true,
                where: { email: req.body.email }
            });
            if (!user) {
                res.status(400).send({ msg: 'NoUser' });
                return;
            }
            const bossPayment = yield Payment_1.default.findAll({
                raw: true,
                where: {
                    bossId: user.id
                }
            });
            const participantPayment = yield Payment_1.default.findAll({
                raw: true,
                where: {
                    participantId: user.id
                }
            });
            for (let i = 0; i < bossPayment.length; i++) {
                if (pricebookCnt.hasOwnProperty(bossPayment[i].pricebookId)) {
                    if (!bossPayment[i].isPayed) {
                        pricebookCnt[bossPayment[i].pricebookId]++;
                    }
                }
                else {
                    bossPayment[i].isPayed
                        ? (pricebookCnt[bossPayment[i].pricebookId] = 0)
                        : (pricebookCnt[bossPayment[i].pricebookId] = 1);
                }
            }
            const pricebookCntKeys = Object.keys(pricebookCnt);
            for (let i = 0; i < pricebookCntKeys.length; i++) {
                const getPrice = yield Pricebook_1.default.findOne({
                    raw: true,
                    where: { id: Number(pricebookCntKeys[i]) }
                });
                result.push({
                    boss: true,
                    pricebookId: getPrice.id,
                    partyDate: getPrice.partyDate,
                    title: getPrice.title,
                    price: (getPrice.fixedTotalPrice / getPrice.count) *
                        pricebookCnt[pricebookCntKeys[i]],
                    transCompleted: getPrice.transCompleted
                });
            }
            for (let i = 0; i < participantPayment.length; i++) {
                const getPrice = yield Pricebook_1.default.findOne({
                    raw: true,
                    where: { id: participantPayment[i].pricebookId }
                });
                result.push({
                    boss: false,
                    pricebookId: getPrice.id,
                    partyDate: getPrice.partyDate,
                    title: getPrice.title,
                    price: getPrice.fixedTotalPrice / getPrice.count,
                    isPayed: participantPayment[i].isPayed,
                    transCompleted: getPrice.transCompleted
                });
            }
            res.send(paymentController.sortByPartyDate(result));
        }
        catch (err) {
            res.status(400).send({ msg: err.name });
        }
    }),
    createPayment: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let pricebookId;
            const user = yield User_1.default.findOne({
                raw: true,
                where: { email: req.body.email }
            });
            if (!user) {
                res.status(400).send({ msg: 'NoUser' });
                return;
            }
            sequelizeConfig_1.sequelizeConfig
                .transaction(t => {
                return Pricebook_1.default.create(Object.assign({}, req.body.priceBook), { transaction: t }).then(pricebook => {
                    pricebookId = pricebook.id;
                    const promises = [];
                    for (let i = 0; i < req.body.participant.length; i++) {
                        const newPromise = Payment_1.default.create({
                            bossId: user.id,
                            participantId: req.body.participant[i].id,
                            pricebookId: pricebook.id,
                            isIn: req.body.participant[i].isIn,
                            isPayed: false
                        }, { transaction: t });
                        promises.push(newPromise);
                    }
                    return Promise.all(promises);
                });
            })
                .then(result => {
                res.send({ pricebookId });
            })
                .catch(err => {
                res.status(400).send({ msg: err.name });
            });
        }
        catch (err) {
            res.status(400).send({ msg: err.name });
        }
    }),
    confirmPayment: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            for (let i = 0; i < req.body.paymentId.length; i++) {
                const checkedPayment = yield Payment_1.default.findOne({
                    where: req.body.paymentId[i]
                });
                if (!checkedPayment) {
                    res
                        .status(400)
                        .send({ msg: `NoPayment at ${req.body.paymentId[i]}` });
                    return;
                }
            }
            sequelizeConfig_1.sequelizeConfig
                .transaction(t => {
                const promises = [];
                for (let i = 0; i < req.body.paymentId.length; i++) {
                    const newPromise = Payment_1.default.update({ isPayed: true }, { where: { id: req.body.paymentId[i] }, transaction: t });
                    promises.push(newPromise);
                }
                return Promise.all(promises);
            })
                .then(result => {
                res.sendStatus(200);
            })
                .catch(err => {
                res.status(400).send({ msg: err });
            });
        }
        catch (err) {
            res.status(400).send({ msg: err });
        }
    })
};
exports.default = paymentController;
//# sourceMappingURL=paymentController.js.map
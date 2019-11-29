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
                    price: (getPrice.totalPrice / getPrice.count) *
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
                    price: getPrice.totalPrice / getPrice.count,
                    isPayed: participantPayment[i].isPayed,
                    transCompleted: getPrice.transCompleted
                });
            }
            res.send(paymentController.sortByPartyDate(result));
        }
        catch (err) {
            console.log(err);
            res.sendStatus(400);
        }
    }),
    createPayment: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const pricebook = yield Pricebook_1.default.create(req.body.priceBook);
            const user = yield User_1.default.findOne({
                raw: true,
                where: { email: req.body.email }
            });
            for (let i = 0; i < req.body.participant.length; i++) {
                yield Payment_1.default.create({
                    bossId: user.id,
                    participantId: req.body.participant[i].id,
                    pricebookId: pricebook.id,
                    isIn: req.body.participant[i].isIn,
                    isPayed: false,
                    demandCnt: 0
                });
            }
            res.send({ pricebookId: pricebook.id });
        }
        catch (err) {
            console.log(err);
            res.sendStatus(400);
        }
    })
};
exports.default = paymentController;
//# sourceMappingURL=paymentController.js.map
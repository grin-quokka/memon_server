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
const express = require("express");
const moment = require("moment-timezone");
const User_1 = require("./models/User");
const Pricebook_1 = require("./models/Pricebook");
const Payment_1 = require("./models/Payment");
const seed_1 = require("./seed");
const sequelize = require("sequelize");
exports.app = express();
exports.app.use(express.json());
exports.app.get('/', (req, res) => {
    res.send('Hello MEMON :x');
});
exports.app.post('/main', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sum = {
            moneyToPay: 0,
            moneyToGet: 0
        };
        const email = req.body.email;
        const prkey = yield User_1.default.findOne({
            attributes: ['id'],
            where: {
                email
            }
        });
        const payment = yield Payment_1.default.findAll({
            attributes: ['pricebookId'],
            where: {
                participantId: prkey.id,
                isPayed: false
            }
        });
        if (payment.length > 0) {
            for (let i = 0; i < payment.length; i++) {
                const pricebook = yield Pricebook_1.default.findOne({
                    raw: true,
                    where: { id: payment[i].pricebookId, transCompleted: false }
                });
                sum.moneyToPay += pricebook.totalPrice / pricebook.count;
            }
        }
        const bossPayment = yield Payment_1.default.findAll({
            raw: true,
            where: { bossId: prkey.id, isPayed: false }
        });
        if (bossPayment.length > 0) {
            const pricebookCnt = {};
            for (let i = 0; i < bossPayment.length; i++) {
                if (pricebookCnt.hasOwnProperty(bossPayment[i].pricebookId)) {
                    pricebookCnt[bossPayment[i].pricebookId]++;
                }
                else {
                    pricebookCnt[bossPayment[i].pricebookId] = 1;
                }
            }
            const pricebookCntKeys = Object.keys(pricebookCnt);
            for (let i = 0; i < pricebookCntKeys.length; i++) {
                const getPrice = yield Pricebook_1.default.findOne({
                    raw: true,
                    where: { id: Number(pricebookCntKeys[i]) }
                });
                sum.moneyToGet +=
                    (getPrice.totalPrice / getPrice.count) *
                        pricebookCnt[pricebookCntKeys[i]];
            }
        }
        res.send(sum);
    }
    catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
}));
exports.app.get('/login', (req, res) => {
    // tokenToUid(idToken);
    res.send('완료');
});
exports.app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield User_1.default.create(req.body);
        const stringi = JSON.stringify(user);
        const pars = JSON.parse(stringi);
        let change = Object.assign(Object.assign({}, pars), { creationDate: moment(user.creationDate)
                .tz('Asia/Seoul')
                .format(), updatedOn: moment(user.updatedOn)
                .tz('Asia/Seoul')
                .format() });
        res.status(201).json(change);
    }
    catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
}));
exports.app.post('/users/email', (req, res) => {
    try {
        User_1.default.findOne({ where: req.body }).then(user => {
            console.log(user);
            user
                ? res.status(200).json({ result: true })
                : res.status(200).json({ result: false });
        });
    }
    catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
});
// only for test
exports.app.get('/seed', (req, res) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield seed_1.default();
            res.sendStatus(200);
        }
        catch (error) {
            console.log('Err', error);
            res.sendStatus(400);
        }
    }))();
});
// only for test
exports.app.delete('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = yield User_1.default.findOne({ where: req.body });
        const pricebookId = yield Payment_1.default.findAll({
            raw: true,
            where: {
                [sequelize.Op.or]: [{ bossId: userId.id }, { participantId: userId.id }]
            }
        });
        pricebookId.forEach(ele => {
            Pricebook_1.default.destroy({
                where: { id: ele.pricebookId }
            });
        });
        yield User_1.default.destroy({ where: { id: userId.id } });
        res.sendStatus(200);
    }
    catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
}));
exports.app.post('/users/contacts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = [];
        for (let i = 0; i < req.body.length; i++) {
            const user = yield User_1.default.findOne({
                raw: true,
                where: { phone: req.body[i].phone }
            });
            result.push({ name: req.body[i].name, phone: user.phone, id: user.id });
        }
        res.send(result);
    }
    catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
}));
exports.app.post('/payment', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pricebook = yield Pricebook_1.default.create(req.body.priceBook);
        const user = yield User_1.default.findOne({
            raw: true,
            where: { email: req.body.email }
        });
        yield req.body.participant.forEach(ele => {
            Payment_1.default.create({
                bossId: user.id,
                participantId: ele.id,
                pricebookId: pricebook.id,
                isIn: ele.isIn,
                isPayed: false,
                demandCnt: 0
            });
        });
        res.send({ pricebookId: pricebook.id });
    }
    catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
}));
exports.app.post('/payment/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = [];
        const user = yield User_1.default.findOne({
            raw: true,
            where: { email: req.body.email }
        });
        const payment = yield Payment_1.default.findAll({
            raw: true,
            where: {
                [sequelize.Op.or]: [{ bossId: user.id }, { participantId: user.id }]
            }
        });
        if (payment.length > 0) {
            for (let i = 0; i < payment.length; i++) {
                const pricebook = yield Pricebook_1.default.findOne({
                    raw: true,
                    where: { id: payment[i].pricebookId }
                });
                result.push({ payment: payment[i], pricebook: pricebook });
            }
        }
        res.send(result.reverse());
    }
    catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
}));
//# sourceMappingURL=app.js.map
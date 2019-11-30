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
const pricebookController_1 = require("./controller/pricebookController");
const paymentController_1 = require("./controller/paymentController");
const userController_1 = require("./controller/userController");
const User_1 = require("./models/User");
const Pricebook_1 = require("./models/Pricebook");
const Payment_1 = require("./models/Payment");
const seed_1 = require("./seed");
const sequelize = require("sequelize");
const router = express.Router();
router.get('/', (req, res) => {
    res.send('Hello MEMON :x');
});
router.post('/main', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sum = {
            avatar: '',
            moneyToPay: 0,
            moneyToGet: 0
        };
        const email = req.body.email;
        const prkey = yield User_1.default.findOne({
            where: {
                email
            }
        });
        sum.avatar = prkey.avatar;
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
                sum.moneyToPay += pricebook.fixedTotalPrice / pricebook.count;
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
                    (getPrice.fixedTotalPrice / getPrice.count) *
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
router.get('/login', (req, res) => {
    // tokenToUid(idToken);
    res.send('완료');
});
router.post('/pricebook', pricebookController_1.default.getSinglePricebook);
router.patch('/pricebook/transCompleted', pricebookController_1.default.completePricebook);
router.post('/payment/all', paymentController_1.default.getAllPayment);
router.post('/payment', paymentController_1.default.createPayment);
router.patch('/payment/ispayed', paymentController_1.default.confirmPayment);
router.post('/users/signup', userController_1.default.signup);
router.post('/users/contacts', userController_1.default.checkUserByContacts);
router.post('/users/email', userController_1.default.checkUserByEmail);
router.post('/users/pushtoken', userController_1.default.sendPushToken);
// only for test
router.get('/seed', (req, res) => {
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
router.delete('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.default = router;
//# sourceMappingURL=router.js.map
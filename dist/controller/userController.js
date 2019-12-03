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
const Payment_1 = require("../models/Payment");
const moment = require("moment-timezone");
const expo_server_sdk_1 = require("expo-server-sdk");
const Pricebook_1 = require("../models/Pricebook");
const userController = {
    signup: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let user = yield User_1.default.create(req.body);
            const stringi = JSON.stringify(user);
            const pars = JSON.parse(stringi);
            let change = Object.assign(Object.assign({}, pars), { creationDate: moment(user.creationDate)
                    .tz('Asia/Seoul')
                    .format(), updatedOn: moment(user.updatedOn)
                    .tz('Asia/Seoul')
                    .format() });
            res.status(201).send(change);
        }
        catch (err) {
            res.status(400).send({ msg: err.name });
        }
    }),
    checkUserByEmail: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield User_1.default.findOne({ where: req.body });
            user
                ? res.status(200).json({ result: true })
                : res.status(200).json({ result: false });
        }
        catch (err) {
            res.status(400).send({ msg: err.name });
        }
    }),
    checkUserByContacts: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = [];
            for (let i = 0; i < req.body.length; i++) {
                const user = yield User_1.default.findOne({
                    raw: true,
                    where: { phone: req.body[i].phone }
                });
                if (user) {
                    result.push({
                        name: req.body[i].name,
                        phone: user.phone,
                        id: user.id
                    });
                }
            }
            res.send(result);
        }
        catch (err) {
            res.status(400).send({ msg: err.name });
        }
    }),
    // tslint:disable-next-line: max-func-body-length
    sendPushToken: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let expo = new expo_server_sdk_1.default();
            let messages = [];
            let demandPayments;
            if (req.body.target === 'boss') {
                const payment = yield Payment_1.default.findOne({
                    where: { pricebookId: req.body.pricebookId }
                });
                if (!payment) {
                    res.status(400).send({ msg: 'NoPayment' });
                    return;
                }
                const user = yield User_1.default.findOne({
                    where: { id: payment.bossId }
                });
                if (!expo_server_sdk_1.default.isExpoPushToken(user.pushtoken)) {
                    res.status(400).send({
                        msg: `[${user}]'s Push token ${user.pushtoken} is not a valid Expo push token`
                    });
                    return;
                }
                messages.push({
                    to: user.pushtoken,
                    sound: 'default',
                    title: req.body.title,
                    body: req.body.msg
                });
            }
            else if (req.body.target === 'participant') {
                for (let i = 0; i < req.body.participant.length; i++) {
                    const payment = yield Payment_1.default.findOne({
                        where: {
                            pricebookId: req.body.pricebookId,
                            participantId: req.body.participant[i]
                        }
                    });
                    if (!payment) {
                        res
                            .status(400)
                            .send({ msg: `NoPayment at ${req.body.participant[i]}` });
                        return;
                    }
                    const user = yield User_1.default.findOne({
                        where: { id: req.body.participant[i] }
                    });
                    if (!expo_server_sdk_1.default.isExpoPushToken(user.pushtoken)) {
                        res.status(400).send({
                            msg: `[${user}]'s Push token ${user.pushtoken} is not a valid Expo push token`
                        });
                        return;
                    }
                    messages.push({
                        to: user.pushtoken,
                        title: req.body.title,
                        body: req.body.msg
                    });
                }
            }
            else if (req.body.target === 'demand') {
                demandPayments = yield Payment_1.default.findAll({
                    where: { pricebookId: req.body.pricebookId, isPayed: false }
                });
                if (demandPayments.length === 0) {
                    res.status(400).send({ msg: `NoPayment` });
                    return;
                }
                for (let i = 0; i < demandPayments.length; i++) {
                    const user = yield User_1.default.findOne({
                        where: { id: demandPayments[i].participantId }
                    });
                    if (!expo_server_sdk_1.default.isExpoPushToken(user.pushtoken)) {
                        res.status(400).send({
                            msg: `[${user.id}]'s Push token ${user.pushtoken} is not a valid Expo push token`
                        });
                        return;
                    }
                    messages.push({
                        to: user.pushtoken,
                        title: req.body.title,
                        body: req.body.msg
                    });
                }
            }
            else {
                res.status(400).send({ msg: `NoTarget for ${req.body.target}` });
            }
            let chunks = expo.chunkPushNotifications(messages);
            (() => __awaiter(void 0, void 0, void 0, function* () {
                for (let chunk of chunks) {
                    try {
                        let ticketChunk = yield expo.sendPushNotificationsAsync(chunk);
                        if (ticketChunk[0].status === 'ok') {
                            if (req.body.target === 'boss') {
                                const sender = yield User_1.default.findOne({
                                    where: { email: req.body.email }
                                });
                                if (!sender) {
                                    res.status(400).send({ msg: 'NoEmail' });
                                }
                                const updatePayment = yield Payment_1.default.update({ noti: true }, {
                                    where: {
                                        participantId: sender.id,
                                        pricebookId: req.body.pricebookId
                                    }
                                });
                                if (updatePayment[0] === 0) {
                                    res.status(400).send({ msg: 'NotUpdated' });
                                    return;
                                }
                                else {
                                    res.sendStatus(200);
                                    return;
                                }
                            }
                            else if (req.body.target === 'demand') {
                                const pricebook = yield Pricebook_1.default.findOne({
                                    where: { id: req.body.pricebookId }
                                });
                                yield pricebook.increment('demandCnt');
                            }
                            res.sendStatus(200);
                        }
                    }
                    catch (error) {
                        res.status(400).send({ msg: error });
                    }
                }
            }))();
        }
        catch (error) {
            res.status(400).send({ msg: error });
        }
    })
};
exports.default = userController;
//# sourceMappingURL=userController.js.map
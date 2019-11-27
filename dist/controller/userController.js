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
const moment = require("moment-timezone");
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
            res.status(201).json(change);
        }
        catch (err) {
            console.log(err);
            res.sendStatus(400);
        }
    }),
    checkUserByEmail: (req, res) => {
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
    },
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
            console.log(err);
            res.sendStatus(400);
        }
    })
};
exports.default = userController;
//# sourceMappingURL=userController.js.map
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
const User_1 = require("./models/User");
exports.app = express();
exports.app.use(express.json());
exports.app.get('/', (req, res) => {
    res.send('Hello MEMON :x');
});
exports.app.get('/main', (req, res) => {
    const obj = {
        moneyToPay: 500,
        moneyToGet: 1000
    };
    res.send(obj);
});
exports.app.get('/login', (req, res) => {
    // tokenToUid(idToken);
    res.send('완료');
});
exports.app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.create(req.body);
        res.status(201).json(user);
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
//# sourceMappingURL=app.js.map
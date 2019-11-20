"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
exports.app = express();
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
//# sourceMappingURL=app.js.map
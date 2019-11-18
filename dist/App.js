"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
exports.app = express();
// enable corse for all origins
exports.app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Expose-Headers', 'x-total-count');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type,authorization');
    next();
});
//# sourceMappingURL=App.js.map
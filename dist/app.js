"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router_1 = require("./router");
exports.app = express();
exports.app.use(express.json());
exports.app.use('/', router_1.default);
//# sourceMappingURL=app.js.map
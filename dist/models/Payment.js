"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = require("./User");
const Pricebook_1 = require("./Pricebook");
let Payment = class Payment extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Payment.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.ForeignKey(() => User_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Payment.prototype, "bossId", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.ForeignKey(() => User_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Payment.prototype, "participantId", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.ForeignKey(() => Pricebook_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Payment.prototype, "pricebookId", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Payment.prototype, "isIn", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Payment.prototype, "isPayed", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Payment.prototype, "demandCnt", void 0);
__decorate([
    sequelize_typescript_1.Default(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Payment.prototype, "noti", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], Payment.prototype, "creationDate", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], Payment.prototype, "updatedOn", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => Pricebook_1.default, { onDelete: 'cascade' }),
    __metadata("design:type", Pricebook_1.default)
], Payment.prototype, "pricebook", void 0);
Payment = __decorate([
    sequelize_typescript_1.Table({
        timestamps: true,
        charset: 'utf8',
        collate: 'utf8_general_ci'
    })
], Payment);
exports.default = Payment;
//# sourceMappingURL=Payment.js.map
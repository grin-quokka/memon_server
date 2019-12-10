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
const Payment_1 = require("./Payment");
let Pricebook = class Pricebook extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Pricebook.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Pricebook.prototype, "totalPrice", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Pricebook.prototype, "fixedTotalPrice", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Pricebook.prototype, "transCompleted", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Pricebook.prototype, "billImgSrc", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Pricebook.prototype, "count", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column({ type: sequelize_typescript_1.DataType.DATEONLY }),
    __metadata("design:type", Date)
], Pricebook.prototype, "partyDate", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Pricebook.prototype, "title", void 0);
__decorate([
    sequelize_typescript_1.Default(0),
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Pricebook.prototype, "demandCnt", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], Pricebook.prototype, "creationDate", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], Pricebook.prototype, "updatedOn", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => Payment_1.default, { onDelete: 'cascade' }),
    __metadata("design:type", Array)
], Pricebook.prototype, "transactions", void 0);
Pricebook = __decorate([
    sequelize_typescript_1.Table({
        timestamps: true,
        charset: 'utf8',
        collate: 'utf8_general_ci'
    })
], Pricebook);
exports.default = Pricebook;
//# sourceMappingURL=Pricebook.js.map
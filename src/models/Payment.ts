import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  AllowNull,
  BelongsTo,
  Default
} from 'sequelize-typescript';
import User from './User';
import Pricebook from './Pricebook';

@Table({
  timestamps: true,
  charset: 'utf8',
  collate: 'utf8_general_ci'
})
export default class Payment extends Model<Payment> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column
  bossId!: number;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column
  participantId!: number;

  @AllowNull(false)
  @ForeignKey(() => Pricebook)
  @Column
  pricebookId!: number;

  @AllowNull(false)
  @Column
  isIn!: boolean;

  @AllowNull(false)
  @Column
  isPayed!: boolean;

  @AllowNull(false)
  @Column
  demandCnt!: number;

  @Default(false)
  @Column
  noti!: boolean;

  @CreatedAt
  @Column
  creationDate!: Date;

  @UpdatedAt
  @Column
  updatedOn!: Date;

  @BelongsTo(() => Pricebook, { onDelete: 'cascade' })
  pricebook: Pricebook;
}

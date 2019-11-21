import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AutoIncrement,
  ForeignKey
} from 'sequelize-typescript';
import User from './User';
import Pricebook from './Pricebook';

@Table({
  timestamps: true,
  charset: 'utf8',
  collate: 'utf8_general_ci'
})
export default class Transaction extends Model<Transaction> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @ForeignKey(() => User)
  @Column
  bossId!: number;

  @ForeignKey(() => User)
  @Column
  participantId!: number;

  @ForeignKey(() => Pricebook)
  @Column
  pricebookId!: number;

  @Column
  isIn!: boolean;

  @Column
  isPayed!: boolean;

  @Column
  demandCnt!: number;

  @CreatedAt
  @Column
  creationDate!: Date;

  @UpdatedAt
  @Column
  updatedOn!: Date;
}

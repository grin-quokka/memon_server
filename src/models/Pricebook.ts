import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AutoIncrement,
  HasMany
} from 'sequelize-typescript';
import Transaction from './Transaction';

@Table({
  timestamps: true,
  charset: 'utf8',
  collate: 'utf8_general_ci'
})
export default class Pricebook extends Model<Pricebook> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  totalPrice!: number;

  @Column
  transCompleted!: boolean;

  @Column
  billImgSrc?: string;

  @Column
  count!: number;

  @CreatedAt
  @Column
  creationDate!: Date;

  @UpdatedAt
  @Column
  updatedOn!: Date;

  @HasMany(() => Transaction)
  transactions: Transaction[];
}

import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AutoIncrement,
  HasMany,
  AllowNull,
  DataType
} from 'sequelize-typescript';
import Payment from './Payment';

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

  @AllowNull(false)
  @Column
  totalPrice!: number;

  @AllowNull(false)
  @Column
  transCompleted!: boolean;

  @Column
  billImgSrc?: string;

  @AllowNull(false)
  @Column
  count!: number;

  @AllowNull(false)
  @Column({ type: DataType.DATEONLY })
  partyDate!: Date;

  @AllowNull(false)
  @Column
  title!: string;

  @CreatedAt
  @Column
  creationDate!: Date;

  @UpdatedAt
  @Column
  updatedOn!: Date;

  @HasMany(() => Payment, { onDelete: 'cascade' })
  transactions: Payment[];
}

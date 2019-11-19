import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  Unique,
  PrimaryKey,
  AutoIncrement,
  HasMany
} from 'sequelize-typescript';
import Transaction from './Transaction';

@Table({
  timestamps: true
})
export default class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Unique
  @Column
  loginId!: string;

  @Column
  phone!: string;

  @Column
  avatar!: string;

  @CreatedAt
  @Column
  creationDate!: Date;

  @UpdatedAt
  @Column
  updatedOn!: Date;

  @HasMany(() => Transaction)
  transactions: Transaction[];
}

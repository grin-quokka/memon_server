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
  timestamps: true,
  charset: 'utf8',
  collate: 'utf8_general_ci'
})
export default class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Unique
  @Column
  email!: string;

  @Unique
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

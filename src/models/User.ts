import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  Unique,
  PrimaryKey,
  AutoIncrement,
  HasMany,
  AllowNull
} from 'sequelize-typescript';
import Payment from './Payment';

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

  @AllowNull(false)
  @Unique
  @Column
  email!: string;

  @AllowNull(false)
  @Unique
  @Column
  phone!: string;

  @AllowNull(false)
  @Column
  avatar!: string;

  @AllowNull(false)
  @Column
  pushtoken!: string;

  @CreatedAt
  @Column
  creationDate!: Date;

  @UpdatedAt
  @Column
  updatedOn!: Date;

  @HasMany(() => Payment, { onDelete: 'cascade' })
  payment: Payment[];
}

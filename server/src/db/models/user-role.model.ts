import {
  Model,
  BelongsTo,
  Column,
  ForeignKey,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Role } from "./role.model";
import { User } from "./user.model";

@Table({ tableName: "user_role", underscored: true })
class UserRole extends Model {
  @ForeignKey(() => User)
  @PrimaryKey
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @ForeignKey(() => Role)
  @PrimaryKey
  @Column
  roleId!: number;

  @BelongsTo(() => Role)
  role!: Role;
}

export { UserRole };
